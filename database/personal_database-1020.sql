/*
 Navicat Premium Data Transfer

 Source Server         : mydatabase
 Source Server Type    : MySQL
 Source Server Version : 80019
 Source Host           : localhost:3306
 Source Schema         : personal_database

 Target Server Type    : MySQL
 Target Server Version : 80019
 File Encoding         : 65001

 Date: 20/10/2021 09:38:57
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for attentionTable
-- ----------------------------
DROP TABLE IF EXISTS `attentionTable`;
CREATE TABLE `attentionTable` (
  `id` bigint NOT NULL COMMENT '收藏ID',
  `userId` bigint NOT NULL COMMENT '用户ID',
  `attentionId` bigint NOT NULL COMMENT '你所关注的用户id',
  `attentionBlogId` bigint DEFAULT NULL COMMENT '你所关注的用户博客id',
  `attentionType` bigint NOT NULL COMMENT '类型 1 关注博主 0 关注博客'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of attentionTable
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for blogTable
-- ----------------------------
DROP TABLE IF EXISTS `blogTable`;
CREATE TABLE `blogTable` (
  `id` bigint NOT NULL COMMENT '文章ID',
  `userId` bigint NOT NULL COMMENT '用户ID',
  `blogClass` varchar(1024) NOT NULL COMMENT '文章标签',
  `blogLabel` varchar(1024) NOT NULL COMMENT '文章分类',
  `blogType` int NOT NULL COMMENT '文章类型 00 原创 01 笔记 02 转载',
  `firstDate` datetime NOT NULL COMMENT '首次添加日期',
  `lastDate` datetime NOT NULL COMMENT '最后修改日期',
  `favoritesNum` bigint NOT NULL DEFAULT '0' COMMENT '收藏个数',
  `likeNum` bigint NOT NULL DEFAULT '0' COMMENT '点赞个数',
  `commentNum` bigint NOT NULL DEFAULT '0' COMMENT '评论个数',
  `seeNum` bigint NOT NULL DEFAULT '0' COMMENT '查看个数',
  `articleLink` varchar(1024) DEFAULT NULL COMMENT '本文链接',
  `userName` varchar(1024) DEFAULT NULL COMMENT '用户名',
  `title` varchar(1024) DEFAULT NULL COMMENT '标题',
  `content` text NOT NULL COMMENT '内容 为html 富文本 ',
  `top` int NOT NULL COMMENT '置顶 0 不置顶 1++ 置顶顺序',
  `integralNum` bigint NOT NULL DEFAULT '0' COMMENT '关注',
  `visibleMode` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '0' COMMENT '可见方式 0公开 1私密 2粉丝 4vip'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of blogTable
-- ----------------------------
BEGIN;
INSERT INTO `blogTable` VALUES (16316700675397762, 111, '美食/餐厅线上活动', '美食/餐厅线上活动', 1, '2021-09-15 09:41:07', '2021-09-15 09:41:07', 0, 0, 0, 0, '/111/article/16316700675397762', NULL, '测试title', 'cehsiContent', 0, 0, '00');
INSERT INTO `blogTable` VALUES (16316701585305757, 111, '美食/餐厅线上活动,地推活动', '美食/餐厅线上活动,地推活动', 1, '2021-09-15 09:42:38', '2021-09-15 09:42:38', 0, 0, 0, 0, '/111/article/16316701585305757', NULL, '测试title', 'cehsiContent', 0, 0, '00');
INSERT INTO `blogTable` VALUES (16316852289631609, 111, '美食/餐厅线上活动', '美食/餐厅线上活动', 1, '2021-09-15 13:53:48', '2021-09-15 13:53:48', 0, 0, 0, 0, '/111/article/16316852289631609', NULL, '测试title', 'cehsiContent', 0, 0, '01');
COMMIT;

-- ----------------------------
-- Table structure for classificationTable
-- ----------------------------
DROP TABLE IF EXISTS `classificationTable`;
CREATE TABLE `classificationTable` (
  `id` bigint NOT NULL COMMENT '分类id',
  `userId` bigint NOT NULL COMMENT '用户id',
  `className` varchar(1024) DEFAULT NULL COMMENT '分类名称',
  `classimage` varchar(1024) DEFAULT NULL COMMENT '分类图片 默认有',
  `top` int NOT NULL DEFAULT '0' COMMENT '未置顶 true 置顶 只会有一个置顶',
  `display` int NOT NULL DEFAULT '1' COMMENT '前台是否显示 1展示 0不展示'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of classificationTable
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for commentTable
-- ----------------------------
DROP TABLE IF EXISTS `commentTable`;
CREATE TABLE `commentTable` (
  `id` bigint NOT NULL COMMENT '评论id',
  `blogId` bigint NOT NULL COMMENT '文章id',
  `parentsId` bigint DEFAULT NULL COMMENT '父级评论id',
  `level` int DEFAULT NULL COMMENT '层级 1 为一级 2 为二级 依次类推',
  `commentUserId` int NOT NULL COMMENT '评论人的id',
  `content` text COMMENT '评论内容',
  `time` datetime DEFAULT NULL COMMENT '插入/评论时间',
  `report` varchar(24) DEFAULT NULL COMMENT '被人举报标识 true 有人举报 false 正常 管理员可删除不良评论 默认为空或false',
  `reportUser` bigint DEFAULT NULL COMMENT '举报人用户id',
  `likeNum` int NOT NULL DEFAULT '0' COMMENT '点赞数'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of commentTable
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for fansTable
-- ----------------------------
DROP TABLE IF EXISTS `fansTable`;
CREATE TABLE `fansTable` (
  `id` bigint NOT NULL COMMENT '粉丝ID',
  `userId` bigint NOT NULL COMMENT '用户ID',
  `userFansId` bigint NOT NULL COMMENT '你粉丝的用户id'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of fansTable
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for favoritesTable
-- ----------------------------
DROP TABLE IF EXISTS `favoritesTable`;
CREATE TABLE `favoritesTable` (
  `id` bigint NOT NULL COMMENT '收藏ID',
  `userId` bigint NOT NULL COMMENT '用户ID',
  `blogUserId` bigint NOT NULL COMMENT '此博客用户id',
  `blogId` bigint NOT NULL COMMENT '此博客id'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of favoritesTable
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for homeList
-- ----------------------------
DROP TABLE IF EXISTS `homeList`;
CREATE TABLE `homeList` (
  `PId` bigint NOT NULL,
  `id` bigint NOT NULL,
  `blogId` bigint NOT NULL,
  `img` varchar(1024) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of homeList
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for homeTable
-- ----------------------------
DROP TABLE IF EXISTS `homeTable`;
CREATE TABLE `homeTable` (
  `id` bigint NOT NULL,
  `title` char(12) DEFAULT NULL,
  `icon` char(54) DEFAULT NULL,
  `type` char(24) DEFAULT NULL,
  `TypeSize` int DEFAULT NULL,
  `orders` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '55'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of homeTable
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for labelTable
-- ----------------------------
DROP TABLE IF EXISTS `labelTable`;
CREATE TABLE `labelTable` (
  `id` bigint NOT NULL COMMENT '标签id',
  `userId` bigint NOT NULL COMMENT '用户id',
  `labelName` varchar(1024) DEFAULT NULL COMMENT '标签名'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of labelTable
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for likeTable
-- ----------------------------
DROP TABLE IF EXISTS `likeTable`;
CREATE TABLE `likeTable` (
  `id` bigint NOT NULL COMMENT '唯一id',
  `userId` bigint NOT NULL COMMENT '点赞用户id',
  `Pid` bigint NOT NULL COMMENT '父级id 博客地址'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of likeTable
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for navTable
-- ----------------------------
DROP TABLE IF EXISTS `navTable`;
CREATE TABLE `navTable` (
  `id` bigint NOT NULL,
  `navName` char(12) DEFAULT NULL,
  `navType` int DEFAULT NULL,
  `labelName` char(12) DEFAULT NULL,
  `labelId` int DEFAULT NULL,
  `navFlag` char(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of navTable
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for userInfo
-- ----------------------------
DROP TABLE IF EXISTS `userInfo`;
CREATE TABLE `userInfo` (
  `userId` bigint NOT NULL COMMENT '用户id 子id',
  `userImg` varchar(10024) DEFAULT NULL COMMENT '头像',
  `original` int NOT NULL DEFAULT '0' COMMENT '原创',
  `ranks` int NOT NULL DEFAULT '0' COMMENT '排名',
  `overallRanking` int NOT NULL DEFAULT '0' COMMENT '总排名',
  `access` int NOT NULL DEFAULT '0' COMMENT '访问',
  `grade` int NOT NULL DEFAULT '0' COMMENT '等级',
  `integralNum` int NOT NULL DEFAULT '0' COMMENT '积分',
  `fansNum` int NOT NULL DEFAULT '0' COMMENT '粉丝',
  `praisedNum` int NOT NULL DEFAULT '0' COMMENT '获赞',
  `commentNum` int NOT NULL DEFAULT '0' COMMENT '评论',
  `favoritesNum` int NOT NULL DEFAULT '0' COMMENT '收藏',
  `attention` int NOT NULL DEFAULT '0' COMMENT '关注',
  `userTime` datetime DEFAULT NULL COMMENT '创建时间',
  `blogSeeNum` int NOT NULL DEFAULT '0' COMMENT '总访问量',
  `blogNum` int NOT NULL DEFAULT '0' COMMENT '文章总量',
  `actualName` varchar(24) DEFAULT NULL COMMENT '真实姓名',
  `gender` int DEFAULT NULL COMMENT '性别',
  `areas` varchar(104) DEFAULT NULL COMMENT '所在地区',
  `dateBirths` date DEFAULT NULL COMMENT '出生日期',
  `developmentTime` date DEFAULT NULL COMMENT '开发工作时间',
  `educationalInformation` varchar(104) DEFAULT NULL COMMENT '教育信息',
  `schoolName` varchar(104) DEFAULT NULL COMMENT '学校名称',
  `admissionTime` date DEFAULT NULL COMMENT '入学时间',
  `education` char(24) DEFAULT NULL COMMENT '学历',
  `workInfo` varchar(104) DEFAULT NULL COMMENT '工作信息',
  `companyName` varchar(104) DEFAULT NULL COMMENT '公司名称',
  `jobTitle` varchar(104) DEFAULT NULL COMMENT '职位名称',
  `industry` varchar(104) DEFAULT NULL COMMENT '所属行业'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of userInfo
-- ----------------------------
BEGIN;
INSERT INTO `userInfo` VALUES (1621317734402, '/uploads/avater/user.jpeg', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint NOT NULL COMMENT '用户ID',
  `userId` char(24) DEFAULT NULL COMMENT '账号或用户名',
  `userPassWord` char(24) DEFAULT NULL COMMENT '用户密码',
  `nickname` char(24) DEFAULT NULL COMMENT '昵称',
  `premission` int NOT NULL DEFAULT '0' COMMENT '权限等级',
  `email` char(24) DEFAULT NULL COMMENT '邮箱',
  `phone` char(24) DEFAULT NULL COMMENT '电话',
  `gender` int NOT NULL DEFAULT '0' COMMENT '性别 0 未知 1 男 2女',
  `info` char(24) DEFAULT NULL COMMENT '简介',
  `userName` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO `users` VALUES (1621316884962, 'admin', '1111', '涛涛管理员', 2, NULL, NULL, 0, NULL, '');
INSERT INTO `users` VALUES (1621317734402, '111', '111', '1111', 0, NULL, NULL, 0, NULL, '');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
