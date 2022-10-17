const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', '#Developer#85#', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
