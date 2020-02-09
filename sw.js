const staticAssets = [
	'./',
	'./app.js',
	'./dancingMan.mp4'
];

self.addEventListener('install', async event=> {
	const cache = await caches.open('test-static');
	cache.addAll(staticAssets);

})

self.addEventListener('fetch', function(event) {
  
  headersLog = [];
  for (var pair of event.request.headers.entries()) {
    console.log(pair[0]+ ': '+ pair[1]);
    headersLog.push(pair[0]+ ': '+ pair[1])
 }
 console.log('Handling fetch event for', event.request.url, JSON.stringify(headersLog));

  if (event.request.headers.get('range')) {
    console.log('Range request for', event.request.url);
    var rangeHeader=event.request.headers.get('range');
    var rangeMatch =rangeHeader.match(/^bytes\=(\d+)\-(\d+)?/)
    var pos =Number(rangeMatch[1]);
    var pos2=rangeMatch[2];
    if (pos2) { pos2=Number(pos2); }
    
    console.log('Range request for '+ event.request.url,'Range: '+rangeHeader, "Parsed as: "+pos+"-"+pos2);
    event.respondWith(
      caches.open(CURRENT_CACHES.prefetch)
      .then(function(cache) {
        return cache.match(event.request.url);
      }).then(function(res) {
        if (!res) {
          console.log("Not found in cache - doing fetch")
          return fetch(event.request)
          .then(res => {
            console.log("Fetch done - returning response ",res)
            return res.arrayBuffer();
          });
        }
        console.log("FOUND in cache - doing fetch")
        return res.arrayBuffer();
      }).then(function(ab) {
        console.log("Response procssing")
        let responseHeaders=  {
          status: 206,
          statusText: 'Partial Content',
          headers: [
            ['Content-Type', 'video/mp4'],
            ['Content-Range', 'bytes ' + pos + '-' + 
            (pos2||(ab.byteLength - 1)) + '/' + ab.byteLength]]
        };
        
        console.log("Response: ",JSON.stringify(responseHeaders))
        var abSliced={};
        if (pos2>0){
          abSliced=ab.slice(pos,pos2+1);
        }else{
          abSliced=ab.slice(pos);
        }
        
        console.log("Response length: ",abSliced.byteLength)
        return new Response(
          abSliced,responseHeaders
        );
      }));
  } else {
    console.log('Non-range request for', event.request.url);
    event.respondWith(
    // caches.match() will look for a cache entry in all of the caches available to the service worker.
    // It's an alternative to first opening a specific named cache and then matching on that.
    caches.match(event.request).then(function(response) {
      if (response) {
        console.log('Found response in cache:', response);
        return response;
      }
      console.log('No response found in cache. About to fetch from network...');
      // event.request will always have the proper mode set ('cors, 'no-cors', etc.) so we don't
      // have to hardcode 'no-cors' like we do when fetch()ing in the install handler.
      return fetch(event.request).then(function(response) {
        console.log('Response from network is:', response);

        return response;
      }).catch(function(error) {
        // This catch() will handle exceptions thrown from the fetch() operation.
        // Note that a HTTP error response (e.g. 404) will NOT trigger an exception.
        // It will return a normal response object that has the appropriate error code set.
        console.error('Fetching failed:', error);

        throw error;
      });
    })
    );
  }
});

async function cacheFirst(req) {
	const cachedResponse = await caches.match(req);
	return cachedResponse || fetch(req);
}