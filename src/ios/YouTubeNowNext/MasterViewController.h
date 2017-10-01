
#import <UIKit/UIKit.h>

@class DetailViewController;
@class AppDelegate;
@class Playlist;
@class YouTube;

@interface MasterViewController : UITableViewController {
	Playlist* _playlist;
	YouTube* _youtube;
}

// PROPERTIES
@property (strong, nonatomic) DetailViewController *detailViewController;
@property (strong, nonatomic) UIBarButtonItem* refreshButton;
@property (readonly) AppDelegate* appDelegate;

@end

