const Jwt = require('@hapi/jwt');

exports.plugin = {
    name: 'auth',
    version: '1.0.0',
    register: async (server) => {
        await server.register(Jwt);

        server.auth.strategy('jwt', 'jwt', {
            keys: process.env.JWT_SECRET,
            verify: {
                aud: false, // Audience (optional)
                iss: false, // Issuer (optional)
                sub: false, // Subject (optional)
                maxAgeSec: 14400 // Token expiration in seconds (4 hours)
            },
            validate: (decoded, request, h) => {
                return { isValid: true, credentials: decoded };
            }
        });

        server.auth.default('jwt');
    }
};
