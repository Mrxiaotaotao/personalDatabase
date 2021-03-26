const jsonWebToken = require('jsonwebtoken')
const webToken = (token) => {
  return jsonWebToken.verify(token || '', 'my_token', (err, decoded) => {
    if (err) {
      if (err.name == 'TokenExpiredError') {//token过期
        let str = {
          code: 32,
          iat: 1,
          exp: 0,
          msg: 'token过期'
        }
        return str;
      } else if (err.name == 'JsonWebTokenError') {//无效的token
        let str = {
          code: 30,
          iat: 1,
          exp: 0,
          msg: '无效的token'
        }
        return str;
      } else {
        let str = {
          code: 31,
          iat: 1,
          exp: 0,
          msg: 'token校验失败'
        }
        return str
      }
    } else {
      return decoded;
    }
  })
}
module.exports = webToken