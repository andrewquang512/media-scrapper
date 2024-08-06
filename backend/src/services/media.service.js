const httpStatus = require('http-status');
const Media = require('../models/media.model');
const ApiError = require('../utils/ApiError');

/**
 * Insert Media
 * @param {string[]} imgURLs
 * @param {string[]} vidURLs
 * @param {string} userId
 * @param {string} [secret]
 * @returns {Promise}
 */
const createMedia = async (imgURLs, vidURLs, userId) => {
  const videoMediaList = vidURLs.map((eachURL) => ({
    userId,
    url: eachURL,
    mediaType: 'video',
  }));

  const imageMediaList = imgURLs.map((eachURL) => ({
    userId,
    url: eachURL,
    mediaType: 'image',
  }));

  const batchCreateList = [...videoMediaList, ...imageMediaList];

  const result = await Media.bulkInsert(batchCreateList);
  return result;
};

const searchMedia = async (searchText, searchType, page, limit) => {
  if (searchType && searchType !== 'video' && searchType !== 'image') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'type should be "video" or "image"');
  }

  const result = await Media.findByMediaTypeAndUrl(searchText, searchType, page, limit);
  return result;
};

module.exports = { createMedia, searchMedia };
