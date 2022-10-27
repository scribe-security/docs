## valint report

Download integrity report from Scribe service

```
valint report [flags]
```

### Optional flags 
Flags for `report` subcommand


| Short | Long | Description | Default |
| --- | --- | --- | --- |
| -B | --backoff | Backoff duration | "3s" |
| -h | --help | help for report | |
| -I | --integrity | Select report integrity, options=[Modified Not_Covered Validated Not_Validated] | [Modified,Not_Covered,Validated,Not_Validated] |
| -S | --section | Select report sections, options=[files packages packages-files summary] | [files,packages,packages-files,summary] |
| -s | --show | Print report to stdout | |
| -T | --timeout | Timeout duration | "60s" |


### Global options flags
Flags for all `valint` subcommands


| Short | Long | Description | Default |
| --- | --- | --- | --- |
| -c | --config | Configuration file path | |
| | --context-dir | Context dir | |
| -C | --context-type | CI context type, options=[jenkins github circleci local azure gitlab] | "local" |
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


### Examples for running `valint report`

```
	valint report [flags]
	valint report --scribe.client-id=<client_id> --scribe.client-secret=<client_secret>			(Download your report from Scribe service)
	valint report --scribe.client-id=<client_id> --scribe.client-secret=<client_secret> -T 30s		(Download report, retry timeout after 30 seconds)
	valint report --scribe.client-id=<client_id> --scribe.client-secret=<client_secret> -T 30s -B 10s		(Download report, retry timeout after 30 seconds and backoff 10 seconds)
	valint report --scribe.client-id=<client_id> --scribe.client-secret=<client_secret> -I Modified -S files 	(Download report of all source code files that were suspiciously modified)
	valint report --scribe.client-id=<client_id> --scribe.client-secret=<client_secret> -I Validated -S packages 	(Download report of all source code packages that were verified)
	
```

### SEE ALSO

* [valint](valint.md)	 - Validate integrity of supply chain

in

