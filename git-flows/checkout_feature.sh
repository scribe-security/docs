#!/bin/bash

CURRENT=$(git branch --show-current)
FEATURE_NAME=$1
suffix="dev-preview"

if [[ $FEATURE_NAME = "dev" ]]
then
    echo "feature must not be named dev"
else

    git status
    git fetch --all

    exists=`git show-ref refs/heads/$suffix/$FEATURE_NAME`
    if [ -n "$exists" ]; then
        echo 'branch exists!'
        git fetch origin $suffix/$FEATURE_NAME:$suffix/$FEATURE_NAME || true
        git checkout $suffix/$FEATURE_NAME
    else
        echo 'branch not exists!'
        git fetch origin dev:dev
        git checkout dev
        git checkout -b $suffix/$FEATURE_NAME
    fi
fi