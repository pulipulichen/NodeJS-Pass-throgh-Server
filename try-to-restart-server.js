/* global path, __dirname */

let counter = 10

function sleep(ms = 500) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let fs = require('fs')

let restartServer = function () {
  let content = JSON.stringify({
    date: (new Date()).getTime()
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
    if (counter > 10) {
      counter = 10
    }
  }
}