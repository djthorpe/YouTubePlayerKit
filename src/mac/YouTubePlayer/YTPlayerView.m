
#import "YTPlayerView.h"

////////////////////////////////////////////////////////////////////////////////
// PRIVATE DECLARATIONS

@interface YTPlayerView (Private)
-(NSString* )_embedResource;
-(NSString* )_stringFromQuality:(YTPlayerViewQualityType)value;
-(YTPlayerViewQualityType)_stringToQuality:(NSString* )value;
@end

@implementation YTPlayerView

////////////////////////////////////////////////////////////////////////////////
#pragma mark CONSTRUCTORS

-(id)init {
    self = [super init];
    if (self) {
		_loaded = NO;
    }
    return self;
}

-(void)awakeFromNib {
	// add webview subview and set ourselves as delegate
	NSRect frame = NSMakeRect(0,0,[self frame].size.width,[self frame].size.height);
	[self setWebView:[[WebView alloc] initWithFrame:frame]];
	[self addSubview:[self webView]];
	[[self webView] setUIDelegate:self];
	[[self webView] setFrameLoadDelegate:self];
	[[self webView] setAutoresizingMask:(NSViewHeightSizable | NSViewWidthSizable)];

	// add the HTML into the webview
	NSString* embed = [self _embedResource];
	NSParameterAssert(embed);
	NSURL* base = [NSURL URLWithString:@"https://www.youtube.com/"];
	NSParameterAssert(base);
	[[[self webView] mainFrame] loadHTMLString:embed baseURL:base];
}

////////////////////////////////////////////////////////////////////////////////
#pragma mark PROPERTIES
    
@synthesize webView;
@dynamic currentTime;
@dynamic duration;
@dynamic qualityValues;
@dynamic volume;

-(NSTimeInterval)duration {
	NSParameterAssert(_loaded);
	NSNumber* result = [[[self webView] windowScriptObject] callWebScriptMethod:@"Duration" withArguments:nil];
	// returns 0.0 if duration is not known
	if([result isKindOfClass:[NSNumber class]]) {
		return [result doubleValue];
	} else {
		return 0.0;
	}
}

-(NSTimeInterval)currentTime {
	NSParameterAssert(_loaded);
	NSNumber* result = [[[self webView] windowScriptObject] callWebScriptMethod:@"CurrentTime" withArguments:nil];
	NSParameterAssert([result isKindOfClass:[NSNumber class]]);
	return [result doubleValue];
}
    
-(void)setCurrentTime:(NSTimeInterval)value {
	// TODO
	NSParameterAssert(_loaded);
}

-(YTPlayerViewQualityType)quality {
	NSParameterAssert(_loaded);
	NSString* result = [[[self webView] windowScriptObject] callWebScriptMethod:@"CurrentQuality" withArguments:nil];
	if(result==nil) {
		return YTPlayerViewQualityUnknown;
	}
	NSParameterAssert([result isKindOfClass:[NSString class]]);
	return [self _stringToQuality:result];
}

-(void)setQuality:(YTPlayerViewQualityType)quality {
	NSParameterAssert(_loaded);
	NSString* arg = [self _stringFromQuality:quality];
	NSParameterAssert(arg);
	[[[self webView] windowScriptObject] callWebScriptMethod:@"SetQuality" withArguments:[NSArray arrayWithObject:arg]];
}

-(NSUInteger)qualityValues {
	NSParameterAssert(_loaded);
	NSString* values = [[[self webView] windowScriptObject] callWebScriptMethod:@"QualityValues" withArguments:nil];
	NSParameterAssert([values isKindOfClass:[NSString class]]);
	NSUInteger qualities = 0;
	for(NSString* value in [values componentsSeparatedByString:@","]) {
		YTPlayerViewQualityType quality = [self _stringToQuality:value];
		if(quality != YTPlayerViewQualityUnknown) {
			qualities |= quality;
		}
	}
	return qualities;
}

-(NSUInteger)volume {
	NSParameterAssert(_loaded);
	NSNumber* value = [[[self webView] windowScriptObject] callWebScriptMethod:@"GetVolume" withArguments:nil];
	NSParameterAssert([value isKindOfClass:[NSNumber class]]);
	return [value unsignedIntegerValue];
}

-(void)setVolume:(NSUInteger)value {
	NSParameterAssert(value <= 100);
	[[[self webView] windowScriptObject] callWebScriptMethod:@"SetVolume" withArguments:[NSArray arrayWithObject:[NSNumber numberWithUnsignedInteger:value]]];
}

////////////////////////////////////////////////////////////////////////////////
#pragma mark PRIVATE METHODS

-(NSString* )_embedResource {
	// load the HTML embed
	NSURL* embedURL = [[NSBundle mainBundle] URLForResource:@"embed" withExtension:@"html"];
	return [NSString stringWithContentsOfURL:embedURL encoding:NSUTF8StringEncoding error:nil];
}

-(NSString* )_stringFromQuality:(YTPlayerViewQualityType)value {
	switch(value) {
		case YTPlayerViewQualitySmall:
			return @"small";
		case YTPlayerViewQualityMedium:
			return @"medium";
		case YTPlayerViewQualityLarge:
			return @"large";
		case YTPlayerViewQualityHD720:
			return @"hd720";
		case YTPlayerViewQualityHD1080:
			return @"hd1080";
		case YTPlayerViewQualityHiRes:
			return @"hires";
		case YTPlayerViewQualityAuto:
			return @"auto";
		default:
			return nil;
	}
}

