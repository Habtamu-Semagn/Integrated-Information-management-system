module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '7.0.3',
      skipMD5: true
    },
    instance: {
      dbName: 'startup-backend-test'
    },
    autoStart: false
  }
};
