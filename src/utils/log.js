const { Feed, Logger } = require("../models");

const logFeedError = async (last_error, id) => {
  const feedToUpdate = await Feed.findOne({
    where: { id },
  });

  const updatedFeed = await feedToUpdate.update({
    last_error,
    status: "error",
  });

  await createLog("error", last_error, feedID);

  return updatedFeed.get();
};

const createLog = async (type, message, feedID = null) => {
  return await Logger.create({
    type,
    message,
    feedID,
  });
};

module.exports = { logFeedError, createLog };
