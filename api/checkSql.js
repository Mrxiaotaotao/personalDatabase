/**
 * 查询数据的sql集合
 */

const MySql = require('./mysql')

/**
 * 单列表查询 全量 无条件 有排序
 * @param {*} table Table Name 
 * @param {*} orderKey Sort by that field、 Sort switch
 * @param {*} orderValue ASC 正序 DESC 倒序
 * @returns Array
 */
const PsqlList = async (table, order = false, orderKey, orderValue = 'ASC') => {
    let sql = orderSqlName(`SELECT * FROM ${table} `, orderKey, orderValue)
    return await MySql(sql)
}

/**
 * 列表/单数据查询 全量 单条件 有排序(查数据详情时可不用管)
 * @param {*} table Table Name
 * @param {*} key Condition key value
 * @param {*} value  Condition value
 * @param {*} orderKey Sort by that field、 Sort switch
 * @param {*} orderValue ASC 正序 DESC 倒序
 * @returns Array/Object
 */
const PsqlListSingle = async (table, key, value, orderKey, orderValue = 'ASC') => {
    let sql = await orderSqlName(`SELECT * FROM ${table} WHERE ${key} = '${value}'`, orderKey, orderValue)
    return await MySql(sql)
}
/**
 * 查询单表多条件
 * @param {*} table  Table Name
 * @param {*} data he data to be added, the key is the field name, and the value is the field value|| Object
 * @param {*} orderKey  Sort by that field、 Sort switch
 * @param {*} orderValue ASC 正序 DESC 倒序
 */
const PsqlListMultiple = async (table, data, orderKey, orderValue = 'ASC') => {
    let keyStr = ''
    Object.keys(data).forEach(function (key) {
        keyStr += ` ${key} = '${data[key]}' and`
    });
    keyStr = keyStr.slice(0, keyStr.length - 3)
    let sql = await orderSqlName(`SELECT * FROM ${table} WHERE ${keyStr}`, orderKey, orderValue)
    return await MySql(sql)
}

/**
 * 二层列表查询 全量 无条件 无排序
 * @param {*} table1  Parent table name
 * @param {*} table2  Child table name
 * @param {*} subListName Field name associated with parent and child
 * @param {*} idName The identifier associated with the parent id and the subset
 * @param {*} userIdName The identifier associated with the subset id and the parent
 * @returns Array
 */
const PsqlLists = async (table1, table2, subListName = 'subList', idName = 'id', userIdName = 'userId') => {
    let list = await PsqlList(table1)
    list.forEach(async item => {
        item[subListName] = await PsqlListSingle(table2, userIdName, item[idName])
    });
    return list
}

/**
 * 排序语句过滤
 * @param {*} sql sql statement
 * @param {*} orderKey Sort field
 * @param {*} orderValue  ASC 正序 DESC 倒序
 * @returns Filtered sql statement
 */
const orderSqlName = (sql, orderKey, orderValue = 'ASC') => {
    if (orderKey) {
        return `${sql}  order by ${orderKey} ${orderValue}`
    } else {
        return sql
    }
}

module.exports = {
    PsqlList,
    PsqlLists,
    PsqlListSingle,
    PsqlListMultiple,
}