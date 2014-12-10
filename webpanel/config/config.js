var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'webpanel'
    },
    port: 3000,
    db: 'mongodb://localhost/webpanel-development'
    
  },

  test: {
    root: rootPath,
    app: {
      name: 'webpanel'
    },
    port: 3000,
    db: 'mongodb://localhost/webpanel-test'
    
  },

  production: {
    root: rootPath,
    app: {
      name: 'webpanel'
    },
    port: 3000,
    db: 'mongodb://localhost/webpanel-production'
    
  }
};

module.exports = config[env];
