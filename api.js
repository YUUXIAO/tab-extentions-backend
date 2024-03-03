const express = require('express')
const cors = require('cors')
const router = require('./router')
const path = require('path')

const app = express()
// const whiteList = ['http://127.0.0.1:4000/', 'http://127.0.0.1:5173/']

// 默认情况下，Express 不解析 HTTP 请求体，但它有一个内置中间件，用解析的请求体填充 req.body 属性。例如，app.use(express.json()) 是告诉 express 为您自动解析 json 请求体的方式
app.use(cors())
app.use(function (req, res, next) {
  const domain = req.headers.referer
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})
app.use(express.json())
app.use('/', router) // // 注册路由模块
app.use('/static', express.static(path.join(__dirname, 'public'))) // 注册静态资源

app.listen(3000, () => {
  console.log('Server started on port 3000')
})
