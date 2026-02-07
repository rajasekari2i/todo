let app;
let sequelize;
let isDbSynced = false;

module.exports = async (req, res) => {
  try {
    if (!app) {
      app = require('../src/app');
    }
    if (!sequelize) {
      sequelize = require('../src/models').sequelize;
    }
    if (!isDbSynced) {
      await sequelize.sync();
      isDbSynced = true;
    }
    return app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      stack: error.stack,
      env_check: {
        NODE_ENV: process.env.NODE_ENV || 'NOT SET',
        DB_HOST: process.env.DB_HOST ? 'SET' : 'NOT SET',
        DB_NAME: process.env.DB_NAME ? 'SET' : 'NOT SET',
        DB_USER: process.env.DB_USER ? 'SET' : 'NOT SET',
        DB_PASSWORD: process.env.DB_PASSWORD ? 'SET' : 'NOT SET',
        JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
      }
    });
  }
};
