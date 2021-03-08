const { requiredItem } = require('./index')
const { SucessModel, ErrorModel } = require('../model/index.js')
const SqlTableNavTable = 'navTable',
    SqlTableHomeTable = 'homeTable',
    SqlTableHomeList = 'homeList';



// 首页列表查询
const home_query = async (ctx) => {
    ctx.body = '123'
}

// 首页导航查询
const home_navQuery = async (ctx) => {

}

// 首页列表添加
const home_addItem = async (ctx) => {

}

// 首页列表配置及修改
const home_upItem = async (ctx) => {

}

// 首页导航展示顺序
const home_upNavList = async (ctx) => {

}

module.exports = {
    home_query,
    home_navQuery,
    home_addItem,
    home_upItem,
    home_upNavList
}