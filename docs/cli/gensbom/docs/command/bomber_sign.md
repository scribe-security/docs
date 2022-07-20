## bomber sign

Sign external or local or cached BOM, creates statement/attestation

```
bomber sign [TARGET] [flags]
```

### Examples

```
  bomber sign <target>
  bomber sign file:./sbom.json sign a external file
  bomber sign docker:yourrepo/yourimage:tag          explicitly use the Docker daemon
  bomber sign docker-archive:path/to/yourimage.tar   use a tarball from disk for archives created from "docker save"
  bomber sign oci-archive:path/to/yourimage.tar      use a tarball from disk for OCI archives (from Skopeo or otherwise)
  bomber sign dir:path/to/yourproject                read directly from a path on disk (any directory)
  bomber sign registry:yourrepo/yourimage:tag        pull image directly from a registry (no container runtime required)

```

### Options

```
  -C, --context-type string   Snapshot header types, options=[jenkins github local] (default "local")
  -f, --force                 Force overwrite cache
  -o, --format string         Sbom output formatter, options=[attest-cyclonedx-json statement-cyclonedx-json predicate-cyclonedx-json] (default "attest-cyclonedx-json")
  -h, --help                  help for sign
  -i, --inputformat string    Sbom input formatter, options=[cyclonedx-json cyclonedx-xml] (default "cyclonedx-json")
  -n, --name string           Custom/project name
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

