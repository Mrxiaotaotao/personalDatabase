// 博客相关接口
const router = require('koa-router')()
router.prefix('/blog')
const {
    blog_query
} = require('../controller/blog')

// 列表查询
router.post('/query', async (ctx) => {
    await blog_query(ctx)
    // type 0 时间排序  1 热门 观看人数
})

module.exports = router