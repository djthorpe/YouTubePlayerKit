
#import <Cocoa/Cocoa.h>
#import "YTPlayerView.h"

@interface AppDelegate : NSObject <NSApplicationDelegate, YTPlayerViewDelegate> {
	NSTimer* _timer;
}

@property (assign) IBOutlet NSWindow* window;
@property (assign) IBOutlet YTPlayerView* player;
@property (assign) IBOutlet NSPopUpButton* qualityMenu;
@property (retain) NSString* time;
@property (retain) NSString* duration;
@property (assign) BOOL playing;
@property (assign) double sliderValue;
@property (assign) double volumeValue;
@property (retain) NSArray* qualityValues;
@property (retain) NSString* selectedQuality;

// IBActions
-(IBAction)doPlayPause:(id)sender;
-(IBAction)doSeek:(id)sender;
-(IBAction)doVolume:(id)sender;
-(IBAction)doSetQuality:(id)sender;

@end
