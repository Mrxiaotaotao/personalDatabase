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
const { PsqlAdd } = require('../api/sqlPublic')

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
    return new Promise((resolve, reject) => {
        PsqlAdd(userInfo, { userId2: '2', text: '测试啦' }).then(res => {
            resolve({
                name: res
            })
        }).catch(err => {
            resolve({
                name: err
            })
        })
    })

}


module.exports = {
    addUser,
    checkUserName,
    checkEmail,
    checkNickname,
    checkPhone,
    selectUser,
    checkKey,
    aaaaaa
}