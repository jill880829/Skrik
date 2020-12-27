import http from 'http'
import express  from 'express'
import WebSocket from 'ws'

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })
let codes = ''

wss.on('connection', ws => {
  const sendData = (client, data) => {
    client.send(JSON.stringify(data))
  }

  sendData(ws, ['output', codes])

  ws.onmessage = (message) => {
    const { data } = message
    console.log(data)
    const [task, payload] = JSON.parse(data)

    switch (task) {
      case 'input': {
        codes = payload
        console.log(codes)
        wss.clients.forEach((client) => {
          if(client.readyState === WebSocket.OPEN) {
            sendData(client, ['output', codes])
          }
        })
        break
      }
      default:
        break
    }
  }
})
const PORT = process.env.port || 4000

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`)
})