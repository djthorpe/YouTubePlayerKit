
// this is the list of playlists that are sources for the videos
// they should be listed in reverse order of priority, so that
// the latest list of videos is at the top. There should also be a
// "default" playlist at the bottom, which should be populated with at least
// one video. Using the M&S Latest Picks for the moment
var PLAYLISTS = [
	"PL8gdXyoFVn9eFIB1IoYJ-IrOqSjf_q3rz:Day 2",        // London Fashion Show Day 2 Playlist
	"PL8gdXyoFVn9ealtiiWrurGIKYEatZGdF_:Day 1",        // London Fashion Show Day 1 Playlist
	"PL_yW5gr0lcwViAI1E4gXROvCHdJjpNeR2:Latest Picks", // Marks and Spencers Latest Picks
	"PL_yW5gr0lcwVfPkzuOrzdXa5heUcTIbLa:Women's Fashion", // Marks and Spencers Women's Fashion
];

// will store the list of videos for each playlist
var VIDEOS = { };

var TAB_CLASS_SELECTED = "btn btn-danger";
var TAB_CLASS_UNSELECTED = "btn btn-default";

// change this API key for one of your own
var GOOGLE_API_KEY = "AIzaSyDlVQlburkZAFxwHKVRoq3xtexYjAsIm4M";

// Retrieve the list of videos in the specified playlist.
function requestVideoPlaylist(playlist_id,playlist_title,callback,page_token) {
	var request = {
		playlistId: playlist_id,
		part: 'snippet',
		maxResults: 50
	};
	if(page_token) {
		request.pageToken = page_token;
	}
	var request = gapi.client.youtube.playlistItems.list(request);
	var response = 0;
	request.execute(function(response) {
		callback(response.result,playlist_id,playlist_title);
	});
}

// Add a tab to the group items
function addTab(tab_group_id,tab_id,tab_name) {
	var tab_group = document.getElementById(tab_group_id);
	var tab_node = document.getElementById(tab_id);
	if(!tab_node) {
		tab_node = document.createElement("button");
		tab_node.setAttribute('type','button');
		tab_node.className = TAB_CLASS_UNSELECTED;
		tab_node.id = tab_id;
		tab_node.addEventListener('click',function() {
			onClickTab(tab_id);
		});
		tab_group.appendChild(tab_node);
	}
	tab_node.innerText = tab_name;
}

// Set the selected tab
function setSelectedTab(tab_id) {
	var tab_node = document.getElementById(tab_id);
	var tab_group = tab_node.parentNode;
	for(var i = 0; i < tab_group.children.length; i++) {
		tab_group.children[i].className = (tab_group.children[i].id==tab_id) ? TAB_CLASS_SELECTED : TAB_CLASS_UNSELECTED;
	}
}

// Load a particular video into the player
function loadVideo(video) {
	var video_id = video.snippet.resourceId.videoId;
	var iframe_node = document.getElementById('video-iframe');
	var title_node = document.getElementById('video-title');
	var description_node = document.getElementById('video-description');
	iframe_node.src = "//www.youtube.com/embed/" + video_id + "?rel=0";
	title_node.innerText = video.snippet.title;
	description_node.innerText = video.snippet.description;
}

// Load first video from a selection
function loadFirstVideoFromSelection(tab_id) {
	var videos = VIDEOS[tab_id];
	if(videos && videos.length) {
		loadVideo(videos[0]);
	}
}

// Callback when a tab is clicked
function onClickTab(tab_id) {
	setSelectedTab(tab_id);
	loadVideoSelection('videos',tab_id);
	loadFirstVideoFromSelection(tab_id);
}

// Callback when a media item is clicked
function onClickVideo(video) {
	loadVideo(video);
}

// Create a video element
function createVideoElement(item) {
	var wrapper = document.createElement("div");
	var left = document.createElement("div");
	var body = document.createElement("div");
	var heading = document.createElement("div");
	var thumbnail = document.createElement("img");
	wrapper.className = "media media-wrapper";
	left.className = "media-left";
	body.className = "media-body";
	heading.className = "media-heading";
	thumbnail.className = "media-object";
	body.appendChild(heading);
	wrapper.appendChild(left);
	wrapper.appendChild(body);
	left.appendChild(thumbnail);
	
	heading.innerText = item.snippet.title;
	thumbnail.src = item.snippet.thumbnails.default.url;
	thumbnail.width = item.snippet.thumbnails.default.width;
	thumbnail.height = item.snippet.thumbnails.default.height;

	wrapper.addEventListener('click',function() {
		onClickVideo(item);
	});
	
	return wrapper;
}

// Load video selection in sidebar
function loadVideoSelection(video_group_id,playlist_id) {
	var video_group = document.getElementById(video_group_id);
	// empty out the list of videos
	video_group.innerHTML = "";

	// re-populate
	for(var i = 0; i < VIDEOS[playlist_id].length; i++) {
		video_group.appendChild(createVideoElement(VIDEOS[playlist_id][i]));
	}
}

function appboot() {
	// this function is called once the Google API is loaded

	// ...load youtube API and then bootstrap the application to
	// load the playlists in
	gapi.client.setApiKey(GOOGLE_API_KEY);
	gapi.client.load('youtube','v3',function() {
		for(var k in PLAYLISTS) {
			// get id and title of the playlist to load
			var playlist_id = PLAYLISTS[k].split(':')[0];
			var playlist_title = PLAYLISTS[k].split(':')[1];

			// request videos for playlist
			requestVideoPlaylist(playlist_id,playlist_title,function(response,i,t) {
				if(response.items.length==0) {
					return;
				}
				
				// TABS
				addTab('tabs',i,t);
				setSelectedTab(i);

				// VIDEOS
				VIDEOS[i] = response.items;
				loadVideoSelection('videos',i);
				loadFirstVideoFromSelection(i);
			});
		}
	});
}
