//
//  PlaylistCellView.m
//  YouTubePlayerKit
//
//  Created by David Thorpe on 12/01/2014.
//
//

#import "PlaylistCellView.h"

@implementation PlaylistCellView

-(id)initWithFrame:(NSRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        // Initialization code here.
    }
    return self;
}

////////////////////////////////////////////////////////////////////////////////
#pragma mark NSVIEW

-(void)drawRect:(NSRect)dirtyRect {
	[NSGraphicsContext saveGraphicsState];
	[[NSGraphicsContext currentContext] setShouldAntialias:NO];
    [[NSColor whiteColor] setStroke];
	[NSBezierPath setDefaultLineWidth:0.5];
	[NSBezierPath strokeRect:[self frame]];
	[NSGraphicsContext restoreGraphicsState];
    [super drawRect:dirtyRect];
}

@end
