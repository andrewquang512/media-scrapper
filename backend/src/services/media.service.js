const puppeteer = require('puppeteer');
const async = require('async');
const logger = require('../config/logger');

const LIMIT_PAGE = 10; // Adjust this based on testing and resources

const scrapMediaURL = async (URLs) => {
  const browser = await puppeteer.launch();
  const mediaUrls = [];

  // Create a queue with a limit to control the concurrency
  const queue = async.queue(async (url, callback) => {
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

      // Push the extracted URLs to the mediaUrls array
      mediaUrls.push(...urls);

      // Close the page after processing
      await page.close();
    } catch (error) {
      logger.error(`Failed to process URL ${url}:`, error);
    } finally {
      callback();
    }
  }, LIMIT_PAGE); // Adjust concurrency limit based on your resource constraints

  // Add URLs to the queue
  URLs.forEach((url) => queue.push(url));

  // Wait for all tasks to be completed
  await queue.drain();

  logger.info('All URLs have been processed');
  logger.info(mediaUrls);

  // Close the browser after processing all URLs
  await browser.close();
};

module.exports = scrapMediaURL;
// const BATCH_SIZE = 100; // Adjust based on testing
//
// async function processInBatches(urls) {
//   for (let i = 0; i < urls.length; i += BATCH_SIZE) {
//     const batch = urls.slice(i, i + BATCH_SIZE);
//     await scrapeUrls(batch);
//     console.log(`Processed batch ${i / BATCH_SIZE + 1}`);
//   }
// }
//
// // Example usage
// processInBatches(urls)
//   .then(() => console.log('All batches processed'))
//   .catch((error) => console.error('Processing failed', error));
//
//   const axios = require('axios');
// const pLimit = require('p-limit');
//
// // Define concurrency limit based on available resources
// const LIMIT = 10; // Adjust this based on testing and resources
//
// const limit = pLimit(LIMIT);
//
// // Function to fetch and process a URL
// async function fetchAndProcessUrl(url) {
//   try {
//     const response = await axios.get(url);
//     // Process the response (e.g., extract media)
//     console.log(`Successfully fetched: ${url}`);
//     // Implement your media extraction logic here
//   } catch (error) {
//     console.error(`Failed to fetch: ${url}`, error.message);
//   }
// }
//
// // Main function to handle scraping
// async function scrapeUrls(urls) {
//   const tasks = urls.map(url => limit(() => fetchAndProcessUrl(url)));
//   await Promise.all(tasks);
// }
//
// // Example usage
// const urls = [/* List of 5000 URLs */];
// scrapeUrls(urls)
//   .then(() => console.log('Scraping completed'))
//   .catch(error => console.error('Scraping failed', error));
