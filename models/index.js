const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL || 'sqlite::memory:'); // Adjust for your DB

const Card = require('./Card')(sequelize, DataTypes);

const db = { sequelize, Sequelize, Card };

module.exports = db;
