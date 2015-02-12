
// Example code for Baku 2015
// Copyright 2015 Google Inc.
// Author: David Thorpe davidthorpe@google.com

var API_KEY = "AIzaSyAjcdMmJjfmQD8eUOjpUIlaL6vwVHlLmRs";
var API_NAME = "youtube";
var API_VERSION = "v3";

// change these to point to the correct live stream and highlights playlist
var LIVE_ID = "VYlQJbsVs48";
var PLAYLIST_ID = "UUoMdktPbSTixAyNGwb-UYkQ"; // uploads
//var PLAYLIST_ID = "PLG8IrydigQffEjlHL-JiguwzLUrhgoIdY";

// youtube player
var YouTubePlayer = {
	// properties
	'container': null,
	'player': null,
	'callback': null,
	'parameters': {
		'controls': 0,
		'modestbranding': 1,
		'rel': 0,
		'disablekb': 1,
		'fs': 0,
		'showinfo': 0,
		'autoplay': 1
	},
	// public functions
	'onLoad': function(nodeId) {
		console.log("YouTubePlayer.onLoad");
		
		YouTubePlayer.container = document.getElementById(nodeId);
		if(YouTubePlayer.container) {
			// incude the YouTube Player
			var element = document.createElement('script');
			element.setAttribute('type','text/javascript');
			element.setAttribute('src',"https://www.youtube.com/player_api");
			document.body.appendChild(element);
		}
	},
	'loadVideo': function(videoId) {
		console.log("YouTubePlayer.loadVideo(" + videoId + ")");
		if(!YT.Player) {
			return false;
		}
		if(YouTubePlayer.player) {
			YouTubePlayer.player.loadVideoById(videoId,0);
		} else {
			YouTubePlayer.container.innerHTML = null;
			var width_px = YouTubePlayer.container.scrollWidth;
			var height_px = width_px * 9 / 16;
			YouTubePlayer.player = new YT.Player(YouTubePlayer.container,{
				videoId: videoId,
				width: width_px,
				height: height_px,
				playerVars: YouTubePlayer.parameters,
				events: {
					onReady: YouTubePlayer.onReady,
					onStateChange: YouTubePlayer.onStateChange,
					onPlaybackQualityChange: YouTubePlayer.onPlaybackQualityChange,
					onError: YouTubePlayer.onError
				}
			});
		}
		return true;
	},
	'onReady': function() {
		console.log("YouTubePlayer.onReady");
	},
	'onStateChange': function(evt) {
		console.log("YouTubePlayer.onStateChange(" + evt.data + ")");
		if(YouTubePlayer.callback && YouTubePlayer.callback.onStateChange) {
			YouTubePlayer.callback.onStateChange(evt.data);
		}
	},
	'onPlaybackQualityChange': function(evt) {
		console.log("YouTubePlayer.onPlaybackQualityChange(" + evt.data + ")");
	},
	'onError': function(evt) {
		console.log("YouTubePlayer.onError(" + evt.data + ")");
	},
	'getVideoId': function() {
		if(YouTubePlayer.player) {
			var url = YouTubePlayer.player.getVideoUrl();
			if(url) {
				return url.substr(url.length - 11);
			}
		}
		return null;
	}
};

