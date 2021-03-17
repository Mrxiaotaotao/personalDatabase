// 和用户相关接口 关注 粉丝相关
const router = require('koa-router')()
router.prefix('/related')
const {
    related_query,
    related_attention,
    related_unsubscribe,
    related_favorites,
    related_unfavorites,
    related_QueryClass,
    related_upClass,
    related_addClass,
    related_comment,
    related_addComment,
    related_upComment,
    related_delComment

} = require('../controller/related')

// 列表查询
router.post('/query', async (ctx) => {
    await related_query(ctx)
})

// 关注
router.post('/attention', async (ctx) => {
    await related_attention(ctx)
})

// 取消关注
router.post('/unsubscribe', async (ctx) => {
    await related_unsubscribe(ctx)
})

// 粉丝及关注查询
router.post('/queryFanstA', async (ctx) => {
    await related_queryFanstA(ctx)
})

// 收藏 
router.post('/favorites', async (ctx) => {
    await related_favorites(ctx)
})

// 取消收藏 
router.post('/unfavorites', async (ctx) => {
    await related_unfavorites(ctx)
})

// 分类
router.post('/QueryClass', async (ctx) => {
    await related_QueryClass(ctx)
})

// 修改分类
router.post('/upClass', async (ctx) => {
    await related_upClass(ctx)
})

// 添加分类
router.post('/addClass', async (ctx) => {
    await related_addClass(ctx)
})

// 评论查询
router.post('/comment', async (ctx) => {
    await related_comment(ctx)
})

// 添加评论
router.post('/addComment', async (ctx) => {
    await related_addComment(ctx)
})

// 修改评论
router.post('/upComment', async (ctx) => {
    await related_upComment(ctx)
})

// 删除评论
router.post('/delCommen', async (ctx) => {
    await related_delComment(ctx)
})


module.exports = router