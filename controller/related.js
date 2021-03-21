const { requiredItem, extractUserId, extractUserNum, ruleID } = require('./index')
const { SucessModel, ErrorModel } = require('../model/index.js')
const { PsqlAdd, PsqlDelSingle, PsqlQuery, PsqlModifyAsingle } = require('../api/sqlPublic');
const SqlTableAttentionTable = 'attentionTable',
    SqlTableUserInfo = 'userInfo',
    SqlTableUsers = 'users',
    SqlTableFavoritesTable = 'favoritesTable';
/**
 * 
 * 关注 粉丝 统计 分组等
 */

const related_query = async (ctx) => {

}

// 关注 ta id  + id  find wo
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
        let { id } = ctx.request.body
        if (requiredItem(ctx, { id })) {
            let userId = extractUserId(ctx),
                [flag] = await PsqlQuery(SqlTableAttentionTable, { fansId: userId, blogUserId: id }),
                [userNum] = await PsqlQuery(SqlTableUserInfo, { userId: id }, false, false, { fansNum: '' }),
                data = '';

            if (type) {
                if (flag) {
                    data = await PsqlDelSingle(SqlTableAttentionTable, { fansId: userId, blogUserId: id })
                    userNum.fansNum--
                } else {
                    return ctx.body = new ErrorModel('取消关注失败，已取消关注')
                }
            } else {
                if (flag) {
                    return ctx.body = new ErrorModel('关注失败，已关注')
                }
                data = await PsqlAdd(SqlTableAttentionTable, { fansId: userId, blogUserId: id })
                userNum.fansNum++

            }
            console.log(userNum.fansNum, '9');
            await extractUserNum({ fansNum: userNum.fansNum }, id)
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
// type fans -> 粉丝  attention -> 关注
const related_queryFanstA = async (ctx) => {
    try {
        let { type } = ctx.request.body
        let userId = extractUserId(ctx)
        if (requiredItem(ctx, { type })) {
            let tableData = {
                [SqlTableAttentionTable]: '',
                [SqlTableUserInfo]: ''
            }, queryData = {}

            if (type == 'fans') {
                tableData[SqlTableUserInfo] = `${SqlTableAttentionTable}.fansId = ${SqlTableUserInfo}.userId`
                tableData[SqlTableUsers] = `${SqlTableAttentionTable}.fansId = ${SqlTableUsers}.id`
                queryData = { blogUserId: userId }

            } else if (type == 'attention') {
                tableData[SqlTableUserInfo] = `${SqlTableAttentionTable}.blogUserId = ${SqlTableUserInfo}.userId`
                tableData[SqlTableUsers] = `${SqlTableAttentionTable}.blogUserId = ${SqlTableUsers}.id`
                queryData = { fansId: userId }

            } else {
                return ctx.body = new ErrorModel("类型错误")
            }
            // 展示 头像 码龄 昵称
            let data = await PsqlQuery(tableData, queryData, false, false, { userImg: "", userTime: '', nickname: '' })
            ctx.body = new SucessModel(data)
        }

    } catch (error) {
        ctx.body = new ErrorModel(error, '接口异常')
    }
}

// 收藏 
/**
 * 收藏接口
 * @body { String,Number } blogUserId Y  博客用户的id
 * @body { String,Number } blogId Y 博客的id
 * @returns { "msg": "已关注","code": 0}
 */
const related_favorites = async (ctx) => {
    try {
        let { blogUserId, blogId } = ctx.request.body
        if (requiredItem(ctx, { blogUserId, blogId })) {
            let [favoritesFlag] = await PsqlQuery(SqlTableFavoritesTable, { userId: extractUserId(ctx), blogUserId, blogId })
            if (favoritesFlag) {
                return ctx.body = new ErrorModel('已收藏')
            }
            let data = await PsqlAdd(SqlTableFavoritesTable, { id: ruleID(), userId: extractUserId(ctx), blogUserId, blogId })
            if (data.protocol41) {
                ctx.body = new SucessModel('收藏成功')
            } else {
                ctx.body = new ErrorModel(data, '请稍后再试')
            }
        }
    } catch (error) {
        ctx.body = new ErrorModel(error, '接口异常')
    }
}

/**
 * 取消收藏接口
 * @body { String,Number } favoritesId Y  博客用户的id
 * @returns { "msg": "取消收藏成功", "code": 0 }
 */
const related_unfavorites = async (ctx) => {
    try {
        let { favoritesId } = ctx.request.body
        if (requiredItem(ctx, { favoritesId })) {
            let userId = extractUserId(ctx)
            let [favoritesFlag] = await PsqlQuery(SqlTableFavoritesTable, { id: favoritesId, userId })
            if (!favoritesFlag) {
                return ctx.body = new ErrorModel('已取消收藏或此收藏不存在')
            }
            data = await PsqlDelSingle(SqlTableFavoritesTable, { id: favoritesId, userId })
            console.log(data);
            if (data.protocol41) {
                ctx.body = new SucessModel('取消收藏成功')
            } else {
                ctx.body = new ErrorModel(data, '请稍后再试')
            }
        }
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