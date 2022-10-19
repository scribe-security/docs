#!/bin/bash

CURRENT=$(git branch --show-current)
suffix="dev-preview"
CURRENT=${CURRENT#"$suffix/"}
FEATURE_NAME=${1:-$CURRENT} 

if [[ $CURRENT = "dev" ]]
then
    echo "test"
else
    git fetch --all
    git fetch origin dev:dev
    git checkout $suffix/$FEATURE_NAME
    git rebase origin/dev
fi