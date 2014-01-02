
#import "AppDelegate.h"
#import "YTPlayerView.h"

struct quality_lookup_t {
	const char* name;
	YTPlayerViewQualityType value;
} quality_lookup[] = {
	{ "Auto", YTPlayerViewQualityAuto },
	{ "240p", YTPlayerViewQualitySmall },
	{ "360p", YTPlayerViewQualityMedium },
	{ "480p", YTPlayerViewQualityLarge },
	{ "720p", YTPlayerViewQualityHD720 },
	{ "1080p", YTPlayerViewQualityHD1080 },
	{ "4K", YTPlayerViewQualityHiRes },
	{ nil,0 }
};

@implementation AppDelegate
@synthesize window;
@synthesize player;
@synthesize qualityMenu;
@synthesize time;
@synthesize duration;
@synthesize playing;
@synthesize sliderValue;
@synthesize selectedQuality;
@synthesize qualityValues;

-(id)init {
    self = [super init];
    if (self) {
        _timer = nil;
    }
    return self;
}

-(void)applicationDidFinishLaunching:(NSNotification* )aNotification {
	[self setQualityValues:[NSArray arrayWithObjects:nil]];
	[self setSelectedQuality:nil];
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
	NSInteger index = 0;
	struct quality_lookup_t q = quality_lookup[index];
	while(q.name) {
		if(value==q.value) {
			NSInteger i = [[self qualityValues] indexOfObject:[NSString stringWithUTF8String:q.name]];
			if(i != NSNotFound) {
				NSLog(@"set selected item to %ld",(long)i);
				[[self qualityMenu] selectItemAtIndex:i];
				NSLog(@"menu = %@",[self qualityMenu]);
			}
			return;
		}
		q = quality_lookup[++index];
	}
	[[self qualityMenu] selectItemAtIndex:-1];
}

-(YTPlayerViewQualityType)qualityForString:(NSString* )value {
	NSInteger index = 0;
	struct quality_lookup_t q = quality_lookup[index];
	while(q.name) {
		if(strcmp(q.name,[value UTF8String])==0) {
			return q.value;
		}
		q = quality_lookup[++index];
	}
	return YTPlayerViewQualityUnknown;
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

-(void)setPlayingState {
	[self setPlaying:YES];
	[self timerWithInterval:0.5];
	NSUInteger qualities = [[self player] qualityValues];
	if(qualities) {
		NSMutableArray* array = [NSMutableArray array];
		NSInteger index = 0;
		struct quality_lookup_t q = quality_lookup[index];
		while(q.name) {
			if(qualities & q.value) {
				[array addObject:[NSString stringWithFormat:@"%s",q.name]];
			}
			q = quality_lookup[++index];
		}
		[self setQualityValues:array];
	}
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
		[self setPlayingState];
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

-(IBAction)doSetQuality:(NSPopUpButton* )sender {
	NSParameterAssert([sender isKindOfClass:[NSPopUpButton class]]);
	YTPlayerViewQualityType quality = [self qualityForString:[[sender selectedItem] title]];
	if(quality != YTPlayerViewQualityUnknown) {
		[[self player] setQuality:quality];
	}
}

@end
