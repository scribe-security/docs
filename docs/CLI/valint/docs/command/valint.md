## valint

Validate integrity of supply chain

### Synopsis

Command Line Interpreter (CLI) tool, that generates evidence the verifies the integrity of your supply chain.

### Optional flags 
Flags for `valint`


| Short | Long | Description | Default |
| --- | --- | --- | --- |
| | --attest.config | Attestation config path | |
| | --attest.default | Attestation default config, options=[sigstore sigstore-github x509] | "sigstore" |
| | --backoff | Backoff duration | "15s" |
| | --cache-enable | Enable local cache | true |
| -c | --config | Configuration file path | |
| | --context-dir | Context dir | |
| -C | --context-type | CI context type, options=[jenkins github circleci azure gitlab travis bitbucket local] | "local" |
| -F | --filter-regex | Filter out files by regex | [**/*.pyc,**/.git/**] |
| | --filter-scope | Filter packages by scope | |
| -h | --help | help for valint | |
| -L | --label | Add Custom labels | |
| -D | --level | Log depth level, options=[panic fatal error warning info debug trace] | |
| | --oci | Enable OCI store | |
| -R | --oci-repo | Select OCI custom attestation repo | |
| -d | --output-directory | Output directory path | "${XDG_CACHE_HOME}/valint" |
| -O | --output-file | Output file name | |
| -n | --product-key | Scribe Project Key | |
| -q | --quiet | Suppress all logging output | |
| -U | --scribe.client-id | Scribe Client ID | |
| -P | --scribe.client-secret | Scribe Client Secret | |
| -E | --scribe.enable | Enable scribe client | |
| -u | --scribe.url | Scribe API Url | "https://api.production.scribesecurity.com" |
| | --timeout | Timeout duration | "120s" |
| -v | --verbose | Log verbosity level [-v,--verbose=1] = info, [-vv,--verbose=2] = debug | |


### SEE ALSO

* [valint bom](valint_bom.md)	 - Create SBOM for target
* [valint verify](valint_verify.md)	 - Verify target evidence

s

