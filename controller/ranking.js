const { requiredItem } = require('./index')
const { SucessModel, ErrorModel } = require('../model/index.js')
const { PsqlQuery, PsqlModifyAsingle, PsqlAdd } = require('../api/sqlPublic');
const query = require('../api/mysql');
const SqlTableNavTable = 'navTable',
    SqlTableBlogTable = 'blogTable';
let navSortsNum = 100

// 列表查询
const ranking_query = async (ctx) => {
    try {
        let { type, page = 1, pageSize = 20 } = ctx.request.body
        let queryData = {}
        if (type) queryData.blogLabel = type
        else queryData = false
        let data = await PsqlQuery(SqlTableBlogTable, queryData, { seeNum: "" }, `${page},${pageSize}`)
        ctx.body = new SucessModel(data)
    } catch (error) {
        ctx.body = new ErrorModel(error, '')
    }
}

// 导航查询
const ranking_navQuery = async (ctx) => {
    try {
        let data = await PsqlQuery(SqlTableNavTable, { navType: '2', navFlag: '1' }, { sorts: 'ASC' })
        ctx.body = new SucessModel(data)
    } catch (error) {
        ctx.body = new ErrorModel(error, '')
    }
}

// 导航添加
const ranking_addNav = async (ctx) => {
    try {
        let { type, navName, navId } = ctx.request.body
        if (requiredItem(ctx, { type, navName, navId })) {
            let navidData = {}, navnameData = {}, addData = {
                navFlag: "1",
                navType: '2',
                sorts: navSortsNum++
            }
            if (type == '1') {
                navidData = { id: navId }
                navnameData = { navName }
                addData.id = navId
                addData.navName = navName

            } else {
                let { pId } = ctx.request.body
                if (pId) {
                    navidData = { SqlOR: "", id: navId, labelId: navId }
                    navnameData = { SqlOR: "", navName, labelName: navName }
                    addData.labelId = navId
                    addData.labelName = navName
                    addData.Pid = pId
                } else {
                    return ctx.body = new ErrorModel('未关联父级id')
                }
            }

            let [navidFlag] = await PsqlQuery(SqlTableNavTable, navidData)
            let [navnameFlag] = await PsqlQuery(SqlTableNavTable, navnameData)
            if (navidFlag) {
                return ctx.body = new ErrorModel("此标识已存在！")
            }
            if (navnameFlag) {
                return ctx.body = new ErrorModel("此名称已存在！")
            }

            let data = await PsqlAdd(SqlTableNavTable, addData)
            if (data.protocol41) {
                return ctx.body = new SucessModel('添加成功')
            } else {
                return ctx.body = data
            }
        }
    } catch (error) {
        ctx.body = new ErrorModel(error, '')
    }
}

// 修改导航
const ranking_upNav = async (ctx) => {
    try {
        // PsqlModifyAsingle
        let { type, navId, navName } = ctx.request.body
        if (requiredItem(ctx, { type, navId, navName })) {
            let navidData = {}, navnameData = {}, upData = {}
            if (type == '1') {
                upData = { navName }
                navnameData = { navName }
                navidData = { id: navId }
            } else {
                upData = { labelName: navName }
                navnameData = { SqlOR: "", navName, labelName: navName }
                navidData = { labelId: navId }
            }

            let [navidFlag] = await PsqlQuery(SqlTableNavTable, navidData)
            if (navidFlag) {
                let [navNameFlag] = await PsqlQuery(SqlTableNavTable, navnameData)
                if (navNameFlag) {
                    ctx.body = new ErrorModel('未导航名已存在！')
                } else {
                    let data = await PsqlModifyAsingle(SqlTableNavTable, upData, navidData)
                    if (data.protocol41) {
                        ctx.body = new SucessModel("修改导航成功！")
                    } else {
                        ctx.body = new ErrorModel(data)
                    }
                }
            } else {
                ctx.body = new ErrorModel('未查询到此导航id')
            }
        }
    } catch (error) {
        ctx.body = new ErrorModel(error, '')
    }
}

module.exports = {
    ranking_query,
    ranking_navQuery,
    ranking_addNav,
    ranking_upNav
}