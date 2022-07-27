## gensbom

Create SBOM for target

### Synopsis

Generate Software Bill Of Materials (SBOM) from container images and filesystems

```
gensbom [TARGET] [flags]
```

### Examples

```
  gensbom  <target>
  gensbom  alpine:latest                         create default (cyclonedxjson) sbom
  gensbom  alpine:latest -o cyclonedxxml         create cyclonedx xml sbom
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

```

### Options

```
  -A, --attach-regex strings             Attach files content by regex
      --attest.config string             Attestation config map
      --attest.default string            Attestation default config, options=[sigstore sigstore-github x509 kms] (default "sigstore")
      --attest.name string               Attestation config name (default "gensbom")
      --components strings               Select sbom components groups, options=[metadata layers packages files dep] (default [metadata,layers,packages,files,dep])
  -c, --config string                    Application config file
      --context-dir string               Context dir
  -C, --context-type string              Context type, options=[jenkins github local] (default "local")
  -e, --env strings                      Envrionment keys to include in sbom
      --failonerror                      Fail on errors (default true)
      --filter-purl strings              Filter out purls by regex
  -F, --filter-regex strings             Filter out files by regex (default [.*\.pyc,.*\.git/.*])
  -f, --force                            Force overwrite cache
  -o, --format strings                   Sbom formatter, options=[cyclonedx-json cyclonedx-xml attest-cyclonedx-json statement-cyclonedx-json predicate-cyclonedx-json] (default [cyclonedx-json])
  -h, --help                             help for gensbom
  -L, --label strings                    Label to connect to sboms
      --normalizers.packagejson.enable   Normalize package json files (default true)
  -d, --output-directory string          Report output directory (default "/home/mikey/.cache/gensbom")
      --output-file string               Output result to file
  -n, --product-key string               Bomb custom/project name
  -q, --quiet                            Suppress all logging output
  -U, --scribe.clientid string           Scribe client id
  -P, --scribe.clientsecret string       Scribe client secret
  -E, --scribe.enable                    Enable scribe client
  -u, --scribe.url string                Scribe url (default "https://api.production.scribesecurity.com")
  -s, --show                             Print object to stdout
  -v, --verbose count                    Increase verbosity (-v = info, -vv = debug)
```

### SEE ALSO

* [gensbom bom](gensbom_bom.md)	 - Create SBOM for target
* [gensbom verify](gensbom_verify.md)	 - Verify target by BOM attestation

