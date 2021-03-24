// 未完善

const ws = require('ws')
let ev = null
const websocket = (app) => {

  let server = app.listen(4000, () => {
    let port = server.address().port
    console.log('webSocket应用实例，访问地址为 http://localhost:' + port)
  })
  const wss = new ws.Server({ server })
  wss.on('connection', function connection(ws) {
    ev = ws
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
  }

}
module.exports = {
  websocket,
  socketSend
}