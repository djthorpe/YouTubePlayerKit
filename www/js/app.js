
// Initialize the app
var myApp = new Framework7();

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
	li_node.innerHTML = "<a href=\"#" + videoid + "\" onclick=\"LoadVideo(this);\" class=\"item-link item-content\">"
		+ "<div class=\"item-inner\">"
			+ "<div class=\"item-title-row\">"
			+ "<div class=\"item-title\">" + entry.title.$t + "</div>"
        + "</div>"
		+ "<div class=\"item-text\">" + entry.summary.$t + "</div>"
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
	for(var i = 0; i < entries.length; i++) {
		ul_node.appendChild(MediaElement(entries[i]));
	}

	// insert media list
	var mediaList = document.getElementById("media-list");
	if(mediaList) {
		mediaList.innerHTML = null;
		mediaList.appendChild(ul_node);
	}
	
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
}

// when YouTube API has loaded....
window.onYouTubePlayerAPIReady = function() {
	RequestLiveVideoChart();
}
