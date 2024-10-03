const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//salt 이용해서 암호화, saltRounds : salt가 몇 글자인지 나타냄
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const util = require('util');

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


userSchema.statics.findByToken = function(token) {
    const user = this;

    return util.promisify(jwt.verify)(token, 'secret token')
        .then((decoded) => {
            return user.findOne({
                "_id": decoded,
                "token": token
            });
        })
        .catch((err) => {
            console.log(err);
            throw new Error("유효하지 않은 토큰입니다.");
        });


}

const User = mongoose.model('User', userSchema);
module.exports = {User};