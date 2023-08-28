## valint download

Downloads the evidence based on cache

```
valint download [TARGET] [flags]
```

### Optional flags 
Flags for `download` subcommand


| Short | Long | Description | Default |
| --- | --- | --- | --- |
| | --folder-path | Folder to download the evidences of the given target | |
| | --format | Evidence format, options=[attest-cyclonedx-json attest-slsa statement-slsa statement-cyclonedx-json statement-generic attest-generic] | "attest-cyclonedx-json" |
| -h | --help | help for download | |
| | --ref | ref of the store | |
| | --store | Stores | "cache" |


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


### Examples for running `valint download`

```
 valint download <target>
<target> Target object name format=[<image:tag>, <dir path>, <git url>]

valint download alpine:latest                                            download default (cyclonedxjson) sbom downloads to cache
valint download alpine:latest --format statement                         download sbom with specified format
valint download alpine:latest --format statement --output-dir <path>     download sbom with specified format in the specified output directory
valint download --ref <ref>                                              download sbom by ref (default storer is cache)
valint download --ref <ref> --store <storer>                             download sbom by ref and storer
valint download --ref <ref> --store <storer> --output-dir <path>         download sbom by ref and storer in the specified output directory

Format-aliases:
* json=attest-cyclonedx-json
* predicate=predicate-cyclonedx-json
* statement=statement-cyclonedx-json
* attest=attest-cyclonedx-json

Storers:
* cache
* scribe

```

### SEE ALSO

* [valint](valint.md)	 - Validate Supply Chain Integrity

