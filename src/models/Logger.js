const { Sequelize } = require("sequelize");
const { Database } = require("../database");

const Logger = Database.define(
  "logger",
  {
    type: {
      type: Sequelize.TEXT,
    },
    message: {
      type: Sequelize.TEXT,
    },
    feedID: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = { Logger };
