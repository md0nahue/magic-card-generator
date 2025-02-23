const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite', // Change this to 'postgres' or 'mysql' for other databases
    storage: 'database.sqlite' // Only for SQLite
});

module.exports = sequelize;