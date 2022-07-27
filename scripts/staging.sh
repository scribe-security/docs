#!/bin/bash

toMaster=( "docs/ci-cd-integration/" "docs/cves.md" )

declare -a toMaster=(
    "docs/ci-cd-integration/"
    "docs/cves.md"
    "docs/intro.md"
    "docs/sampleproject.md"
    "docs/gensbomcli.md"
    "docs/faq.md"
    "docs/overview.md" 
    "package.json"
    "README.md"
    "*.js"
    "src/"
    "blog/"
    "scripts/"
    ".docusarurus"
    ".gitignore"
    ".github/"
)

git checkout master
git fetch origin master
git pull origin master
git branch -D staging
git checkout -b staging

for file in "${toMaster[@]}"
do
   git checkout dev ${file}
done

git commit -m "dev docs export"
git push origin -f staging