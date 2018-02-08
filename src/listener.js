const debug = require('debug')

const { OPEN } = require('./constants')

const info = debug('socute:lisetner:info')

const listener = (sender, router) => {
  return (event) => {
    try {
      if (sender.readyState !== OPEN) {
        return
      }

      const { path, payload } = JSON.parse(event.data)
      const handler = router.getHandler(path)

      if (!handler || typeof handler !== 'function') {
        info(`Handler "${path}" does not found`)
        return
      }

      const payloadObj = typeof payload === 'string' ? JSON.parse(payload) : payload
      info(`Handle "${path}"`)
      handler(sender, payloadObj)
    } catch (err) {
      throw new Error(err)
    }
  }
}

module.exports = listener
