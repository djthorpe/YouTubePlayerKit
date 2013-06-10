
window.YouTubePlayer = {
	insert: function(params) {
		var YOUTUBE_CONTROLS_HEIGHT = 30;
		var PLAYER_HEIGHT_TO_WIDTH_RATIO = 9 / 16;
		var DEFAULT_PLAYER_WIDTH = 480;
		if (!('videoId' in params)) {
			throw 'The "videoId" parameter must be set to the YouTube video id to be embedded.';
		}
		var containerElement = document.getElementById(params.container);
		if (!containerElement) {
			throw 'The "container" parameter must be set to the id of a existing HTML element.';
		}
		var width = params.width || DEFAULT_PLAYER_WIDTH;
		if ('YT' in window && 'Player' in window.YT) {
			initializePlayer(containerElement,params);
		} else {
			// Load the API, and add a callback to the queue to load the player once the API is available.
			if (!('onYouTubePlayerAPIReady' in window)) {
				window.onYouTubePlayerAPIReady = function() {
					for (var i = 0; i < window.YouTubePlayer.onYouTubePlayerAPIReadyCallbacks.length; i++) {
						window.YouTubePlayer.onYouTubePlayerAPIReadyCallbacks[i]();
					}
				};
				var scriptTag = document.createElement('script');
				scriptTag.src = 'http://www.youtube.com/player_api';
				var firstScriptTag = document.getElementsByTagName('script')[0];
				firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);
			}
			window.YouTubePlayer.onYouTubePlayerAPIReadyCallbacks.push(function() {
				initializePlayer(containerElement, params);
			});
		}
		function initializePlayer(containerElement, params) {
			var playerContainer = document.createElement('div');
			containerElement.appendChild(playerContainer);
			var playerOptions = params.playerOptions || {};
			return new YT.Player(playerContainer,{
				height: playerOptions.height || width * PLAYER_HEIGHT_TO_WIDTH_RATIO + YOUTUBE_CONTROLS_HEIGHT,
				width: playerOptions.width || width,
				playerVars: playerOptions.playerVars || { autohide: 1 },
				videoId: params.videoId,
				events: {
					onReady: playerOptions.onReady,
					onStateChange: playerOptions.onStateChange,
					onPlaybackQualityChange: playerOptions.onPlaybackQualityChange,
					onError: playerOptions.onError
				}
			});
		}
	},
	onYouTubePlayerAPIReadyCallbacks: []
}
