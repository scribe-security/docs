---
sidebar_label: "How Scribe works"
sidebar_position: 2
---

# How Scribe works

Scribe comprises of a Scribe Hub SaaS, sensors and policy agents. The sensors are deployed in your pipeline, collect and send the evidence to the Hub where they are analyzed and turned into an attestation. The policy agents enforce your policy at the end of the pipeline run, in the distribution (for example, as an admission controller) or ad hoc out-of-band.
There are two types of optional sensors: connecting Scribe Hub to your SCM or Container Registry by API, and a plugin installed in your CI system.

<img src='../../../img/start/how-scribe-works.jpg' alt='How Scribe Works'/>

## Before you begin 

- **Work environment:** Scribe Hub has a web user interface. Scribe's evidence collectors run on Linux or Mac.
- **Permissions:** You will need permission to modify your project's build script to add a relevant code snippet connecting your project to Scribe Hub.
- **Your project:** Scribe collects evidence for projects of any type of programming language that build a container image. However, in this release, Scribe's integrity validation works only with Node.js projects.

## Procedure 
1. In your browser, go to **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")**. If you have not yet registered, do so now.
2. Once you have logged in to the **Scribe Hub** go to Products>add product. Even if this is your first time visiting the **Scribe Hub** you'll already have a Demo Product you can interact with. 

3. Once you have a project you want to connect to Scribe Hub, follow these [instructions to set up your CI pipeline](/docs/how-to-run-scribe/ci-integrations "instructions to set up your CI pipeline").

## Trying out Scribe

You can try Scribe by downloading a small [sample project](/docs/how-to-run-scribe/sampleproject  "sample project").
The Instructions will walk you through the process of setting up the sample GitHub project, and running the proper workflows in sequence to demonstrate Scribe's capabilities such as a product SBOM and source code integrity.



