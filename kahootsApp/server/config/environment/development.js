'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/kahootsapp-dev'
  },
  oauth: {
    host: process.env.PERSONA_HOST || 'persona',
    port: process.env.PERSONA_PORT || 80,
    scheme: process.env.PERSONA_SCHEME || 'http',
    route: process.env.PERSONA_ROUTE || '/oauth/tokens/',
    client: process.env.PERSONA_OAUTH_CLIENT || 'primate',
    secret: process.env.PERSONA_OAUTH_SECRET || 'bananas',
    tokenCache: {
      host: process.env.PERSONA_OAUTH_TOKENCACHE_HOST || 'localhost',
      port: process.env.PERSONA_OAUTH_TOKENCACHE_PORT || 6379,
      db: process.env.PERSONA_OAUTH_TOKENCACHE_DB || 0
    }
  },
  seedDB: true
}
