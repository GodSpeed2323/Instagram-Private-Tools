const insta = require('../func.js');
const _ = require('lodash');

const unfollowAllFollowing = async () => {
  try {
    const following = await insta.getFollowing();
    const toUnfollow = _.chunk(following, 20);
    for (let account of toUnfollow) {
      await Promise.all(account.map(async(account) => {
        insta.setTargetId(account.id);
        const resultUnfollow = await insta.doUnfollow() ? 'SUKSES' : 'GAGAL';
        console.log(`[${account.id}] @${account.username} => ${resultUnfollow}`);
      }))
      await doSleep(30000, 'Sleep for 30000 MiliSeconds...');
    }
  } catch (e){
    return Promise.reject(e);
  }  
}

module.exports = unfollowAllFollowing;