
#import <Foundation/Foundation.h>

@class PlaylistItem;

@interface Playlist : NSObject {
	NSMutableArray* _array;
}

-(NSUInteger)count;
-(PlaylistItem* )objectAtIndex:(NSUInteger)index;
-(void)removeAllObjects;
-(void)addObject:(PlaylistItem* )item;

@end
