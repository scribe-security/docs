
---

## sidebar_label: "SLSA Level 1"
title: "Getting started with SLSA Level 1"
sidebar_position: 2
toc_min_heading_level: 2
toc_max_heading_level: 5
Checklist for attaining SLSA v1.0 Level 1:

- Build your software using a CI system. Preferably, with a build script that is source-controlled.
- Call the Scribe Valint slsa command from your build script to generate a provenance document.
- Distribute the Provenance Document using Scribe Hub.
Before you begin​ [﻿install the Scribe Plugin for your CI build system](../../integrating-scribe/ci-integrations/).

The general Valint call structure is:

```
# Create an unsigned SLSA Provenance Document
valint slsa [target] -o statement \
-E \
 -P [SCRIBE_TOKEN]
```
Where `[Target]` is the build artifact and `-E` specifies storing the document in Scribe Hub where you can manage all your documents and distribute them to consumers.

You can store the Provenance Document in [﻿alternative evidence stores](../../integrating-scribe/other-evidence-stores).
Use command flags to [﻿customize the content of the provenance document](customizing-provenance).

Verify downstream that the attestation exists in the [﻿evidence store](../../integrating-scribe/other-evidence-stores) by calling:

```
valint verify [target] -i statement-slsa \
-E \
 -P [SCRIBE_TOKEN]
```
#### Examples
 GitHub 

```yaml
- name: Generate SLSA provenance statement
id: valint_slsa_statement
uses: scribe-security/action-bom@master
with:
  target: 'busybox:latest'
  format: statement-slsa

- uses: actions/upload-artifact@v2
with:
  name: provenance
  path: ${{ steps.valint_slsa_statement.outputs.OUTPUT_PATH }}
```
 GitLab CI/CD 

```yaml
scribe-gitlab-job:
stage: scribe-gitlab-stage
script:
  - valint bom [target]
      -o attest-slsa
      --context-type gitlab
      --output-directory ./scribe/valint
      -E -P $SCRIBE_TOKEN
```
 Azure DevOps 

```yaml
- task: ValintCli@0
inputs:
  commandName: bom
  target: [target]
  format: attest-slsa
  outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
  scribeEnable: true
  scribeClientId: $(SCRIBE-CLIENT-ID)
  scribeClientSecret: $(SCRIBE-CLIENT-SECRET)
```
 Travis CI 

```yaml
script:
- |
  valint [bom,slsa,evidence] [target] \
      --format [attest, statement] \
      --context-type travis \
      --output-directory ./scribe/valint \
      -E -P $SCRIBE_TOKEN \
```
 Bitbucket 

```yaml
name: scribe-bitbucket-pipeline
script:      
  - pipe: scribe-security/valint-pipe:0.1.6
    variables:
      COMMAND_NAME: bom
      TARGET:  [target]
      FORMAT: attest-slsa
      SCRIBE_ENABLE: true
      SCRIBE_CLIENT_SECRET: $SCRIBE_TOKEN
```




<!--- Eraser file: https://app.eraser.io/workspace/lW5tthuHpuX7RT6MGgM9 --->