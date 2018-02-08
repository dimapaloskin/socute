const { EventEmitter } = require('events')
const debug = require('debug')
const isBrowser = require('is-browser')

const Router = require('./Router')
const listener = require('./listener')

const info = debug('socute:client:info')

class Client extends EventEmitter {
  constructor (ws, { handlers = {}, router } = {}) {
    super()

    this.ws = ws

    this.router = router || new Router({ handlers })
    this.create()
  }

  create () {
    this.ws.addEventListener('open', () => {
      info('Connection opened')
      this.emit('open')

      if (isBrowser) {
        // fix chrome stuff
        // https://github.com/websockets/ws/issues/1256
        window.addEventListener('beforeunload', () => {
          this.ws.close()
        })
      }

      this.ws.addEventListener('message', listener(this.ws, this.router))
    })
  }
}

module.exports = Client
