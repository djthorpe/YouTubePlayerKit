
#import <YouTubeEmbeddedPlayerFramework/YouTubeEmbeddedPlayerFramework.h>
#import "DetailViewController.h"
#import "PlaylistItem.h"
#import "AppDelegate.h"

@interface DetailViewController () <YouTubeEmbedPlayerEventsDelegate>
@property (nonatomic) UIViewController<YouTubeEmbedPlayer>* playerViewController;
@end

@implementation DetailViewController

////////////////////////////////////////////////////////////////////////////////
#pragma mark - Properties

-(AppDelegate* )appDelegate {
	return (AppDelegate* )[[UIApplication sharedApplication] delegate];
}

////////////////////////////////////////////////////////////////////////////////
#pragma mark - Views

-(void)configureView {
	// Update the user interface for the detail item.
	if (self.detailItem) {
	    self.detailDescriptionLabel.text = [self.detailItem title];
	}
}

-(void)configureVideoView {
	// Initialize YouTube Embed Service.
	if(_embedService==nil) {
		NSLog(@"EMBED SERVICE START");
		_embedService = [YouTubeEmbedService sharedInstance];
		[_embedService initializeWithDeveloperKey:[self.appDelegate apiKey]];
		[self setPlayerViewController:[_embedService createPlayerViewController]];
		[[self playerViewController] setEventsDelegate:self];
		[self addChildViewController:[self playerViewController]];
		UIView* managedPlayerView = self.playerViewController.view;
		[managedPlayerView removeFromSuperview];
		managedPlayerView.frame = self.playerView.bounds;
		managedPlayerView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
		[self.playerView addSubview:managedPlayerView];
		[self.playerViewController didMoveToParentViewController:self];
	}
}

-(void)viewDidLoad {
	[super viewDidLoad];
	[self configureVideoView];
	[self configureView];
	
	// Update the video ID
	if([self detailItem] != nil) {
		[self.playerViewController stop];
		[self.playerViewController setVideoWithID:[self.detailItem videoId]];
	}
}

-(void)didReceiveMemoryWarning {
	[super didReceiveMemoryWarning];
	// Dispose of any resources that can be recreated.
}

////////////////////////////////////////////////////////////////////////////////
#pragma mark - Managing the detail item

-(void)setDetailItem:(PlaylistItem* )newDetailItem {
	if (_detailItem != newDetailItem) {
	    _detailItem = newDetailItem;
	    [self configureView];
	}
}

////////////////////////////////////////////////////////////////////////////////
#pragma mark YouTubeEmbedPlayerEventsDelegate implementation

-(void)player:(id)player didReceivePlayerEvent:(id<YouTubeEmbedPlayerEvent>)evt {
	switch(evt.eventType) {
	case kYouTubeEmbedPlayerEventTypeUnknown:
		NSLog(@"kYouTubeEmbedPlayerEventTypeUnknown");
		break;
	case kYouTubeEmbedPlayerEventTypeStarted:
		NSLog(@"kYouTubeEmbedPlayerEventTypeStarted");
		break;
	case kYouTubeEmbedPlayerEventTypePlaying:
		NSLog(@"kYouTubeEmbedPlayerEventTypePlaying");
		break;
	case kYouTubeEmbedPlayerEventTypeSuspended:
		NSLog(@"kYouTubeEmbedPlayerEventTypeSuspended");
		break;
	case kYouTubeEmbedPlayerEventTypeStopped:
		NSLog(@"kYouTubeEmbedPlayerEventTypeStopped");
		break;
  }
}

@end


