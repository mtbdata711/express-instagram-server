const {
  getShortLivedToken,
  getLongLivedToken,
  getPosts,
  getRefreshedToken,
} = require("./InstagramAPI");
const { Feed } = require("../models");
const { getDateString } = require("../utils/helpers");
const { logFeedError, createLog } = require("../utils/log");

const createFeed = async (code) => {
  let posts;
  let longLivedToken;

  try {
    const shortLivedToken = await getShortLivedToken(code);
    longLivedToken = await getLongLivedToken(shortLivedToken);
    posts = await getPosts(longLivedToken);
    posts = posts.data;
  } catch (error) {
    // log error && send error back to client
    await createLog("error", error.message);
    throw new Error(error.message);
  }

  const feed = await Feed.create({
    username: posts[0].username,
    last_updated_token: new Date().toISOString(),
    status: "ok",
    last_error: null,
    access_token: longLivedToken,
    data: posts,
  });

  return feed.get();
};

const updateFeed = async (accessToken, id) => {
  let posts;
  try {
    posts = await getPosts(accessToken);
    posts = posts.data;
  } catch (error) {
    logFeedError(error.message, id);
    throw new Error(error.message);
  }

  const feedToUpdate = await Feed.findOne({
    where: { id },
  });

  const updatedFeed = await feedToUpdate.update({ data: posts });
  return updatedFeed.get();
};

const updateAccessToken = async (accessToken, id) => {
  let updatedToken;
  try {
    updatedToken = await getRefreshedToken(accessToken);
  } catch (error) {
    logFeedError(error.message, id);
    throw new Error(error.message);
  }

  const feedToUpdate = await Feed.findOne({
    where: { id },
  });

  const updatedFeed = await feedToUpdate.update({
    access_token: updatedToken,
    last_updated_token: getDateString(),
  });
  return updatedFeed.get();
};

module.exports = { createFeed, updateFeed, updateAccessToken };