const jwt = require('jsonwebtoken')
const { User } = require("../models");


module.exports=(req,res,next)=>{
    const { token } = req.cookies
    // console.log(token)
    // console.log(!token)
 if (!token){
  res.status(401).send({
    errorMessage : '로그인이 필요한 기능입니다.'
  })
  return;
}
try {
  const { userId } = jwt.verify(token, "key");
  console.log(userId)
  User.findByPk(userId).then((user) => {
    res.locals.user = user;
    next();
  });
} catch (error) {
  res.status(401).send({
    errorMessage: "로그인 후 이용 가능한 기능입니다.",
  });
}
};

