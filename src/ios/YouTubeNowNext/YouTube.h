
#import <Foundation/Foundation.h>

// FORWARD CLASS DECLARATIONS
@class GTLServiceTicket;
@class GTLServiceYouTube;
@class Playlist;
@class YouTube;

// PROTOCOL
@protocol YouTubeDelegate <NSObject>
	@required
	-(void)youtube:(YouTube* )sender error:(NSError* )error;

	@optional
	-(void)youtube:(YouTube* )sender fetchPlaylistSuccess:(BOOL)success;
@end

// INTERFACE
@interface YouTube : NSObject {
@private
	GTLServiceTicket* _playlistItemListTicket;
	GTLServiceYouTube* _service;
}

// CONSTRUCTOR
-(instancetype)initWithApiKey:(NSString* )apiKey;

// PROPERTIES
@property (weak) id<YouTubeDelegate> delegate;

// METHODS
-(BOOL)fetchPlaylist:(NSString* )playlistId into:(Playlist* )playlist;

@end

