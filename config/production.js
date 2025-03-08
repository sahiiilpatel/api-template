module.exports = {
  appName: 'trogoninfotech-backend',
  debug: {
    request: ['error', 'info'],
    log: ['info', 'error', 'warning']
  },
  constants: {
    API_BASEPATH: 'api-trogoninfotech.ap-south-1.elasticbeanstalk.com',
    EXPIRATION_PERIOD: '730h',
    JWT_SECRET: process.env.JWT_SECRET || 'jwtsecret'
  },
  connections: {
    db: process.env.DB
  }
}
