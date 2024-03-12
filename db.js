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
  return mongo.findAll('see_later', { userId: userId })
}
// 插入一条稍后再看
const insertLater = data => {
  return mongo.insertOne('see_later', data)
}

// 插入多条稍后再看
const insertLaterMany = data => {
  return mongo.insertMany('see_later', data)
}
// 更新稍后状态
const updateLater = (id, updateObj) => {
  return mongo.updateOneById('see_later', id, updateObj)
}
const deleteLater = id => {
  return mongo.deleteOneById('see_later', id)
}

// 关键词记事本
const insertTodoKeys = data => {
  return mongo.insertOne('todo_keys', data)
}
const findUserTodoKeys = userId => {
  return mongo.findAll('todo_keys', { userId: userId })
}
const insertTodoMany = data => {
  return mongo.insertMany('todo_keys', data)
}
const updateTodoKeys = (id, updateObj) => {
  return mongo.updateOneById('todo_keys', id, updateObj)
}
const deleteTodoKeys = id => {
  return mongo.deleteOneById('todo_keys', id)
}

module.exports = {
  insertTodoKeys,
  updateTodoKeys,
  findUserTodoKeys,
  deleteTodoKeys,
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
  insertTodoMany,
  deleteLater,
  insertLaterMany,
  updateLater,
}
