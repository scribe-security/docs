---
title: Gensbom
author: mikey strauss - Scribe
date: April 5, 2021
geometry: margin=2cm
---

# 🚀 Gensbom - bill of material report CLI tool

Gensbom is a CLI tool by Scribe which analyzes components and creates sboms. \
Gensbom sboms are populated cyclondex sbom with target packages, files, layers, commits and dependancies. \
Gensbom also supports signed sbom or SLSA provenance as populated Intoto attestations using the cocosign framework.

# Overview

### Image target
Gensbom supports analysis of image targets, \
Image formats supported are currently docker manifest v2 and OCI. \
Image sources supported are docker-daemon, OCI storage, docker archive, OCI archive.

### Directory/file target
Gensbom supports analysis of directory/file targets.

### GIT target
Gensbom supports analysis of remote/local git repository targets.

### Formats
Gensbom supports the following formats.
Bom command also supports multi-choice when generating a bom.
- Cyclonedx - json, xml
- In-toto statements - BOM, SLSA Provenance
- In-toto predicate - BOM, SLSA Provenance
- In-toto attestations - BOM, SLSA Provenance

### BOM details
Bom includes a large amount of analysed data for each target. \
Gensbom allows you to select which groups you like to include (TBD not imp). 

- Target metadata: details on the target and its context.
- Layer group: (image targets only).
- Package group - currently supporting debian, apk, python, go, ruby, npm, rpm, java, rust.
- File group: details on all files in target.
- Commit group: details on all commits in the git repository's branch.
- Dependancies
-  - Image->Layer: Image and its related layers.
-  - Layer->Pkg: Layer and its related packages.
-  - Pkg->File: pkgs and there related files.
-  - Repo->Commit: git repository and its related commits.
-  - Commit->File: git commit and its related files.

### Gensbom context
Gensbom supports gathering of the context of the sbom creator. \
Context will be added to both sbom and attestations for further reference. \
Currently Gensbom supports `github`, `gitlab`, `jenkins`, `circleci` and `local` contexts. \
So for example sbom created/signed on a `github workflow` will add the current git url, workflow name.. etc to the sbom as well.
Gensbom collects context data based on the target:
- Image target context: image id, image name, image tag.
- Directory/file target context: dir/file path, dir/file id.
- Git target context: git repository url, git commit, git branch, git tag.

Gensbom collects additional environmental context information such as: git url, git branch, git commit, git ref, git actor.


### Subtools

Gensbom uses some external tools, libraries, packages to achieve its goal. \
Some of the heavy lifting is done by these subtools so its worth metioning.

- Syft - CLI tool for generating a Software Bill of Materials (SBOM) from container images and filesystem. \
  [https://github.com/anchore/syft]
- Cyclonedx-go - CycloneDX module for Go creates a valid CycloneDX bill-of-material document. \
  [https://github.com/ozonru/cyclonedx-go]
- Cocosign - uses the awesome **sigstore** framework and specificly **sigstore/cosign** libraries for signing and verifying attestations. \
  [https://github.com/sigstore/cosign]
  [https://github.com/sigstore]


# Attestations 
Attestations sboms allow you to sign and verify your sbom targets. \
Attestations allow you to connect PKI based identities to your evidence and policy management. 

See details [CLI documentation - attestation](docs/attestations.md)

# Installation

CLI can be installed by the following methods for linux (arm, amd64).

See details [CLI documentation - install](docs/installation.md)


# Gensbom command
Gensbom uses command line and/or a configuration file to operate. \
All flags have a default value and can be set by configuration as well (with some exceptions). \
Global flags can be set by CLI on any command. \
Flags that can not mapped to configuration are verbose, config and backwards flags.

Command analyzes image components and file systems. \
It can be used for multiple targets and output formats. \
Further more command can be used to sign the resulting sbom.

```
gensbom busybox:latest -v
```

See details [CLI documentation - gensbom](docs/command/gensbom.md)

## Configuration

Configuration can be set for CLI for all commands as well as for the global flags.
Configuration fields can be overridden by CLI, see CLI help for flags details.


See details [CLI documentation - configuration](docs/configuration.md)

## basic usage
Gensbom allows you to create sboms and SLSA provenances in multiple flavors.

<details>
  <summary> Cyclonedx </summary>

Cyclonedx sbom with all the available components.

```bash
gensbom busybox:latest -o json
gensbom busybox:latest -o xml
``` 
</details>

<details>
  <summary> Statement </summary>

Intoto statement is basically an unsigned attestation.
Creates sbom or SLSA provenance statements
Output can be useful if you like to connect to other attestation frameworks such as `cosign`.

```bash
gensbom busybox:latest -o statement
gensbom busybox:latest -o statement-slsa
``` 
</details>

<details>
  <summary> Attestations </summary>

Intoto Attestation output, default via keyless sigstore flow 

```bash
gensbom busybox:latest -o attest
gensbom busybox:latest -o statement-slsa
``` 

</details>

<details>
  <summary> Metadata only </summary>

You may select which components groups are added to your SBOM.
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
For example you may use Gensbom to include a external security report in your sbom.
```bash
gensbom busybox:latest -vv -A **/some_report.json
``` 
</details>


# Verify command
Command finds and verifies signed SBOM for image components and file systems. \
It can be used for multiple targets and output formats.

```
gensbom verify busybox:latest -v
```

See details [CLI documentation - verify](docs/command/gensbom_verify.md)


# Scribe service
Scribe provides a set of services allowing you to secure your supply chain. \
Use configuration/args to set `scribe.client-id` (`-U`), `scribe.client-secret` (`-P`) provided by scribe.
Lastly enable scribe client using `-E` flag.
Gensbom will upload/download sboms to your scribe account.

<details>
  <summary> Signing </summary>

You can use scribe signing service to sign.
Scribe will sign sbom for you and provide access to the signed attestation.
Scribe service will allow you to verify against Scribe Root CA against your account identity.
You may can use the default Scribe `cocosign` configuration flag.

**Scribe root cert \<TBD public link\> to verify against.**

```bash
gensbom busybox:latest -E --U ${CLIENT_ID} -P ${CLIENT_SECRET} -o attest -v
gensbom verify busybox:latest -E --U ${CLIENT_ID} -P ${CLIENT_SECRET} -v
```
</details>

<details>
  <summary> Integrity </summary>

You can use scribe service run  integrity policies against your evidence.


```bash
gensbom busybox:latest -E --U ${CLIENT_ID} -P ${CLIENT_SECRET} -v
```
</details>

# Dev
See details [CLI documentation - dev](docs/dev.md)
