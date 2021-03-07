/**
 * 修改数据的sql集合
 */

const MySql = require('./mysql')

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
        // console.log(key, modifyData[key]);
        data += `${key} = "${modifyData[key]}" , `
    });
    data = data.slice(0, data.length - 2)
    let sql = `UPDATE ${table} SET ${data} WHERE ${whereStr}`
    console.log(sql, '--');
    return await MySql(sql)
}


module.exports = { PsqlModifyAsingle, }