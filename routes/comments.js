const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware')
const { Comments } = require("../models");


// 댓글 작성 
//포스트 아이디를 같이 집어넣어줘서 해당 게시글의 댓글이란걸 알수있음
  router.post('/:postId',authMiddleware, async (req,res)=>{
  try{
      const user = res.locals.user
      console.log(user.nickname)
      console.log(user.userId)
      const { postId } = req.params;                         
      const { comment } = req.body;             
      const createdAt = new Date();
      const updatedAt = new Date();                             //날짜  넣어주기
      if(!comment){                                    
      res.status(400).send({'message': "댓글 내용을 입력해주세요"});
      return
      }                                               //스키마 comments 아이디로 정보를 저장하고 만들어줌
        await Comments.create({  //받아옴
        postId, 
        userId : user.userId, 
        nickname : user.nickname,
        comment,
        createdAt,
        updatedAt
      }); 
      res.status(201).send({'message': "댓글을 생성하였습니다."});    //메세지 생성 제이슨 형식으로 응답해줌
     } catch(error){ //catch가 에러를 받는다.
      console.log(error)
      res.status(400).send({'message': "댓글 작성 error"}) //에러 400 try catch try문 안에 에러가 나면 catch가 잡아줘서 에러문구를 보내준다.(서버가 꺼지지 않음)
    }   
  })

  //해당 게시물 댓글 가져오기
  router.get('/:postId',async (req,res)=>{
  try{
      const { postId } = req.params    //아이디 값을 받아온다 //파라미터로 받아온 아이디와 몽고디비에 저장된 아이디 중 일치하는것을 찾아서 가져온다.                                                                                 
      const commentAll = await Comments.findAll({
        where : 
          {postId : postId}, order: [['createdAt', 'DESC']]
        })
      const comment = commentAll.map((comment)=> {                     //map은 하나씩 순회하여 값을 복사해줌 [1,2,3,4,5] 배열로 반환된다.
      return {  
        commentId : comment.commentId,
        userId : comment.userId,
        nickname : comment.nickname,
        comment :  comment.title, 
        createdAt : comment.createdAt,
        updatedAt : comment.updatedAt,
      }})
       res.status(200).json({ data: comment})
    } catch(error){ //catch가 에러를 받는다.
      console.log(error)
      res.status(400).send({'message': "댓글 불러오기 error"}) 
    }
  })

//해당 게시물의 댓글 수정해보기
router.put('/:commentId', authMiddleware,async (req,res)=>{    //일단 아이디 받아오고 일치하는지 확인 해당 
  try{        
      const user = res.locals.user // id 를 가져옴 2번
       const { commentId } = req.params 
       const {comment} = req.body   //수정할 코맨트
       const findUser = await Comments.findOne({ where :{commentId,}}) //아이디를 찾아옴  
       if(user.userId !== findUser.userId){ //예외 처리
        res.status(400).send({'message': "작성자와 일치 하지 않습니다."})
          return
       }        
        await Comments.update({ //put같은거
          comment : comment},
          {
          where : {commentId : commentId}
        });
        res.status(201).send({'message': "댓글을 수정했습니다"})            
      } catch(error){ //catch가 에러를 받는다.
        console.log(error)
        res.status(400).send({'message': "댓글 수정하기 error"}) 
      }   
})

//해당 댓글 삭제..
router.delete('/:commentId',authMiddleware,async (req,res)=>{
  try{
      const user = res.locals.user // id 를 가져옴 2번
      const { commentId } = req.params;
      const findUser = await Comments.findOne({ where :{commentId,}}) //아이디를 찾아옴  
       if(user.userId !== findUser.userId){ //예외 처리
        res.status(400).send({'message': "작성자와 일치 하지 않습니다."})
          return
       }      
      await Comments.destroy({
        where: {
          commentId: commentId
        }
      });    
      res.status(200).send({"message":"댓글을 삭제하였습니다."}); 
    } catch(error){ //catch가 에러를 받는다.
      console.log(error)
      res.status(400).send({'message': "댓글 삭제하기 error"})
    }   
})



  
module.exports = router;