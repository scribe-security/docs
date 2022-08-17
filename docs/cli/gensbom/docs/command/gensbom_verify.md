## gensbom verify

Verify target by BOM attestation

```
gensbom verify [TARGET] [flags]
```

### Examples

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

### Options

```
  -a, --attestation string    Attestation for target
  -h, --help                  help for verify
  -i, --input-format string   Sbom input formatter, options=[attest-cyclonedx-json attest-slsa] (default "attest-cyclonedx-json")
```

### Options inherited from parent commands

```
      --attest.config string          Attestation config path
      --attest.default string         Attestation default config, options=[sigstore sigstore-github x509 kms] (default "sigstore")
      --attest.name string            Attestation config name (default "gensbom")
  -c, --config string                 Config of the application
  -C, --context-type string           Context type, options=[jenkins github circleci local] (default "local")
      --failonerror                   Fail on errors (default true)
  -F, --filter-regex strings          Filter out files by regex (default [.*\.pyc,.*\.git/.*])
  -L, --label strings                 Add custom labels
  -D, --level string                  Log level, options=[panic fatal error warning info debug trace]
  -d, --output-directory string       Output directory path (default "/home/mikey/.cache/gensbom")
  -O, --output-file string            Output file path
  -n, --product-key string            Scribe project key
  -q, --quiet                         Suppress all logging output
  -U, --scribe.client-id string       Scribe client id
  -P, --scribe.client-secret string   Scribe client secret
  -E, --scribe.enable                 Enable scribe client
  -u, --scribe.url string             Scribe url (default "https://api.production.scribesecurity.com")
  -s, --show                          Print report to stdout
  -v, --verbose count                 Increase verbosity (-v = info, -vv = debug)
```

### SEE ALSO

* [gensbom](gensbom.md)	 - Create SBOM for target

