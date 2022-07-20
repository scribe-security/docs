## bomber bom

Create target BOM (images,dir)

```
bomber bom [TARGET] [flags]
```

### Examples

```
  bomber bom <target>
  bomber bom alpine:latest                         create default (cyclonedxjson) sbom
  bomber bom alpine:latest -o cyclonedxxml         create cyclonedx xml sbom
  bomber bom alpine:latest -vv                     show verbose debug information
  bomber bom alpine:latest -vv -A "*/**"           collect files content

  Supports the following image sources:
  bomber bom yourrepo/yourimage:tag     defaults to using images from a Docker daemon. If Docker is not present, the image is pulled directly from the registry.

  You can also explicitly specify the scheme to use:
  bomber bom docker:yourrepo/yourimage:tag          explicitly use the Docker daemon
  bomber bom docker-archive:path/to/yourimage.tar   use a tarball from disk for archives created from "docker save"
  bomber bom oci-archive:path/to/yourimage.tar      use a tarball from disk for OCI archives (from Skopeo or otherwise)
  bomber bom dir:path/to/yourproject                read directly from a path on disk (any directory)
  bomber bom registry:yourrepo/yourimage:tag        pull image directly from a registry (no container runtime required)
  bomber bom file:path/to/yourproject/file          read directly from a path on disk (any single file)

```

### Options

```
  -A, --attach-regex strings             Attach files content by regex
      --components strings               Select sbom components groups, options=[metadata layers packages files dep] (default [metadata,layers,packages,files,dep])
      --context-dir string               Context dir
  -C, --context-type string              Context type, options=[jenkins github local] (default "local")
  -e, --env strings                      Envrionment keys to include in sbom
  -f, --force                            Force overwrite cache
  -o, --format strings                   Sbom formatter, options=[cyclonedx-json cyclonedx-xml attest-cyclonedx-json statement-cyclonedx-json predicate-cyclonedx-json] (default [cyclonedx-json])
  -h, --help                             help for bom
  -L, --label strings                    Label to connect to sboms
  -n, --name string                      Bomb custom/project name
      --normalizers.packagejson.enable   Normalize package json files (default true)
```

### Options inherited from parent commands

```
      --attest.config string         Attestation config map
      --attest.default string        Attestation default config, options=[sigstore sigstore-github x509 kms] (default "sigstore")
      --attest.name string           Attestation config name (default "bomber")
  -c, --config string                Application config file
      --failonerror                  Fail on errors (default true)
      --filter-purl strings          Filter out purls by regex
  -F, --filter-regex strings         Filter out files by regex (default [.*\.pyc,.*\.git/.*])
  -d, --output-directory string      Report output directory (default "/home/mikey/.cache/bomber")
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

* [bomber](bomber.md)	 - Generate a source SBOM

