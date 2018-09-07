const instalink = require('./instalink');

instalink.getURL('https://www.instagram.com/p/BnOefCyhYrr/?taken-by=itqando').then((r) => {
  console.log(r);
});
