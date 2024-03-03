var mongodb = require('mongodb')
var MongoClient = mongodb.MongoClient
const ObjectID = require('mongodb').ObjectId
const db_path = process.env.DB_HOST || '127.0.0.1'

var connStr = `mongodb://${db_path}:27017`

exports.ObjectID = ObjectID //导出查询mongo自生成的id

const options = {
  connectTimeoutMS: 5000, // 设置连接超时时间为5秒
}

// 连接数据库
async function _connect() {
  try {
    const client = await MongoClient.connect(connStr)
    const db = client.db('tab_extentions')
    return db
  } catch (err) {
    console.error('mongo链接失败', err)
  }
}

// 插入一条数据
async function insertOne(collection, obj) {
  const db = await _connect()
  return db.collection(collection).insertOne(obj)
}

// 插入多条数据
async function insertMany(collection, obj) {
  const db = await _connect()
  return db.collection(collection).insertMany(obj)
}

// 查找一条数据
async function findOne(collection, whereObj) {
  const db = await _connect()
  return db.collection(collection).findOne(whereObj)
}
// 根据ID来查找记录
async function findOneById(collection, id) {
  const db = await _connect()
  return db.collection(collection).findOne({ _id: id })
}

// 根据ID修改一条记录
async function updateOneById(collection, id, updateObj) {
  const db = await _connect()
  return db.collection(collection).updateOne({ _id: id }, updateObj)
}

// 修改一条记录
async function updateOne(collection, whereObj, updateObj) {
  const db = await _connect()
  return db.collection(collection).updateOne(whereObj, updateObj)
}

// 修改一条记录
async function updateMany(collection, whereObj, updateObj) {
  const db = await _connect()
  return db.collection(collection).updateMany(whereObj, updateObj)
}

// 删除一条记录ß
async function deleteOne(collection, whereObj) {
  const db = await _connect()
  return db.collection(collection).deleteOne(whereObj)
}

// 删除多条记录
async function deleteMany(collection, whereObj) {
  const db = await _connect()
  return db.collection(collection).deleteMany(whereObj)
}

// 根据ID来删除一条记录
async function deleteOneById(collection, id) {
  const db = await _connect()
  return db.collection(collection).deleteOne({ _id: new ObjectID(id) })
}
async function findAll(collection, obj) {
  const db = await _connect()
  return db.collection(collection).find(obj).toArray()
}

module.exports = {
  _connect,
  findOneById,
  findOne,
  insertMany,
  insertOne,
  deleteOneById,
  deleteOne,
  updateOne,
  deleteMany,
  updateOneById,
  findAll,
  updateMany,
}
