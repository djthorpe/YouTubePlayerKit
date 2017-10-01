//
//  DetailViewController.h
//  YouTubeNowNext
//
//  Created by David Thorpe on 30/09/2017.
//

#import <UIKit/UIKit.h>

@interface DetailViewController : UIViewController

@property (strong, nonatomic) NSDate *detailItem;
@property (weak, nonatomic) IBOutlet UILabel *detailDescriptionLabel;

@end

