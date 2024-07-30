
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
| ----- | ----- | ----- | ----- |
|  | --all | Include all evidence fields |  |
|  | --columns | List of columns to be displayed | [timestamp,store,ref,context_type,sbomname,product-key,git_url] |
|  | --current | List evidence attached to the current context |  |
|  | --filters | Filters for each evidence property | [] |
| -o | --format | List output format, options=[table json] |  |
|  | --format-encoding | Evidence Format encoding |  |
|  | --format-type | Evidence Format type |  |
|  | --format-version | Evidence Format version |  |
| -h | --help | help for list |  |
| -O | --output-file | File to write output |  |
|  | --tool | Evidence Tool name |  |
|  | --tool-vendor | Evidence Tool vendor |  |
|  | --tool-version | Evidence Tool version |  |
### Global options flags
Flags for all `valint` subcommands

| Short | Long | Description | Default |
| ----- | ----- | ----- | ----- |
|  | --allow-expired | Allow expired certs |  |
|  | --attest.config | Attestation config path |  |
|  | --attest.default | Attestation default config, options=[sigstore sigstore-github x509 x509-env] | "sigstore" |
|  | --backoff | Backoff duration | "15s" |
|  | --ca | x509 CA Chain path |  |
|  | --cache-enable | Enable local cache | true |
|  | --cert | x509 Cert path |  |
| -c | --config | Configuration file path |  |
|  | --context-dir | Context dir |  |
| -C | --context-type | CI context type, options=[jenkins github circleci azure gitlab travis tekton bitbucket local admission] | "local" |
|  | --crl | x509 CRL path |  |
|  | --crl-full-chain | Enable Full chain CRL verfication |  |
|  | --deliverable | Mark as deliverable, options=[true, false] |  |
|  | --depth | Git clone depth |  |
|  | --disable-crl | Disable certificate revocation verificatoin |  |
| -e | --env | Environment keys to include in evidence |  |
| -F | --filter-regex | Filter out files by regex | <p>[</p><p>**/*.pyc,**</p><p>/.git/**]</p> |
|  | --filter-scope | Filter packages by scope |  |
| -G | --gate | Policy Gate name |  |
|  | --git-auth | Git repository authentication info, [format: 'username:password'] |  |
|  | --git-branch | Git branch in the repository |  |
|  | --git-commit | Git commit hash in the repository |  |
|  | --git-tag | Git tag in the repository |  |
|  | --key | x509 Private key path |  |
| -L | --label | Add Custom labels |  |
| -D | --level | Log depth level, options=[panic fatal error warning info debug trace] |  |
|  | --log-context | Attach context to all logs |  |
|  | --log-file | Output log to file |  |
|  | --oci | Enable OCI store |  |
| -R | --oci-repo | Select OCI custom attestation repo |  |
| -d | --output-directory | Output directory path | "${XDG_CACHE_HOME}/valint" |
| -p | --pipeline-name | Pipeline name |  |
|  | --platform | Select target platform, examples=windows/armv6, arm64 ..) |  |
|  | --predicate-type | Custom Predicate type (generic evidence format) | <p>"</p><p>"</p> |
| -n | --product-key | Product Key |  |
| -V | --product-version | Product Version |  |
| -q | --quiet | Suppress all logging output |  |
|  | --rule-args | Policy arguments | [] |
| -U | --scribe.client-id | Scribe Client ID (deprecated) |  |
| -P | --scribe.client-secret | Scribe Client Token |  |
| -E | --scribe.enable | Enable scribe client |  |
| -u | --scribe.url | Scribe API Url | <p>"</p><p>"</p> |
| -s | --show | Print evidence to stdout |  |
|  | --structured | Enable structured logger |  |
|  | --timeout | Timeout duration | "120s" |
| -v | --verbose | Log verbosity level [-v,--verbose=1] = info, [-vv,--verbose=2] = debug |  |
### Examples for running `valint list` 
```
valint list <target>

valint list                                                               list all
valint list alpine:latest                                                 list evidence for target
valint list alpine:latest --product-key test                              list evidence in product
valint list alpine:latest --filters git_branch=master      				  filter results for a specific branch
valint list alpine:latest --columns store,ref,git_branch,product-key      select columns for list table
valint list alpine:latest --filters product-key=abc                       filter for specific columns in list table
valint list alpine:latest -o json                       	              output list in json format
valint list alpine:latest -o json --all                      	          output all evidence field in json format
```
### SEE ALSO
- [﻿valint](valint.md)  - Validate Supply Chain Integrity




<!--- Eraser file: https://app.eraser.io/workspace/oPYaap10SgTT3UAgy0f6 --->