const fs = require('fs');
const { SucessModel, ErrorModel } = require('../model/index.js')
const { PsqlModifyAsingle } = require('../api/sqlPublic');
const SqlTableUserInfo = 'userInfo';
const uploadsName = ['avater', 'file', 'image'];

/**
 * 此文件夹为封装层 
 * 此文件主要做验证处理方式
 * 需要ctx 必传参数
 */

/**
 *  必填项校验
 * @param {*} ctx 必传 上下文字段
 * @param {*} data 类型 Object { 验证的字段名 : 要提示的备注 } 验证字段及提示备注 没有提示备注及为【xxx字段为必传项】
 */
const requiredItem = (ctx, data) => {
    let ctxBody = '', flag = true, body = ctx.request && ctx.request.body || {};
    try {
        if (!ctx.request) {
            throw Error()
        }

        if (typeof data != 'object') {
            ctxBody = '类型错误'
            throw Error()
        }

        Object.keys(data).forEach(item => {
            if (!body[item]) {
                flag = false
                ctxBody = data[item] || item + "字段为必传项"
                throw Error();
            }
        })
    } catch (error) {
        flag = false
        ctx.body = new ErrorModel(ctxBody)
    }
    return flag
}

// 用户统计处理
const extractUserNum = (upData, id) => {
    try {
        PsqlModifyAsingle(SqlTableUserInfo, { ...upData }, { userId: id })
    } catch (error) {

    }
}

// 积分处理


// ID 统一生成规则处理
const ruleID = (ctx, data) => {
    let timeLs = new Date().getTime().toFixed(0)
    let mathLs = Math.floor(Math.random() * 10000)
    return `${timeLs}${mathLs}`
}

// 日期处理
const ruleTime = (value, fmt = 'yyyy-MM-dd HH:mm:ss') => {

    let d = value ? new Date(value) : new Date()
    let o = {
        'M+': d.getMonth() + 1, // 月份
        'd+': d.getDate(), // 日
        'H+': d.getHours(), // 小时
        'm+': d.getMinutes(), // 分
        's+': d.getSeconds(), // 秒
        'q+': Math.floor((d.getMonth() + 3) / 3), // 季度
        S: d.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (d.getFullYear() + '').substr(4 - RegExp.$1.length)
        )
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1
                    ? o[k]
                    : ('00' + o[k]).substr(('' + o[k]).length)
            )
        }
    }
    return fmt

}

// 用户id提取
const extractUserId = (ctx) => {
    if (ctx) return ctx.util.token.ID
    else return ''
}

// 文件上传处理
// const processUploadFile = (ctx, typeName) => {

//     try {
//         const file = ctx?.request?.files?.file || {}; // 获取上传文件
//         if (file.path && uploadsName.indexOf(typeName) !== -1) {
//             const reader = fs.createReadStream(file.path); // 创建可读流
//             const flile_name = Date.now() + "_" + file.name
//             const upStream = fs.createWriteStream(`public/uploads/${typeName}/${flile_name}`); // 创建可写流
//             reader.pipe(upStream); // 可读流通过管道写入可写流
//             console.log(ctx.request.header['x-forwarded-proto'] + '://' + ctx.request.header.host, '文件前缀展示');
//             return `/uploads/${typeName}/${flile_name}`
//         } else {
//             return false
//         }
//     } catch (error) {
//         return false
//     }
// }

// 删除文件
const delFiles = (filesName, typeName) => {
    try {
        if (filesName && typeName && uploadsName.indexOf(typeName) !== -1) {
            fs.unlinkSync(`public/uploads/${typeName}/${filesName}`)
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

module.exports = {
    requiredItem,
    extractUserNum,
    ruleID,
    ruleTime,
    extractUserId,
    // processUploadFile,
    delFiles
}