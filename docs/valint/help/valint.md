## valint

Validate Supply Chain Integrity

### Synopsis

Command Line Interpreter (CLI) tool,that empowers supply chain stakeholders to ensure supply chain integrity, verify compliance, and generate and manage evidence.

### Optional flags 
Flags for `valint`


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
| -h | --help | help for valint | |
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


### SEE ALSO

* [valint bom](valint_bom.md)	 - Create evidence command
* [valint download](valint_download.md)	 - Downloads the evidence based on cache
* [valint list](valint_list.md)	 - List evidence command
* [valint slsa](valint_slsa.md)	 - Create SLSA provenance evidence command
* [valint verify](valint_verify.md)	 - Verify compliance policies against evidence to ensure the integrity of supply chain.

