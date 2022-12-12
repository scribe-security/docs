## valint verify

Verify Software Bill Of Materials (SBOM) from container images and filesystems

```
valint verify [TARGET] [flags]
```

### Optional flags 
Flags for `verify` subcommand


| Short | Long | Description | Default |
| --- | --- | --- | --- |
| -a | --attestation | Attestation for target | |
| -h | --help | help for verify | |
| -i | --input-format | Sbom input formatter, options=[attest-cyclonedx-json attest-slsa] | "attest-cyclonedx-json" |


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
| -v | --verbose | Log verbosity level (-v = info, -vv = debug) | |


### Examples for running `valint verify`

```
  valint verify <target>
  valint verify alpine:latest                         verify target against signed attestation of sbom
  valint verify alpine:latest -i attest-slsa          verify target against signed attestation of SLSA provenance
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

```

### SEE ALSO

* [valint](valint.md)	 - Validate integrity of supply chain

