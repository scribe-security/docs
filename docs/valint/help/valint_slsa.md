# valint slsa

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
| | --build-type | Set build type | |
| | --builder-id | Set builder id | |
| | --by-product | Attach by product path | |
| | --components | Select by products components groups, options=[metadata layers packages syft files dep commits] | [metadata,layers] |
| | --external | Add build external parameters | [] |
| | --finished-on | Set metadata finished time (YYYY-MM-DDThh:mm:ssZ) | |
| -f | --force | Force overwrite cache | |
| -o | --format | Evidence format, options=[statement attest predicate] | [statement] |
| -h | --help | help for slsa | |
| | --invocation | Set metadata invocation ID | |
| | --predicate | Import predicate path | |
| | --started-on | Set metadata started time (YYYY-MM-DDThh:mm:ssZ) | |
| | --statement | Import statement path | |


### Global options flags
Flags for all `valint` subcommands


| Short | Long | Description | Default |
| --- | --- | --- | --- |
| | --attest.config | Attestation config path | |
| | --attest.default | Attestation default config, options=[sigstore sigstore-github x509 x509-env] | "sigstore" |
| | --backoff | Backoff duration | "15s" |
| | --ca | x509 CA Chain path | |
| | --cache-enable | Enable local cache | true |
| | --cert | x509 Cert path | |
| -c | --config | Configuration file path | |
| | --context-dir | Context dir | |
| -C | --context-type | CI context type, options=[jenkins github circleci azure gitlab travis tekton bitbucket local] | "local" |
| -e | --env | Environment keys to include in sbom | |
| -F | --filter-regex | Filter out files by regex | [**/*.pyc,**/.git/**] |
| | --filter-scope | Filter packages by scope | |
| | --git-branch | Git branch in the repository | |
| | --git-commit | Git commit hash in the repository | |
| | --git-tag | Git tag in the repository | |
| | --key | x509 Private key path | |
| -L | --label | Add Custom labels | |
| -D | --level | Log depth level, options=[panic fatal error warning info debug trace] | |
| | --log-context | Attach context to all logs | |
| | --log-file | Output log to file | |
| | --oci | Enable OCI store | |
| -R | --oci-repo | Select OCI custom attestation repo | |
| -d | --output-directory | Output directory path | "${XDG_CACHE_HOME}/valint" |
| -O | --output-file | Output file name | |
| -p | --pipeline-name | Pipeline name | |
| | --predicate-type | Custom Predicate type (generic evidence format) | "http://scribesecurity.com/evidence/generic/v0.1" |
| -n | --product-key | Product Key | |
| -V | --product-version | Product Version | |
| -q | --quiet | Suppress all logging output | |
| -U | --scribe.client-id | Scribe Client ID | |
| -P | --scribe.client-secret | Scribe Client Secret | |
| -E | --scribe.enable | Enable scribe client | |
| -u | --scribe.url | Scribe API Url | "https://airflow.scribesecurity.com" |
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

