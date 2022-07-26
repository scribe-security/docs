---
sidebar_position: 1
---
# What is Scribe

Scribe is a solution for organizations that are concerned about threats from their software supply chain. 

DevSecOps teams securing software builds and security teams responsible for software in-use can use Scribe as a means to continuously assure this software is secure.

## How Scribe works

### Software Bill of Materials (SBOM)

Scribe can generate an SBOM for every build with a tool you can run in your build pipeline. 

 

An SBOM is a standard format for expressing information about the components comprising a software artifact. An SBOM can be utilized for example, for identifying vulnerabilities in dependencies. 

 

Read more on SBOM here: https://scribesecurity.com/sbom/.

### Integrity Validation and Open Source Authentication

Scribe validates the integrity of your software build by tracking every file’s hash value from the file’s origin to the built artifact. This origin can be open-source or internal: a code repo, a package manager, or a container registry. In the process, Scribe flags suspicious modifications while accounting for legitimate changes such as linting and compilation. With its open-source package intelligence, Scribe authenticates the open-source components, assuring that they were not maliciously modified. Scribe enriches SBOMs with validation information and you can share it with relevant stakeholders.

- In this release, Scribe validates Node.js projects and npm packages.

Advanced users can cryptographically sign and validate critical evidence with customer keys, throughout the software development lifecycle (SDLC). This method provides resistance against tampering. It can also be regarded as extending the well-known concept of software signing to the SDLC.