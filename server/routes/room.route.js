'use strict';

module.exports = {
    plugin: {
        async register(server, option) {
            const API = require('@api/room.api')
            server.route([
                {
                    method: 'GET',
                    path: '/',
                    config: {
                        auth: 'auth',
                        plugins: {
                            policies: ['log.policy'],
                        },
                        tags: ['api', 'room'],
                        description: 'get room list',
                        notes: 'get room list',
                        validate: API.getRoomList.validate,
                        pre: API.getRoomList.pre,
                        handler: API.getRoomList.handler
                    },
                },
                {
                    method: 'POST',
                    path: '/add-room',
                    config: {
                        auth: 'auth',
                        plugins: {
                            policies: ['log.policy'],
                        },
                        tags: ['api', 'room'],
                        description: 'add new room',
                        notes: 'add new room',
                        validate: API.addRoom.validate,
                        pre: API.addRoom.pre,
                        handler: API.addRoom.handler
                    },
                }
            ])
        },
        version: require('../../package.json').version,
        name: 'room.routes'
    }
}