const { Sequelize } = require("sequelize");
const { Database } = require("../database");

const Logger = Database.define(
  "logger",
  {
    type: {
      type: Sequelize.STRING,
    },
    message: {
      type: Sequelize.STRING,
    },
    feedID: {
      type: Sequelize.NUMBER,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = { Logger };
