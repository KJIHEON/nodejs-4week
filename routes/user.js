const express = require('express');
const router = express.Router();
const Joi = require("joi");   //회원가입 검증 라이브러리
const jwt = require('jsonwebtoken')
const { User } = require("../models"); //폴더 밖에 나가서 경로를 찾아서 ../넣음
 ///시퀄라이즈는 구조분해 할당으로 모델스를 받아와야함
//회원가입 검증
const user_Signup = Joi.object({ //문자열에 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)
  nickname : Joi.string().pattern((new RegExp('^[a-zA-Z0-9]{3,30}$'))).required(),
  password : Joi.string().min(4),     //최소 4 (new RegExp('^[a-zA-Z0-9]{3,30}$'))
  confirm : Joi.string().min(4) //최소4
})

router.post('/signup',async (req,res)=>{
  try{
    if(req.cookies.token){ //로그인 중복 검사 쿠키에 받아옴 
      res.status(401).send({
      errorMessage : '이미 로그인이 되어있습니다.'
      })
      return;
      }
  const { nickname , password , confirm} = await user_Signup.validateAsync(req.body);  //정보를 받아옴  user_Signup.validateAsync 
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
      const users = await User.findAll({ //조건을 걸어 같은 닉네임이 있는걸 가져옴
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
    await User.create({nickname, password}) ///저장하기
    res.status(201).send({msg : "회원가입완료"})
  }catch(error){
    console.log(error)
    res.status(400).send({'message': "회원가입 error"})
  }
  })

 //로그인 
router.post('/login',async (req,res)=>{
  try{
    console.log(req.cookies.token)
    if(req.cookies.token){  //검증
      res.status(401).send({
      errorMessage : '이미 로그인이 되어있습니다.'
      })
      return;
      }
  const { nickname , password} = req.body  //바디에서 정보를 받아옴
  // console.log(nickname, password) 
  const user =await User.findOne({  //닉네임을 확인 하여 찾아옴
    where: {
     nickname,
    },
  });
  console.log(!user)
    //유저가 없거나 또는 패스워드가 일치하지 않을시 에러
  if (!user || password !== user.password){
    res.status(400).send({  
      errorMessage: "닉네임 또는 패스워드를 확인해주세요",
    })
    return;
  }
  const token = jwt.sign({userId : user.userId },"key")
  res.cookie('token',token);//(`Bearer ${token}`) ㄴ이렇게 사용가능 ///쿠키에다가 토큰을 보내준다 (미들웨어로 확인함)
  res.send({
    token, //토큰 보내줌
  })
  }catch(error){
  console.log(error)
  res.status(400).send({'message': "로그인 error"})
  }
})

module.exports = router;