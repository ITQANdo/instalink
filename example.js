// Small example to test the functionality of the lib.

const instalink = require('./index');

async function fetchImageInfo() {
  await instalink.init();

  // Test a video
  let vidPost = await instalink.imageInfo('BnJaYiEBft7');
  await console.log(vidPost);

  // Test an Image
  let imgPost = await instalink.imageInfo('Bnccm9bBJtZ');
  await console.log(imgPost);

  // Test a multi-image
  let mImgPost = await instalink.imageInfo('Bnm01q_nZpL');
  await console.log(mImgPost);

  await instalink.terminate();

}

fetchImageInfo();
