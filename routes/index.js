const express = require('express');
const router = express.Router();
const commentsRouter = require('./comments') //코멘트에서 가져옴
const postsRouter = require('./posts') //포스트에서 가져옴 //./파일명




router.use('/posts', postsRouter); //포스트로 보내줌 굳이 post에서 안써두되게끔 함
router.use('/comments',commentsRouter); //코멘트로 보내줌

module.exports = router;
