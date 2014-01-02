
#import "AppDelegate.h"
#import "YTPlayerView.h"

@implementation AppDelegate
@synthesize window;
@synthesize player;
@synthesize quality;
@synthesize time;
@synthesize duration;
@synthesize playing;
@synthesize sliderValue;

-(id)init {
    self = [super init];
    if (self) {
        _timer = nil;
    }
    return self;
}

-(void)applicationDidFinishLaunching:(NSNotification* )aNotification {
	[self setQuality:@""];
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

-(void)updateQualityWithValue:(YTPlayerViewQualityType)value {
	switch(value) {
		case YTPlayerViewQualitySmall:
			[self setQuality:@"240p"];
			break;
		case YTPlayerViewQualityMedium:
			[self setQuality:@"360p"];
			break;
		case YTPlayerViewQualityLarge:
			[self setQuality:@"480p"];
			break;
		case YTPlayerViewQualityHD720:
			[self setQuality:@"720p"];
			break;
		case YTPlayerViewQualityHD1080:
			[self setQuality:@"1080p"];
			break;
		case YTPlayerViewQualityHiRes:
			[self setQuality:@"4K"];
			break;
		default:
			[self setQuality:@""];
			break;
	}
}

-(NSString* )intervalToString:(NSTimeInterval)value {
	if(value < 0.0) {
		return @"";
	}
	NSUInteger sc = ((NSUInteger)value % 60);
	value = (value - sc) / 60;
	NSUInteger mn = ((NSUInteger)value % 60);
	value = (value - mn) / 60;
	return [NSString stringWithFormat:@"%02lu:%02lu:%02lu",(NSUInteger)value,mn,sc];
}

-(void)player:(YTPlayerView* )sender state:(YTPlayerViewStateType)state {
	if(state==YTPlayerViewStateAPIReady) {
		// when API is ready, load in video
		//[player load:@"eCySCCIZPWA"];
		[self setPlaying:NO];
		[[self player] load:@"5Jp9_sgJcN0"];
	} else if(state==YTPlayerViewStateLoaded) {
		// when video is loaded, start playing
		[self setPlaying:NO];
		[[self player] playFromStart];
	} else if(state==YTPlayerViewStatePlaying) {
		[self setPlaying:YES];
		[self timerWithInterval:0.5];
	} else if(state==YTPlayerViewStateEnded) {
		NSLog(@"Stopped");
		[self setPlaying:NO];
		[self timerWithInterval:0];
	} else if(state==YTPlayerViewStatePlaybackQualityChange) {
		[self updateQualityWithValue:[[self player] quality]];
	} else if(state==YTPlayerViewStatePaused) {
		[self setPlaying:NO];
	} else {
		NSLog(@"player state = %d",state);
	}
}

-(void)player:(YTPlayerView* )sender error:(YTPlayerViewErrorType)error {
	NSLog(@"Player error = %d",error);
}

-(void)doTimerFired:(id)sender {
	NSTimeInterval currentTime = [[self player] currentTime];
	NSTimeInterval dur = [[self player] duration];
	[self setTime:[self intervalToString:currentTime]];
	if(currentTime < dur && currentTime > 0.0) {
		[self setDuration:[self intervalToString:(dur-currentTime)]];
		[self setSliderValue:(currentTime * 100.0 / dur)];
	} else {
		[self setDuration:@""];
		[self setSliderValue:0];
	}
}

-(IBAction)doSeek:(id)sender {
	NSTimeInterval dur = [[self player] duration];
	if(dur > 0.0) {
		NSTimeInterval seekTime = ([self sliderValue] * dur) / 100.0;
		NSLog(@"seek to %@",[self intervalToString:seekTime]);
		[[self player] seekTo:seekTime allowSeekAhead:YES];
	}
}

-(IBAction)doPlayPause:(id)sender {
	if([self playing]) {
		[[self player] pause];
	} else {
		[[self player] play];
	}
}

@end
