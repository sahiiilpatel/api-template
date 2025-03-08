'use strict'

require('module-alias/register')
require('dotenv').config()

const Glue = require('@hapi/glue')
const Glob = require('glob')
const { manifest } = require('./config/manifest')

const startServer = async () => {
  try {
    const server = await Glue.compose(manifest, { relativeTo: __dirname })

    const services = Glob.sync('server/services/*.js')
    services.forEach(service => {
      server.registerService(require(`${process.cwd()}/${service}`))
    })

    await server.start()
    console.log(`Server listening on ${server.info.uri}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

startServer()