const { requiredItem } = require('./index')
const { SucessModel, ErrorModel } = require('../model/index.js')
const { PsqlAdd, PsqlDelSingle, PsqlModifyAsingle, PsqlQuery } = require('../api/sqlPublic')
const SqlTableHomeTable = 'homeTable',
    SqlTableHomeList = 'homeList',
    SqlTableBlogTable = 'blogTable',
    SqlTableNavTable = 'navTable',
    SqlTableNavHome = 'navHome';
let sortsNum = 100;
// 首页列表查询
const home_query = async (ctx) => {
    try {
        let list = await PsqlQuery(SqlTableHomeTable, false, { orders: 'DESC' })

        for (let i = 0; i < list.length; i++) {
            let childList = await PsqlQuery(SqlTableHomeList, { 'Pid': list[i].id })
            for (let j = 0; j < childList.length; j++) {
                let blogData = await PsqlQuery(SqlTableBlogTable, { 'id': childList[j].blogId })
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
        let data = await PsqlQuery(SqlTableNavTable, { navType: '1', navFlag: '1' }, { sorts: '' })
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
        let data = await PsqlQuery(SqlTableNavHome, { flag: '1' }, { sorts: "" })
        let obj = {
            '1': [],
            '2': [],
            '0': [],
        }
        for (let i = 0; i < data.length; i++) {
            if (data[i].navType == 0) {
                let navItem = await PsqlQuery(SqlTableNavTable, { id: data[i].navId, navType: '2', navFlag: '1' })
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

            let titleFlag = await PsqlQuery(SqlTableHomeTable, { title })
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

/**
itemType  home 
{
    "id":"2222",
    "itemType":"home",
    "title":"涛涛测试",
    "icon":"el-icon",
    "type":"links"
}
item table
{
    "id":"1615277627710",
    "itemType":"table",
    "blogId":"1211111",
    "img":"xxx.png"
}
{
    "id":"1615277627710",
    "itemType":"table",
    "link":"www.baidu.com",
    "linkName":"namexxx"
}
{
    "Pid":"1615277627710",
    "itemType":"table",
    "link":"www.baidu.com",
    "linkName":"namexxx"
}
{
    "msg": "添加数据成功 / 修改成功",
    "code": 0
}


 */
// 首页列表配置及修改
const home_upItem = async (ctx) => {
    try {
        // type  - home - table 
        let { id, itemType } = ctx.request.body,
            itemObj = {},
            table = SqlTableHomeTable;
        if (itemType == 'home') {
            let { title, icon, type, TypeSize = 4, orders = sortsNum++ } = ctx.request.body
            itemObj = { title, icon, type, TypeSize, orders }
            table = SqlTableHomeTable
        } else if (itemType == 'table') {
            console.log('911');
            let { Pid, blogId = '', img = '', link = '', linkName = '' } = ctx.request.body
            if (Pid) {
                let listId = new Date().getTime().toFixed(0)
                console.log('090asdf');
                if (requiredItem(ctx, { blogId, img }) || requiredItem(ctx, { link, linkName })) {
                    let data = await PsqlAdd(SqlTableHomeList, { id: listId, Pid, blogId, img, link, linkName })
                    // 有父级id则为添加数据
                    return ctx.body = new SucessModel("添加数据成功")
                } else {
                    return ctx.body = new ErrorModel('数据传入异常')
                }
            } else {
                // 修改数据
                if (blogId && img) {
                    itemObj = { blogId, img }

                } else if (link, linkName) {
                    itemObj = { link, linkName }

                } else {
                    return new ErrorModel('缺少传项')
                }
                table = SqlTableHomeList
            }
        } else {
            return ctx.body = new ErrorModel('类型错误')
        }
        console.log('--[[]');
        if (requiredItem(ctx, { id, ...itemObj })) {
            const queryId = await PsqlQuery(table, { id })
            if (!queryId[0]) { return ctx.body = new ErrorModel('未查询到此id，修改失败') }
            let data = await PsqlModifyAsingle(table, { ...itemObj }, { id })
            if (!data.protocol41) {
                return ctx.body = data
            }
            ctx.body = new SucessModel("修改成功")

        }
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