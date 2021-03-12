const { requiredItem } = require('./index')
const { SucessModel, ErrorModel } = require('../model/index.js')
const { PsqlListMultiple } = require('../api/sqlPublic')
const SqlTableBlogTable = 'blogTable'

// 查询全量博客列表数据 查询条件处理
const blog_query = async (ctx) => {

    // 根据 积分 名称标题（支持模糊查询） 标签 分类 查看个数  用户名下id/all Id 时间 文章类型

    // 排行查询 分类 和 积分   排序查询
    // 管理员查询 默认 查看个数 支持 其他条件查询 方便管理员选择  后期可以查看博客内容
    // 用户自行分类查询   （时间范围、非必传）并  查看个数 或 时间
    // 侧边查询
    // 最新文章 时间（进一个月，近三个月，近半年，进行一年，最后发布的一篇） 时间处理  3
    // 个人热门文章 查看个数 5 

    // queryType time 最近文章
    let { queryType, userId } = ctx.request.body
    if (queryType == 'time') {
        let { startDate, endDate } = ctx.request.body
        let querData = { userId }
        if (startDate && endDate) {
            querData.startDate = startDate
            querData.endDate = endDate
        }
        // 最新文章
        let newData = await PsqlListMultiple(SqlTableBlogTable, querData, 'firstDate', 'DESC')
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
            data: await PsqlListMultiple(SqlTableBlogTable, { userId: '1111' }, 'firstDate', 'DESC', '0', '3'),
            historyDate
        })
    } else {


    }
}


const timeDate = async (time, type) => {
    if (time) {
        if (!type) {
            let year = time.getFullYear()
            let month = time.getMonth() + 1
            console.log(year, month, '9909');
            return {
                year,
                month
            }
        }

        // let date = data.split('-')
        // if (type == 'y') {
        //     return date[0]
        // } else if (type = 'm') {
        //     return date[1]
        // } else {
        //     return date
        // }
    }
}



// 最新评论 时间 5
// 分类专栏
module.exports = {
    blog_query
}