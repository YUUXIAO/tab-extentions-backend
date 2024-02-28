// const { MongoClient } = require("mongodb");  //导入依赖对象mongo客户端

// let url="mongodb://127.0.0.1:27017";  //数据库连接字符串
const jwt = require('./auth.js')
const mongodb = require('./mongo.js')
const { param } = require('./router.js')
const sendMailObj = require('./mail.js')
const dbOperations = require('./db.js')

// 获取用户信息
const getUserInfo = async (req, res) => {
  const data = await dbOperations.findUserInfo(req._id)
  console.error('获取用户信息', data)
  const { token, loginTime, ...otherData } = data
  res.json({
    error: 0,
    data: otherData,
  })
}

//获取验证码
const sendMailCode = async (req, res) => {
  const captchaCode = sendMailObj.sendEmail(req.query.email)
  console.error('获取验证码', req.query)
  res.json({
    error: 0,
    data: {
      verifyCode: captchaCode,
    },
  })
}
// 登录
const createUser = async (req, res) => {
  const { mail, code, laterData } = req.body
  let userId = ''
  const userInfo = {
    mail: mail,
    loginTime: Date.now(),
    token: '',
  }
  const token = jwt.sign(req.body) // 生成token
  const result = await dbOperations.findUserByMail(mail)
  console.error('查询用户', result)
  if (result?._id) {
    console.log('已存在用户')
    userId = result._id
  } else {
    console.log('创建新用户')
    const verifyRes = await sendMailObj.verifyCode(mail, code)
    if (verifyRes.error === 1) {
      res.json({
        error: 1,
        data: verifyRes.msg,
      })
      return
    }

    userInfo.token = token
    const result = await dbOperations.insertUser(userInfo)

    console.error('创建新用户成功', result)
    userId = result.insertedId.toHexString()

    // 稍后再看
    if (laterData?.length) {
      const options = []
      laterData.forEach(ele => {
        const createObj = {
          userId,
          ...ele,
        }
        options.push(createObj)
      })
      dbOperations.insertLaterMany(options)
    }
  }
  res.json({
    error: 0,
    data: '登录成功',
    token,
    userId,
  })
}

// 创建标签组
const createUrlTag = async (req, res) => {
  const { _id } = req
  let doc = {
    userId: _id,
    createTime: Date.now(),
    ...payload,
  }
  const groups = await dbOperations.findUserTags(_id)
  const hasAleady = groups.find(i => i.name === payload.name)
  if (hasAleady) {
    res.json({
      error: 1,
      data: null,
      msg: '标签名重复',
    })
  } else {
    await dbOperations.inserUserTag(doc)
    // mongodb.insertOne('url_tag', doc, () => {
    const result = [...groups, doc].map(i => {
      const { userId, _id, ...params } = i
      return { ...params }
    })
    res.json({
      error: 0,
      msg: '保存成功',
      data: result,
    })
    // })
  }
}

// 查询用户标签
const getUrlTag = async (req, res) => {
  const groups = await dbOperations.findUserTags(req._id)
  console.error('查询用户所有标签', groups)
  const result = groups.map(i => {
    const { userId, ...params } = i
    return { ...params }
  })
  res.json({
    error: 0,
    data: result,
    msg: '查询成功',
  })
}

// 处理收藏网址功能
const addFavorUrl = async (req, res) => {
  const { _id } = req
  const { url } = req.query
  const result = await dbOperations.findUserInfo(_id)
  console.error('查询到用户收藏网址结果', result)
  const { collectUrls = [] } = result
  const index = collectUrls.indexOf(url)
  const hasfavor = index > -1
  if (hasfavor) {
    collectUrls.splice(index, 1)
  } else {
    collectUrls.push(url)
  }
  await dbOperations.updateUser(_id, { $set: { collectUrls } })
  res.json({
    error: 0,
    msg: hasfavor ? '取消收藏' : '收藏成功',
    data: collectUrls,
  })
}

// 稍后再看
const setLater = async (req, res) => {
  const { _id, body } = req
  const laterResults = (await dbOperations.findUserLater(_id)) || []
  const createObj = {
    userId: _id,
    createTime: Date.now(),
    status: 0,
    ...body,
  }
  await dbOperations.insertLater(createObj)
  res.json({
    error: 0,
    msg: '添加成功',
    data: [...laterResults, createObj],
  })
}

const getLater = async (req, res) => {
  const laterResults = (await dbOperations.findUserLater(req._id)) || []
  res.json({
    error: 0,
    msg: '查询成功',
    data: laterResults,
  })
}
// 更新稍后再看
const updateLater = async (req, res) => {
  const laterResults = (await dbOperations.findUserLater(req._id)) || []
  const { _id } = req.body
  laterResults.forEach(async i => {
    if (i._id.toString() === _id) {
      const status = Number(!i?.status)
      await dbOperations.updateLater(i._id, { $set: { status } })
      const updateData = await dbOperations.findUserLater(req._id)
      res.json({
        error: 0,
        msg: '更新成功',
        data: updateData,
      })
    }
  })
}
const deleteLater = async (req, res) => {
  console.error('删除数据', req)
  const { _id } = req.query
  await dbOperations.deleteLater(_id)
  const updateData = await dbOperations.findUserLater(req._id)
  res.json({
    error: 0,
    msg: '删除成功',
    data: updateData,
  })
}

module.exports = {
  getUserInfo,
  sendMailCode,
  getUrlTag,
  createUrlTag,
  createUser,
  setLater,
  getLater,
  addFavorUrl,
  updateLater,
  deleteLater,
}
