const { requiredItem } = require('./index')
const { SucessModel, ErrorModel } = require('../model/index.js')
const { PsqlList, PsqlListSingle, PsqlListMultiple, PsqlAdd, PsqlDelSingle, PsqlModifyAsingle } = require('../api/sqlPublic')
const SqlTableHomeTable = 'homeTable',
    SqlTableHomeList = 'homeList',
    SqlTableBlogTable = 'blogTable',
    SqlTableNavTable = 'navTable',
    SqlTableNavHome = 'navHome';

// 首页列表查询
const home_query = async (ctx) => {
    try {
        let list = await PsqlList(SqlTableHomeTable, 'orders')
        for (let i = 0; i < list.length; i++) {
            let childList = await PsqlListSingle(SqlTableHomeList, 'Pid', list[i].id)
            for (let j = 0; j < childList.length; j++) {
                let blogData = await PsqlListSingle(SqlTableBlogTable, 'id', childList[j].blogId)
                childList[j] = {
                    ...blogData[0],
                    img: childList[j].img
                }
            }
            list[i].childList = childList
        }
        ctx.body = new SucessModel(list)
    } catch (error) {
        ctx.body = new ErrorModel('代码异常')
    }
}

// 首页导航查询
const home_navQuery = async (ctx) => {
    try {
        let data = await PsqlListMultiple(SqlTableNavTable, { navType: '1', navFlag: '1' }, 'sorts')
        if (!data.protocol41) {
            return ctx.body = data
        }
        ctx.body = new SucessModel(data)
    } catch (error) {
        ctx.body = new ErrorModel('代码异常')
    }

}

// 首页头部导航查询
const home_navHome = async (ctx) => {
    try {
        let data = await PsqlListMultiple(SqlTableNavHome, { flag: '1' }, 'sorts')
        let obj = {
            '1': [],
            '2': [],
            '0': [],
        }
        for (let i = 0; i < data.length; i++) {
            if (data[i].navType == 0) {
                let navItem = await PsqlListMultiple(SqlTableNavTable, { id: data[i].navId, navType: '2', navFlag: '1' })
                obj['0'].push(navItem[0])
            } else {
                obj[data[i].navType].push(data[i])
            }
        }
        ctx.body = new SucessModel(obj)
    } catch (error) {
        ctx.body = new ErrorModel('代码异常')
    }
}

// 首页列表添加
const home_addItem = async (ctx) => {
    try {
        let { title, icon, type, TypeSize, orders, homeList } = ctx.request.body

        if (requiredItem(ctx, { title, icon, type, TypeSize, orders })) {

            let titleFlag = await PsqlListMultiple(SqlTableHomeTable, { title })
            if (titleFlag[0]) {
                return ctx.body = new ErrorModel("请不要重复添加")
            }

            let flag = 0, id = new Date().getTime().toFixed(0);
            let data = await PsqlAdd(SqlTableHomeTable, { id, title, icon, type, TypeSize, orders })
            if (!data.protocol41) {
                return ctx.body = data
            }

            for (let i = 0; i < homeList.length; i++) {
                let sqlData = {}
                if (type == 'link') {
                    sqlData = { link: homeList[i].link, linkName: homeList[i].linkName }
                } else {
                    sqlData = { blogId: homeList[i].blogId, img: homeList[i].img }
                }
                if (requiredItem({ ...sqlData })) {

                    let dataItem = await PsqlAdd(SqlTableHomeList, {
                        Pid: id,
                        id: new Date().getTime().toFixed(0),
                        ...sqlData
                    })

                    if (!dataItem.protocol41 || dataItem.code == '422') {
                        flag += 1
                    }
                } else {
                    flag += 1
                }
            }

            if (flag == 0) {
                ctx.body = new SucessModel('模块添加成功')
            } else {
                PsqlDelSingle(SqlTableHomeTable, { id })
                PsqlDelSingle(SqlTableHomeList, { Pid: id })
                ctx.body = new ErrorModel(`添加失败（${flag}个子级模块有误）`)
            }
        }
    } catch (error) {
        ctx.body = new ErrorModel('代码异常')
    }
}

// 首页列表配置及修改
const home_upItem = async (ctx) => {
    try {

    } catch (error) {
        ctx.body = new ErrorModel('代码异常')
    }
}

// 首页导航展示顺序
const home_upNavList = async (ctx) => {
    try {
        let { list } = ctx.request.body
        if (list && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                if (requiredItem({ id: list[i].id, sorts: list[i].sorts })) {
                    let data = await PsqlModifyAsingle(SqlTableNavHome, { sorts: list[i].sorts }, { id: list[i].id })
                    if (!data.protocol41) {
                        return ctx.body = data
                    }
                }
            }
            ctx.body = new SucessModel('修改成功')
        } else {
            ctx.body = new ErrorModel('未传入数据')
        }

    } catch (error) {
        ctx.body = new ErrorModel('代码异常')
    }
}

module.exports = {
    home_query,
    home_navQuery,
    home_navHome,
    home_addItem,
    home_upItem,
    home_upNavList
}