---
sidebar_label: "Securing your software builds using SLSA framework"
title: "Securing your software builds using SLSA framework"
sidebar_position: 2
toc_min_heading_level: 2
toc_max_heading_level: 5
---

[SLSA](https://slsa.dev/) (Supply Chain Levels for Software Artifacts) is a security framework to prevent tampering, improve integrity, and secure packages and infrastructure. SLSA is organized into levels, with each level representing incremental progress over the previous one.

**Level 1 Requirements:**
* Fully script or automate your build process: Automate your build process using tools like makefile or GitHub Actions to ensure consistent and repeatable builds.
* Generate provenance documentation: Create provenance documentation that includes information about the "who," "where," and "when" of a piece of software.

**Level 2 Requirements:**
* Ensure software artifacts are tamper-evident: Implement measures to detect and prevent tampering with software artifacts, such as code signing and integrity checks.
* Establish a strong identity for software artifacts: Use cryptographic techniques to establish a strong identity, making verifying their authenticity easier.

**Level 3 Requirements:**
* Use a tamper-resistant build service: Implement a trusted builder, such as the one provided by GitHub Actions, to perform builds and generate non-forgeable provenance metadata.
* Generate non-forgeable provenance metadata: The provenance metadata should detail how an artifact was built, enabling comprehensive verification of its integrity.

To implement SLSA Level 3 compliance, you can leverage for example, GitHub Actions and Scribe. GitHub Actions allows you to automate the build process. Scribe generates non-forgeable provenance metadata, and tools signing software and verifying its provenance.

By integrating a trusted builder into GitHub Actions workflows and generating non-forgeable provenance metadata, you can demonstrate compliance with SLSA Level 3. Users of your projects can then use the verification tools to ensure that the artifacts they are using originated from the expected source code repository.

### Configuration

In order to enable SLSA evaluation configure the following:
1. [Generate a Provenance Attestation](../integrating-scribe/ci-integrations/github/#generating-the-slsa-provenance-in-your-pipeline).
2. Generate an attestation of the security posture of the Source Code Manager related to your build.
3. Scribe Hub generates a [compliance report](http//tbd) you can review. 

Read about how you can evaluate your posture against SLSA [here](http//tbd).

The normative process of assuring and attesting that your software was built securely comprises the following steps:
1. Gather evidence continuously from every software build.
2. Sign and store in an evidence store by a key you own.
3. Apply policies to it to verify evidence integrity, assure consistent security controls, and a secure development process.

## Provenance

A provenance attestation, provides evidence that your software artifact originated from the authorized build agent and code repository. This is a critical component in fulfilling SLSA level 3 requirements.

**Step 1:** Plugin Installation
If you haven’t installed the CI plugin, [Install the Scribe Valint plugin in your CI system](../integrating-scribe/ci-integrations/).

**Step 2:** Generating Provenance
The snippet below demonstrates how to generate provenance in a GitHub workflow:  
Using the GitHub action’s OUTPUT_PATH argument you can access the generated SLSA provenance statement and store it as an artifact.
Use action output-file: ``<my_custom_path>`` input argument to set a custom output path.

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

This command creates provenance in compliance with the [SLSA v1 specification](https://slsa.dev/provenance/v1). 
You can generate SLSA provenance on any other CI platform that Scribe supports. The process is similar to SBOM generation, except you need to use ``-o attest-slsa`` for the type.

<details>
  <summary>  <b> Example for GitLab CI/CD: </b> </summary>

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
  <summary>  <b> Example for Azure DevOps: </b> </summary>

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
  <summary>  <b> Example for Travis CI: </b> </summary>

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
  <summary>  <b> Example for Bitbucket: </b> </summary>

```yaml
script:
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

### 2. Security posture of the Source Code Manager

In order to meet full SLSA requirements, it's necessary to evaluate the security posture of your SCM and CI systems. This includes gathering evidence regarding the project settings, such as branch protection. There are several alternatives for gathering this evidence:

<details>
  <summary>  <b> Connecting GitHub with Scribe Hub: </b> </summary>

**Step 1:** Access Integrations Log in to Scribe Hub. Navigate to the left pane and click on "Integrations".

<!-- <img src='../../../../img/ci/scribe-beta-integrations-1.jpg' alt='Scribe Integrations' width='20%' min-width='150px'/>  -->
<img src='../../../../img/start/integrations-start.jpg' alt='Scribe Integrations'/>

**Step 2:** Scroll down to find GitHub among the listed services. Select GitHub and click "Connect". 
        
**Step 3:** You will be redirected to GitHub. Sign in to your GitHub account, select the relevant GitHub organization account, and choose the appropriate repositories.

**Step 4:** Once done, you will be redirected back to Scribe Hub. From this point onwards, Scribe will automatically generate a SLSA and Software Supply Chain Assurance Framework (SSDF) compliance report for every build.

**Step 5:** Review Compliance Report To access these reports, navigate to "Products" in Scribe Hub, select the relevant product, choose the specific version, and click on the "Compliance" tab.

For details on how to interpret the compliance report, you can read our guide [here](http://tbd).
</details>

<details>
  <summary>  <b> Gathering your GitHub posture during the pipeline run: </b> </summary>

Scribe's [GitGat](https://github.com/scribe-public/gitgat#readme) is an open-source tool based on [OPA](https://www.openpolicyagent.org/docs/latest/) (Open Policy Agent) and leverages policies written in the Rego language, that evaluate the security posture of your GitHub account. This utility generates a report on your SCM account's security settings.

:::note
currently GitGat evaluates posture against the CIS software supply chain benchmark only.
:::

The following are the steps required to create an attestation of your GitHub account posture during a build run:

**Step 1:** Obtain your GitHub Personal Access Token with read permissions to your account.

**Step 2:** Once you have your token, the simplest way to run GitGat is through a Docker image. The following command, executed in your Unix Command Line Interface (CLI), will run GitGat on your repositories and create the report in your Gist:
```
docker run -e GH_TOKEN scribesecurity/gitgat:latest data.github.report.print_report 2> report.md
$HOME/.scribe/bin/valint bom report.md --scribe.client-id=$CLIENT-ID \
--scribe.client-secret=$CLIENT-SECRET -E -f -v \
--logical-app-name $LOGICAL-APP-NAME --app-version $APP-VERSION
```

<img src='../../../../img/start/gitgat-1.jpg' alt='GitGat run'/>

You can read more about [here](https://github.com/scribe-public/gitgat#readme) the GitGat full documentation here or view the [free course](https://training.linuxfoundation.org/training/github-supply-chain-security-using-gitgat-lfd122x/).

</details>

<details>
  <summary>  <b> Gathering your Azure DevOps posture during the pipeline run: </b> </summary>

<img src='../../../../img/help/coming-soon.jpg' alt='Coming Soon'/>

</details>

### 3. Reports from application security scanners

You can gather the output of your application security scanners (such as SAST, SCA, and DAST) as evidence to attest to your software’s security level and evaluate it with your policies.
In your build script use:

```
valint bom <file_path> -o [statement-generic, attest-generic] -p [predicate-type] [FLAGS]
```

For example, gathering evidence of a Trivy output:

```
valint bom report.sarif -o attest-generic -p https://aquasecurity.github.io/trivy/v0.42/docs/configuration/reporting/#sarif
```

Following are the currently supported predicate types:

| predicate-type | file-format | tool |
| --- | --- | --- |
|  https://aquasecurity.github.io/trivy/v0.42/docs/configuration/reporting/#sarif <br /> https://aquasecurity.github.io/trivy/v0.42/docs/configuration/reporting/#json | sarif <br /> json | trivy |
|  https://cyclonedx.org/bom | CycloneDX | Syft | 

You can read more about Trivy integration [here](http://tbd).

## Signing & verifying attestations

You can sign or verify evidence using local keys, a certificate, or a CA file. 

```
valint bom busybox:latest -o attest --attest.default x509
valint verify busybox:latest --attest.default x509
```

Where ``--attest.default`` defines the singing method.  

For more options, you can read [here](http://tbd).

## Storing Evidence

You can use different types of evidence stores for the gathered evidence. 

After evidence is gathered Valint evaluates policies at different enforcement points by pulling this evidence from any of these stores.

### 1. Scribe Hub store

To connect Valint to the evidence store set in its configuration the Scribe Hub API client id and client secret 
Go to Scribe Hub left navigation page > Integrations and copy the client id and secret:

<img src='../../../img/ci/integrations-secrets.jpg' alt='Scribe Integration Secrets' width='70%' min-width='400px'/>

You can configure the secrets as flags as in the following example, or in Valint’s [configuration](../integrating-scribe/valint/configuration)

```
# Generate and push evidence to registry
valint bom [target] -o [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] --f -E \
-U $SCRIBE_CLIENT_ID \
-P $SCRIBE_CLIENT_SECRET
```

### 2. File system folder

By default Valint stores evidence locally in a cache folder. You can specify another output folder by using the flags: ``--output-directory`` or ``--output-file``.

**Example:**
```
# Save evidence to custom path
valint bom busybox:latest --output-file my_sbom.json

ls -lh my_sbom.json

# Change evidence cache directory
valint bom busybox:latest --output-directory ./my_evidence_cache

ls -lhR my_evidence_cache
```

### 3. OCI Registry

To store evidence in your OCI registry such as Artifactory specify the registry URL in your Valint call and add the ``--oci`` flag.

**Example:**
```
# Login to registry
docker login $

# Generate and push evidence to registry
valint bom [target] -o [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] --oci --oci-repo $REGISTRY_URL
```

## Applying a policy to evidence

You can apply canned policies or custom policies as code:
1. Scribe offers several sample Rego policies in this [repo](https://github.com/scribe-public/sample-policies "Sample Policies") that you can fork and use in your deployment.
2. Verifying Image has a verified signature.

When signing an image SBOM the effect is singing the image hash as well as including it in the image’s SBOM.

**Example:**
Sign
```
$HOME/.scribe/bin/valint bom busybox:latest -o attest -f
```

Verify
```
$HOME/.scribe/bin/valint verify busybox:latest -i attest
```

You can learn more about signing and verification [here](http://tbd).

You can verify an image in a policy by configuring the ``image-policy.yaml`` file as in the following example:
```yaml
attest:
  cocosign:
    policies:
      - name: my-image-policy
        enable: true
        input:
              signed: true
              format: attest-cyclonedx-json # verifies that the evidense is of this format
              identity:
                emails:
                    jhon@scribesecurity.com #the email that must have signed the evidence
              match:
                target_type: image
                Context_type: github #the image must have arrived from github
```

Check out this [video](https://www.youtube.com/watch?v=BXD21zhgkMM) on Valint to learn more about policies.

