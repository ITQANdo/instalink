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
  browser = await puppeteer.launch({headless: false});
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

  const timeout = 30000;
  const networkIdleTimeout = 500;
  await Promise.all([
    page.goto(postURL),
    page.waitForNavigation({timeout, waitUntil: 'load'})
  ]);

  // Those two clicks are essential workarounds for loading
  // the rest of the react content.
  // scraping React and other SPA framework pages is always a
  // pain in the butt.

  try {
    await page.click('.Ls00D')
  } catch(err) {
    console.log(err);
  }

  await page.click('.EDfFK span');

  return await page.evaluate(() => {
    // DIV that contains of the post's elements.
    let postPageChecker = document.getElementsByClassName('QBXjJ');

    let resStatus = null;
    let resMessage = null;
    let resType = null;
    let resUsername = null;
    let resUrls = [];
    let resDescription = null;
    let resLikes = null;
    let resVideoLikes = null
    let resVideoViews = null;

    // Query the div containing a single post's elements
    // If there's more than 0 of this div (which is usually 0 or 1)
    // then we landed on a post page
    if (postPageChecker.length > 0) {

      let usernameSelector = document.querySelector('a.FPmhX');
      let descriptionSelector = document.querySelector('.C4VMK > span');
      let likesSelector = document.querySelector('.EDfFK span span');
      let videoLikesSelector = document.querySelector('.vJRqr > span');
      let viewsSelector = document.querySelector('.EDfFK span span');

      resUsername = (usernameSelector !== null)
        ? usernameSelector.textContent
        : null;
      resDescription = (descriptionSelector !== null)
        ? descriptionSelector.textContent
        : null;
      resLikes = (likesSelector !== null)
        ? likesSelector.textContent
        : null;
      resVideoLikes = (videoLikesSelector !== null)
        ? videoLikesSelector.textContent
        : null;
      resVideoViews = (viewsSelector !== null)
        ? viewsSelector.textContent
        : null;

      // Image and Video DOM selectors.
      let imgElement = document.querySelectorAll('img.FFVAD');
      let vidElement = document.querySelectorAll('video');

      // Next is to check whether it's an image, a multi image or a video
      // using the selectors above.
      if (imgElement.length > 0) {
        // We have either an image or a multi-image
        if (imgElement.length === 1) {
          // We have a single image
          resUrls.push(imgElement[0].src);
          resType = "image";
        } else if (imgElement.length > 1) {
          // We have a multi image
          for (var i = 0; i < imgElement.length; i++) {
            resUrls.push(imgElement[i].src);
          }
          resType = "multi-image";
        }
        resStatus = "OK";
        resMessage = "All seems good.";

      } else if (vidElement.length > 0) {
        // We have a video
        resType = "video";
        resUrls.push(vidElement[0].src);
        resStatus = "OK";
        resMessage = "All seems good.";
      } else {
        resStatus = "ERROR";
        resMessage = "Unknown Error. Missing page elements? Instagram changed their DOM names?";
      }
    } else {
      resStatus = "ERROR";
      resMessage = "This destination doesn't seem to contain an instagram post."
    }

    return {
      "STATUS": resStatus,
      "MESSAGE": resMessage,
      "TYPE": resType,
      "USERNAME": resUsername,
      "URL": resUrls,
      "DESCRIPTION": resDescription,
      "IMAGE_LIKES": (resType === "video")
        ? null
        : resLikes,
      "VIDEO_LIKES": (resType === "video")
        ? resVideoLikes
        : null,
      "VIDEO_VIEWS": (resType === "video")
        ? resVideoViews
        : null
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
  await console.log('|========= ============================ =========|');
}

module.exports.init = init;
module.exports.imageInfo = getImageInfo;
module.exports.terminate = terminate;
