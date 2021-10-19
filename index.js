const http = require('http');
const request = require('request');

http.createServer(function (req, res) {
    if (req.url.startsWith('/303/')) {
        // http://pulipuli.myqnapcloud.com:30380/
        // proxy random image from picsum website
        let uri = req.url.slice(5)
        
        let baseOrigin = 'http://pulipuli.myqnapcloud.com:30380/';
        let requestURL = baseOrigin + uri
        console.log(requestURL)
        req.pipe(request(requestURL)).pipe(res);
    } 
    else if (req.url.startsWith('/t/')) {
        // http://pulipuli.myqnapcloud.com:30380/
        // proxy random image from picsum website
        let uri = req.url.slice(3)
        
        let baseOrigin = 'http://127.0.0.1:3000/';
        let requestURL = baseOrigin + uri
        console.log(requestURL)
        req.pipe(request(requestURL)).pipe(res);
    }
    else {
        // default page with image tag that renders random image
        res.setHeader('Content-type', 'text/html');
        res.write(`<img src="/random-image/${Math.random()}" />`);
        res.end();
    }
}).listen(8080);