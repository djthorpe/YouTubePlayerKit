
#import <Cocoa/Cocoa.h>
#import "YTPlayerView.h"

@interface AppDelegate : NSObject <NSApplicationDelegate, YTPlayerViewDelegate> {
	NSTimer* _timer;
}

@property (assign) IBOutlet NSWindow* window;

@end
