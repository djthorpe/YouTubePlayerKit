#!/bin/bash
#
# This script is used to deploy to live
CURRENT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SCRIPT_NAME=`basename $0`
CONFIG_FILE=${CURRENT_PATH}/../app.yaml
APP_ID=`awk '/^(application:)(.*)/ {print $2 }' ${CONFIG_FILE} | head -1`
APP_VERSION=`awk '/^(version:)(.*)/ {print $2 }' ${CONFIG_FILE} | head -1`
EMAIL=djt@mutablelogic.com

appcfg.py --email=${EMAIL} --oauth2 update ${CURRENT_PATH}/..

echo "--------------------------------------------------------------"
echo -n "Console: "
echo "https://appengine.google.com/deployment?&app_id=s~${APP_ID}"

echo -n "Version: "
echo "http://${APP_VERSION}.${APP_ID}.appspot.com/"
