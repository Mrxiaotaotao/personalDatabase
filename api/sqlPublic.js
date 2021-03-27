/**
 * The sum of mysql public classes
 */

const MySql = require('./mysql')
// 查询sql
let querySql = require('./querySql');


/* ********************* 增 ********************* */

/**
 * 添加数据
 * @param {*} table Parent table name
 * @param {*} data The data to be added, the key is the field name, and the value is the field value|| Object
 * @returns Boolean
 */
const PsqlAdd = async (table, data) => {
    if (data) {
        let keys = '', values = ''
        Object.keys(data).forEach(function (key) {
            keys += key + ','
            values += `"${data[key]}",`
        });
        keys = keys.slice(0, keys.length - 1)
        values = values.slice(0, values.length - 1)
        let sql = `INSERT INTO ${table} (${keys}) values (${values});`
        console.log(sql, '增')
        return await MySql(sql)
    } else {
        return { error: '添加失败！' }
    }
}

/* ********************* 删 ********************* */

const PsqlDelSingle = async (table, conditionData) => {
    let whereStr = '';
    // 条件
    Object.keys(conditionData).forEach(function (key) {
        whereStr += `${key} = '${conditionData[key]}' and `
    });
    whereStr = whereStr.slice(0, whereStr.length - 4)

    let sql = `delete from  ${table} where ${whereStr}`
    console.log(sql, '删');
    return await MySql(sql)
}

/* ********************* 改 ********************* */

/**
 * 修改单条数据中多个属性值
 * @param {*} table table name
 * @param {*} modifyData Modified  data | type obj
 * @param {*} conditionData Conditional data | type obj
 */
const PsqlModifyAsingle = async (table, modifyData, conditionData) => {
    let whereStr = '', data = '';
    // 条件
    Object.keys(conditionData).forEach(function (key) {
        whereStr += `${key} = '${conditionData[key]}' and `
    });
    whereStr = whereStr.slice(0, whereStr.length - 4)
    // 修改的数据
    Object.keys(modifyData).forEach(function (key) {
        data += `${key} = "${modifyData[key]}" , `
    });
    data = data.slice(0, data.length - 2)
    let sql = `UPDATE ${table} SET ${data} WHERE ${whereStr}`
    console.log(sql, '改');
    return await MySql(sql)
}

module.exports = {
    ...querySql,
    PsqlAdd,
    PsqlDelSingle,
    PsqlModifyAsingle
}