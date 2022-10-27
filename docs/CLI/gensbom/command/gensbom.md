## gensbom

Create SBOM for target

### Synopsis

Generate Software Bill Of Materials (SBOM) from container images and filesystems

```
gensbom [TARGET] [flags]
```

### Optional flags 
Flags for `gensbom`


| Short | Long | Description | Default |
| --- | --- | --- | --- |
| -A | --attach-regex | Attach files content by regex | |
| | --attest.config | Attestation config path | |
| | --attest.default | Attestation default config, options=[sigstore sigstore-github x509 kms] | "sigstore" |
| | --attest.name | Attestation config name | "gensbom" |
| | --components | Select sbom components groups, options=[metadata layers packages syft files dep commits] | [metadata,layers,packages,syft,files,dep,commits] |
| -c | --config | Configuration file path | |
| | --context-dir | Context dir | |
| -C | --context-type | CI context type, options=[jenkins github circleci local gitlab] | "local" |
| -e | --env | Envrionment keys to include in sbom | |
| -F | --filter-regex | Filter out files by regex | [.*\.pyc,.*\.git/.*] |
| -f | --force | Force overwrite cache | |
| -o | --format | Sbom formatter, options=[cyclonedx-json cyclonedx-xml attest-cyclonedx-json statement-cyclonedx-json predicate-cyclonedx-json attest-slsa statement-slsa predicate-slsa] | [cyclonedx-json] |
| | --git-auth | Git repository authentication info, [format: 'username:password'] | |
| | --git-branch | Git branch in the repository | |
| | --git-commit | Git commit hash in the repository | |
| | --git-tag | Git tag in the repository | |
| -h | --help | help for gensbom | |
| -L | --label | Add Custom labels | |
| -D | --level | Log depth level, options=[panic fatal error warning info debug trace] | |
| -d | --output-directory | Output directory path | "${XDG_CACHE_HOME}/gensbom" |
| -O | --output-file | Output file name | |
| -n | --product-key | Scribe Project Key | |
| -q | --quiet | Suppress all logging output | |
| -U | --scribe.client-id | Scribe Client ID | |
| -P | --scribe.client-secret | Scribe Client Secret | |
| -E | --scribe.enable | Enable scribe client | |
| -u | --scribe.url | Scribe API Url | "https://api.production.scribesecurity.com" |
| -s | --show | Print report to stdout | |
| -v | --verbose | Log verbosity level (-v = info, -vv = debug) | |


### Examples for running `gensbom`

```
  gensbom  <target>
  gensbom  alpine:latest                         create default (cyclonedxjson) sbom
  gensbom  alpine:latest -o cyclonedxxml         create cyclonedx xml sbom
  gensbom  alpine:latest -o attest               create intoto attestation of cyclonedx sbom 
  gensbom  alpine:latest -o attest-slsa          create intoto attestation of SLSA provenance
  gensbom  alpine:latest -vv                     show verbose debug information
  gensbom  alpine:latest -vv -A "*/**"           collect files content

  Supports the following image sources:
  gensbom  yourrepo/yourimage:tag     defaults to using images from a Docker daemon. If Docker is not present, the image is pulled directly from the registry.

  You can also explicitly specify the scheme to use:
  gensbom  docker:yourrepo/yourimage:tag          explicitly use the Docker daemon
  gensbom  docker-archive:path/to/yourimage.tar   use a tarball from disk for archives created from "docker save"
  gensbom  oci-archive:path/to/yourimage.tar      use a tarball from disk for OCI archives (from Skopeo or otherwise)
  gensbom  dir:path/to/yourproject                read directly from a path on disk (any directory)
  gensbom  registry:yourrepo/yourimage:tag        pull image directly from a registry (no container runtime required)
  gensbom  file:path/to/yourproject/file          read directly from a path on disk (any single file)
  gensbom  git:path/to/yourrepository             read directly from a local repository on disk
  gensbom  git:path/to/yourrepository.git         read directly from a remote repository on git

```

### SEE ALSO

* [gensbom verify](gensbom_verify.md)	 - Verify Software Bill Of Materials (SBOM) from container images and filesystems

