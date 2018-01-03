const insta = require('../func.js');
const _ = require('lodash');

const deleteAllMedia = async () => {
  try {
    insta.setTargetId();
    var media = await insta.getMedia();
    media = _.chunk(media, 8);
    for (media of media) {
      await Promise.all(media.map (async(media) => {
        const result = await insta.deleteMedia(media.id);
        console.log(`[${media.id}] ${media.webLink} => ${result ? 'SUKSES' : 'GAGAL'}`)
      }));
      await doSleep(30000, 'Sleep for 30000 MiliSeconds...');
    }
  } catch (e) {
    return Promise.reject(e);
  }
}

module.exports = deleteAllMedia;