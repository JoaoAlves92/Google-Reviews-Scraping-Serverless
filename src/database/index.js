const pg = require("pg");
const databaseConfig = require("../config/database");

module.exports = {
  pool: new pg.Pool(databaseConfig),
};