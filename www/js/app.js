
// Initialize the app
var myApp = new Framework7();
var startupTimer = null;
var intervalTimer = null;

// Add view
var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});

// construct media list item
function MediaElement(entry) {

	var link = document.createElement('a');
	link.href = entry.content.src;
	var videoid = link.pathname.substr(link.pathname.length - 11);

	var li_node = document.createElement("LI");
	li_node.ontouchstart = function() {
		LoadVideo(this.childNodes[0]);
		return false;
	}
	li_node.innerHTML = "<a href=\"#" + videoid + "\" onclick=\"console.log(this); LoadVideo(this); return false;\" class=\"item-link item-content\">"
		+ "<div class=\"item-inner\">"
			+ "<div class=\"item-title-row\">"
			+ "<div class=\"item-title\">" + entry.title.$t + "</div>"
		+ "</div>"
		+ "<div class=\"item-text\">" + entry.summary.$t + "</div>"
		+ "</div></a>"
	return li_node;
}

// construct media list item (static)
function StaticElement(title,videoid) {
	var li_node = document.createElement("LI");
	li_node.innerHTML = "<a href=\"#" + videoid + "\" onclick=\"LoadVideo(this);\" class=\"item-link item-content\">"
		+ "<div class=\"item-inner\">"
			+ "<div class=\"item-title-row\">"
			+ "<div class=\"item-title\">" + title + "</div>"
        + "</div>"
		+ "</div></a></li>"
	return li_node;
}

// request live videos....
function RequestLiveVideoChart() {
	var element = document.createElement('script');
	element.setAttribute('type', 'text/javascript');
	element.setAttribute('src',"https://gdata.youtube.com/feeds/api/charts/live/events/live_now?v=2&alt=json-in-script&format=5&callback=DrawLiveVideoChart");
	document.body.appendChild(element);
}

function DrawLiveVideoChart(data) {
	var feed = data.feed;
	entries = feed.entry || [];

	// create the media list
	var ul_node = document.createElement("UL");
	var media_element = ul_node.appendChild(StaticElement("Wimbledon Test Stream (DVR)","F6YtcaMKL6U"));
	ul_node.appendChild(StaticElement("Wimbledon Test Stream (NO DVR)","6HbWU5WGzHE"));
	for(var i = 0; i < entries.length; i++) {
		ul_node.appendChild(MediaElement(entries[i]));
	}

	// insert media list
	var mediaList = document.getElementById("media-list");
	if(mediaList) {
		mediaList.innerHTML = null;
		mediaList.appendChild(ul_node);
	}

	// load first video
	LoadVideo(media_element.childNodes[0]);
}

function pad(width, string, padding) { 
  return (string.length >= width) ? string : pad(width, padding + string, padding)
}

function TimeToText() {
	var value = CurrentTime();
	if(value < 0) {
		return "";
	}
	var secs = parseInt(value % 60);
	value = (value - secs) / 60;
	var mins = parseInt(value % 60);
	value = (value - mins) / 60;
	var hours = parseInt(value);
	
	return "" + pad(2,"" + hours,"0") + ":" + pad(2,"" + mins,"0") + ":" + pad(2,"" + secs,"0");
}

function LoadVideo(node) {
	var videoid = node.hash.substr(node.hash.length - 11);
	var title = node.innerText;
	
	RequestVideoWithID('youtube-player',videoid);
	myApp.closePanel();
	var title_node = document.getElementById('video-title');
	if(title_node) {
		title_node.innerHTML = title;
	}
	if(intervalTimer) {
		clearInterval(intervalTimer);
	}
	intervalTimer = setInterval(function() {
		var time_node = document.getElementById('toolbar-time');
		if(time_node) {
			time_node.innerText = TimeToText();
		}
	},1000);
}

// player state change
window.onStateChange = function(data) {
	var state = data.data;
	switch(state) {
		case -1:
		case 0:
		case 5:
			state = "Stopped";
			break;
		case 1:
			state = "Playing";
			break;
		case 2:
			state = "Paused";
			break;
		case 3:
			state = "Buffering";
			break;
		default:
			state = "Unknown";
	}
	var toolbarLink = document.getElementById('toolbar-control');
	if(toolbarLink) {
		toolbarLink.innerText = state;
	}
}

// when YouTube API has loaded....
window.onYouTubePlayerAPIReady = function() {
	startupTimer = setInterval(function() {
		clearInterval(startupTimer);
		RequestLiveVideoChart();
	},1000);
}


