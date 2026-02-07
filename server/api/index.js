const app = require('../src/app');
const { sequelize } = require('../src/models');

let isDbSynced = false;

module.exports = async (req, res) => {
  if (!isDbSynced) {
    await sequelize.sync();
    isDbSynced = true;
  }
  return app(req, res);
};
