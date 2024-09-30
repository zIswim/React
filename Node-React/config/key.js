//환경 변수가 local 환경에서는 development 모드, 배포 : production
if(process.env.NODE_ENV === 'production') {
    module.exports = require('./prod');
} else{
    module.exports = require('./dev');
}