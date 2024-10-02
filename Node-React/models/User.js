const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//salt 이용해서 암호화, saltRounds : salt가 몇 글자인지 나타냄
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        maxlength: 50,
    },
    email:{
        type: String,
        trim: true, // 빈공간 없애주는 역할
        unique: true,
    },
    password: {
        type: String,
        minLength : 5,
    },
    role:{
        type: Number,
        default: 0,
    },
    image:String,
    token:{
        type: String,
    },
    // token 사용 기간
    tokenExp:{
        type: Number,
    }
})

// 저장하기 전에 비밀번호 암호화
userSchema.pre('save', function(next){
    var user = this;

    bcrypt.genSalt(saltRounds, function(err, salt) {
        // 에러가 났을 경우
        if(err) return next(err);

        if(user.isModified('password')) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err);
                user.password = hash;
                next();
            })
        } else {
            next();
        }

    });
})


userSchema.methods.comparePassword = function(plainPassword) {

    //plainPassword : 123456   encPassword : $2b$10$j42.tLIWfwoHn1AnQ3mfLeIj2mZhxiQrWp/gXwbu8kvh3RatjHNpu
    const user = this;
    return bcrypt.compare(plainPassword, user.password);

}


userSchema.methods.generateToken = function(cb){
    var user = this;
    // jsonwebtoken을 이용해서 webtoken 생성하기
    const token = jwt.sign(user._id.toHexString(), 'secret token');

    user.token = token;

    return user.save();
}


userSchema.methods.findByToken = function(token, cb){
    var user = this;

    //  토큰을 decode
    jwt.verify(token, 'secret token', function(err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id": decoded._id, "token" : token}, function(err, user) {
            if(err) return cb(err);
            return cb(null, user);
        })
    })
}

const User = mongoose.model('User', userSchema);
module.exports = {User};