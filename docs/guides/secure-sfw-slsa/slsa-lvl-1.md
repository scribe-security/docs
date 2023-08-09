---
sidebar_label: "SLSA Level 1"
title: "Getting started with SLSA Level 1"
sidebar_position: 2
toc_min_heading_level: 2
toc_max_heading_level: 5
---

Checklist for attaining SLSA v1.0 Level 1:
* Build your software using a CI system. Preferably, with a build script that is source-controlled.
* Call the Scribe Valint slsa command from your build script to generate a provenance document.
* Distribute the Provenance Document using Scribe Hub.

Before you begin​ **[install the Scribe Plugin for your CI build system](../../integrating-scribe/ci-integrations/)**.

The general Valint call structure is:
```
  # Create an unsigned SLSA Provenance Document
  valint slsa [target] -o statement \
  -E \
  -U [SCRIBE_CLIENT_ID] \
  -P [SCRIBE_CLIENT_SECRET]
```
Where `[Target]` is the build artifact and `-E` specifies storing the document in Scribe Hub where you can manage all your documents and distribute them to consumers.

You can store the Provenance Document in **[alternative evidence stores](other-evidence-stores#integrating-with-alternative-types-of-evidence-stores)**.
Use command flags to **[customize the content of the provenance document](customizing-provenance#customizing-the-provenance-document)**.

Verify downstream that the attestation exists in the **[evidence store](other-evidence-stores#integrating-with-alternative-types-of-evidence-stores)** by calling:
```
  valint verify [target] -i statement-slsa \
  -E \
  -U [SCRIBE_CLIENT_ID] \
  -P [SCRIBE_CLIENT_SECRET]
```
#### Examples

<details>
  <summary> GitHub </summary>

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
</details>

<details>
  <summary> GitLab CI/CD </summary>

```yaml
scribe-gitlab-job:
    stage: scribe-gitlab-stage
    script:
      - valint bom [target]
          -o attest-slsa
          --context-type gitlab
          --output-directory ./scribe/valint
          -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET
          --logical-app-name $LOGICAL_APP_NAME --app-version $APP_VERSION
```
</details>

<details>
  <summary> Azure DevOps </summary>

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
      app-name: $(LOGICAL_APP_NAME)
      app-version: $(APP_VERSION)
```
</details>

<details>
  <summary> Travis CI </summary>

```yaml
script:
  - |
    valint bom [target] \
        --format [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] \
        --context-type travis \
        --output-directory ./scribe/valint \
        -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
        --logical-app-name $LOGICAL_APP_NAME --app-version $APP_VERSION
```
</details>

<details>
  <summary> Bitbucket </summary>

```yaml
name: scribe-bitbucket-pipeline
        script:      
          - pipe: scribe-security/valint-pipe:0.1.6
            variables:
              COMMAND_NAME: bom
              TARGET:  [target]
              FORMAT: attest-slsa
              SCRIBE_ENABLE: true
              SCRIBE_CLIENT_ID: $SCRIBE_CLIENT_ID
              SCRIBE_CLIENT_SECRET: $SCRIBE_CLIENT_SECRET
              LOGICAL_APP_NAME: $LOGICAL_APP_NAME
              APP_VERSION: $APP_VERSION 
```
</details>
