var MongoClient=require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID;

var connStr="mongodb://127.0.0.1:27017";

exports.objId=ObjectID //导出查询mongo自生成的id


// 连接数据库
function _connect( cb){
  console.error(3)
  MongoClient.connect(connStr,async function(err, client){
    if(err){
      console.error('连接失败')
    } else{

    var db = await client.db("tab_extentions")
  console.error('连接成功')
    return cb(db)
  }

  })
}

// 插入一条数据
function insertOne (collection, data){
  return new Promise((resolve, reject) => {
    _connect(function(db){
      // db.collection(collection).insertOne(obj, function(err,result){
      //   cb(err, result)
      // })
      db.collection(collection).insertOne(data, function(err, result) {
          if (err) {
              reject(err)
          } else {
              resolve(result)
              db.close()
          }
      })
      
    })
  })
  
}

// 插入多条数据
function insertMany (collection, data){
  return new Promise((resolve, reject) => {
    _connect(function(db){
    
      db.collection(collection).insertMany(data, function(err, result) {
          if (err) {
              reject(err)
          } else {
              resolve(result)
              db.close()
          }
      })
      
    })
  })
  
}

// 查找一条数据
function findOne(collection, whereObj){
  console.error('查找一条数据')
  return new Promise((resolve, reject) => {
    console.error(1)
   _connect(function(db){
      console.error(2)
      db.collection(collection).findOne(whereObj, function (err, result) {
        if (err) {
          console.error(err)
          reject(err)
      } else {
        console.error('result', result)
          resolve(result)
          db.close()
      }
    });
      
    })
  })
}
// 根据ID来查找记录
function findOneById(collection, id){
  return new Promise((resolve, reject) => {
    _connect(function(db){
    
      db.collection(collection).findOne({_id: ObjectID(id)}, function (err, result) {
        if (err) {
          reject(err)
      } else {
          resolve(result)
          db.close()
      }
    });
      
    })
  })
}

// 根据ID查一条记录
function findOneById(collection, id){
  return new Promise((resolve, reject) => {
    _connect(function(db){
    
      db.collection(collection).findOne({_id: ObjectID(id)}, function (err, result) {
        if (err) {
          reject(err)
      } else {
          resolve(result)
          db.close()
      }
    });
      
    })
  })
}

// 根据ID修改一条记录
function updateOneById(collection, id, updateObj){
  return new Promise((resolve, reject) => {
    _connect(function(db){
    
      db.collection(collection).updateOne({_id: ObjectID(id), updateObj}, function (err, result) {
        if (err) {
          reject(err)
      } else {
          resolve(result)
          db.close()
      }
    });
      
    })
  })
}

// 修改一条记录
function updateOne(collection, whereObj, updateObj){
  return new Promise((resolve, reject) => {
    _connect(function(db){
    
      db.collection(collection).updateOne(whereObj,updateObj, function (err, result) {
        if (err) {
          reject(err)
      } else {
          resolve(result)
          db.close()
      }
    });
      
    })
  })
}

// 修改一条记录
function updateMany(collection, whereObj, updateObj){
  return new Promise((resolve, reject) => {
    _connect(function(db){
    
      db.collection(collection).updateMany(whereObj,updateObj, function (err, result) {
        if (err) {
          reject(err)
      } else {
          resolve(result)
          db.close()
      }
    });
      
    })
  })
}

// 删除一条记录
function deleteOne(collection, whereObj){
  return new Promise((resolve, reject) => {
    _connect(function(db){
    
      db.collection(collection).deleteOne(whereObj, function (err, result) {
        if (err) {
          reject(err)
      } else {
          resolve(result)
          db.close()
      }
    });
      
    })
  })
}


// 删除多条记录
function deleteMany(collection, whereObj){
  return new Promise((resolve, reject) => {
    _connect(function(db){
    
      db.collection(collection).deleteMany(whereObj, function (err, result) {
        if (err) {
          reject(err)
      } else {
          resolve(result)
          db.close()
      }
    });
      
    })
  })
}

// 根据ID来删除一条记录
function deleteOneById(collection, id){
  return new Promise((resolve, reject) => {
    _connect(function(db){
    
      db.collection(collection).deleteOne({_id: ObjectID(id)}, function (err, result) {
        if (err) {
          reject(err)
      } else {
          resolve(result)
          db.close()
      }
    });
      
    })
  })
}




function findAll( collection) {
    return new Promise((resolve, reject) => {
      _connect(function(db){
        db.collection(collection).find().toArray(function (err, result) { // 返回集合中所有数据
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                    db.close()
                }
            })
        })
    })
}




module.exports = {
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
  updateMany
}