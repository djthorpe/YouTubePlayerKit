
// Example code for Baku 2015
// Copyright 2015 Google Inc.
// Author: David Thorpe davidthorpe@google.com

var API_KEY = "AIzaSyAjcdMmJjfmQD8eUOjpUIlaL6vwVHlLmRs";
var API_NAME = "youtube";
var API_VERSION = "v3";

// change these to point to the correct live stream and highlights playlist
var LIVE_ID = "VYlQJbsVs48";
var PLAYLIST_ID = "PLG8IrydigQffEjlHL-JiguwzLUrhgoIdY";

// the application
var BakuApp = {
	// properties
	'timer': null,
	
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

/*
        <li class="item">
            <span>Test Data1</span>
        </li>
*/
		
	},
	'generateItem': function(item) {
		var title = item.snippet.title;
		var thumbnail = item.snippet.thumbnails.high.url;
		var videoId = item.snippet.resourceId.videoId;

		var itemNode = document.createElement("LI");
		itemNode.className = "item";
		itemNode.id = videoId;

		var divParent = document.createElement("DIV");
		divParent.className = "parent";
		divParent.style.backgroundImage = "url('" + thumbnail + "');";
		itemNode.appendChild(divParent);

		var titleNode = document.createElement("DIV");
		titleNode.appendChild(document.createTextNode(title));
		divParent.appendChild(titleNode);
		
/*
		itemNode.appendChild(divParent);

		var imgNode = document.createElement("IMG");
		imgNode.src = thumbnail;
		
 
		divParent.appendChild(imgNode);
		divParent.appendChild(titleNode);
*/
		return itemNode;
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
	}
	
};

// temporary namespace fudge!
var initGAPI = BakuApp.initGAPI;

// bootstrap the onload
window.addEventListener("load",BakuApp.onLoad);
