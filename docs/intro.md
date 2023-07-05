---
sidebar_position: 2
---
# Getting started


### Securing your pipeline with Scribe

Scribe Hub is a hub designed for correlating, organizing, and sharing your various pipelines and their security information in a single place.

The following occurs once you have connected the Continuous Integration (CI) pipeline of your project to Scribe Hub:

1. Scribe Hub maps all components and files and validates that there were no unwanted changes.
2. Running your pipeline will generate an SBOM and an integrity report.
3. Scribe Hub enables you to share the SBOM and report with selected subscribers.

Scribe allows you to connect an unlimited number of projects/pipelines to the Hub.

## Before you begin 

- **Work environment:** Scribe Hub has a web user interface. Scribe's evidence collectors run on Linux or Mac.
- **Permissions:** You will need permission to modify your project's build script to add a relevant code snippet connecting your project to Scribe Hub.
- **Your project:** Scribe collects evidence for projects of any type of programming language that build a container image. 

## Procedure 
1. In your browser, go to **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")**. If you have not yet registered, do so now.
2. Once you have logged in to the **Scribe Hub** go to Home>Products>[$product]>Setup. Even if this is your first time visiting the **Scribe Hub** you'll already have a Demo Product you can interact with. [$product] can be the Demo Product or a new product that you choose to integrate with the **Scribe Hub**.

3. Once you have a project you want to connect to Scribe Hub, follow these [instructions to set up your CI pipeline](/docs/ci-integrations "instructions to set up your CI pipeline").

## Trying out Scribe

You can try Scribe by downloading a small [sample project](/docs/sampleproject  "sample project").
The Instructions will walk you through the process of setting up the sample node.js project, downloading the Scribe tool, `valint`, and running it in your Command Line Interpreter (CLI) to create an SBOM and an integrity report.



