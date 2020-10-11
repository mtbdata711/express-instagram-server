const { validatePosts, getFields } = require("../utils/helpers");
const { InstagramFeed } = require("./InstagramFeed");
let { APIRequest } = require("./APIRequest");
APIRequest = new APIRequest();

/**
 * Fetch latest posts from Instagram API
 *
 * @param string Instagram accounts access token
 * @return object|error returns object containing feed data. Includes nextPage() method to fetch next page if property
 * exists. Throws error on fetch failure.
 */
const getPosts = async (accessToken) => {
  let response;
  const options = {
    fields: getFields().join(","),
    access_token: accessToken,
    limit: Number(process.env.DEFAULT_LIMIT),
  };
  try {
    response = await getInstagramPostsFromAPI(
      "https://graph.instagram.com/me/media",
      options
    );
  } catch (error) {
    throw new Error(error.message);
  }

  return response;
};

/**
 * Get short lived token from Instagram API
 *
 * @param string code from Instagram API redirect post user authentication
 * @return string|error returns short lived access token. Throws error on fetch failure.
 */
const getShortLivedToken = async (code) => {
  let response;
  const options = {
    client_id: process.env.APP_ID,
    client_secret: process.env.APP_SECRET,
    grant_type: "authorization_code",
    redirect_uri: process.env.REDIRECT_URI,
    code: code,
  };

  try {
    response = await APIRequest.post(
      "https://api.instagram.com/oauth/access_token",
      options
    );
  } catch (error) {
    throw new Error(error.message);
  }

  return response.access_token;
};

/**
 * Get long lived access token from Instagram API. Tokens last for 90 days.
 *
 * @param string short lived access token from Instagram API
 * @return string|error returns long lived access token. Throws error on fetch failure.
 */
const getLongLivedToken = async (shortAccessToken) => {
  let response;
  const options = {
    access_token: shortAccessToken,
    client_secret: process.env.APP_SECRET,
    grant_type: "ig_exchange_token",
  };
  try {
    response = await APIRequest.get(
      "https://graph.instagram.com/access_token",
      options
    );
  } catch (error) {
    throw new Error(error.message);
  }

  return response.access_token;
};

/**
 * Refreshes long lived access token from Instagram API. Tokens last for 90 days.
 *
 * @param string a valid long lived access token for an Instagram account
 * @return string|error returns long lived access token. Throws error on fetch failure.
 */
const getRefreshedToken = async (previousToken) => {
  let response;
  const options = {
    access_token: previousToken,
    grant_type: "ig_refresh_token",
  };
  try {
    response = await APIRequest.get(
      "https://graph.instagram.com/refresh_access_token",
      options
    );
  } catch (error) {
    throw new Error(error.message);
  }

  return response.access_token;
};

/**
 * Fetch next page of posts from Instagram API from URL in next paging property from response
 *
 * @param string next page URL from Instagram API response
 * @return object|error returns object containing feed data. Includes nextPage() method to fetch next page if property
 * exists. Throws error on fetch failure.
 */
const getNextPage = async (url) => {
  let response;
  try {
    response = await getInstagramPostsFromAPI(url, {});
  } catch (error) {
    throw new Error(error.message);
  }
  return response;
};

/**
 * Fetch and validate posts from Instagram API. Creates and exposes nextPage() method if property exists in API response.
 *
 * @param string Instagram API endpoint url
 * @param object object of params to append to base url in fetch request
 * @return object|error returns object containing feed data. Includes nextPage() method to fetch next page if property
 * exists. Throws error on fetch failure.
 */
const getInstagramPostsFromAPI = async (url, params) => {
  let response;
  try {
    response = await APIRequest.get(url, params);
  } catch (error) {
    throw new Error(error.message);
  }

  if (!validatePosts(response.data)) {
    throw new Error("Invalid object keys returned from API");
  }

  return new InstagramFeed(response, getNextPage);
};

module.exports = {
  getPosts,
  getShortLivedToken,
  getLongLivedToken,
  getRefreshedToken,
};
