const main = document.querySelector('main');

// Vertically align divs
var left_controls = document.getElementById("left-btn-container");
var video_player = document.getElementById("video-player");
var left_controls_height = left_controls.offsetHeight;


setVideoPlayerSize();
window.addEventListener("resize", setVideoPlayerSize);

function setVideoPlayerSize() {
	var v = document.getElementById("video-player");
    var width = this.videoWidth,
        height = this.videoHeight;

		v.style.width = window.innerWidth+"px";
	var aspectRatio = +(window.innerWidth/window.innerHeight);
	if (aspectRatio > 1.33) {
		v.style.height = (window.innerHeight-10)+"px";
	} else {
		v.style.width = (window.innerWidth-10)+"px";
	}
}

document.getElementById("video-player").addEventListener("click", function(){
	$("#controls").fadeToggle();
});

document.getElementById("play-btn").addEventListener("click", function() {
	var video = document.getElementById("video-player")
	video.play()
});

document.getElementById("pause-btn").addEventListener("click", function() {
	var video = document.getElementById("video-player")
	video.pause();
});

document.getElementById("video-player").addEventListener("ended", function() {
	document.getElementById("video-player").currentTime = 0;
})

function skipToTime(t) {
	var video = document.getElementById("video-player");
	video.currentTime = document.getElementById(t).getAttribute("time-code")
	video.play();
}

var myTimeout = null;
var resetTimeout = null;

document.onclick = function(){
	clearTimeout(myTimeout);
	clearTimeout(resetTimeout);
	myTimeout = setTimeout(function() {
		var controls = document.getElementById("controls");
		var video = document.getElementById("video-player");
		if (video.currentTime > 0 && !video.paused) {

			console.log(controls.style.visibility);
			$("#controls").fadeOut();
		}
	}, 2000);
	resetTimeout = setTimeout(function() {
		var video = document.getElementById("video-player");
		if (video.paused) {
			video.currentTime = 0;
			video.pause();
			$("#controls").fadeIn();
		}

	}, 30000)
}

