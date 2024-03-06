const Config = require('./config.js')

const codeMaps = Object.freeze({
  OK: { code: 200, error: 0, msg: '成功' },
  ERR_AUTH: { code: 401, error: 1, msg: '权限校验失败' },
  ERR_AUTH2: { code: 403, error: 1, msg: '权限校验失败' },
  ERR_INTERNAL: { code: 500, error: 1, msg: '服务器错误' },
})

const build = (respCode, data = null) => {
  let { code, msg = 'ok', error = 0 } = respCode
  console.error('build', data)
  if (data?.msg) {
    msg = data.msg
    data = data?.data || null
  }
  return { code, msg, error, data: data }
}

// 发送验证码邮件模版
const emailTemplate = code => {
  return `<div>Welcome!</div>
<div>Thank you for joining my tabs extentions services!</div>
<div>To verify your account, please enter thecode below in the window where youstarted creating your account.
</div>
<br>
<h2>${code}</h2>
<br>
<div>Thanks again for signing up!
</div>
<div>P.S. lf you have any questions, please <a href="mailto:${Config.mailAddress}">click here</a>.
</div>`
}

module.exports = {
  codeMaps,
  build,
  emailTemplate: emailTemplate,
}
