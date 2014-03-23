
var player = null;
var entries = null;
var parameters = {
    'controls': 0,
    'modestbranding': 1,
    'rel': 0,
    'disablekb': 1,
    'fs': 0,
    'showinfo': 0,
	'autoplay': 1
};

function RequestVideoWithID(nodeid,videoid) {
    if(!YT.Player) {
        return false;
    }
    if(player) {
		player.loadVideoById(videoid,0);
    } else {
        var container = document.getElementById(nodeid);
        var width_px = window.document.body.scrollWidth;
        var height_px = window.document.body.scrollHeight;
		player = new YT.Player(container,{
			videoId: videoid,
			width: width_px,
			height: height_px,
			playerVars: parameters,
			events: {
				onReady: onReady,
				onStateChange: onStateChange,
				onPlaybackQualityChange: onPlaybackQualityChange,
				onError: onError
			}
		});
    }
    return true;
}
function PlayVideoFromStart() {
    if(!YT.Player || player==null) return false;
    player.seekTo(0,true);
    player.playVideo();
    return true;
}
function PlayVideo() {
    if(!YT.Player || player==null) return false;
    player.playVideo();
    return true;
}
function PauseVideo() {
    if(!YT.Player || player==null) return false;
    player.pauseVideo();
    return true;
}
function SeekTo(seconds,allowSeekAhead) {
    if(!YT.Player || player==null) return false;
    player.seekTo(seconds,allowSeekAhead);
    return true;
}
function CurrentTime() {
    if(!YT.Player || player==null) return null;
    var currentTime = player.getCurrentTime();
    if(currentTime) {
        return currentTime;
    } else {
        return 0.0;
    }
}
function Duration() {
    if(!YT.Player || player==null) return null;
    var duration = player.getDuration();
    if(duration) {
        return duration;
    } else {
        return null;
    }
}
function CurrentQuality() {
    if(!YT.Player || player==null) return null;
    var quality = player.getPlaybackQuality();
    if(quality) {
        return quality;
    } else {
        return null;
    }
}
function SetQuality(value) {
    if(!YT.Player || player==null) return null;
    player.setPlaybackQuality(value);
    return true;
}
function QualityValues() {
    if(!YT.Player || player==null) return null;
    var values = player.getAvailableQualityLevels();
    if(!values) return null;
    return values.join(",");
}
function SetVolume(value) {
    if(!YT.Player || player==null) return null;
    if(value >= 0 && value <= 100) {
        player.setVolume(value);
        return true;
    } else {
        return false;
    }
}
function GetVolume() {
    if(!YT.Player || player==null) return null;
    return player.getVolume();
}

function onReady(evt) {
	if(console.onReady) {
		console.onReady(evt.data);
	}
}
function onStateChange(evt) {
	if(console.onStateChange) {
		console.onStateChange(evt.data);
	}
}
function onPlaybackQualityChange(evt) {
	if(console.onPlaybackQualityChange) {
		console.onPlaybackQualityChange(evt.data);
	}
}
function onError(evt) {
	if(console.onError) {
		console.onError(evt.data);
	}
}


