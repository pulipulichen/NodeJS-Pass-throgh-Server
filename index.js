const http = require('http');
const request = require('request');

const PoundSetup = require('./app/PoundSetup.js')
PoundSetup()

const config = require('./mount/config.js')
const route = require('./app/RouteLoader.js')

console.log(route)

const restarter = require('./try-to-restart-server.js')


// ---------

const fs = require('fs')
const path = require('path')

let resolve = fs.readFileSync('/etc/resolv.conf', 'utf-8')
if (resolve.indexOf('nameserver 8.8.8.8') === -1) {
  resolve = resolve + '\nnameserver 8.8.8.8'
  fs.writeFileSync('/etc/resolv.conf', resolve, 'utf-8')
}

// ---------

http.createServer(function (req, res) {
  //console.log(req.url)
  try {
    for (let i = 0; i < route.length; i++) {
      let {uri, backend} = route[i]

      if (req.url.startsWith(uri)) {
        let requestURI = req.url.slice(uri.length)

        let requestURL = backend + requestURI
        //console.log('requestURL', requestURL)
        req.pipe(request(requestURL).on('error', (e) => {
            restarter(true)
            console.error(e);
          }), (error, response, body) => {
          if (error.code === 'ECONNREFUSED'){
            restarter(true)
            console.error('Refused connection');
          } else { 
            //throw error; 
            restarter(true)
            console.error(error)
          }
        }).pipe(res)
        
        //res.end('')
        restarter(false)
        return true
      }
    }

    if (config.enablePound) {

      let uri = req.url.slice(1)
      let baseOrigin = 'http://127.0.0.1:8080/';
      let requestURL = baseOrigin + uri
      //console.log(requestURL)
      req.pipe(request(requestURL).on('error', function(e) {
        console.error(e);
      }), function(error, response, body){
    if (error.code === 'ECONNREFUSED'){
      restarter(true)
      res.end('Refused connection');
    } else { 
      //throw error; 
      restarter(true)
      res.end(error)
    }
    
    //res.end('')
  }).pipe(res)
    }
    else {
      // https://stackoverflow.com/questions/11355366/how-to-redirect-users-browser-url-to-a-different-page-in-nodejs
      //res.writeHead(301,
      //  {Location: 'https://blog.pulipuli.info/'}
      //);
      restarter(true)
      res.end('');
    }
  }
  catch (e) {
    restarter(true)
    res.end(e)
  }
  
  req.on('error', function(e) {
    restarter(true)
    res.end(e);
  });
}).listen(80);

console.log('http://localhost:80/')

