const route = require('./../mount/route.js')

for (let i = 0; i < route.length; i++) {
  let {uri, backend} = route[i]
  
  if (!uri.startsWith('/')) {
    uri = '/' + uri
  }
  if (!uri.endsWith('/')) {
    uri = uri + '/'
  }
  
  if (!backend.endsWith('/')) {
    backend = backend + '/'
  }
  
  route[i].uri = uri
  route[i].backend = backend
}

module.exports = route