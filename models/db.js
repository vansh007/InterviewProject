const Sequelize = require('sequelize');
const sequelize = require('./sequelize');

module.exports.Users = require('./users')(sequelize, Sequelize);
module.exports.sequelize = sequelize;