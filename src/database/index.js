const databaseConfig = require("../config/database");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(databaseConfig);

module.exports = sequelize;
