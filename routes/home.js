// 首页相关接口
const router = require('koa-router')()
router.prefix('/home')
const {
    home_query,
    home_navQuery,
    home_navHome,
    home_addItem,
    home_upItem,
    home_upNavList
} = require('../controller/home')

// 首页列表查询
router.post('/query', async (ctx) => {
    await home_query(ctx)
})

// 首页导航查询
router.post('/navQuery', async (ctx) => {
    await home_navQuery(ctx)
})

// 首页导航查询
router.post('/navHome', async (ctx) => {
    await home_navHome(ctx)
})

// 首页列表添加
router.post('/addItem', async (ctx) => {
    await home_addItem(ctx)
})

// 首页列表配置及修改
router.post('/upItem', async (ctx) => {
    await home_upItem(ctx)
})

// 首页导航展示顺序
router.post('/upNavList', async (ctx) => {
    await home_upNavList(ctx)
})
module.exports = router