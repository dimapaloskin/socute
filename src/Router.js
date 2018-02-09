class Router {
  constructor ({ handlers }) {
    this.handlers = handlers
  }

  getHandler (path) {
    if (!path.includes('/')) {
      return this.handlers[path] || null
    }

    const pathArray = path.split('/')
    const handler = pathArray.reduce((accum, part) => {
      if (!accum) {
        return null
      }

      const step = accum[part]
      return step || null
    }, this.handlers)

    return handler
  }
}

module.exports = Router
