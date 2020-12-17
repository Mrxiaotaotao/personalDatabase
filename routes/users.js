const router = require('koa-router')()

router.prefix('/users')

router.post('/login', async function (ctx, next) {
  // 参数非空判断
  if (ctx && ctx.request && ctx.request.body) {
    let body = ctx.request.body
    if (!body.userName) {
      ctx.body = { msg: "userName不能为空", code: 201 };
      return false
    }
    if (!body.userPassWord) {
      ctx.body = { msg: "userPassWord不能为空", code: 201 };
      return false
    }
    let name = body.userName
    let password = body.userPassWord
    // sql语句
    let sql = `select * from users where userName = '${name}' and userPassWord=${password}`
    // sql查询
    await ctx.util.mysql(sql).then((res) => {
      ctx.cookies.set('book', 'liujiangtaoceshi')
      ctx.body = { msg: "登录成功", code: 200 };//返回给前端的数据
    })
  } else {
    ctx.body = { msg: "数据异常", code: 500 };//返回给前端的数据
  }
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})


module.exports = router
