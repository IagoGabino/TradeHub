const { Sequelize } = require('sequelize');
const config = require('../config/config').development;

const sequelize = new Sequelize({
    dialect: config.dialect,
    storage: config.storage 
});

sequelize.authenticate()
    .then(() => {
        console.log('Conexão estabelecida com sucesso.');
    })
    .catch(error => {
        console.error('Não foi possível conectar ao banco de dados:', error);
    });

module.exports = sequelize;