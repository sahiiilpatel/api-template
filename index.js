require('dotenv').config();
const Path = require('path'); 
const Glue = require('@hapi/glue');
const connectDB = require('./server/utils/database'); 
const manifest = require('./config/manifest');

const startServer = async () => {
    try {
        await connectDB();

        const server = await Glue.compose(manifest, { 
            relativeTo: Path.join(__dirname, 'server') // Fix incorrect path
        });

        await server.start();
        console.log(`✅ Server running at: ${server.info.uri}`);

        return server;
    } catch (err) {
        console.error('❌ Error starting server:', err);
        process.exit(1);
    }
};

// Start server only if running locally
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
