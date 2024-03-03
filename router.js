// router.js
const express = require('express')
const service = require('./service.js')
const jwt = require('./auth')
const utils = require('./utils.js')
const router = express.Router()

// 获取用户信息
router.get('/userinfo', jwt.verify, async (req, res) => {
  const result = await service.getUserInfo(req, res)
  const response = utils.build(utils.codeMaps.OK, result)
  res.send(response)
})

// 发送验证码
router.get('/sendMail', async (req, res) => {
  const result = await service.sendMailCode(req, res)
  const response = utils.build(utils.codeMaps.OK, result)
  res.send(response)
})

// 登录
router.post('/login', async (req, res) => {
  try {
    const result = await service.createUser(req, res)
    const response = utils.build(utils.codeMaps.OK, result)
    res.send(response)
  } catch (error) {
    const response = utils.build(utils.codeMaps.ERR_INTERNAL, { msg: '登录失败，请确认邮箱或者验证码错误' })
    res.send(response)
  }
})

// 创建标签组
router.post('/createTag', jwt.verify, async (req, res) => {
  try {
    const result = await service.createUrlTag(req, res)
    const response = utils.build(utils.codeMaps.OK, result)
    res.send(response)
  } catch (error) {
    console.error('创建标签组错误', error)
  }
})

// 查询标签
router.get('/createTag', jwt.verify, async (req, res) => {
  const result = await service.getUrlTag(req, res)
  const response = utils.build(utils.codeMaps.OK, result)
  res.send(response)
})

// 收藏/取消收藏url
router.get('/favor', jwt.verify, async (req, res) => {
  const result = await service.addFavorUrl(req, res)
  const response = utils.build(utils.codeMaps.OK, result)
  res.send(response)
})

// 插入稍后再看
router.post('/later', jwt.verify, async (req, res) => {
  const result = await service.setLater(req, res)
  const response = utils.build(utils.codeMaps.OK, result)
  res.send(response)
})
router.get('/later', jwt.verify, async (req, res) => {
  const result = await service.getLater(req, res)
  const response = utils.build(utils.codeMaps.OK, result)
  res.send(response)
})
router.put('/later', jwt.verify, async (req, res) => {
  const result = await service.updateLater(req, res)
  const response = utils.build(utils.codeMaps.OK, result)
  res.send(response)
})
router.delete('/later', jwt.verify, async (req, res) => {
  const result = await service.deleteLater(req, res)
  const response = utils.build(utils.codeMaps.OK, result)
  res.send(response)
})

// 关键词记事本

router.post('/todoKeys', jwt.verify, async (req, res) => {
  const result = await service.setTodoKeys(req, res)
  const response = utils.build(utils.codeMaps.OK, result)
  res.send(response)
})
router.get('/todoKeys', jwt.verify, async (req, res) => {
  const result = await service.getTodoKeys(req, res)
  const response = utils.build(utils.codeMaps.OK, result)
  res.send(response)
})
router.put('/todoKeys', jwt.verify, async (req, res) => {
  const result = await service.updateTodoKeys(req, res)
  const response = utils.build(utils.codeMaps.OK, result)
  res.send(response)
})
router.delete('/todoKeys', jwt.verify, async (req, res) => {
  const result = await service.deleteTodoKeys(req, res)
  const response = utils.build(utils.codeMaps.OK, result)
  res.send(response)
})

// 定义错误级别的中间件，捕获整个项目的异常错误，从而防止程序的崩溃
router.use((err, req, res, next) => {
  console.log('发生了错误！' + err.message)
  const response = utils.build(utils.codeMaps.ERR_INTERNAL, { msg: err.message })
  res.send(response)
  // res.status(500).send('Error：' + err.message)
})

module.exports = router
