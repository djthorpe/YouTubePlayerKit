
#import <Cocoa/Cocoa.h>
#import <Foundation/Foundation.h>

extern NSString* YTPlayerSelectedVideoNotification;

@interface DataSource : NSObject <NSTableViewDataSource> {
	
}

// properties
@property (retain) NSArray* playlist;

@end
