---
sidebar_label: "valint bom"
title: valint bom
sidebar_position: 2
---

Create evidence command

### Synopsis

Collect, Create and Store evidence for artifacts (SBOMs,SLSA provenance) or any third-party tools.

```
valint bom [TARGET] [flags]
```

### Optional flags 
Flags for `bom` subcommand


| Short | Long | Description | Default |
| --- | --- | --- | --- |
| -A | --attach-regex | Attach files content by regex | |
| | --author-email | Set author email | |
| | --author-name | Set author name | |
| | --author-phone | Set author phone | |
| | --components | Select sbom components groups, options=[metadata layers packages syft files dep commits] | [metadata,layers,packages,syft,dep,commits] |
| | --compress | Compress content (generic evidence) | |
| -f | --force | Force overwrite cache | |
| -o | --format | Evidence format, options=[cyclonedx-json cyclonedx-xml attest-cyclonedx-json statement-cyclonedx-json predicate-cyclonedx-json attest-slsa statement-slsa predicate-slsa statement-generic attest-generic] | [cyclonedx-json] |
| -h | --help | help for bom | |
| | --package-exclude-type | Exclude package type, options=[ruby python javascript java dpkg apkdb rpm go-mod dotnet r-package rust binary sbom] | |
| | --package-group | Select package group, options=[index install all] | |
| -t | --package-type | Select package type, options=[ruby python javascript java dpkg apkdb rpm go-mod dotnet r-package rust binary sbom] | [ruby,python,javascript,java,dpkg,apkdb,rpm,go-mod,dotnet,r-package,rust,binary,sbom] |
| | --supplier-email | Set supplier email | |
| | --supplier-name | Set supplier name | |
| | --supplier-phone | Set supplier phone | |
| | --supplier-url | Set supplier url | |


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


### Examples for running `valint bom`

```
  valint bom <target>
  
  <target> Target object name format=[<image:tag>, <dir path>, <git url>]

  valint bom alpine:latest                         create default (cyclonedxjson) sbom
  valint bom alpine:latest -o cyclonedxxml         create cyclonedx xml sbom
  valint bom alpine:latest -o attest               create intoto attestation of cyclonedx sbom 
  valint bom alpine:latest -o attest-slsa          create intoto attestation of SLSA provenance
  valint bom alpine:latest                     show verbose debug information
  valint bom alpine:latest -A "*/**"           collect files content in to SBOM
  valint bom file.json -o attest-generic 	  attach file as evidence

  Supports the following image sources:
  valint bom yourrepo/yourimage:tag     defaults to using images from a Docker daemon. If Docker is not present, the image is pulled directly from the registry.

  You can also explicitly specify the scheme to use:
  valint bom docker:yourrepo/yourimage:tag          explicitly use the Docker daemon
  valint bom podman:yourrepo/yourimage:tag          explicitly use the Podman daemon
  valint bom docker-archive:path/to/yourimage.tar   use a tarball from disk for archives created from "docker save"
  valint bom oci-archive:path/to/yourimage.tar      use a tarball from disk for OCI archives (from Skopeo or otherwise)
  valint bom dir:path/to/yourproject                read directly from a path on disk (any directory)
  valint bom registry:yourrepo/yourimage:tag        pull image directly from a registry (no container runtime required)
  valint bom file:path/to/yourproject/file          read directly from a path on disk (any single file)
  valint bom git:path/to/yourrepository             read directly from a local repository on disk
  valint bom git:https://github.com/yourrepository.git         read directly from a remote repository on git

  SBOM-Example:
  valint bom alpine:latest -o attest
  valint bom alpine:latest -o statement

  SLSA-Example:
  valint bom alpine:latest -o attest-slsa
  valint bom alpine:latest -o statement-slsa

  Generic-Example:
  valint bom file.json -o attest-slsa
  valint bom file.json -o statement-slsa

  Format-aliases:
  * json=attest-cyclonedx-json
  * predicate=predicate-cyclonedx-json
  * statement=statement-cyclonedx-json
  * attest=attest-cyclonedx-json

```

### SEE ALSO

* [valint](valint)	 - Validate Supply Chain Integrity

