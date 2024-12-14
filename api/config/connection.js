const { Sequelize } = require('sequelize');
const config = require('./config').development;

const sequelize = new Sequelize({
    dialect: config.dialect,
    storage: config.storage
});

module.exports = sequelize;