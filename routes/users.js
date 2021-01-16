const router = require('koa-router')()
const jsonWebToken = require('jsonwebtoken')
const { SucessModel, ErrorModel } = require('../model/index.js')
const { addUser, checkUserName, checkEmail, checkPhone, selectUser, checkNickname } = require('../controller/users')
router.prefix('/users')
//登录接口
router.post('/login', async function (ctx, next) {
  // 参数非空判断
  if (ctx && ctx.request && ctx.request.body) {
    let body = ctx.request.body
    if (!body.userName) {
      ctx.body = new ErrorModel('用户名不能为空！')
      return false
    }
    if (!body.userPassWord) {
      ctx.body = new ErrorModel('密码不能为空！');
      return false
    }
    let name = body.userName
    let password = body.userPassWord
    // sql语句
    console.log(name, password, '  name&password')
    const [res] = await selectUser(ctx, { name, password })
    if (res) {
      console.log(res)
      const { userName, userId, nickname, gender } = res
      //ctx.cookies.set('book', 'liujiangtaoceshi')
      const jwt = jsonWebToken.sign({ userName, userId }, 'shhhhh')
      ctx.set('Authorization', jwt)
      ctx.body = new SucessModel({ userId, nickname, gender }, '登陆成功')
    } else {
      ctx.body = new ErrorModel('用户名或密码错误！')
    }
  } else {
    ctx.body = new ErrorModel('查询异常')
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
 *      gender:'0'|'1' ---- 性别 0女 1男
 *      email: string ----邮箱
 *      phone:string ----电话
 *      info:string ---- 自我介绍
 *      administrators  管理员标注位 true 管理员 false 用户
 */

router.post('/register', async function (ctx, next) {
  console.log('测试用好');
  const { administrators, username, password, repassword, nickname } = ctx.request.body;
  if (password != repassword) {
    return ctx.body = new ErrorModel('两次密码输入不一致！')
  }
  //用户名是否注册过
  const [res1] = await checkUserName(ctx, { username });
  if (res1) {
    return ctx.body = new ErrorModel('该用户名已注册！')
  }
  const [res4] = await checkNickname(ctx, { nickname })
  // 生成id
  const userId = new Date().getTime().toFixed(0)

  if (administrators) {
    // 管理员
    const { nickname, gender, info, email, phone } = ctx.request.body;
    console.log(username, password, nickname, repassword, gender, info, email, phone)
    if (!username || !password || !nickname || !repassword || !gender || !info || !email || !phone) {
      return ctx.body = new ErrorModel('输入的信息不完整！')
    }

    const [res2] = await checkEmail(ctx, { email });//该邮箱是否注册过
    const [res3] = await checkPhone(ctx, { phone })//该号码是否注册过
    if (res2) {
      return ctx.body = new ErrorModel('该邮箱已被注册！')
    }
    if (res3) {
      return ctx.body = new ErrorModel('该手机号已被注册！')
    }

    const data = await addUser(ctx, { userId, username, password, nickname, gender, info, email, phone })

  } else {
    console.log('陈永红');
    // 用户
    const { username } = ctx.request.body;
    if (!username || !password || !nickname || !repassword) {
      return ctx.body = new ErrorModel('输入的信息不完整！')
    }
    const data = await addUser(ctx, { userId, username, password, nickname, gender: '', info: '', email: '', phone: '' })
  }

  ctx.body = new SucessModel('注册成功！')

})

/**
 * 添加、修改用户单个信息
 * 入参
 *  id 用户标识
 *  key 修改标识 nickname gender email phone info
 *  value 修改后的数据
 */
router.post('upDateRegister', function (ctx, next) {
  const { id, key, value } = ctx.request.body;
  if (!id || !key || !value) {
    return ctx.body = new ErrorModel('必填项校验不通过')
  }
  ctx.body = new SucessModel('修改成功！')
})


module.exports = router
