const Sequelize = require("sequelize");
const database = require("../database");

const Review = database.define("review", {
  author_name: { type: Sequelize.STRING, allowNull: false },
  rating: { type: Sequelize.INTEGER, allowNull: false },
  text: { type: Sequelize.TEXT },
  time: { type: Sequelize.DATE(6), allowNull: false }
});

module.exports = {
  Review,
};
