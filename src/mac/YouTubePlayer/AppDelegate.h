
#import <Cocoa/Cocoa.h>
#import "YTPlayerView.h"

@interface AppDelegate : NSObject <NSApplicationDelegate, YTPlayerViewDelegate> {
	NSTimer* _timer;
}

@property (assign) IBOutlet NSWindow* window;
@property (assign) IBOutlet YTPlayerView* player;
@property (retain) NSString* quality;
@property (retain) NSString* time;
@property (retain) NSString* duration;
@property (assign) BOOL playing;
@property (assign) double sliderValue;

// IBActions
-(IBAction)doPlayPause:(id)sender;
-(IBAction)doSeek:(id)sender;

@end
