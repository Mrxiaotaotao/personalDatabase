/**
 * 需要封装一个 列表 多层列表 单个数据查询 修改状态 修改某一个值 上传等公共类 以及 结构层
 * 
 * 此文件为mysql封装层
 * 接口 调用-->  封装层 --> sql公共类 及 接口层
 * 
 * 做此过滤 为了 方便 简洁 美观
 * 
 * 
 * mysql 我打算不放进 ctx 单独引用到此  或 单独引用到mysql公共类 中
 * 
 * 过滤层 还需要有一个返回值的过滤 来判断是否成功 不成功的话返回失败原因
 */
// 用户账号表
const jsonWebToken = require('jsonwebtoken')
const { requiredItem } = require('./index')
const { PsqlAdd, PsqlListSingle, PsqlListMultiple, PsqlModifyAsingle } = require('../api/sqlPublic')
const { SucessModel, ErrorModel } = require('../model/index.js')
const SqlTableUser = 'users', SqlTableUserInfo = 'userInfo'


// 测试多层数据
const aaaaaa = async (ctx, box) => {
    // let list = await ctx.util.mysql('SELECT * FROM users')
    // // console.log(list);
    // for (let i = 0; i < list.length; i++) {

    //     list[i].listTP = await ctx.util.mysql(`select * from userInfo where userId = ${list[i].id}`)
    // }
    // return list
    let name = ''
    // return PsqlAdd(userInfo, { userId: '2', text: '测试啦' })
    return PsqlListSingle('users', 'userId', '1610875250805')
    // return new Promise((resolve, reject) => {
    //     PsqlAdd(userInfo, { userId: '2', userImg: '测试啦' }).then(res => {
    //         resolve({
    //             name: res
    //         })
    //     }).catch(err => {
    //         resolve({
    //             name: err
    //         })
    //     })
    // })

}
// ************************——————————************************

// 登录接口
const users_login = async (ctx) => {
    try {
        // 必填项判断
        if (requiredItem(ctx, { userName: '用户名不能为空！', userPassWord: '密码不能为空！' })) {
            let body = ctx.request.body
            let name = body.userName
            let password = body.userPassWord
            // sql查询
            const [res] = await PsqlListMultiple(SqlTableUser, { userName: name, userPassWord: password })
            if (res) {

                const { userName, userId, nickname, gender, premission } = res
                const jwt = jsonWebToken.sign({ password, userId }, 'my_token', { expiresIn: premission == 0 ? (24 * 7) + 'h' : '2h' })
                ctx.cookies.set('Authorization', jwt)
                ctx.set('Authorization', jwt)
                ctx.cookies.set('Premission', premission)
                ctx.body = new SucessModel({ userName, userId, nickname, gender, premission }, '登陆成功')

            } else {
                ctx.body = new ErrorModel('用户名或密码错误！')
            }
        }
    } catch (error) {
        ctx.body = new ErrorModel(error)
    }
}

// 退出
const users_logout = (ctx) => {
    try {
        ctx.cookies.set('Authorization', '', { signed: false, maxAge: 0 })
        ctx.cookies.set('Premission', '', { signed: false, maxAge: 0 })
        ctx.body = new SucessModel('成功退出')
    } catch (error) {
        ctx.body = new ErrorModel(`${error}`)
    }
}

// 注册
const users_register = async (ctx) => {
    try {
        const { administrators, username, password, repassword, nickname } = ctx.request.body;
        // 生成id
        const userId = new Date().getTime().toFixed(0)

        if (administrators) {
            // 管理员
            const { gender, info, email, phone } = ctx.request.body;
            console.log(username, password, nickname, repassword, gender, info, email, phone, 'oiasdfoi茜')

            if (requiredItem(ctx, { username, password, nickname, repassword, gender, info, email, phone })) {
                let checkName = await users_register_check(username, password, repassword, nickname)
                if (checkName) {
                    return ctx.body = new ErrorModel(checkName)
                }
                const [res2] = await PsqlListSingle(SqlTableUser, 'email', email);//该邮箱是否注册过 
                const [res3] = await PsqlListSingle(SqlTableUser, 'phone', phone)//该号码是否注册过
                if (res2) {
                    return ctx.body = new ErrorModel('该邮箱已被注册！')
                }
                if (res3) {
                    return ctx.body = new ErrorModel('该手机号已被注册！')
                }
                let tableValueData = {
                    id: userId,
                    userId: username,
                    userName: '',
                    userPassWord: password,
                    premission: '1',
                    nickname,
                    gender,
                    info,
                    email,
                    phone
                }
                const data = await PsqlAdd(SqlTableUser, tableValueData)
                console.log(data.protocol41, 'asdfas');
                if (!data.protocol41) {
                    return ctx.body = data
                }
            }
        } else {
            // 用户
            const { username } = ctx.request.body;
            if (requiredItem(ctx, { username, password, nickname, repassword })) {
                let checkName = await users_register_check(username, password, repassword, nickname)
                if (checkName) {
                    return ctx.body = new ErrorModel(checkName)
                }
                let tableValueData = {
                    id: userId,
                    userId: username,
                    userName: '',
                    userPassWord: password,
                    premission: '0',
                    nickname
                }
                const data = await PsqlAdd(SqlTableUser, tableValueData)
                if (!data.protocol41) {
                    return ctx.body = data
                }
            }
        }

        ctx.body = new SucessModel('注册成功！')
    } catch (error) {
        ctx.body = new ErrorModel('error')
    }
}

