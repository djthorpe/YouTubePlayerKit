
#import "Playlist.h"
#import "PlaylistItem.h"

@implementation Playlist

-(instancetype)init {
    self = [super init];
    if (self) {
        _array = [NSMutableArray new];
    }
    return self;
}

-(NSUInteger)count {
	return [_array count];
}

-(PlaylistItem* )objectAtIndex:(NSUInteger)index {
	return [_array objectAtIndex:index];
}

-(void)removeAllObjects {
	[_array removeAllObjects];
}

-(void)addObject:(PlaylistItem* )item {
	[_array addObject:item];
}

@end
