const puppeteer = require('puppeteer');
const logger = require('../config/logger');

/**
 *
 * @param {string[]} URLs
 */
const scrapMediaURL = async (URLs) => {
  const browser = await puppeteer.launch();
  const mediaUrls = [];

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
        return [...imgUrls, ...videoUrls];
      });

      mediaUrls.push(...urls);

      await page.close();
    } catch (error) {
      logger.error(`Failed to process URL ${url}:`, error);
    }
  };

  const promiseList = [];

  for (const url of URLs) {
    promiseList.push(processUrl(url));
  }

  await Promise.all(promiseList);
  logger.info('All URLs have been processed');
  logger.info(mediaUrls);

  await browser.close();
};

module.exports = scrapMediaURL;
