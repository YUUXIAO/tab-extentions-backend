// const { MongoClient } = require("mongodb");  //导入依赖对象mongo客户端

// let url="mongodb://127.0.0.1:27017";  //数据库连接字符串

const mongodb = require("./mongo.js")



// run().catch(console.log);
// 登录
const createUser = async (data)=>{
  const result = await mongodb.insertOne('user',data)
  console.log('保存到登录信息',result.insertedId.toHexString());
  return result.insertedId.toHexString()
  //     return result.insertedId.toHexString()
  // let client=new MongoClient(url);  //实例化一个mongo客户端
  // try{
     
  //     console.log("保存用户信息")
  //     let db=await client.db("tab_extentions");  //获取数据库
  //     let students=await db.collection("user");  //获取集合，表
  //     let doc= {
  //       ...data,
  //     }
  //     let result=await students.insertOne(doc);  //执行向数据库中添加数据并等待响应结果
  //     console.log('保存到登录信息',result.insertedId.toHexString());
  //     return result.insertedId.toHexString()
  // }
  // finally{
  //     await client.close();
  // }
}

//保存历史记录
//  const  addHistory = async (keyword)=>{
//     let client=new MongoClient(url);  //实例化一个mongo客户端
//     try{
       
//         console.log("保存历史记录")
//         let db=await client.db("tab_extentions");  //获取数据库
//         let students=await db.collection("user");  //获取集合，表
//         let doc={id:444,keyword:keyword};  //将添加的数据对象
//         let result=await students.insertOne(doc);  //执行向数据库中添加数据并等待响应结果
        
//     }
//     finally{
//         await client.close();
//     }
// }

// 创建标签
const  createUrlTag = async (payload,id)=>{
  // let client=new MongoClient(url);  //实例化一个mongo客户端
  // try{
     
  //     console.log("创建标签组")
  //     let db=await client.db("tab_extentions");
  //     let students=await db.collection("url_tag");
  //     let doc={
  //       id: 10001,
  //       ...payload
  //     };  //将添加的数据对象
  //     let result=await students.insertOne(doc);  //执行向数据库中添加数据并等待响应结果
  //     console.log(result);
  // }
  // finally{
  //     await client.close();
  // }

  let doc={
    id,
    ...payload
  }; 
  await mongodb.insertOne(doc)

}

// 查询收藏urls】
const findFavors = async(id)=>{
  // let client=new MongoClient(url);  //实例化一个mongo客户端
  // try{
     
  //     console.log("创建标签组")
  //     let db=await client.db("tab_extentions");
  //     let students=await db.collection("user");
  //     // let doc={
  //     //   id: 10001,
  //     //   ...payload
  //     // };  //将添加的数据对象
  //     // let result=await students.insertOne(doc);  //执行向数据库中添加数据并等待响应结果
  //     // console.log(result);
  // }
  // finally{
  //     await client.close();
  // }
  const result = await mongodb.findOneById('user',id)
  console.error('查询到收藏的urls')
  return result
}

module.exports ={
    // addHistory:addHistory,
    createUrlTag:createUrlTag,
    createUser
} 
