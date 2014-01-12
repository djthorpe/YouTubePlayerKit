
#import "DataSource.h"
#import "YTVideo.h"

NSString* YTPlayerSelectedVideoNotification = @"YTPlayerSelectedVideoNotification";
NSString* YTAPIKey = @"AIzaSyDBmZLhc3dpn8oO1nv3rXF9YEQXMikHkLE";
NSString* YTVideoChart = @"mostPopular";

@implementation DataSource

////////////////////////////////////////////////////////////////////////////////
#pragma mark PROPERTIES

@synthesize playlist;

////////////////////////////////////////////////////////////////////////////////
#pragma mark PRIVATE METHODS

-(NSArray* )playlistJSON {
	NSUInteger maxResults = 25;
	NSURL* url = [NSURL URLWithString:[NSString stringWithFormat:@"https://www.googleapis.com/youtube/v3/videos?part=%@&chart=%@&key=%@&maxResults=%lu",YTVideoPart,YTVideoChart,YTAPIKey,maxResults]];
	NSError* error = nil;
	NSData* data = [NSData dataWithContentsOfURL:url options:0 error:&error];
	if(error) {
		NSLog(@"Error: %@:%@",url,error);
		return nil;
	}
	NSDictionary* response = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:&error];
	if(error) {
		NSLog(@"Error: %@:%@",url,error);
		return nil;
	}
	NSParameterAssert([response isKindOfClass:[NSDictionary class]]);
	NSArray* items = [response objectForKey:@"items"];
	NSParameterAssert([items isKindOfClass:[NSArray class]]);
	return [response objectForKey:@"items"];
}

////////////////////////////////////////////////////////////////////////////////
#pragma mark AWAKEFROMNIB

-(void)awakeFromNib {
	// retrieve list of most popular videos if array is empty
	if([[self playlist] count]==0) {
		NSArray* newPlaylist = [self playlistJSON];
		if(newPlaylist) {
			NSMutableArray* videos = [NSMutableArray arrayWithCapacity:[newPlaylist count]];
			for(NSDictionary* data in newPlaylist) {
				[videos addObject:[[YTVideo alloc] initWithData:data]];
			}
			[self setPlaylist:videos];
		}
	}
}

////////////////////////////////////////////////////////////////////////////////
#pragma mark NSTABLEDATASOURCE DELEGATE

-(NSInteger)numberOfRowsInTableView:(NSTableView* )aTableView {
	return [[self playlist] count];
}

-(NSView* )tableView:(NSTableView* )aTableView viewForTableColumn:(NSTableColumn* )tableColumn row:(NSInteger)row {
	NSParameterAssert(row >= 0 && row < [[self playlist] count]);
	NSTableCellView* result = [aTableView makeViewWithIdentifier:tableColumn.identifier owner:self];
	YTVideo* video = [[self playlist] objectAtIndex:row];

	[[result textField] setStringValue:[video videoTitle]];
	[[result imageView] setImage:[[NSImage alloc] initWithContentsOfURL:[video thumbnailURL]]];
	[result setToolTip:[video videoDescription]];
	
    return result;
}

-(void)tableViewSelectionDidChange:(NSNotification* )aNotification {
	NSTableView* tableView = [aNotification object];
	NSParameterAssert([tableView isKindOfClass:[NSTableView class]]);
	NSInteger selectedRow = [tableView selectedRow];
	if(selectedRow >= 0 && selectedRow < [[self playlist] count]) {
		NSDictionary* video = [[self playlist] objectAtIndex:selectedRow];
		[[NSNotificationCenter defaultCenter] postNotificationName:YTPlayerSelectedVideoNotification object:video userInfo:nil];
	}
}

@end
