const express = require('express')
const cors = require('cors')
const router = require('./router')
const jwt = require('./auth')
const mongo = require('./mongo.js')
const sendMailObj = require('./mail.js')

const app = express()
const whiteList = ['http://127.0.0.1:4000/', 'http://127.0.0.1:5173/']

// import addHistory from './index.js'
// 默认情况下，Express 不解析 HTTP 请求体，但它有一个内置中间件，用解析的请求体填充 req.body 属性。例如，app.use(express.json()) 是告诉 express 为您自动解析 json 请求体的方式
app.use(cors())
app.use(function (req, res, next) {
  const domain = req.headers.referer
  console.error('q请求接口中间件', domain)
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')

  next()
})
app.use(express.json())
app.use('/', router)

const { addHistory, createUser, getUrlTag, addFavorUrl, createUrlTag } = require('./index.js')

// 获取用户信息
app.get('/userinfo', jwt.verify, async (req, res) => {
  console.error('获取用户信息', req._id)
  mongo.findOneById('user', req._id, data => {
    console.error('查询结果', data)
    const { token, password, loginTime, ...otherData } = data
    res.json({
      error: 0,
      data: otherData,
    })
  })
})

// 获取验证码
app.get('/sendMail', async (req, res) => {
  console.error('获取验证码', req.query)
  const captchaCode = sendMailObj.sendEmail(req.query.email)
  res.json({
    error: 0,
    data: {
      verifyCode: captchaCode,
    },
  })
})

// d登录
app.post('/login', async (req, res) => {
  console.error('登录1ß', req.body)
  // mongo.findOne('user',{ name: req.body.name }, (err, user)=>{
  const data = {
    mail: req.body.mail,
    loginTime: Date.now(),
    password: req.body.password,
    token: '',
  }
  let userId = ''
  const { mail, code } = req.body
  const token = jwt.sign(req.body) // 生成token
  // 查询用户
  mongo.findOne('user', { mail }, async function (result) {
    console.error('查询用户', result)
    if (result?._id) {
      console.log('已存在用户')
      userId = result._id
    } else {
      console.log('创建新用户')
      data.token = token
      const verifyRes = await sendMailObj.verifyCode(mail, code)
      console.error('res', verifyRes)
      if (verifyRes.error === 1) {
        res.json({
          error: 1,
          data: verifyRes.msg,
        })
        return
      }
      await mongo.insertOne('user', data, function (result) {
        console.error('创建新用户成功', result)
        userId = result.insertedId.toHexString()
      })
    }
    res.json({
      error: 0,
      data: '登录成功',
      token,
      userId,
    })
  })
})

// 创建标签组
app.post('/createTag', jwt.verify, (req, res) => {
  console.log('标签组222', req._id)

  createUrlTag(req.body, req._id, res)
})

// 查询标签
app.get('/createTag', jwt.verify, (req, res) => {
  getUrlTag(req._id, groups => {
    res.json({
      error: 0,
      data: groups,
      msg: '查询成功',
    })
  })
})

// 收藏/取消收藏url
app.get('/favor', jwt.verify, (req, res) => {
  const { url } = req.query
  addFavorUrl(req._id, url, res)
})

app.listen(3000, () => {
  console.log('Server started on port 3000')
})
