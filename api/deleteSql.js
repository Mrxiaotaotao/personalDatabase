/**
 * 删除数据的sql集合
 */

const MySql = require('./mysql')

// delete from homeTable where id = '1615276626281';

const PsqlDelSingle = async (table, conditionData) => {
    let whereStr = '';
    // 条件
    Object.keys(conditionData).forEach(function (key) {
        whereStr += `${key} = '${conditionData[key]}' and `
    });
    whereStr = whereStr.slice(0, whereStr.length - 4)

    let sql = `delete from  ${table} where ${whereStr}`
    console.log(sql, '--');
    return await MySql(sql)
}

module.exports = {
    PsqlDelSingle
}