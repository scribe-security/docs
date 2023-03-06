---
title: Valint
author: mikey strauss - Scribe
date: April 5, 2021
geometry: margin=2cm
---

# Valint - Validate integrity of your supply chain
Valint is a powerful tool that validates the integrity of your **supply chain**, providing organizations with a way to enforce `policies` using the Scribe Service, CI, or admission controller. 
It also provides a mechanism for compliance and transparency, both within the organization and with external parties.
 
By managing `evidence` generation, storage and validation, Valint ensures that your organization's `policies` are enforced throughout the supply chain. <br />
You can store evidence locally or in any OCI registry, as well as using the Scribe Service for storage.

In addition to evidence management, Valint also **generates** evidence for a range of targets, including directories, file artifacts, images, and git repositories. It supports two types of evidence: **CycloneDX SBOMs** and **SLSA provenance**. With Valint, you can sign and verify targets against their origin and signer identity in the supply chain.

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

| CPU Architecture  | OS | 
| --- | --- |
| AMD64 (x86_64) | Linux, Windows, Mac |
| ARM64 | Linux, Windows, Mac |

# Policy engine
At the heart of Valint lies the `policy engine`, which enforces a set of rules on the `evidence` produced by your supply chain. The policy engine accesses different `evidence stores` to retrieve and store `evidence` for compliance verification throughout your supply chain. <br />
Each `policy` proposes to enforce a set of rules your supply chain must comply with. 

> For more details on policies, see [polices](policies) section.

## Evidence:
Evidence can refer to metadata collected about artifacts, reports, events or settings produced or provided to your supply chain.
Evidence can be either signed (attestations) or unsigned (statements).

