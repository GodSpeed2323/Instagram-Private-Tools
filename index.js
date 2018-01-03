'use strict'

const insta = require('./func.js');
const chalk = require('chalk');
const delay = require('delay');
const _ = require('lodash');
const inquirer = require('inquirer');
const Spinner = require('cli-spinner').Spinner;

const questionLogin = [
  {
    type:'input',
    name:'username',
    message:'Insert Username',
    validate: function(value){
      if(!value) return 'Can\'t Empty';
      return true;
    }
  },
  {
    type:'password',
    name:'password',
    message:'Insert Password',
    mask:'*',
    validate: function(value){
      if(!value) return 'Can\'t Empty';
      return true;
    }
  }
]

const questionTools = [
  {
    type:"list",
    name:"Tools",
    message:"Select tools",
    choices:
      [
        "Unfollow not Followback",
        "Unfollow all Following"
      ] 
  }
]

const unfollowNotFollowback = async () => {
  const sleep = 30000
  var spinner;
  spinner = new Spinner('Sleep for '+sleep+' MiliSeconds...');
  spinner.setSpinnerString(9);
  insta.setTargetId();
  try {
    const task = [
      insta.getFollowing(),
      insta.getFollowers()
    ]   
    const [following,followers] = await Promise.all(task);
    var toUnfollow = _.differenceBy(following, followers, 'id');
    toUnfollow = _.chunk(toUnfollow, 20);
    for (let account of toUnfollow) {
      await Promise.all(account.map(async(account) => {
        insta.setTargetId(account.id);
        const resultUnfollow = await insta.doUnfollow() ? 'SUKSES' : 'GAGAL';
        console.log(`[${account.id}] @${account.username} => ${resultUnfollow}`);
      }))
      spinner.start();
      await delay(sleep);
      spinner.stop(false);
      process.stdout.write('\n');
    }
  } catch (e){
    return Promise.reject(e);
  }
}

const unfollowAllFollowing = async () => {
  const sleep = 30000
  var spinner;
  spinner = new Spinner('Sleep for '+sleep+' MiliSeconds...');
  spinner.setSpinnerString(9);
  insta.setTargetId();
  try {
    const following = await insta.getFollowing();
    const toUnfollow = _.chunk(following, 20);
    for (let account of toUnfollow) {
      await Promise.all(account.map(async(account) => {
        insta.setTargetId(account.id);
        const resultUnfollow = await insta.doUnfollow() ? 'SUKSES' : 'GAGAL';
        console.log(`[${account.id}] @${account.username} => ${resultUnfollow}`);
      }))
      spinner.start();
      await delay(sleep);
      spinner.stop(false);
      process.stdout.write('\n');
    }
  } catch (e){
    return Promise.reject(e);
  }  
}

const main = async () => {
  var spinner;
  try{
    const cridential = await inquirer.prompt(questionLogin);  
    spinner = new Spinner('Try to login ...');
    spinner.setSpinnerString(9);
    spinner.start();
    const doLogin = await insta(cridential.username, cridential.password);
    spinner.stop(true);
    console.log(`\n\t Account Data`);
    console.log(`ID\t\t\t: ${doLogin.account.id}\nUSERNAME\t\t: ${doLogin.account.username}\nFULLNAME\t\t: ${doLogin.account.fullName}\n`);
    console.log(`Total Followers\t\t: ${doLogin.account.followerCount}\nTotal Following\t\t: ${doLogin.account.followingCount}\nTotal Media\t\t: ${doLogin.account.mediaCount}\n`);
    var toolChoise = await inquirer.prompt(questionTools);
    toolChoise = toolChoise.Tools;
    switch(toolChoise){
      case "Unfollow not Followback":
        await unfollowNotFollowback()
        break;
      case "Unfollow all Following":
        await unfollowAllFollowing()
        break;
      default:
        exit();
        console.log(3)
    }
  } catch(e) {
    spinner.stop(true);
    console.log(e);
    exit();
  }
}

console.log(chalk`
            ######                           #####        
            ######                           #####        
            ######                           #####        
            ##########                  ##########        
                ######                  ######            
                ######                  ######            
                ######                  ######            
            ######################################        
            ######################################        
            ######################################        
        ##############################################    
        ##########   ####################    #########    
        ##########   ####################    #########    
    ######################################################
    ######################################################
    ######################################################
    ######################################################
    #####   ######################################   #####
    #####   ######################################   #####
    #####   ######################################   #####
    #####   ######                           #####   #####
    #####   ######                           #####   #####
    #####   ######                           #####   #####
    #####   ##################   #################   #####
                ##############   #############            
                ##############   #############            
                ##############   #############
    ------------------------------------------------------
      Instagram Priv8 Tools
      Code Ccocot
      CCOCOT.CO | BC0DE.NET | NAONLAH.NET | WingkoColi
      ccocot@bc0de.net and Thank's To SGB TEAM
    ------------------------------------------------------
`)

main()