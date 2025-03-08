'use strict';

module.exports = {
    plugin: {
        async register(server, option) {
            const API = require('@api/pg.api')
            server.route([
                {
                    method: 'GET',
                    path: '/',
                    config: {
                        auth: 'auth',
                        plugins: {
                            policies: ['log.policy'],
                        },
                        tags: ['api', 'PG'],
                        description: 'get pg list',
                        notes: 'get pg list',
                        validate: API.getPgList.validate,
                        pre: API.getPgList.pre,
                        handler: API.getPgList.handler
                    },
                },
                {
                    method: 'POST',
                    path: '/add-pg',
                    config: {
                        auth: 'auth',
                        plugins: {
                            policies: ['log.policy'],
                        },
                        tags: ['api', 'PG'],
                        description: 'add new pg',
                        notes: 'add new pg',
                        validate: API.addNewPg.validate,
                        pre: API.addNewPg.pre,
                        handler: API.addNewPg.handler
                    },
                },
                {
                    method: 'DELETE',
                    path: '/{pgId}',
                    config: {
                        auth: 'auth',
                        plugins: {
                            policies: ['log.policy'],
                        },
                        tags: ['api', 'PG'],
                        description: 'delete pg',
                        notes: 'delete pg',
                        validate: API.deletePg.validate,
                        pre: API.deletePg.pre,
                        handler: API.deletePg.handler
                    },
                },
                {
                    method: 'GET',
                    path: '/name-list',
                    config: {
                        auth: 'auth',
                        plugins: {
                            policies: ['log.policy'],
                        },
                        tags: ['api', 'PG'],
                        description: 'get all pg name list',
                        notes: 'get all pg name list',
                        validate: API.getPgNameList.validate,
                        pre: API.getPgNameList.pre,
                        handler: API.getPgNameList.handler
                    },
                }
            ])
        },
        version: require('../../package.json').version,
        name: 'pg.routes'
    }
}