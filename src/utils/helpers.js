const getHashtags = (string) => {
  const regex = /\B\#\w\w+\b/g;
  result = string.match(regex);
  return result ? result : [];
};

const formatPosts = (posts) => {
  return posts.map((post) => {
    if (post.hasOwnProperty("thumbnail_url")) {
      post.media_url = post.thumbnail_url;
      delete post.thumbnail_url;
    }

    post.hashtags = getHashtags(post.caption);
    return post;
  });
};

const getLastUpdatedByField = async (Feed, field) => {
  const rawDates = await Feed.findAll({
    attributes: [field],
  });

  if (rawDates.length === 0) {
    return rawDates;
  }

  const datesSorted = rawDates
    .map((record) => new Date(record.get(field)))
    .sort((a, b) => a - b);
  const lastUpdatedRecord = await Feed.findOne({
    where: { [field]: datesSorted[0] },
  });

  return lastUpdatedRecord.get();
};

const validatePosts = (feed) => {
  const fields = getFields();
  return feed.reduce((currentValue, postObject) => {
    return Object.keys(postObject).every((postField) =>
      fields.includes(postField)
    );
  }, false);
};

const getDateString = () => {
  return new Date().toISOString();
};

const getFields = () => {
  return ["id", "caption", "media_url", "timestamp", "permalink", "username"];
};

module.exports = {
  getHashtags,
  formatPosts,
  getDateString,
  getLastUpdatedByField,
  validatePosts,
  getFields,
};
