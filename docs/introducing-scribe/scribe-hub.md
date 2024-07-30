
---

## sidebar_label: "Scribe Hub service"
title: Scribe Hub service
sidebar_position: 2
toc_min_heading_level: 2
toc_max_heading_level: 5
Scribe Hub is a platform for managing trust in the software supply chain that functions as a service for handling and sharing SBOMs, a repository for evidence, and a tool for supply chain intelligence and analytics. Scribe comprises Scribe Hub software as a service, an on-premise agent, and other utilities.

There are various ways to upload evidence to Scribe Hub: you can supply API tokens from your development tools like GitHub or Artifactory, deploy Scribe's agent called Valint in your pipeline, or upload third-party evidence through the Scribe Hub's API.

Scribe Hub enriches this evidence with supply chain intelligence and examines it for risk and compliance. Afterward, you can share attestations like SBOMs and vulnerability risk reports with your stakeholders in a way that's automatic but also controlled. In simpler terms, Scribe Hub helps you gather evidence of security, makes this evidence smarter, and then lets you share an attestation of security with others in a safe and controlled way.

Scribe's Valint, which stands for "Validate the Integrity of the supply chain", serves multiple functions. It creates Software Bills of Materials (SBOMs), collects evidence, signs it, verifies it and evaluates policies. You can use Valint in different ways, such as a Command Line Interface (CLI) tool, a plugin for various Continuous Integration (CI) pipelines, or a Kubernetes admission controller.

Valint sends the evidence it collects to the Scribe Hub. Additionally, Valint can serve as an agent that enforces supply chain policies either at the end of a build, during admission control to your production environment, or on an ad hoc basis. It retrieves evidence and analytic data from Scribe Hub and applies policy-as-code to it.

You can start using Scribe Hub by opening a free account [﻿here](https://scribesecurity.com/scribe-platform-lp/).

Start here with the [﻿Quickstart](../quick-start/demo) guide.

![Scribe Security high-level deployment architecture](../../../img/start/how-scribe-works.jpg "")





<!--- Eraser file: https://app.eraser.io/workspace/cniM4WT1EQeqOj5sb7eV --->