---
sidebar_label: "Valint Overview"
sidebar_position: 2
title: "Valint: Validate Supply Chain Integrity"
author: Mikey Strauss - Scribe
date: April 5, 2021
geometry: margin=2cm
---

Valint is a powerful tool that validates the integrity of your **supply chain**, providing organizations with a way to enforce `policies` using the Scribe Service, CI, or admission controller. 
It also provides a mechanism for compliance and transparency, both within the organization and with external parties.
 
By managing `evidence` generation, storage and validation, Valint ensures that your organization's `policies` are enforced throughout the supply chain. <br />
You can store evidence locally or in any OCI registry, as well as using the Scribe Service for storage.

In addition to evidence management, Valint also **generates** evidence for a range of targets, including directories, file artifacts, images, and git repositories. It supports two types of evidence: **CycloneDX SBOMs** and **SLSA provenance**. With Valint, you can sign and verify artifacts against their origin and signer identity in the supply chain.

Valint also enables you to **generate** any 3rd party report, scan or configuration (any file) into evidence using the **Generic evidence** subtype. Enabling compliance requirements to refer and attest to your custom needs.


### High level diagrams  
<img src='../../../img/cli//valint_high_level.jpg' alt='Valint high level' width='80%' min-width='600px'/>

<img src='../../../img/cli/valint_support_table.jpg' alt='Valint support table' width='80%' min-width='600px'/>

<img src='../../../img/cli//module_digram.jpg' alt='Evidence Flow Diagram' width='80%' min-width='600px'/>

<img src='../../../img/cli/platform_table.jpg' alt='Interfaces' width='80%' min-width='600px'/>

### Policy engine
At the heart of Valint lies the `policy engine`, which enforces a set of policies on the `evidence` produced by your supply chain. The policy engine accesses different `evidence stores` to retrieve and store `evidence` for compliance verification throughout your supply chain. <br />
Each `policy` proposes to enforce a set of policy modules your supply chain must comply with. 

> For more details on policies, see [polices](#policies) section.

### Evidence
Evidence can refer to metadata collected about artifacts, reports, events or settings produced or provided to your supply chain.
Evidence can be either signed (attestations) or unsigned (statements).

### Generic evidence
Generic evidence includes custom 3rd party verifiable information containing any required compliance requirements.
Generic evidence allows users to include any file as evidence or attestation (signed) hooking in 3rd party tools.
Allowing more robust and customizable policies to fit your needs.

For example, Attesting to License scanner report can enable you to enforce licensing requirements as part of your build pipeline.

### Evidence Stores
Each storer can be used to store, find and download evidence, unifying all the supply chain evidence into a system is an important part to be able to query any subset for policy validation.

### Environment context
`environment context` collects information from the underlining environments, in which Valint is run.

Environment context is key to connecting the evidence and the actual point in your supply chain they where created by.
Given an artifact to the Valint assumes the context of the artifact (`target`) it is provided, In other words, the identifiers of the artifact are included in the context `environment context`.

On the verification flow the current `environment context` is provided to the policy engine, which is the key to defining relative requirements between different points in the supply chain.

For example, verification done in Github Actions can refer to policy requirements that apply to the current run number.
Another example, verification done on a binary can refer to requirements that apply to the hash of the binary.

### Policies
---
Each `policy` proposes to enforce a set of requirements your supply chain must comply with. Policies reports include valuations, compliance details, verdicts as well as references to provided `evidence`. <br />
Policy configuration can be set under the main configuration `policies` section.

Each `policy` consists of a set of `policy modules` that your supply chain must comply with. 
A `policy` is verified if ALL required `modules` in are evaluated and verified. A `module` is verified if ANY `evidence` is found that complies with the `module` configuration and setting.

### Target types
---
Target types are types of artifacts produced and consumed by your supply chain.
Using supported targets, you can collect evidence and verify compliance on a range of artifacts.