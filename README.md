YouTubePlayerKit
================

This is an example implementation of an embeddable YouTube Player for Mac OS X and iOS. Licensed under the Apache 2.0 license, please see NOTICE.md for more information.

![Logo](https://raw.github.com/djthorpe/YouTubePlayerKit/master/etc/screenshot.png)

There are some third party dependencies within the project, so when you clone it you will then need to synchronize the submodules as follows:

```
git submodule sync --init --recursive
```

## Compiling and using the project - MacOS

There is currently a target `YouTubePlayer_mac` within the XCode project, which is used to generate the Macintosh sample project. The `YTPlayerView.m` file contains the sample class which is a subclass of `NSView`. You should instantiate this YTPlayerView within your NIB file, and connect it to your controller.

## Compiling and using the project - iOS

The iOS application target is 'YouTubeNowNext_ios' and demonstrates pulling a playlist of popular live content and displaying it within a master/detail interface. It uses the new naitive YouTubeEmbeddedFramework instead of a UIWebView in order to
display the live stream in the detail view.

