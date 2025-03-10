const Path = require('path');

module.exports = {
    server: {
        port: process.env.PORT || 3000,
        host: 'localhost',
        routes: {
            cors: true
        }
    },
    register: {
        plugins: [
            {
                plugin: require('@hapi/inert') // Example plugin
            },
            {
                plugin: require('@hapi/vision') // Example plugin
            },
            {
                plugin: require('../server/routes'), // Fix path here
                options: {}
            }
        ]
    }
};
