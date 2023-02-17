---
title: Valint
author: mikey strauss - Scribe
date: April 5, 2021
geometry: margin=2cm
---

# Valint - Validate integrity of your supply chain

Valint generates and verifies evidence collected on targets and artifacts across your supply chain. <br />
Valint also allows you to store evidence locally on a remote OCI registry or using Scribe service. <br />

Target support includes directories, files, images and git repositories. <br />
While evidence types supported are CycloneDX SBOMs and SLSA provenance in both CycloneDX JSON, In-toto statement and attestation formats.

Evidence collection will automatically collect information from the Supply chain environment which allows you to reference where in your supply chain the evidence was generated, see the `environment context` section below.

Lastly, Valint allows you to sign and verify a target against the signer's identity and policy across the supply chain.

## Installing `valint`
Choose any of the following command line interface (CLI) installation options:

<details>
  <summary> Pull binary </summary>

Get the `valint` tool
```bash
curl -sSfL https://get.scribesecurity.com/install.sh  | sh -s -- -t valint
```

</details>

<details>
  <summary> Docker image </summary>

Pull the `valint` release binary wrapped in its relevant docker image. <br />
Tag value should be the requested version.

```bash
docker pull scribesecuriy.jfrog.io/scribe-docker-public-local/valint:latest
```
</details>


## Supported architecture and operating systems (OS) 
CPU Architecture 
* AMD64 (x86_64) 
* ARM64  

OS 
* Linux
* macOS 
* Windows 

## Target types
---
Each target type can be used to collect evidence on different parts of your supply chain.  <br />
For example, you can collect SBOMs for images or binaries created by your supply chain.

Target format `[scheme]:[name]:[tag]`

| Sources | scheme | Description | example
| --- | --- | --- | --- |
| Docker Daemon | docker | use the Docker daemon | docker:busybox:latest |
| OCI registry | registry | use the docker registry directly | registry:busybox:latest |
| Docker archive | docker-archive | use a tarball from disk for archives created from "docker save" | docker-archive:path/to/yourimage.tar |
| OCI archive | oci-archive | tarball from disk for OCI archives | oci-archive:path/to/yourimage.tar |
| Remote git | git | remote repository git | git:https://github.com/yourrepository.git |
| Local git | git | local repository git | git:path/to/yourrepository | 
| Directory | dir | directory path on disk | dir:path/to/yourproject | 
| File | file | file path on disk | file:path/to/yourproject/file | 

### Image Target
Images are a very common artifact for many supply chains,
from the actual application release to build/test environments run by supply chains.

Image formats supported are currently docker manifest v2 and OCI. <br />
Image sources supported are docker-daemon, image archives and direct registry access.

> By default the target search scheme assumes Docker daemon but falls back to registry when not found.

### Directory/File Target
Directories and files are common artifacts created by supply chains, 
from the actual application released, configurations or even internal build dependencies caches.

### Git Target
Git repositories are a common part of most supply chains,
a Git target allows you to collect evidence including sources, commits and packages found in your source repositories.

## Evidence formats
Valint supports the following evidence output formats and related `format` and `input-format` flags.

| Format | alias | Description | signed
| --- | --- | --- | --- |
| CycloneDX-json | json | CyclondeDX json format | no |
| predicate-CycloneDX-json | predicate | In-toto Predicate | no |
| statement-CycloneDX-json | statement | In-toto Statement | no |
| attest-CycloneDX-json | attest | In-toto Attestation | yes |
| predicate-slsa |  | In-toto Predicate | no |
| statement-slsa |  | In-toto Statement | no |
| attest-slsa |  | In-toto Attestations | yes |

## CycloneDX SBOM
The CycloneDX SBOM evidence format includes a large amount of analyzed data depending on the target and user configuration.
The following table describes the `group` types we currently support.

| Component group | Description | targets | required |
| --- | --- | --- | --- |
| Metadata (Target) | target details | all | yes |
| Layer | found layers details including `CreatedBy` command | images | no |
| Package | found packages details including `PURL` and `CPE` fields | all | no |
| Commit | target commit history deatils | git | no |
| File | found file deatils including `sha256` hash | all | no |
| Dependency | relations between components | all | no |

The following list includes the packages types we currently support:
* Debian
* Apk 
* Python
* Golang
* Ruby
* Javascript
* Rpm
* Java
* Rust

### Dependencies graph
Currently, we support the following dependencies relations.

