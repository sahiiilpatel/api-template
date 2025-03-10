require('dotenv').config();
const Glue = require('@hapi/glue');
const connectDB = require('./server/utils/database');
const manifest = require('./config/manifest');

const startServer = async () => {
    try {
        await connectDB();

        const server = await Glue.compose(manifest, { relativeTo: __dirname });
        await server.initialize(); // Do NOT use server.start() for Vercel!

        console.log('✅ Server initialized successfully');
        return server;
    } catch (err) {
        console.error('❌ Error starting server:', err);
        process.exit(1);
    }
};

// ✅ Vercel handler
module.exports = async (req, res) => {
    const server = await startServer();

    const response = await server.inject({
        method: req.method,
        url: req.url,
        payload: req.body,
        headers: req.headers
    });

    res.status(response.statusCode).send(response.result);
};
