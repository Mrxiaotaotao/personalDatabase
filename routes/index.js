const router = require('koa-router')()
const { SucessModel, ErrorModel } = require('../model/index.js')
const upload = require('../upload')
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

router.post('/upload', upload.single('file'), async (ctx, next) => {
  let a = await router.get('/json')
  ctx.body = {
    filename: 'http://127.0.0.1:3000/uploads/file/' + ctx.req.file.filename //返回文件名
  }
})

module.exports = router
