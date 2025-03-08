'use strict';

module.exports = {
    plugin: {
        async register(server, option) {
            const API = require('@api/subscription-plan.api')
            server.route([
                {
                    method: 'GET',
                    path: '/',
                    config: {
                        auth: 'auth',
                        plugins: {
                            policies: ['log.policy'],
                        },
                        tags: ['api', 'subscription-plan'],
                        description: 'get all subscription plans',
                        notes: 'get all subscription plans',
                        validate: API.subscriptionPlanList.validate,
                        pre: API.subscriptionPlanList.pre,
                        handler: API.subscriptionPlanList.handler
                    },
                }
            ])
        },
        version: require('../../package.json').version,
        name: 'subscription-plan.routes'
    }
}