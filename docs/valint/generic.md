<p><a target="_blank" href="https://app.eraser.io/workspace/xpSN4uZqIRhDTARUUFJb" id="edit-in-eraser-github-link"><img alt="Edit in Eraser" src="https://firebasestorage.googleapis.com/v0/b/second-petal-295822.appspot.com/o/images%2Fgithub%2FOpen%20in%20Eraser.svg?alt=media&amp;token=968381c8-a7e7-472a-8ed6-4a6626da5501"></a></p>

---

## sidebar_label: "Collecting third party evidence"
title: Collecting third party evidence
author: mikey strauss - Scribe
sidebar_position: 4
date: April 5, 2021
geometry: margin=2cm
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

| Tool Name | Predicate-Type | Format | Format-Encoding | Command Example |
| ----- | ----- | ----- | ----- | ----- |
| trivy |  | json | - |  |
| trivy |  | sarif | json |  |
| valint |  | sarif | json |  |
| valint |  | cyclonedx | json |  |
| syft |  | cyclonedx | json |  |
| cdxgen (owasp-plugin) |  | cyclonedx | json, xml |  |
| codeql |  | sarif | json |  |
| valint |  | slsa | json |  |
| Other CycloneDX Tools |  | cyclonedx | json | [Tool Command] |
| Other Sarif Tools |  | sarif | json | [Tool Command] |
| Default |  | - | - |  |
>  For CycloneDX and Sarif Tools, tool information is taken from the format tool section. 

### Tailoring Evidence Metadata
The customization options enable you to tailor the evidence generation process according to your specific needs, tools, or formats.

- `--predicate-type` : Customize the predicate type of the evidence, which must be a valid URI.
- `--compress` : Can be used to sign the compress file before attaching it to evidence.
- `--tool` , `--tool-version` , `--tool-vendor` , Can be used for custom tool integrations.
- `--format-type` , `--format-version` , `--format-encoding` , Can be used for custom format integrations.
### SCA Integration
Scribe Service analysis of a range of SCA reports allows users to track, analyze, and act according to the organization's needs. It also seamlessly integrates scans as part of evidence-based policies for supply chain requirements.

- Use `--parser`  to select one of the [﻿supported parsers](https://scribe-security.netlify.app/docs/valint/help/valint_evidence#examples-for-running-valint-evidence) .
For example:

```bash
## Upload trivy report
valint evidence my_report.json --parser trivy
```
Once an SCA report is uploaded to Scribe Service, you can enforce policies on it. For example:

```yaml
valint verify finding/is_vuln@v1 --parser trivy
```
#### Trivy integration example
Install Trivy's latest version.

Run the following command to export a Sarif report.

```bash
trivy image --format sarif -o report.sarif  golang:1.12-alpine
```
Run the following Valint command to add the report as evidence to the Scribe Service.

```bash
valint evidence report.sarif -o  [attest, statement] \
-E \
 -P [SCRIBE_TOKEN]
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




<!--- Eraser file: https://app.eraser.io/workspace/xpSN4uZqIRhDTARUUFJb --->