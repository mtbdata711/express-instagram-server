const { Feed } = require("./Feed");
const { Logger } = require("./Logger");

const init = async () => {
  await Feed.sync({ force: false });
  await Logger.sync({ force: false });
};

init();

module.exports = { Feed, Logger };
