'use strict'

module.exports = {
  plugin: {
    async register(server, options) {
      server.route([
        {
          method: 'GET',
          path: '/',
          config: {
            auth: null,
            plugins: {
              policies: []
            },
            tags: [],
            handler: async (request, h) => {
              const moment = require('moment-timezone');
              const d = new Date(request.server.info.started)
              const utc = d.getTime() + d.getTimezoneOffset() * 60000
              const nd = new Date(utc + 3600000 * +5.5)
              return h.response({
                up: new Date().getTime() - request.server.info.started,
                upTime: nd.toLocaleString(),
                serverTime: moment().format('MMMM Do YYYY, h:mm:ss a')
              })
            }
          }
        }
      ])
    },
    version: require('../../package.json').version,
    name: 'root-routes'
  }
}
