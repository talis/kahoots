'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/kahootsapp-dev'
  },
  oauth: {
    host: process.env.PERSONA_HOST || 'users.talis.com',
    port: process.env.PERSONA_PORT || 80,
    scheme: process.env.PERSONA_SCHEME || 'http',
    route: process.env.PERSONA_ROUTE || '/oauth/tokens/',
    client: process.env.PERSONA_OAUTH_CLIENT || 'primate',
    secret: process.env.PERSONA_OAUTH_SECRET || 'bananas',
    tokenCache: {
      host: process.env.PERSONA_OAUTH_TOKENCACHE_HOST || 'localhost',
      port: process.env.PERSONA_OAUTH_TOKENCACHE_PORT || 6379,
      db: process.env.PERSONA_OAUTH_TOKENCACHE_DB || 0
    },
    debug:true
  },
  babel: {
    host: process.env.BABEL_HOST || 'http://babel',
    port: process.env.BABEL_PORT || 3001
  },
  seedDB: false
}
