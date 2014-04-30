
// Initialize the app
var myApp = new Framework7();
var startupTimer = null;
var intervalTimer = null;
var statsTimer = null;
var API_KEY = "AIzaSyAjcdMmJjfmQD8eUOjpUIlaL6vwVHlLmRs";

// Add view
var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});

// construct media list item
function ListItemNode(videoid,title,summary) {
	var li_node = document.createElement("LI");
	li_node.ontouchstart = function() {
		LoadVideo(this.childNodes[0]);
		return false;
	}
	li_node.onclick = function() {
		LoadVideo(this.childNodes[0]);
		return false;
	}
	li_node.innerHTML = "<a href=\"#" + videoid + "\" class=\"item-link item-content\">"
		+ "<div class=\"item-inner\">"
			+ "<div class=\"item-title-row\">"
			+ "<div class=\"item-title\">" + title + "</div>"
		+ "</div>"
		+ "<div class=\"item-text\">" + summary + "</div>"
		+ "</div></a>";
	return li_node;
}

function MediaElement(entry) {
	var link = document.createElement('a');
	link.href = entry.content.src;
	var videoid = link.pathname.substr(link.pathname.length - 11);
	return ListItemNode(videoid,entry.title.$t,entry.summary.$t);
}
function StaticElement(videoid,title,summary) {
	var li_node = document.createElement("LI");
	li_node.ontouchstart = function() {
		LoadVideo(this.childNodes[0]);
		return false;
	}
	return ListItemNode(videoid,title,summary);
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
	var first_media_element = null;
	//ul_node.appendChild(StaticElement("F6YtcaMKL6U","Wimbledon Test Stream","DVR"));
	//ul_node.appendChild(StaticElement("6HbWU5WGzHE","Wimbledon Test Stream","NO DVR"));
	for(var i = 0; i < entries.length; i++) {
		var this_media_element = MediaElement(entries[i]);
		ul_node.appendChild(this_media_element);
		if(i==0) {
			first_media_element = this_media_element;
		}
	}

	// insert media list
	var mediaList = document.getElementById("media-list");
	if(mediaList) {
		mediaList.innerHTML = null;
		mediaList.appendChild(ul_node);
	}
	
	// load first video
	if(first_media_element) {
		LoadVideo(first_media_element.childNodes[0]);
	}
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



function SetTitle(title) {
	var title_node = document.getElementById('video-title');
	if(title_node) {
		title_node.innerHTML = title;
	}
}

function DrawLiveVideoStatistics(data) {
	var node = document.getElementById('toolbar-stats');
	if(data && data.items && data.items.length) {
		var statistics = data.items[0].liveStreamingDetails;
		if(statistics && statistics.concurrentViewers) {
			node.innerHTML = "<div>" + statistics.concurrentViewers + "&nbsp;watching&nbsp;now</div>";
		}
	} else {
		node.innerHTML = null;
	}
}

function RequestVideoStatistics(videoid) {
	var element = document.createElement('script');
	element.setAttribute('type', 'text/javascript');
	element.setAttribute('src',"https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=" + videoid + "&key=" + API_KEY + "&callback=DrawLiveVideoStatistics&ts=" + new Date().getTime());
	document.body.appendChild(element);
}

function LoadVideo(node) {
	var videoid = node.hash.substr(node.hash.length - 11);
	var title = node.getElementsByClassName('item-title');

	DrawLiveVideoStatistics();
	RequestVideoWithID('youtube-player',videoid);
	
	myApp.closePanel();
	if(title.length) {
		SetTitle(title[0].innerText);
	}
	if(intervalTimer) {
		clearInterval(intervalTimer);
	}
	intervalTimer = setInterval(function() {
		var time_node = document.getElementById('toolbar-time');
		if(time_node) {
			time_node.innerText = TimeToText();
		}
	},1000); // once a second
	
	if(statsTimer) {
		clearInterval(statsTimer);
	}
	statsTimer = setInterval(function() {
		RequestVideoStatistics(videoid);
	},1000 * 60); // once a minute
	RequestVideoStatistics(videoid); // do it now
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
			state = "<span>Playing</span>";
			break;
		case 2:
			state = "<span>Paused</span>";
			break;
		case 3:
			state = "Buffering";
			break;
		default:
			state = "Unknown";
	}
	var toolbarLink = document.getElementById('toolbar-control');
	if(toolbarLink) {
		toolbarLink.innerHTML = state;
	}
}

// when YouTube API has loaded....
window.onYouTubePlayerAPIReady = function() {
	SetTitle("YouTube Live Player");
	startupTimer = setInterval(function() {
		clearInterval(startupTimer);
		RequestLiveVideoChart();
	},1000);
}


