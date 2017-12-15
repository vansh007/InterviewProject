var Sequelize = require('sequelize');

module.exports = new Sequelize('digilockDB', 'root', 'rootroot', {
    host: 'digilock.crlh1n1lseo6.us-west-2.rds.amazonaws.com',
    dialect: 'mysql',
    port: 3306,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});