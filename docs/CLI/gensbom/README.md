---
title: Gensbom
author: mikey strauss - Scribe
date: April 5, 2021
geometry: margin=2cm
---

# 🚀 Gensbom - bill of material report CLI tool

Gensbom creates and verifies evidence for a collection of target types.
Gensbom also allows you to store evidence locally on OCI registry or using Scribe service.

Gensbom collects automatically the `envrionment context`, which allows you to refrence where in your supply chain the evidence was created.

Evidence format types support SBOMS and SLSA provenance for all targets.

Furthermore, Gensbom also allows you to sign and verify any target evidence across your supply chain. \
Verification flows for `attestations` (signed evidence) and `statements` (unsigned evidence).

## Target types
Each target allows you to collect evidence on the target itself. 
For example, collect SBOMs for images built by your supply chain, but also any directory or git repo.

### Image Target
Gensbom supports analysis of image targets, \
Image formats supported are currently docker manifest v2 and OCI. \
Image sources supported are docker-daemon, OCI storage, docker archive, OCI archive.

### Directory/file Target
Gensbom supports the analysis of directory/file targets.

### Git Target
Gensbom supports analysis of remote/local git repository targets.

## Evidence format types
Gensbom supports the following evidence formats.
- CyclondeDX - JSON and XML formats
- In-toto attestations - CyclondeDX and SLSA Provenance
- In-toto statements - CyclondeDX and SLSA Provenance
- In-toto predicate - CyclondeDX and SLSA Provenance

### SBOM details
SBOM includes a large amount of analyzed data for each target. \
Gensbom allows you to select which groups you like to include (TBD not imp). 

- Target metadata: details on the target and its context.
- Layer group: (image targets only).
- Package group - currently supporting Debian, Apk, Python, Golang, Ruby, Npm, Rpm, Java, Rust.
- File group: details on all files included in target.
- Commit group: details on all commits in the git repository's branch.
- Dependencies
-  - Image->Layer: Image and its related layers.
-  - Layer->Pkg: Layer and its related packages.
-  - Pkg->File: Package and their related files.
-  - Repo->Commit: Git repository and its related commits history.
-  - Commit->File: Git commit and its related files.

### Environment context
Gensbom supports the gathering of the context of the evidence creator. \
Evironment context is key to connecting evidence not only to the target but to its origin in your supply chain.

Environment context will be added to both SBOM and other evidence formats for further reference and verification flows. \

Currently, tool supports `github`, `gitlab`, `jenkins`,`azure`, `circleci` and `local` contexts collections.

For example, SBOM created/signed on a `github workflow` will add the current git url, workflow name.. etc to the SBOM as well, which in turn will allow you to know where the SBOM was created but also also allow context is verified by your supply chain policy.

## Attestations 
Attestations allow you to sign and verify your targets. <br />
Attestations allow you to connect PKI-based identities to your evidence and policy management.  <br />

Supported outputs:
- In-toto predicate - Cyclonedx SBOM, SLSA Provenance (unsigned evidence)
- In-toto statements - Cyclonedx SBOM, SLSA Provenance (unsigned evidence)
- In-toto attestations -Cyclonedx SBOM, SLSA Provenance (signed evidence)

Select default configuration using `--attest.default` flag. <br />
Select a custom configuration by providing `cocosign` field in the [configuration](docs/configuration.md) or custom path using `--attest.config`.

