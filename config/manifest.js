require('dotenv').config();

module.exports = {
    server: {
        port: process.env.PORT || 4000,
        host: 'localhost'
    },
    register: {
        plugins: [
            { plugin: './server/plugins/auth' },
            { plugin: './server/routes' }
        ]
    }
};
