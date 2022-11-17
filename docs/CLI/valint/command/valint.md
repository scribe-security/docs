## valint

Validate integrity of supply chain

### Synopsis

Command Line Interpreter (CLI) tool developed by Scribe, that validates the integrity of your build.
	
At the end of your pipeline run, decide to accept or fail a build, depending on the integrity analysis result reported by Scribe.

### Optional flags 
Flags for `valint`


| Short | Long | Description | Default |
| --- | --- | --- | --- |
| | --attest.config | Attestation config path | |
| | --attest.default | Attestation default config, options=[sigstore sigstore-github x509 kms] | "sigstore" |
| | --attest.name | Attestation config name | "valint" |
| -c | --config | Configuration file path | |
| | --context-dir | Context dir | |
| -C | --context-type | CI context type, options=[jenkins github circleci local azure gitlab] | "local" |
| -F | --filter-regex | Filter out files by regex | [.*\.pyc,.*\.git/.*] |
| -h | --help | help for valint | |
| -L | --label | Add Custom labels | |
| -D | --level | Log depth level, options=[panic fatal error warning info debug trace] | |
| -d | --output-directory | Output directory path | "${XDG_CACHE_HOME}/valint" |
| -O | --output-file | Output file name | |
| -n | --product-key | Scribe Project Key | |
| -q | --quiet | Suppress all logging output | |
| -U | --scribe.client-id | Scribe Client ID | |
| -P | --scribe.client-secret | Scribe Client Secret | |
| -E | --scribe.enable | Enable scribe client | |
| -u | --scribe.url | Scribe API Url | "https://api.production.scribesecurity.com" |
| -v | --verbose | Log verbosity level (-v = info, -vv = debug) | |


### SEE ALSO

* [valint bom](valint_bom.md)	 - Create SBOM for target
* [valint report](valint_report.md)	 - Download integrity report from Scribe service
* [valint verify](valint_verify.md)	 - Verify Software Bill Of Materials (SBOM) from container images and filesystems

