---
sidebar_label: "Using third party evidence"
title: Using third party evidence
author: mikey strauss - Scribe
sidebar_position: 3
date: April 5, 2021
geometry: margin=2cm
---

### Generic evidence
Generic evidence includes custom 3rd party verifiable information containing any required compliance requirements.
Generic evidence allows users to include any file as evidence or attestation (signed) hooking in 3rd party tools.
Allowing more robust and customizable policies to fit your needs.

For example, Attesting to License scanner report can enable you to enforce licensing requirements as part of your build pipeline.

### Usage: 
Attach a generic evidence
`valint bom <file_path> -o [statement-generic, attest-generic] [FLAGS]`

Verify a generic evidence artifact
`valint verify <file_path> -i [statement-generic, attest-generic] [FLAGS]`

Using the following flags, <br />
* `--predicate-type`: Customize the predicate type of the evidence, which must be a valid URI (optional) <br />
Default value is `http://scribesecurity.com/evidence/generic/v0.1`. 

* `--compress`: Compress content (optional)

For Example, using Trivy SARIF report as evidence.
```bash
valint bom report.sarif -o attest-generic -p https://aquasecurity.github.io/trivy/v0.42/docs/configuration/reporting/#sarif
```

### Scribe Predicate types
KNOWN predicates types allow the generic evidence to be further analyzed by Scribe service.

The following table are the KNOWN predicate types we recommend using,

| predicate-type | file-format | tool |
| --- | --- | --- |
|  https://aquasecurity.github.io/trivy/v0.42/docs/configuration/reporting/#sarif <br /> https://aquasecurity.github.io/trivy/v0.42/docs/configuration/reporting/#json | sarif <br /> json | trivy |
|  http://docs.oasis-open.org/sarif/sarif/v2.1.0 | sarif | CodeQL |
|  https://cyclonedx.org/bom | CycloneDX | Syft | 
|  https://slsa.dev/provenance/v0.2 | Intoto-predicate, Intoto-Statement | Cosign | 

#### Trivy integration
Install Trivy's latest version.

Run the following command to export a Sarif report.
```bash
trivy image --format sarif -o report.sarif  golang:1.12-alpine
```

Run the following Valint command to add the report as evidence to the Scribe Service.
```bash
valint bom report.sarif --predicate-type http://docs.oasis-open.org/sarif/sarif/v2.1.0 -o  [attest-generic, statement-generic] \
  -E \
  -U [SCRIBE_CLIENT_ID] \
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
valint bom [target] -o [attest, attest-slsa, attest-generic] -o my_attestation.sig

cat my_attesataion.sig | jq -r '.payload' | base64 -d | jq -r '.payload' | base64 --decode | jq '.predicate' > predicate.json
```

You can further extract specific predicate field, for example for SBOM evidence (`attest`) use the following command.
```bash 
cat my_attesataion.sig | jq -r '.payload' | base64 -d | jq -r '.payload' | base64 --decode | jq '.predicate' | jq '.bom' > bom.json
```