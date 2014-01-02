
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

typedef enum {
	YTPlayerViewQualityUnknown = -1,
	YTPlayerViewQualitySmall = 0x01,
	YTPlayerViewQualityMedium = 0x02,
	YTPlayerViewQualityLarge = 0x04,
	YTPlayerViewQualityHD720 = 0x08,
	YTPlayerViewQualityHD1080 = 0x0F,
	YTPlayerViewQualityHiRes = 0x10,
	YTPlayerViewQualityAuto = 0x20
} YTPlayerViewQualityType;

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
@property (retain) WebView* webView;
@property (assign) NSTimeInterval currentTime;
@property (assign) YTPlayerViewQualityType quality;
@property (assign) NSUInteger volume;
@property (assign,readonly) NSTimeInterval duration;
@property (assign,readonly) NSUInteger qualityValues;

// methods
-(BOOL)load:(NSString* )videoid;
-(BOOL)play;
-(BOOL)pause;
-(BOOL)playFromStart;
-(BOOL)seekTo:(NSTimeInterval)seekTime allowSeekAhead:(BOOL)allowSeekAhead;

@end
