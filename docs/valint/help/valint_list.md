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
| | --all | Include all evidence fields | |
| | --columns | List of columns to be displayed | [timestamp,store,ref,context_type,sbomname,product-key,git_url] |
| | --current | List evidence attached to the current context | |
| | --filters | Filters for each evidence property | [] |
| -o | --format | List output format, options=[table json] | |
| | --format-encoding | Evidence Format encoding | |
| | --format-type | Evidence Format type | |
| | --format-version | Evidence Format version | |
| -h | --help | help for list | |
| -O | --output-file | File to write output | |
| | --tool | Evidence Tool name | |
| | --tool-vendor | Evidence Tool vendor | |
| | --tool-version | Evidence Tool version | |


### Global options flags
Flags for all `valint` subcommands


| Short | Long | Description | Default |
| --- | --- | --- | --- |
| | --cache-enable | Enable local cache | true |
| -c | --config | Configuration file path | |
| -C | --context-type | CI context type, options=[jenkins github circleci azure gitlab travis tekton bitbucket local admission] | "local" |
| | --deliverable | Mark as deliverable, options=[true, false] | |
| -e | --env | Environment keys to include in evidence | |
| -G | --gate | Policy Gate name | |
| -L | --label | Add Custom labels | |
| | --level | Log depth level, options=[panic fatal error warning info debug trace] | |
| | --log-context | Attach context to all logs | |
| | --log-file | Output log to file | |
| -d | --output-directory | Output directory path | "${XDG_CACHE_HOME}/valint" |
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

* [valint](valint.md)	 - Validate Supply Chain Integrity

