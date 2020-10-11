const { Feed, Logger } = require("../models");

const createLog = async (type, message, feedID = null) => {
  const newLog = await Logger.create({
    type,
    message,
    feedID,
  });

  if (feedID) {
    await logFeedError(JSON.stringify(newLog.get()), feedID);
  }

  return newLog;
};

const logFeedError = async (last_error, id) => {
  const feedToUpdate = await Feed.findOne({
    where: { id },
  });

  return await feedToUpdate.update({
    last_error,
    status: "error",
  });
};

module.exports = { createLog };
