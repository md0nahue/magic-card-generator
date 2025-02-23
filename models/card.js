const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Card = sequelize.define('Card', {
    url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    filepath: {
        type: DataTypes.STRING,
        allowNull: true
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {});

module.exports = Card;