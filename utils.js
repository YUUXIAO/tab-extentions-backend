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
<div>P.S. lf the code has expired or you closedthe activation page <a href="javascripts;">click here</a>.
</div>`
}

module.exports = {
  emailTemplate: emailTemplate,
}
