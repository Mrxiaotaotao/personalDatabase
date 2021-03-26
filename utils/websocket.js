// 未完善

const ws = require('ws')
let webToken = require('../utils/jsonWebToken')
const { urlController } = require('./tools')

// 连接成功后触发类
let ev = null
const websocket = (app) => {

  // let server = app.listen(4000, () => {
  //   let port = server.address().port
  //   console.log('webSocket应用实例，访问地址为 http://localhost:' + port)
  // })

  /**
   * ws.Server 参数
   * host {String} 要绑定的服务器主机名
   * port {Number} 要绑定的服务器端口
   * backlog {Number} 挂起连接队列的最大长度.
   * server {http.Server|https.Server} 一个预创建的HTTP/S服务器
   * verifyClient {Function} 验证传入连接的函数。
   * handleProtocols {Function} 处理子协议的函数。
   * path {String} 只接受与此路径匹配的连接
   * noServer {Boolean} 启用无服务器模式
   * clientTracking {Boolean} 是否记录连接clients
   * perMessageDeflate {Boolean|Object} 开启关闭zlib压缩(配置)
   * maxPayload {Number} 最大消息载荷大小（bytes）
   */
  // 实例配置
  let setting = {
    port: 9999,
    path: '/communicate'
  }

  console.log('webSocket应用实例，访问地址为 http://172.0.0.1:' + setting.port + setting.path)

  const wss = new ws.Server(setting)
  wss.on('connection', function connection(ws, data) {
    ev = ws
    const { jwt } = urlController(data.url)

    // jwt校验及解密处理
    let payload = webToken(jwt)

    //开始时间大于结束时间，代表token无效关闭服务
    if (payload.iat > payload.exp) {
      console.log(payload, 'jwt校验失败，关闭连接');
      ws.close()
    }

    ws.on('message', function incoming(message) {
      console.log('received: %s', message)
      ws.send(message)
    })
  })
}

// 发送数据
const socketSend = (data) => {
  if (ev) {
    ev.send(data)
  } else {
    console.log('未有连接开启')
  }
}

module.exports = {
  websocket,
  socketSend
}