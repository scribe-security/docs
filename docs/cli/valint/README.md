---
title: Valint
author: mikey strauss - Scribe
date: Jun 14, 2022
geometry: margin=2cm
---

# 🦀 Valint - validate supply chain integrity tool  🦀
Valint tool provides a tool to verify integrity of a supply chain.
Tool allows you to verify and validate the integrity multiple parts of the supply chain artifacts and flow.

# Overview
Valint provides a range of validation capabilities pulled from evidence collected in your supply chain.
Tool allows you to access a set of reports both created locally and by using Scribe services showing the integrity of our supply chain.

# Scribe service based report
* Package integrity report for you images artifacts. (See `Report` subcommand).
* File integrity report for your images artifacts (See `Report` subcommand).

## Global Flags:
Global flags can be set by CLI on any command. \
Flags that can not mapped to configuration are verbose, config and backwards flags.

See details [CLI documentation - global](docs/command/valint.md)

## Configuration
Configuration can be set for CLI for all commands as well as for the global flags.
Configuration fields can be overridden by CLI, see CLI help for flags details.

See details [CLI documentation - config](docs/configuration.md)

# Commands
valint supports the following commands.

## Report
Command pulls Scribe service reports.
Once a set of evidence are uploaded to Scribe service a report is generated.
By default report is written in to local cache. 
`~/.cache/valint/reports/<timestamp>/<report-file>`

See details [CLI documentation - report](docs/command/valint_report.md)

## Integrity report
Including results from the source code integrity and open source integrity results.
Report indicates the changes made to an Image against the source code and open source packages.

1.1) File integrity - Source code comparied to an image.
1.2) Open source integrity - open source packages (NPM) compared to an image.

### Integrity types
Integrity filters the output report by integrity value of the componenets.
* Modified
* NotCovered
* Validated
* NotValidated

### Report Sections
Integrity filters the output report by section.
* Files - open source file report section.
* Packages - open source packages - package report section
* Packages files - open source packages - files report section.
* Summary - Analyze summary and metadata section.

### Basic usage
<details>
  <summary> Download report </summary>

Download report and store in a local file.
Using `output-file` you can select where the report will be copied to.

```bash
valint report --scribe.clientid=<client_id> --scribe.clientsecret=<client_secret> --output-file my_report.json
```

</details>

### Report format

```
 {
        "source_code": {
                "files": [ <Source code files list integrity> ],
                "summary": {
                        "files_modified":,
                        "files_not_validated":,
                        "files_total_count":,
                        "files_validated":,
                },
        },
        "open_source": {
                "packages": [  <Packages list integrity> ],
                "summary": {
                    "PackagesModified":,
                    "PackagesNotValidated": ,
                    "PackagesTotalCount":,
                    "PackagesValidated":,
                },
                "files": [  <Packages files list integrity> ],
                "files-summary": {
                        "files_modified":,
                        "files_not_validated":,
                        "files_total_count":,
                        "files_validated":,
                },
        },
        "analyze": {
                "access_time": ,
                "created_at": ,
                "file_id": ,
                "metadata": { <Analysis target metadata> },
                "project_id": ,
                "request_id": ,
                "result": {    },
                "status": "checked",
                "type": "analyze:sbom",
                "updated_at": ,
}
```

#### Integrity map
Integirty options are as following.
```
	Modified      	     = "Modified"
	NotCovered           = "Not_Covered"
	Validated            = "Validated"
	NotValidated         = "Not_Validated"
```

See example report [Example - report](docs/report.md)

# Dev
See details [CLI documentation - dev](docs/dev.md)
