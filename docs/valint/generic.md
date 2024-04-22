---
sidebar_label: "Collecting third party evidence"
title: Collecting third party evidence
author: mikey strauss - Scribe
sidebar_position: 4
date: April 5, 2021
geometry: margin=2cm
---

# Overview
The `valint evidence` command allows users to collect, create, and store any file as evidence, supporting third-party verifiable information. This functionality enables users to meet various compliance requirements by including custom evidence or attestation (signed) from third-party tools. The versatility of generic evidence empowers users to enforce robust and customizable policies in their supply chain.
For example, Attesting to License scanner report can enable you to enforce licensing requirements as part of your build pipeline.

### Usage
To attach evidence:
```bash
valint evidence [FILE] -o [statement, attest] [FLAGS]
```

## Auto-Detected Tools
`valint evidence` supports auto-detection of fields, including the tool format and predicate type, from the output of various tools.

| Tool Name      | Predicate-Type | Format |  Format-Encoding | Command Example |
|---|---|---|---|---|
| trivy          | `https://aquasecurity.github.io/trivy/<version>/docs/configuration/reporting/#json` | json   | -                 | `trivy image --format json -o evidence.json`      |
| trivy          | `http://docs.oasis-open.org/sarif/sarif/<version>`           | sarif  | json              | `trivy image --format sarif -o evidence.sarif.json`    |
| valint         | `http://docs.oasis-open.org/sarif/sarif/<version>`           | sarif  | json              | `valint verify <target>`                     |
| valint         | `https://cyclonedx.org/bom/<version>`                        | cyclonedx | json           | `valint bom <target>`                               |
| syft           | `https://cyclonedx.org/bom/<version>`                        | cyclonedx | json           | `syft packages <target> -o cyclonedx-json --file evidence.json `         |
| cdxgen (owasp-plugin) | `https://cyclonedx.org/bom/<version>`                 | cyclonedx | json, xml       | `cdxgen alpine:latest -t docker -o evidence.cdx.json`|
| codeql         | `http://docs.oasis-open.org/sarif/sarif/<version>`           | sarif  | json              | `codeql execute --format sarif -o evidnece.sarif.json`|
| valint         | `https://slsa.dev/provenance/<version>`                      | slsa   | json              | `valint slsa <target>`                              |
| Other CycloneDX Tools | `https://cyclonedx.org/bom/<version>` | cyclonedx | json | [Tool Command] |
| Other Sarif Tools | `http://docs.oasis-open.org/sarif/sarif/<version>`  | sarif | json | [Tool Command] |
| Default         | `http://scribesecurity.com/evidence/generic/<version>`       | -      | -                 | `-`  

> For CycloneDX and Sarif Tools, tool information is taken from the format tool section.

### Tailoring Evidence Metadata
The customization options enable you to tailor the evidence generation process according to your specific needs, tools, or formats.

* `--predicate-type`: Customize the predicate type of the evidence, which must be a valid URI.
* `--compress`: Can be used to sign the compress file before attaching it to evidence.
* `--tool`, `--tool-version`, `--tool-vendor`, Can be used for custom tool integrations.
* `--format-type`, `--format-version`, `--format-encoding`, Can be used for custom format integrations.

#### Trivy integration exmaple
Install Trivy's latest version.

Run the following command to export a Sarif report.
```bash
trivy image --format sarif -o report.sarif  golang:1.12-alpine
```

Run the following Valint command to add the report as evidence to the Scribe Service.
```bash
valint evidence report.sarif -o  [attest, statement] \
  -E \
   -P [SCRIBE_CLIENT_SECRET]
```

### Format
```json
{
  "_type": "https://in-toto.io/Statement/v0.1",
  
  "subject": [{ ... }],
  
  // Can also include any custom user defined url.
  "predicateType": <predicate-type>

  "predicate": {
    "environment": {
      <Evidence context object>
    },

    //Content Mimetype
    "mimeType": <string>,
  
    // File target content
    "content": <BASE64 content>
  }
}
```

### Extracting the predicate from attestation
You may use the following command to extract evidence from a encoded attestation file.
```bash
valint [bom, slsa, evidence] [target] -o attest --output-file my_attestation.sig

cat my_attesataion.sig | jq -r '.payload' | base64 -d | jq -r '.payload' | base64 --decode | jq '.predicate' > predicate.json
```

You can further extract specific predicate field, for example for SBOM evidence (`attest`) use the following command.
```bash 
cat my_attesataion.sig | jq -r '.payload' | base64 -d | jq -r '.payload' | base64 --decode | jq '.predicate' | jq '.bom' > bom.json
```