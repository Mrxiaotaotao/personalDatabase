const { requiredItem, ruleID, ruleTime } = require('./index')
const { SucessModel, ErrorModel } = require('../model/index.js')
const { PsqlQuery, PsqlModifyAsingle, PsqlAdd, PsqlQueryTotal } = require('../api/sqlPublic')
const SqlTableBlogTable = 'blogTable', SqlTableUser = 'users', SqlTableUserInfo = 'userInfo'


// 查询全量博客列表数据 查询条件处理
const blog_query = async (ctx) => {

    // 根据 积分 名称标题（支持模糊查询） 标签 分类 查看个数  用户名下id/all Id 时间 文章类型

    // 排行查询 分类 和 积分   排序查询
    // 管理员查询 默认 查看个数 支持 其他条件查询 方便管理员选择  后期可以查看博客内容
    // 用户自行分类查询   （时间范围、非必传）并  查看个数 或 时间
    // 侧边查询
    // 最新文章 时间（进一个月，近三个月，近半年，进行一年，最后发布的一篇） 时间处理  3
    // 个人热门文章 查看个数 5 

    // queryType time 最近文章 popular 个人热门文章  system 管理员查询 ''/不传 为全量 加上其他条件查询
    try {
        let { queryType, userId } = ctx.request.body
        if (queryType == 'time') {
            // 最近文章
            let querData = { userId }
            // 最新文章
            let newData = await PsqlQuery(SqlTableBlogTable, querData, { firstDate: 'DESC' })
            let list = [], historyDate = {};
            for (let i = 0; i < newData.length; i++) {
                list.push(await timeDate(newData[i].firstDate))
            }

            list.forEach(item => {
                if (!historyDate.hasOwnProperty(item.year)) {
                    historyDate[item.year] = []
                }
                historyDate[item.year].push(item.month)
            })
            ctx.body = new SucessModel({
                data: await PsqlQuery(SqlTableBlogTable, { userId }, { 'firstDate': 'DESC' }, '0,3', { title: '' }),
                historyDate
            })
        } else if (queryType == 'popular') {
            // 个人热门文章
            let data = await PsqlQuery(SqlTableBlogTable, { userId }, { 'seeNu': 'DESC' }, '0,5', { title: '' })
            if (data.code) {
                return ctx.body = data
            }
            ctx.body = new SucessModel(data)

        } else if (queryType == 'system') {
            // 管理员查询
            let { sortType = "firstDate", page = 1, pageSize = 10 } = ctx.request.body
            // 根据什么条件进行查询
            let sortData = {}
            sortData[sortType] = "DESC"

            let queryData = {
                [SqlTableBlogTable]: "",
                [SqlTableUser]: `${SqlTableBlogTable}.userId = ${SqlTableUser}.id`
            }
            let data = await PsqlQuery(queryData, false, sortData, `${page},${pageSize}`, {
                id: `${SqlTableBlogTable}.id`,
                nickname: '',
                firstDate: `${SqlTableBlogTable}.firstDate`,
                title: '',
                userId: `${SqlTableBlogTable}.userId`,
            })
            let [total] = await PsqlQueryTotal(queryData)
            // console.log(total, '测试');
            if (data.code) {
                return ctx.body = data
            }
            ctx.body = new SucessModel({ ...total, page, pageSize, data })
        } else {
            // 个人博客内容查询
            // 分页 时间段 排序类型 seeNum/firstDate
            let { startDate, endDate, sortType = "firstDate", page = 1, pageSize = 10 } = ctx.request.body
            let querData = { userId }, sortData = {}
            if (startDate && endDate) {
                querData.SqlBetween = ['firstDate', startDate, endDate]
            }
            if (sortType == 'seeNum' || sortType == 'firstDate') {
                sortData[sortType] = "DESC"
            } else {
                sortData.firstDate = "DESC"
            }
            let data = await PsqlQuery(SqlTableBlogTable, querData, sortData, `${page},${pageSize}`)
            if (data.code) {
                return ctx.body = data
            }
            ctx.body = new SucessModel(data)

        }
    } catch (error) {
        ctx.body = new ErrorModel(error, '')
    }
}

// 时间线处理
const timeDate = async (time, type) => {
    if (time) {
        if (!type) {
            let year = time.getFullYear()
            let month = time.getMonth() + 1
            return {
                year,
                month
            }
        }
    }
}

// 添加博客数据
const blog_addBlog = async (ctx) => {
    try {
        let { userId, blogClass, blogLabel, blogType, title, content } = ctx.request.body
        if (requiredItem(ctx, { userId, blogClass, blogLabel, blogType, title, content })) {
            // let [titleFlag] = await PsqlQuery(SqlTableBlogTable, { title })
            // if (titleFlag) {
            //     return ctx.body = new ErrorModel('请不要重复添加')
            // }
            let date = ruleTime(), id = ruleID();
            let addData = {
                id,
                userId,
                blogClass,
                blogLabel,
                blogType,
                title,
                content,
                firstDate: date,
                lastDate: date,
                top: 0,
                articleLink: `/${userId}/article/${id}`
            }
            let data = await PsqlAdd(SqlTableBlogTable, addData)
            if (data.protocol41) {
                ctx.body = new SucessModel('添加成功')
            } else {
                ctx.body = new ErrorModel(data)
            }
        }

    } catch (error) {
        ctx.body = new ErrorModel(error, '')
    }
}

// 修改博客内容
const blog_upBlog = async (ctx) => {
    ctx.body = new SucessModel()
    try {
        let { blogId, userId, blogClass, blogLabel, blogType, title, content } = ctx.request.body
        if (requiredItem(ctx, { blogId, userId, blogClass, blogLabel, blogType, title, content })) {
            const flag = await PsqlQuery(SqlTableBlogTable, { id: blogId, userId })
            if (flag) {
                await PsqlModifyAsingle(SqlTableBlogTable, { blogClass, blogLabel, blogType, title, content, lastDate: ruleTime() }, { id: blogId, userId })
                ctx.body = new SucessModel('修改成功')
            } else {
                ctx.body = new ErrorModel('未匹配到要修改的数据')
            }
        }
    } catch (error) {
        ctx.body = new ErrorModel(error, '')
    }
}

// 查看博客
const blog_seeNum = async (ctx) => {
    try {
        let { blogId } = ctx.request.body
        if (requiredItem(ctx, { blogId })) {
            let blogData = await PsqlQuery(SqlTableBlogTable, { id: blogId }, false, false, { seeNum: '' })
            if (blogData && blogData.length > 0) {
                let num = blogData[0].seeNum
                await PsqlModifyAsingle(SqlTableBlogTable, { seeNum: num + 1 }, { id: blogId })
                ctx.body = new SucessModel('查看记录添加成功')
            } else {
                ctx.body = new ErrorModel("未查询到此博客")
            }
        }
    } catch (error) {
        ctx.body = new ErrorModel(error, '')
    }
}

// 最新评论 时间 5
// 分类专栏
module.exports = {
    blog_query,
    blog_addBlog,
    blog_upBlog,
    blog_seeNum
}