See details [In-toto spec](https://github.com/in-toto/attestation)
See details [attestations](docs/attestations.md)

# Installation
CLI can be installed by the following methods for Linux (arm, amd64).

See details [CLI documentation - install](docs/installation.md)

# CLI Overview
## Generate command
Gensbom command allows you to create evidence for any target. \
Evidence can be tailor-made to fit your supply chain policies and transparency needs.

> Evidence formats - CycloneDX SBOM and SLSA Provenance.

> Resulted evidence can be stored locally on OCI registry or Scribe service.

### Basic usage
Gensbom allows you to create SBOMs and SLSA provenances in multiple flavors and targets.

```bash
gensbom [target] [json, xml, statement, statement-slsa,attest,attest-slsa]
```

See details [CLI documentation - gensbom](docs/command/gensbom.md)

<details>
  <summary> Cyclonedx </summary>

Cyclonedx SBOM with all the available components.

```bash
gensbom busybox:latest -o json
gensbom git:https://github.com/mongo-express/mongo-express.git -o json
``` 
</details>

<details>
  <summary> Statement </summary>

Intoto statement is basically an unsigned attestation.
Creates SBOM or SLSA provenance statements
Output can be useful if you like to connect to other attestation frameworks such as `cosign`.

```bash
gensbom busybox:latest -o statement
gensbom busybox:latest -o statement-slsa
gensbom git:https://github.com/mongo-express/mongo-express.git -o statement
gensbom git:https://github.com/mongo-express/mongo-express.git -o statement-slsa
``` 
</details>

<details>
  <summary> Attestations </summary>

Intoto Attestation output, default via keyless Sigstore flow 

```bash
gensbom busybox:latest -o attest
gensbom busybox:latest -o statement-slsa
gensbom git:https://github.com/mongo-express/mongo-express.git -o attest
gensbom git:https://github.com/mongo-express/mongo-express.git -o attest-slsa
``` 

</details>

<details>
  <summary> Metadata only </summary>

You may select which component groups are added to your SBOM.
For example, you may use Gensbom to simply sign and verify your images, you only really need the `metadata` group.
Note metadata is implicit (BOM must include something).
```bash
gensbom busybox:latest --components metadata #Only include the target metadata
gensbom busybox:latest --components packages #Only include packages
gensbom busybox:latest --components packages,files,dep #Include packages files and there related relationship.
``` 
</details>

<details>
  <summary> Attach external data </summary>

Gensbom allows you to include external file content as part of the reported evidence.

For example, you may use Gensbom to include an external security report in your SBOM.
```bash
gensbom busybox:latest -A **/some_report.json
``` 
</details>

## Verify command
Command finds and verifies evidence for any of the targets. \
It can be used for multiple targets and output formats.

Evidence can be pulled locally, OCI registry or Scribe service.

Supported verification flows for `attestations` (signed evidence) as well as `statements`(unsigned evidence).

Verification flow for `attestations` includes PKI and identity verification as well as policy verification.
Verification flow for `statements` includes policy verification.

### Basic usage
```
gensbom verify [target] -v -i [attest, statement, attest-slsa, statement-slsa]
```

See details [CLI documentation - verify](docs/command/gensbom_verify.md)


<details>
  <summary> Image target attestations </summary>

Creating and verifying `attestation` for image target `busybox:latest`.

> By default Sigstore signing flow is triggered.

```bash
# Create SBOM attestations (signed SBOMS)
gensbom busybox:latest -o attest

# Create SLSA Provenance attestations
gensbom busybox:latest -o attest-slsa

``` 

Verifying attestation for images,

```bash
# Verify SBOM attestations (signed SBOMS)
gensbom verify busybox:latest -o attest

# Verify SLSA Provenance attestations
gensbom verify busybox:latest -i attest-slsa
``` 
</details>


<details>
  <summary> Git target attestations </summary>

Creating and verifying `attestation` for git repo target `https://github.com/mongo-express/mongo-express.git`.

> By default Sigstore signing flow is triggered.

```bash
# Create SBOM attestations (signed SBOMS)
gensbom git:https://github.com/mongo-express/mongo-express.git -o attest

# Create SLSA Provenance attestations
gensbom git:https://github.com/mongo-express/mongo-express.git -o attest-slsa

``` 

Verifying attestation for git repo target,

```bash
# Verify SBOM attestations (signed SBOMS)
gensbom verify git:https://github.com/mongo-express/mongo-express.git -o attest

# Verify SLSA Provenance attestations
gensbom verify git:https://github.com/mongo-express/mongo-express.git -i attest-slsa
``` 

> Note you can also use local repos as targets using `git:<path to local dir>` as the target.

</details>

<details>
  <summary> Image target statements </summary>


Creating and verifying `statements` for image target `busybox:latest`.

> Note `statements` verification is not PKI based

```bash
# Create SBOM statement (signed SBOMS)
gensbom busybox:latest -o statement

# Create SLSA Provenance statement
gensbom busybox:latest -o statement-slsa

``` 

Verifying statements for images,
```bash
# Verify SBOM statement (signed SBOMS)
gensbom verify busybox:latest -o statement

# Verify SLSA Provenance statement
gensbom verify busybox:latest -i statement-slsa
``` 
</details>

<details>
  <summary> Git targets statements </summary>

Creating, and verifying `statements` for git repo target `https://github.com/mongo-express/mongo-express.git`.

> Note `statements` verification is not PKI based

```bash
# Create SBOM attestations (signed SBOMS)
gensbom git:https://github.com/mongo-express/mongo-express.git -o attest

# Create SLSA Provenance attestations
gensbom git:https://github.com/mongo-express/mongo-express.git -o attest-slsa

``` 

Verifying attestation for git repo target,

```bash
# Verify SBOM attestations (signed SBOMS)
gensbom verify git:https://github.com/mongo-express/mongo-express.git -o attest

# Verify SLSA Provenance attestations
gensbom verify git:https://github.com/mongo-express/mongo-express.git -i attest-slsa
```
</details>

## OCI storage
Gensbom supports both storage and verification flows for `attestations`  and `statement` objects utilizing OCI registry as an evidence store.

Using OCI registry as an evidence store allows you to upload and verify evidence across your supply chain in a seamless manner.

### Before you begin
Evidence can be stored in any accusable registry,
Write access is required for upload as well as Read access is for download.

You must first login with the required access to your registry before you calling Gensbom.

### Basic usage
```bash
# Generating evidence, storing on [my_repo] OCI repo.
gensbom [target] -o [attest, statement, attest-slsa,statement-slsa] --oci --oci-repo=[my_repo]

# Verifying evidence, pulling attestation from [my_repo] OCI repo.
gensbom verify [target] -i [attest, statement, attest-slsa,statement-slsa] --oci --oci-repo=[my_repo]
```

> For image targets **only** you may attach the evidence in the same repo as the image.

```bash
gensbom [image] -o [attest, statement, attest-slsa,statement-slsa] --oci

gensbom verify [image] -i [attest, statement, attest-slsa,statement-slsa] --oci
```

## Configuration
Use default configuration path `.gensbom.yaml`, or provide a custom path using `--config` flag.

See detailed [configuration](docs/configuration.md)

# Cosign support 
[Cosign](https://github.com/sigstore/cosign) is and awesome tool that  aims to make signatures invisible infrastructure.
Gensbom supports integration with the awesome `cosign` cli tool and other `sigstore` verification process.

<details>
  <summary> Cyclonedx verification using cosign </summary>

One can use `gensbom` to generate the `cyclonedx` attestation and attach it to OCI registry, you can then use `cosign` to verify the attestation.

> Attestations are pushed to OCI for cosign to consume.

```bash
# Generate sbom attestation
gensbom [image] -o attest -f --oci

# Verify attestation using cosign 
COSIGN_EXPERIMENTAL=1 cosign verify-attestation [image] --type cyclonedx
```
</details>

<details>
  <summary> SLSA verification using cosign </summary>

One can use `gensbom` to generate the `slsa` attestation and attach it to OCI registry, you can then use `cosign` to verify the attestation.

> Attestations are pushed to OCI for cosign to consume.

```bash
# Generate sbom attestation
gensbom [image] -o attest-slsa -f --oci

# Verify attestation using cosign 
COSIGN_EXPERIMENTAL=1 cosign verify-attestation [image] --type slsaprovenance
```
</details>

<details>
  <summary> Signing and verification using cosign </summary>

One can create predicates for any attestation format (`sbom`, `slsa`), you then can use `cosign` to verify the attestation.

> Example uses keyless (sigstore) flow, you may use any `cosign` signer/verifer supported.

```bash
# Generate sbom predicate
gensbom [image] -o predicate -f --output-file gensbom_predicate.json

# Sign and OCI store using cosign
COSIGN_EXPERIMENTAL=1 cosign attest --predicate gensbom_predicate.json [image] --type https://scribesecurity.com/predicate/cyclondex

# Verify attestation using cosign 
COSIGN_EXPERIMENTAL=1 cosign verify-attestation [image]
```
</details>

# Scribe service
Scribe provides a set of services allowing you to secure your supply chain. \
Use configuration/args to set `scribe.client-id` (`-U`), `scribe.client-secret` (`-P`) provided by scribe.
Lastly enable scribe client using `-E` flag.
Gensbom will upload/download sboms to your scribe account.

# Subtools
Gensbom uses some external tools, libraries, and packages to achieve its goal.

- Syft - CLI tool for generating a Software Bill of Materials (SBOM) from container images and filesystem. \
  [https://github.com/anchore/syft]
- Cyclonedx-go - CycloneDX module for Go creates a valid CycloneDX bill-of-material document. \
  [https://github.com/ozonru/cyclonedx-go]
- Cocosign - uses the awesome **sigstore** framework and specificly **sigstore/cosign** libraries for signing and verifying attestations. \
  [https://github.com/sigstore/cosign]
  [https://github.com/sigstore]

