const router = require('koa-router')()
const { SucessModel, ErrorModel } = require('../model/index.js')
// const upload = require('../upload')
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

const { socketSend } = require("../utils/websocket")

router.get('/json', async (ctx, next) => {
  socketSend('koa2 json')
  ctx.body = {
    title: 'koa2 json'
  }
})

// router.post('/upload', upload.single('file'), async (ctx, next) => {
//   // ctx.body = {
//   //   filename: ctx.request.header.host + '/uploads/file/' + ctx.req.file.filename //返回文件名
//   // }
//   ctx.body = {
//     filename: ctx.req.file.filename //返回文件名
//   }
// })
const fs = require('fs');

router.post('/uploads', async (ctx) => {
  console.log(ctx.request, '[][-=-=-=');
  const file = ctx.request.files.file; // 获取上传文件
  // console.log(file);
  if (file.path) {
    const reader = fs.createReadStream(file.path); // 创建可读流
    const flile_name = Date.now() + "_" + file.name
    const upStream = fs.createWriteStream(`public/uploads/file/${flile_name}`); // 创建可写流
    reader.pipe(upStream); // 可读流通过管道写入可写流
    return ctx.body = {
      filename: ctx.request.files,
      a: ctx.request.header['x-forwarded-proto'] + '://' + ctx.request.header.host + '/uploads/file/' + flile_name
    }
  } else {
    return ctx.body = '不能为空'
  }

})


router.post('/del', async (ctx) => {
  fs.unlinkSync('public/uploads/file/' + '1613798317481_bg.gif')
  return ctx.body = 'ok'
})
module.exports = router
