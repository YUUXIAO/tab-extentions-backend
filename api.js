const express = require('express')
const cors = require('cors')
const router = require('./router')
const jwt = require('./auth')
// const mongo = require('./mongo.js')
// const sendMailObj = require('./mail.js')
// const dbOperations = require('./db.js')

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

const service = require('./index.js')

// 获取用户信息
app.get('/userinfo', jwt.verify, (req, res) => {
  service.getUserInfo(req, res)
})

// 发送验证码
app.get('/sendMail', (req, res) => {
  service.sendMailCode(req, res)
})

// d登录
app.post('/login', (req, res) => {
  service.createUser(req, res)
})

// 创建标签组
app.post('/createTag', jwt.verify, (req, res) => {
  service.createUrlTag(req, res)
})

// 查询标签
app.get('/createTag', jwt.verify, (req, res) => {
  service.getUrlTag(req, res)
})

// 收藏/取消收藏url
app.get('/favor', jwt.verify, (req, res) => {
  service.addFavorUrl(req, res)
})

// 插入稍后再看
app.post('/later', jwt.verify, (req, res) => {
  service.setLater(req, res)
})
app.get('/later', jwt.verify, (req, res) => {
  service.getLater(req, res)
})
app.put('/later', jwt.verify, (req, res) => {
  service.updateLater(req, res)
})
app.delete('/later', jwt.verify, (req, res) => {
  service.deleteLater(req, res)
})

app.listen(3000, () => {
  console.log('Server started on port 3000')
})
