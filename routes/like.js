const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const { Like } = require("../models"); //폴더 밖에 나가서 경로를 찾아서 ../넣음
const { Post } = require("../models")


//내가 좋아요한 게시물 가져오기
router.get('/posts/like',authMiddleware,async(req,res)=>{
  const {userId}  = res.locals.user
  const likes = await Like.findAll({  //종아요 게시글 불러옴 유저
    where :{
    userId
    }
  })
  const PostIds = likes.map((likes)=>
    likes.postId
  )
  const data = []
  for (const postId of PostIds){
    const row = await Post.findOne({
      where :{
        postId : postId
      }, attributes: {exclude : ['content']}, //, attributes: {exclude : ['content']} 필요하는거만 찾아옴
    })
    const datas = {       
      postId : row.postId,   
      userId : row.userId,
      nickname : row.nickname,
      title : row.title,
      createdAt :row.createdAt,
      updatedAt :row.updatedAt,
      likes : row.likes
      }
      data.push(datas)
  }
    data.sort((a,b)=>b.likes-a.likes)
    res.status(200).json({data});
})


//좋아요 하기
router.put('/posts/:postId/like',authMiddleware,async(req,res)=>{
  try{
  const {userId} = res.locals.user 
  const {postId} = req.params
  const posts = await Post.findOne({ where :{postId}})
  const likes =await Like.findOne({ where :{postId,userId}})
  console.log(likes)
  if (!likes){
  await Post.increment({ //put같은거
    likes : 1},
    {
    where : {postId : postId}
  });
  await Like.create({
    userId : userId,
    postId : postId,
    })
    res.status(201).send({"message":"게시글의 좋아요를 등록하였습니다."});
  }else{
    await Post.increment({ //put같은거
      likes : -1},
      {
      where : {postId : postId}
    });
    await Like.destroy({
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