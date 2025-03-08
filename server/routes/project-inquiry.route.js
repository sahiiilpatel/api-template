'use strict';

module.exports = {
    plugin: {
        async register(server, option) {
            const API = require('@api/project-inquiry.api')
            server.route([
                {
                    method: 'POST',
                    path: '/',
                    config: {
                        auth: null,
                        plugins: {
                            policies: ['log.policy'],
                        },
                        tags: ['api', 'Project Inquiry'],
                        description: 'project inquiry',
                        notes: 'project inquiry',
                        validate: API.projectInquiry.validate,
                        pre: API.projectInquiry.pre,
                        handler: API.projectInquiry.handler
                    },
                },
            ])
        },
        version: require('../../package.json').version,
        name: 'project-inquiry.routes'
    }
}