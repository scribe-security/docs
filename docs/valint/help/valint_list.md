## valint list

List evidence command

### Synopsis

List evidence in all evidence stores

```
valint list [flags]
```

### Optional flags 
Flags for `list` subcommand


| Short | Long | Description | Default |
| --- | --- | --- | --- |
| | --columns | List of columns to be displayed | [timestamp,store,ref,sbomname,product-key,git_url] |
| | --current | List evidence attached to the current context | |
| | --filters | Filters for each evidence property | [] |
| -h | --help | help for list | |


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
| -C | --context-type | CI context type, options=[jenkins github circleci azure gitlab travis tekton bitbucket local] | "local" |
| | --crl | x509 CRL path | |
| | --crl-full-chain | Enable Full chain CRL verfication | |
| | --deliverable | Mark as deliverable, options=[true, false] | |
| | --depth | Git clone depth | |
| | --disable-crl | Disable certificate revocation verificatoin | |
| -e | --env | Environment keys to include in evidence | |
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
| | --platform | Select target platform, examples=windows/armv6, arm64 ..) | |
| | --predicate-type | Custom Predicate type (generic evidence format) | "http://scribesecurity.com/evidence/generic/v0.1" |
| -n | --product-key | Product Key | |
| -V | --product-version | Product Version | |
| -q | --quiet | Suppress all logging output | |
| | --rule-args | Policy arguments | [] |
| -U | --scribe.client-id | Scribe Client ID | |
| -P | --scribe.client-secret | Scribe Client Secret | |
| -E | --scribe.enable | Enable scribe client | |
| -u | --scribe.url | Scribe API Url | "https://api.scribesecurity.com" |
| -s | --show | Print evidence to stdout | |
| | --structured | Enable structured logger | |
| | --timeout | Timeout duration | "120s" |
| -v | --verbose | Log verbosity level [-v,--verbose=1] = info, [-vv,--verbose=2] = debug | |


### Examples for running `valint list`

```
  valint list <target>

  valint list                                                               list all
  valint list alpine:latest                                                 list evidence for target
  valint list alpine:latest --product-key test                              list evidence in product
  valint list alpine:latest --filters git_branch=master      				  filter results for a specific branch
  valint list alpine:latest --columns store,ref,git_branch,product-key      select columns for list table

```

### SEE ALSO

* [valint](valint.md)	 - Validate Supply Chain Integrity

