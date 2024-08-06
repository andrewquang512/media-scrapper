const puppeteer = require('puppeteer');
const logger = require('../config/logger');

/**
 * Scrap Image URL and Video URL from website
 * @param {string[]} URLs
 * @returns {Promise<{imgUrls: string[], videoUrls: string[]}>}
 */
const scrapMediaURL = async (URLs) => {
  const browser = await puppeteer.launch();
  const mediaUrls = { imgUrls: [], videoUrls: [] };

  const processUrl = async (url) => {
    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });

      // Extract media URLs from the page
      const urls = await page.evaluate(() => {
        const imgUrls = Array.from(document.querySelectorAll('img'))
          .map((img) => img.src)
          .filter((src) => src);
        const videoUrls = Array.from(document.querySelectorAll('video'))
          .map((video) => video.src)
          .filter((src) => src);

        return { imgUrls, videoUrls };
      });

      mediaUrls.imgUrls.push(...urls.imgUrls);
      mediaUrls.videoUrls.push(...urls.videoUrls);

      await page.close();
    } catch (error) {
      logger.error(`Failed to process URL ${url}:`, error);
      throw error;
    }
  };

  const promiseList = [];

  for (const url of URLs) {
    promiseList.push(processUrl(url));
  }

  await Promise.all(promiseList);
  logger.info('All URLs have been processed');
  logger.info(JSON.stringify(mediaUrls));

  await browser.close();
  return mediaUrls;
};

module.exports = scrapMediaURL;
