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
    next()
  }
  jsonwebtoken.verify(token, secretkey, async (error, data) => {
    if (error) {
      res.status(403).send({ error: 1, msg: '请先登录', data: null })
    } else {
      try {
        const result = await dbOperations.findUserByMail(data.mail)
        if (!result) {
          res.status(401).send({ error: 1, msg: '请先登录', data: null })
          return
        }
        req._id = result._id
      } catch (error) {
        res.status(401).send({ error: 1, msg: '请先登录', data: null })
        return
      }

      next()
    }
  })
}

module.exports = {
  sign,
  verify,
}
