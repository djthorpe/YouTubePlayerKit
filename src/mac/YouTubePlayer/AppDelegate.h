
#import <Cocoa/Cocoa.h>
#import "YTPlayerView.h"
#import "DataSource.h"

@interface AppDelegate : NSObject <NSApplicationDelegate, YTPlayerViewDelegate> {
	NSTimer* _timer;
}

// IBOutlets
@property (assign) IBOutlet NSWindow* ibWindow;
@property (assign) IBOutlet NSWindow* ibErrorPanel;
@property (assign) IBOutlet YTPlayerView* ibPlayer;
@property (assign) IBOutlet NSMenu* ibQualityMenu;
@property (assign) IBOutlet DataSource* ibDataSource;

// properties
@property (retain) NSString* time;
@property (retain) NSString* duration;
@property (assign) BOOL playing;
@property (assign) double sliderValue;
@property (assign) double volumeValue;
@property (retain) NSString* selectedQuality;
@property (retain) NSString* errorMessage;

// IBActions
-(IBAction)doPlayPause:(id)sender;
-(IBAction)doSeek:(id)sender;
-(IBAction)doVolume:(id)sender;
-(IBAction)doSetQuality:(id)sender;
-(IBAction)doChangeQuality:(NSMenuItem* )sender;
-(IBAction)doEndErrorSheet:(id)sender;

@end
