
#import <Foundation/Foundation.h>

// FORWARD CLASS DECLARATIONS
@class GTLYouTubePlaylistItem;

// INTERFACE
@interface PlaylistItem : NSObject {
@private
	GTLYouTubePlaylistItem* _item;
}

// CONSTRUCTOR
-(instancetype)initWithItem:(GTLYouTubePlaylistItem* )item;

// PROPERTIES
@property (readonly) NSString* title;
@property (readonly) NSString* videoId;

@end
