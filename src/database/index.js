const { Sequelize } = require("sequelize");

const Database = new Sequelize( process.env.DATABASE_URL );

module.exports = { Database };
