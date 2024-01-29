## valint evidence

Add file as evidence command

### Synopsis

Collect, Create and Store any file as evidence

```
valint evidence [TARGET] [flags]
```

### Optional flags 
Flags for `evidence` subcommand


| Short | Long | Description | Default |
| --- | --- | --- | --- |
| | --compress | Compress content) | |
| -o | --format | Evidence format, options=[statement attest] | [statement] |
| | --format-encoding | Format encoding | |
| | --format-type | Format type | |
| | --format-version | Format version | |
| -h | --help | help for evidence | |
| | --tool | Tool name | |
| | --tool-vendor | Tool vendor | |
| | --tool-version | Tool version | |


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


### Examples for running `valint evidence`

```
  valint evidence <file>

  <file> File Path to add as evidence

  valint evidence file.json                                                                   Attach a file as evidence
  valint evidence file.json -o attest                                                         Sign evidence
  valint evidence file.json --tool my_tool --tool-version 0.0.1 --vendor="My Company Inc"     Customize tool information
  valint evidence file.json --format my_format --format-version 0.0.1 --format-encoding=xml   Customize format information
  valint evidence file.json --predicate-type https:/my_company.com/my_predicate/v1            Customize predicate type
  valint evidence file.json --compress                                                        Compress content

```

### SEE ALSO

* [valint](valint.md)	 - Validate Supply Chain Integrity

