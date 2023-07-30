---
sidebar_label: "Valint's CLI"
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

### Installing `valint`
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

#### Supported architecture and operating systems (OS)

| CPU Architecture  | OS | 
| --- | --- |
| AMD64 (x86_64) | Linux, Windows, Mac |
| ARM64 | Linux, Windows, Mac |

### High level digram 
<img src='../../../img/cli//valint_high_level.jpg' alt='Valint high level' width='80%' min-width='600px'/>

<img src='../../../img/cli/valint_support_table.jpg' alt='Valint support table' width='80%' min-width='600px'/>

### Platform digram 
<img src='../../../img/cli//module_digram.jpg' alt='Platform Digram' width='80%' min-width='600px'/>

<img src='../../../img/cli/platform_table.jpg' alt='Platform table' width='80%' min-width='600px'/>

### Policy engine
At the heart of Valint lies the `policy engine`, which enforces a set of policies on the `evidence` produced by your supply chain. The policy engine accesses different `evidence stores` to retrieve and store `evidence` for compliance verification throughout your supply chain. <br />
Each `policy` proposes to enforce a set of policy modules your supply chain must comply with. 

> For more details on policies, see [polices](#policies) section.

### Evidence
Evidence can refer to metadata collected about artifacts, reports, events or settings produced or provided to your supply chain.
Evidence can be either signed (attestations) or unsigned (statements).

> For SBOM evidence details, see [SBOM](#cyclonedx-sbom)
> FOr SLSA Provenance, See [SLSA](./slsa.md) documentation.

> For target details, see [targets](#target-types) section.

> For signing details, see [attestations](#attestations) section.

### Evidence formats
Valint supports the following evidence formats.


#### `valint bom` format support
| Format | alias | Description | signed |
| --- | --- | --- | --- |
| cyclonedx-json | json | CyclondeDX json format | no |
| statement-cyclonedx-json | statement | In-toto CyclondeDX Statement | no |
| attest-cyclonedx-json | attest | In-toto CyclondeDX Attestation | yes |
| statement-generic |  | In-toto Generic Statement | no |
| attest-generic |  | In-toto Generic Attestations| yes |
| statement-slsa |  | ** DEPRECATED ** In-toto SLSA Provenance Statement | no |
| attest-slsa |  | ** DEPRECATED **  In-toto SLSA Provenance Attestation | yes |

> Select using `bom` command `-o`, `--format` flag.

#### `valint slsa` format support
| Format | alias | Description | signed |
| --- | --- | --- | --- |
| statement-slsa | statement | In-toto SLSA Provenance Statement | no |
| attest-slsa | attest |  In-toto SLSA Provenance Attestation | yes |

> Select using `slsa` command `-o`, `--format` flag.

### Environment context
`environment context` collects information from the underlining environments, in which Valint is run.

Environment context is key to connecting the evidence and the actual point in your supply chain they where created by.
Given an artifact to the Valint assumes the context of the artifact (`target`) it is provided, In other words, the identifiers of the artifact are included in the context `environment context`.

On the verification flow the current `environment context` is provided to the policy engine, which is the key to defining relative requirements between different points in the supply chain.

For example, verification done in Github Actions can refer to policy requirements that apply to the current run number.
Another example, verification done on a binary can refer to requirements that apply to the hash of the binary.


### Origin context
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
| jenkins | Jenkins declarative or scripted pipelines |


The following fields are collected from any supported environment.

| Field | Description | 
| --- | --- | 
| context_type | Environment type | 
| git_url | Environment provided git url |
| git_branch | Environment provided git branch |
| git_commit | Environment provided git commit |
| git_tag | Environment provided git tag |
| git_ref | Environment provided git ref |
| workflow | Environment workflow |
| job_name | Environment Job name |
| actor | Environment provided actor |
| build_num | Environment build num |


### Subject context
The following fields are collected from any supported artifact (`target`).

| Field | Description | Target | values |
| --- | --- | --- | --- |
| content_type | Target Evidence Format (CLI) value of flags`--format`, `--input-format` | All | 
| name | Product key (CLI) - value of flag `--product-key` | All |
| sbomgroup | Target SBOM group - `image, directory, file, git` | All |
| sbomname |  Target SBOM name | All |
| sbomversion | Target SBOM name  | All |
| sbompurl |  Target SBOM name  | All |
| sbomhashs |  Target SBOM hashs (list of hashs)  |  All |
| input_scheme | User input scheme (CLI) - value from target `scheme:target:tag` | All |
| input_name | User input name (CLI) - value from target `scheme:target:tag` | All |
| input_tag | User input tag (CLI) - value from target `scheme:target:tag` | All |
| imageID | Target image ID | image |
| repoDigest | Target repo digest (list) | image |
| imageTag | Target image tags (list) | image |
| image_name | Target image name | image |
| dir_id | Target sha256 hash | directory
| dir_path | Target path | directory |
| file_id | Target sha256 hash | file |
| file_path | Target path | file | 
| target_git_url | Target provided git url | git |
| target_git_branch | Target provided git branch | git |
| target_git_commit | Target provided git commit | git |
| target_git_tag | Target provided git tag | git |
| target_git_ref | Target provided git ref | git |

> `content type` is set by the `--format` or `--input-format` flag it supports the following types.

| content_type | 
| --- |
| cyclonedx-json |
| statement-cyclonedx-json | 
| attest-cyclonedx-json | 
| statement-slsa |
| attest-slsa |
| statement-generic |
| attest-generic |

### Evidence Stores table
Each storer can be used to store, find and download evidence, unifying all the supply chain evidence into a system is an important part to be able to query any subset for policy validation.

| Type  | Description | requirement |
| --- | --- | --- |
| cache | Evidence is stored locally | access to a directory |
| OCI | Evidence is stored on a remote OCI registry | access to a OCI registry |
| scribe | Evidence is stored on scribe service | scribe credentials |

> For details, see [evidence stores](#evidence-stores) section

### Policies
---
Each `policy` proposes to enforce a set of requirements your supply chain must comply with. Policies reports include valuations, compliance details, verdicts as well as references to provided `evidence`. <br />
Policy configuration can be set under the main configuration `policies` section.

Each `policy` consists of a set of `policy modules` that your supply chain must comply with. 
A `policy` is verified if ALL required `modules` in are evaluated and verified. A `module` is verified if ANY `evidence` is found that complies with the `module` configuration and setting.

> For details, see [Policies](./policies.md) section

> For configuration details, see [configuration](docs/configuration) section.

> For PKI setting, see [attestations](#attestations) section.

### Target types
---
Target types are types of artifacts produced and consumed by your supply chain.
Using supported targets, you can collect evidence and verify compliance on a range of artifacts.

### Format

`[scheme]:[name]:[tag]` 

| Sources | target-type | scheme | Description | example
| --- | --- | --- | --- | --- |
| Docker Daemon | image | docker | use the Docker daemon | docker:busybox:latest |
| OCI registry | image | registry | use the docker registry directly | registry:busybox:latest |
| Docker archive | image | docker-archive  | use a tarball from disk for archives created from "docker save"| docker-archive:path/to/yourimage.tar |
| OCI archive | image | oci-archive | tarball from disk for OCI archives | oci-archive:path/to/
yourimage.tar |
| Podman daemon | image | podman | Use the Podman daemon | podman:busybox:latest |
| Remote git | git| git | remote repository git | git:https://github.com/yourrepository.git |
| Local git | git | git | local repository git | git:path/to/yourrepository | 
| Directory | dir | dir | directory path on disk | dir:path/to/yourproject | 
| File | file | file | file path on disk | file:path/to/yourproject/file | 

### Image type
Images are a very common artifact for many supply chains,
from the actual application release to build/test environments run by supply chains.

Image formats supported are currently docker manifest v2 and OCI. <br />
Image sources supported are docker-daemon, image archives and direct registry access.

> By default the target search scheme assumes Docker daemon but falls back to registry when not found.

### Directory type
Directories are common artifacts created by supply chains, 
from the actual application releases, configurations or even internal build dependencies caches.

### File type
File are common artifacts created by supply chains, 
from the actual application releases, configurations or binaries.

### Git type
Git repositories are a common part of most supply chains,
a Git target allows you to collect evidence including sources, commits and packages found in your source repositories.

### Evidence Stores
Each Evidence store can be used to store, find and download evidence, which unifies all the evidence collected from the supply chain into a unified system.

### Scribe Evidence store
Scribe evidence store allows you to store evidence using scribe Service.

Related Flags:
> Note the flag set:
>* `-U`, `--scribe.client-id`
>* `-P`, `--scribe.client-secret`
>* `-E`, `--scribe.enable`

### Before you begin
Integrating Scribe Hub with your environment requires the following credentials that are found on the **Integrations** page. (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **integrations**)

* **Client ID**
* **Client Secret**

<img src='../../../img/ci/integrations-secrets.jpg' alt='Scribe Integration Secrets' width='70%' min-width='400px'/>

### Usage
```bash
# Generating evidence, storing in scribe service.
valint bom [target] -o [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] \
  -E \
  -U [SCRIBE_CLIENT_ID] \
  -P [SCRIBE_CLIENT_SECRET]

# Verifying evidence, pulling attestation from scribe service.
valint verify [target] -i [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] \
  -E \
  -U [SCRIBE_CLIENT_ID] \
  -P [SCRIBE_CLIENT_SECRET]
```


### OCI Evidence store
Admission supports both storage and verification flows for `attestations` and `statement` objects utilizing OCI registry as an evidence store.

Using OCI registry as an evidence store allows you to upload, download and verify evidence across your supply chain in a seamless manner.

Related flags:
* `--oci` Enable OCI store.
* `--oci-repo` - Evidence store location.


### Docker hub limitation
Docker hub does not support the subpath format, `oci-repo` should be set to your Docker hub Username.

> Some registries like Jfrog allow multi layer format for repo names such as , `my_org.jfrog.io/policies/attestations`.

### OCI Repo flag
`oci-repo` setting indicates the location in a registry under which the evidence are stored.
It must be a dedicated location in an OCI registry.
for example, `scribesecuriy.jfrog.io/my_docker-registry/evidence`.

### Before you begin
Evidence can be stored in any accusable registry.
* Write access is required for upload (generate).
* Read access is required for download (verify).

You must first log in with the required access privileges to your registry before calling Valint.
For example, using the `docker login` command.

### Usage
```bash
# Generating evidence, storing on [my_repo] OCI repo.
valint bom [target] -o [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] --oci --oci-repo=[my_repo]

# Verifying evidence, pulling attestation from [my_repo] OCI repo.
valint verify [target] -i [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] --oci --oci-repo=[my_repo]
```

> For image targets **only** you may attach the evidence in the same repo as the image.

```bash
valint bom [image] -o [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] --oci

valint verify [image] -i [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] --oci
```

> For related Cosign support, see [cosign ](#-cosign-support) section.

### Cache Evidence store
Valint supports both storage and verification flows for `attestations` and `statement` objects utilizing a local directory as an evidence store.
This is the simplest form and is mainly used to cache previous evidence creation. 

Related flags:
* `--cache-enable`
* `--output-directory`
* `--force`

> By default, this cache store enabled, disable by using `--cache-enable=false`

### Usage
```bash
# Generating evidence, storing on [my_dir] local directory.
valint bom [target] -o [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] --output-directory=[my_dir]

# Verifying evidence, pulling attestation from [my_dir] local directory.
valint verify [target] -i [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] --output-directory=[my_dir]
```

> By default, the evidence is written to `~/.cache/valint/`, use `--output-file` or `-d`,`--output-directory` to customize the evidence output location. 

### CycloneDX SBOM
The CycloneDX SBOM evidence format includes a large amount of analyzed data depending on the target and user configuration.
The following table describes the `group` types we currently support.

| Component group | Description | targets | required |
| --- | --- | --- | --- |
| Metadata (Target) | target details | all | yes |
| Layer | found layers details including `CreatedBy` command | images | no |
| Package | found packages details including `PURL` and `CPE` fields | all | no |
| Commit | target commit history details | git | no |
| File | found file details including `sha256` hash | all | no |
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
* R

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
* Include the installed packages found (package group `install`) or the packages referenced by sources (package group `index`), use `--package-group` to select between options.
* Exclude components, use `--filter-regex`, `--filter-scope` and `--filter-purl` to exclude any component.
* Attach any file content, use `--attach-regex` to include the content of external files.
* Include custom environments and labels, use `--env` and `--label` to attach your custom fields.

### SLSA Provenance
SLSA Provenance includes verifiable information about software artifacts describing where, when and how something was produced.
It is required for SLSA compliance level 2 and above.

See details [SLSA provenance spec](http://slsa.dev/provenance/v0.2)
See details [SLSA requirements](http://slsa.dev/spec/v0.1/requirements)

For example, evidence created on `Github Actions` will include the workflow name, run id, event head commit and so on.

### Generic evidence
Generic evidence includes custom 3rd party verifiable information containing any required compliance requirements.
Generic evidence allows users to include any file as evidence or attestation (signed) hooking in 3rd party tools.
Allowing more robust and customizable policies to fit your needs.

For example, Attesting to License scanner report can enable you to enforce licensing requirements as part of your build pipeline.

### Usage: 
Attach a generic evidence
`valint bom <file_path> -o [statement-generic, attest-generic] [FLAGS]`

Verify a generic evidence artifact
`valint verify <file_path> -i [statement-generic, attest-generic] [FLAGS]`

Using the following flags, <br />
* `--predicate-type`: Customize the predicate type of the evidence, which must be a valid URI (optional) <br />
Default value is `http://scribesecurity.com/evidence/generic/v0.1`. 

* `--compress`: Compress content (optional)

For Example, using Trivy SARIF report as evidence.
```bash
valint bom report.sarif -o attest-generic -p https://aquasecurity.github.io/trivy/v0.42/docs/configuration/reporting/#sarif
```

### Scribe Predicate types
KNOWN predicates types allow the generic evidence to be further analyzed by Scribe service.

The following table are the KNOWN predicate types we recommend using,

| predicate-type | file-format | tool |
| --- | --- | --- |
|  https://aquasecurity.github.io/trivy/v0.42/docs/configuration/reporting/#sarif <br /> https://aquasecurity.github.io/trivy/v0.42/docs/configuration/reporting/#json | sarif <br /> json | trivy |
|  http://docs.oasis-open.org/sarif/sarif/v2.1.0 | sarif | CodeQL |
|  https://cyclonedx.org/bom | CycloneDX | Syft | 
|  https://slsa.dev/provenance/v0.2 | Intoto-predicate, Intoto-Statement | Cosign | 

#### Trivy integration
Install Trivy's latest version.

Run the following command to export a Sarif report.
```bash
trivy image --format sarif -o report.sarif  golang:1.12-alpine
```

Run the following Valint command to add the report as evidence to the Scribe Service.
```bash
valint bom report.sarif --predicate-type http://docs.oasis-open.org/sarif/sarif/v2.1.0 -o  [attest-generic, statement-generic] \
  -E \
  -U [SCRIBE_CLIENT_ID] \
  -P [SCRIBE_CLIENT_SECRET]
```

### Format
```json
{
  "_type": "https://in-toto.io/Statement/v0.1",
  
  "subject": [{ ... }],
  
  // Can also include any custom user defined url.
  "predicateType": <predicate-type>

  "predicate": {
    "environment": {
      <Evidence context object>
    },

    //Content Mimetype
    "mimeType": <string>,
  
    // File target content
    "content": <BASE64 content>
  }
}
```

### Attestations
In-toto Attestations are a standard that defines a way to authenticate metadata describing a set of software artifacts.
Attestations standard formalizes signing but also are intended for consumption by automated policy engines.

Default settings are available using `--attest.default` flag. <br />
Custom configuration by providing `cocosign` field in the [configuration](docs/configuration) or custom path using `--attest.config`.

The following table includes the formats supported by the verification command.

| Format | alias | Description | signed
| --- | --- | --- | --- |
| statement-cyclonedx-json | statement | In-toto Statement | no |
| attest-cyclonedx-json | attest | In-toto Attestation | yes |
| statement-slsa |  | In-toto SLSA Predicate Statement | no |
| attest-slsa |  | In-toto SLSA Predicate Attestation | yes |
| statement-generic |  | In-toto Generic Statement | no |
| attest-generic |  | In-toto Generic Attestations | yes |

> Unsigned evidence are still valuable for policy consumption regardless of them not being signed cryptographically.

> For spec details, see [In-toto spec](https://github.com/in-toto/attestation) <br />
> See signing details, see [attestations](docs/attestations)

### Extracting the predicate from attestation
You may use the following command to extract evidence from a encoded attestation file.
```bash
valint bom [target] -o [attest, attest-slsa, attest-generic] -o my_attestation.sig

cat my_attesataion.sig | jq -r '.payload' | base64 -d | jq -r '.payload' | base64 --decode | jq '.predicate' > predicate.json
```

You can further extract specific predicate field, for example for SBOM evidence (`attest`) use the following command.
```bash 
cat my_attesataion.sig | jq -r '.payload' | base64 -d | jq -r '.payload' | base64 --decode | jq '.predicate' | jq '.bom' > bom.json
```

# CLI - Use Valint as a command line tool

## Evidence Generator - `bom` command
`bom` command allows you to generate SBOMs and SLSA provenances in multiple flavors and targets. <br />
Evidence can be tailor-made to fit your supply chain policies and transparency needs.

> By default, the evidence is written to `~/.cache/valint/`, use `--output-file` or `-d`,`--output-directory` to customize the evidence output location. 

> To disable local cache, set an empty output directory - `valint bom [target] -d ""`.

### Usage
```shell
valint bom [scheme]:[name]:[tag]
```

See details [CLI documentation - valint](docs/command/valint)

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

# Create a Generic evidence statement for any_file.txt.
valint bom any_file.txt -o statement-generic

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

# Create a Generic evidence attestation for any_file.txt.
valint bom any_file.txt -o attest-generic
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
`verify` command evaluates and verifies the compliance of your supply chain against your requirements.
By default, the command verifies an artifact signature against the required identities.

The evidence verification flow includes two parts, the first is a PKI and identity verification on the evidence the second is a policy-based verification.

> For flag details, see [CLI documentation - verify](docs/command/valint_verify).

> For policy verification details, see [policies](#policies) section.

### Usage

```bash
valint verify [scheme]:[name]:[tag] -i [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] \
  --email [email] --uri [uri] --common-name [common name]
```
> Note: multiple `email`, `uri` and `common-name` can be included in command

### Examples
<details>
  <summary>  Cache store </summary>

```bash
# Use `bom` command to generate one of the supported formats.
valint bom [scheme]:[name]:[tag] -o [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic]

# Use `verify` command to verify the target against the evidence
valint verify [scheme]:[name]:[tag] -i [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic]
```
</details>

<details>
  <summary>  OCI store </summary>

```bash
# Use `bom` command to generate one of the supported formats.
valint bom [scheme]:[name]:[tag] -o [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic]

# Use `verify` command to verify the target against the evidence
valint verify [scheme]:[name]:[tag] -i [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] \
    --email [email] --uri [uri] --common-name [common name]
```
</details>

<details>
  <summary>  Scribe store </summary>

```bash
# Generating evidence, storing in scribe service.
valint bom [target] -o [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] \
  -E \
  -U [SCRIBE_CLIENT_ID] \
  -P [SCRIBE_CLIENT_SECRET]

# Verifying evidence, pulling attestation from scribe service.
valint verify [target] -i [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] \
  --email [email] --uri [uri] --common-name [common name] \
  -E \
  -U [SCRIBE_CLIENT_ID] \
  -P [SCRIBE_CLIENT_SECRET]
```
</details>

## Configuration
Use the default configuration path `.valint.yaml`, or provide a custom path using `--config` flag.

See detailed [configuration](docs/configuration)

## Cosign support 
[Cosign](https://github.com/sigstore/cosign) is an innovative tool that aims to make signatures an invisible infrastructure.
Valint supports integration with the awesome `cosign` CLI tool and other parts of the `sigstore` verification process.

<details>
  <summary> verification using cosign </summary>

One can use `valint` to generate the `CycloneDX` attestation and attach it to OCI registry, you can then use `cosign` to verify the attestation.

> Attestations are pushed to OCI by Valint for cosign to consume.

> For further details see [cosign verify-attestation](https://docs.sigstore.dev/cosign/verify/)

```bash
# Generate sbom attestation
valint bom [image] -vv -o attest -f --oci

# Verify attestation using cosign 
COSIGN_EXPERIMENTAL=1 cosign verify-attestation [image] --type cyclonedx
```
</details>


<details>
  <summary> verification using Kyverno </summary>

One can use `valint` to generate the `slsa` attestation and attach it to OCI registry, you can then use `cosign` to verify the attestation.

> Attestations are pushed to OCI by Valint for kyverno to consume.

> For further details see [kyverno verify-images](https://kyverno.io/docs/writing-policies/verify-images/sigstore/#verifying-image-signatures)

```bash
# Generate SBOM evidence statement
valint bom my_account/my_image:latest -vv -o attest -f --oci
```

```yaml 
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: check-image-keyless
spec:
  validationFailureAction: Enforce
  webhookTimeoutSeconds: 30
  rules:
    - name: check-slsa-image-keyless
      match:
        any:
        - resources:
            kinds:
              - Pod
      verifyImages:
      - imageReferences:
        - "my_account/my_image*"
        attestations:
          - predicateType: https://cyclonedx.org/bom
            attestors:
            - entries:
              - keyless:
                  subject: name@example.com
                  issuer: https://accounts.example.com
                  rekor: 
                    url: https://rekor.sigstore.dev
```

<!-- Change to issuer: https://github.com/login/oauth when signer is github -->

</details>


<details>
  <summary> Signing and verification using cosign </summary>

One can create predicates for any attestation format (`sbom`, `slsa`), you then can use `cosign` to verify the attestation.

> Example uses keyless (Sigstore) flow, you may use any `cosign` signing capability supported.

> For further details see [cosign verify-attestation](https://docs.sigstore.dev/cosign/verify/)

```bash
# Generate SBOM evidence statement
valint bom [image] -vv -o statement -f --output-file valint_statement.json

# Extract predicate
cat valint_predicate.json | jq '.predicate' > valint_predicate.json

# Sign and OCI store using cosign
COSIGN_EXPERIMENTAL=1 cosign attest --predicate  valint_predicate.json [image] --type https://scribesecurity.com/predicate/cyclondex

# Verify attestation using cosign 
COSIGN_EXPERIMENTAL=1 cosign verify-attestation [image]
```

</details>

## Basic examples
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
  <summary>  NTIA Custom metadata (SBOM) </summary>

Custom NTIA metadata added to SBOM.

```bash
valint bom busybox:latest \
      --author-name=bob \
      --author-email=bob@company.com \
      --author-phone=000 \
      --supplier-name=alice \
      --supplier-url=company2.com \
      --supplier-email=alice@company2.com \
      --supplier-phone=001
```
</details>


<details>
  <summary> Custom evidence location </summary>

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
  <summary>  Public registry image (SBOM) </summary>

Create SBOM for remote `busybox:latest` image.

```bash
valint bom busybox:latest
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
  <summary> Generic Evidence from file </summary>

Create Generic evidence out of `temp.log`.

```bash
valint bom temp.log -o statement-generic --predicate-type https://third_party.com/logs
``` 

Compress the content by adding `--compress`
```bash
valint bom temp.log -o statement-generic --predicate-type https://third_party.com/logs --compress
``` 

</details>

<details>
  <summary> Generic Evidence from file </summary>

Create Generic evidence out of `temp.log`.

```bash
valint bom temp.log -o statement-generic --predicate-type https://third_party.com/logs
``` 
</details>

<details>
  <summary> Generic Evidence from file </summary>

Create and sign Generic evidence out of `temp.log`.

```bash
valint bom temp.log -o attest-generic --predicate-type https://third_party.com/logs
``` 

> Compress content in evidence using `--compress` flag.

</details>

<details>
  <summary> Attest Generic File Target (SBOM) </summary>

Create SBOM for `sbom` file repository.

```bash
valint bom temp.log -o attest-generic
``` 

you can have `attest-generic` for any file that does not fall into any one of the files.

You can compress the `attest-generic` evidence using `--compress` flag.
This would use gzip to compress the evidence

```bash
valint bom temp.log -o attest-generic --compress
```
</details>

<details>
  <summary> Attest and verify image target (SBOM) </summary>

Generating and verifying CycloneDX SBOM `attestation` for image target `busybox:latest`.

> By default, *Valint* is using [Sigstore](https://www.sigstore.dev/ "Sigstore") interactive flow as the engine behind the signing mechanism.

```bash
# Create CycloneDX SBOM attestations
valint bom busybox:latest -o attest

# Verify CycloneDX SBOM attestations
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
echo "important evidence data" > testdir/test.txt

# Create Generic attestations from test.txt
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
valint bom git:./mongo-express -o attest

# Verify CycloneDX SBOM attestations
valint verify git:./mongo-express
```
</details>

<details>
  <summary> Attest and verify generic evidence </summary>

Generating and verifying Generic evidence `attestation` for directory targets.

> By default, *Valint* is using [Sigstore](https://www.sigstore.dev/ "Sigstore") interactive flow as the engine behind the signing mechanism.

```bash
mkdir testdir
echo "test" > testdir/test.txt

# Create Generic attestation from target file
valint bom test.txt -o attest-generic --predicate-type https://sometool.com/some_format

# Verify Generic attestation from target file
valint verify test.txt -i attest-geenric --predicate-type https://sometool.com/some_format
```
</details>

<details>
  <summary> Store evidence on OCI </summary>

Store any evidence on any OCI registry. <br />
Support storage for all targets and both SBOM and SLSA evidence formats.

> Use `-o`, `--format` to select between supported formats. <br />
> Write permission to `--oci-repo` value is required. 

```bash
# Login to registry
docker login $

# Generate and push evidence to registry
valint bom [target] -o [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] --oci --oci-repo $REGISTRY_URL

# Pull and validate evidence from registry
valint verify [target] -i [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] --oci --oci-repo $REGISTRY_URL -f
```
> Note `-f` in the verification command, which skips the local cache evidence lookup.

</details>

<details>
  <summary> Store evidence on Scribe service </summary>

Store any evidence on any Scribe service. <br />
Support storage for all targets and both SBOM and SLSA evidence formats.

> Use `-o`, `--format` to select between supported formats. <br />
> Credentials for Scribe API is required. 

```bash

# Set Scribe credentials
export SCRIBE_CLIENT_ID=**
export SCRIBE_CLIENT_SECRET=**

# Generate and push evidence to registry
valint bom [target] -o [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] --f -E \
  -U $SCRIBE_CLIENT_ID \
  -P $SCRIBE_CLIENT_SECRET

# Pull and validate evidence from registry
valint verify [target] -i [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] -f -E \
  -U $SCRIBE_CLIENT_ID \
  -P $SCRIBE_CLIENT_SECRET
```

> Note `-f` in the verification command, which skips the local cache evidence lookup.

</details>

### External frameworks
Valint uses some external tools, libraries, and packages to achieve its goal.

- Syft - CLI tool for generating a Software Bill of Materials (SBOM) from container images and filesystem.
  - [Syft](https://github.com/anchore/syft)
- CycloneDX-go - CycloneDX module for Go creates a valid CycloneDX bill-of-material document.
  - [CycloneDX](https://github.com/ozonru/CycloneDX-go)
- Cocosign - uses the awesome **sigstore** framework and specificly **sigstore/cosign** libraries for signing and verifying attestations. <br />
  - [cosign](https://github.com/sigstore/cosign) <br />
  - [sigstore](https://github.com/sigstore)

### Support

If you'd like help with deploying or using Valint, or you have an issue or a feature request, 
[Contact-us](https://scribesecurity.com/contact-us/) By email or Slack.

If you are reporting an issue, please include:

- the version of the Tool (`valint --version`)
- relevant logs and error messages (`valint .. -vv`)
- steps to reproduce

