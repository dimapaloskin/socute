# Socute

[![Build Status](https://travis-ci.org/dimapaloskin/socute.svg?branch=master)](https://travis-ci.org/dimapaloskin/socute)

> Small and simple routing system for websocket server and client (good with [sockette](https://github.com/lukeed/sockette))

## Install

```sh
npm install socute
```

## Usage

### Server

```js
const WebSocket = require('ws')
const { Server, send } = require('socute')

const handlers = {
  hello: () => {
    console.log('Hello received')
  },

  users: {
    ping: (sender, message) => {
      console.log('Request:', message.reason)
      send(sender, 'users/pong', { reason: 'pong' })
    }
  }
}

const wss = new WebSocket.Server({ port: 31337 })
const socute = new Server(wss, { handlers })

socute.on('connection', (socket, req) => {
  const { origin } = req.headers
  // Close unexpected connections
  if (origin !== 'http://localhost:1234') {
    socket.close()
  }
})
```

### Browser client

```js
import { Client, send } from 'socute'

const handlers = {
  users: {
    pong: (sender, message) => {
      console.log('Response:', message.reason)
    }
  }
}

const ws = new WebSocket('ws://localhost:31337')
const client = new Client(ws, { handlers })

client.on('open', () => {
  send(client, 'hello')
  send(client, 'users/ping', { reason: 'ping' })
})
```

---

MIT
