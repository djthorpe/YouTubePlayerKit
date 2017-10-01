
#import "MasterViewController.h"
#import "DetailViewController.h"
#import "Playlist.h"
#import "PlaylistItem.h"
#import "YouTube.h"
#import "AppDelegate.h"

////////////////////////////////////////////////////////////////////////////////
#pragma mark - Private Interface

@interface MasterViewController () <YouTubeDelegate>
@end

@implementation MasterViewController

////////////////////////////////////////////////////////////////////////////////
#pragma mark - Properties

-(AppDelegate* )appDelegate {
	return (AppDelegate* )[[UIApplication sharedApplication] delegate];
}

////////////////////////////////////////////////////////////////////////////////
#pragma mark - Views

- (void)viewDidLoad {
	[super viewDidLoad];

	// Add YouTube
	if(_youtube == nil) {
		_youtube = [[YouTube alloc] initWithApiKey:[[self appDelegate] apiKey]];
		[_youtube setDelegate:self];
	}

	// Add Playlist
	if(_playlist == nil) {
		_playlist = [Playlist new];
	}

	// Create refresh button
	if([self refreshButton]==nil) {
		[self setRefreshButton:[[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemRefresh target:self action:@selector(refreshPlaylist:)]];
	}
	self.navigationItem.rightBarButtonItem = [self refreshButton];
	
	// Wire up controller
	self.detailViewController = (DetailViewController* )[[self.splitViewController.viewControllers lastObject] topViewController];
}


- (void)viewWillAppear:(BOOL)animated {
	self.clearsSelectionOnViewWillAppear = self.splitViewController.isCollapsed;
	[super viewWillAppear:animated];
	
	// Refresh playlist
	[self refreshPlaylist:self];
}


- (void)didReceiveMemoryWarning {
	[super didReceiveMemoryWarning];
	// Dispose of any resources that can be recreated.
}


- (void)refreshPlaylist:(id)sender {
	if([_youtube fetchPlaylist:[[self appDelegate] playlistId] into:_playlist]) {
		[self.refreshButton setEnabled:NO];
	}
}

////////////////////////////////////////////////////////////////////////////////
#pragma mark - Segues

- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
	if ([[segue identifier] isEqualToString:@"showDetail"]) {
	    NSIndexPath *indexPath = [self.tableView indexPathForSelectedRow];
	    PlaylistItem* object = [_playlist objectAtIndex:indexPath.row];
	    DetailViewController* controller = (DetailViewController* )[[segue destinationViewController] topViewController];
	    [controller setDetailItem:object];
	    controller.navigationItem.leftBarButtonItem = self.splitViewController.displayModeButtonItem;
	    controller.navigationItem.leftItemsSupplementBackButton = YES;
	}
}

////////////////////////////////////////////////////////////////////////////////
#pragma mark - Table View

-(NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
	return 1;
}


-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
	return [_playlist count];
}


-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
	UITableViewCell* cell = [tableView dequeueReusableCellWithIdentifier:@"Cell" forIndexPath:indexPath];
	cell.textLabel.text = [[_playlist objectAtIndex:indexPath.row] title];
	return cell;
}


-(BOOL)tableView:(UITableView *)tableView canEditRowAtIndexPath:(NSIndexPath *)indexPath {
	// Return NO if you do not want the specified item to be editable.
	return NO;
}

////////////////////////////////////////////////////////////////////////////////
#pragma mark - YouTubeDelegate

-(void)youtube:(YouTube* )sender error:(NSError* )error {
	NSLog(@"ERROR: %@",error);
}

-(void)youtube:(YouTube* )sender fetchPlaylistSuccess:(BOOL)success {
	if(success) {
		[[self tableView] reloadData];
	}
	[self.refreshButton setEnabled:YES];
}

@end
