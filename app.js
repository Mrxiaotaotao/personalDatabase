const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const logger = require('koa-logger')
const jwt = require('koa-jwt');
const jsonWebToken = require('jsonwebtoken')
const webToken = require('./utils/jsonWebToken')
const { websocket } = require('./utils/websocket')
// const logsUtil = require('./utils/logs.js'); // 日志文件输出
// 中间件引用
const { mysqlMiddleWare } = require('./applaymiddleware/mysqlMiddleWare')
const { loggerMiddleWare } = require('./applaymiddleware/loggerMiddleWare')
// routers all
const registerRouter = require('./routes')
// body
const koaBody = require('koa-body');

// websocket 不同端口方式
websocket(app)

// error handler
onerror(app)

// 上传文件配置
app.use(koaBody({
  multipart: true,
  formidable: {
    // uploadDir: 'public/uploads/file', // 设置文件存储路径
    maxFileSize: 200 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
  }
}))

/**
 * 日志文件输出
 */
// app.use(async (ctx, next) => {
//   // 响应开始时间
//   const start = new Date();
//   // 响应间隔时间                          
//   let intervals;
//   try {
//     await next();
//     intervals = new Date() - start;
//     //记录响应日志
//     logsUtil.logResponse(ctx, intervals);
//   } catch (error) {
//     intervals = new Date() - start;
//     //记录异常日志
//     logsUtil.logError(ctx, error, intervals);
//   }
// })

/*
 通过一个中间件，把所有的工具关联起来
*/
app.use(mysqlMiddleWare)
app.use(loggerMiddleWare)

// 返回数据处理
app.use(json())
// logger
app.use(logger())
// 返回页面处理
app.use(require('koa-static')(__dirname + '/public'))
app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// 不要jwt权限验证的接口 白名单
const unlessPath = ['/users/login', '/users/register', '/json']
const whiteList = [
  /^\/users\/login/,
  /^\/users\/register/,
  /^\/json/
]

// jwt验证处理方法
app.use(async (ctx, next) => {
  if (unlessPath.indexOf(ctx.url) !== -1) {
    await next()
  } else {
    if (ctx.header.cookie) {
      let list = ctx.header.cookie.split(';')
      let token = ''
      list.forEach(item => {
        let cookieKey = item.split('=')
        if (cookieKey[0] == 'Authorization') {
          token = cookieKey[1]
        }
      })
      // jwt校验及解密处理
      let payload = webToken(token)
      ctx.request.header['authorization'] = "Bearer " + (token || '')
      // ctx.request.header = { 'authorization': "Bearer " + (token || '') }
      //开始时间小于结束时间，代表token还有效
      if (payload.iat < payload.exp) {
        ctx.util.token = payload
        await next();
      } else {
        ctx.body = payload
      }
    } else {
      // 无jwt或恶意清空cookie
      ctx.body = { code: -4, msg: "无jwt或恶意清空cookie" }
    }
  }
})

// 权限验证
app.use(jwt({ secret: 'my_token' }).unless({ path: whiteList }));

// 无权限处理异常
app.use(async (ctx, next) => {
  return next().then(() => {
    // 无此路由异常处理 后期兼容更多状态
    if (ctx.status == 404) {
      ctx.body = {
        code: 44,
        msg: '无此接口地址，请检测您接口地址是否正确！！'
      }
    } else if (ctx.status == 500) {
      ctx.body = {
        code: 50,
        msg: '服务器错误，请稍后再试！'
      }
    }
  }).catch((err) => {
    // 错误状态处理
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        msg: err.message,
        description: 'Protected resource, use Authorization header to get access\n'
      }
    } else {
      throw err;
    }
  })
})

// routes
app.use(registerRouter())

// 错误监听
app.on('error', (err) => {
  console.error('server error', err.message);
});

console.log("项目启动http://127.0.0.1:3000")
module.exports = app
