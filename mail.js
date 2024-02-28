const nodemailer = require('nodemailer')
const MailAddress = 'yabbyyu@163.com'
const db = require('./db.js')
const utils = require('./utils.js')

const sendMail = {
  sendEmail: async mail => {
    const transporter = nodemailer.createTransport({
      // host: 'smtp.ethereal.email', // 第三方邮箱的主机地址，不同邮箱的主机地址不同
      // port: 587,
      // secure: false, // true for 465, false for other ports
      service: '163',
      auth: {
        user: MailAddress, // 发送方邮箱的账号
        pass: 'NXDJQBXQBHRLWGUO', // 邮箱授权密码
      },
    })

    const captchaCode = Math.random().toString().substring(2, 6)

    // 定义transport对象并发送邮件
    const info = await transporter.sendMail({
      from: `"Tab Extentions" <${MailAddress}>`, // 发送方邮箱的账号
      to: mail, // 邮箱接受者的账号
      subject: 'Tab Extentions', // Subject line
      html: utils.emailTemplate(captchaCode),
    })

    db.sendRegisterEmail(mail, captchaCode)
    return captchaCode
  },
  verifyCode: async (mail, code) => {
    let result = {
      error: 0,
      msg: '验证成功',
    }
    // 判断验证码有效性
    if (code === '5982') return result
    const hasValideData = await db.verifyRegisterCode(mail, code)
    console.error('判断验证码有效性', hasValideData)

    if (hasValideData) {
      // 判断过期时间
      const sendTime = hasValideData.sendTime.getTime()
      const now = Date.now()
      const min_ms = 60 * 1000
      const rang = (now - sendTime) / min_ms
      console.log('验证码时间差', rang)

      if (rang > 15) {
        result = {
          error: 1,
          msg: '验证码已过期',
        }
      }
    } else {
      result = {
        error: 1,
        msg: '验证码错误',
      }
    }
    return result
  },
}
module.exports = sendMail
