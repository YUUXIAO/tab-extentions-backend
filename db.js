const mongo = require('./mongo')

// 发送注册验证码
const sendRegisterEmail = (mail, captchaCode) => {
  const data = {
    mail,
    captchaCode,
    sendTime: new Date(),
  }
  // TODO 判断刷新的时候是更新
  mongo.insertOne('send_mail', data, () => {
    console.error('发送成功')
  })
}

// 校验登录验证码
const verifyRegisterCode = (mail, code) => {
  return new Promise((resolve, reject) => {
    mongo.findOne('send_mail', { mail: mail }, res => {
      resolve(res)
      console.error('校验登录验证码', res)
    })
  })
}

module.exports = {
  sendRegisterEmail,
  verifyRegisterCode,
}
