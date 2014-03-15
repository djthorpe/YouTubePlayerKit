#!/bin/bash

# These are the settings you can change
HTTP_HOSTNAME='localhost'
HTTP_PORT=8080

# Derived settings - do not change
CURRENT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
FLAGS="--host=${HTTP_HOSTNAME} --port=${HTTP_PORT}"
PYTHON_PATH=`which python`
GAE_PATH=`which dev_appserver.py`
PROJECT_PATH="${CURRENT_PATH}/.."

if [ "$PYTHON_PATH" = "" ] ; then
  echo "Missing python binary"
  exit -1
fi

if [ "$GAE_PATH" = "" ] ; then
  echo "Missing dev_appserver.py binary (is GoogleAppEngine installed?)"
  exit -1
fi

echo "------------------------------------------------------------------"
echo -n " Python: "
echo -n `${PYTHON_PATH} -V`
echo -n "Project: "
echo `basename ${PROJECT_PATH}`
echo -n "  Flags: "
echo ${FLAGS}
echo -n "    URL: "
echo "http://${HTTP_HOSTNAME}:${HTTP_PORT}/"
echo "------------------------------------------------------------------"
echo ""

${PYTHON_PATH} ${GAE_PATH} ${FLAGS} ${PROJECT_PATH}

