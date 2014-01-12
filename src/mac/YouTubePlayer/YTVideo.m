
#import "YTVideo.h"

NSString* YTVideoPart = @"id,snippet";

@implementation YTVideo

///////////////////////////////////////////////////////////////////////////////
#pragma mark CONSTRUCTOR

-(id)init {
	return nil;
}

-(id)initWithData:(NSDictionary* )data {
	NSParameterAssert(data);
	self = [super init];
	if(self) {
		_data = data;
	}
	return self;
}

///////////////////////////////////////////////////////////////////////////////
#pragma mark PRIVATE METHODS

-(NSDictionary* )snippet {
	return [_data objectForKey:@"snippet"];
}

///////////////////////////////////////////////////////////////////////////////
#pragma mark PROPERTIES

@dynamic key, videoTitle, channelTitle, videoDescription, thumbnailURL;

-(NSString* )key {
	return [_data objectForKey:@"id"];
}

-(NSString* )videoTitle {
	return [[self snippet] objectForKey:@"title"];
}

-(NSString* )videoDescription {
	return [[self snippet] objectForKey:@"description"];
}

-(NSString* )channelTitle {
	return [[self snippet] objectForKey:@"channelTitle"];
}

-(NSURL* )thumbnailURL {
	NSDictionary* thumbnails = [[self snippet] objectForKey:@"thumbnails"];
	for(NSString* quality in @[ @"default", @"standard", @"medium", @"high" ]) {
		NSDictionary* url = [thumbnails objectForKey:quality];
		if(url && [url isKindOfClass:[NSDictionary class]] && [url objectForKey:@"url"]) {
			return [NSURL URLWithString:[url objectForKey:@"url"]];
		}
	}
	return nil;
}


@end

