//정리는 외부에서 받은거 맨위로 그다음 내부 순으로하기
const express = require('express'); //바디파서
const app = express();
const connect = require("./schemas/index"); //스키마 폴더에서 쓸꺼야
const indexRouter = require('./routes/index') 
const port = 3000;

connect();
app.use(express.json()); //body-parser //기본적으로 디폴트 값이 설정되어있어서 읽을 수 없지만 바디 파서를 이용하여 정보를 읽을수 있게함

app.use(indexRouter);


app.listen(port,() =>{
    console.log('port 3000')
});