// const { MongoClient } = require("mongodb");  //导入依赖对象mongo客户端

// let url="mongodb://127.0.0.1:27017";  //数据库连接字符串
const jwt = require('./auth.js')
const mongodb = require('./mongo.js')
const { param } = require('./router.js')

// run().catch(console.log);
// 登录
const createUser = async data => {
  const userId = ''

  //
  // if (!userId) {
  //   // 创建新用户表
  //   mongodb.insertOne('user', data, function (result) {
  //     console.error(111, result)
  //     const _id = result.insertedId.toHexString()
  //     console.log('保存到登录信息', _id)
  //     return _id
  //   })
  // }
}

// 创建标签组
const createUrlTag = async (payload, id, res) => {
  let doc = {
    userId: id,
    createTime: Date.now(),
    ...payload,
  }
  mongodb.findAll('url_tag', { userId: id }, groups => {
    console.error('查询用户所有标签', groups)
    const hasAleady = groups.find(i => i.name === payload.name)

    if (hasAleady) {
      res.json({
        error: 1,
        data: null,
        msg: '标签名重复',
      })
    } else {
      mongodb.insertOne('url_tag', doc, () => {
        const result = [...groups, doc].map(i => {
          const { userId, _id, ...params } = i
          return { ...params }
        })
        res.json({
          error: 0,
          msg: '保存成功',
          data: result,
        })
      })
    }
  })
}

// 查询用户标签
const getUrlTag = async (id, cb) => {
  mongodb.findAll('url_tag', { userId: id }, groups => {
    console.error('查询用户所有标签', groups)
    const result = groups.map(i => {
      const { userId, ...params } = i
      return { ...params }
    })
    cb(result)
  })
}

// 处理收藏网址功能
const addFavorUrl = async (userId, url, res) => {
  mongodb.findOneById('user', userId, result => {
    console.error('查询到用户收藏网址结果', result)
    const { collectUrls = [] } = result
    const index = collectUrls.indexOf(url)
    const hasfavor = index > -1
    if (hasfavor) {
      collectUrls.splice(index, 1)
    } else {
      collectUrls.push(url)
    }
    mongodb.updateOne('user', { _id: userId }, { $set: { collectUrls } }, result => {
      console.error('更新收藏组成功', collectUrls)
      res.json({
        error: 0,
        msg: hasfavor ? '取消收藏' : '收藏成功',
        data: collectUrls,
      })
    })
  })
}

module.exports = {
  // addHistory:addHistory,

  getUrlTag,
  createUrlTag: createUrlTag,
  createUser,
  addFavorUrl,
}
