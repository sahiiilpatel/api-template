'use strict';

module.exports = {
    plugin: {
        async register(server, option) {
            const API = require('@api/payment.api')
            server.route([
                {
                    method: 'POST',
                    path: '/checkout',
                    config: {
                        auth: 'auth',
                        plugins: {
                            policies: ['log.policy'],
                        },
                        tags: ['api', 'payment'],
                        description: 'plan checkout',
                        notes: 'plan checkout',
                        validate: API.checkout.validate,
                        pre: API.checkout.pre,
                        handler: API.checkout.handler
                    },
                },
                {
                    method: 'POST',
                    path: '/verification',
                    config: {
                        auth: null,
                        plugins: {
                            policies: ['log.policy'],
                        },
                        tags: ['api', 'payment'],
                        description: 'order verification',
                        notes: 'order verification',
                        validate: API.verification.validate,
                        pre: API.verification.pre,
                        handler: API.verification.handler
                    },
                },
                {
                    method: 'POST',
                    path: '/webhook',
                    config: {
                        auth: null,
                        plugins: {
                            policies: ['log.policy'],
                        },
                        tags: ['api', 'payment'],
                        description: 'payment webhook',
                        notes: 'payment webhook',
                        validate: API.webhook.validate,
                        pre: API.webhook.pre,
                        handler: API.webhook.handler
                    },
                }
            ])
        },
        version: require('../../package.json').version,
        name: 'payment.routes'
    }
}