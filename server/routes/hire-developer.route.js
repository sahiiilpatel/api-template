'use strict';

module.exports = {
    plugin: {
        async register(server, option) {
            const API = require('@api/hire-developer.api')
            server.route([
                {
                    method: 'POST',
                    path: '/',
                    config: {
                        auth: null,
                        plugins: {
                            policies: ['log.policy'],
                        },
                        tags: ['api', 'Hire Developer'],
                        description: 'hire developer',
                        notes: 'hire developer',
                        validate: API.hireDeveloper.validate,
                        pre: API.hireDeveloper.pre,
                        handler: API.hireDeveloper.handler
                    },
                },
            ])
        },
        version: require('../../package.json').version,
        name: 'hire-developer.routes'
    }
}