// the application
var BakuApp = {
	// properties
	'timer': null,
	'pausetimer': null,
	
	// public functions
	'onLoad': function () {
		console.log("BakuApp.onLoad");
		// include the Google API
		var element = document.createElement('script');
		element.setAttribute('type','text/javascript');
		element.setAttribute('src',"https://apis.google.com/js/client.js?onload=initGAPI");
		document.body.appendChild(element);
	},
	'initGAPI': function() {
		console.log("BakuApp.initGAPI");
		gapi.client.setApiKey(API_KEY);
		gapi.client.load(API_NAME, API_VERSION,BakuApp.loadedGAPI);
	},
	'loadedGAPI': function() {
		console.log("BakuApp.loadedGAPI");
		// load the playlist every 30 seconds
		BakuApp.startTimer(30 * 1000,BakuApp.loadPlaylist.bind(this,PLAYLIST_ID),true);
	},
	'stopTimer': function() {
		if(BakuApp.timer) {
			clearInterval(BakuApp.timer);
		}
		BakuApp.timer = null;
	},
	'startTimer': function(interval,callback,callnow) {
		BakuApp.stopTimer();
		setInterval(callback,interval);
		if(callnow) {
			callback(); // call immediately
		}
	},
	'loadPlaylist': function(playlistID) {
		console.log("BakuApp.loadPlaylist");
		var request = gapi.client.youtube.playlistItems.list({
			playlistId: playlistID,
			part: 'snippet',
			maxResults: 50
		});
		request.execute(BakuApp.displayPlaylist);
	},
	'displayPlaylist': function(response) {
		console.log("BakuApp.displayPlaylist");
		var node = document.getElementById("items");
		for(var item in response.items) {
			BakuApp.appendPlaylistItem(response.items[item],node);
		}
	},
	'generateItem': function(item) {
		var title = item.snippet.title;
		var thumbnail = item.snippet.thumbnails.high.url;
		var videoId = item.snippet.resourceId.videoId;

		var itemNode = document.createElement("LI");
		itemNode.className = "item";
		itemNode.id = videoId;

		var divParent = document.createElement("DIV");
		var gradientString = "linear-gradient(rgba(1,1,1,0.5),rgba(1,1,1,0.5))";
		var urlString = "url(" + thumbnail + ")";
		divParent.className = "parent";
		divParent.style.backgroundImage = gradientString + "," + urlString;
		itemNode.appendChild(divParent);

		var textNode = document.createElement("H1");
		textNode.appendChild(document.createTextNode(title));
		divParent.appendChild(textNode);
		
		// add onClick event for textNode
		textNode.addEventListener('click',BakuApp.onClick.bind(this,videoId));

		return itemNode;
	},
	'onClick': function(videoId) {
		console.log("BakuApp.onClick(" + videoId + ")");
		var itemNode = document.getElementById(videoId);
		if(itemNode) {
			YouTubePlayer.loadVideo(videoId);
		}
	},
	'appendPlaylistItem': function(item,parentNode) {
		var videoId = item.snippet.resourceId.videoId;
		var itemNode = document.getElementById(videoId);
		if(itemNode) {
			// already has item in place, ignore
		} else {
			itemNode = BakuApp.generateItem(item);
			if(itemNode) {
				if(parentNode.firstChild) {
					parentNode.insertBefore(itemNode,parentNode.firstChild);
				} else {
					parentNode.appendChild(itemNode);
				}
			}
		}
	},
	'initYouTubePlayer': function() {
		console.log("BakuApp.initYouTubePlayer");
		YouTubePlayer.callback = BakuApp;
		YouTubePlayer.loadVideo(LIVE_ID);
	},
	'onStateChange': function(state) {
		if(BakuApp.pausetimer) {
			clearInterval(BakuApp.pausetimer);
			BakuApp.pausetimer = null;
		}
		switch(state) {
		case 0:
		case 5:
			// stopped - load the live video
			if(YouTubePlayer.getVideoId() != LIVE_ID) {
				YouTubePlayer.loadVideo(LIVE_ID);
			}
			break;
		case 1:
			// playing
			break;
		case 2:
			// paused - set up timer so that if no state changes in two seconds, the live video
			// is reloaded
			if(YouTubePlayer.getVideoId() != LIVE_ID) {
				BakuApp.pausetimer = setTimeout(YouTubePlayer.loadVideo.bind(this,LIVE_ID),5 * 1000);
			}
			break;
		case 3:
			// buffering
			break;
		case -1:
		default:
			// other
		}
		BakuApp.displayStatus();
	},
	'displayStatus': function() {
		var statusNode = document.getElementById('ytstatus');
		if(YouTubePlayer.getVideoId() == LIVE_ID) {
			statusNode.innerHTML = "<span class=\"live\">PLAYING LIVE VIDEO</span>";
		} else {
			statusNode.innerHTML = "<span>PLAYING HIGHLIGHTS</span> &nbsp; Pause or stop to return to live";
		}
	}
};

// temporary namespace fudge!
var initGAPI = BakuApp.initGAPI;

// temporary namespace fudge!
window.onYouTubePlayerAPIReady = BakuApp.initYouTubePlayer;

// bootstrap the onload events
window.addEventListener("load",BakuApp.onLoad);
window.addEventListener("load",YouTubePlayer.onLoad.bind(this,'ytplayer'));


