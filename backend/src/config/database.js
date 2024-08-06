const Sequelize = require('sequelize');
const config = require('./config');
const logger = require('./logger');

module.exports = new Sequelize('media_scrapper', 'root', 'viquang', {
  host: 'localhost',
  dialect: 'mysql',
  logging: (msg) => logger.debug(msg),
});
