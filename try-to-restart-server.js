/* global path, __dirname */

let counter = 100

function sleep(ms = 500) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let fs = require('fs')
let path = require('path')

let restartServer = function () {
  let content = JSON.stringify({
    date: (new Date()) + ''
  })
  console.log(content)
  console.log('restart server...')
  fs.writeFile(path.resolve(__dirname, 'restart-trigger.json'), content, () => {
    
  })
}

module.exports = async function (isError = true) {
  if (isError) {
    counter--

    if (counter < 0) {
      return restartServer()
    }
  }
  else {
    counter++
    if (counter > 100) {
      counter = 100
    }
  }
}