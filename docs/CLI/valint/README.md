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

#### Supported architecture and operating systems (OS)

| CPU Architecture  | OS | 
| --- | --- |
| AMD64 (x86_64) | Linux, Windows, Mac |
| ARM64 | Linux, Windows, Mac |

# High level digram 
<img src='../../../img/cli//valint_high_level.jpg' alt='Valint high level' width='80%' min-width='600px'/>

<img src='../../../img/cli/valint_support_table.jpg' alt='Valint support table' width='80%' min-width='600px'/>

# Policy engine
At the heart of Valint lies the `policy engine`, which enforces a set of rules on the `evidence` produced by your supply chain. The policy engine accesses different `evidence stores` to retrieve and store `evidence` for compliance verification throughout your supply chain. <br />
Each `policy` proposes to enforce a set of rules your supply chain must comply with. 

> For more details on policies, see [polices](#policies) section.

## Evidence
Evidence can refer to metadata collected about artifacts, reports, events or settings produced or provided to your supply chain.
Evidence can be either signed (attestations) or unsigned (statements).

> For evidence details, see [SBOM](#cyclonedx-sbom), [SLSA](#slsa-provenance) section.

> For target details, see [targets](#targets) section.

> For signing details, see [attestations](#attestations) section.

## Evidence formats
Valint supports the following evidence formats.

| Format | alias | Description | signed |
| --- | --- | --- | --- |
| cyclonedx-json | json | CyclondeDX json format | no |
| predicate-cyclonedx-json | predicate | In-toto Predicate | no |
| statement-cyclonedx-json | statement | In-toto Statement | no |
| attest-cyclonedx-json | attest | In-toto Attestation | yes |
| predicate-slsa |  | In-toto Predicate | no |
| statement-slsa |  | In-toto Statement | no |
| attest-slsa |  | In-toto Attestations | yes |

> Select using [bom command](#evidence-generator---bom-command) `format` flag,
Or using [verify command](#evidence-verification---verify-command) `input-format` flags.

## Environment context
`environment context` collects information from the underlining environments, in which Valint is run.

Environment context is key to connecting the evidence and the actual point in your supply chain they where created by.
Given an artifact to the Valint assumes the context of the artifact (`target`) it is provided, In other words, the identifiers of the artifact are included in the context `envrionment context`.

On the verification flow the current `envrionment context` is provided to the policy engine, which is the key to defining relative compliance rules between different points in the supply chain.

For example, verification done in Github Actions can refer to rules that apply to the current run number.
Another example, verification done on a binary can refer to rules that apply to the hash of the binary.


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
| jenkins | Jenkins declarative pipelines |


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
The following fields are collected from any supported artifact ()`target`).

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


`content type` is set by the `--format` or `--input-format` flag it supports the following types.
| content_type | 
| --- |
| cyclonedx-json |
| predicate-cyclonedx-json |
| statement-cyclonedx-json | 
| attest-cyclonedx-json | 
| predicate-slsa |
| statement-slsa |
| attest-slsa |  |


## Evidence Stores
Each storer can be used to store, find and download evidence, unifying all the supply chain evidence into a system is an important part to be able to query any subset for policy validation.

| Type  | Description | requirement |
| --- | --- | --- |
| cache | Evidence is stored locally | access to a directory |
| OCI | Evidence is stored on a remote OCI registry | access to a OCI registry |
| scribe | Evidence is stored on scribe service | scribe credentials |

> For details, see [evidence stores integrations](#evidence-stores-integration) section

## Policies
---
Each `policy` proposes to enforce a set of rules your supply chain must comply with. Policies reports include valuations, compliance details, verdicts as well as references to provided `evidence`. <br />
Policy configuration can be set under the main configuration `policies` section.

Each `policy` consists of a set of `rules` that your supply chain must comply with. Policy reports include valuations, compliance details, verdicts, as well as references to provided evidence. You can set policy configuration under the main configuration `policies` section.

A `policy` is verified if ALL required `rules` in a `policy` are evaluated and verified. A rule is verified if ANY `evidence` is found that complies with the rules configuration and setting.

### Usage
```yaml
attest:
  cocosign:
    policies:  # Set of policies - grouping rules
      - name: <policy_name>
        enable: true      
        rules: Set of rule settings/configuration and input
          - name: <rule_name>
            type: <verifyTarget> # Currently supporting the following types
            enable: true
            input: {} # Rule input, depending on the rule type
``` 

> For configuration details, see [configuration](docs/configuration.md) section.

> For PKI setting, see [attestations](#attestations) section.

### Global 
All policies include the following global fields:
All rules support the following fields.
* `enable`, enable rule (default false). 
* `name`, policy name (**required**). 

While all rules include the following global fields:
* `enable`, enable rule (default false). 
* `name`, rule name (**required**). 
* `type`, set the rule type, currently we only support `verify-target`. 

# Rules
Rules are a set of compliance checks that you can configure to your specific compliance requirements.

## Global Match field
`match` field is a set of labels supported by all rules. 
These labels add requirements on the origin or the subject of the provided evidence considered for compliance. 

Using these fields allows you to set different compliance rules for different layers of your supply chain.

> For full label fields list see [environment-context](#environment-context) section.

<details>
  <summary> Usage </summary>

Here's an example of usage: 
If you want to evaluate images named `myorg/myimage:latest`, you may set a rule with the following labels:
```
match:
    sbomgroup: image
    sbomname: myorg/myimage:latest
```

> If you also add `context_type: github` label, it requires the origin of the evidence to be generated by a Github.

> If you also add `git_url: github.com/my_org/myimage.git`, it will require the evidence to be collected from a pipeline on a specific repo.

</details>

### Default policy - Signed artifact
When no policy configuration is found, the signed artifact policy is used.

By default, the following command runs a signature and identity verification on the target provided:
```bash
valint verify [target] --input-format [attest, attest-slsa] \
   --email [email] --common-name <common name> --uri [uri]
```

In other words, the Signed Artifact policy allows you to verify signature compliance and format of artifacts in your supply chain.

> For full command details, see [valint verify](#evidence-verification---verify-command) section.

<details>
  <summary> Default Policy Evaluation </summary>
The default policy can also be evaluated as the following policy configuration:

```yaml
attest:
  cocosign:
  policies:
  - name: default-policy
    rules:
    - type: verifyTarget
      enable: true
      name: "default-rule"
      identity: # Populated by `--email`, `--uri` and `--common-name flags sets
      signed: true
      format: ${current.content_type} # Populated by --input-format flag.
      match:
        sbomversion: ${current.sbomversion> # Populated from the artifact version provided to verify command.
```

> For rule details, see [verify target rule](#verify-target-rule) section.

</details>

## Verify target rule
The Verify Target rule enforces a set of rules on who produced artifacts across your supply chain but also what information should be collected on each artifact.
In other words, it ensures produced artifacts (`targets`) integrity by checking the expected evidence, signatures and origin in your supply chain.

* Signed Evidence: The artifact should include signed or unsigned evidence, as specified by the `signed` field in the rule.
* Signing Identity: The artifact should be signed by a specific identity, as specified by the `identity` fields in the rule (for signed evidence).
* Evidence Format: The evidence format should follow the specified format(s) in the format field of the rule.
* Origin of artifact: The artifact should originate from an expected source, as specified by the `match` [origin labels](##origin-context). 
For instance, you can verify that an artifact is generated from a particular pipeline or repository.
* Artifact details: The rule applies to a specific artifact or any group of artifacts, as specified by the `match` [subject labels](##subject-context).

### Use cases
The Verify Target Rule can be used to enforce compliance with specific supply chain requirements, such as:

* Images must be signed using and produced signed CycloneDX SBOM.
* Images must be built by a CircleCI workflow and produce a signed SLSA provenance.
* Tagged sources must be signed and verified by a set of individuals or processes.
* Released binaries must be built by Azure DevOps on a specific git repository using unsigned SLSA provenance.

### Configuration
```yaml
- type: verifyTarget # Policy name
  enable: true/false # Policy enable (default false) 
  name: "" # Any user provided name
  identity:
    emails: [] # Signed email identities 
    uris: [] # Signed URIs identities 
    common-names: [] # Signed common name identities 
  signed: <true|false> # Should target be signed
  format: <statement-cyclonedx-json, attest-cyclonedx-json, statement-slsa, attest-slsa> # Expected evidence format
  match: {envrionment-context} # Any origin or subject fields used by
``` 

### Examples
Copy the Examples into file name `.valint.yaml` in the same directory as running Valint commands.

> For configuration details, see [configuration](docs/configuration.md) section.

<details>
  <summary> Signed Images rule </summary>
In this example, the rule named `signed_image` will evaluate images where signed by `mycompony.com` using `attest-cyclondex-json` format.

```yaml
attest:
  cocosign:
    policies:
      - name: my_policy
        enable: true
          rules:
            - name: signed_image
              type: verifyTarget
              enable: true
              signed: true
              format: attest-slsa
              identity:
                allowed_names:
                  - mycompany.com
              match:
                target_type: image
```

### Command
Run the command on the required supply chain location.

```bash
# Generate required evidence, requires signing capabilities.
valint bom busybox:latest -o attest

# Verify policy (cache store)
valint verify busybox:latest
```

</details>

<details>
  <summary> Image SLSA provenance rule </summary>
In this example, the rule named `slsa_prov_rule` will evaluate images where signed by `bob@mycompany.com` or `alice@mycompany.com` using `attest-slsa` format.

```yaml
attest:
  cocosign:
    policies:
      - name: my_policy
        enable: true
        rules:
          - name: slsa_prov_rule
            type: verifyTarget
            enable: true
            signed: true
            format: attest-slsa
            identity:
              allowed_emails:
                - bob@mycompany.com
                - alice@mycompany.com
            match:
              target_type: image
```

### Command
Run the command on the required supply chain location.

```bash
# Generate required evidence, requires signing capabilities.
valint bom busybox:latest -o attest-slsa

# Verify policy (cache store)
valint verify busybox:latest
```

</details>

<details>
  <summary> Signed tagged sourced rule </summary>
In this example, the rule named "tagged_git_rule," will evaluate sources' `mycompany/somerepo` tags where defined in the `main` branch and signed by `bob@mycompany.com`.

> The policy requires only the **HEAD** of the git target to comply to the policy not the entire history.

```yaml
attest:
  cocosign:
    policies:
      - name: my_policy
        enable: true  
        rules:
          - name: tagged_git_rule
            type: verifyTarget
            enable: true
            signed: true
            format: attest-slsa
            identity:
              allowed_emails:
              - bob@mycompany.com`
            match:
              target_type: git
              target_git_url: git@github.com:mycompany/somerepo.git # Git url of the target.
              branch: main
```

### Command
Run the command on the required supply chain location.

```bash
# Generate required evidence, requires signing capabilities.
valint bom git:github.com:your_org/your_repo.git --tag 0.1.3 -o attest-slsa

# Verify policy (cache store)
valint verify git:github.com:your_org/your_repo.git --tag 0.1.3 -i statement-slsa
```
</details>

<details>
  <summary> Binary verification </summary>
In this example, the policy, named "binary_rule" enforces rules on the binary `my_binary.exe` was Originated from which Azure DevOps triggered by the `https://dev.azure.com/mycompany/somerepo` repo.
The rule also enforces an unsigned SLSA provenance statement is produced as evidence.

```yaml
attest:
  cocosign:
    policies:
      - name: my_policy
        enable: true  
        rules:
          - name: binary_policy
            type: verifyTarget
            enable: true
            signed: false
            format: statement-slsa
            match:
              target_type: file
              context_type: azure
              git_url: https://dev.azure.com/mycompany/somerepo # Git url of the environment.
              input_name: my_binary.exe
```

### Command
Run the command on the required supply chain location.

```bash
# Generate required evidence
valint bom file:my_binary.exe -o statement-slsa

# Verify policy (cache store)
valint verify file:my_binary.exe
```

</details>

<!-- <details>
  <summary> Multiple policy verification </summary>
This example defines two policies: one for image targets and one for Git repositories. 
Each policy uses the `filter` option to select the appropriate targets to verify.

```yaml
attest:
  cocosign:
    policies:
      - name: my_policy
        enable: true  
      rules:
        - name: git_policy
          type: VerifyTarget
          enable: true
          input:
            allowed_emails:
            - john.doe@mycompany.com
            allowed_names: []
            filter:
              input_scheme: git # Match on git targets
              git_branch: main # Match only on main branch

        - type: VerifyTarget
          enable: true
          name: docker_policy
          input:
            allowed_emails:
            - second@example.com
            allowed_names: []
            filter:
              input_scheme: docker # Match on image targets
```
</details> -->

## Target  types
---
Target types are types of artifacts produced and consumed by your supply chain.
Using supported targets, you can collect evidence and verify compliance on a range of artifacts.

### Format

`[scheme]:[name]:[tag]` 

| Sources | target-type | scheme | Description | example
| --- | --- | --- | --- | --- |
| Docker Daemon | image | docker | use the Docker daemon | docker:busybox:latest |
| OCI registry | image | registry | use the docker registry directly | registry:busybox:latest |
| Docker archive | image | docker-archive | use a tarball from disk for archives created from "docker save" | image | docker-archive:path/to/yourimage.tar |
| OCI archive | image | oci-archive | tarball from disk for OCI archives | oci-archive:path/to/yourimage.tar |
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

# Evidence Stores Integration
Each Evidence store can be used to store, find and download evidence, which unifies all the evidence collected from the supply chain into a unified system.

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
Admission supports both storage and verification flows for `attestations`  and `statement` objects utilizing OCI registry as an evidence store.

Using OCI registry as an evidence store allows you to upload, download and verify evidence across your supply chain in a seamless manner.

Related flags:
* `--oci` Enable OCI store.
* `--oci-repo` - Evidence store location.

### Dockerhub limitation
Dockerhub does not support the subpath format for images 

### OCI Repo flag
`oci-repo` setting indicates the location in a registry under which the evidence are stored.
It must be a dedicated location in a OCI registry.
for example, `scribesecuriy.jfrog.io/my_docker-registry/evidence`.

### Dockerhub limitation
Dockerhub does not support the subpath format, `oci-repo` should be set to your account name.
For example, scribe-security`

> Some registries allow multi layer format for repo names.

### Before you begin
Evidence can be stored in any accusable registry.
* Write access is required for upload (generate).
* Read access is required for download (verify).

You must first login with the required access privileges to your registry before calling Valint.
For example, using `docker login` command.

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

> For related Cosign support, see [cosign ](#-cosign-support) section.

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

Default settings are available using `--attest.default` flag. <br />
Custom configuration by providing `cocosign` field in the [configuration](docs/configuration.md) or custom path using `--attest.config`.

The following table includes the formats supported by the verification command.

| Format | alias | Description | signed
| --- | --- | --- | --- |
| statement-CycloneDX-json | statement | In-toto Statement | no |
| attest-CycloneDX-json | attest | In-toto Attestation | yes |
| statement-slsa |  | In-toto Statement | no |
| attest-slsa |  | In-toto Attestations | yes |
> Unsigned evidence are still valuable for policy consumption regardless of them not being signed cryptographically.

> For spec details, see [In-toto spec](https://github.com/in-toto/attestation) <br />
> See signing details, see [attestations](docs/attestations.md)

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
`verify` command evaluates and verifies the compliance of your supply chain against your requirements.
By default the command verifies a artifact signature against the required identities.

Evidence verification  verification flow includes two parts, the first is a PKI and identity verification on the evidence the second is a policy-based verification.

> For flag details, see [CLI documentation - verify](docs/command/valint_verify.md).

> For policy verification details, see [policies](#policies) section.

### Usage

```bash
valint verify [scheme]:[name]:[tag] -i [attest, statement, attest-slsa, statement-slsa] \
  --email [email] --uri [uri] --common-name [common name]
```
> Note: multiple `email`, `uri` and `common-name` can be included in command

### Examples
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
valint verify [scheme]:[name]:[tag] -i [attest, statement, attest-slsa, statement-slsa] \
    --email [email] --uri [uri] --common-name [common name]
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
  --email [email] --uri [uri] --common-name [common name] \
  -E \
  -U [SCRIBE_CLIENT_ID] \
  -P [SCRIBE_CLIENT_SECRET]
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
valint bom git:./mongo-express -o attest

# Verify CycloneDX SBOM attestations
valint verify git:./mongo-express
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

