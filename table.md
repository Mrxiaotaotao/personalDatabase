首页 表 可配置
navTable 导航表 
    字段名
    navName 导航名
    navType 1 首页展示 2 分类导航展示 0/''/null 全部展示
    id
    labelName 子导航标签 
    labelId 子标签id

父表 homeTable 
    热门话题   内容
    精选头条
    字段
    id
    title 大标题名称
    icon  大标题图表
    type 大标题类型  card 卡片类型 Banners 横幅 link 链接 List 列表  team 团队 等
    TypeSize 大标题模块大小 默认是4
字表 homeList ß
    字段名
    fatherID 父级id
    id 子id
    --
    用户博客id 自行查询
    image

用户详情表
    users 用户账号表
        ...
        用户昵称
        用户ID
    userInfo
        字段名
        userId 用户id 子id
        userImg 头像
        original   原创
        Rank   排名
        overallRanking   总排名
        access   访问
        grade   等级 按积分排列 100 未一段 最高为 10段
        integralNum   积分 发布一篇为 1 积分 收藏一篇为 1积分 排名积分先不做
        FansNum   粉丝
        PraisedNum   获赞
        commentNum   评论
        FavoritesNum   收藏
        attention  关注
        userTime 创建时间
        blogSeeNum 总访问量
        blogNum 文章总量

        真实姓名 暂时不做
        性别
        所在地区
        出生日期
        开发工作时间

        教育信息
        学校名称
        入学时间
        学历
        
        工作信息
        公司名称
        职位名称
        所属行业

        兴趣标签 此为导航标签的子标签
收藏表
    FavoritesTable
        字段
        id 收藏地址id
        userId 用户id
        blogUserId 此博客用户id
        pathUrl 文章地址
        blogType 类型 00 博客
        title 博客标题
        blogUser 收藏此博客的用户名
        blogType 博客类型

关注表
    attentionTable
        字段
        id
        userId 用户id
        blogUserId 此博主用户id / 账号名
        attentionId 你所关注的用户id
        attentionName 你所关注的用户名
        attentionImage 你所关注的用户头像
粉丝表
    FansTable
        字段
        id
        userId 用户id
        blogUserId 此博客用户id / 账号名
        attentionId 你粉丝的用户id
        attentionName 你粉丝的用户名
        attentionImage 你粉丝的用户头像

文章 表
    blogTable 博客表
        字段
        blogId 博客id
        userId 用户id
        blogClass 文章标签
        blogLabel 文章分类
        blogType 文章类型 00 原创 01 私密 02 粉丝可见 04 vip可见
        firstDate 首次添加日期
        lastDate 最后修改日期
        FavoritesNum 收藏个数  一个收藏代表 5 热度 一个浏览代表 1 热度
        likeNum  点赞个数
        commentNum 评论个数  
        seeNum 查看个数 查看此博客为加1 每个用户间隔10分钟 才能再次加一
        articleLink 本文链接
        userName 用户名
        title 标题
        content 内容 为html 富文本 
        top 置顶 true 置顶 false 不置顶
        integralNum 积分
点赞表
    likeTable
        id 唯一id
        userId 点赞用户id
        Pid 父级id
分类表
    classificationTable
    userId 用户id
    id 分类id
    className 分类名称
    classimage 分类图片 默认有
    classTable 分类总量
    top false 未置顶 true 置顶 只会有一个置顶
标签表
    labelTable
    userId 用户id
    id 标签id
    labelName 标签名

评论表
    commentTable 
        id 评论id
        blogId 文章id
        ParentsId 父级id 为子集的话会有 父级的评论id 一级不会有 / 根据 level 判断
        Level 层级 1 为一级 2 为二级 依次类推
        commentUserId 评论人的id
        commentUserImage 评论人的头像
        blogTitle 文章标题
        content 评论内容
        time 插入时间
        Report 被人举报标识 true 有人举报 false 正常 管理员可删除不良评论 默认为空或false
        reportUser 举报人用户id
        likeNum 点赞


近一月的 访问 评论 粉丝 收藏 量 的图
chartTable
    userId 用户id
    accessNum  访问
    commentNum  评论
    fansNum  粉丝
    favoritesNum  收藏
    time 时间 年月日




博客积分是CSDN对用户努力的认可和奖励，也是衡量博客水平的重要标准。博客等级也将由博客积分唯一决定。积分规则具体如下：

1、每发布一篇原创或者翻译文章：可获得10分；
2、每发布一篇转载文章：可获得2分；
3、博主的文章每被评论一次：可获得1分；
4、每发表一次评论：可获得1分（自己给自己评论、博主回复评论不获得积分）；
5、博文阅读次数每超过100次：可获得1分，阅读加分最高加到100分，即文章点击上万次截止；
6、文章被投票：顶1票加1分，踩1票减1分；
7、文章被管理员或博主本人删除，相应减去博主基于该篇博文所获得的分数；
8、评论被管理员或博主删除，相应减去发评论者和博主基于该评论各自获得的分数（博主应减积分不会动态实时去掉，是每周固定时间清理一次）；
9、另外会开设相应的抄袭举报功能，一旦举报证实某篇原创文章抄袭，将扣除博主该篇文章相应的得分。


用户模块 最高权限
    查询所有用户的信息 除隐私信息外
    有提升某个用户权限
注册管理员 最高权限

评论模块
    查看所有评论
    举报评论处理
    有删除评论权限
博客模块
    查看所有博客
    删除所有博客权限

标签模块

配置模块
    首页配置
    导航配置 首页 分类
    标签配置
    推荐条件配置

首页模块
    总览 图表
    排行榜 指标 列表
反馈模块
    用于查询用户提出的意见及处理
资源模块 
    添加账号及备注 
    查询账号 模糊查询用户名、备注 时间 密码徐有显示隐藏功能 双击 及复制
    ResourcesTable
        userId 用户id
        userName 用户名
        passWord 密码
        mark 备注
        time 添加时间

