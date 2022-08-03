---
sidebar_position: 2
---
# Getting started

## Scribe Hub

Scribe Hub allows you to connect as many projects / pipelines as you want to the Hub. You'll need to connect the project's CI pipeline to Scribe Hub and from that point, each time you run the pipeline you'll be generating an *SBOM* and an integrity report that will appear directly on the Hub. You can share the *SBOM* and an integrity report with selected subscribers allowing you to share the visibility and trust gained from the generated information with relevant stakeholders. At this time our tools can verify the integrity of Node.JS projects using NPM and generating a Kubernetes image. For each project you connect to Scribe Hub, Scribe maps all the components and files that made their way into your Node.js’s project final docker image and validates that each file’s hash value hasn’t changed if it wasn’t supposed to. 

## Prerequisites 

For each project you want to add to Scribe Hub you will need access to the project's pipeline and the ability to add the relevant code snippets connecting it to the Hub.

<hr/>

## Getting Started

To get started navigate in your browser to <a href='https://beta.hub.scribesecurity.com/producer-products'>this address</a>. You can also try Scribe out with a demo project <a href='/docs/sampleproject'>here</a>.  

Once you have a project you want to connect to Scribe Hub follow the instructions matching your CI pipeline <a href='/docs/ci-integration'>here</a>.

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


