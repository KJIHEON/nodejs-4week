const express = require('express');
const router = express.Router();

const comments = require('../models/comments');


// 댓글 작성 
//포스트 아이디를 같이 집어넣어줘서 해당 게시글의 댓글이란걸 알수있음
  router.post('/:_postId', async (req,res)=>{
  try{
      const { _postId } = req.params;                         //입력받은 아이디값이들어옴
      const {user, password, content} = req.body;             //저장해야할 정보를 받아와서 변수에 등록시킨다. req.body에 정보가 들어있음
      const createdAt = new Date();                           //날짜  넣어주기
      if(content == ""){                                    //content 댓글이 빈칸일시 문구 반환 댓글 보내주기
      res.status(400).send({'message': "댓글을 입력해주세요"});
      }else{                                                 //스키마 comments 아이디로 정보를 저장하고 만들어줌
      await comments.create({ _postId ,user , password, content, createdAt}); //스키마.db에 정보를 만들어준다
      res.status(201).send({'message': "댓글을 생성하였습니다."});    //메세지 생성 제이슨 형식으로 응답해줌
      }
    } catch(error){ //catch가 에러를 받는다.
      console.log(error)
      res.status(400).send({'message': "댓글 작성 error"}) //에러 400 try catch try문 안에 에러가 나면 catch가 잡아줘서 에러문구를 보내준다.(서버가 꺼지지 않음)
    }   
  })

  //해당 게시물 댓글 가져오기
  router.get('/:_postId',async (req,res)=>{
  try{
      const { _postId } = req.params    //아이디 값을 받아온다 //파라미터로 받아온 아이디와 몽고디비에 저장된 아이디 중 일치하는것을 찾아서 가져온다.                                                                                 
      const commentAll = await comments.find({_postId}).sort({createdAt: "desc" }) //.sort({ createdAt: "desc" }) createdAt기준으로 내림차순
      const comment = commentAll.map((comment)=> {                     //map은 하나씩 순회하여 값을 복사해줌 [1,2,3,4,5] 배열로 반환된다.
      return {  
      commentId : comment._id,
      user : comment.user,
      content : comment.content,
      createdAt :comment.createdAt
      }})
       res.status(200).json({ data: comment})
    } catch(error){ //catch가 에러를 받는다.
      console.log(error)
      res.status(400).send({'message': "댓글 불러오기 error"}) 
    }
  })

//해당 게시물의 댓글 수정해보기
router.put('/:_commentId', async (req,res)=>{    //일단 아이디 받아오고 일치하는지 확인 해당 
  try{         
       const { _commentId } = req.params                         //입력한 코멘트 아이디를 가져옴
       const {password , content} =req.body                            //입력한 password와 content받아옴
       if (content == "") {                                                //content가 빈칸이면  메세지 출력
        res.json({'message': "댓글을 입력해주세요"});
        }else { 
        // const comment = await comments.findOne({ _id: _commentId }); //아이디와 일치한 값을 코멘트에서 찾아옴 중복되면 한개만 쓰면됨 구조할당 분해 찾을수 있음//
        await comments.updateOne({ _id : _commentId }, { $set: {password,content } }); //일치하면 _id를 찾아서  패스워드랑 콘텐트수정  
        res.status(201).send({'message': "댓글을 수정했습니다"})            
        }
      } catch(error){ //catch가 에러를 받는다.
        console.log(error)
        res.status(400).send({'message': "댓글 수정하기 error"}) 
      }   
})

//해당 댓글 삭제..
router.delete('/:_commentId',async (req,res)=>{
  try{
      const { _commentId } = req.params;                              //아이디 정보를 받아온다 delete 누르면 작동함
      const { password } = req.body;                                 //바디에 내가 적으면 여기에 뜸 정보수정할꺼
      const commnet = await comments.findOne({ _id : _commentId });   //일치하는 코멘트트 아이디 값을 찾음   
      if ( commnet.password == password){
      await comments.deleteOne({ _id : _commentId });               //해당하는 아이디를 삭제해라
      } else {                                                        //한개를 삭제한다.
      return res.status(400).json({                                 //else문 쓸때 예외처리하기
      success: false,
      msg: "비밀번호가 일치하지 않습니다!",
      });
      }
      res.status(200).send({"message":"댓글을 삭제하였습니다."}); 
    } catch(error){ //catch가 에러를 받는다.
      console.log(error)
      res.status(400).send({'message': "댓글 삭제하기 error"})
    }   
})



  
module.exports = router;