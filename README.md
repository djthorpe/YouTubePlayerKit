YouTubePlayerKit
================

Example implementation of an embeddable YouTube Player for Mac OS X and iOS. Licensed under the Apache 2.0 license, please see NOTICE.md for more information.

![Logo](https://raw.github.com/djthorpe/YouTubePlayerKit/master/etc/screenshot.png)

## Compiling and using the project

There is currently one target `YouTubePlayer` within the XCode project, which is used to generate the Macintosh sample project. The `YTPlayerView.m` file contains the sample class which is a subclass of `NSView`. You should instantiate this YTPlayerView within your NIB file, and connect it to your controller.

