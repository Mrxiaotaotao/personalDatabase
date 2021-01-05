//封装mysql
const mysql = require('mysql')
let pools = {}//连接池
let query = (sql, host = '127.0.0.1') => {
    if (!pools.hasOwnProperty(host)) {//是否存在连接池
        pools[host] = mysql.createPool({//不存在创建
            host: "localhost",
            user: "root",
            password: "123456",
            database: "personal_database"
        })
    }
    return new Promise((resolve, reject) => {
        pools[host].getConnection((err, connection) => {//初始化连接池
            if (err) console.log(err, '数据库连接失败');
            else connection.query(sql, (err, results) => {//去数据库查询数据
                connection.release()//释放连接资源
                if (err) reject(err);
                else resolve(results);
            })
        })
    })
}


module.exports = query