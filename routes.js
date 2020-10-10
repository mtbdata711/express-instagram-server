const routes = require("express").Router();
const { createFeed } = require("./src/common/CRUD");
const { Feed } = require("./src/models");

routes.get("/feed/:username", async (request, response) => {
  const username = request.params.username;
  let feed;
  try {
    feed = await Feed.findOne({
      where: { username: username },
      attributes: {
        exclude: ["access_token"],
      },
    });
  } catch (error) {
    response.status(400).json({ status: "error", data: error.message });
  }

  if (!feed) {
    feed = { status: "error", data: "User not found" };
    response.status(404);
  } else {
    response.status(200);
  }

  response.json({ status: "ok", data: feed });
});

routes.get("/feeds/all", async (request, response) => {
  let feeds;
  try {
    feeds = await Feed.findAll({
      attributes: {
        exclude: ["access_token"],
      },
    });
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
