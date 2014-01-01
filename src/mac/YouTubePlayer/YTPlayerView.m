
#import "YTPlayerView.h"

////////////////////////////////////////////////////////////////////////////////
// PRIVATE DECLARATIONS

@interface YTPlayerView (Private)
-(NSString* )_embedResource;
@end

@implementation YTPlayerView

////////////////////////////////////////////////////////////////////////////////
#pragma mark PROPERTIES

@synthesize webView;

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
	NSRect frame = [self frame];
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
#pragma mark PRIVATE METHODS

-(NSString* )_embedResource {
	// load the HTML embed
	NSURL* embedURL = [[NSBundle mainBundle] URLForResource:@"embed" withExtension:@"html"];
	return [NSString stringWithContentsOfURL:embedURL encoding:NSUTF8StringEncoding error:nil];
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

-(NSTimeInterval)currentTime {
	NSParameterAssert(_loaded);
	NSNumber* result = [[[self webView] windowScriptObject] callWebScriptMethod:@"CurrentTime" withArguments:nil];
	NSParameterAssert([result isKindOfClass:[NSNumber class]]);
	return [result doubleValue];
}

@end
