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
let users = 'users', userInfo = 'userInfo'
let SqlTableUser = 'users'
const { PsqlAdd, PsqlListSingle, PsqlListMultiple } = require('../api/sqlPublic')
// const { PsqlListMultiple } = require('../api/sqlPublic')

const addUser = async (ctx, body) => {
    const { userId, username, password, nickname, gender, info, email, phone } = body
    let sql = `INSERT INTO personal_database.users (userId,userName,userPassWord,premission,nickname,gender,info,email,phone) values ('${userId}','${username}','${password}',0,'${nickname}','${gender}','${info}','${email}','${phone}');`
    return await ctx.util.mysql(sql)
}

const checkUserName = async (ctx, body) => {
    const { username } = body
    let sql = `select * from users where userName='${username}'`
    return await ctx.util.mysql(sql)
}

const checkEmail = async (ctx, body) => {
    const { email } = body
    let sql = `select * from users where email='${email}'`
    return await ctx.util.mysql(sql)
}

const checkNickname = async (ctx, body) => {
    const { nickname } = body
    let sql = `select * from users where nickname='${nickname}'`
    return await ctx.util.mysql(sql)
}

const checkPhone = async (ctx, body) => {
    const { phone } = body
    let sql = `select * from users where phone='${phone}'`
    return await ctx.util.mysql(sql)
}

// 修改用户的单个数据
const checkKey = async (ctx, body) => {
    const { key, value } = body
    let sql = `select * from users where ${key}='${value}'`
    return await ctx.util.mysql(sql)
}


const selectUser = async (ctx, body) => {
    const { name, password } = body
    let sql = `select * from users where userName = '${name}' and userPassWord='${password}'`
    // sql查询
    return await ctx.util.mysql(sql)
}

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
const jsonWebToken = require('jsonwebtoken')
const { requiredItem } = require('./index')
const { SucessModel, ErrorModel } = require('../model/index.js')


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
    addUser,
    checkUserName,
    checkEmail,
    checkNickname,
    checkPhone,
    selectUser,
    checkKey,
    aaaaaa,
    users_login,
    users_logout,
    users_register
}