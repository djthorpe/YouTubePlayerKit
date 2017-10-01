
#import <UIKit/UIKit.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate,UISplitViewControllerDelegate>

// PROPERTIES
@property (strong, nonatomic) UIWindow *window;
@property (readonly) NSString* apiKey;
@property (readonly) NSString* playlistId;

@end

