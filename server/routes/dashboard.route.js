'use strict';

module.exports = {
    plugin: {
        async register(server, option) {
            const API = require('@api/dashboard.api')
            server.route([
                {
                    method: 'GET',
                    path: '/',
                    config: {
                        auth: 'auth',
                        plugins: {
                            policies: ['log.policy'],
                        },
                        tags: ['api', 'dashboard'],
                        description: 'get dashboard data',
                        notes: 'get dashboard data',
                        validate: API.dashboard.validate,
                        pre: API.dashboard.pre,
                        handler: API.dashboard.handler
                    },
                }
            ])
        },
        version: require('../../package.json').version,
        name: 'dashboard.routes'
    }
}