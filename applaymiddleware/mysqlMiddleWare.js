const mysqlMiddleWare = async (ctx, next) => {
    //挂载到util中
    ctx.util = {
      mysql: require('../api/mysql')
    }
    await next()
  }

  module.exports={
    mysqlMiddleWare
  }