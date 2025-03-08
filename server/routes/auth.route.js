'use strict';

module.exports = {
    plugin: {
        async register(server, option) {
            const API = require('@api/auth.api')
            server.route([
                {
                    method: 'POST',
                    path: '/login',
                    config: {
                        auth: null,
                        plugins: {
                            policies: ['log.policy'],
                            'hapi-swaggered': {
                                security: []
                            }
                        },
                        tags: ['api', 'Authentication'],
                        description: 'login',
                        notes: 'login',
                        validate: API.login.validate,
                        pre: API.login.pre,
                        handler: API.login.handler
                    }
                },
                {
                    method: 'POST',
                    path: '/logout',
                    config: {
                        auth: 'auth',
                        plugins: {},
                        tags: ['api', 'Contractor Authentication'],
                        description: 'User logout',
                        notes: 'User logout',
                        pre: API.logOut.pre,
                        handler: API.logOut.handler
                    },
                },
                {
                    method: 'POST',
                    path: '/signup',
                    config: {
                        auth: null,
                        plugins: {
                            policies: ['log.policy']
                        },
                        tags: ['api', 'Authentication'],
                        description: 'Signup',
                        notes: 'Signup',
                        validate: API.signUp.validate,
                        pre: API.signUp.pre,
                        handler: API.signUp.handler
                    }
                },
            ])
        },
        version: require('../../package.json').version,
        name: 'auth.routes'
    }
}