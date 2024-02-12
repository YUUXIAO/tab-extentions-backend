var mongodb = require('mongodb')
var MongoClient = mongodb.MongoClient
var ObjectID = require('mongodb').ObjectID

var connStr = 'mongodb://127.0.0.1:27017'

exports.objId = ObjectID //导出查询mongo自生成的id

const options = {
  connectTimeoutMS: 5000, // 设置连接超时时间为5秒
}

// 连接数据库
async function _connect() {
  try {
    const client = await MongoClient.connect(connStr)
    const db = client.db('tab_extentions')
    console.log('Connected successfully to server')
    return db
  } catch (err) {
    console.error('Connected Failed:', err)
  }
}

// 插入一条数据
async function insertOne(collection, obj, callback) {
  console.log('插入一条数据', collection)
  const db = await _connect()
  const result = await db.collection(collection).insertOne(obj)
  callback(result)
}

// 插入多条数据
function insertMany(collection, obj, callback) {
  const db = _connect()
  db.collection(collection).insertMany(obj, function (err, result) {
    callback(err, result)
    db.close() //关闭数据库
  })

  // return new Promise((resolve, reject) => {
  //   _connect(function (db) {
  //     db.collection(collection).insertMany(data, function (err, result) {
  //       if (err) {
  //         reject(err)
  //       } else {
  //         resolve(result)
  //         db.close()
  //       }
  //     })
  //   })
  // })
}

// 查找一条数据
async function findOne(collection, whereObj, callback) {
  console.error('查找一条数据')
  const db = await _connect()
  const result = await db.collection(collection).findOne(whereObj)
  callback(result)
  // db.close() //关闭数据库

  // return new Promise((resolve, reject) => {
  //   console.error(1)
  //   _connect(function (db) {
  //     console.error(2)
  //     db.collection(collection).findOne(whereObj, function (err, result) {
  //       if (err) {
  //         console.error(err)
  //         reject(err)
  //       } else {
  //         console.error('result', result)
  //         resolve(result)
  //         db.close()
  //       }
  //     })
  //   })
  // })
}
// 根据ID来查找记录
function findOneById(collection, id, callback) {
  const db = _connect()
  db.collection(collection).findOne({ _id: ObjectID(id) }, function (err, result) {
    callback(err, result)
    db.close() //关闭数据库
  })

  // return new Promise((resolve, reject) => {
  //   _connect(function (db) {
  //     db.collection(collection).findOne({ _id: ObjectID(id) }, function (err, result) {
  //       if (err) {
  //         reject(err)
  //       } else {
  //         resolve(result)
  //         db.close()
  //       }
  //     })
  //   })
  // })
}

// 根据ID查一条记录
// function findOneById(collection, id) {

//   const db =  _connect()
//   db.collection(collection).findOne({ _id: ObjectID(id) }, function (err, result) {
//     callback(err,result)
//     db.close() //关闭数据库
//   })

//   // return new Promise((resolve, reject) => {
//   //   _connect(function (db) {
//   //     db.collection(collection).findOne({ _id: ObjectID(id) }, function (err, result) {
//   //       if (err) {
//   //         reject(err)
//   //       } else {
//   //         resolve(result)
//   //         db.close()
//   //       }
//   //     })
//   //   })
//   // })
// }

// 根据ID修改一条记录
function updateOneById(collection, id, updateObj, callback) {
  const db = _connect()
  db.collection(collection).updateOne({ _id: ObjectID(id), updateObj }, function (err, result) {
    callback(err, result)
    db.close() //关闭数据库
  })

  // return new Promise((resolve, reject) => {
  //   _connect(function (db) {
  //     db.collection(collection).updateOne({ _id: ObjectID(id), updateObj }, function (err, result) {
  //       if (err) {
  //         reject(err)
  //       } else {
  //         resolve(result)
  //         db.close()
  //       }
  //     })
  //   })
  // })
}

// 修改一条记录
function updateOne(collection, whereObj, updateObj, callback) {
  const db = _connect()
  db.collection(collection).updateOne(whereObj, updateObj, function (err, result) {
    callback(err, result)
    db.close() //关闭数据库
  })

  // return new Promise((resolve, reject) => {
  //   _connect(function (db) {
  //     db.collection(collection).updateOne(whereObj, updateObj, function (err, result) {
  //       if (err) {
  //         reject(err)
  //       } else {
  //         resolve(result)
  //         db.close()
  //       }
  //     })
  //   })
  // })
}

// 修改一条记录
function updateMany(collection, whereObj, updateObj, callback) {
  const db = _connect()
  db.collection(collection).updateMany(whereObj, updateObj, function (err, result) {
    callback(err, result)
    db.close() //关闭数据库
  })

  // return new Promise((resolve, reject) => {
  //   _connect(function (db) {
  //     db.collection(collection).updateMany(whereObj, updateObj, function (err, result) {
  //       if (err) {
  //         reject(err)
  //       } else {
  //         resolve(result)
  //         db.close()
  //       }
  //     })
  //   })
  // })
}

// 删除一条记录
function deleteOne(collection, whereObj, callback) {
  const db = _connect()
  db.collection(collection).deleteOne(whereObj, function (err, result) {
    callback(err, result)
    db.close() //关闭数据库
  })

  // return new Promise((resolve, reject) => {
  //   _connect(function (db) {
  //     db.collection(collection).deleteOne(whereObj, function (err, result) {
  //       if (err) {
  //         reject(err)
  //       } else {
  //         resolve(result)
  //         db.close()
  //       }
  //     })
  //   })
  // })
}

// 删除多条记录
function deleteMany(collection, whereObj, callback) {
  const db = _connect()
  db.collection(collection).deleteMany(whereObj, function (err, result) {
    callback(err, result)
    db.close() //关闭数据库
  })

  // return new Promise((resolve, reject) => {
  //   _connect(function (db) {
  //     db.collection(collection).deleteMany(whereObj, function (err, result) {
  //       if (err) {
  //         reject(err)
  //       } else {
  //         resolve(result)
  //         db.close()
  //       }
  //     })
  //   })
  // })
}

// 根据ID来删除一条记录
function deleteOneById(collection, id, callback) {
  const db = _connect()
  db.collection(collection).deleteOne({ _id: ObjectID(id) }, function (err, result) {
    callback(err, result)
    db.close() //关闭数据库
  })

  // return new Promise((resolve, reject) => {
  //   _connect(function (db) {
  //     db.collection(collection).deleteOne({ _id: ObjectID(id) }, function (err, result) {
  //       if (err) {
  //         reject(err)
  //       } else {
  //         resolve(result)
  //         db.close()
  //       }
  //     })
  //   })
  // })
}

function findAll(collection, callback) {
  const db = _connect()
  db.collection(collection)
    .find()
    .toArray(function (err, result) {
      callback(err, result)
      db.close() //关闭数据库
    })

  // return new Promise((resolve, reject) => {
  //   _connect(function (db) {
  //     db.collection(collection)
  //       .find()
  //       .toArray(function (err, result) {
  //         // 返回集合中所有数据
  //         if (err) {
  //           reject(err)
  //         } else {
  //           resolve(result)
  //           db.close()
  //         }
  //       })
  //   })
  // })
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
