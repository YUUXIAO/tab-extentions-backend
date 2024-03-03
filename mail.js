const nodemailer = require('nodemailer')
const db = require('./db.js')
const utils = require('./utils.js')
const Config = require('./config.js')

const sendMail = {
  sendEmail: async mail => {
    const transporter = nodemailer.createTransport({
      service: '163',
      auth: {
        user: Config.mailAddress, // 发送方邮箱的账号
        pass: Config.mailPassword, // 邮箱授权密码
      },
    })

    const captchaCode = Math.random().toString().substring(2, 6)

    // 定义transport对象并发送邮件
    await transporter.sendMail({
      from: `"Tab Extentions" <${Config.mailAddress}>`, // 发送方邮箱的账号
      to: mail, // 邮箱接受者的账号
      subject: 'Tab Extentions', // Subject line
      html: utils.emailTemplate(captchaCode),
    })

    db.sendRegisterEmail(mail, captchaCode)
    return captchaCode
  },
  verifyCode: async (mail, code) => {
    if (!code) {
      return {
        error: 1,
        msg: '验证码错误',
      }
    }
    let result = {
      error: 0,
      msg: '验证成功',
    }
    // 判断验证码有效性
    if (code === Config.codeWhite) return result
    const hasValideData = await db.verifyRegisterCode(mail, code)

    if (hasValideData) {
      const sendTime = hasValideData.sendTime.getTime()
      const now = Date.now()
      const min_ms = 60 * 1000
      const rang = (now - sendTime) / min_ms

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
