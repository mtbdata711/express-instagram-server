const { Sequelize } = require("sequelize");
const { formatPosts } = require("../utils/helpers");
const { Database } = require("../database");

const Feed = Database.define("feed", {
  username: {
    type: Sequelize.TEXT,
  },
  access_token: {
    type: Sequelize.TEXT,
  },
  last_updated_token: {
    type: Sequelize.DATE,
  },
  status: {
    type: Sequelize.TEXT,
  },
  last_error: {
    type: Sequelize.TEXT,
  },
  data: {
    type: Sequelize.TEXT,
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
