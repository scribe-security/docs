## bomber

Generate a source SBOM

### Synopsis

Generate Software Bill Of Materials (SBOM) from container images and filesystems

```
bomber [command] [IMAGE] [flags]
```

### Options

```
      --attest.config string         Attestation config map
      --attest.default string        Attestation default config, options=[sigstore sigstore-github x509 kms] (default "sigstore")
      --attest.name string           Attestation config name (default "bomber")
  -c, --config string                Application config file
      --failonerror                  Fail on errors (default true)
      --filter-purl strings          Filter out purls by regex
  -F, --filter-regex strings         Filter out files by regex (default [.*\.pyc,.*\.git/.*])
  -h, --help                         help for bomber
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

* [bomber bom](bomber_bom.md)	 - Create target BOM (images,dir)
* [bomber find](bomber_find.md)	 - Find target BOM
* [bomber sign](bomber_sign.md)	 - Sign external or local or cached BOM, creates statement/attestation
* [bomber verify](bomber_verify.md)	 - Verify target by BOM attestation

