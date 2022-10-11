const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();
const app = express()
const Joi = require("joi");
const jwt = require('jsonwebtoken')
const { User } = require("../models"); //폴더 밖에 나가서 경로를 찾아서 ../넣음

app.use(cookieParser())
//회원가입 검증
const user_Signup = Joi.object({ //문자열에 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)
  nickname : Joi.string().pattern((new RegExp('^[a-zA-Z0-9]{3,30}$'))).required(),
  password : Joi.string().min(4),     //최소 4 (new RegExp('^[a-zA-Z0-9]{3,30}$'))
  confirm : Joi.string().min(4)
})

router.post('/signup',async (req,res)=>{
  try{
      // const {authorization} = req.headers
      // if(authorization){
      //  res.status(401).send({
      //   errorMessage : '이미 로그인 했음'
      //  })
      //   return;
      //   }
  const { nickname , password , confirm} = await user_Signup.validateAsync(req.body);  //정보를 받아옴
      console.log(nickname , password , confirm)
    if (password == nickname){  //비밀번호 닉네임 중복검사
      res.status(400).send({
        errorMessage: "비밀번호가 닉네임과 일치합니다.",
      })
      return;
    }
    if (password !== confirm){ //비밀번호 검증
      res.status(400).send({
        errorMessage: "비밀번호가 일치하지 않습니다.",
      })
      return;
    } 
      const users = await User.findOne({nickname})
    if (users){ //닉네임 중복검사
        res.status(400).send({
          errorMessage: "중복된 닉네임입니다.",
        })
        return;
    } 
    const userOne = new User({nickname, password,confirm})
    await userOne.save();
    res.status(201).send({msg : "회원가입완료"})
  
  }catch(error){
    console.log(error)
    res.status(400).send({'message': "회원가입 error"})
  }
  })


router.post('/login',async (req,res)=>{
  try{
    const { tokens } = req.cookies
    if(tokens){
      res.status(401).send({
      errorMessage : '이미 로그인 했음'
      })
      return;
      }
  const { nickname , password} = req.body
  console.log(nickname, password) 
  const userOne = await User.findOne({nickname,password}) //구조분해로 확인 해서 가져온다.
  console.log(userOne)
    //유저가 없거나 또는 패스워드가 일치하지 않을시 에러
  if (!userOne || password !== userOne.password){
    res.status(400).send({  //kim3108  Kim3108
      errorMessage: "닉네임 또는 패스워드를 확인해주세요",
    })
    return;
  }
  const token = jwt.sign({userId : userOne.userId },"key")
  res.send({
    token,
    msg : "로그인 완료"
  })
  }catch(error){
  console.log(error)
  res.status(400).send({'message': "회원가입 error"})
  }
})

module.exports = router;