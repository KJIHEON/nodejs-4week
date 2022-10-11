const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const { Post } = require("../models"); //폴더 밖에 나가서 경로를 찾아서 ../넣음

 //폴더 밖에 나가서 경로를 찾아서 ../넣음


// try{실행할코드}catch(error){ //catch가 에러를 받는다.
//   console.log(error)
//   res.status(400).send({'message': "작성실패error"}) //에러 400 try catch try문 안에 에러가 나면 catch가 잡아줘서 에러문구를 보내준다.(서버가 꺼지지 않음)
//  }  


//게시물 작성
router.post('/',authMiddleware,async (req, res) => {   //post누르면 정보가 담겨있음  ///몽구스의 스키마를 이용하여몽고 디비에 저장 하기
  try{
    const user = res.locals.user //로컬에 저장된 유저 정보를 불러옴
    // console.log(user.userId)
    // console.log(user.nickname)
    const { title, content, } = req.body; //저장해야할 정보를 받아와서 변수에 등록시킨다. req.body에 정보가 들어있음
    const createdAt = new Date(); //날짜 지정 yyyddmmm이거 쓰기 나중에 하자!!
    const updateAt = new Date();
    await Post.create({
      userId : user.userId,
      nickname : user.nickname,
      title : title, 
      content : content,
      createdAt : createdAt,
      likes : 0,
      updateAt : updateAt,
    }); 
    res.status(201).send({'message': "게시글 작성에 성공하였습니다."});  
   }catch(error){ 
    console.log(error)
    res.status(400).send({'message': "작성실패error"}) //에러 400 try catch try문 안에 에러가 나면 catch가 잡아줘서 에러문구를 보내준다.(서버가 꺼지지 않음)
   }   
});



//게시글 조회 내림차순
router.get('/',async (req,res)=>{// get으로 데이터를 불러올꺼임 .sort({ createdAt: "desc" }) 
  try{
  const posts = await Post.findAll({order: [['createdAt', 'DESC']]})  ////내림차순 차을때 사용한다!!!! //.sort("-createdAt");
  console.log(posts)
  console.log(posts.createdAt)
  const post = posts.map((post)=> {   //배열 순회 하면서 복제 시킨다.(배열에서만 쓸수있다.) .map((순회하는 배열하는 아이템)=>{바꿔주는 함수(비지니스 로직)})
      return {  ///필요값만 보여주기 위함   //filter() ,find()  숙제 같이쓴다.
        postId : post.postId,
        userId : post.userId,
        nickname : post.nickname,
        title :  post.title, 
        createdAt : post.createdAt,
        updatedAt : post.updatedAt,
        likes : post.likes,
      }
    })
    res.status(200).json({data : post});//찾아온 정보를 data에 넣어서 보내준다 (우리가 보내면 기본적으로 data에 받는다. data굳이 안적어두됨)  
      } catch(error){ //catch가 에러를 받는다.
      console.log(error)
      res.status(400).send({'message': "게시글 목록조회 error"}) 
     }    

  })

  //게시물 상세 페이지 조회
router.get('/:postId' ,async (req,res)=>{
  try{
       const { postId } = req.params; //썬더에 입력하면 정보 받아옴
       const postOne = await Post.findOne({
        where: {
          postId,
         },
       }); //Post.findOne({_id :_postId}), 아이디가 일치하는것을 찾아옴
       console.log(postOne)
       const post = {       //map함수는 배열이 여러개 일때 사용하면 좋다. 1개일때는 불필요한 코드
        postId : postOne.postId,   //재할당해서 변수에 넣어준다. postOne의 값을 ._id등등 필요한 값만 추출해서() 키값 : 추출한 값으로 바꿔줌)
        userId : postOne.userId,
        nickname : postOne.nickname,
        title : postOne.title,
        content : postOne.content,
        createdAt :postOne.createdAt,
        updateAt :postOne.updatedAt,
        likes : postOne.likes
        }
        res.status(200).json({ data: post}) //중괄호에 바로 리턴가능 변수로 안빼고
    }catch(error){ 
        console.log(error)
        res.status(400).send({'message': "상세 게시글 목록조회 error"}) 
    }                   
  })





// 게시글 수정하기
router.put("/:postId",authMiddleware, async (req, res) => {
  try{
      const { postId } = req.params;                 //아이디 정보를 받아옴 내가 put누르면 정보가 담겨있음
      const {title, content} = req.body;   //바디에 내가 적으면 여기에 뜸 헷갈리면 찍어보자
      await Post.update({ 
        title : title,
        content : content,},
        {
        where : {postId : postId}
      });
   
    res.status(201).send({message: "게시글을 수정하였습니다."})
    }catch(error){ 
    console.log(error)
    res.status(400).send({message: "수정 실패error"}) 
    }               
})



//게시물 지우기 비밀번호 적어서 해야함
router.delete("/:postId",authMiddleware, async (req, res) => {
  try{
  const { postId } = req.params;                        //아이디 정보를 받아온다 delete 누르면 작동함
  await Post.destroy({
    where: {
      postId: postId
    }
  });             //해당하는 아이디를 삭제해라
  res.status(201).send({"message":"게시글을 삭제하였습니다."}); 
  }catch(error){ 
  console.log(error)
  res.status(400).send({'message': "게시글 삭제 error"}) 
  }          
});











module.exports = router;