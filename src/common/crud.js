const {
  getShortLivedToken,
  getLongLivedToken,
  getPosts,
  getRefreshedToken,
} = require("./InstagramAPI");
const { Feed } = require("../models");
const { getDateString } = require("../utils/helpers");
const { createLog } = require("../utils/log");

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
    username: posts[0].username.toLowerCase(),
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
    createLog("error", error.message, id);
    throw new Error(error.message);
  }

  const feedToUpdate = await Feed.findOne({
    where: { id },
  });

  const updatedFeed = await feedToUpdate.update({ data: posts, status: "ok" });
  return updatedFeed.get();
};

const updateAccessToken = async (accessToken, id) => {
  let updatedToken;
  try {
    updatedToken = await getRefreshedToken(accessToken);
  } catch (error) {
    createLog("error", error.message, id);
    throw new Error(error.message);
  }

  const feedToUpdate = await Feed.findOne({
    where: { id },
  });

  const updatedFeed = await feedToUpdate.update({
    access_token: updatedToken,
    last_updated_token: getDateString(),
    status: "ok",
  });
  return updatedFeed.get();
};

const getFeed = async (username) => {
  let feed;
  try {
    feed = await Feed.findOne({
      where: { username },
      attributes: {
        exclude: ["access_token"],
      },
    });
  } catch (error) {
    await createLog("error", error.message);
    throw new Error(error.message);
  }

  return feed;
};

const getAllFeeds = async () => {
  let feeds;
  try {
    feeds = await Feed.findAll({
      attributes: {
        exclude: ["access_token"],
      },
    });
  } catch (error) {
    await createLog("error", error.message);
    throw new Error(error.message);
  }

  return feeds;
};

module.exports = {
  createFeed,
  updateFeed,
  updateAccessToken,
  getFeed,
  getAllFeeds,
};
