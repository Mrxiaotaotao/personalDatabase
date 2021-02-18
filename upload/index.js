/**
 * file 文件
 * image 图片
 * avater 头像
 */
const multer = require('koa-multer'); //加载koa-multer模块
// 上传 图片
var storage = multer.diskStorage({
    //文件保存路径
    destination: function (req, file, cb) {
        if (file.fieldname == "file") {
            // 文件
            cb(null, 'public/uploads/file');
        } else if (file.fieldname == "image") {
            // 图片
            cb(null, 'public/uploads/image');
        } else if (file.fieldname == "avatar") {
            // 头像
            cb(null, 'public/uploads/avatar');
        }
    },
    //修改文件名称
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
    }
})
//加载配置
const upload = multer({
    storage: storage
});

module.exports = upload