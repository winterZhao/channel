

const Sequelize = require('sequelize');
const env = require('../config/index').env;
const dbConfig = require(`../config/${env}`).database;

var sequelize = new Sequelize(dbConfig.dbname, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: 'mysql',
    port: dbConfig.port,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});



module.exports = sequelize;
