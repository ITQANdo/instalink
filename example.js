// Small example to test the functionality of the lib.

const instalink = require('./index');



async function fetchImageInfo() {
  await instalink.init();
  let r = await instalink.imageInfo('BnaMvMalVpZ');
  await instalink.terminate();
  return r;
}

fetchImageInfo().then((r) => {
  console.log(r);
});
