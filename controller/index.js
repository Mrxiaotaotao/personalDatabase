const { SucessModel, ErrorModel } = require('../model/index.js')

/**
 * 此文件夹为封装层 
 * 此文件主要做验证处理方式
 * 需要ctx 必传参数
 */

/**
 *  必填项校验
 * @param {*} ctx 上下文字段
 * @param {*} data 类型 Object { 验证的字段名 : 要提示的备注 } 验证字段及提示备注 没有提示备注及为【xxx字段为必传项】
 */
const requiredItem = (ctx, data) => {
    let ctxBody = '', flag = true, body = ctx.request && ctx.request.body || {};
    try {
        Object.keys(data).forEach(item => {
            // console.log(item, data[item]);
            if (!body[item]) {
                flag = false
                ctxBody = data[item] || item + "字段为必传项"
                throw Error();
            }
        })
    } catch (error) {
        ctx.body = new ErrorModel(ctxBody)
    }
    return flag
}

const userNum = (ctx, data) => {
    try {

    } catch (error) {

    }
}


module.exports = { requiredItem, userNum }