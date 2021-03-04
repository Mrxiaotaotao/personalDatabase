const router = require('koa-router')()
const { SucessModel, ErrorModel } = require('../model/index.js')
const { addUser, checkUserName, checkEmail, checkPhone, selectUser, checkNickname, aaaaaa } = require('../controller/users')
const { requiredItem } = require('../controller/index')
const { PsqlListMultiple, PsqlModifyAsingle } = require('../api/sqlPublic')


const { users_login, users_logout, users_register } = require('../controller/users')
router.prefix('/users')
const sqlTableUsers = 'users'
// 登录接口
// 4月添加管理员动态路由 配置 及用户锁定功能
router.post('/login', async function (ctx, next) {
  await users_login(ctx)
})

// 退出接口
router.post('/logout', async (ctx, next) => {
  await users_logout(ctx)
})
// Forgot password  忘记密码

// 修改密码接口
router.post('/changePassword', async (ctx, next) => {
  const { administrators, username, password, oldPassword, sqlKey = 'userId' } = ctx.request.body;
  console.log('Liuangt');
  if (administrators == 2) {
    // 超级管理权限可以直接根据用户名改或其他唯一值更改密码
    let keyNameList = ['id', 'userId', 'email', 'phone']
    console.log(keyNameList.indexOf('user2Id'))
    if (keyNameList.indexOf('user2Id') == -1) sqlKey = 'userId';
    let [userFlag] = PsqlListSingle(sqlTableUsers, sqlKey, username)
    if (userFlag) {
      let upPass = await PsqlModifyAsingle(sqlTableUsers, 'userPassWord', password, { userId: username })
      if (upPass) {
        ctx.body = new SucessModel('密码修改成功')
      } else {
        ctx.body = new ErrorModel('修改失败')
      }
    } else {
      ctx.body = new ErrorModel("用户名或密码不正确")
    }
  } else {
    // 用户及管理员处理方式
    if (username && password && oldPassword) {
      let [userFlag] = await PsqlListMultiple(sqlTableUsers, { 'userId': username, userPassWord: oldPassword })
      if (userFlag) {
        let upPass = await PsqlModifyAsingle(sqlTableUsers, 'userPassWord', password, { userId: username })
        if (upPass) {
          ctx.body = new SucessModel('密码修改成功')
        } else {
          ctx.body = new ErrorModel('修改失败')
        }
      } else {
        ctx.body = new ErrorModel("用户名或密码不正确")
      }
    } else {
      ctx.body = new ErrorModel('缺少参数')
    }
  }

})
// 测试接口
router.post('/bar', async function (ctx, next) {
  ctx.body = await aaaaaa(ctx)
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
 *      administrators  管理员标注位 0 用户 1 管理员 2 超级管理员 
 * 
 *  邮箱 电话 名称 密码 验证未加
 */

router.post('/register', async function (ctx, next) {
  await users_register(ctx)
})

/**
 * 添加、修改用户单个信息
 * 入参
 *  id 用户标识
 *  key 修改标识 nickname gender email phone info
 *  value 修改后的数据
 */
router.post('/upDateRegister', function (ctx, next) {
  const { id, key, value } = ctx.request.body;
  if (!id || !key || !value) {
    return ctx.body = new ErrorModel('必填项校验不通过')
  }

  ctx.body = new SucessModel('修改成功！')
})

// 个人数据添加
router.post('/userInfo', async (ctx, next) => {
  // ctx.body = 'aaaaa'
  if (requiredItem(ctx, { name: '' })) {
    ctx.body = 'liujiangto'
  }

})

module.exports = router
