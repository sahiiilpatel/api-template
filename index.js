require('dotenv').config();
const Glue = require('@hapi/glue');
const connectDB = require('./server/utils/database'); // Import DB connection
const manifest = require('./config/manifest');

const startServer = async () => {
    try {
        await connectDB(); // Connect to MongoDB

        const server = await Glue.compose(manifest, { relativeTo: __dirname });
        await server.start();
        console.log(`✅ Server running at: ${server.info.uri}`);

        return server;
    } catch (err) {
        console.error('❌ Error starting server:', err);
        process.exit(1);
    }
};

// Check if running locally (not on Vercel)
if (require.main === module) {
    startServer();
}

// Export handler for Vercel
module.exports = async (req, res) => {
    console.log("calllllllll", true);
    const server = await startServer();

    const response = await server.inject({
        method: req.method,
        url: req.url,
        payload: req.body,
        headers: req.headers
    });

    res.status(response.statusCode).send(response.result);
};
