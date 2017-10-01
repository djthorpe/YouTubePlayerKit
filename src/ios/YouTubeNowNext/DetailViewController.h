
#import <UIKit/UIKit.h>

// FORWARD CLASS DECLARATIONS
@class AppDelegate;
@class PlaylistItem;
@class YouTubeEmbedService;

// INTERFACE
@interface DetailViewController : UIViewController {
	@private
	YouTubeEmbedService* _embedService;
}

// PROPERTIES
@property (strong, nonatomic) PlaylistItem* detailItem;
@property (weak, nonatomic) IBOutlet UILabel* detailDescriptionLabel;
@property (readonly) AppDelegate* appDelegate;
@property (weak, nonatomic) IBOutlet UIView* playerView;

@end

