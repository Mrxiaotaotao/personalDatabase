//封装mysql
const mysql = require('mysql')
const { customizeModel, ErrorModel } = require('../model/index.js')
let pools = {} //连接池
let query = (sql, host = '127.0.0.1') => {
    if (!pools.hasOwnProperty(host)) { //是否存在连接池
        pools[host] = mysql.createPool({ //不存在创建
            //   本地
            host: "localhost",
            // 服务器 8-15 到期
            // host: '47.94.139.152',
            // port: 3306,
            user: "root",
            password: "root",
            database: "personal_database"
        })
    }
    return new Promise((resolve, reject) => {
        pools[host].getConnection((err, connection) => { //初始化连接池
            if (err) {
                console.log(JSON.stringify(err), '数据库连接失败');
                reject(new ErrorModel(err, '数据库连接失败'))
            }
            else connection.query(sql, (err, results) => { //去数据库查询数据
                connection.release() //释放连接资源
                if (err) {
                    reject(new customizeModel({ sqlMessage: err.sqlMessage, sqlState: err.sqlState, sql: err.sql }, 'sql语法错误', '422'))
                } else resolve(results)
            })
        })
    })
}


module.exports = query