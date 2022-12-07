## valint bom

Create SBOM for target

### Synopsis

Generate Software Bill Of Materials (SBOM) from container images and filesystems

```
valint bom [TARGET] [flags]
```

### Optional flags 
Flags for `bom` subcommand


| Short | Long | Description | Default |
| --- | --- | --- | --- |
| -A | --attach-regex | Attach files content by regex | |
| | --components | Select sbom components groups, options=[metadata layers packages syft files dep commits] | [metadata,layers,packages,syft,files,dep,commits] |
| -e | --env | Envrionment keys to include in sbom | |
| -f | --force | Force overwrite cache | |
| -o | --format | Sbom formatter, options=[cyclonedx-json cyclonedx-xml attest-cyclonedx-json statement-cyclonedx-json predicate-cyclonedx-json attest-slsa statement-slsa predicate-slsa] | [cyclonedx-json] |
| | --git-branch | Git branch in the repository | |
| | --git-commit | Git commit hash in the repository | |
| | --git-tag | Git tag in the repository | |
| -h | --help | help for bom | |


### Global options flags
Flags for all `valint` subcommands


| Short | Long | Description | Default |
| --- | --- | --- | --- |
| | --attest.config | Attestation config path | |
| | --attest.default | Attestation default config, options=[sigstore sigstore-github x509 kms] | "sigstore" |
| | --attest.name | Attestation config name | "valint" |
| -c | --config | Configuration file path | |
| | --context-dir | Context dir | |
| -C | --context-type | CI context type, options=[jenkins github circleci local azure gitlab] | "local" |
| -F | --filter-regex | Filter out files by regex | [.*\.pyc,.*\.git/.*] |
| -L | --label | Add Custom labels | |
| -D | --level | Log depth level, options=[panic fatal error warning info debug trace] | |
| -d | --output-directory | Output directory path | "${XDG_CACHE_HOME}/valint" |
| -O | --output-file | Output file name | |
| -n | --product-key | Scribe Project Key | |
| -q | --quiet | Suppress all logging output | |
| -U | --scribe.client-id | Scribe Client ID | |
| -P | --scribe.client-secret | Scribe Client Secret | |
| -E | --scribe.enable | Enable scribe client | |
| -u | --scribe.url | Scribe API Url | "https://api.production.scribesecurity.com" |
| -v | --verbose | Log verbosity level [-v,--verbose=1] = info, [-vv,--verbose=2] = debug | |


### Examples for running `valint bom`

```
  valint bom <target>
  valint bom alpine:latest                         create default (cyclonedxjson) sbom
  valint bom alpine:latest -o cyclonedxxml         create cyclonedx xml sbom
  valint bom alpine:latest -o attest               create intoto attestation of cyclonedx sbom 
  valint bom alpine:latest -o attest-slsa          create intoto attestation of SLSA provenance
  valint bom alpine:latest -vv                     show verbose debug information
  valint bom alpine:latest -vv -A "*/**"           collect files content

  Supports the following image sources:
  valint bom yourrepo/yourimage:tag     defaults to using images from a Docker daemon. If Docker is not present, the image is pulled directly from the registry.

  You can also explicitly specify the scheme to use:
  valint bom docker:yourrepo/yourimage:tag          explicitly use the Docker daemon
  valint bom docker-archive:path/to/yourimage.tar   use a tarball from disk for archives created from "docker save"
  valint bom oci-archive:path/to/yourimage.tar      use a tarball from disk for OCI archives (from Skopeo or otherwise)
  valint bom dir:path/to/yourproject                read directly from a path on disk (any directory)
  valint bom registry:yourrepo/yourimage:tag        pull image directly from a registry (no container runtime required)
  valint bom file:path/to/yourproject/file          read directly from a path on disk (any single file)
  valint bom git:path/to/yourrepository             read directly from a local repository on disk
  valint bom git:path/to/yourrepository.git         read directly from a remote repository on git

```

### SEE ALSO

* [valint](valint.md)	 - Validate integrity of supply chain

