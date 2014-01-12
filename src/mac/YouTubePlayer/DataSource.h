
#import <Cocoa/Cocoa.h>
#import <Foundation/Foundation.h>

extern NSString* YTPlayerSelectedVideoNotification;
extern NSString* YTPlayerPlaylistChangedNotification;

@interface DataSource : NSObject <NSTableViewDataSource> {
	
}

// properties
@property (retain) NSArray* playlist;


// methods
-(void)doVideoSearch:(NSString* )text;

@end
