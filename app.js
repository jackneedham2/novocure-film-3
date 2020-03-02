const main = document.querySelector('main');
var previousTime = 0;
// Vertically align divs
var left_controls = document.getElementById("left-btn-container");
var video_player = document.getElementById("video-player");
var left_controls_height = left_controls.offsetHeight;

var viewCount = 0;
var views = []

function getDateTime() {
        var now     = new Date(); 
        var year    = now.getFullYear();
        var month   = now.getMonth()+1; 
        var day     = now.getDate();
        var hour    = now.getHours();
        var minute  = now.getMinutes();
        var second  = now.getSeconds(); 
        if(month.toString().length == 1) {
             month = '0'+month;
        }
        if(day.toString().length == 1) {
             day = '0'+day;
        }   
        if(hour.toString().length == 1) {
             hour = '0'+hour;
        }
        if(minute.toString().length == 1) {
             minute = '0'+minute;
        }
        if(second.toString().length == 1) {
             second = '0'+second;
        }   
        var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;   
         return dateTime;
    }




setVideoPlayerSize();
window.addEventListener("resize", setVideoPlayerSize);

function setVideoPlayerSize() {
	var v = document.getElementById("video-player");
    var width = this.videoWidth,
        height = this.videoHeight;

		v.style.width = window.innerWidth+"px";
	var aspectRatio = +(window.innerWidth/window.innerHeight);
	if (aspectRatio > 1.33) {
		v.style.height = (window.innerHeight)+"px";
	} else {
		v.style.width = (window.innerWidth)+"px";
	}
}

function playVideo() {
	var video = document.getElementById("video-player")
	video.play();
	$("#play-btn").css("background-image", "url('pause_btn.png')");
	$("#status-bar").html('Playing');
}

function pauseVideo() {
	var video = document.getElementById("video-player")
	video.pause();
	$("#play-btn").css("background-image", "url('play_btn.png')");
	$("#status-bar").html('Paused');
}

document.getElementById("video-container").addEventListener("click", function(event){
	console.log(event.target.id);
	if (event.target.id == "video-player" || event.target.id == "controls-overlay") {
		console.log($("#controls").css("opacity"));

		if ($("#controls").is(":animated")) {
			$("#controls").stop();
		}

		$("#controls").fadeToggle();
	}

});

document.getElementById("play-btn").addEventListener("click", function() {
	console.log("button");
	var video = document.getElementById("video-player")
	if (video.paused) {
		playVideo();
	} else {
		pauseVideo();
	}
	
});


document.getElementById("home-btn").addEventListener("click", function() {
	var video = document.getElementById("video-player");
	video.currentTime = 0;
	pauseVideo();
	$("#status-bar").html('Press play to start');
	previousTime = document.getElementById("video-player").currentTime;
	viewToLocal();

})


document.getElementById("video-player").addEventListener("ended", function() {
	document.getElementById("video-player").currentTime = 0;
})

function skipToTime(t) {
	var video = document.getElementById("video-player");
	video.currentTime = document.getElementById(t).getAttribute("time-code")
	previousTime = document.getElementById("video-player").currentTime;
	current_view.engagements.push(document.getElementById(t).innerHTML);

	gtag('event', 'Menu Click', {
	'event_category': document.getElementById(t).innerHTML,
	'event_label': 'cats'
	});


}

var myTimeout = null;
var resetTimeout = null;

document.onclick = function(){
	console.log("window");
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

}


document.getElementById("video-player").ontimeupdate = function() {
	var t = document.getElementById("video-player").currentTime;
	var diff = t-previousTime
	previousTime = t;
	current_view.durationwatched += diff;


}



function createViewObj(view_id) {
	console.log(getDateTime());
	var view = {id: view_id, datetime: getDateTime(), durationwatched: 0, engagements: []};
	viewCount += 1;
	return view;
}

function viewToLocal() {
	current_view.datetime = getDateTime();
	submitViewToDB(current_view);
	new_view_id = current_view.id + 1;
	current_view = createViewObj(new_view_id);
}


function pushAllViews(allViews) {
	console.log("pushing");
	$("#notify-area").show();
	allViews.forEach(sendToSheets);
	viewCount = 0;
}


 console.log("sending to sheets");
 var url = "https://script.google.com/macros/s/AKfycby8637zBtzeif33RvlT3OdLRgORZnUs1ICgB2E9Kw/exec";
 var xhr = new XMLHttpRequest();

$("#notify-area").hide();

function sendToSheets(data) {

    xhr.onreadystatechange = function()
    {
        if (xhr.readyState == 4 && xhr.status == 200)
        {
            var response = JSON.parse(xhr.responseText);
            console.log(response);
            var responseData = JSON.parse(response.data);

            console.log("Success for key "+responseData.DBKey.toString());
            console.log("All done");
            $("#notify-status").html("<b>Metrics Uploaded.</b>");
        }
    }
    xhr.onerror = function (e) {
    	$("#notify-status").html(e);
    }
    
  xhr.open('POST', url);
  // xhr.withCredentials = true;
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  // url encode form data for sending as post data
  var encoded = Object.keys(data).map(function(k) {
      return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
  }).join('&');
  xhr.send(encoded);
  $("#notify-scrollbox").append(JSON.stringify(data));
  return true;
 
}

function sendMetrics() {
	$("notify-area").show();
	getAndDisplayViews();
}


var current_view = createViewObj(0);