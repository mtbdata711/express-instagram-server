const fetch = require("node-fetch");

const APIRequest = async (method, url, params) => {
  let options = {};
  if ("GET" === method) {
    url = new URL(url);
    if (Object.keys(params).length > 0) {
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );
    }
    options = {
      method,
    };
  }

  if ("POST" === method) {
    options = {
      method,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: Object.keys(params)
        .map((key) => {
          return (
            encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
          );
        })
        .join("&"),
    };
  }

  let response;
  try {
    response = await fetch(url, options);
    response = await response.json();
  } catch (error) {
    throw new Error(error.message);
  }

  if (response.hasOwnProperty("error")) {
    throw new Error(response.error.message);
  }

  return response;
};

module.exports = { APIRequest };
