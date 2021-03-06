var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    basePath:'http://localhost:3000/',
    app: {
      name: 'blog'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/nodeblog'
  },

  test: {
    root: rootPath,
    app: {
      name: 'blog'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/blog-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'blog'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/blog-production'
  }
};

module.exports = config[env];
