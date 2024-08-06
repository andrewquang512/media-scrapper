const catchAsync = require('../utils/catchAsync');
const scrapMediaURL = require('../services/scrapping.service');
const { createMedia, searchMedia } = require('../services/media.service');

const scrapURLs = catchAsync(async (req, res) => {
  const { URLs } = req.body;
  const userId = req.user.id;

  const BATCH_SIZE = 100; // Adjust based on testing
  const result = [];
  for (let i = 0; i < URLs.length; i += BATCH_SIZE) {
    const batch = URLs.slice(i, i + BATCH_SIZE);
    const mediaUrlList = await scrapMediaURL(batch);
    const mediaList = await createMedia(mediaUrlList.imgUrls, mediaUrlList.videoUrls, userId);
    result.push(mediaList);
  }

  res.send({ result });
});

const getUserURLs = catchAsync(async (req, res) => {
  const textSearch = req.query.search;
  const typeMedia = req.query.type;
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  const result = await searchMedia(textSearch, typeMedia, page, limit);
  res.send({ result });
});

module.exports = {
  scrapURLs,
  getUserURLs,
};
