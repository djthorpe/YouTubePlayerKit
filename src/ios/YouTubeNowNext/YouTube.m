
#import "YouTube.h"
#import "Playlist.h"
#import "PlaylistItem.h"
#import <GTLYouTube/GTLYouTube.h>

@implementation YouTube

////////////////////////////////////////////////////////////////////////////////
#pragma mark - Constructor

-(instancetype)initWithApiKey:(NSString* )apiKey {
    self = [super init];
    if (self) {
		_service = [[GTLServiceYouTube alloc] init];
		_service.shouldFetchNextPages = YES;
		_service.retryEnabled = YES;
		_service.APIKey = apiKey;
    }
    return self;
}

////////////////////////////////////////////////////////////////////////////////
#pragma mark - Public Methods

-(BOOL)fetchPlaylist:(NSString* )playlistId into:(Playlist* )playlist {
	// Return without doing anything if the ticket is not null
	if(_playlistItemListTicket != nil) {
		return NO;
	}

	// Else construct the query and execute
	GTLQueryYouTube* query = [GTLQueryYouTube queryForPlaylistItemsListWithPart:@"snippet,contentDetails"];
    query.playlistId = playlistId;
    query.maxResults = 50;
    query.additionalHTTPHeaders = @{
		@"X-Ios-Bundle-Identifier": [[NSBundle mainBundle] bundleIdentifier]
    };
    _playlistItemListTicket = [_service executeQuery:query completionHandler:^(GTLServiceTicket* ticket,GTLYouTubePlaylistItemListResponse* playlistItemList,NSError* error) {
		if(playlistItemList == nil) {
			if(error != nil) {
				[self.delegate youtube:self error:error];
			}
			[self.delegate youtube:self fetchPlaylistSuccess:NO];
		} else {
			[self _savePlaylistItems:[playlistItemList items] into:playlist];
			[self.delegate youtube:self fetchPlaylistSuccess:YES];
		}
		_playlistItemListTicket = nil;
     }];
     return YES;
}

////////////////////////////////////////////////////////////////////////////////
#pragma mark - Private Methods

-(void)_savePlaylistItems:(NSArray* )items into:(Playlist* )playlist {
	[playlist removeAllObjects];
	for(GTLYouTubePlaylistItem* item in items) {
		[playlist addObject:[[PlaylistItem alloc] initWithItem:item]];
	}
}

@end
