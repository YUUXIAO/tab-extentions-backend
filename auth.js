const jsonwebtoken = require("jsonwebtoken")
const secretkey = 'yabbykey'


// 生成 token
const sign = function(data={}){
 return jsonwebtoken.sign(data, secretkey,{
  expiresIn: 60*60*24
 })
}

const verify = (req, res, next)=>{
  let authorization = req.headers.authorization ||  '';
	let token = '';
	if (authorization.includes('Bearer')) {
		token = authorization.replace('Bearer ', '');
	} else {
    console.error('新用户')
    next()
  }
  jsonwebtoken.verify(token, secretkey, (error, data) => {
		if (error) {
      console.error('error', error)
			res.json({ error: 1, data: 'token验证失败' });
		} else {
      console.error('verify拿到数据', data)
			req._id = data._id;
			next();
		}
	});

}

module.exports = {
	sign,
	verify,
};