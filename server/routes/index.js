const userRoutes = require('../api/userRoutes');

exports.plugin = {
    name: 'routes',
    version: '1.0.0',
    register: async (server) => {
        server.route(userRoutes);
    }
};
