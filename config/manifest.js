'use strict';

const mongoose = require('mongoose');

process.env.NODE_ENV = 'production';
process.env.NODE_CONFIG_DIR = `${__dirname}`;

const swaggerOptions = {
  info: {
    title: 'trogoninfotech-api-v1',
    version: require('../package.json').version,
    description: 'trogoninfotech-api-v1',
  },
  documentationPath: '/docs',
  basePath: '/api',
  tags: [],
  grouping: 'tags',
  securityDefinitions: {
    jwt: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
    },
  },
  security: [{ jwt: [] }],
};

swaggerOptions.schemes = ['https'];
swaggerOptions.host = 'api-three-mocha-92.vercel.app';
mongoose.set('debug', false);

let plugins = [
  { plugin: '@hapi/vision' },
  { plugin: 'hapi-swagger', options: swaggerOptions },
  {
    plugin: 'hapi-dev-errors',
    options: { showErrors: false, toTerminal: true }
  },
  { plugin: '@hapi/inert' },
  { plugin: 'hapi-auth-jwt2' },
  { plugin: '@hapi/basic' },
  { plugin: '@hapipal/schmervice' },
  {
    plugin: 'mrhorse',
    options: {
      policyDirectory: `${__dirname}/../server/policies`,
      defaultApplyPoint: 'onPreHandler',
    },
  },
  { plugin: '@plugins/mongoose.plugin', options: { connections: { db: process.env.DB } } },
  { plugin: '@routes/root.route' }
];

const routesOb = {}

Object.keys(routesOb).forEach((route) => {
  plugins.push({
    plugin: `@routes/${route}`,
    routes: { prefix: `/api/v1${routesOb[route] ? `/${routesOb[route]}` : ''}` },
  });
});

exports.manifest = {
  server: {
    router: {
      stripTrailingSlash: true,
      isCaseSensitive: false,
    },
    routes: {
      security: {
        hsts: false,
        xss: 'enabled',
        noOpen: true,
        noSniff: true,
        xframe: false,
      },
      cors: {
        origin: ['*'],
        headers: [
          'Accept',
          'Authorization',
          'Content-Type',
          'Origin',
          'X-Requested-With'
        ],
      },
      validate: {
        failAction: async (request, h, err) => {
          request.server.log(['validation', 'error'], 'Joi validation error');
          throw err;
        },
      },
      auth: false,
    },
    debug: {
      request: ['error', 'info'],
      log: ['info', 'error', 'warning']
    },
    port: process.env.PORT || 3000,
  },
  register: { plugins },
};

exports.options = {};
