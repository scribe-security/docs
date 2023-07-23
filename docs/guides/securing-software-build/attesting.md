---
sidebar_label: "Attesting to your software’s security"
title: Attesting to your software’s security
sidebar_position: 1
---

### Collecting evidence

You can collect the following types of evidence from your software-building process. The evidence is formatted as an [in-toto](https://in-toto.io/ "in-toto") attestation and can be cryptographically signed.

### 1. SBOM

**Step 1:** Install the Valint Plugin
If you haven’t installed the CI plugin yet, [Install the Scribe Valint plugin in your CI system](../../reference-guide/ci-integrations/ "CI Integrations"). 

**Step 2:** Basic Integration for SBOM Generation
As a basic integration step, generate an SBOM from the final built artifact such as a docker image. Use the following command either from the command line or in your build script immediately after the artifact is built: 

```bash
valint bom <target> <flags>
```

Here, `<target>` refers to a build artifact of either a container image, file or file directory, or a git repo, formatted as either `<image:tag>`, `<dir path>`, or `<git url>`.

**Example:**
```bash
valint bom my_image:my_tag
```

**Advanced SBOM Generation**

For a more detailed SBOM, you can generate additional SBOMs from the source code or from the package manager installation process during the build process. These additional SBOMs can be combined to create a more comprehensive and accurate SBOM.

For more detailed information about SBOM generation, please consult the provided resources.

### 2. Provenance

A provenance attestation, provides evidence that your software artifact originated from the authorized build agent and code repository. This is a critical component in fulfilling SLSA level 3 requirements.

**Step 1: Plugin Installation**
If you haven’t installed the CI plugin, [Install the Scribe Valint plugin in your CI system](../../reference-guide/ci-integrations/ "CI Integrations").

**Step 2: Generating Provenance**
The snippet below demonstrates how to generate provenance in a GitHub workflow:
    * Call `valint` to generate SLSA provenance from the final Docker image.
    ```YAML
        - name: Generate SLSA provenance statement
        id: valint_slsa_statement
        uses: scribe-security/action-bom@master
        with:
          target: <image-name:tag>
          format: statement-slsa

        -uses: actions/upload-artifact@v2
        with:
          name: provenance
          path: ${{ steps.valint_slsa_statement.outputs.OUTPUT_PATH }}
    ```

Here's the full example pipeline:

```YAML
name: example workflow

on: 
  push:
    tags:
      - "*"

jobs:
  scribe-sign-verify:
    runs-on: ubuntu-latest
    steps:

      - uses: actions/checkout@v2
        with:
          fetch-depth: 0

      - name: Generate SLSA provenance statement
        id: valint_slsa_statement
        uses: scribe-security/action-bom@master
        with:
          target: mongo-express:1.0.0-alpha.4
          format: statement-slsa

      -uses: actions/upload-artifact@v2
      with:
        name: provenance
        path: ${{ steps.valint_slsa_statement.outputs.OUTPUT_PATH }}
```

This command creates provenance in compliance with the [SLSA v1 specification](https://slsa.dev/provenance/v1 "SLSA v1"). 

You can generate SLSA provenance on any other CI platform that Scribe supports. The process is similar to SBOM generation, except you need to use `-o attest-slsa` for the type.

<details>
  <summary>  <b> Example for GitHub </b> </summary>

```yaml
        uses: scribe-security/action-bom@master
        with:
          target: [target]
          format: statement-slsa
          scribe-enable: true
          scribe-client-id: ${{ secrets.clientid }}
          scribe-client-secret: ${{ secrets.clientsecret }}
          app-name: $LOGICAL_APP_NAME
          app-version: $APP_VERSION
          author-name: $AUTHOR_NAME
          author-email: $AUTHOR_EMAIL
          author-phone: $AUTHOR_PHONE
          supplier-name: $SUPPLIER_NAME
          supplier-url: $SUPPLIER_URL
          supplier-email: $SUPPLIER_EMAIL 
          supplier-phone: $SUPPLIER_PHONE
```
</details>

<details>
  <summary>  <b> Example for GitLab CI/CD </b> </summary>

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
          --author-name $AUTHOR_NAME --author-email AUTHOR_EMAIL --author-phone $AUTHOR_PHONE 
          --supplier-name $SUPPLIER_NAME --supplier-url $SUPPLIER_URL --supplier-email $SUPPLIER_EMAIL 
          --supplier-phone $SUPPLIER_PHONE 
          -f
```
</details>

<details>
  <summary>  <b> Example for Azure Pipelines </b> </summary>

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
      author-name: $(AUTHOR_NAME)
      author-email: $(AUTHOR_EMAIL)
      author-phone: $(AUTHOR_PHONE)
      supplier-name: $(SUPPLIER_NAME)
      supplier-url: $(SUPPLIER_URL)
      supplier-email: $(SUPPLIER_EMAIL) 
      supplier-phone: $(SUPPLIER_PHONE)
```
</details>

<details>
  <summary>  <b> Example for Travis CI </b> </summary>

```yaml
script:
  - |
    valint bom [target] \
        --format [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] \
        --context-type travis \
        --output-directory ./scribe/valint \
        -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
        --logical-app-name $LOGICAL_APP_NAME --app-version $APP_VERSION \
        --author-name $AUTHOR_NAME --author-email AUTHOR_EMAIL --author-phone $AUTHOR_PHONE \
        --supplier-name $SUPPLIER_NAME --supplier-url $SUPPLIER_URL --supplier-email $SUPPLIER_EMAIL \ 
        --supplier-phone $SUPPLIER_PHONE 
```
</details>

<details>
  <summary>  <b> Example for Bitbucket </b> </summary>

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
              AUTHOR_NAME: $AUTHOR_NAME
              AUTHOR_EMAIL: $AUTHOR_EMAIL
              AUTHOR_PHONE: $AUTHOR_PHONE
              SUPPLIER_NAME: $SUPPLIER_NAME
              SUPPLIER_URL: $SUPPLIER_URL
              SUPPLIER_EMAIL: $SUPPLIER_EMAIL
              SUPPLIER_PHONE: $SUPPLIER_PHONE
```
</details>

:::note 
Full compliance with SLSA requires an evaluation of the security posture of both your Source Control Management (SCM) system and your CI system.
Currently, Scribe Hub provides support for GitHub. Details on this integration can be found in our official documentation [here](../../reference-guide/ci-integrations/github/#generating-the-slsa-provenance-in-your-pipeline). Support for Azure DevOps is in the pipeline and will be available soon.
:::

### 3. Security posture of the Source Code Manager

In order to meet full SLSA requirements, it's necessary to evaluate the security posture of your SCM and CI systems. This includes gathering evidence regarding the project settings, such as branch protection. There are several alternatives for gathering this evidence:

1. **Connecting GitHub with Scribe Hub** 
    1. Access Integrations Log in to Scribe Hub. Navigate to the left pane and click on "Integrations". 
        
        <img src='../../../../img/ci/scribe-beta-integrations-1.jpg' alt='Scribe Integrations' width='20%' min-width='150px'/> 
    2. Scroll down to find GitHub among the listed services. Select GitHub and click "Connect". 
        
        <img src='../../../../img/ci/scribe-beta-source-control-integrations.jpg' alt='Source Control' width='20%' min-width='150px'/> 
    3. You will be redirected to GitHub. Sign in to your GitHub account, select the relevant GitHub organization account, and choose the appropriate repositories.
        
        <img src='../../../../img/ci/install_scribeapp_github.jpg' alt='Install ScribeApp Integration' width='50%' min-width='500px'/>
    4. Once done, you will be redirected back to Scribe Hub. From this point onwards, Scribe will automatically generate a SLSA and Software Supply Chain Assurance Framework (SSDF) compliance report for every build.
    5. Review Compliance Report To access these reports, navigate to "Products" in Scribe Hub, select the relevant product, choose the specific version, and click on the "Compliance" tab. For details on how to interpret the compliance report, you can read our guide [here](../../reference-guide/ci-integrations/github/#where-to-start).

2. **Gathering your GitHub posture during the pipeline run** 

    Scribe's GitGat is a tool based on [OPA](https://www.openpolicyagent.org/docs/latest/ "OPA") (Open Policy Agent) and leverages policies written in the Rego language, that evaluate the security posture of your GitHub account. This utility generates a report on your SCM account's security settings.

    :::note 
    currently GitGat evaluates posture against the CIS software supply chain benchmark only.
    :::

    The following are the steps required to create an attestation of your GitHub account posture during a build run:

    1. Obtain your GitHub Personal Access Token with read permissions to your account.
    2. Once you have your token, the simplest way to run GitGat is through a Docker image. The following command, executed in your Unix Command Line Interface (CLI), will run GitGat on your repositories and create the report in your Gist:
    ```
    docker run -e GH_TOKEN scribesecurity/gitgat:latest data.gh.post_gist
    ```
    <img src='../../../../img/start/gitgat-1.jpg' alt='GitGat run' width='50%' min-width='500px'/>

    You can find the evaluation report in your profile’s Gist as in the following example:
    
    <img src='../../../../img/start/gitgat-2.jpg' alt='GitGat report' width='70%' min-width='600px'/>

    You can learn how to read the GitGat report in this [free course](https://training.linuxfoundation.org/training/github-supply-chain-security-using-gitgat-lfd122x/ "GitGat Linux Foundation Course").

3. **Gathering your Azure Devops posture during the pipeline run**

<img src='../../../../img/help/coming-soon.jpg' alt='Coming Soon'/>

4. **Reports from application security scanners**

You can gather the output of your application security scanners (such as SAST, SCA, and DAST) as evidence to attest to your software’s security level and evaluate it with your policies. Valint can turn any file to an attestation.

In your build script use:

```
valint bom <file_path> -o [statement-generic, attest-generic] -p [predicate-type] [FLAGS]
```

For example, gathering evidence of a Trivy output
```bash
valint bom report.sarif -o attest-generic -p https://aquasecurity.github.io/trivy/v0.42/docs/configuration/reporting/#sarif
```

You can read more about Trivy integration [here](../../reference-guide/valint/command/valint#trivy-integration).

If you want Scribe's backend to be able to gather more information from your 3rd party attestation use 1 of the 2 recommended predicate types:

| predicate-type | file-format | tool |
| --- | --- | --- |
|  https://aquasecurity.github.io/trivy/v0.42/docs/configuration/reporting/#sarif <br /> https://aquasecurity.github.io/trivy/v0.42/docs/configuration/reporting/#json | sarif <br /> json | trivy |
|  https://cyclonedx.org/bom | CycloneDX | Syft | 

For any other predicate you use you can use it yourself to verify your 3rd party attestations using our [sign/verify](../../use-cases/securing-software-build/sign-verify) workflow.
    



