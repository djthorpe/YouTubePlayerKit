
#import <Foundation/Foundation.h>

extern NSString* YTVideoPart;

@interface YTVideo : NSObject {
	NSDictionary* _data;
}

// constructor
-(id)initWithData:(NSDictionary* )data;

// properties
@property (readonly) NSString* key;
@property (readonly) NSString* videoTitle;
@property (readonly) NSString* channelTitle;
@property (readonly) NSString* videoDescription;
@property (readonly) NSURL* thumbnailURL;

@end
