## gensbom find

Find target BOM

```
gensbom find [TARGET] [flags]
```

### Examples

```
  gensbom find <target>
  gensbom find alpine:latest                         find files (cyclondx, statements, attestations) for target
  gensbom find alpine:latest -vv                     show verbose debug information

  Supports the following image sources:
  gensbom find yourrepo/yourimage:tag     defaults to using images from a Docker daemon. If Docker is not present, the image is pulled directly from the registry.

  You can also explicitly specify the scheme to use:
  gensbom find docker:yourrepo/yourimage:tag          explicitly use the Docker daemon
  gensbom find docker-archive:path/to/yourimage.tar   use a tarball from disk for archives created from "docker save"
  gensbom find oci-archive:path/to/yourimage.tar      use a tarball from disk for OCI archives (from Skopeo or otherwise)
  gensbom find dir:path/to/yourproject                read directly from a path on disk (any directory)
  gensbom find registry:yourrepo/yourimage:tag        pull image directly from a registry (no container runtime required)
  gensbom find file:path/to/yourproject/file          read directly from a path on disk (any single file)

```

### Options

```
  -a, --all             Find all output types
  -o, --format string   Sbom formatter, options=[cyclonedx-json cyclonedx-xml attest-cyclonedx-json statement-cyclonedx-json predicate-cyclonedx-json] (default "cyclonedx-json")
  -h, --help            help for find
```

### Options inherited from parent commands

```
      --attest.config string         Attestation config map
      --attest.default string        Attestation default config, options=[sigstore sigstore-github x509 kms] (default "sigstore")
      --attest.name string           Attestation config name (default "gensbom")
  -c, --config string                Application config file
      --failonerror                  Fail on errors (default true)
      --filter-purl strings          Filter out purls by regex
  -F, --filter-regex strings         Filter out files by regex (default [.*\.pyc,.*\.git/.*])
  -d, --output-directory string      Report output directory (default "/home/mikey/.cache/gensbom")
      --output-file string           Output result to file
  -q, --quiet                        Suppress all logging output
  -U, --scribe.clientid string       Scribe client id
  -P, --scribe.clientsecret string   Scribe client secret
  -E, --scribe.enable                Enable scribe client
  -u, --scribe.url string            Scribe url (default "https://api.production.scribesecurity.com")
  -s, --show                         Print object to stdout
  -v, --verbose count                Increase verbosity (-v = info, -vv = debug)
```

### SEE ALSO

* [gensbom](gensbom.md)	 - Generate a source SBOM

