const http = require('http');
const request = require('request');

const PoundSetup = require('./app/PoundSetup.js')
PoundSetup()

const config = require('./mount/config.js')
const route = require('./app/RouteLoader.js')

http.createServer(function (req, res) {
  for (let i = 0; i < route.length; i++) {
    let {uri, backend} = route[i]
    
    if (req.url.startsWith(uri)) {
        let requestURI = req.url.slice(uri.length)
        
      let requestURL = backend + requestURI
      //console.log(requestURL)
      req.pipe(request(requestURL)).pipe(res)
      return true
    }
  }
  
  if (config.enablePound) {
    
    let uri = req.url.slice(1)
    let baseOrigin = 'http://127.0.0.1:8080/';
    let requestURL = baseOrigin + uri
    //console.log(requestURL)
    req.pipe(request(requestURL)).pipe(res)
  }
}).listen(8081);

console.log('http://localhost:8081/')