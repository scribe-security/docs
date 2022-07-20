---
sidebar_position: 2
---
# Getting started

## Scribe Early Access

With Scribe’s Early Access you can validate the integrity of Node.JS images you build. Scribe maps all the components and files that made their way into your Node.js’s project final docker image and validates that each file’s hash value hasn’t changed if it wasn’t supposed to.

## Prerequisites 

You will need a Mac or Linux workstation running dockerd with access to the source repo and the image’s registry. Copy and run the following commands in a shell on your workstation.

<hr/>

## Getting Started

To get started navigate in your browser to <a href='https://mui.production.scribesecurity.com/install-scribe'>this address</a>. You can also try Scribe out with a demo project <a href='/docs/sampleproject'>here</a>. 

## Get gensbom CLI tool

```curl https://www.scribesecurity.com/getscribe | sh```
## Clone the source repo of your docker image to your local machine

```git clone <your_repo>```

Replace ```<your_repo>``` with the source repo path.

## Collect metadata about your source code

```$HOME/.scribe/bin/gensbom bom dir:<path> --scribe.url=https://api.dev.scribesecurity.com --scribe.username=<username> --scribe.password=<password> --name=scribe -E -f -vv```

Replace ```<path>``` with the path to the repo you cloned. ```<username>``` and ```<password>``` are re-generated for you every time you access the page.

## Collect metadata about your docker image

```$HOME/.scribe/bin/gensbom bom <your_docker_repository:tag> --scribe.url=https://api.dev.scribesecurity.com --scribe.username=<username> --scribe.password=<password> --name=scribe -E -f -vv```

Replace ```<your_docker_repository:tag>``` with the path to the your docker image. ```<username>``` and ```<password>``` are re-generated for you every time you access the page.

## Finish

After these commands are done, click the <b>Done</b> button at the bottom of the web page.
If you clicked Done but didn’t run the commands in this guide, go back and start over.

## How to read the integrity analysis

### Source Code Validation

Scribe reports how many JS files in the docker image were validated.
In case that a file’s hash value changed between its version in the source repo and and the destination image, Scribe determines whether this is a benign modification and flags only suspicious files. 
In the lower half of the page you can view the details of the individual files that were validated.

### Open Source Dependency Validation

Scribe reports how many open-source packages were validated and the total number of open-source files validated within these packages.
Scribe does this, by first analyzing the composition of the docker image. Then, for each package Scribe compares each of its files hashes with Scribe’s package intelligence DB. 
In the lower half of the page you can view the details of the individual packages and files that  were validated. 
In case that a file’s hash value changed between its version in the source repo and and the destination image, Scribe determines whether this is a benign modification and flags only suspicious files

### Export SBOM 

You can export the SBOM detailing the open-source dependencies of the docker image you analyzed by clicking <b>Export SBOM</b> in the top right of the report. The SBOM is in CycloneDX format.


