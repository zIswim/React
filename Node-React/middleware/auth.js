const {User} = require('../models/User');

let auth = (req, res, next) => {
    // 인증 처리를 하는 곳

    // 클라이언트에서 쿠키를 가져옴
    let token = req.cookies.x_auth;

    // 토큰을 복호화 한 후 user를 찾는다.
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if(!user) return res.json({isAuth:false, error: true})

        req.token = token;
        req.user = user;
        next();
    });
    // 유저가 있으면 인증 Okay
    // 유저가 없으면 인증 X

}

module.exports = { auth };