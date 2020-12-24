const addUser = async (ctx,body)=>{
        const { userId,username,password,nickname,gender,info,email,phone } = body
        let sql = `INSERT INTO personal_database.users (userId,userName,userPassWord,premission,nickname,gender,info,email,phone) values ('${userId}','${username}','${password}',0,'${nickname}','${gender}','${info}','${email}','${phone}');`
        
         return await ctx.util.mysql(sql)
       
    }

const checkUserName = async (ctx,body)=>{
    const { username } = body
    let sql = `select * from users where userName='${username}'`
    return await ctx.util.mysql(sql)
}

const checkEmail = async (ctx,body)=>{
    const { email } = body
    let sql = `select * from users where email='${email}'`
    return await ctx.util.mysql(sql)
}

const checkPhone = async (ctx,body)=>{
    const { phone } = body
    let sql = `select * from users where phone='${phone}'`
    return await ctx.util.mysql(sql)
}

const selectUser = async (ctx,body)=>{
    const {name,password} = body
    let sql = `select * from users where userName = '${name}' and userPassWord=${password}`
    // sql查询
    return await ctx.util.mysql(sql)
}


module.exports={
    addUser,
    checkUserName,
    checkEmail,
    checkPhone,
    selectUser
}