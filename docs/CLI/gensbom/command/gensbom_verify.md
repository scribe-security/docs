## gensbom verify

Verify Software Bill Of Materials (SBOM) from container images and filesystems

```
gensbom verify [TARGET] [flags]
```

### Optional flags 
Flags for `verify` subcommand


| Short | Long | Description | Default |
| --- | --- | --- | --- |
| -a | --attestation | Attestation for target | |
| -f | --force | Force skip cache | |
| -h | --help | help for verify | |
| -i | --input-format | Sbom input formatter, options=[attest-cyclonedx-json attest-slsa statement-slsa statement-cyclonedx-json] | "attest-cyclonedx-json" |


### Global options flags
Flags for all `gensbom` subcommands


| Short | Long | Description | Default |
| --- | --- | --- | --- |
| | --attest.config | Attestation config path | |
| | --attest.default | Attestation default config, options=[sigstore sigstore-github x509 kms] | "sigstore" |
| | --attest.name | Attestation config name | "gensbom" |
| -c | --config | Configuration file path | |
| | --context-dir | Context dir | |
| -C | --context-type | CI context type, options=[jenkins github circleci local azure gitlab] | "local" |
| -F | --filter-regex | Filter out files by regex | [.*\.pyc,.*\.git/.*] |
| -L | --label | Add Custom labels | |
| -D | --level | Log depth level, options=[panic fatal error warning info debug trace] | |
| | --oci | Enable OCI store | |
| -R | --oci-repo | Select OCI custom attestation repo | |
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


### Examples for running `gensbom verify`

```
  gensbom verify <target>
  gensbom verify alpine:latest                         verify target against signed attestation of sbom
  gensbom verify alpine:latest -i attest-slsa          verify target against signed attestation of SLSA provenance
  gensbom verify alpine:latest -vv                     show verbose debug information

  Supports the following image sources:
  gensbom verify yourrepo/yourimage:tag     defaults to using images from a Docker daemon. If Docker is not present, the image is pulled directly from the registry.

  You can also explicitly specify the scheme to use:
  gensbom verify docker:yourrepo/yourimage:tag          explicitly use the Docker daemon
  gensbom verify docker-archive:path/to/yourimage.tar   use a tarball from disk for archives created from "docker save"
  gensbom verify oci-archive:path/to/yourimage.tar      use a tarball from disk for OCI archives (from Skopeo or otherwise)
  gensbom verify dir:path/to/yourproject                read directly from a path on disk (any directory)
  gensbom verify registry:yourrepo/yourimage:tag        pull image directly from a registry (no container runtime required)
  gensbom verify file:path/to/yourproject/file          read directly from a path on disk (any single file)

```

### SEE ALSO

* [gensbom](gensbom.md)	 - Create SBOM for target

