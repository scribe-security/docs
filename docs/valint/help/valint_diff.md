
## valint diff
Compare differences between source and destination sboms

```
valint diff [SOURCE_SBOM] [DESTINATION_SBOM] [flags]
```
### Examples for running `valint diff` 
```
valint diff <source sbom file> <destination sbom file>
valint diff <source sbom file> <destination sbom file> --integrity validated,modified
valint diff <source sbom file> <destination sbom file> --package npm,deb
valint diff <source sbom file> <destination sbom file> --paths github:/var/bin/github
valint diff <source sbom file> <destination sbom file> --synopsis=false
valint diff <source sbom file> <destination sbom file> --metadata=false
valint diff <source sbom file> <destination sbom file> --regex-scope .*.go,.*.md
valint diff <source sbom file> <destination sbom file> --regex-filter .*.h,.*.json
valint diff <source sbom file> <destination sbom file> --mime-type text/plain,application/json
valint diff <source sbom file> <destination sbom file> -vv
```
### Options flags
specific flags for command

| Short | Long | Description | Default |
| ----- | ----- | ----- | ----- |
| -h | --help | help for diff |  |
|  | --integrity | Select diff scope integrity, options=[validated modified missing added renamed] | [validated,modified,missing,added,renamed] |
|  | --metadata | Enable metadata | true |
|  | --mime-type | Select diff scope mime-types |  |
|  | --package | Select diff scope packages, options=[apk gem deb rpm npm python php-composer java-archive jenkins-plugin go-module rust-crate msrc-kb dart-pub dotnet pod conan portage hackage] | [apk,gem,deb,rpm,npm,python,php-composer,java-archive,jenkins-plugin,go-module,rust-crate,msrc-kb,dart-pub,dotnet,pod,conan,portage,hackage] |
|  | --paths | Select diff source to destination paths, format=source_path:destination_path | [:] |
|  | --regex-dst | Select diff scope regex desitantion paths |  |
|  | --regex-src | Select diff scope regex source paths |  |
|  | --synopsis | Enable synopsis | true |
### Global options flags
global flag for all commands

| Short | Long | Description | Default |
| ----- | ----- | ----- | ----- |
| -c | --config | Configuration file path |  |
|  | --context-dir | Context dir |  |
| -C | --context-type | CI context type, options=[jenkins github circleci local gitlab] | "local" |
| -L | --label | Add Custom labels |  |
| -D | --level | Log depth level, options=[panic fatal error warning info debug trace] |  |
| -d | --output-directory | Output directory path | "${XDG_CACHE_HOME}/valint" |
| -O | --output-file | Output file name |  |
| -n | --product-key | Scribe Project Key |  |
| -q | --quiet | Suppress all logging output |  |
| -U | --scribe.client-id | Scribe Client ID |  |
| -P | --scribe.client-secret | Scribe Client Secret |  |
| -E | --scribe.enable | Enable scribe client |  |
| -u | --scribe.url | Scribe API Url | <p>"</p><p>"</p> |
| -v | --verbose | Log verbosity level (-v = info, -vv = debug) |  |
### SEE ALSO
- [﻿valint](valint.md)  - supply chain integrity tool




<!--- Eraser file: https://app.eraser.io/workspace/v8cIKaYXW0lhjeJJyGJb --->