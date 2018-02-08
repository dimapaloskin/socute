const { EventEmitter } = require('events')
const debug = require('debug')

const Router = require('./Router')
const listener = require('./listener')

const info = debug('socute:server:info')
const error = debug('socute:server:error')

class Server extends EventEmitter {
  constructor (wss, { handlers = {}, router } = {}) {
    super()

    info('Create server')
    this.wss = wss
    this.router = router || new Router({ handlers })

    this.create()
  }

  create () {
    this.wss.on('error', err => {
      error(err)
      this.emit('error', err)
    })

    this.wss.on('connection', (client, req) => {
      info(`New connection: ${req.headers.origin}`)
      this.emit('connection', client, req)

      client.addEventListener('message', listener(client, this.router))
    })
  }
}

module.exports = Server
