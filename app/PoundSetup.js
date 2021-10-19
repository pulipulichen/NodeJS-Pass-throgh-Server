
/* global __dirname */

const config = require('./../mount/config.js')
const fs = require('fs')
const path = require('path')

const PoundSetup = async function () {
  if (!config.enablePound) {
    return false
  }
  
  let fromPath = path.resolve(__dirname, './../mount/pound.cfg')
  let toPath = '/etc/pound/pound.cfg'
  
  fs.copyFile(fromPath, toPath, (err) => {
    if (err) throw err;
    
    RestartPound()
  });
}

const { exec } = require("child_process")
const RestartPound = function () {
  exec("/etc/init.d/pound restart", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

module.exports = PoundSetup