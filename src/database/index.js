const { Sequelize } = require("sequelize");

const Database = new Sequelize({
  dialect: "sqlite",
  storage: "src/Database/feed.db",
});

module.exports = { Database };
