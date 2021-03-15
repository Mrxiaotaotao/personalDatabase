/**
 * 查询数据的sql集合
 */

/**
 *  查询条数处理 时间的区间查询处理 各个常用时间段查询处理
 */

const MySql = require('./mysql')

/**
 * 单列表查询 全量 无条件 有排序
 * @param {*} table Table Name 
 * @param {*} orderKey Sort by that field、 Sort switch
 * @param {*} orderValue ASC 正序 DESC 倒序
 * @returns Array
 */
const PsqlList = async (table, orderKey, orderValue = 'ASC') => {
    let sql = orderSqlName(`SELECT * FROM ${table} `, orderKey, orderValue)
    sql = sql + await limitFn()
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
    sql = sql + await limitFn()
    return await MySql(sql)
}

/**
 * 全量查询
 * @param {*} table  表名
 * @param {*} conditionData 条件 
 * @param {*} orderData 筛选排序
 * @param {*} limitNum 范围查询
 * @param {*} displayData 放回字段
 * @returns 
 */
const PsqlQuery = async (table, conditionData = false, orderData = false, limitNum = false, displayData = '*') => {
    // 返回显示字段处理
    if (displayData != '*' && displayData != '') {
        let keyStr = ''
        Object.keys(displayData).forEach(function (key) {
            keyStr += ` ${key} ,`
        });
        keyStr = keyStr.slice(0, keyStr.length - 1)
        displayData = keyStr
    }
    let sql = `SELECT ${displayData} FROM ${table}`
    // 查询条件处理
    if (conditionData) {
        sql += await conditionName(conditionData)
    }
    // 排序字段处理
    if (orderData) {
        sql += await orderName(orderData)
    }
    // 查询区域处理、分页处理
    if (limitNum) {
        sql += await limitFn(limitNum)
    }
    console.log(sql, '9090099');
    return await MySql(sql)
}

/**
 * 查询单表多条件
 * @param {*} table  Table Name
 * @param {*} data he data to be added, the key is the field name, and the value is the field value|| Object
 * @param {*} orderKey  Sort by that field、 Sort switch
 * @param {*} orderValue ASC 正序 DESC 倒序
 */
const PsqlListMultiple = async (table, data, orderKey, orderValue = 'ASC', startNum, num) => {
    let keyStr = ''
    Object.keys(data).forEach(function (key) {
        keyStr += ` ${key} = '${data[key]}' and`
    });
    keyStr = keyStr.slice(0, keyStr.length - 3)
    let sql = await orderSqlName(`SELECT * FROM ${table} WHERE ${keyStr}`, orderKey, orderValue)
    sql = sql + await limitFn(startNum, num)
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

/**
 * 截取语句
 * @param {*} str  Offset | Start with a question | Types of String | x,x
 * @returns 
 */

const limitFn = async (str = '0,10') => {
    return ` LIMIT ${str}`
}


/**
 * 排序语句过滤
 * @param {*} orderData type of Object | { Sort field :  ASC 正序 DESC 倒序 (默认DESC)} 
 * @returns Filtered SQL statement
 */
const orderName = (orderData) => {
    let keyStr = ''
    Object.keys(orderData).forEach(function (key) {
        keyStr += ` ${key}  ${orderData[key] || 'DESC'} ,`

    });
    keyStr = keyStr.slice(0, keyStr.length - 1)
    return keyStr ? ` order by ${keyStr} ` : ''
}

/**
 * 条件语句过滤
 * @param {*} conditionData type of Object | { Condition field : Condition value } 
 * @returns Filtered SQL statement
 */
const conditionName = (conditionData) => {
    let keyStr = ''
    Object.keys(conditionData).forEach(function (key) {

        // SqlBetween
        if (key == 'SqlBetween') {
            keyStr += ` ${conditionData[key][0]} BETWEEN '${conditionData[key][1]}' and '${conditionData[key][2]}' and`
        } else {
            keyStr += ` ${key} = '${conditionData[key]}' and`
        }
    });
    keyStr = keyStr.slice(0, keyStr.length - 3)
    return keyStr ? ` WHERE ${keyStr} ` : ''
}

module.exports = {
    PsqlList,
    PsqlLists,
    PsqlListSingle,
    PsqlListMultiple,
    PsqlQuery
}