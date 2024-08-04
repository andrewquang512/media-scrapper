const Sequelize = require('sequelize');
const config = require('./config');

module.exports = new Sequelize('media_scrapper', 'root', 'home123', {
  host: 'localhost',
  dialect: 'mysql'
});