// 修改密码
const users_changePassword = async (ctx) => {
    const { administrators, username, password, oldPassword, sqlKey = 'userId' } = ctx.request.body;
    console.log('Liuangt');
    if (administrators == 2) {
        if (requiredItem(ctx, { username, password })) {
            // 超级管理权限可以直接根据用户名改或其他唯一值更改密码
            let keyNameList = ['id', 'userId', 'email', 'phone']
            if (keyNameList.indexOf(sqlKey) == -1) sqlKey = 'userId';
            let [userFlag] = await PsqlListSingle(SqlTableUser, sqlKey, username)
            if (userFlag) {
                let data = {}
                data[sqlKey] = username
                let upPass = await PsqlModifyAsingle(SqlTableUser, { 'userPassWord': password }, data)
                if (upPass.protocol41) {
                    ctx.body = new SucessModel('密码修改成功')
                } else {
                    return ctx.body = upPass
                }
            } else {
                ctx.body = new ErrorModel("用户名或密码不正确")
            }
        }
    } else {
        // 用户及管理员处理方式
        if (requiredItem(ctx, { username, password, oldPassword })) {
            let [userFlag] = await PsqlListMultiple(SqlTableUser, { 'userId': username, userPassWord: oldPassword })
            if (userFlag) {
                let upPass = await PsqlModifyAsingle(SqlTableUser, { 'userPassWord': password }, { 'userId': username, userPassWord: oldPassword })
                if (upPass.protocol41) {
                    ctx.body = new SucessModel('密码修改成功')
                } else {
                    return ctx.body = upPass
                }
            } else {
                ctx.body = new ErrorModel("未查询到此用户或密码不正确")
            }
        }
    }
}

// 修改用户单个信息
const users_upDateRegister = async (ctx) => {
    if (requiredItem(ctx, ctx.request.body)) {
        ctx.body = new SucessModel('修改成功！')
    }
    // const { id, key, value } = ctx.request.body;
    // if (!id || !key || !value) {
    //   return ctx.body = new ErrorModel('必填项校验不通过')
    // }

    // ctx.body = new SucessModel('修改成功！')
}

// 个人数据添加及修改
const users_userInfo = async (ctx, deflag = false) => {
    ctx.body = 'adsf'
    if (deflag) {
        // 添加用户对应的详情表添加
        const data = await PsqlAdd(SqlTableUserInfo, { userId: deflag })
        if (!data.protocol41) {
            return ctx.body = data
        }
    } else {
        // 默认为修改个人数据
        const userId = new Date().getTime().toFixed(0)
        // nodejs生成UID（唯一标识符）——node-uuid模块
        const data = await PsqlAdd(SqlTableUserInfo, { userId })
        if (!data.protocol41) {
            return ctx.body = data
        }
    }
}

// 注册中校验公共方法
const users_register_check = async (username, password, repassword, nickname) => {
    if (password != repassword) {
        return '两次密码输入不一致！'
    }

    //用户名是否注册过
    const [user] = await PsqlListSingle(SqlTableUser, 'userId', username);
    if (user) {
        return '该用户名或账号已注册！'
    }

    const [nick] = await PsqlListSingle(SqlTableUser, 'nickname', nickname)
    if (nick) {
        return '该昵称已存在！'
    }
}

module.exports = {
    aaaaaa,
    users_login,
    users_logout,
    users_register,
    users_changePassword,
    users_upDateRegister,
    users_userInfo,
}