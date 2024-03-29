const { requiredItem, extractUserId, extractUserNum, ruleID, ruleTime } = require('./index')
const { SucessModel, ErrorModel } = require('../model/index.js')
const { PsqlAdd, PsqlDelSingle, PsqlQuery, PsqlModifyAsingle } = require('../api/sqlPublic');
const SqlTableAttentionTable = 'attentionTable',
    SqlTableUserInfo = 'userInfo',
    SqlTableUsers = 'users',
    SqlTableFavoritesTable = 'favoritesTable',
    SqlTableClassificationTable = 'classificationTable',
    SqlTableCommentTable = 'commentTable',
    SqlTableBlogTable = 'blogTable',
    SqlTableLabelTable = 'labelTable';
/**
 * 
 * 关注 粉丝 统计 分组等
 * 22-23 测试图片上传加上其他参数的接口
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
        ctx.body = new ErrorModel(error, '')
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
        ctx.body = new ErrorModel(error, '')
    }
}

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
        ctx.body = new ErrorModel(error, '')
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
        ctx.body = new ErrorModel(error, '')
    }
}

// 分类查询
const related_QueryClass = async (ctx) => {
    try {
        let { type } = ctx.request.body, userId = extractUserId(ctx), data = []
        if (type == '1' || type == '0') {
            data = await PsqlQuery(SqlTableClassificationTable, { userId, display: type })
        } else {
            return ctx.body = new ErrorModel('type不能为空或值不正确')
        }
        ctx.body = new SucessModel(data)
    } catch (error) {
        ctx.body = new ErrorModel(error, '')
    }
}
// 修改分类 介绍
const related_upClass = async (ctx) => {
    try {
        let { className, classInfo, del, classId } = ctx.request.body,
            requiredData = { classId }
        if (!del) {
            requiredData.className = className
        }
        if (requiredItem(ctx, requiredData)) {
            let userId = extractUserId(ctx),
                upData = {}
            if (del) {
                upData.del = '0'
            } else {
                upData = {
                    className,
                    introduce: classInfo || ''
                }
            }
            let data = await PsqlModifyAsingle(SqlTableClassificationTable, upData, { id: classId, userId })

            if (data.protocol41) {
                ctx.body = new SucessModel(del ? '恢复成功' : '分类修改成功')
            } else {
                ctx.body = new ErrorModel(data, '修改失败，请稍后再试')
            }
        }
    } catch (error) {
        ctx.body = new ErrorModel(error, '')
    }
}

/**
 * 添加分类
 * @body { String } className Y  分类名称
 * @body { String } classInfo N  分类简介
 * @returns { "msg": "成功添加分类", "code": 0 }
 */
const related_addClass = async (ctx) => {
    try {
        let { className, classInfo } = ctx.request.body
        if (requiredItem(ctx, { className })) {
            let userId = extractUserId(ctx)
            let [nameFlag] = await PsqlQuery(SqlTableClassificationTable, { userId, className })
            if (nameFlag) {
                return ctx.body = new ErrorModel('该分类已存在')
            }
            let addData = {
                id: ruleID(),
                userId,
                className,
                classimage: '/uploads/avater/user.jpeg',
                top: '0',
                introduce: classInfo || ''
            }
            let data = await PsqlAdd(SqlTableClassificationTable, addData)
            if (data.protocol41) {
                ctx.body = new SucessModel('成功添加分类')
            } else {
                ctx.body = new ErrorModel(data, '添加失败，请稍后再试')
            }
        }
    } catch (error) {
        ctx.body = new ErrorModel(error, '')
    }
}

/**
 * 删除分类
 * @body { String,Number } classId Y  分类id
 * @body { String,Boolean } thoroughFlag N 是否彻底删除 true | '1'
 * @returns { "msg": "删除成功", "code": 0 }
 */
const related_delClass = async (ctx) => {
    try {
        let { classId, thoroughFlag } = ctx.request.body
        if (requiredItem(ctx, { classId })) {
            let userId = extractUserId(ctx), data = '', msg = ''
            if (thoroughFlag) {
                data = await PsqlDelSingle(SqlTableClassificationTable, { id: classId, userId })
            } else {
                data = await PsqlModifyAsingle(SqlTableClassificationTable, { del: '1' }, { id: classId, userId })
            }
            if (data.protocol41) {
                ctx.body = new SucessModel('删除成功')
            } else {
                ctx.body = new ErrorModel(data, '删除失败，请稍后再试')
            }
        }
    } catch (error) {
        ctx.body = new ErrorModel(error, '')
    }
}

