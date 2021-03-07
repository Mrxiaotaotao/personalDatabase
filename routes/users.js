// 用户接口
const router = require('koa-router')()
router.prefix('/users')
const {
  users_login,
  users_logout,
  users_register,
  users_changePassword,
  users_upDateRegister,
  users_userInfo,
  aaaaaa
} = require('../controller/users')

// 登录接口
// 4月添加管理员动态路由 配置 及用户锁定功能
router.post('/login', async (ctx) => {
  await users_login(ctx)
})

// 退出接口
router.post('/logout', async (ctx) => {
  await users_logout(ctx)
})

// Forgot password  忘记密码

// 修改密码接口
router.post('/changePassword', async (ctx) => {
  await users_changePassword(ctx)
})

//注册
/**
 * 入参：username:string--用户名
 *      password:string--密码
 *      nickname:string -- 昵称
 *      repassword:string --重复确认输入的密码
 *      gender:'0'|'1' ---- 性别 0女 1男
 *      email: string ----邮箱
 *      phone:string ----电话
 *      info:string ---- 自我介绍
 *      administrators  管理员标注位 0 用户 1 管理员 2 超级管理员 
 * 
 *  邮箱 电话 名称 密码 验证未加
 */
router.post('/register', async (ctx) => {
  await users_register(ctx)
})

/**
 * 添加、修改用户单个信息
 * 入参
 *  id 用户标识
 *  key 修改标识 nickname gender email phone info
 *  value 修改后的数据
 */
router.post('/upDateRegister', async (ctx) => {
  await users_upDateRegister(ctx)
})

// 个人数据添加及修改
router.post('/userInfo', async (ctx) => {
  await users_userInfo(ctx)
})

// 测试接口
router.post('/bar', async function (ctx) {
  ctx.body = await aaaaaa(ctx)
})



module.exports = router
