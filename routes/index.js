const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  await ctx.util.mysql(`select * from users`).then((res) => {
    // ctx.cookies.set(name, value, [options])
    // ctx.cookies.set('tex', '11')
    ctx.body = res;//返回给前端的数据

  })
})

// router.get('/json', async (ctx, next) => {
//   ctx.body = 'koa2 string'
// })

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
