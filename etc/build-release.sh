#!/bin/bash
# Build Mac OS X apps in Release configuration
#
# Syntax:
#   build-release.sh

CURRENT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
CONFIGURATION=Release
PROJECT=${CURRENT_PATH}/../YouTubePlayerKit.xcodeproj

# Build Mac Apps
xcodebuild -project ${PROJECT} -target "YouTubePlayer_mac" -configuration ${CONFIGURATION} || exit -1


