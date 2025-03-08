'use strict';

require('dotenv').config();
require('module-alias/register');

const Glob = require('glob');
const Glue = require('@hapi/glue');
const { manifest } = require('./config/manifest');

const startServer = async () => {
  try {
    const server = await Glue.compose(manifest, { relativeTo: __dirname });

    const services = Glob.sync('server/services/*.js');
    services.forEach((service) => {
      server.registerService(require(`${process.cwd()}/${service}`));
    });

    await server.start();
    console.log(`✅ Hapi.js server is running at: ${server.info.uri}`);
  } catch (err) {
    console.error('❌ Server failed to start:', err);
    process.exit(1);
  }
};

startServer();

module.exports = async (req, res) => {
  const response = await server.inject({
    method: req.method,
    url: req.url,
    payload: req.body,
    headers: req.headers
  });

  res.status(response.statusCode).send(response.result);
};
