const { updateFeed, updateAccessToken } = require("./crud");
const { getLastUpdatedByField } = require("../utils/helpers");
const { Feed } = require("../models");
const { createLog } = require("../utils/log");
const cron = require("node-cron");

// Update last updated feed every 30 minutes
cron.schedule("*/10 * * * *", async () => {
  const feedToUpdate = await getLastUpdatedByField(Feed, "updatedAt");

  if (feedToUpdate.length === 0) {
    return false;
  }

  let updatedFeed;

  try {
    updatedFeed = await updateFeed(feedToUpdate.access_token, feedToUpdate.id);
  } catch (error) {
    console.error(error);
    createLog(
      "cron",
      `❌ Updating feed for ${feedToUpdate.username} failed with error: ${error.message}`,
      feedToUpdate.id
    );
  }

  createLog(
    "cron",
    `🚀 Feed cache for ${feedToUpdate.username} updated successfully`,
    feedToUpdate.id
  );
  return updatedFeed;
});

// Updated last updated token every day at midnight
cron.schedule("0 0 * * *", async () => {
  const feedToUpdate = await getLastUpdatedByField(Feed, "last_updated_token");
  let updatedToken;

  if (feedToUpdate.length === 0) {
    return false;
  }

  try {
    updatedToken = await updateAccessToken(
      feedToUpdate.access_token,
      feedToUpdate.id
    );
  } catch (error) {
    console.error(error);
    createLog(
      "cron",
      `❌ Updating access token for ${feedToUpdate.username} failed with error: ${error.message}`,
      feedToUpdate.id
    );
  }

  createLog(
    "cron",
    `🚀 Updated access token for ${feedToUpdate.username} successfully`,
    feedToUpdate.id
  );
  return updatedToken;
});

// test
cron.schedule("* * * * *", () => {
  console.log("🚀 cron job running every minute");
});

module.exports = { cron };
