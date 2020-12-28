import http from 'http'
import express  from 'express'
import WebSocket from 'ws'

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })
let buffers = {}

wss.on('connection', ws => {
  const sendData = (client, data) => {
    client.send(JSON.stringify(data))
  }

  ws.onmessage = (message) => {
    const { data } = message
    const [task, payload] = JSON.parse(data)

    switch (task) {
      case 'input': {
        const author = payload.author
        const content = payload.content
        if(content.length === 2 && content[0].ope + content[1].ope === 1 && content[0].start === content[1].start && content[0].start + 1 === content[0].end && content[0].end === content[1].end) {
          if(buffers[author] === undefined) {
            buffers[author] = {line: content[0].start, text: ''}
          }
          if(content[0].start != buffers[author].line) {
            if(buffers[author].line != '') {
              // TODO: send buffer[author] to DB
            }
            buffers[author].line = content[0].start
          }
          buffers[author].text = (content[0].ope === 0)? content[0].content: content[1].content
        }
        else {
          if(buffers[author] === undefined) {
            buffers[author] = {line: content[0].start, text: ''}
          }
          if(buffers[author].text != '') {
            // TODO: send buffer[author] to DB
            console.log(buffers[author].text)
            buffers[author].text = ''
          }
          if(content.length === 2) {
            //TODO: send content[0] & content[1] to DB
            console.log(content[0].content, content[1].content)
          }
          else if(content.length === 1 && content[0].ope === 0) {
            //TODO: send content[0] to DB
            console.log(content[0].content)
          }
          else if(content.length === 1 && content[0].ope === 1) {
            //TODO: send content[0] to DB
            console.log(content[0].content)
          }
        }
        // console.log(buffers)
        wss.clients.forEach((client) => {
          if(client.readyState === WebSocket.OPEN) {
            sendData(client, ['output', payload])
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