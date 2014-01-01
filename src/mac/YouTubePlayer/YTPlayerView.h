
#import <Cocoa/Cocoa.h>
#import <WebKit/WebKit.h>

////////////////////////////////////////////////////////////////////////////////
// Forward declarations

@class YTPlayerView;

////////////////////////////////////////////////////////////////////////////////
// Enmerations

typedef enum {
	YTPlayerViewStateAPIReady = -3,
	YTPlayerViewStateLoaded = -2,
	YTPlayerViewStateUnstarted = -1,
	YTPlayerViewStateEnded = 0,
	YTPlayerViewStatePlaying = 1,
	YTPlayerViewStatePaused = 2,
	YTPlayerViewStateBuffering = 3,
	YTPlayerViewStateCued = 5,
	YTPlayerViewStatePlaybackQualityChange = -4
} YTPlayerViewStateType;

typedef enum {
	YTPlayerViewErrorInvalidParameters = 2,
	YTPlayerViewErrorHTML5Error = 5,
	YTPlayerViewErrorNotFound = 100,
	YTPlayerViewErrorRestricted = 101,
	YTPlayerViewErrorRestricted2 = 150
} YTPlayerViewErrorType;

////////////////////////////////////////////////////////////////////////////////
// YTPlayerViewDelegate

@protocol YTPlayerViewDelegate <NSObject>
-(void)player:(YTPlayerView* )playerView state:(YTPlayerViewStateType)state;
-(void)player:(YTPlayerView* )playerView error:(YTPlayerViewErrorType)error;
@end

////////////////////////////////////////////////////////////////////////////////
// YTPlayerView

@interface YTPlayerView : NSView {
	BOOL _loaded;
}

// properties
@property (retain) IBOutlet id<YTPlayerViewDelegate> delegate;
@property (retain) IBOutlet WebView* webView;

// methods
-(BOOL)load:(NSString* )videoid;
-(BOOL)playFromStart;
-(NSTimeInterval)currentTime;



@end
