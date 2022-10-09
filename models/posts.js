
const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({ // 어떤 스키마에 넣을껀지 
  user: {
    type: String,
    required: true, //필수 요소
    unique: true ///하나만 가질수 있게함
  },
  password: {
    type: String,
    required: true,
  },
  title: {
    type: String
  },
  content: {
    type: String
  },
  createdAt:{ //작성 날짜를 넣어주는 스키마
    type: Date
  },
})


module.exports = mongoose.model("Post", postsSchema); //호출시 스키마가 등록된다.