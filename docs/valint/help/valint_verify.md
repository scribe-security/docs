## valint verify

Verify compliance policies against evidence to ensure the integrity of supply chain.

### Synopsis

Verify compliance policies against evidence to ensure the integrity of supply chain.

```
valint verify [TARGET] [flags]
```

### Optional flags 
Flags for `verify` subcommand


| Short | Long | Description | Default |
| --- | --- | --- | --- |
| | --attest.config | Attestation config path | |
| | --attest.default | Attestation default config, options=[sigstore sigstore-github x509 x509-env kms pubkey] | |
| -a | --attestation | Attestation for target | |
| | --bom | Create target SBOM evidence | |
| | --bundle | Policy bundle uri/path (early-availability) | "https://github.com/scribe-public/sample-policies" |
| | --bundle-auth | Bundle repository authentication info, [format: 'username:password'] | |
| | --bundle-branch | Bundle branch in the repository | |
| | --bundle-commit | Bundle commit hash in the repository | |
| | --bundle-depth | Bundle clone depth | |
| | --bundle-tag | Bundle tag in the repository | |
| | --ca | x509 CA Chain path | |
| | --cert | x509 Cert path | |
| | --common-name | Default policy allowed common names | |
| | --crl | x509 CRL path | |
| | --crl-full-chain | Enable Full chain CRL verfication | |
| | --depth | Git clone depth | |
| | --disable-crl | Disable certificate revocation verificatoin | |
| | --email | Default policy allowed emails | |
| -f | --force | Force skip cache | |
| | --git-auth | Git repository authentication info, [format: 'username:password'] | |
| | --git-branch | Git branch in the repository | |
| | --git-commit | Git commit hash in the repository | |
| | --git-tag | Git tag in the repository | |
| -h | --help | help for verify | |
| | --initiative | Run only rules with specified initiative | |
| -i | --input-format | Evidence format, options=[attest-cyclonedx-json attest-slsa statement-slsa statement-cyclonedx-json statement-generic attest-generic ] | |
| | --key | x509 Private key path | |
| | --kms | Provide KMS key reference | |
| | --oci | Enable OCI store | |
| -R | --oci-repo | Select OCI custom attestation repo | |
| | --pass | Private key password | |
| | --platform | Select target platform, examples=windows/armv6, arm64 ..) | |
| | --policy | Policy configuration file path (early-availability) | |
| | --provenance | Create target SLSA Provenance evidence | |
| | --pubkey | Public key path | |
| | --public-key | Public key path | |
| | --rule | Rule configuration file path (early-availability) | |
| | --rule-args | Policy arguments | [] |
| | --rule-label | Run only rules with specified label | |
| | --skip-bundle | Skip bundle download | |
| | --skip-report | Skip Policy report stage | |
| | --uri | Default policy allowed uris | |


### Global options flags
Flags for all `valint` subcommands


| Short | Long | Description | Default |
| --- | --- | --- | --- |
| | --cache-enable | Enable local cache | true |
| -c | --config | Configuration file path | |
| -C | --context-type | CI context type, options=[jenkins github circleci azure gitlab travis tekton bitbucket local admission] | |
| | --deliverable | Mark as deliverable, options=[true, false] | |
| -e | --env | Environment keys to include in evidence | |
| -G | --gate | Policy Gate name | |
| -L | --label | Add Custom labels | |
| | --level | Log depth level, options=[panic fatal error warning info debug trace] | |
| | --log-context | Attach context to all logs | |
| | --log-file | Output log to file | |
| -d | --output-directory | Output directory path | "$\{XDG_CACHE_HOME\}/valint" |
| -O | --output-file | Output file name | |
| -p | --pipeline-name | Pipeline name | |
| | --predicate-type | Custom Predicate type (generic evidence format) | "http://scribesecurity.com/evidence/generic/v0.1" |
| -n | --product-key | Product Key | |
| -V | --product-version | Product Version | |
| -q | --quiet | Suppress all logging output | |
| -U | --scribe.client-id | Scribe Client ID (deprecated) | |
| -P | --scribe.client-secret | Scribe Client Token | |
| -D | --scribe.disable | Disable scribe client | |
| -E | --scribe.enable | Enable scribe client (deprecated) | |
| -u | --scribe.url | Scribe API Url | "https://api.scribesecurity.com" |
| -s | --show | Print evidence to stdout | |
| | --structured | Enable structured logger | |
| | --timeout | Timeout duration | "120s" |
| -v | --verbose | Log verbosity level [-v,--verbose=1] = info, [-vv,--verbose=2] = debug | |


### Examples for running `valint verify`

```
  valint verify <target>
  
  <target> Target object name format=[<image:tag>, <dir path>, <git url>] (Optional)

  valint verify alpine:latest                                                 verify target against signed attestation of sbom
  valint verify alpine:latest -i attest-slsa                                  verify target against signed attestation of SLSA provenance
  valint verify file.json -i attest-generic 	  	                          verify file as evidence
  valint verify alpine:latest                                                 show verbose debug information
  valint verify alpine:latest --rule policies/images/fresh-image.yaml         verify images freshness (early-availability)
  valint verify busybox:latest --rule policies/sboms/complete-licenses.yaml   verify complete licences (early-availability)

  Target-less Operation:
  valint verify   evaluate policy without specifying a target subject


  Supports the following image sources:
  valint verify yourrepo/yourimage:tag     defaults to using images from a Docker daemon. If Docker is not present, the image is pulled directly from the registry.

  You can also explicitly specify the scheme to use:
  valint verify docker:yourrepo/yourimage:tag          explicitly use the Docker daemon
  valint verify docker-archive:path/to/yourimage.tar   use a tarball from disk for archives created from "docker save"
  valint verify oci-archive:path/to/yourimage.tar      use a tarball from disk for OCI archives (from Skopeo or otherwise)
  valint verify dir:path/to/yourproject                read directly from a path on disk (any directory)
  valint verify registry:yourrepo/yourimage:tag        pull image directly from a registry (no container runtime required)
  valint verify file:path/to/yourproject/file          read directly from a path on disk (any single file)

  SBOM-Example:
  valint bom alpine:latest -o attest
  valint verify alpine:latest -i attest

  SLSA-Example:
  valint slsa alpine:latest -o attest
  valint verify alpine:latest -i attest-slsa

  Generic-Example:
  valint evidence file.json -o attest
  valint verify file.sjon -i attest-generic

  Input-Format-aliases:
  * statement=statement-cyclonedx-json
  * attest=attest-cyclonedx-json

```

### SEE ALSO

* [valint](valint.md)	 - Validate Supply Chain Integrity

