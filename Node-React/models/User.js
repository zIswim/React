const mongoose = require('mongoose');
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
        maxlength: 50,
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

const User = mongoose.model('User', userSchema);
module.exports = {User};