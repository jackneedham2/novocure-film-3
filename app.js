const main = document.querySelector('main');

// Vertically align divs
var left_controls = document.getElementById("left-btn-container");
var video_player = document.getElementById("video-player");
var left_controls_height = left_controls.offsetHeight;
left_controls.style.top = ((window.innerHeight -left_controls_height)/2) + "px";
console.log(left_controls_height);



window.addEventListener('load', async e => {
	if('serviceWorker' in navigator) {
		try {
			navigator.serviceWorker.register('sw.js');
			console.log("SW Register");
		} catch(error) {
			console.log("Reg failed")
		}
	}

});

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
