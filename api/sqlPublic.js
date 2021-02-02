/**
 * mysql public class
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
    let sql = await orderSqlName(`SELECT * FROM ${table} WHERE ${key} = ${value}`, orderKey, orderValue)

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
 * 添加数据
 * @param {*} table Parent table name
 * @param {*} data The data to be added, the key is the field name, and the value is the field value|| Object
 * @returns Boolean
 */
const PsqlAdd = (table, data) => {
    if (data) {
        let keys = '', values = ''
        Object.keys(data).forEach(function (key) {
            console.log(key, data[key]);
            keys += key + ','
            values += `"${data[key]}",`
        });
        keys = keys.slice(0, keys.length - 1)
        values = values.slice(0, values.length - 1)
        let sql = `INSERT INTO ${table} (${keys}) values (${values});`
        // console.log(MySql(sql), '===0-0');
        return MySql(sql)

    } else {
        return { error: '添加失败！' }
    }

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
    PsqlAdd
}