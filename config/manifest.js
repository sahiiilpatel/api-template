'use strict';

const config = require('config');
const mongoose = require('mongoose');
const Config = JSON.parse(JSON.stringify(config));

// Determine Environment
const ENV = process.env.NODE_ENV || 'default';
const IS_PRODUCTION = ENV === 'production';

// Swagger Configuration
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

if (IS_PRODUCTION) {
  swaggerOptions.schemes = ['https'];
  swaggerOptions.host = process.env.API_BASEPATH || Config.constants.API_BASEPATH;
  mongoose.set('debug', false); // Disable debug logs in production
} else {
  swaggerOptions.schemes = ['http', 'https'];
  mongoose.set('debug', true); // Enable debug logs for local dev
}

// Plugin Registration
let plugins = [
  { plugin: '@hapi/vision' },
  { plugin: 'hapi-swagger', options: swaggerOptions },
  { 
    plugin: 'hapi-dev-errors',
    options: { showErrors: !IS_PRODUCTION, toTerminal: true }
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
  { plugin: '@plugins/mongoose.plugin', options: { connections: Config.connections } },
  { plugin: '@plugins/auth.plugin' },
  { plugin: '@routes/root.route' }
];

// API Routes with Prefix `/api/v1`
const routesOb = {
  'auth.route': 'auth',
  'subscription-plan.route': 'subscription-plan',
  'payment.route': 'payment',
  'dashboard.route': 'dashboard',
  'pg.route': 'pg',
  'room.route': 'room',
  'hire-developer.route': 'hire-developer',
  'project-inquiry.route': 'project-inquiry'
};

Object.keys(routesOb).forEach((route) => {
  plugins.push({
    plugin: `@routes/${route}`,
    routes: { prefix: `/api/v1${routesOb[route] ? `/${routesOb[route]}` : ''}` },
  });
});

// Hapi Server Configuration
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
    debug: Config.debug,
    port: process.env.PORT || 3000, // Use port 3000 for Vercel
  },
  register: { plugins },
};

exports.options = {};
