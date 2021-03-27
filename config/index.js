// 后期维护
// const {
//   host,
//   database,
//   username,
//   password,
//   port
// } = require('./database')

// module.exports = {
//   ConnectStr: `mongodb://${username}:${password}@${host}:${port}/${database}`
// }

let dev_env = require('./dev')
let prod_env = require('./prod')

module.exports = {
  dev: dev_env,
  prod: prod_env
}[process.env.NODE_ENV || 'dev']