import { useState } from 'react'

const client = new WebSocket('ws://localhost:4000')

const useEdit = () => {
  const [codes, setCodes] = useState('')
  const [opened, setOpened] = useState(false)

  client.onmessage = (message) => {
    const { data } = message
    const [task, update] = JSON.parse(data)

    if(task === 'output') setCodes(() => update)
  }

  client.onopen = () => {
    console.log('onopen')
    setOpened(true)
  }

  const sendData = (data) => {
    client.send(JSON.stringify(data))
  }

  const sendCodes = (codes) => {
    sendData(['input', codes])
  }

  return {
    codes,
    opened,
    sendCodes
  }
}

export default useEdit

