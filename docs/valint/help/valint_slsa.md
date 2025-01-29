## valint slsa

Create SLSA provenance evidence command

### Synopsis

Collect, Create and Store SLSA provenance evidence

```
valint slsa [TARGET] [flags]
```

### Optional flags 
Flags for `slsa` subcommand


| Short | Long | Description | Default |
| --- | --- | --- | --- |
| | --all-env | Attach all environment variables | |
| | --attest.config | Attestation config path | |
| | --attest.default | Attestation default config, options=[sigstore sigstore-github x509 x509-env kms pubkey] | |
| | --build-type | Set build type | |
| | --builder-id | Set builder id | |
| | --by-product | Attach by product path | |
| | --ca | x509 CA Chain path | |
| | --cert | x509 Cert path | |
| | --components | Select by products components groups, options=[metadata layers packages syft files dep commits base_image] | [metadata,layers] |
| | --crl | x509 CRL path | |
| | --crl-full-chain | Enable Full chain CRL verfication | |
| | --depth | Git clone depth | |
| | --disable-crl | Disable certificate revocation verificatoin | |
| | --external | Add build external parameters | [] |
| | --finished-on | Set metadata finished time (YYYY-MM-DDThh:mm:ssZ) | |
| -f | --force | Force overwrite cache | |
| -o | --format | Evidence format, options=[statement attest] | |
| | --git-auth | Git repository authentication info, [format: 'username:password'] | |
| | --git-branch | Git branch in the repository | |
| | --git-commit | Git commit hash in the repository | |
| | --git-tag | Git tag in the repository | |
| -h | --help | help for slsa | |
| | --invocation | Set metadata invocation ID | |
| | --key | x509 Private key path | |
| | --kms | Provide KMS key reference | |
| | --oci | Enable OCI store | |
| -R | --oci-repo | Select OCI custom attestation repo | |
| | --pass | Private key password | |
| | --payload | path of the decoded payload | |
| | --platform | Select target platform, examples=windows/armv6, arm64 ..) | |
| | --predicate | Import predicate path | |
| | --pubkey | Public key path | |
| -y | --skip-confirmation | Skip Sigstore Confirmation | |
| | --started-on | Set metadata started time (YYYY-MM-DDThh:mm:ssZ) | |
| | --statement | Import statement path | |


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
| | --input | Input Evidence target, format (<parser>:<file> or <scheme>:<name>:<tag>) | |
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


### Examples for running `valint slsa`

```
  valint slsa <target>
  
  <target> Target object name format=[<image:tag>, <dir path>, <git url>]

  valint slsa alpine:latest                                               create In-toto statement of SLSA provenance (default)
  valint slsa alpine:latest -o statement                                  create In-toto statement of SLSA provenance
  valint slsa alpine:latest -o attest                                     create In-toto attestation of SLSA provenance
  valint slsa alpine:latest --predicate custom.predicate.json             use custom SLSA provenance predicate
  valint slsa alpine:latest --statement custom.statement.json             use custom SLSA provenance statement
  valint slsa alpine:latest --by-product build.log.txt                    attach build products
  valint slsa alpine:latest --components layers,packages,files            attach target components by products
  valint slsa alpine:latest --all-env                                     attach all environment
  valint slsa alpine:latest --env MY_ENV                                  attach specific environment
  valint slsa alpine:latest --invocation my_invocation                    set invocation id
  valint slsa alpine:latest --started-on 2023-07-25T15:30:00Z             set started on

  Supports the following image sources:
  valint slsa yourrepo/yourimage:tag     defaults to using images from a Docker daemon. If Docker is not present, the image is pulled directly from the registry.

  You can also explicitly specify the scheme to use:
  valint slsa docker:yourrepo/yourimage:tag          explicitly use the Docker daemon
  valint slsa podman:yourrepo/yourimage:tag          explicitly use the Podman daemon
  valint slsa docker-archive:path/to/yourimage.tar   use a tarball from disk for archives created from "docker save"
  valint slsa oci-archive:path/to/yourimage.tar      use a tarball from disk for OCI archives (from Skopeo or otherwise)
  valint slsa dir:path/to/yourproject                read directly from a path on disk (any directory)
  valint slsa registry:yourrepo/yourimage:tag        pull image directly from a registry (no container runtime required)
  valint slsa file:path/to/yourproject/file          read directly from a path on disk (any single file)
  valint slsa git:path/to/yourrepository             read directly from a local repository on disk
  valint slsa git:https://github.com/yourrepository.git         read directly from a remote repository on git

```

### SEE ALSO

* [valint](valint.md)	 - Validate Supply Chain Integrity

