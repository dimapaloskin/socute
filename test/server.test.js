import test from 'ava'
import WebSocket from 'ws'
import getPort from 'get-port'

import { Server, Client, send } from '../'

const serverHandlers = {}
const clientHandlers = {}

let port
// eslint-disable-next-line no-unused-vars
let server
let client

const createClient = () => new Promise(resolve => {
  const ws = new WebSocket(`ws://localhost:${port}`)
  client = new Client(ws, {
    handlers: clientHandlers
  })
  client.on('open', resolve)
})

const createServer = () => new Promise(resolve => {
  const wss = new WebSocket.Server({ port }, resolve)
  server = new Server(wss, {
    handlers: serverHandlers
  })
})

test.before(async t => {
  port = await getPort()
  await createServer()
  await createClient()
})

test.cb('Should send message to server without payload', t => {
  t.plan(1)

  serverHandlers.nope = (sender, message) => {
    t.is(message, null)
    t.end()
  }

  send(client.ws, 'nope')
})

test.cb('Should send message to server with payload', t => {
  t.plan(1)

  serverHandlers.hello = (sender, message) => {
    t.deepEqual(message, { say: 'hello' })
    t.end()
  }

  send(client.ws, 'hello', { say: 'hello' })
})

test.cb('Should send message with nested path and receive answer', t => {
  t.plan(3)

  serverHandlers.deep = {
    deeper: {
      ping: (sender, message) => {
        t.deepEqual(message, { reason: 'ping' })
        send(sender, 'deep/deeper/pong', { reason: 'pong' })
      },

      final: (sender, message) => {
        t.deepEqual(message, { final: true })
        t.end()
      }
    }
  }

  clientHandlers.deep = {
    deeper: {
      pong: (sender, message) => {
        t.deepEqual(message, { reason: 'pong' })
        send(sender, 'deep/deeper/final', { final: true })
      }
    }
  }

  send(client.ws, 'deep/deeper/ping', { reason: 'ping' })
})
