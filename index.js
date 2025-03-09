'use strict';

require('dotenv').config();
require('module-alias/register');

const Glob = require('glob');
const Glue = require('@hapi/glue');
const { manifest } = require('./config/manifest');

let server;

const initServer = async () => {
  try {
    server = await Glue.compose(manifest, { relativeTo: __dirname });

    const services = Glob.sync('server/services/*.js');
    services.forEach((service) => {
      server.registerService(require(`${process.cwd()}/${service}`));
    });

    await server.initialize(); // Use `initialize` instead of `start` for serverless
    console.log(`✅ Hapi.js server initialized`);
  } catch (err) {
    console.error('❌ Server failed to initialize:', err);
    process.exit(1);
  }
};

// Initialize the server once
initServer();

module.exports = async (req, res) => {
  const response = await server.inject({
    method: req.method,
    url: req.url,
    payload: req.body,
    headers: req.headers,
  });

  res.status(response.statusCode).send(response.result);
};