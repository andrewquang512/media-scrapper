const Sequelize = require('sequelize');
const config = require('./config');
const logger = require('./logger');

module.exports = new Sequelize(config.sequalize.name, config.sequalize.username, config.sequalize.password, {
  host: config.sequalize.host,
  dialect: 'mysql',
  logging: (msg) => logger.debug(msg),
});
