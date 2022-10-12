const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const { Like } = require("../models"); //폴더 밖에 나가서 경로를 찾아서 ../넣음
const { Post } = require("../models")


//내가 좋아요한 게시물 가져오기
router.get('/posts/like',authMiddleware,async(req,res)=>{
  try{
      const {userId}  = res.locals.user
      const likes = await Like.findAll({  //로그인 한 유저를 기준으로 좋아요한 게시물을 가져온다
        where :{
        userId 
        }
      })
      const PostIds = likes.map((likes)=>likes.postId)  //불러온 게시물의 포스트 아이디를 찾는다.
      const data = [] // 배열 생성
      for (const postId of PostIds){ //for of 문을 이용하여 PostIds의 포스트 아이디를 하나씩 넣어준다.
        const row = await Post.findOne({ //반복문에 있는postId를 기준으로 해당하는 포스트의 게시물을 불러온다.
          where :{
            postId : postId
          }, attributes: {exclude : ['content']}, //, attributes: {exclude : ['content']} 필요하는거만 찾아옴
        })
        const datas = {        //불러온 정보를 정렬해서 재할당 해준다
          postId : row.postId,   
          userId : row.userId,
          nickname : row.nickname,
          title : row.title,
          createdAt :row.createdAt,
          updatedAt :row.updatedAt,
          likes : row.likes
          }
          data.push(datas) //data에 푸쉬 해준다
      }
      data.sort((a,b)=>b.likes-a.likes) //likes를 기준 많은순으로 내림차순 해준다
      res.status(200).json({data});
  }catch(error){ 
    console.log(error)
    res.status(400).send({'message': "좋아요 에러 error"}) 
    }  
})


//좋아요 하기
router.put('/posts/:postId/like',authMiddleware,async(req,res)=>{
  try{
  const {userId} = res.locals.user  //유저를 기준으로 아이디값을 가져옴
  const {postId} = req.params
  const likes =await Like.findOne({ where :{postId,userId}}) //좋아요한 게시물의 포스트 아이디 값과 유저 아이디를 가져옴
  if (!likes){ //좋아요가 없을시 
  await Post.increment({ //put같은거 increment 증가 해주는 함수
    likes : 1},
    {
    where : {postId : postId} 
  });
  await Like.create({ //생성 한다
    userId : userId,
    postId : postId,
    })
    res.status(201).send({"message":"게시글의 좋아요를 등록하였습니다."});
  }else{ //있을시
    await Post.increment({ //put같은거
      likes : -1}, //포스트에 있는 좋아요의 -1해준다
      {
      where : {postId : postId}
    });
    await Like.destroy({ //postId,userId 삭제 한다 
      where: {
        postId: postId,
        userId: userId,
      }
      })
    res.status(201).send({"message":"게시글의 좋아요를 취소하였습니다"});
  }
  }catch(error){ 
  console.log(error)
  res.status(400).send({'message': "좋아요 에러 error"}) 
  }   
})


module.exports = router;