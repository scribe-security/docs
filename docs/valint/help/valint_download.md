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
| -o | --format | Evidence format, options=[attest-cyclonedx-json attest-slsa statement-slsa statement-cyclonedx-json statement-generic attest-generic ] | |
| -h | --help | help for download | |
| | --payload | path of the decoded payload | |
| | --ref | Evidence store refrence | |
| | --store | Select evidence store | |


### Global options flags
Flags for all `valint` subcommands


| Short | Long | Description | Default |
| --- | --- | --- | --- |
| | --allow-expired | Allow expired certs | |
| | --attest.config | Attestation config path | |
| | --attest.default | Attestation default config, options=[sigstore sigstore-github x509 x509-env] | "sigstore" |
| | --backoff | Backoff duration | "15s" |
| | --ca | x509 CA Chain path | |
| | --cache-enable | Enable local cache | true |
| | --cert | x509 Cert path | |
| -c | --config | Configuration file path | |
| | --context-dir | Context dir | |
| -C | --context-type | CI context type, options=[jenkins github circleci azure gitlab travis tekton bitbucket local admission] | "local" |
| | --crl | x509 CRL path | |
| | --crl-full-chain | Enable Full chain CRL verfication | |
| | --deliverable | Mark as deliverable, options=[true, false] | |
| | --depth | Git clone depth | |
| | --disable-crl | Disable certificate revocation verificatoin | |
| -e | --env | Environment keys to include in evidence | |
| -F | --filter-regex | Filter out files by regex | [**/*.pyc,**/.git/**] |
| | --filter-scope | Filter packages by scope | |
| -G | --gate | Policy Gate name | |
| | --git-auth | Git repository authentication info, [format: 'username:password'] | |
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
| | --platform | Select target platform, examples=windows/armv6, arm64 ..) | |
| | --predicate-type | Custom Predicate type (generic evidence format) | "http://scribesecurity.com/evidence/generic/v0.1" |
| -n | --product-key | Product Key | |
| -V | --product-version | Product Version | |
| -q | --quiet | Suppress all logging output | |
| | --rule-args | Policy arguments | [] |
| -U | --scribe.client-id | Scribe Client ID (deprecated) | |
| -P | --scribe.client-secret | Scribe Client Token | |
| -E | --scribe.enable | Enable scribe client | |
| -u | --scribe.url | Scribe API Url | "https://api.scribesecurity.com" |
| -s | --show | Print evidence to stdout | |
| | --structured | Enable structured logger | |
| | --timeout | Timeout duration | "120s" |
| -v | --verbose | Log verbosity level [-v,--verbose=1] = info, [-vv,--verbose=2] = debug | |


### Examples for running `valint download`

```
 valint download <target>
<target> Target object name format=[<image:tag>, <dir path>, <git url>, <file path]

valint download alpine:latest                                            download default (cyclonedxjson) sbom downloads to cache
valint download alpine:latest --format statement                         download sbom with specified format
valint download alpine:latest --format statement --output-file <path>    download sbom with specified format in the specified output file
valint download --ref <ref>                                              download sbom by ref (default storer is cache)
valint download --ref <ref> --store <storer>                             download sbom by ref and storer
valint download --ref <ref> --store <storer> --output-file <path>        download sbom by ref and storer in the specified output directory
valint download alpine:latest --payload <path>                           download evidence payload in the specified output file.

Format-aliases:
* json=attest-cyclonedx-json
* predicate=predicate-cyclonedx-json
* statement=statement-cyclonedx-json
* attest=attest-cyclonedx-json

Storers:
* cache
* scribe

For example, to retrieve the SBOM from signed evidence:
valint bom alpine:latest -o attest
valint download alpine:latest --payload <path>

For example, to retrieve third-party evidence from unsigned evidence:
valint evidence some_file.json
valint download some_file.json -o statement-generic --payload <path>

```

### SEE ALSO

* [valint](valint.md)	 - Validate Supply Chain Integrity