| Type | description | targets | Parent group | Child group  |
| --- | --- | --- | --- | --- |
| Package-File | File relation to the package it belongs to | all | Package | File |
| Layers | layer relation to its target | images | Metadata | Layer |
| Package-Layer | package relation to the layer it was found on | images | Layer | Package |
| File-Layer | file relation to the layer it was found on | images | Layer | File |
| Commit | Commit history relation | git | Commit | Commit |
| Commit-File | File relation to the commit it was last edited by | git | Commit | File |

### Customizing
Following are some of the customizable features we support.
* Include only specific component groups, use `--components` to select between the group types.
* Include or exclude specific package types, use `--package-type` or `--package-exclude-type` to select a specific package type.
* Include the installed packages found (package group `install`) or the packages refrenced by sources (package group `index`), use `--package-group` to select between options.
* Exclude components, use `--filter-regex`, `--filter-scope` and `--filter-purl` to exclude any component.
* Attach any file content, use `--attach-regex` to include the content of external files.
* Include custom environments and labels, use `--env` and `--label` to attach your custom fields.

## SLSA Provenance
SLSA Provenance includes verifiable information about software artifacts describing where, when and how something was produced.
It is required for SLSA compliance level 2 and above.

See details [SLSA provenance spec](http://slsa.dev/provenance/v0.2)
See details [SLSA requirements](http://slsa.dev/spec/v0.1/requirements)

## Environment context
`environment context` collects information from the underlining environments, in which Valint is run.
Environment context is key to connecting the target evidence and the actual point in your supply chain it was created in.

The following table includes the types of environments we currently support:
| context-type | description |
| --- | --- |
| local | local endpoints |
| github | Github Actions |
| gitlab | GitLab CI/CD |
| azure | Azure Pipelines |
| bitbucket | Bitbucket pipelines |
| circle | CircleCI workflows |
| travis | Travis CI workflows |
| jenkins | Jenkins declarative pipelines |

For example, evidence created on `Github Actions` will include the workflow name, run id, event head commit and so on.

## Attestations 
In-toto Attestations are a standard that defines a way to authenticate metadata describing a set of software artifacts.
Attestations standard formalizes signing but also are intended for consumption by automated policy engines.

The following table includes the formats supported by the verification command.

| Format | alias | Description | signed
| --- | --- | --- | --- |
| statement-CycloneDX-json | statement | In-toto Statement | no |
| attest-CycloneDX-json | attest | In-toto Attestation | yes |
| statement-slsa |  | In-toto Statement | no |
| attest-slsa |  | In-toto Attestations | yes |

Select default the configuration using `--attest.default` flag. <br />
Select a custom configuration by providing `cocosign` field in the [configuration](docs/configuration.md) or custom path using `--attest.config`.

> Note the unsigned evidence are still valuable for policy consumption regardless of them not being signed cryptographically.

See details [In-toto spec](https://github.com/in-toto/attestation) <br />
See details [attestations](docs/attestations.md)

# CLI - Use Valint as a command line tool

## Evidence Generator - `bom` command
`bom` command allows you to generate SBOMs and SLSA provenances in multiple flavors and targets. <br />
Evidence can be tailor-made to fit your supply chain policies and transparency needs.

> By default, the evidence is written to `~/.cache/valint/`, use `--output-file` or `--output-directory` to customize the evidence output location. 

### Usage
```shell
valint bom [scheme]:[name]:[tag]
```

See details [CLI documentation - valint](docs/command/valint.md)

### Examples
<details>
  <summary> CycloneDX SBOM </summary>

CycloneDX SBOM with all the available components.

> Note `-o`, `--format` default is `cyclonedx-json` which alias is also `json`.

```bash
# Create a CycloneDX SBOM for busybox image.
valint bom busybox:latest

# Create a CycloneDX SBOM for mongo remote git repository
valint bom git:https://github.com/mongo-express/mongo-express.git
``` 
</details>

<details>
  <summary> Statement </summary>

Creates In-toto statements evidence.

> Output can be useful with integration with other attestation frameworks such as `cosign`.

```bash
# Create a CycloneDX SBOM statement for busybox image.
valint bom busybox:latest -o statement

# Create a SLSA Provenance statement for busybox image.
valint bom busybox:latest -o statement-slsa

# Create a CycloneDX SBOM statement for mongo remote git repository
valint bom git:https://github.com/mongo-express/mongo-express.git -o statement

# Create a SLSA Provenance statement for mongo remote git repository.
valint bom git:https://github.com/mongo-express/mongo-express.git -o statement-slsa
``` 
</details>

<details>
  <summary> Attestations </summary>

Creates In-toto Attestation evidence.
 n output.

> By default, *Valint* is using [Sigstore](https://www.sigstore.dev/ "Sigstore") interactive flow as the engine behind the signing mechanism.

```bash
# Create a CycloneDX SBOM attestation for busybox image.
valint bom busybox:latest -o attest

# Create a SLSA Provenance attestation for busybox image.
valint bom busybox:latest -o attest-slsa

# Create a CycloneDX SBOM attestation for mongo remote git repository
valint bom git:https://github.com/mongo-express/mongo-express.git -o attest

# Create a SLSA Provenance attestation for mongo remote git repository.
valint bom git:https://github.com/mongo-express/mongo-express.git -o attest-slsa
``` 
</details>

<details>
  <summary> Custom component group (SBOM) </summary>

Using `--components` You may select which component groups are added to your SBOM.

> Note metadata is required.

```bash
# Include only target metadata
valint bom mongo-express:latest --components metadata

# Include only packages information
valint bom mongo-express:latest --components packages

# Include packages files and there respective relations
valint bom mongo-express:latest --components packages,files,dep
``` 
</details>

<details>
  <summary> Attaching external reports (SBOM) </summary>

Using `--attach-regex`, `-A` you may attach external files as part of the SBOM evidence.

For example, you may use this feature to include an external security report in your SBOM.

```bash
valint bom busybox:latest -vv -A **/some_report.json
``` 
</details>

## Evidence verification - `verify` command
`verify` command allows one to verify the target and its respective evidence. 

The verification flow includes two parts, the first is a PKI and identity verification on the evidence the second is a policy based verification.

Verification flow for `attestations` which are signed evidence formats includes PKI and identity verification as well as policy verification. <br />
Verification flow for `statements` that are unsigned evidence includes policy verification only. <br />

> Evidence must be available locally (on disc), remotly on a OCI registry or through Scribe service.

> By default, the evidence is read from `~/.cache/valint/`, use `--output-file` or `--output-directory` to customize the evidence output location.

### Usage
```bash
# Use `bom` command to generate one of the supported formats.
valint bom [scheme]:[name]:[tag] -o [attest, statement, attest-slsa, statement-slsa]

# Use `verify` command to verify the target against the evidence
valint verify [scheme]:[name]:[tag] -i [attest, statement, attest-slsa, statement-slsa]
```

See details [CLI documentation - verify](docs/command/gensbom_verify.md)

## OCI storage
Valint supports both storage and verification flows for `attestations`  and `statement` objects utilizing OCI registry as an evidence store.

Using OCI registry as an evidence store allows you to upload and verify evidence across your supply chain in a seamless manner.

### Before you begin
Evidence can be stored in any accusable registry,
Write access is required for upload.Read access is required for download.

You must first login with the required access privileges to your registry before calling Valint.

### Usage
```bash
# Generating evidence, storing on [my_repo] OCI repo.
valint bom [target] -o [attest, statement, attest-slsa,statement-slsa] --oci --oci-repo=[my_repo]

# Verifying evidence, pulling attestation from [my_repo] OCI repo.
valint verify [target] -i [attest, statement, attest-slsa,statement-slsa] --oci --oci-repo=[my_repo]
```

> For image targets **only** you may attach the evidence in the same repo as the image.

```bash
valint bom [image] -o [attest, statement, attest-slsa,statement-slsa] --oci

valint verify [image] -i [attest, statement, attest-slsa,statement-slsa] --oci
```

## Configuration
Use the default configuration path `.valint.yaml`, or provide a custom path using `--config` flag.

See detailed [configuration](docs/configuration.md)

# Cosign support 
[Cosign](https://github.com/sigstore/cosign) is an innovative tool that aims to make signatures an invisible infrastructure.
Valint supports integration with the awesome `cosign` cli tool and other parts of the `sigstore` verification process.

<details>
  <summary> CycloneDX verification using cosign </summary>

One can use `valint` to generate the `CycloneDX` attestation and attach it to OCI registry, you can then use `cosign` to verify the attestation.

> Attestations are pushed to OCI for cosign to consume.

```bash
# Generate sbom attestation
valint bom [image] -vv -o attest -f --oci

# Verify attestation using cosign 
COSIGN_EXPERIMENTAL=1 cosign verify-attestation [image] --type CycloneDX
```
</details>

<details>
  <summary> SLSA verification using cosign </summary>

One can use `valint` to generate the `slsa` attestation and attach it to OCI registry, you can then use `cosign` to verify the attestation.

> Attestations are pushed to OCI for cosign to consume.

```bash
# Generate sbom attestation
valint bom [image] -vv -o attest-slsa -f --oci

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
valint bom [image] -vv -o predicate -f --output-file gensbom_predicate.json

# Sign and OCI store using cosign
COSIGN_EXPERIMENTAL=1 cosign attest --predicate gensbom_predicate.json [image] --type https://scribesecurity.com/predicate/cyclondex

# Verify attestation using cosign 
COSIGN_EXPERIMENTAL=1 cosign verify-attestation [image]
```
</details>

## Scribe service integration
Scribe provides a set of services to store, verify and manage the supply chain integrity. <br />
Following are some integration examples.

## Before you begin
Integrating Valint with the Scribe Service requires the following credentials that are found in the product setup dialog (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **Home>Products>[$product]>Setup**)

* **Product Key**
* **Client ID**
* **Client Secret**

> Note that the product key is unique per product, while the client ID and secret are unique for your account.
> Note that the Scribe Hub generated Product key is optional. You can generate your own string as a unique identification of the product.

> Note the flag set:
>* `-U`, `--scribe.client-id`
>* `-P`, `--scribe.client-secret`
>* `-E`, `--scribe.enable`

## Procedure

* Install `valint` tool using the following command
```bash
curl -sSfL https://get.scribesecurity.com/install.sh | sh -s -- -t valint
```

As an example use the following commands

```bash
valint bom busybox:latest -E \
  --product-key $PRODUCT_KEY \
  -U $SCRIBE_CLIENT_ID \
  -P $SCRIBE_CLIENT_SECRET
```

<details>
  <summary>  Scribe integrity </summary>

Full command examples, upload evidence on source and image to Scribe. <br />
Verifying the target integrity on Scribe.

```bash
git clone -b v1.0.0-alpha.4 --single-branch https://github.com/mongo-express/mongo-express.git mongo-express-scm

valint bom dir:mongo-express-scm -E \
  --product-key $PRODUCT_KEY \
  -U $SCRIBE_CLIENT_ID \
  -P $SCRIBE_CLIENT_SECRET

valint bom mongo-express:1.0.0-alpha.4 -E \
  --product-key $PRODUCT_KEY \
  -U $SCRIBE_CLIENT_ID \
  -P $SCRIBE_CLIENT_SECRET
```
</details>


## Basic examples
<details>
  <summary>  Public registry image (SBOM) </summary>

Create SBOM for remote `busybox:latest` image.

```bash
valint bom busybox:latest
``` 

</details>

<details>
  <summary>  Docker built image (SBOM) </summary>

Create SBOM for image built by local docker `image_name:latest` image.

```bash
docker build . -t image_name:latest
valint bom image_name:latest
``` 
</details>

<details>
  <summary>  Private registry image (SBOM) </summary>

Create SBOM for images hosted by a private registry.

> `docker login` command is required to enable access the private registry.

```bash
docker login
valint bom scribesecuriy.jfrog.io/scribe-docker-local/stub_remote:latest
```
</details>

<details>
  <summary>  Custom metadata (SBOM) </summary>

Custom metadata added to SBOM.

```bash
export test_env=test_env_value
valint bom busybox:latest --env test_env --label test_label
```
</details>


<details>
  <summary> Custom evidence location (SBOM, SLSA) </summary>

Use flags `--output-directory` or `--output-file` flags to set the default location.

```bash
# Save evidence to custom path
valint bom busybox:latest --output-file my_sbom.json
ls -lh my_sbom.json

# Change evidence cache directory 
valint bom busybox:latest --output-directory ./my_evidence_cache
ls -lhR my_evidence_cache
``` 
</details>

<details>
  <summary> Docker archive image (SBOM) </summary>

Create SBOM for local `docker save ...` output.

```bash
docker save busybox:latest -o busybox_archive.tar
valint bom docker-archive:busybox_archive.tar
``` 
</details>

<details>
  <summary> Directory target (SBOM) </summary>

Create SBOM for a local directory.

```bash
mkdir testdir
echo "test" > testdir/test.txt

valint bom dir:testdir
``` 
</details>


<details>
  <summary> Git target (SBOM) </summary>

Create SBOM for `mongo-express` remote git repository.

```bash
valint bom git:https://github.com/mongo-express/mongo-express.git
``` 

Create SBOM for `yourrepository` local git repository.

```bash
git clone https://github.com/yourrepository.git
valint bom git:yourrepository
``` 

</details>

<details>
  <summary> Attest target (SBOM) </summary>

Create and sign SBOM targets. <br />

> By default, *Valint* is using [Sigstore](https://www.sigstore.dev/ "Sigstore") interactive flow as the engine behind the signing mechanism.

```bash
valint bom busybox:latest -o attest
``` 
</details>

<details>
  <summary> Attest target (SLSA) </summary>

Create and sign SLSA targets. <br />

> By default, *Valint* is using [Sigstore](https://www.sigstore.dev/ "Sigstore") interactive flow as the engine behind the signing mechanism.

```bash
valint bom busybox:latest -o attest-slsa
``` 
</details>

<details>
  <summary> Attest and verify image target (SBOM) </summary>

Generating and verifying CycloneDX SBOM `attestation` for image target `busybox:latest`.

> By default, *Valint* is using [Sigstore](https://www.sigstore.dev/ "Sigstore") interactive flow as the engine behind the signing mechanism.

```bash
# Create CycloneDX SBOM attestations
valint bom busybox:latest -o attest

# Verify CycloneDX Provenance attestations
valint verify busybox:latest
```
</details>

<details>
  <summary> Attest and verify image target (SLSA) </summary>

Generating and verifying SLSA Provenance `attestation` for image target `busybox:latest`.

> By default, *Valint* is using [Sigstore](https://www.sigstore.dev/ "Sigstore") interactive flow as the engine behind the signing mechanism.

```bash
# Create SLSA Provenance attestations
valint bom busybox:latest -vv -o attest-slsa

# Verify SLSA Provenance attestations
valint verify busybox:latest -i attest-slsa
```
</details>

<details>
  <summary> Attest and verify directory target (SBOM) </summary>

Generating and verifying SLSA Provenance `attestation` for directory target.

> By default, *Valint* is using [Sigstore](https://www.sigstore.dev/ "Sigstore") interactive flow as the engine behind the signing mechanism.

```bash
mkdir testdir
echo "test" > testdir/test.txt

# Create CycloneDX SBOM attestations
valint bom dir:testdir -vv -o attest

# Verify CycloneDX SBOM attestations
valint verify dir:testdir
```
</details>

<details>
  <summary> Attest and verify Git repository target (SBOM) </summary>

Generating and verifying `statements` for remote git repo target `https://github.com/mongo-express/mongo-express.git`.

```bash
valint bom git:https://github.com/mongo-express/mongo-express.git -o attest
valint verify git:https://github.com/mongo-express/mongo-express.git
``` 

Or for a local repository
```bash
# Cloned a local repository
git clone https://github.com/mongo-express/mongo-express.git

# Create CycloneDX SBOM attestations
valint bom git:https://github.com/mongo-express/mongo-express.git -o attest

# Verify CycloneDX SBOM attestations
valint verify git:https://github.com/mongo-express/mongo-express.git
```
</details>


<details>
  <summary> Store evidence on OCI (SBOM,SLSA) </summary>

Store any evidence on any OCI registry. <br />
Support storage for all targets and both SBOM and SLSA evidence formats.

> Use `-o`, `format` to select between supported formats. <br />
> Write permission to `--oci-repo` value is required. 

```bash
# Login to registry
docker login $

# Generate and push evidence to registry
valint bom busybox:latest -o [attest, statement, attest-slsa, statement-slsa] --oci --oci-repo $REGISTRY_URL

# Pull and validate evidence from registry
valint verify busybox:latest -o [attest, statement, attest-slsa, statement-slsa] --oci --oci-repo $REGISTRY_URL -f
```
> Note `-f` in the verification command, which skips the local cache evidence lookup.

</details>

# External frameworks
Valint uses some external tools, libraries, and packages to achieve its goal.

- Syft - CLI tool for generating a Software Bill of Materials (SBOM) from container images and filesystem.
  - [Syft](https://github.com/anchore/syft)
- CycloneDX-go - CycloneDX module for Go creates a valid CycloneDX bill-of-material document.
  - [CycloneDX](https://github.com/ozonru/CycloneDX-go)
- Cocosign - uses the awesome **sigstore** framework and specificly **sigstore/cosign** libraries for signing and verifying attestations. <br />
  - [cosign](https://github.com/sigstore/cosign) <br />
  - [sigstore](https://github.com/sigstore)

## Support

If you'd like help with deploying or using Valint, or you have an issue or a feature request, please 
[Contact-us](https://scribesecurity.com/contact-us/) By email or Slack.

If you are reporting an issue, please include:

- the version of the pipe
- relevant logs and error messages
- steps to reproduce

