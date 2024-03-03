const jwt = require('./auth.js')
const sendMailObj = require('./mail.js')
const dbOperations = require('./db.js')

// 获取用户信息
const getUserInfo = async (req, res) => {
  const data = await dbOperations.findUserInfo(req._id)
  const { token, loginTime, ...otherData } = data
  const laterData = await dbOperations.findUserLater(req._id)
  const todoData = await dbOperations.findUserTodoKeys(req._id)
  let laterCount = 0
  let todoCount = 0
  if (laterData?.length) {
    laterCount = laterData.filter(i => i.status === 0)?.length || 0
  }
  if (todoData?.length) {
    todoCount = todoData.filter(i => i.status === 0)?.length || 0
  }
  return {
    userinfo: otherData,
    laterCount,
    todoCount,
  }
}

//获取验证码
const sendMailCode = async (req, res) => {
  const captchaCode = await sendMailObj.sendEmail(req.query.email)
  return {
    verifyCode: captchaCode,
  }
}

// 同步用户本地收藏、稍后再看、记事本
const updateLocal = async (req, userId) => {
  const { laterData, todoData, collectUrls } = req.body
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

  if (collectUrls?.length) {
    const userInfo = await dbOperations.findUserInfo(userId)
    const combine = Array.from(new Set([...(userInfo?.collectUrls || []), ...collectUrls]))
    dbOperations.updateUser(userId, { $set: { collectUrls: combine } })
  }
  if (todoData?.length) {
    const options = []
    todoData.forEach(ele => {
      const createObj = {
        userId,
        ...ele,
      }
      options.push(createObj)
    })
    dbOperations.insertTodoMany(options)
  }
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
  let token = jwt.sign(req.body) // 生成token
  const result = await dbOperations.findUserByMail(mail)
  if (result?._id) {
    userId = result._id
    updateLocal(req, userId)
    await dbOperations.updateUser(userId, { $set: { token } })
  } else {
    const verifyRes = await sendMailObj.verifyCode(mail, code)
    if (verifyRes.error === 1) {
      throw new Error(verifyRes.msg)
    }

    userInfo.token = token
    const result = await dbOperations.insertUser(userInfo)
    userId = result.insertedId.toHexString()
    updateLocal(req, result.insertedId)
  }
  return {
    token,
    userId,
  }
}

// 创建标签组
const createUrlTag = async (req, res) => {
  const { _id, body } = req
  let doc = {
    userId: _id,
    createTime: Date.now(),
    ...body,
  }
  const groups = await dbOperations.findUserTags(_id)
  const hasAleady = groups.find(i => i.name === body.name)
  if (hasAleady) {
    throw new Error('标签名重复')
  } else {
    await dbOperations.inserUserTag(doc)
    // mongodb.insertOne('url_tag', doc, () => {
    const result = [...groups, doc].map(i => {
      const { userId, _id, ...params } = i
      return { ...params }
    })
    return result
  }
}

// 查询用户标签
const getUrlTag = async (req, res) => {
  const groups = await dbOperations.findUserTags(req._id)
  const result = groups.map(i => {
    const { userId, ...params } = i
    return { ...params }
  })
  return result
}

// 处理收藏网址功能
const addFavorUrl = async (req, res) => {
  const { _id } = req
  const { url } = req.query
  const result = await dbOperations.findUserInfo(_id)
  const { collectUrls = [] } = result
  const index = collectUrls.indexOf(url)
  const hasfavor = index > -1
  if (hasfavor) {
    collectUrls.splice(index, 1)
  } else {
    collectUrls.push(url)
  }
  await dbOperations.updateUser(_id, { $set: { collectUrls } })
  return {
    msg: hasfavor ? '取消收藏' : '收藏成功',
    data: collectUrls,
  }
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
  return [...laterResults, createObj]
}

const getLater = async (req, res) => {
  const laterResults = (await dbOperations.findUserLater(req._id)) || []
  return laterResults
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
      return updateData
    }
  })
}
const deleteLater = async (req, res) => {
  const { _id } = req.query
  await dbOperations.deleteLater(_id)
  const updateData = await dbOperations.findUserLater(req._id)

  return updateData
}

// 关键词记事本
const setTodoKeys = async (req, res) => {
  const { _id, body } = req
  const todoKeysResults = (await dbOperations.findUserTodoKeys(_id)) || []
  const createObj = {
    userId: _id,
    createTime: Date.now(),
    status: 0,
    ...body,
  }
  console.error('createobj', createObj)
  await dbOperations.insertTodoKeys(createObj)

  return [...todoKeysResults, createObj]
}

const getTodoKeys = async (req, res) => {
  const todoKeysResults = (await dbOperations.findUserTodoKeys(req._id)) || []
  return todoKeysResults
}
const deleteTodoKeys = async (req, res) => {
  const { _id } = req.query
  await dbOperations.deleteTodoKeys(_id)
  const updateData = await dbOperations.findUserTodoKeys(req._id)

  return updateData
}

const updateTodoKeys = async (req, res) => {
  const todoKeysResults = (await dbOperations.findUserTodoKeys(req._id)) || []
  const { _id } = req.body
  todoKeysResults.forEach(async i => {
    if (i._id.toString() === _id) {
      const status = Number(!i?.status)
      await dbOperations.updateTodoKeys(i._id, { $set: { status } })
      const updateData = await dbOperations.findUserTodoKeys(req._id)
      return updateData
    }
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
  setTodoKeys,
  getTodoKeys,
  deleteTodoKeys,
  updateTodoKeys,
}
