const jwt = require('jsonwebtoken')
const User = require('../models/user')


module.exports=(req,res,next)=>{
//  const { token } = req.cookies
// console.log(req.cookie)
// console.log(token)
 /// 예외처리 로그인을 안했을때!
//  if (!token){
//   res.status(401).send({
//     errorMessage : '로그인이 필요한 기능입니다.'
//   })
//   return;
// }
 try{      //검증
  const {userId} = jwt.verify(tokenValue,'key')
  User.findById(userId).then((user) =>{
    res.locals.user = user; //locals에 저장 해서 사용
    next();
  })
 }catch(error){
  res.status(401).send({
  errorMessage : '로그인이 필요한 기능입니다.'
 })
 return; //핸들러가 실행하면 안되니깐
} 
}
