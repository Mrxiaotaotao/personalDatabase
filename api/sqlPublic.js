/**
 * The sum of mysql public classes
 */

let increaseSql = require('./increaseSql');
let deleteSql = require('./deleteSql');
let changeSql = require('./changeSql');
let checkSql = require('./checkSql');

module.exports = {
    ...increaseSql,
    ...deleteSql,
    ...changeSql,
    ...checkSql
}