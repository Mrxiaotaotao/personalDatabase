const { requiredItem } = require('./index')
const { SucessModel, ErrorModel } = require('../model/index.js')
const { PsqlAdd, PsqlDelSingle, PsqlQuery } = require('../api/sqlPublic');
const SqlTableAttentionTable = 'attentionTable',
    SqlTableUserInfo = 'userInfo';
/**
 * 
 * 关注 粉丝 统计 分组等
 */

const related_query = async (ctx) => {

}

// 关注
const related_attention = async (ctx) => {
    await attentionFN(ctx)
}

// 取消关注
const related_unsubscribe = async (ctx) => {
    await attentionFN(ctx, true)
}

// 关注提取
const attentionFN = async (ctx, type) => {
    try {
        let { fansId, blogUserId } = ctx.request.body
        if (requiredItem(ctx, { fansId, blogUserId })) {
            let [flag] = await PsqlQuery(SqlTableAttentionTable, { fansId, blogUserId }),
                data = '';
            if (type) {
                if (flag) {
                    data = await PsqlDelSingle(SqlTableAttentionTable, { fansId, blogUserId })
                } else {
                    return ctx.body = new ErrorModel('取消关注失败，已取消关注')
                }
            } else {
                if (flag) {
                    return ctx.body = new ErrorModel('关注失败，已关注')
                }
                data = await PsqlAdd(SqlTableAttentionTable, { fansId, blogUserId })
            }
            console.log(data);
            if (data.protocol41) {
                ctx.body = new SucessModel(`已${type ? '取消' : ''}关注`)
            } else {
                ctx.body = new ErrorModel(data, '请稍后再试')
            }
        }

    } catch (error) {
        ctx.body = new ErrorModel(error, '接口异常')
    }
}

// 粉丝及关注查询
// fansId date 出生 开发时间
// blogUserId
const related_queryFanstA = async (ctx) => {
    try {
        let { type } = ctx.request.body
        console.log(ctx.util.token, '90909');
        let userId = ctx.util.token.jwt
        if (requiredItem(ctx, { type })) {
            let tableData = {
                [SqlTableAttentionTable]: '',
                [SqlTableUserInfo]: ''
            }

            if (type == 'fans') {

                tableData[SqlTableUserInfo] = `${SqlTableAttentionTable}.fansId = ${SqlTableUserInfo}.userId`
            } else if (type == 'attention') {
                tableData[SqlTableUserInfo] = `${SqlTableAttentionTable}.blogUserId = ${SqlTableUserInfo}.userId`
            } else {
                return ctx.body = new ErrorModel("类型错误")
            }
            console.log(tableData, '90909')
            let data = await PsqlQuery(tableData, { fansId: userId }, false, false, { userImg: "", userTime: '' })
            ctx.body = new SucessModel(data)
        }

    } catch (error) {
        ctx.body = new ErrorModel(error, '接口异常')
    }
}

// 收藏 
const related_favorites = async (ctx) => {
    try {

    } catch (error) {
        ctx.body = new ErrorModel(error, '接口异常')
    }
}

// 取消收藏 
const related_unfavorites = async (ctx) => {
    try {

    } catch (error) {
        ctx.body = new ErrorModel(error, '接口异常')
    }
}

// 分类
const related_QueryClass = async (ctx) => {
    try {

    } catch (error) {
        ctx.body = new ErrorModel(error, '接口异常')
    }
}
// 修改分类
const related_upClass = async (ctx) => {
    try {

    } catch (error) {
        ctx.body = new ErrorModel(error, '接口异常')
    }
}

// 添加分类
const related_addClass = async (ctx) => {
    try {

    } catch (error) {
        ctx.body = new ErrorModel(error, '接口异常')
    }
}

// 评论查询
const related_comment = async (ctx) => {
    try {

    } catch (error) {
        ctx.body = new ErrorModel(error, '接口异常')
    }
}

// 添加评论
const related_addComment = async (ctx) => {
    try {

    } catch (error) {
        ctx.body = new ErrorModel(error, '接口异常')
    }
}

// 修改评论
const related_upComment = async (ctx) => {
    try {

    } catch (error) {
        ctx.body = new ErrorModel(error, '接口异常')
    }
}

// 删除评论
const related_delComment = async (ctx) => {
    try {

    } catch (error) {
        ctx.body = new ErrorModel(error, '接口异常')
    }
}






module.exports = {
    related_query,
    related_attention,
    related_unsubscribe,
    related_queryFanstA,
    related_favorites,
    related_unfavorites,
    related_QueryClass,
    related_upClass,
    related_addClass,
    related_comment,
    related_addComment,
    related_upComment,
    related_delComment,
}