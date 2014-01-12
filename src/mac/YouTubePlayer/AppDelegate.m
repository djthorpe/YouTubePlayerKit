
#import "AppDelegate.h"
#import "YTPlayerView.h"
#import "YTVideo.h"

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

////////////////////////////////////////////////////////////////////////////////
#pragma mark CONSTRUCTORS

-(id)init {
    self = [super init];
    if (self) {
        _timer = nil;
    }
    return self;
}

-(void)applicationDidFinishLaunching:(NSNotification* )aNotification {
	[self setSelectedQuality:@""];
	[self setVolumeValue:50];
	[[self ibWindow] setTitle:@"YouTube Player"];
	
	// listen for new video notification
	[[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(doLoadVideo:) name:YTPlayerSelectedVideoNotification object:nil];
}

////////////////////////////////////////////////////////////////////////////////
#pragma mark PROPERTIES

@synthesize ibWindow;
@synthesize ibPlayer;
@synthesize ibQualityMenu;
@synthesize time;
@synthesize duration;
@synthesize playing;
@synthesize sliderValue;
@synthesize volumeValue;
@synthesize selectedQuality;

////////////////////////////////////////////////////////////////////////////////
#pragma mark PRIVATE METHODS

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

-(void)setQuality:(YTPlayerViewQualityType)value {
	NSInteger index = 0;
	struct quality_lookup_t q = quality_lookup[index];
	while(q.name) {
		if(value==q.value) {
			[self setSelectedQuality:[NSString stringWithUTF8String:q.name]];
			return;
		}
		q = quality_lookup[++index];
	}
	[self setSelectedQuality:@"??"];
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

-(void)addQualityValues:(NSUInteger)qualities {
	NSParameterAssert(qualities);

	// remove menu items
	[[self ibQualityMenu] removeAllItems];
	
	NSInteger index = 0;
	struct quality_lookup_t q = quality_lookup[index];
	while(q.name) {
		if(qualities & q.value) {
			NSMenuItem* menuItem = [[NSMenuItem alloc] initWithTitle:[NSString stringWithUTF8String:q.name] action:@selector(doChangeQuality:) keyEquivalent:@""];
			[menuItem setTag:q.value];
			[ibQualityMenu addItem:menuItem];
		}
		q = quality_lookup[++index];
	}
}

-(void)setPlayingState {
	[self setPlaying:YES];
	[self timerWithInterval:0.5];
	[self addQualityValues:[[self ibPlayer] qualityValues]];
	[self setVolumeValue:[[self ibPlayer] volume]];
}

-(void)doTimerFired:(id)sender {
	NSTimeInterval currentTime = [[self ibPlayer] currentTime];
	NSTimeInterval dur = [[self ibPlayer] duration];
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
	NSTimeInterval dur = [[self ibPlayer] duration];
	if(dur > 0.0) {
		NSTimeInterval seekTime = ([self sliderValue] * dur) / 100.0;
		[[self ibPlayer] seekTo:seekTime allowSeekAhead:YES];
	}
}

-(IBAction)doVolume:(id)sender {
	[[self ibPlayer] setVolume:[self volumeValue]];
}

-(IBAction)doPlayPause:(id)sender {
	if([self playing]) {
		[[self ibPlayer] pause];
	} else {
		[[self ibPlayer] play];
	}
}

-(IBAction)doSetQuality:(id)sender {
	NSParameterAssert([sender isKindOfClass:[NSButton class]]);
	NSButton* btn = (NSButton* )sender;
	NSRect frame = [btn frame];
	NSPoint menuOrigin = [[btn superview] convertPoint:NSMakePoint(frame.origin.x, frame.origin.y+frame.size.height+40) toView:nil];
	NSEvent* event = [NSEvent mouseEventWithType:NSLeftMouseDown location:menuOrigin modifierFlags:NSLeftMouseDownMask timestamp:0 windowNumber:[ibWindow windowNumber] context:[ibWindow graphicsContext] eventNumber:0 clickCount:1 pressure:1];
	[NSMenu popUpContextMenu:[self ibQualityMenu] withEvent:event forView:btn];
}

-(IBAction)doChangeQuality:(NSMenuItem* )sender {
	NSParameterAssert([sender isKindOfClass:[NSMenuItem class]]);
	[[self ibPlayer] setQuality:(YTPlayerViewQualityType)[sender tag]];
}


-(void)setWindowTitle:(NSString* )title {
	[[self ibWindow] setTitle:title];
}

-(void)doLoadVideo:(NSNotification* )aNotification {
	YTVideo* video = [aNotification object];
	NSParameterAssert([video isKindOfClass:[YTVideo class]]);
	[[self ibPlayer] load:[video key]];
	[self setWindowTitle:[video videoTitle]];
}

////////////////////////////////////////////////////////////////////////////////
#pragma mark YTPLAYERVIEW DELEGATE

-(void)player:(YTPlayerView* )sender state:(YTPlayerViewStateType)state {
	if(state==YTPlayerViewStateAPIReady) {
		// when API is ready, load in video
		[self setPlaying:NO];
	} else if(state==YTPlayerViewStateLoaded) {
		// when video is loaded, start playing
		[self setPlaying:NO];
		[[self ibPlayer] playFromStart];
	} else if(state==YTPlayerViewStatePlaying) {
		[self setPlayingState];
	} else if(state==YTPlayerViewStateEnded) {
		[self setPlaying:NO];
		[self timerWithInterval:0];
	} else if(state==YTPlayerViewStatePlaybackQualityChange) {
		[self setQuality:[[self ibPlayer] quality]];
	} else if(state==YTPlayerViewStatePaused) {
		[self setPlaying:NO];
	} else if(state==YTPlayerViewStateBuffering || state==YTPlayerViewStateUnstarted) {
		// Do nothing for buffering or unstarted...
	}
}

-(void)player:(YTPlayerView* )sender error:(NSError* )error {
	NSLog(@"Player error = %@",error);
}

@end
