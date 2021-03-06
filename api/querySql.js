/**
 * 查询数据的sql集合
 */

/**
 *  查询条数处理 时间的区间查询处理 各个常用时间段查询处理
 */

const MySql = require('./mysql')

/**
 * 全量查询
 * @param {*} table  表名 xxx 单表查询为String | 多表查询为Object 碰到表名字段重复的情况请用 as 别名处理
 * @param {*} conditionData 条件 {id:"xx"} | 区间段查询  例 SqlBetween = ['筛选字段名', 开始, 结束] | 第一个字段为 SqlOR 表示此查询为 包含的关系(或) or 关联 | 默认为 end 并且关系
 * @param {*} orderData 筛选排序  { Sort field :  ASC 正序 DESC 倒序 (默认DESC)}  | 模糊查询字段 SqlLike = [模糊查询字段名, 字段值]
 * @param {*} limitNum 范围查询 '0,1'
 * @param {*} displayData 放回字段 {id:"xx"}
 * @returns 
 */
const PsqlQuery = async (table, conditionData = false, orderData = false, limitNum = false, displayData = '*') => {
    // 返回显示字段处理
    if (displayData != '*' && displayData != '') {
        let keyStr = ''
        Object.keys(displayData).forEach(function (key) {
            if (displayData[key]) {
                keyStr += ` ${displayData[key]} ,`
            } else {
                keyStr += ` ${key} ,`
            }
        });
        keyStr = keyStr.slice(0, keyStr.length - 1)
        displayData = keyStr
    }
    let sql = `SELECT ${displayData} FROM `

    // 链表查询处理 
    if (table) {
        sql += await innerJoinFN(table)
    } else {
        return false
    }

    // 查询条件处理
    if (conditionData) {
        sql += await conditionNameFN(conditionData)
    }
    // 排序字段处理
    if (orderData) {
        sql += await orderNameFN(orderData)
    }
    // 查询区域处理、分页处理
    if (limitNum) {
        sql += await limitFn(limitNum)
    }
    console.log(sql, 'sql语句展示');
    return await MySql(sql)
}

const PsqlQueryTotal = async (table, conditionData = false) => {

    // SELECT COUNT(*) as total FROM blogTable  WHERE userId = '1111';
    let sql = `SELECT COUNT(*) as total FROM `

    // 链表查询处理 
    if (table) {
        sql += await innerJoinFN(table)
    } else {
        return false
    }
    // 查询条件处理
    if (conditionData) {
        sql += await conditionNameFN(conditionData)
    }
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
    // sql = sql + await limitFn(startNum, num)
    return await MySql(sql)
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
    let strL = str.split(',')
    let startNum = Number(strL[0])
    let endNum = Number(strL[1])
    return ` LIMIT ${(startNum - 1) * endNum},${startNum * endNum}`
}


/**
 * 排序语句过滤
 * @param {*} orderData type of Object | { Sort field :  ASC 正序 DESC 倒序 (默认DESC)} 
 * @returns Filtered SQL statement
 */
const orderNameFN = (orderData) => {
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
 * 暂时不支持模糊查询具体个数
 */
const conditionNameFN = (conditionData) => {
    let keyStr = ''
    let connectionFlag = 'and'
    Object.keys(conditionData).forEach(function (key, index) {
        if (index == 0 && key == 'SqlOR') {
            connectionFlag = 'or'
        } else {
            if (key == 'SqlBetween') {
                keyStr += ` ${conditionData[key][0]} BETWEEN '${conditionData[key][1]}' and '${conditionData[key][2]}'  ${connectionFlag}`
            } else if (key == 'SqlLike') {
                keyStr += ` ${conditionData[key][0]} like '%${conditionData[key][1]}%'  ${connectionFlag}`
            } else {
                keyStr += ` ${key} = '${conditionData[key]}'  ${connectionFlag}`
            }
        }

    });
    keyStr = keyStr.slice(0, keyStr.length - 3)
    return keyStr ? ` WHERE ${keyStr} ` : ''
}

// 链表查询处理
const innerJoinFN = (joinData) => {
    let innerJoin = ''
    if (typeof joinData == 'object') {
        Object.keys(joinData).forEach((key, index) => {
            if (index == 0) {
                innerJoin += key
            } else {
                if (joinData[key]) {
                    innerJoin += ` INNER JOIN ${key}  on ${joinData[key]} `
                }
            }
        })
    } else {
        innerJoin = `${joinData}`
    }
    return innerJoin
}

module.exports = {
    PsqlListMultiple,
    PsqlQuery,
    PsqlQueryTotal
}