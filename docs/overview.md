---
sidebar_position: 1
sidebar_label: About Scribe
---
# What is Scribe

Scribe is a leading security solution for organizations that are concerned about threats from their software supply chain.

## Who needs Scribe? ##

Scribe continuously assures your software is secure. It could be used by:

- DevSecOps teams securing software builds
- Security teams responsible for software in-use
- Larger scale development teams collaborating via remote tools


## How Scribe works  

### Software Bill of Materials (SBOM) 

An SBOM is a standard format for documenting information about components of a software artifact.  Integrating Scribe tools in your pipeline can generate an SBOM for every build.

SBOMs have many uses. They can, for example, be used to identify vulnerabilities in dependencies.
After creating your SBOM, Scribe uses the SBOM to analyze and validate your software build. 


\>\> [Read more about SBOM](https://scribesecurity.com/sbom/)
### Integrity Validation and Open Source Authentication 

Scribe can validate the integrity of your source code by tracking the hash value of every file from its commit to the build pipeline.

Scribe flags suspicious modifications while accounting for legitimate changes such as linting and compilation in the validation process.

Scribe authenticates the open-source components, using our open-source package intelligence, assuring components were not maliciously modified.

Once your pipeline is integrated and configured with Scribe, every time you run the pipeline, Scribe creates an SBOM and an integrity report. Your builds are automatically secured and analyzed. 

### Results
Scribe enriches SBOMs with validation information and creates integrity reports that you can easily share with stakeholders.
<!-- > In this release, Scribe validates Node.js projects and NPM packages, that create an Open Containers Image (OCI) such as Docker. -->

### Signing critical files 

Throughout the software development lifecycle (SDLC), advanced users can cryptographically [sign and validate](signVerify.md "sign and validate") critical evidence using Sigstore keys by default or by employing customer keys. Cryptographically signing and validating provides resistance against tampering. It extends software signing to the SDLC.