const { OPEN } = require('./constants')
const Client = require('./Client')

const send = (client, path, payload) => {
  client = client instanceof Client ? client.ws : client
  const payloadString = payload ? JSON.stringify(payload) : null

  if (client.readyState !== OPEN) {
    return
  }

  client.send(JSON.stringify({
    path,
    payload: payloadString
  }))
}

module.exports = send