-(YTPlayerViewQualityType)_stringToQuality:(NSString* )value {
	if([value isEqualToString:@"small"]) {
		return YTPlayerViewQualitySmall;
	}
	if([value isEqualToString:@"medium"]) {
		return YTPlayerViewQualityMedium;
	}
	if([value isEqualToString:@"large"]) {
		return YTPlayerViewQualityLarge;
	}
	if([value isEqualToString:@"hd720"]) {
		return YTPlayerViewQualityHD720;
	}
	if([value isEqualToString:@"hd1080"]) {
		return YTPlayerViewQualityHD1080;
	}
	if([value isEqualToString:@"highres"]) {
		return YTPlayerViewQualityHiRes;
	}
	if([value isEqualToString:@"auto"]) {
		return YTPlayerViewQualityAuto;
	}
	return YTPlayerViewQualityUnknown;
}

////////////////////////////////////////////////////////////////////////////////
#pragma mark WEBVIEW DELEGATES

-(void)webView:(WebView* )webView windowScriptObjectAvailable:(WebScriptObject* )windowScriptObject {
    [windowScriptObject setValue:self forKey:@"console"];
}

+(NSString* )webScriptNameForSelector:(SEL)selector {
    if(selector==@selector(_js_log:)) {
        return @"log";
    }
    if(selector==@selector(_js_onYouTubePlayerAPIReady)) {
        return @"onYouTubePlayerAPIReady";
    }
    if(selector==@selector(_js_onStateChange:)) {
        return @"onStateChange";
    }
    if(selector==@selector(_js_onReady:)) {
        return @"onReady";
    }
	if(selector==@selector(_js_onPlaybackQualityChange:)) {
        return @"onPlaybackQualityChange";
	}
	if(selector==@selector(_js_onError:)) {
        return @"onError";
	}
	return nil;
}

+(BOOL)isSelectorExcludedFromWebScript:(SEL)selector {
	NSString* name = [self webScriptNameForSelector:selector];
	if(name != nil) {
		return NO;
	}
	// by default, don't allow any calls
	return YES;
}

+(BOOL)isKeyExcludedFromWebScript:(const char* )property {
	return YES;
}

////////////////////////////////////////////////////////////////////////////////
#pragma mark JAVASCRIPT CALLBACKS

-(void)_js_onYouTubePlayerAPIReady {
	_loaded = YES;
	[[self delegate] player:self state:YTPlayerViewStateAPIReady];
}

-(void)_js_onStateChange:(NSNumber* )data {
	NSParameterAssert([data isKindOfClass:[NSNumber class]]);
	[[self delegate] player:self state:(YTPlayerViewStateType)[data integerValue]];
}

-(void)_js_onReady:(NSNumber* )data {
	[[self delegate] player:self state:YTPlayerViewStateLoaded];
}

-(void)_js_onPlaybackQualityChange:(NSNumber* )data {
	[[self delegate] player:self state:YTPlayerViewStatePlaybackQualityChange];
}

-(void)_js_onError:(NSNumber* )data {
	[[self delegate] player:self error:(YTPlayerViewErrorType)[data integerValue]];
}

-(void)_js_log :(NSString* )theMessage {
    NSLog(@"LOG: %@", theMessage);
}

////////////////////////////////////////////////////////////////////////////////
#pragma mark NSVIEW

-(void)drawRect:(NSRect)dirtyRect {
    [[NSColor greenColor] setFill];
    NSRectFill(dirtyRect);
    [super drawRect:dirtyRect];
}

////////////////////////////////////////////////////////////////////////////////
#pragma mark PUBLIC METHODS

-(BOOL)load:(NSString* )videoid {
	NSParameterAssert(_loaded);
	NSArray* args = [NSArray arrayWithObject:videoid];
	NSNumber* result = [[[self webView] windowScriptObject] callWebScriptMethod:@"RequestVideoWithID" withArguments:args];
	NSParameterAssert([result isKindOfClass:[NSNumber class]]);
	return [result boolValue];
}

-(BOOL)playFromStart {
	NSParameterAssert(_loaded);
	NSNumber* result = [[[self webView] windowScriptObject] callWebScriptMethod:@"PlayVideoFromStart" withArguments:nil];
	NSParameterAssert([result isKindOfClass:[NSNumber class]]);
	return [result boolValue];
}

-(BOOL)play {
	NSParameterAssert(_loaded);
	NSNumber* result = [[[self webView] windowScriptObject] callWebScriptMethod:@"PlayVideo" withArguments:nil];
	NSParameterAssert([result isKindOfClass:[NSNumber class]]);
	return [result boolValue];
}

-(BOOL)pause {
	NSParameterAssert(_loaded);
	NSNumber* result = [[[self webView] windowScriptObject] callWebScriptMethod:@"PauseVideo" withArguments:nil];
	NSParameterAssert([result isKindOfClass:[NSNumber class]]);
	return [result boolValue];
}

-(BOOL)seekTo:(NSTimeInterval)seekTime allowSeekAhead:(BOOL)allowSeekAhead {
	NSParameterAssert(_loaded);
	NSArray* args = [NSArray arrayWithObjects:[NSNumber numberWithDouble:seekTime],[NSNumber numberWithBool:allowSeekAhead],nil];
	NSNumber* result = [[[self webView] windowScriptObject] callWebScriptMethod:@"SeekTo" withArguments:args];
	NSParameterAssert([result isKindOfClass:[NSNumber class]]);
	return [result boolValue];
}

@end
