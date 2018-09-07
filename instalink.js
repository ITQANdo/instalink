'use strict';

const puppeteer = require('puppeteer');

/**

Instagram scraping is tricky due to the nature of modern-day JS frameworks.
The server doesn't return rendered HTML anymore. Instead it passes content,
plus the rules of rendering it to the browser and leaves it for the browser.
Because of that simply doing a smiple request doesn't return the desured result.

So we have to actually render the page first using a browser then pull out the info
needed from it.

One great way to render web pages using a controlled APIs set it Puppeteer.


CSS Selector
img.FFVAD

U-A: Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4

Instagram Post URL example: https://www.instagram.com/p/BnN7whpBHwC/

**/

async function getImageURL(postURL) {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.goto(postURL);

  const imgURL = await page.evaluate(() => {
    return document.querySelector('img.FFVAD').src;
  });

  await browser.close();
  return imgURL;
};

module.exports.getURL = getImageURL;
