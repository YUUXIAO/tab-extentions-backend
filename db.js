const mongo = require('./mongo')

// 查询用户信息
const findUserInfo = userId => {
  return mongo.findOneById('user', userId)
}

// 更新用户
const updateUser = (userId, updateObj) => {
  return mongo.updateOne('user', { _id: userId }, updateObj)
}

// 查询用户标签组
const findUserTags = userId => {
  return mongo.findAll('url_tag', { userId })
}

// 查询用户信息-mail
const findUserByMail = mail => {
  return mongo.findOne('user', { mail })
}

// 插入一条用户信息
const insertUser = data => {
  return mongo.insertOne('user', data)
}

// 插入一条用户用户标签
const inserUserTag = data => {
  return mongo.insertOne('url_tag', data)
}

// 发送注册验证码
const sendRegisterEmail = (mail, captchaCode) => {
  const data = {
    mail,
    captchaCode,
    sendTime: new Date(),
  }
  return mongo.insertOne('send_mail', data)
}

// 校验登录验证码
const verifyRegisterCode = (mail, code) => {
  return mongo.findOne('send_mail', { mail: mail })
}

// 查询用户稍后再看
const findUserLater = userId => {
  return mongo.findAll('see_later', { userId })
}
// 插入一条稍后再看
const insertLater = data => {
  return mongo.insertOne('see_later', data)
}

// 插入一条稍后再看
const insertLaterMany = data => {
  return mongo.insertOne('see_later', data)
}
module.exports = {
  sendRegisterEmail,
  verifyRegisterCode,
  findUserLater,
  findUserByMail,
  findUserTags,
  inserUserTag,
  updateUser,
  insertLater,
  findUserInfo,
  insertUser,
  insertLaterMany,
}
