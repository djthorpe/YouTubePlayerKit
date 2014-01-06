
#import <Cocoa/Cocoa.h>
#import "YTPlayerView.h"

@interface AppDelegate : NSObject <NSApplicationDelegate, YTPlayerViewDelegate> {
	NSTimer* _timer;
}

// IBOutlets
@property (assign) IBOutlet NSWindow* ibWindow;
@property (assign) IBOutlet YTPlayerView* ibPlayer;
@property (assign) IBOutlet NSMenu* ibQualityMenu;

// properties
@property (retain) NSString* time;
@property (retain) NSString* duration;
@property (assign) BOOL playing;
@property (assign) double sliderValue;
@property (assign) double volumeValue;
@property (retain) NSString* selectedQuality;

// IBActions
-(IBAction)doPlayPause:(id)sender;
-(IBAction)doSeek:(id)sender;
-(IBAction)doVolume:(id)sender;
-(IBAction)doSetQuality:(id)sender;
-(IBAction)doChangeQuality:(NSMenuItem* )sender;

@end
