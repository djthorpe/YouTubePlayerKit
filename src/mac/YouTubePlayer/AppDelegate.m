
#import "AppDelegate.h"
#import "YTPlayerView.h"

@implementation AppDelegate

-(id)init {
    self = [super init];
    if (self) {
        _timer = nil;
    }
    return self;
}

-(void)applicationDidFinishLaunching:(NSNotification* )aNotification {
	YTPlayerView* view = [[self window] contentView];
	[view setDelegate:self];
}

-(void)timerWithInterval:(NSTimeInterval)interval {
	if(_timer) {
		[_timer invalidate];
		_timer = nil;
	}
	if(interval > 0.0) {
		_timer = [NSTimer scheduledTimerWithTimeInterval:interval target:self selector:@selector(doTimerFired:) userInfo:nil repeats:YES];
		[_timer fire];
	}
}

-(void)player:(YTPlayerView* )player state:(YTPlayerViewStateType)state {
	if(state==YTPlayerViewStateAPIReady) {
		// when API is ready, load in video
		[player load:@"eCySCCIZPWA"];
	} else if(state==YTPlayerViewStateLoaded) {
		// when video is loaded, start playing
		[player playFromStart];
	} else if(state==YTPlayerViewStatePlaying) {
		NSLog(@"Play");
		[self timerWithInterval:0.5];
	} else if(state==YTPlayerViewStateEnded) {
		NSLog(@"Stopped");
		[self timerWithInterval:0];
	} else {
		NSLog(@"player state = %d",state);
	}
}

-(void)player:(YTPlayerView* )player error:(YTPlayerViewErrorType)error {
	NSLog(@"Player error = %d",error);
}

-(void)doTimerFired:(id)sender {
	YTPlayerView* view = [[self window] contentView];
	NSLog(@"currentTime = %f",[view currentTime]);
}

@end
