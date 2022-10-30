#!/bin/bash


CURRENT=$(git branch --show-current)
suffix="dev-preview"
CURRENT=${CURRENT#"$suffix/"}
FEATURE_NAME=${1:-${CURRENT}} 
echo "$CURRENT"

if [[ $CURRENT = "dev" ]]
then
    echo "Must select feature"
    echo "bash checkout_feature.sh <feature_name>"
else
    git fetch --all
    git fetch origin dev:dev
    git checkout $suffix/$FEATURE_NAME
    git push origin $suffix/$FEATURE_NAME
    echo "When feature is ready please create PR to dev"
fi