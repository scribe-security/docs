---
sidebar_label: "Overview"
sidebar_position: 1
title: "Overview"
---

Valint (**Va**lidate supply chain **Int**egrity) is Scribe’s on-prem CLI tool that compliments Scribe Hub. It provides a large number of features for validating integrity and enforcing a policy over your supply chain. 
Here are the respective roles of Valint and Scribe Hub:

### Valint
* Generate Evidence, such as SBOM, Provenance, SDLC events, and SDLC artifacts (file or directory hashes, etc.)
* Collect 3rd party evidence
* Sign and verify evidence
* Upload evidence to an evidence store (Scribe Hub or on-prem)
* Evaluate evidence to enforce SDLC policies in-pipeline or at a deployment gate

### Scribe Hub
* Manage multiple product supply chains
* Store, manage, and retrieve evidence with context
* Enrich evidence with threat intelligence
* Analyze supply chain risk
* Integrate with 3rd party tools
* Share evidence, risk, and compliance levels with stakeholders

While Valint works integrally with Scribe Hub it can also be deployed as a standalone by utilizing an on-prem file server or an OCI registry as an evidence store in lieu of Scribe Hub for uploading and retrieving evidence.

## Integration with the supply chain

### Integration with your SCM
You can invoke Valint from your SCM to generate SBOMs of code commits, sign them and upload them as evidence.

### Integration with your CI pipelines
You can deploy Valint as a native plugin in various CI platforms where it is used to generate evidence such as SBOMs, Provenance Documents, capture files or directories as evidence, or upload evidence created by other CI tools.
You can also invoke Valint as a build policy gate to fail or alert on the build.

### Integration as a Kubernetes Admission Controller
Valint can use Valint as an Admission Controller where it evaluates with policies the images before they are deployed.
Valint can be used in conjunction with **OPA Gatekeeper**, **Kyverno**, or as a standalone Admission Controller.

Integration with other links in your software supply chain
You can use Valint for use cases such as the following as part of your existing processes:
* Generate SBOMs of Software artifacts received from third-party
* Generate and upload SBOMs of container images from your container registry
* Sign as evidence self-attestation documents

## Evidence Target types​
Valint collects evidence from different types of Tragets (artifacts) that are produced or consumed in your supply chain. Valint currently supports the following types of targets:

* OCI and Docker images
* Single files
* Directories
* Git Repositories

## Formatting evidence and adding context
Valint collects and formats evidence according to the [in-toto](https://in-toto.io/specs/) specification which has become the standard building block for software supply chain management. Valint supports both in-toto attestations (signed evidence) and statements (unsigned evidence).

In order to provide control and a consistent view across different links in the supply chain it is important to maintain context for the different pieces of evidence that are collected. For example, Valint enables piecing together the identity (digest) of an image stored in a container registry by attaching information from the environment variables of the CI system about the build agent that built it, build run ID, git project, commit ID, and so on.
This allows the application of compound policies that consider different steps in the software’s development life cycle.

### Autodetect Context Type
Valint will automatically detect the CI environment and add contextual fields to the evidence. For instance, Valint identifies the Build Run Identifier across various CI systems, enabling you to verify the origin of assets.

## Attestation - signing evidence and verifying it
Valint signs the evidence with different schemes:
* PKI - x509
* [Sigstore cosign](https://docs.sigstore.dev/signing/quickstart/) a method to generate ephemeral keys ad hoc
* KMS
* TPM
You can use Valint to verify these signatures in relevant downstream stages to verify the integrity of the software artifacts or of the evidence before applying additional policy conditions to their contents.

## Analyzing the Software Composition
Valint can analyze your software project dependencies by examining different steps in your supply chain. Each step generates an SBOM and in turn, Scribe Hub fuses all these analyses together to create an accurate analysis that is required in cases where a single method doesn’t suffice.

* Analyzing metadata and fingerprinting the contents of a build output artifact such as a docker image
* Analyzing the dependency requirements in source code in a git repository or a file directory
* Valint can also capture existing SBOMs or the output of other SCA tools and upload it to Scribe Hub

Valint can map relationships such as package to OCI image layers, package to git commit or commit history, package to files, to package, commit to package.

## SLSA Provenance Document
Valint can generate a Provenance Document required for SLSA compliance. Read more about attaining compliance with SLSA [here](https://scribe-security.github.io/docs/guides/secure-sfw-slsa/).

## Collecting evidence from third-party tools
Valint can collect the output of SCA tools, SBOM tools, or application security scans as evidence, sign, and upload them to the evidence store. You can use this evidence to evaluate policies downstream with Valint. For example, block unapproved licenses of dependencies in a software artifact that were detected by a third-party SCA.

## Applying supply chain policies
Valint can act as a supply chain policy evaluation and enforcement agent. To this end, it pulls required evidence objects previously uploaded to an evidence store (Scribe Hub or on-prem) and evaluates them against policies that you set. These are either canned policies that you can parametrize or coded policies that you author and maintain by a gitops process.
The output of an evaluation includes evaluation details, a verdict, and a reference to the evidence.

## Evidence Deduplication
Evidence of the same `target` with the same `labels` uploaded to the same product (defined by `product-key` and `product-version`) of the same team is deduplicated. This means that if you upload the same evidence twice, the older one is replaced by the newer one.

## Using alternative Evidence Stores
In lieu of Scribe Hub, you can configure Valint to use other stores to store and retrieve evidence. However, in this scenario, you cannot benefit from Scribe Hub’s evidence retrieval by context, data enrichment and risk analysis, and cross-organizational supply chain transparency sharing.
* OCI registry 
* Cache or local directory 
