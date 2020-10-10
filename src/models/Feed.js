const { Sequelize } = require("sequelize");
const { formatPosts } = require("../utils/helpers");
const { Database } = require("../database");

const Feed = Database.define("feed", {
  username: {
    type: Sequelize.STRING,
  },
  access_token: {
    type: Sequelize.STRING,
  },
  last_updated_token: {
    type: Sequelize.DATE,
  },
  status: {
    type: Sequelize.STRING,
  },
  last_error: {
    type: Sequelize.STRING,
  },
  data: {
    type: Sequelize.STRING,
    get() {
      return JSON.parse(this.getDataValue("data"));
    },
    set(value) {
      value = formatPosts(value);
      return this.setDataValue("data", JSON.stringify(value));
    },
  },
});

module.exports = { Feed };
