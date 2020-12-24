const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const { mysqlMiddleWare } = require('./applaymiddleware/mysqlMiddleWare')
const { loggerMiddleWare } = require('./applaymiddleware/loggerMiddleWare')
const index = require('./routes/index')
const users = require('./routes/users')

// error handler
onerror(app)
/*
 通过一个中间件，把所有的工具关联起来
*/
app.use(mysqlMiddleWare)
// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(loggerMiddleWare)

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

console.log("项目启动http://127.0.0.1:3000")
module.exports = app
