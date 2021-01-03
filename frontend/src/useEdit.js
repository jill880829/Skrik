import { useState } from 'react'
import { diffLines } from 'diff'
import sliceLines from 'slice-lines'
const client = new WebSocket('ws://localhost:4000')

const useEdit = () => {
  const [codes, setCodes] = useState('')
  const [opened, setOpened] = useState(false)

  client.onmessage = (message) => {
    const { data } = message
    const [task, update] = JSON.parse(data)

    if(task === 'output') {
      let tmp = codes;
      const content = update.content
      content.forEach((part) => {
        if(part.ope === 0) {
          if(part.start === 0) tmp = part.content + sliceLines(tmp, part.start)
          else tmp = sliceLines(tmp, 0, part.start) + '\n' + part.content + sliceLines(tmp, part.start)
        }
        else {
          if(part.start === 0) tmp = sliceLines(tmp, part.end)
          else tmp = sliceLines(tmp, 0, part.start) + '\n' + sliceLines(tmp, part.end)
        } 
      })
      setCodes(tmp)
    }
  }

  client.onopen = () => {
    console.log('onopen')
    setOpened(true)
  }

  const sendData = (data) => {
    client.send(JSON.stringify(data))
  }

  const sendCodes = (code) => {
    let diff = diffLines(codes, code)
    let diff_code = []
    let count_line = 0
    diff.forEach((part) => {
      if(part.added) {
        diff_code.push({ope: 0, start: count_line, end: count_line+part.count, content:part.value})
        count_line += part.count
      }
      else if(part.removed) {
        diff_code.push({ope: 1, start: count_line, end: count_line+part.count, content:part.value})
      }
      else {
        count_line += part.count
      }
    })
    // console.log(codes)
    // console.log(code)
    // console.log(diff)
    sendData(['input', {author: 'a', content: diff_code}])
  }

  return {
    codes,
    opened,
    sendCodes
  }
}

export default useEdit