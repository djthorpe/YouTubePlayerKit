
#import "DataSource.h"
#import <GTL/GTLService.h>

NSString* YTPlayerSelectedVideoNotification = @"YTPlayerSelectedVideoNotification";
NSString* YTAPIKey = @"AIzaSyDBmZLhc3dpn8oO1nv3rXF9YEQXMikHkLE";

@implementation DataSource

-(void)awakeFromNib {
	NSLog(@"Awake from nib");

	GTLService* service = [[GTLService alloc] init];
	[service setAPIKey:YTAPIKey];

	NSURL* url = [GTLUtilities URLWithString:@"https://www.googleapis.com/youtube/v3/videos" queryParameters:@{
		@"part": @"id",
		@"chart": @"mostPopular"

	}];
	GTLServiceTicket* ticket = [service fetchObjectWithURL:url completionHandler:^(GTLServiceTicket* ticket,id object, NSError* error) {
		if(error) {
			NSLog(@"error = %@",error);
		} else {
			NSLog(@"object = %@",object);
		}
	}];
}

-(NSArray* )array {
	return  @[
		@{
			@"id": @"J3UjJ4wKLkg",
			@"title": @"Rihanna - Take A Bow",
			@"thumbnail": @"https://i.ytimg.com/vi/J3UjJ4wKLkg/default.jpg"
		},
		@{
			@"id": @"JByDbPn6A1o",
			@"title": @"Eminem - Space Bound",
			@"thumbnail": @"https://i.ytimg.com/vi/JByDbPn6A1o/default.jpg"
		}
	];
}

-(NSInteger)numberOfRowsInTableView:(NSTableView* )aTableView {
	return [[self array] count];
}

-(NSView* )tableView:(NSTableView* )aTableView viewForTableColumn:(NSTableColumn* )tableColumn row:(NSInteger)row {
	NSParameterAssert(row >= 0 && row < [[self array] count]);
	NSTableCellView* result = [aTableView makeViewWithIdentifier:tableColumn.identifier owner:self];
	NSDictionary* data = [[self array] objectAtIndex:row];
	NSURL* imageURL = [NSURL URLWithString:[data objectForKey:@"thumbnail"]];
	[[result textField] setStringValue:[data objectForKey:@"title"]];
	[[result imageView] setImage:[[NSImage alloc] initWithContentsOfURL:imageURL]];
    return result;
}

-(void)tableViewSelectionDidChange:(NSNotification* )aNotification {
	NSTableView* tableView = [aNotification object];
	NSParameterAssert([tableView isKindOfClass:[NSTableView class]]);
	NSInteger selectedRow = [tableView selectedRow];
	if(selectedRow >= 0 && selectedRow < [[self array] count]) {
		NSDictionary* video = [[self array] objectAtIndex:selectedRow];
		[[NSNotificationCenter defaultCenter] postNotificationName:YTPlayerSelectedVideoNotification object:video userInfo:nil];
	}
}

@end