// 评论查询
const related_comment = async (ctx) => {
    console.log(ctx.request.header, 'ctx.request.header.host');
    try {
        // userId blogId
        let { type, blogId } = ctx.request.body
        if (type) {
            // 后期合并一下处理
            if (type == '0') {
                // 我的文章评论
                let tableData = { [SqlTableCommentTable]: "" }
                tableData[SqlTableBlogTable] = `${SqlTableCommentTable}.blogId = ${SqlTableBlogTable}.id`
                tableData[SqlTableUsers] = `${SqlTableBlogTable}.userId = ${SqlTableUsers}.id`
                let data = await PsqlQuery(tableData, { blogUserId: extractUserId(ctx) }, false, false, { time: "", commentContent: '', title: '', nickname: '', userName: '' })
                ctx.body = new SucessModel(data)
            } else if (type == '1') {
                // 待我审核的评论
            } else if (type == '2') {
                // 我发表的评论
                let tableData = { [SqlTableCommentTable]: "" }
                tableData[SqlTableBlogTable] = `${SqlTableCommentTable}.blogId = ${SqlTableBlogTable}.id`
                tableData[SqlTableUsers] = `${SqlTableBlogTable}.userId = ${SqlTableUsers}.id`
                let data = await PsqlQuery(tableData, { commentUserId: extractUserId(ctx) }, false, false, { time: "", commentContent: '', title: '', nickname: '', userName: '' })
                ctx.body = new SucessModel(data)
            } else {
                ctx.body = new SucessModel('类型错误')
            }
        } else {
            // 博客评论查询
            if (requiredItem(ctx, { blogId })) {
                let tableData = { [SqlTableCommentTable]: "" }
                tableData[SqlTableUserInfo] = `${SqlTableCommentTable}.commentUserId = ${SqlTableUserInfo}.userId`
                tableData[SqlTableUsers] = `${SqlTableCommentTable}.commentUserId = ${SqlTableUsers}.id`
                let data = await PsqlQuery(tableData, { blogId }, false, false, {
                    id: `${SqlTableCommentTable}.id`,
                    parentsId: `${SqlTableCommentTable}.parentsId`,
                    nickname: '',
                    userName: '',
                    actualName: '',
                    userImg: '',
                    commentContent: `${SqlTableCommentTable}.commentContent`,
                    time: `${SqlTableCommentTable}.time`,
                })
                ctx.body = new SucessModel(await structureData(data))
            }
        }

    } catch (error) {
        ctx.body = new ErrorModel(error, '')
    }
}

// 处理评论树结构 
const structureData = async (list, data) => {
    let tableList = []
    if (data) {
        // 对于子级进行数据处理
        let newList = []
        list.forEach(async item => {
            if (data.id == item.parentsId) {
                newList.push({
                    ...item,
                    childrenList: await structureData(list, item)
                })
            }
        })
        return newList
    } else {
        // 对第一级数据处理
        list.forEach(async item => {
            if (item.parentsId == null) {
                tableList.push({
                    ...item,
                    childrenList: await structureData(list, item)
                })
            }
        });
        return tableList
    }
}

// 添加评论
const related_addComment = async (ctx) => {
    try {
        let { blogId, pId, content } = ctx.request.body
        if (requiredItem(ctx, { blogId, content })) {
            let addData = {
                id: ruleID(),
                blogId,
                commentUserId: extractUserId(ctx),
                commentContent: content,
                time: ruleTime()
            }
            if (pId) addData.parentsId = pId
            let data = await PsqlAdd(SqlTableCommentTable, addData)
            if (data.protocol41) {
                ctx.body = new SucessModel('评论成功')
            } else {
                ctx.body = new ErrorModel(data, '评论失败，请稍后再试')
            }
        }

    } catch (error) {
        ctx.body = new ErrorModel(error, '')
    }
}

// 修改评论
const related_upComment = async (ctx) => {
    try {
        let { id, content } = ctx.request.body
        if (requiredItem(ctx, { id, content })) {
            let data = await PsqlModifyAsingle(SqlTableCommentTable, { commentContent: content }, { id, commentUserId: extractUserId(ctx) })
            console.log(data, '[[]]===');
            if (data.protocol41) {
                ctx.body = new SucessModel('修改评论成功')
            } else {
                ctx.body = new ErrorModel(data, '修改评论失败，请稍后再试')
            }
        }
    } catch (error) {
        ctx.body = new ErrorModel(error, '')
    }
}

// 删除评论
const related_delComment = async (ctx) => {
    try {
        let { id } = ctx.request.body
        if (requiredItem(ctx, { id })) {
            let data = await PsqlDelSingle(SqlTableCommentTable, { id })
            if (data.protocol41) {
                ctx.body = new SucessModel('删除评论成功')
            } else {
                ctx.body = new ErrorModel(data, '删除评论失败，请稍后再试')
            }
        }
    } catch (error) {
        ctx.body = new ErrorModel(error, '')
    }
}


// 查询标签
const related_queryLabel = async (ctx) => {
    try {
        let data = await PsqlQuery(SqlTableLabelTable, { id: extractUserId(ctx) })
        ctx.body = new SucessModel(data)
    } catch (error) {
        ctx.body = new ErrorModel(error, '')
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
    related_delClass,
    related_comment,
    related_addComment,
    related_upComment,
    related_delComment,
    related_queryLabel
}