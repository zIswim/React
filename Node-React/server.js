const express = require('express');
const app = express();
const port = 3000;
const {User} = require('./models/User');
const bodyParser = require('body-parser');

//body Parser
// body parser가 client에서 오는 경로를 서버에서 분석해서 가져올 수 있게 함
// application/X-www-form-urlencoded 분석해서 가져옴
app.use(bodyParser.urlencoded({extended: true} ));

// application/json 타입으로 된 것을 분석해서 가져옴
app.use(bodyParser.json());

//mongoose
const mongoose = require("mongoose");
const config = require("./config/key");

// MONGODB cluster 연결
mongoose
    .connect(config.mongoURI,
        {useUnifiedTopology: true, useNewUrlParser: true})
    .then(() => {console.log('MongoDB Connected Successfully!')})
    .catch((error) => {console.log('failed', error)});


app.get('/', (req, res) => {
    res.send('node-react 프로젝트');
})

// 회원가입
app.post('/register', (req, res) => {
    // 회원 가입 할 때 필요한 정보들을 client에서 가져오면
    // 그것들을 db에 넣어준다.

    const user = new User(req.body);

    // db에 저장
    user.save().then(() => {
        res.status(200).json({
            success: true,
        })
    }).catch((error) => {
        return res.json({success: false, error: error});
    })
})

app.listen(port, () =>
    console.log(`Server started on port ${port}`));
