'use strict';

const puppeteer = require('puppeteer');

/**

Instagram scraping is tricky due to the nature of modern-day JS frameworks.
The server doesn't return rendered HTML anymore. Instead it passes content,
plus the rules of rendering it to the browser and leaves it for the browser.
Because of that simply doing a smiple request doesn't return the desured
result.

So we have to actually render the page first using a browser then pull out
the info
needed from it.

One great way to render web pages is using a controlled APIs set it Puppeteer.

**/

let browser;
let page;

/**
 * Initializes the Puppeteer process
 */
async function init() {
  await console.log('|========= STARTING PUPPETEER PROCESS =========|');
  browser = await puppeteer.launch({headless: true});
  page = await browser.newPage();
}

/**
 * Fetches an Instagram post information including
 * the username of the publisher, the url for the raw image,
 * the post description and the number of likes.
 * @param  {String} postID The identifier of the post, found after /p/
 * in the URL
 * @return {Objecy}        Returns a json object started by `status`, followed
 * by the fetched pieces of information.
 */
async function getImageInfo(postID) {
  let log = await console.log(`|========= FETCHING /p/${postID} INFO =========|`);

  let postURL = `https://www.instagram.com/p/${postID}/`;
  await page.goto(postURL);

  return await page.evaluate(() => {
    let imgElement = document.querySelector('img.FFVAD');
    if (imgElement !== null) {

      let usernameSelector = document.querySelector('a.FPmhX');
      let urlSelector = document.querySelector('img.FFVAD');
      let txtSelector = document.querySelector('.C4VMK span');
      let likesSelector = document.querySelector('.EDfFK span');

      return {
        "status": "OK",
        "USERNAME": (usernameSelector !== null) ? usernameSelector.textContent : null,
        "URL": (urlSelector !== null) ? urlSelector.src : null,
        "TXT": (txtSelector !== null) ? txtSelector.textContent : null,
        "LIKES": (likesSelector !== null) ? likesSelector.textContent : null
      }
    } else {
      return {"status": "ERROR"}
    }
  });
};

/**
 * Terminates the Puppeteer browser process.
 */
async function terminate() {
  await console.log('|========= TERMINATING PUPPETEER PROCESS =========|');
  await browser.close();
  await console.log('|========= PROCESS TERMINATED. GOODBYE. =========|');
}

module.exports.init = init;
module.exports.imageInfo = getImageInfo;
module.exports.terminate = terminate;
