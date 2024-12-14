const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const User = require('./User');

class Product extends Model { }

Product.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    preco: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    foto: {
        type: DataTypes.STRING,
        allowNull: true
    },
    estadoConservacao: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isIn: [[1, 2, 3]]
        }
    },
    available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    idVendedor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true
});

module.exports = Product;
