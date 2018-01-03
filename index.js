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
        "Unfollow all Following",
        "Delete all Media"
      ] 
  }
]

const main = async () => {
  var spinner;
  try{
    const cridential = await inquirer.prompt(questionLogin);  
    spinner = new Spinner('Try to login ...');
    spinner.setSpinnerString(4);
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
        const unfollowNotFollowback = require('./Tools/unfollownotfollowback.js');
        await unfollowNotFollowback()
        break;
      case "Unfollow all Following":
        const unfollowAllFollowing = require('./Tools/unfollowallfollowing.js');
        await unfollowAllFollowing()
        break;
      case "Delete all Media":
        const deleteAllMedia = require('./Tools/deleteallMedia.js');
        await deleteAllMedia()
        break;
      default:
        exit();
        console.log(3)
    }
  } catch(e) {
    spinner.stop(true);
    console.log(e);
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
