// 博客相关接口
const router = require('koa-router')()
router.prefix('/blog')
const {
    blog_query,
    blog_addBlog,
    blog_upBlog,
    blog_seeNum
} = require('../controller/blog')

// 列表查询
router.post('/query', async (ctx) => {
    await blog_query(ctx)
    // type 0 时间排序  1 热门 观看人数
})

// 添加博客
router.post('/addBlog', async (ctx) => {
    await blog_addBlog(ctx)
})

// 修改博客接口
router.post('/upBlog', async (ctx) => {
    await blog_upBlog(ctx)
})

// 产看添加处理接口
router.post('/seeNum', async (ctx) => {
    await blog_seeNum(ctx)
})

module.exports = router