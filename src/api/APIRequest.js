const fetch = require("node-fetch");

class APIRequest{

  async request(url, options ){
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
  }

  async get(url, params){
    url = new URL(url);

    if (Object.keys(params).length > 0) {
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );
    }

    return await this.request(url, {
      method: "GET",
    });
  }

  async post(url, params){
    let options = {
      method: "POST",
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

    return await this.request(url, options);

  }
 
}

module.exports = { APIRequest };
