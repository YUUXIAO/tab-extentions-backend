const express = require('express')
const cors = require('cors')
const router = require('./router')
const jwt = require('./auth');
const mongo = require('./mongo.js')

const app = express()
const whiteList = ['http://127.0.0.1:4000/','http://127.0.0.1:5173/']

// import addHistory from './index.js'
// 默认情况下，Express 不解析 HTTP 请求体，但它有一个内置中间件，用解析的请求体填充 req.body 属性。例如，app.use(express.json()) 是告诉 express 为您自动解析 json 请求体的方式
app.use(cors())
app.use(function (req, res, next) {
  const domain = req.headers.referer
  console.error('q请求接口中间件', domain)
  whiteList.includes(domain) ? res.header('Access-Control-Allow-Origin', '*') : res.header('Access-Control-Allow-Origin', 'http://127.0.0.1')

  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')

  next()
})
app.use(express.json())
app.use('/', router)

const { addHistory,createUser, createUrlTag } = require('./index.js')

// d登录
app.post('/login', async (req,res)=>{
  console.error('登录1ß', req.body)
  const user = await mongo.findOne('user',{ name: req.body.name });
  console.error('登录用户', user)

  const token = jwt.sign(req.body)
 
  console.error('token', token)
      
      const data = {
        name: req.body.name,
        loginTime:"",
    
        password:req.body.password,
        token
      }
      const userId = createUser(data)
      res.json({
        error:0, 
        data: '登录成功',
        token,
        userId
      });
  // if (data) {
  //   if (data.password == md5(req.body.password)) {
  //     res.json({
  //       error:0, 
  //       data: '登录成功',
  //       token: jwt.sign({ _id: data._id }),// 生成token，并传入用户_id
  //     });
  //   }else{
  //     res.json({error:1, data: '密码错误'});
  //   }
  // } else {
  //   res.json({error:1, data: '用户名不存在，请先注册'});
  // }
})

// 创建标签组
app.post('/createTag', jwt.verify, (req, res) => {
  console.log('标签组222',req)

  // console.log(res) // 包含解析 JSON 的 JavaScript 对象
  createUrlTag(req.body, req._id)
  res.json(req.body)
})

// 收藏/取消收藏url
app.post('/favor', (req, res) => {
  console.log('收藏/取消收藏url', req)
  const {body, isFavor} = req.query
  if(isFavor){
    res.send('收藏url成功');
  } else{
    res.send('取消收藏url成功');
  }
  // addHistory(keyword)

})

app.listen(3000, () => {
  console.log('Server started on port 3000')
})
