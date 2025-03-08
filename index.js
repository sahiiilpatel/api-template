'use strict';

require('module-alias/register');
require('dotenv').config();

const Glue = require('@hapi/glue');
const Glob = require('glob');
const { manifest } = require('./config/manifest');

const startServer = async () => {
  try {
    console.log("@@@@@@@@@@@@@@@ start", true);
    console.log('manifest: @@@@@@@@@@@@@@@@', manifest.register);
    console.log('manifest: @@@@@@@@@@@@@@@@', manifest);
    const server = await Glue.compose(manifest, { relativeTo: __dirname });

    const services = Glob.sync('server/services/*.js');
    services.forEach((service) => {
      server.registerService(require(`${process.cwd()}/${service}`)); // ✅ Works in CommonJS
    });

    await server.start();
    console.log(`✅ Hapi.js server is running at: ${server.info.uri}`);
  } catch (err) {
    console.error('❌ Server failed to start:', err);
    process.exit(1);
  }
};

// Start the server
startServer();

// ✅ Export for Vercel
module.exports = async (req, res) => {
  const response = await server.inject({
    method: req.method,
    url: req.url,
    payload: req.body,
    headers: req.headers
  });

  res.status(response.statusCode).send(response.result);
};
