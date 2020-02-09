const main = document.querySelector('main');

// Vertically align divs
var left_controls = document.getElementById("left-btn-container");
var video_player = document.getElementById("video-player");
var left_controls_height = left_controls.offsetHeight;
left_controls.style.top = ((window.innerHeight -left_controls_height)/2) + "px";
console.log(left_controls_height);



// Helper function which returns a promise which resolves once the service worker registration
// is past the "installing" state.
function waitUntilInstalled(registration) {
  return new Promise(function(resolve, reject) {
    if (registration.installing) {
      // If the current registration represents the "installing" service worker, then wait
      // until the installation step (during which the resources are pre-fetched) completes
      // to display the file list.
      registration.installing.addEventListener('statechange', function(e) {
        if (e.target.state === 'installed') {
          resolve();
        } else if (e.target.state === 'redundant') {
          reject();
        }
      });
    } else {
      // Otherwise, if this isn't the "installing" service worker, then installation must have been
      // completed during a previous visit to this page, and the resources are already pre-fetched.
      // So we can show the list of files right away.
      resolve();
    }
  });
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js', {
    scope: './'
  })
    .then(waitUntilInstalled)
    // .then(showFilesList)
    .catch(function(error) {
      // Something went wrong during registration. The service-worker.js file
      // might be unavailable or contain a syntax error.
      console.log(error);
    });
} else {
  // The current browser doesn't support service workers.
  var aElement = document.createElement('a');
  aElement.href =
    'http://www.chromium.org/blink/serviceworker/service-worker-faq';
  aElement.textContent =
    'Service workers are not supported in the current browser.';
  document.querySelector('#status').appendChild(aElement);
}




document.getElementById("video-player").addEventListener("click", function(){
	var controls = document.getElementById("controls")
	console.log(controls.style.visibility);
	if (controls.style.visibility == "visible") {
		controls.style.visibility = "hidden";
	} else {
		controls.style.visibility = "visible";
	}
})

document.getElementById("play-btn").addEventListener("click", function() {
	var video = document.getElementById("video-player")
	video.play()
});

document.getElementById("pause-btn").addEventListener("click", function() {
	var video = document.getElementById("video-player")
	video.pause();
});