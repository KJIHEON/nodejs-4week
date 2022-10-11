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
      const users = await User.findAll({
       where : {
        nickname,
       }
      });
     console.log(users.length)
  if (users.length){ //닉네임 중복검사 길이로 비교해서 있으면 중복된 닉네임
        res.status(400).send({
          errorMessage: "중복된 닉네임입니다.",
        })
        return;
    }
    await User.create({nickname, password})
    res.status(201).send({msg : "회원가입완료"})
  }catch(error){
    console.log(error)
    res.status(400).send({'message': "회원가입 error"})
  }
  })


router.post('/login',async (req,res)=>{
  try{
    if(req.cookies){
      res.status(401).send({
      errorMessage : '이미 로그인 했음'
      })
      return;
      }
  const { nickname , password} = req.body
  // console.log(nickname, password) 
  const user =await User.findOne({
    where: {
     nickname,
    },
  });
  console.log(!user)
    //유저가 없거나 또는 패스워드가 일치하지 않을시 에러
  if (!user || password !== user.password){
    res.status(400).send({  //kim3108  Kim3108
      errorMessage: "닉네임 또는 패스워드를 확인해주세요",
    })
    return;
  }
  const token = jwt.sign({userId : user.userId },"key")
  res.cookie('token',token); ///쿠키에다가 토큰을 보내준다 (미들웨어로 확인함)
  res.send({
    token,
  })
  }catch(error){
  console.log(error)
  res.status(400).send({'message': "로그인 error"})
  }
})

module.exports = router;