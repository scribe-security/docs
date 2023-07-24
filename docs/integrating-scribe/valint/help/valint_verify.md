---
sidebar_label: "Valint Verify"
title: Valint Verify
sidebar_position: 3
---

Verify compliance policies against evidence to ensure the integrity of supply chain.

### Synopsis

Verify compliance policies against evidence to ensure the integrity of supply chain.

```
valint verify [TARGET] [flags]
```

### Optional flags 
Flags for `verify` subcommand


| Short | Long | Description | Default |
| --- | --- | --- | --- |
| -a | --attestation | Attestation for target | |
| | --common-name | Default policy allowed common names | |
| | --email | Default policy allowed emails | |
| -f | --force | Force skip cache | |
| -h | --help | help for verify | |
| -i | --input-format | Evidence format, options=[attest-cyclonedx-json attest-slsa statement-slsa statement-cyclonedx-json statement-generic attest-generic] | "attest-cyclonedx-json" |
| | --uri | Default policy allowed uris | |


### Global options flags
Flags for all `valint` subcommands


| Short | Long | Description | Default |
| --- | --- | --- | --- |
| | --app-name | Logical application name | |
| | --app-version | Logical application version | |
| | --attest.config | Attestation config path | |
| | --attest.default | Attestation default config, options=[sigstore sigstore-github x509 x509-env] | "sigstore" |
| | --backoff | Backoff duration | "15s" |
| | --cache-enable | Enable local cache | true |
| -c | --config | Configuration file path | |
| | --context-dir | Context dir | |
| -C | --context-type | CI context type, options=[jenkins github circleci azure gitlab travis bitbucket local] | "local" |
| -e | --env | Environment keys to include in sbom | |
| -F | --filter-regex | Filter out files by regex | [**/*.pyc,**/.git/**] |
| | --filter-scope | Filter packages by scope | |
| | --git-branch | Git branch in the repository | |
| | --git-commit | Git commit hash in the repository | |
| | --git-tag | Git tag in the repository | |
| -L | --label | Add Custom labels | |
| -D | --level | Log depth level, options=[panic fatal error warning info debug trace] | |
| | --oci | Enable OCI store | |
| -R | --oci-repo | Select OCI custom attestation repo | |
| -d | --output-directory | Output directory path | "${XDG_CACHE_HOME}/valint" |
| -O | --output-file | Output file name | |
| -p | --pipeline-name | Pipeline name | |
| | --predicate-type | Custom Predicate type (generic evidence format) | "http://scribesecurity.com/evidence/generic/v0.1" |
| -n | --product-key | Product Key | |
| -V | --product-version | Product Version | |
| -q | --quiet | Suppress all logging output | |
| -U | --scribe.client-id | Scribe Client ID | |
| -P | --scribe.client-secret | Scribe Client Secret | |
| -E | --scribe.enable | Enable scribe client | |
| -u | --scribe.url | Scribe API Url | "https://airflow.scribesecurity.com" |
| | --structured | Enable structured logger | |
| | --timeout | Timeout duration | "120s" |
| -v | --verbose | Log verbosity level [-v,--verbose=1] = info, [-vv,--verbose=2] = debug | |


### Examples for running `valint verify`

```
  valint verify <target>
  
  <target> Target object name format=[<image:tag>, <dir path>, <git url>]

  valint verify alpine:latest                         verify target against signed attestation of sbom
  valint verify alpine:latest -i attest-slsa          verify target against signed attestation of SLSA provenance
  valint verify file.json -i attest-generic 	  	  verify file as evidence
  valint verify alpine:latest -vv                     show verbose debug information

  Supports the following image sources:
  valint verify yourrepo/yourimage:tag     defaults to using images from a Docker daemon. If Docker is not present, the image is pulled directly from the registry.

  You can also explicitly specify the scheme to use:
  valint verify docker:yourrepo/yourimage:tag          explicitly use the Docker daemon
  valint verify docker-archive:path/to/yourimage.tar   use a tarball from disk for archives created from "docker save"
  valint verify oci-archive:path/to/yourimage.tar      use a tarball from disk for OCI archives (from Skopeo or otherwise)
  valint verify dir:path/to/yourproject                read directly from a path on disk (any directory)
  valint verify registry:yourrepo/yourimage:tag        pull image directly from a registry (no container runtime required)
  valint verify file:path/to/yourproject/file          read directly from a path on disk (any single file)

  SBOM-Example:
  valint bom alpine:latest -o attest
  valint verify alpine:latest -i attest

  SLSA-Example:
  valint bom alpine:latest -o attest-slsa
  valint verify alpine:latest -i attest-slsa

  Generic-Example:
  valint bom file.json -o attest-generic
  valint verify file.sjon -i attest-generic

  Input-Format-aliases:
  * statement=statement-cyclonedx-json
  * attest=attest-cyclonedx-json

```

### SEE ALSO

* **[valint](valint)**	 - Validate Supply Chain Integrity

