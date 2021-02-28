const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const jwt = require('koa-jwt');

const { mysqlMiddleWare } = require('./applaymiddleware/mysqlMiddleWare')
const { loggerMiddleWare } = require('./applaymiddleware/loggerMiddleWare')
// 这里要改成动态获取路径 和循环挂载到app.use里
const index = require('./routes/index')
const users = require('./routes/users')


const koaBody = require('koa-body');

app.use(koaBody({
  multipart: true,
  formidable: {
    // uploadDir: 'public/uploads/file',
    maxFileSize: 200 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
  }
}))

// error handler
onerror(app)
/*
 通过一个中间件，把所有的工具关联起来
*/
app.use(mysqlMiddleWare)
// logger
app.use(loggerMiddleWare)

// middlewares
// app.use(bodyparser({
//   enableTypes: ['json', 'form', 'text']
// }))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))


// 20210202 Mrxiaotaotao 原因 正处于开发阶段暂时关闭，为了方便测试其他接口情况 如有需要请自行解开
//不要jwt权限验证的接口
// const whiteList = [
//   /^\/users\/login/,
//   /^\/users\/register/
// ]
// app.use(jwt({ secret: 'shhhhh' }).unless({ path: whiteList }));//权限验证
// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

console.log("项目启动http://127.0.0.1:3000")
module.exports = app
