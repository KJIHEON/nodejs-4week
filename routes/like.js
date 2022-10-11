const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const { Like } = require("../models"); //폴더 밖에 나가서 경로를 찾아서 ../넣음
const { Post } = require("../models")



router.get('/posts/like',async(req,res)=>{
  const likeAll = await Like.findAll({order: [['createdAt', 'DESC']]})
  const like = Like.map((likeAll)=> {   //배열 순회 하면서 복제 시킨다.(배열에서만 쓸수있다.) .map((순회하는 배열하는 아이템)=>{바꿔주는 함수(비지니스 로직)})
    return {  ///필요값만 보여주기 위함   //filter() ,find()  숙제 같이쓴다.
      postId : likeAll.postId,
      userId : likeAll.userId,
      nickname : likeAll.nickname,
      title :  likeAll.title, 
      createdAt : likeAll.createdAt,
      updatedAt : likeAll.updatedAt,
      likes : likeAll.likes,
    }
  })
  res.status(200).json({data : like});
  })
//포스트아이디 불러옴


router.put('/posts/:postId/like',authMiddleware,async(req,res)=>{
  const {userId} = res.locals.user 
  const {postId} = req.params
  console.log(userId)
  console.log(postId)
    // console.log(postId)
  const createLike = await Post.findOne({ where :{postId,userId}})
  console.log(createLike.likes)
  await Post.update({ //put같은거
    likes : 0},
    {
    where : {postId : postId}
  });
  // await Like.update({ //put같은거
  //   likes : (likes+1)},
  //   {
  //   where : {postId : postId}
  // });
  res.status(200).json({data : "잘보내짐 ㅇㅇ"});
})

module.exports = router;