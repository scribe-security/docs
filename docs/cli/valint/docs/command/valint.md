## valint

supply chain integrity tool

### Synopsis

Command Line Interpreter (CLI) tool developed by Scribe, that validates the integrity of your build.
	
At the end of your pipeline run, decide to accept or fail a build, depending on the integrity analysis result reported by Scribe.

### Options flags 
specific flags for command


| Short | Long | Description | Default |
| --- | --- | --- | --- |
| -c | --config | Configuration file path | |
| | --context-dir | Context dir | |
| -C | --context-type | CI context type, options=[jenkins github circleci local gitlab] | "local" |
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

* [valint diff](valint_diff.md)	 - Compare differences between source and destination sboms
* [valint report](valint_report.md)	 - Download integrity report from Scribe service

