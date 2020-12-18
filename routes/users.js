const router = require('koa-router')()
const  createData = require('../model/index.js')
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

//注册--liwen
/**
 * 入参：username:string--用户名
 *      password:string--密码
 *      nickname:string -- 昵称
 *      repassword:string --重复确认输入的密码
 *      gender:'0'|'1' ---- 性别
 *      email: string ----邮箱
 *      phone:string ----电话
 *      info:string ---- 自我介绍
 */

router.post('/register', async function (ctx, next) {
  ctx.set('Content-Type','application/json; charset=utf-8');

   const {username,password,nickname,repassword,gender,info,email,phone} = ctx.request.body;
   console.log(username,password,nickname,repassword,gender,info,email,phone)
   if(!username||!password||!nickname||!repassword||!gender||!info||!email||!phone){
   
    return ctx.body=createData('输入的信息不完整！','01',)
  }
  if(password!=repassword){
   return ctx.body=createData('两次密码输入不一致！','02',)
  }
  
  let sql = `INSERT INTO personal_database.users (userName,userPassWord,premission,nickname,gender,info,email,phone) values ('${username}','${password}',0,'${nickname}','${gender}','${info}','${email}','${phone}');`
  console.log(sql)
  await ctx.util.mysql(sql).then((res) => {
    
    ctx.body = createData('新增用户成功','200');//返回给前端的数据
  }).catch((erro)=>{
    ctx.body = createData('新增用户失败',erro.toString());
  })
})

module.exports = router
