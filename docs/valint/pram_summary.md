---
sidebar_label: "Configuration parameters summary"
title: Configuration parameters summary
author: mikey strauss - Scribe
sidebar_position: 9
date: April 5, 2021
geometry: margin=2cm
---

### Evidence
| Evidence type |  Description | example 
| --- |--- | --- |
| CycloneDX | CycloneDX SBOM evidence | `valint slsa busybox:latest` |
| SLSA Provenance | SLSA v1 providence evidence | `valint slsa busybox:latest` |
| Generic | Custom evidence | `valint bom custom_evidence.txt -o statement-generic` |

## Target format
---

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

> Example command `valint slsa docker:busybox:latest`.

### Evidence Stores

| Type  | Description | requirement |
| --- | --- | --- |
| cache | Evidence is stored locally | access to a directory |
| OCI | Evidence is stored on a remote OCI registry | access to a OCI registry |
| scribe | Evidence is stored on scribe service | scribe credentials |

## Environment context
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
| tekton | Tekton CI Workflows |
| jenkins | Jenkins declarative or scripted pipelines |


The fields are collected from any supported environment.

| Field | Description | 
| --- | --- | 
| context_type | Environment type | 
| git_url | Environment provided git url |
| git_branch | Environment provided git branch |
| git_commit | Environment provided git commit |
| git_tag | Environment provided git tag |
| git_ref | Environment provided git ref |
| git_uuid | Environment provided git uuid |
| workflow | Environment workflow |
| job_name | Environment Job name |
| actor | Environment provided actor |
| build_num | Environment build num |

The following fields are collected from any supported artifact (`target`).

| Field | Description | Target | values |
| --- | --- | --- | --- |
| content_type | Target Evidence Format (CLI) value of flags`--format`, `--input-format` | All | 
| name | Product key (CLI) - value of flag `--product-key` | All |
| name | Product Version (CLI) - value of flag `--product-version` | All |
| name | Pipeline name (CLI) - value of flag `--pipeline-name` | All |
| name | Mark as Deilverable (CLI) - value of flag `--deliverable` | All |
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

#### `valint bom` format support
| Format | alias | Description | signed |
| --- | --- | --- | --- |
| cyclonedx-json | json | CyclondeDX json format | no |
| statement-cyclonedx-json | statement | In-toto CyclondeDX Statement | no |
| attest-cyclonedx-json | attest | In-toto CyclondeDX Attestation | yes |
| statement-generic |  | In-toto Generic Statement | no |
| attest-generic |  | In-toto Generic Attestations| yes |

#### `valint slsa` format support
| Format | alias | Description | signed |
| --- | --- | --- | --- |
| statement-slsa | statement | In-toto SLSA Provenance Statement | no |
| attest-slsa | attest |  In-toto SLSA Provenance Attestation | yes |

> Select using `slsa` command `-o`, `--format` flag.

#### `valint verify` Input format support
| Format | alias | Description | signed |
| --- | --- | --- | --- |
| statement-cyclonedx-json | statement | In-toto CyclondeDX Statement | no |
| attest-cyclonedx-json | attest | In-toto CyclondeDX Attestation | yes |
| statement-generic |  | In-toto Generic Statement | no |
| attest-generic |  | In-toto Generic Attestations| yes |
| statement-slsa |  | In-toto SLSA Provenance Statement | no |
| attest-slsa |  |  In-toto SLSA Provenance Attestation | yes |

> Select using `verify` command `-i`, `--input-format` flag.