> For evidence details, see [SBOM](cyclonedx-sbom), [SLSA](#slsa-provenance) section.
> For target details, see [targets](targets) section.
> For signing details, see [attestations](#attestations) section.

## Evidence formats
Valint supports the following evidence formats.

| Format | alias | Description | signed |
| --- | --- | --- | --- |
| CycloneDX-json | json | CyclondeDX json format | no |
| predicate-CycloneDX-json | predicate | In-toto Predicate | no |
| statement-CycloneDX-json | statement | In-toto Statement | no |
| attest-CycloneDX-json | attest | In-toto Attestation | yes |
| predicate-slsa |  | In-toto Predicate | no |
| statement-slsa |  | In-toto Statement | no |
| attest-slsa |  | In-toto Attestations | yes |

> Select using [bom command](#evidence-generator---bom-command) `format` flag,
Or using [verify command](#evidence-verification---verify-command) `input-format` flags.

## Environment context
`environment context` collects information from the underlining environments, in which Valint is run.
Environment context is key to connecting the target evidence and the actual point in your supply chain they where created by.

Futher more they policy verifier is provided its own `environment context`, which allows it to refer to evidence relative to its own.
For example, a verification done on a specific CI can refer to its own build identitifers and request evidence collected by it.

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

## Evidence Stores
Each storer can be used to store, find and download evidence, unifying all the supply chain evidence into a system is an important part to be able to query any subset for policy validation.

| Type  | Description | requirement |
| --- | --- | --- |
| cache | Evidence is stored locally | access to a directory |
| OCI | Evidence is stored on a remote OCI registry | access to a OCI registry |
| scribe | Evidence is stored on scribe service | scribe credentials |

> For details, see [evidence stores integrations](evidence-stores-integration) section

# Policies
Each `policy` proposes to enforce a set of rules your supply chain must comply with. Policies reports include valuations, compliance details, verdicts as well as references to provided `evidence`. <br />
Policy configuration can be set under the main configuration `policies` section.

### Usage
```yaml
attest:
  cocosign:
    policies: [] # Set of policy configuration
``` 
> See configuration details, see [configuration](docs/configuration.md) section

### Default policy
When no policy configuration is found, the default policy is a single instance of the verifyTarget policy. The values for `allowed_emails`, `allowed_uris`, and `allowed_names` are obtained from the corresponding flag sets `--emails`, `--uri`, and `--common-name`.

## Verify target policy
The Verify Target policy enforces rules on the targets in your supply chain to ensure their identity and origin are verified.

Given any target, the policy engine enforces the following:
* Should the target include signed/unsigned evidence.
* What identity must sign the target (for signed evidence).
* Where was the target expected to originate from.
* What format(s) should the evidence follow.

### Use cases
* An image must include a signed SBOM in CycloneDX format.
* An image must be produced by a CI workflow and must include a signed SLSA attestation in In-toto format.
* A git repository must include a signed SBOM in CycloneDX format, and only certain individuals within the organization should be able to verify this version. Using Sigstore can help verify the identity of OIDC-connected developers or machines.
* A binary file must include a signed SLSA provenance statement in JSON format, and evidence must be generated by a CI. This can be used to enforce compliance with SLSA requirements.

### Configuration
```yaml
- type: verifyTarget # Policy name
  name: "" # Any user provided name
  allowed_emails: [] # Signed email identities 
  allowed_uris: [] # Signed URIs identities 
  allowed_names: [] # Signed common name identities 
  filter: {envrionment-context}
```

#### Details
* `allowed_emails`, `allowed_uris` and `allowed_names` default the identity
required the identity that signed the target.

> Important to note, empty fields seen as `accept all`. 

* `filter` any environment context flag to match on target before verification.
Flag provides a way to define multiple policies each refereeing to a different set of targets.

### Flags

* `--input-format` in [verify command](#evidence-verification---verify-command)
Verify target includes specified format.

> For example, `valint verify busybox:latest -i statement-slsa` will force verifyTarget to look for evidence in the format of slsa statement.

* `--email`, `--uri`, `--common-name` each flag set allows one to set the identity expected to sign the target. 

> for signed evidence only.

### Examples
Following are configuration examples. <br />
Create a file name `.valint.yaml` with the following content.

<details>
  <summary> Image policy verification </summary>

In this example, the policy is named "image_policy" and applies only to Docker images. The policy requires that the image must be signed by an identity with the common name "mycompany.com" and must include a CycloneDX SBOM.

```yaml
attest:
  cocosign:
    policies:
    - type: verifyTarget
      name: image_policy
      allowed_names:
        - mycompany.com
      filter:
        sbomgroup: image
        content_type: attest-cyclonedx-json
```
</details>

<details>
  <summary> Source policy verification </summary>

In this example, the policy is named "git_policy" and applies only to Git repositories. The policy requires any evidence and signed by an identity with the email address "john.doe@mycompany.com". The policy also specifies that it only applies to the main branch.


```yaml
attest:
  cocosign:
    policies:
    - type: verifyTarget
      name: git_policy
      allowed_emails:
        - john.doe@mycompany.com
      filter:
        input_scheme: git
        branch: main
```
</details>

<details>
  <summary> Binary verification </summary>
In this example, the policy is named "binary_policy" and applies to any binary file in the "azure" CI. The policy requires that the binary must include a signed SLSA provenance and must be signed by an identity "https://mycompany.com/pubkey.gpg".

```yaml
attest:
  cocosign:
    policies:
    - type: verifyTarget
      name: binary_policy
      allowed_uris:
        - https://mycompany.com/pubkey.gpg
      filter:
        context_type: azure
        content_type: attest-slsa
        input_scheme: file
        input_name: my_binary.exe
```
</details>

<details>
  <summary> Multiple policy verification </summary>
This example defines two policies: one for image targets and one for Git repositories. 
Each policy uses the `filter` option to select the appropriate targets to verify.

```yaml
attest:
  cocosign:
    policies:

      - enable: true
        type: VerifyTarget
        name: git_policy
        input:
          allowed_emails:
          - john.doe@mycompany.com
          allowed_names: []
          filter:
            input_scheme: git # Match on git targets
            git_branch: main # Match only on main branch

      - enable: true
        type: VerifyTarget
        name: docker_policy
        input:
          allowed_emails:
          - second@example.com
          allowed_names: []
          filter:
            input_scheme: docker # Match on image targets
```
</details>


<!-- ## Verify Git owner
Policy porpuse is to inforce who or what should be change what files in your code base.
A `owner` of a file is defined by the `author` of the last commit changing this file.
> Author is the identity used by git layer when a commit is created.

Given a Git repository target the policy enforces the following,
* Who must be the owner of each file.
* Do commits must include GPG signatures.

> We only file enforce `owner` using the last commit that modified the file.
This in turn means that the target can include commits that change any file,
But the `last` commit must be authored by the `owner`.

### Use cases
* What developer should be able to modify the CI workflows.
* What developer should approve changes to what sub-project in the mono repo.
* Tagged git repo must include only signed commits.
* What workflow is allowed to add commits in to the code base. -->

# Targets
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

# Evidence Stores Integration
Each storer can be used to store, find and download evidence, which unifies all the evidence collected from the supply chain into a unified system.

## Scribe Evidence store
OCI evidence store allows you store evidence using scribe Service.

Related Flags:
> Note the flag set:
>* `-U`, `--scribe.client-id`
>* `-P`, `--scribe.client-secret`
>* `-E`, `--scribe.enable`

### Before you begin
Integrating Scribe Hub with your environment requires the following credentials that are found in the **Integrations** page. (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **integrations**)

* **Client ID**
* **Client Secret**

<img src='../../../img/ci/integrations-secrets.jpg' alt='Scribe Integration Secrets' width='70%' min-width='400px'/>

### Usage
```bash
# Generating evidence, storing in scribe service.
valint bom [target] -o [attest, statement, attest-slsa,statement-slsa] \
  -E \
  -U [SCRIBE_CLIENT_ID] \
  -P [SCRIBE_CLIENT_SECRET]

# Verifying evidence, pulling attestation from scribe service.
valint verify [target] -i [attest, statement, attest-slsa,statement-slsa] \
  -E \
  -U [SCRIBE_CLIENT_ID] \
  -P [SCRIBE_CLIENT_SECRET]
```

## OCI Evidence store
Valint supports both storage and verification flows for `attestations`  and `statement` objects utilizing OCI registry as an evidence store.

Using OCI registry as an evidence store allows you to upload, download and verify evidence across your supply chain in a seamless manner.

Related flags:
* `--oci`
* `--oci-repo`

### Before you begin
Evidence can be stored in any accusable registry.
* Write access is required for upload (generate).
* Read access is required for download (verify).

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

## Cache Evidence store
Valint supports both storage and verification flows for `attestations`  and `statement` objects utilizing Local directory as an evidence store.
Basically, this is the simplest form and is mainly used to cache previous evidence creation. 

Related flags:
* `--cache-enable`
* `--output-directory`
* `--force`

> By default, this cache store enabled, disable by using `--cache-enable=false`

### Usage
```bash
# Generating evidence, storing on [my_dir] local directory.
valint bom [target] -o [attest, statement, attest-slsa,statement-slsa] --output-directory=[my_dir]
Supply chain environment
# Verifying evidence, pulling attestation from [my_dir] local directory.
valint verify [target] -i [attest, statement, attest-slsa,statement-slsa] --output-directory=[my_dir]
```

> By default, the evidence is written to `~/.cache/valint/`, use `--output-file` or `-d`,`--output-directory` to customize the evidence output location. 


# CycloneDX SBOM
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
* Include the installed packages found (package group `install`) or the packages referenced by sources (package group `index`), use `--package-group` to select between options.
* Exclude components, use `--filter-regex`, `--filter-scope` and `--filter-purl` to exclude any component.
* Attach any file content, use `--attach-regex` to include the content of external files.
* Include custom environments and labels, use `--env` and `--label` to attach your custom fields.

## SLSA Provenance
SLSA Provenance includes verifiable information about software artifacts describing where, when and how something was produced.
It is required for SLSA compliance level 2 and above.

See details [SLSA provenance spec](http://slsa.dev/provenance/v0.2)
See details [SLSA requirements](http://slsa.dev/spec/v0.1/requirements)


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
Scribe uses the **cocosign** library we developed to deal with digital signatures for signing and verification.

> Note the unsigned evidence are still valuable for policy consumption regardless of them not being signed cryptographically.

See details [In-toto spec](https://github.com/in-toto/attestation) <br />
See details [attestations](docs/attestations.md)

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

The verification flow includes two parts, the first is a PKI and identity verification on the evidence the second is a policy-based verification.

Verification flow for `attestations` which are signed evidence formats includes PKI and identity verification as well as policy verification. <br />
Verification flow for `statements` that are unsigned evidence includes policy verification only. <br />

> Evidence must be available locall on a remote OCI registry or using Scribe service.

> By default, the evidence is read from `~/.cache/valint/`, use `--output-file` or `--output-directory` to customize the evidence output location.

For details, see [CLI documentation - verify](docs/command/valint_verify.md).

### Usage examples
<details>
  <summary>  Cache store </summary>

```bash
# Use `bom` command to generate one of the supported formats.
valint bom [scheme]:[name]:[tag] -o [attest, statement, attest-slsa, statement-slsa]

# Use `verify` command to verify the target against the evidence
valint verify [scheme]:[name]:[tag] -i [attest, statement, attest-slsa, statement-slsa]
```
</details>
<details>
  <summary>  OCI store </summary>

```bash
# Use `bom` command to generate one of the supported formats.
valint bom [scheme]:[name]:[tag] -o [attest, statement, attest-slsa, statement-slsa]

# Use `verify` command to verify the target against the evidence
valint verify [scheme]:[name]:[tag] -i [attest, statement, attest-slsa, statement-slsa]
```
</details>

<details>
  <summary>  Scribe store </summary>

```bash
# Generating evidence, storing in scribe service.
valint bom [target] -o [attest, statement, attest-slsa,statement-slsa] \
  -E \
  -U [SCRIBE_CLIENT_ID] \
  -P [SCRIBE_CLIENT_SECRET]

# Verifying evidence, pulling attestation from scribe service.
valint verify [target] -i [attest, statement, attest-slsa,statement-slsa] \
  -E \
  -U [SCRIBE_CLIENT_ID] \
  -P [SCRIBE_CLIENT_SECRET]
```
</details>

<details>
  <summary>  OCI store </summary>
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
</details>


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

<details>
  <summary> Store evidence on Scribe service (SBOM,SLSA) </summary>

Store any evidence on any Scribe service. <br />
Support storage for all targets and both SBOM and SLSA evidence formats.

> Use `-o`, `format` to select between supported formats. <br />
> Credentials for Scribe API is required. 

```bash

# Set Scribe credentials
export SCRIBE_CLIENT_ID=**
export SCRIBE_CLIENT_SECRET=**

# Generate and push evidence to registry
valint bom busybox:latest -o [attest, statement, attest-slsa, statement-slsa] --f -E \
  -U $SCRIBE_CLIENT_ID \
  -P $SCRIBE_CLIENT_SECRET

# Pull and validate evidence from registry
valint verify busybox:latest -o [attest, statement, attest-slsa, statement-slsa] -f -E \
  -U $SCRIBE_CLIENT_ID \
  -P $SCRIBE_CLIENT_SECRET
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

If you'd like help with deploying or using Valint, or you have an issue or a feature request, 
[Contact-us](https://scribesecurity.com/contact-us/) By email or Slack.

If you are reporting an issue, please include:

- the version of the Tool (`valint --version`)
- relevant logs and error messages (`valint .. -vv`)
- steps to reproduce

