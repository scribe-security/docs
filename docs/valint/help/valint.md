## valint

Validate Supply Chain Integrity

### Synopsis

Command Line Interpreter (CLI) tool,that empowers supply chain stakeholders to ensure supply chain integrity, verify compliance, and generate and manage evidence.

### Optional flags 
Flags for `valint`


| Short | Long | Description | Default |
| --- | --- | --- | --- |
| | --cache-enable | Enable local cache | true |
| -c | --config | Configuration file path | |
| -C | --context-type | CI context type, options=[jenkins github circleci azure gitlab travis tekton bitbucket teamcity local admission] | |
| | --deliverable | Mark as deliverable, options=[true, false] | |
| -e | --env | Environment keys to include in evidence | |
| -G | --gate | Policy Gate name | |
| -h | --help | help for valint | |
| | --input | Input Evidence target, format (\<parser\>:\<file\> or \<scheme\>:\<name\>:\<tag\>) | |
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


### SEE ALSO

* [valint bom](valint_bom.md)	 - Create evidence command
* [valint discard](valint_discard.md)	 - Discard evidence
* [valint download](valint_download.md)	 - Downloads the evidence based on cache
* [valint evidence](valint_evidence.md)	 - Add file as evidence command
* [valint list](valint_list.md)	 - List evidence command
* [valint slsa](valint_slsa.md)	 - Create SLSA provenance evidence command
* [valint verify](valint_verify.md)	 - Verify compliance policies against evidence to ensure the integrity of supply chain.

