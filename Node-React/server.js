const express = require('express');
const app = express();
const port = 3000;
const {User} = require('./models/User');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {auth} = require('middleware/auth');


//body Parser
// body parser가 client에서 오는 경로를 서버에서 분석해서 가져올 수 있게 함
// application/X-www-form-urlencoded 분석해서 가져옴
app.use(bodyParser.urlencoded({extended: true} ));


// application/json 타입으로 된 것을 분석해서 가져옴
app.use(bodyParser.json());
app.use(cookieParser());


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
app.post('/api/users/register', (req, res) => {
    // 회원 가입 할 때 필요한 정보들을 client에서 가져오면
    // 그것들을 db에 넣어준다.

    const user = new User(req.body);
    // 비밀번호 암호화

    // db에 저장
    user.save().then(() => {
        res.status(200).json({
            success: true,
        })
    }).catch((error) => {
        return res.json({success: false, error: error});
    })
})


app.post('/api/users/login', (req, res) => {

    // 요청된 이메일을 데이터 베이스에서 있는지 찾는다.
    User.findOne({ email: req.body.email })
        .then(async (user) => {
            if (!user) {
                throw new Error("제공된 이메일에 해당하는 유저가 없습니다.");
            }

            // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인
            const isMatch = await user.comparePassword(req.body.password);
            return {isMatch, user};
        })
        .then(({isMatch, user}) => {
            console.log(isMatch);
            if (!isMatch) {
                throw new Error("비밀번호가 틀렸습니다.");
            }
            // 로그인 성공
            return user.generateToken();
        })

        // 비밀번호까지 맞다면 토큰을 생성하기
        .then((user)=> {
            return res.cookie("x_auth", user.token)
                .status(200)
                .json({
                    loginSuccess: true,
                    userId: user.id,
                })
        })
        .catch((err) => {
            console.log(err);
            return res.status(400).json({
                loginSuccess: false,
                message: err.message
            });
        });
});


// 인증
app.get('/api/users/auth', auth, (req, res) => {
    // 여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication 이 true 라는 말
    res.status(200).json({
        _id: req.user._id,
        email: req.user.email,
        // role 1 : admin, role 0 : not admin
        // role 이 0이면 일반유저, 0 제외한 숫자는 관리자
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        name: req.user.name,
        role: req.user.role,
        image: req.user.image,
    })
})





app.listen(port, () =>
    console.log(`Server started on port ${port}`));
