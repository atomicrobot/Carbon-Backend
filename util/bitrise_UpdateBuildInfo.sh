#!/usr/bin/env bash

BUILD_DATE=`date | sed 's/  */ /g'`
BUILD_SHA=$GIT_CLONE_COMMIT_HASH
BUILD_NUMBER=$BITRISE_BUILD_NUMBER

eval "echo \"$(cat env/build.env.template)\"" > env/build.env