// 排行接口
const router = require('koa-router')()
router.prefix('/ranking')
const {
    ranking_query,
    ranking_navQuery,
    ranking_addNav,
    ranking_upNav
} = require('../controller/ranking')

// 列表查询
router.post('/query', async (ctx) => {
    await ranking_query(ctx)
})

// 导航查询
router.post('/navQuery', async (ctx) => {
    await ranking_navQuery(ctx)
})

// 导航添加
router.post('/addNav', async (ctx) => {
    await ranking_addNav(ctx)
})

// 修改导航
router.post('/upNav', async (ctx) => {
    await ranking_upNav(ctx)
})

module.exports = router