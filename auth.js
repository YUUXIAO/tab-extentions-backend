const jsonwebtoken = require('jsonwebtoken')
const secretkey = 'yabbykey'
const dbOperations = require('./db.js')

// 生成 token
const sign = function (data = {}) {
  return jsonwebtoken.sign(data, secretkey, {
    expiresIn: 60 * 60 * 24 * 107,
  })
}

const verify = (req, res, next) => {
  let authorization = req.headers.authorization || ''
  let token = ''
  if (authorization.includes('Bearer')) {
    token = authorization.replace('Bearer ', '')
  } else {
    console.error('新用户')
    next()
  }
  jsonwebtoken.verify(token, secretkey, async (error, data) => {
    if (error) {
      res.status(403).send({ error: 1, data: '请先登录' })
    } else {
      console.error('verify拿到数据', data)
      const result = await dbOperations.findUserByMail(data.mail)
      if (!result) {
        res.status(401).send({ error: 1, data: '请先登录' })
        return
      }
      req._id = result._id
      console.error('verfity 根据用户名查到id', req._id)
      next()
    }
  })
}

module.exports = {
  sign,
  verify,
}
