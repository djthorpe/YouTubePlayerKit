
#import <GTLYouTube/GTLYouTube.h>
#import "PlaylistItem.h"

@implementation PlaylistItem

////////////////////////////////////////////////////////////////////////////////
#pragma mark - Constructor

-(instancetype)initWithItem:(GTLYouTubePlaylistItem* )item {
    self = [super init];
    if (self) {
        _item = item;
    }
    return self;
}

////////////////////////////////////////////////////////////////////////////////
#pragma mark - Properties

@dynamic title;
@dynamic videoId;

-(NSString* )title {
	return [[_item snippet] title];
}

-(NSString* )videoId {
	return [[[_item snippet] resourceId] videoId];
}

@end
