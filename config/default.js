module.exports = {
  appName: 'trogoninfotech-backend',
  debug: {
    request: ['error', 'info'],
    log: ['info', 'error', 'warning']
  },
  constants: {
    API_BASEPATH: 'localhost:2222',
    EXPIRATION_PERIOD: '730h',
    JWT_SECRET: process.env.JWT_SECRET || 'jwtsecret'
  },
  connections: {
    db: process.env.DB
  }
}