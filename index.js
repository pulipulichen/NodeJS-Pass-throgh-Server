const http = require('http');
const request = require('request');

const PoundSetup = require('./app/PoundSetup.js')
PoundSetup()

const config = require('./mount/config.js')
const route = require('./app/RouteLoader.js')

http.createServer(function (req, res) {
  
  try {
    for (let i = 0; i < route.length; i++) {
      let {uri, backend} = route[i]

      if (req.url.startsWith(uri)) {
        let requestURI = req.url.slice(uri.length)

        let requestURL = backend + requestURI
        //console.log(requestURL)
        req.pipe(request(requestURL).on('error', function(e) {
            console.error(e);
          }), function(error, response, body){
          if (error.code === 'ECONNREFUSED'){
            console.error('Refused connection');
          } else { 
            //throw error; 
            console.error(error)
          }
        }).pipe(res)
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
      console.error('Refused connection');
    } else { 
      //throw error; 
      console.error(error)
    }
  }).pipe(res)
    }
    else {
      // https://stackoverflow.com/questions/11355366/how-to-redirect-users-browser-url-to-a-different-page-in-nodejs
      //res.writeHead(301,
      //  {Location: 'https://blog.pulipuli.info/'}
      //);
      res.end('');
    }
  }
  catch (e) {
    console.error(e)
  }
  
  req.on('error', function(e) {
    console.error(e);
  });
}).listen(80);

console.log('http://localhost:80/')
