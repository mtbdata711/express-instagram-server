const routes = require("express").Router();
const { createFeed, getFeed, getAllFeeds } = require("./src/common/crud");

routes.get("/feed/:username", async (request, response) => {
  const username = request.params.username.toLowerCase();
  let feed;
  try {
    feed = await getFeed(username);
  } catch (error) {
    response.status(400).json({ status: "error", data: error.message });
  }

  if (!feed) {
    feed = "User not found";
    response.status(404);
  } else {
    response.status(200);
  }

  response.json({ status: "ok", data: feed });
});

routes.get("/feeds/all", async (request, response) => {
  let feeds;
  try {
    feeds = await getAllFeeds();
  } catch (error) {
    response.status(400).json({ status: "error", data: error.message });
  }

  response.status(200).json({ status: "ok", data: feeds });
});

routes.get("/instagram-redirect", async (request, response) => {
  const code = request.query.code;
  let feed;
  try {
    feed = await createFeed(code);
  } catch (error) {
    response.status(401);
    response.json({
      status: "error",
      data: { message: error.message },
    });
  }

  response.status(200);
  response.json({
    status: "ok",
    data: feed,
  });
});

routes.get("/authenticate", (request, response) => {
  const params = {
    client_id: process.env.APP_ID,
    scope: "user_profile,user_media",
    response_type: "code",
    redirect_uri: process.env.REDIRECT_URI,
  };

  const url = new URL("https://api.instagram.com/oauth/authorize");

  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );

  response.redirect(url.href);
});

module.exports = { routes };
