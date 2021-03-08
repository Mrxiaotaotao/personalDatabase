// 和用户相关接口 关注 粉丝相关
const router = require('koa-router')()
router.prefix('/related')
const {
    related_query
} = require('../controller/related')

// 列表查询
router.post('/query', async (ctx) => {
    await related_query(ctx)
})

module.exports = router