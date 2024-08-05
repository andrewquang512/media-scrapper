const Sequelize = require('sequelize');
const config = require('./config');

module.exports = new Sequelize('media_scrapper', 'root', 'viquang', {
  host: 'localhost',
  dialect: 'mysql'
});
