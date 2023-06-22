---
sidebar_position: 8
sidebar_label: Reading Analysis
---

# Understanding the Integrity Analysis

>**Note: In this release, the Integrity Analysis applies only to Node.js projects**

## Validating Source Code

Scribe reports how many JS files in the Docker image were validated.

>When `Docker` image is mentioned, any Open Containers Image (OCI) can be used.

In the lower half of the page are the details of the individual files that were validated.

In case the hash value of a file changed between the version in the source repo and the destination image, Scribe determines whether this is a benign modification and flags only suspicious files.

## Validating Open Source Dependencies
Scribe reports how many open-source packages were validated, and the total number of validated open-source files within these packages.

### How Scribe validates

1. Scribe analyzes the composition of the Docker image.
1. For each package, Scribe compares each of the hashes of the files with the package intelligence DataBase (DB) built by Scribe.
1. In the lower half of the page, view the details of the individual packages and files that were validated.
1. If a the hash value of a file changed between the version in the DB and and the destination image, Scribe determines whether this is a benign modification and flags only suspicious files.

## Export SBOM
A Software Bill of Materials (SBOM) is created, as part of the validating process, in a CycloneDX JSON format.

The SBOM details the open-source dependencies of the Docker image analyzed. 

To export the SBOM, click  **Export SBOM**  in the top right of the report. 

