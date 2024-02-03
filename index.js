const { MongoClient } = require("mongodb");  //导入依赖对象mongo客户端

let url="mongodb://127.0.0.1:27017";  //数据库连接字符串



// async function run(){
//     try{
//         let db=await client.db("tab_extentions");  //获取数据库
//         let students=await db.collection("user");  //获取集合，表
//         let doc={id:202201,name:"tom",age:19};  //将添加的数据对象
//         let result=await students.insertOne(doc);  //执行向数据库中添加数据并等待响应结果
//         console.log(result);
//     }
//     finally{
//         await client.close();
//     }
// }



// run().catch(console.log);

//保存历史记录
 const  addHistory = async (keyword)=>{
    let client=new MongoClient(url);  //实例化一个mongo客户端
    try{
       
        console.log("保存历史记录")
        let db=await client.db("tab_extentions");  //获取数据库
        let students=await db.collection("user");  //获取集合，表
        let doc={id:444,keyword:keyword};  //将添加的数据对象
        let result=await students.insertOne(doc);  //执行向数据库中添加数据并等待响应结果
        console.log(result);
    }
    finally{
        await client.close();
    }
}
module.exports ={
    addHistory:addHistory
} 
