
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

-(NSString* )kind {
	return [_data objectForKey:@"kind"];
}

///////////////////////////////////////////////////////////////////////////////
#pragma mark PROPERTIES

@dynamic key, videoTitle, channelTitle, videoDescription, thumbnailURL;

-(NSString* )key {
	if([[self kind] isEqualToString:@"youtube#searchResult"]) {
		NSDictionary* keyDict = [_data objectForKey:@"id"];
		NSParameterAssert([keyDict isKindOfClass:[NSDictionary class]]);
		NSString* kind = [keyDict objectForKey:@"kind"];
		if([kind isEqualToString:@"youtube#video"]) {
			return[keyDict objectForKey:@"videoId"];
		} else {
			return nil;
		}
	} else if([[self kind] isEqualToString:@"youtube#video"]) {
		return [_data objectForKey:@"id"];
	} else {
		return nil;
	}
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

