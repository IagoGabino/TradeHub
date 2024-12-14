'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('sales', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            idVendedor: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users', 
                    key: 'id'
                }
            },
            idComprador: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users', 
                    key: 'id'
                }
            },
            idProduto: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'books', 
                    key: 'id'
                }
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('sales');
    }
};
