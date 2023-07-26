---
sidebar_label: "Securing your software builds using SLSA framework"
title: "Securing your software builds using SLSA framework"
sidebar_position: 2
toc_min_heading_level: 2
toc_max_heading_level: 5
---

**[SLSA](https://slsa.dev/)** (Supply Chain Levels for Software Artifacts) is a security framework to prevent tampering, improve integrity, and secure packages and infrastructure. SLSA is organized into levels, with each level representing incremental progress over the previous one.

**Level 1 Requirements:**
* Fully script or automate your build process: Automate your build process using tools like ``makefile`` or GitHub Actions to ensure consistent and repeatable builds.
* Generate provenance documentation: Create provenance documentation that includes information about the "who," "where," and "when" of a piece of software.

**Level 2 Requirements:**
* Ensure software artifacts are tamper-evident: Implement measures to detect and prevent tampering with software artifacts, such as code signing and integrity checks.
* Establish a strong identity for software artifacts: Use cryptographic techniques to establish a strong identity, making verifying their authenticity easier.

#### using `valint slsa`​
To achieve SLSA Level 1 using `valint slsa`:

```
# Create unsigned SLSA Provenance
valint slsa <target>
```

**Level 3 Requirements:**
* Use a tamper-resistant build service: Implement a trusted builder, such as the one provided by GitHub Actions, to perform builds and generate non-forgeable provenance metadata.
* Generate non-forgeable provenance metadata: The provenance metadata should detail how an artifact was built, enabling comprehensive verification of its integrity.

To implement SLSA Level 3 compliance, you can leverage for example, GitHub Actions and Scribe. GitHub Actions allows you to automate the build process. Scribe generates non-forgeable provenance metadata, and tools signing software and verifying its provenance.

By integrating a trusted builder into GitHub Actions workflows and generating non-forgeable provenance metadata, you can demonstrate compliance with SLSA Level 3. Users of your projects can then use the verification tools to ensure that the artifacts they are using originated from the expected source code repository.

#### using `valint slsa`​
To achieve SLSA Level 3 using `valint slsa`:

* In trusted builder,run the following to attach any number of external evidence on the trustiness of the build system.
```
# create `evidence_path` file using any third party tool
valint bom <evidence_path> -o generic-attest --predicate-type <third-party-custom-predicate> --label builder_slsa_evidence
```

* In trusted builder run the following,
```
# Create signed SLSA Provenance
valint slsa <target> -o attest --label builder_slsa_evidence
```

### Configuration

In order to enable SLSA evaluation configure the following:
1. **[Generate a Provenance Attestation](#provenance)**.
2. Generate an attestation of the security posture of the Source Code Manager related to your build.
3. Scribe Hub generates a **[compliance report](../../scribe-hub-reports/compliance)** you can review. 

Read about how you can evaluate your posture against SLSA **[here](../secure-sfw-slsa/slsapolicies)**.

The normative process of assuring and attesting that your software was built securely comprises the following steps:
1. Gather evidence continuously from every software build.
2. Sign and store in an evidence store by a key you own.
3. Apply policies to it to verify evidence integrity, assure consistent security controls, and a secure development process.

## Provenance

A provenance attestation, provides evidence that your software artifact originated from the authorized build agent and code repository. This is a critical component in fulfilling SLSA level 3 requirements.

**Step 1:** Plugin Installation
If you haven’t installed the CI plugin, **[Install the Scribe Valint plugin in your CI system](../../integrating-scribe/ci-integrations/)**.

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

This command creates provenance in compliance with the **[SLSA v1 specification](https://slsa.dev/provenance/v1)**. 
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

For details on how to interpret the compliance report, you can read our guide **[here](../../scribe-hub-reports/compliance)**.
</details>

<details>
  <summary>  <b> Gathering your GitHub posture during the pipeline run: </b> </summary>

Scribe's **[GitGat](https://github.com/scribe-public/gitgat#readme)** is an open-source tool based on **[OPA](https://www.openpolicyagent.org/docs/latest/)** (Open Policy Agent) and leverages policies written in the Rego language, that evaluate the security posture of your GitHub account. This utility generates a report on your SCM account's security settings.

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

You can read more about **[here](https://github.com/scribe-public/gitgat#readme)** the GitGat full documentation here or view the **[free course](https://training.linuxfoundation.org/training/github-supply-chain-security-using-gitgat-lfd122x/)**.

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

<!-- You can read more about Trivy integration **[here](../../integrating-scribe/valint/integrating-scribe/valint/docs/attestations/#default-configuration)**. -->

## Signing & verifying attestations

You can sign or verify evidence using local keys, a certificate, or a CA file. 

```
valint bom busybox:latest -o attest --attest.default x509
valint verify busybox:latest --attest.default x509
```

Where ``--attest.default`` defines the singing method.  

For more options, you can read **[here](../securing-builds)**.

## Storing Evidence

You can use different types of evidence stores for the gathered evidence. 

After evidence is gathered Valint evaluates policies at different enforcement points by pulling this evidence from any of these stores.

### 1. Scribe Hub store

To connect Valint to the evidence store set in its configuration the Scribe Hub API client id and client secret 
Go to Scribe Hub left navigation page > Integrations and copy the client id and secret:

<img src='../../../img/ci/integrations-secrets.jpg' alt='Scribe Integration Secrets' width='70%' min-width='400px'/>

You can configure the secrets as flags as in the following example, or in Valint’s **[configuration](../integrating-scribe/valint/docs/configuration)**.

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
1. Scribe offers several sample Rego policies in this **[repo](https://github.com/scribe-public/sample-policies "Sample Policies")** that you can fork and use in your deployment.
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

You can learn more about signing and verification **[here](../../integrating-scribe/valint/getting-started-valint/##using-valint-to-generate-and-sign-an-sbom)**.

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

Check out this **[video](https://www.youtube.com/watch?v=BXD21zhgkMM)** on Valint to learn more about policies.

<!-- 
### Generating the SLSA provenance in your pipeline

1. Add the project credential according to the **[GitHub instructions](https://docs.github.com/en/actions/security-guides/encrypted-secrets/ "GitHub Instructions")**. Based on the code example below, be sure to call the secret **productkey** for the **product-key**.
2. Add the Code snippet to your pipeline from your GitHub flow:   
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

This code snippet generates a SLSA provenance file for the artifact it is run on, usually an image. To see that provenance information you need to go to the **Actions** tab in your GitHub repository.

<img src='../../../../img/ci/actions_tab.jpg' alt='Actions tab' width='70%' min-width='750px'/> 

There you can examine the workflows and actions you have run on this GitHub repository. Once you have run a workflow that includes the SLSA provenance generation you'll be able to find the resulting file at the bottom of the page:

<img src='../../../../img/ci/slsa_provenance.jpg' alt='SLSA provenance file' width='70%' min-width='750px'/>

The provenance information is in in-toto format and looks like this:

<img src='../../../../img/ci/slsa_provenance_intoto.jpg' alt='SLSA Provenance in-toto format' width='70%' min-width='750px'/>

-->

Valint is a powerful tool that validates the integrity of your **software supply chain**, providing organizations with a way to enforce `policies` using the Scribe Service, CI, or admission controller. 
It also provides a mechanism for compliance and transparency, both within the organization and with external parties.

By managing `evidence` generation, storage, and validation, Valint ensures that your organization's `policies` are enforced throughout the supply chain. <br />
You can store evidence locally or in any OCI registry, as well as using the Scribe Service for storage.

In addition to evidence management, Valint also **generates** evidence for a range of targets, including directories, file artifacts, images, and git repositories. It supports two types of evidence: **CycloneDX SLSA Provenances** and **SLSA provenance**. With Valint, you can sign and verify artifacts against their origin and signer identity in the supply chain.

Valint also enables you to **generate** any 3rd party report, scan or configuration (any file) into evidence using the **Generic evidence** subtype. Enabling compliance requirements to refer and attest to your custom needs.


### Evidence formats
Valint supports the following evidence formats.

| Format | alias | Description | signed |
| --- | --- | --- | --- |
| statement-slsa | statement | In-toto SLSA Provenance Statement | no |
| attest-slsa | attest | In-toto SLSA Provenance Attestation | yes |


### SLSA Provenance
SLSA Provenance includes verifiable information about software artifacts describing where, when and how something was produced.
It is required for SLSA compliance level 2 and above.

> See details **[SLSA provenance spec](http://slsa.dev/provenance/v0.2)**
> See details **[SLSA requirements](http://slsa.dev/spec/v0.1/requirements)**


### Evidence Stores
Each Evidence store can be used to store, find and download evidence, which unifies all the evidence collected from the supply chain into a unified system.

### Scribe Evidence store
Scribe evidence store allows you to store evidence using scribe Service.

Related Flags:
> Note the flag set:
>* `-U`, `--scribe.client-id`
>* `-P`, `--scribe.client-secret`
>* `-E`, `--scribe.enable`

<!-- ### Before you begin
Integrating Scribe Hub with your environment requires the following credentials that are found on the **Integrations** page. (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **integrations**)

* **Client ID**
* **Client Secret**

<img src='../../../img/ci/integrations-secrets.jpg' alt='Scribe Integration Secrets' width='70%' min-width='400px'/> -->

### Usage
```bash
# Generating evidence, storing in scribe service.
valint slsa [target] -o [attest, statement] \
  -E \
  -U [SCRIBE_CLIENT_ID] \
  -P [SCRIBE_CLIENT_SECRET]

# Verifying evidence, pulling attestation from scribe service.
valint verify [target] -i [attest-slsa, statement-slsa] \
  -E \
  -U [SCRIBE_CLIENT_ID] \
  -P [SCRIBE_CLIENT_SECRET]
```

### OCI Evidence store
Admission supports both storage and verification flows for `attestations` and `statement` objects utilizing OCI registry as an evidence store.

Using OCI registry as an evidence store allows you to upload, download and verify evidence across your supply chain in a seamless manner.

Related flags:
* `--oci` Enable OCI store.
* `--oci-repo` - Evidence store location.


### Docker hub limitation
Docker hub does not support the subpath format, `oci-repo` should be set to your Docker hub Username.

> Some registries, like Jfrog, allow multi layer format for repo names such as , `my_org.jfrog.io/policies/attestations`.

### OCI Repo flag
`oci-repo` setting indicates the location in a registry under which the evidence are stored.
It must be a dedicated location in an OCI registry.
for example, `scribesecuriy.jfrog.io/my_docker-registry/evidence`.

### Before you begin
Evidence can be stored in any accusable registry.
* Write access is required for upload (generate).
* Read access is required for download (verify).

You must first log in with the required access privileges to your registry before calling Valint.
For example, using the `docker login` command.

### Usage
```bash
# Generating evidence, storing on [my_repo] OCI repo.
valint slsa [target] -o [attest, statement] --oci --oci-repo=[my_repo]

# Verifying evidence, pulling attestation from [my_repo] OCI repo.
valint verify [target] -i [attest-slsa, statement-slsa] --oci --oci-repo=[my_repo]
```

> For image targets **only** you may attach the evidence in the same repo as the image.

```bash
valint slsa [image] -o [attest, statement] --oci

valint verify [image] -i [attest-slsa, statement-slsa] --oci
```

> For related Cosign support, see [cosign](#-cosign-support) section.

### Cache Evidence store
Valint supports both storage and verification flows for `attestations` and `statement` objects utilizing a local directory as an evidence store.
This is the simplest form and is mainly used to cache previous evidence creation. 

Related flags:
* `--cache-enable`
* `--output-directory`
* `--force`

> By default, this cache store enabled, disable by using `--cache-enable=false`

### Usage
```bash
# Generating evidence, storing on [my_dir] local directory.
valint slsa [target] -o [attest, statement] --output-directory=[my_dir]

# Verifying evidence, pulling attestation from [my_dir] local directory.
valint verify [target] -i [attest-slsa, statement-slsa] --output-directory=[my_dir]
```

> By default, the evidence is written to `~/.cache/valint/`, use `--output-file` or `-d`,`--output-directory` to customize the evidence output location. 


## Basic examples
<details>
  <summary>  Docker built image </summary>

Create SLSA Provenance for image built by local docker `image_name:latest` image.

```bash
docker build . -t image_name:latest
valint slsa image_name:latest
``` 
</details>

<details>
  <summary>  Private registry image </summary>

Create SLSA Provenance for images hosted by a private registry.

> `docker login` command is required to enable access the private registry.

```bash
docker login
valint slsa scribesecuriy.jfrog.io/scribe-docker-local/stub_remote:latest
```
</details>

<details>
  <summary>  Include specific environment </summary>

Custom env added to SLSA Provenance internal parameters.

```bash
export test_env=test_env_value
valint slsa busybox:latest --env test_env 
```

</details>

<details>
  <summary>  Include ALL environment </summary>

ALL environment added to SLSA Provenance.

```bash
export test_env=test_env_value
valint slsa busybox:latest --all-env
```

</details>


<details>
  <summary> Custom evidence location </summary>

Use flags `--output-directory` or `--output-file` flags to set the default location.

```bash
# Save evidence to custom path
valint slsa busybox:latest --output-file my_slsa_provenance.json
ls -lh my_slsa_provenance.json

# Change evidence cache directory 
valint slsa busybox:latest --output-directory ./my_evidence_cache
ls -lhR my_evidence_cache
``` 
</details>

<details>
  <summary> Docker archive image  </summary>

Create SLSA Provenance for local `docker save ...` output.

```bash
docker save busybox:latest -o busybox_archive.tar
valint slsa docker-archive:busybox_archive.tar
``` 
</details>

<details>
  <summary> Directory target  </summary>

Create SLSA Provenance for a local directory.

```bash
mkdir testdir
echo "test" > testdir/test.txt

valint slsa dir:testdir
``` 
</details>


<details>
  <summary> Git target  </summary>

Create SLSA Provenance for `mongo-express` remote git repository.

```bash
valint slsa git:https://github.com/mongo-express/mongo-express.git
``` 

Create SLSA Provenance for `yourrepository` local git repository.

```bash
git clone https://github.com/yourrepository.git
valint slsa git:yourrepository
``` 

</details>

<details>
  <summary>  Public registry image  </summary>

Create SLSA Provenance for remote `busybox:latest` image.

```bash
valint slsa busybox:latest
``` 

</details>

<details>
  <summary> Attest target </summary>

Create and sign SLSA Provenance for target. <br />

> By default, *Valint* is using **[Sigstore](https://www.sigstore.dev/ "Sigstore")** interactive flow as the engine behind the signing mechanism.

```bash
valint slsa busybox:latest -o attest
``` 
</details>

<details>
  <summary> Attest and verify image target </summary>

Generating and verifying SLSA Provenance `attestation` for image target `busybox:latest`.

> By default, *Valint* is using **[Sigstore](https://www.sigstore.dev/ "Sigstore")** interactive flow as the engine behind the signing mechanism.

```bash
# Create SLSA Provenance attestations
valint slsa busybox:latest -vv -o attest

# Verify SLSA Provenance attestations
valint verify busybox:latest -i attest-slsa
```
</details>

<details>
  <summary> Attest and verify Git repository target  </summary>

Generating and verifying `statements` for remote git repo target `https://github.com/mongo-express/mongo-express.git`.

```bash
valint slsa git:https://github.com/mongo-express/mongo-express.git -o attest
valint verify git:https://github.com/mongo-express/mongo-express.git
``` 

Or for a local repository
```bash
# Cloned a local repository
git clone https://github.com/mongo-express/mongo-expressvalint ver.git

# Create CycloneDX SLSA Provenance attestations
valint slsa git:./mongo-express -o attest

# Verify CycloneDX SLSA Provenance attestations
valint verify git:./mongo-express -i attest-slsa
```
</details>

<details>
  <summary> Store evidence on OCI </summary>

Store any evidence on any OCI registry. <br />
Support storage for all targets and both SLSA Provenance and SLSA evidence formats.

> Use `-o`, `--format` to select between supported formats. <br />
> Write permission to `--oci-repo` value is required. 

```bash
# Login to registry
docker login $

# Generate and push evidence to registry
valint slsa [target] -o [attest, statement] --oci --oci-repo $REGISTRY_URL

# Pull and validate evidence from registry
valint verify [target] -i [attest-slsa, statement-slsa] --oci --oci-repo $REGISTRY_URL -f
```
> Note `-f` in the verification command, which skips the local cache evidence lookup.

</details>

<details>
  <summary> Store evidence on Scribe service </summary>

Store any evidence on any Scribe service. <br />
Support storage for all targets and both SLSA Provenance and SLSA evidence formats.

> Use `-o`, `--format` to select between supported formats. <br />
> Credentials for Scribe API is required. 

```bash

# Set Scribe credentials
export SCRIBE_CLIENT_ID=**
export SCRIBE_CLIENT_SECRET=**

# Generate and push evidence to registry
valint slsa [target] -o [attest, statement] --f -E \
  -U $SCRIBE_CLIENT_ID \
  -P $SCRIBE_CLIENT_SECRET

# Pull and validate evidence from registry
valint verify [target] -i [attest-slsa, statement-slsa] -f -E \
  -U $SCRIBE_CLIENT_ID \
  -P $SCRIBE_CLIENT_SECRET
```

> Note `-f` in the verification command, which skips the local cache evidence lookup.

</details>


<!-- # Reaching SLSA Levels with `valint slsa`
​
## Background
SLSA (Supply-chain Levels for Software Artifacts) is a security framework aiming to prevent tampering, improve integrity, and secure packages and infrastructure. The core concept of SLSA is that a software artifact can be trusted only if it complies to three requirements:
1. The artifact should have a Provenance document, describing it's origin and build process (L1).
2. The Provenance document should be trustworthy and verified downstream (L2).
3. The build system should be trustworthy (L3).
​
The SLSA framework defines levels, which represent how secure the software supply chain is. These levels correspond to the level of implementation of these requirements.
​
Scribe's `valint slsa` command can be used to produce Provenance documents. Following we describe how to achieve SLSA levels alongside with using this tool.
​
Note: We refer here to the SLSA V1.0 framework.
​
## SLSA L1
The **[requirements](https://slsa.dev/spec/v1.0/levels#build-l1)** for SLSA L1 include:
- Software producer follows a consistent build process.
- Build platform automatically generates provenance describing how the artifact was built.
- Software producer distributes provenance to consumers.
​
Checklist for achieving SLSA L1:
- Build your software using a CI system. Preferably use a build script that is source-controlled.
- Activate the `valint slsa` command as part of your build script to create a Provenance docuement. Notice that the `valint slsa` command allows adding additional information to the Provenance document - on can tailor some of the content of the Provenance document to his needs.

#### using `valint slsa`​
To achieve SLSA Level 1 using `valint slsa`:

```
# Create unsigned SLSA Provenance
valint slsa <target>
```
​
## SLSA L2
The **[requirements](https://slsa.dev/spec/v1.0/levels#build-l2)** for SLSA L2 include:
- The SLSA L1 requirements.
- The build runs on a hosted build platform that generates and signs the provenance itself. 
- Downstream verification of provenance includes validating the authenticity of the provenance.
​
Checklist for achieving SLSA L2:

- The SLSA L1 checklist.
- Use a hosted build service (as opposed to performing a build on the developer machine).
- Create a signed Provenance document (instead of the unsigned that is enough for SLSA L1) This can be achieved by running ```valint slsa ... -o attest```. 
- Verify the authenticity of the Provenance document downstream using the ```valint verify``` command.

#### using `valint slsa`​
To achieve SLSA Level 2 using `valint slsa`:

```
# Create signed SLSA Provenance
valint slsa <target> -o attest
```

# SLSA L3
## Requirements
The **[requirements](https://slsa.dev/spec/v1.0/levels#build-l3)** for SLSA L3 include:
- The SLSA L2 requirements.
- Build platform implements strong controls to:
    - prevent runs from influencing one another, even within the same project.
    - prevent secret material used to sign the provenance from being accessible to the user-defined build steps.
​
In addition, in order to trust the build platform, one needs to **[verify the build platform](https://slsa.dev/spec/v1.0/verifying-systems)**. The build platform should be trusted in the sense that the Provenance document will be **[unforgeable](https://slsa.dev/spec/v1.0/requirements#provenance-unforgeable)** and the build will be **[isolated](https://slsa.dev/spec/v1.0/requirements#isolated)**. 


Such verification derives the following requirements:
- Verify the trustworthiness of the build platform itself. 
    - Such a verification should be done with the build platform vendor for SaaS CIs. In cases that the software producer is responsible for the deployment of the build system, a combination of vendor-self-attestation, and performing an analysis of the deployment aspects is recommended.
    - For example; When deploying a self-hosted CI, the vendor attestation should declare how builds are isolated from each other, and the deployment analysis should verify the access-permissions and log-auditing of the CI system. 
- Verify that the use of platform does not break the unforgeability and isolation requirements.
​
​
### Checklist for achieving SLSA L3
- The SLSA L2 checklist.
- Assess the CI system. The goal is to answer the following questions:
    - in what conditions can a unauthorized entity evade the build system
    - in what conditions can build affect each other.
- Isolate the generation of the Provenance document:
    - If the build systems supports secure build runners - use a secure runner (example: **[GitHub](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners)**), 
​
    or
​
    - Separate the creation of the Provenance document to a different pipeline, preferably on a separate build service. 
        - Expose to this pipeline only the secret materials used for signing the Provenance document.
        - Either create or verify the Provenance document content on this pipeline. In the case of verifying, verify all possible fields of an in-pipeline-generated Provenance document with data collected directly from the build platform, or from other trusted sources. 
- Isolate, and verify the isolation of the build pipeline from other pipeline runs:
    - Verify not using caches, volumes shared with other pipeline runs.
    - Verify that secrets shared with other pipelines cannot allow for pipelines to affect each other.
    - Verify that pipeline runs cannot affect each other
        - example - prevent installations done through one pipeline to affect other pipeline runs. This can be done by using ephemeral build-runners (such as a container that is created for each build), or by verifying that build-runners start each time from a predefined state.
​
These requirements are challenging and the SLSA framework specifically suggests that organizations gradually evolve from SLSA L2 to SLSA L3 compliance. 

#### using `valint slsa`​
To achieve SLSA Level 3 using `valint slsa`:

* In trusted builder,run the following to attach any number of external evidence on the trustiness of the build system.
```
# create `evidence_path` file using any third party tool
valint bom <evidence_path> -o generic-attest --predicate-type <third-party-custom-predicate> --label builder_slsa_evidence
```

* In trusted builder run the following,
```
# Create signed SLSA Provenance
valint slsa <target> -o attest --label builder_slsa_evidence
```

### Build service trusted builder
> When build service supports a trusted builder

use it, and use the the trusted builder to run `valint slsa` command to create the Provenance document.
​ -->

### Self attestation trusted builder
> When build service does supports a trusted builder
​
Instrument the build pipeline for generating all attestations that will be needed to populate the Provenance document. For example, you may decide you want a list of the dependencies installed during the build. This list can be generated by a ```valint bom dir:``` command. In addition, create a Provenance attestation in the pipeline using the `valint slsa` command.
- Create a separate trusted-provenance-generation pipeline that will perform the following
    - Generate a trusted Provenance document, based on the one created in the build pipeline;
        - Collect data from the build service and use it to verify and update the Provenance document.
        - Verify the content of attestations created in the build-pipeline. For example, verify the content of the build-runner by comparing an SBOM attestation from the build-pipeline with an SBOM attestation that was sampled separately.
        - Use attestations collected from the build pipeline to update the Provenance document.
        - Updating the Provenance document can be done using `valint slsa` command.
    - Verify that the build was isolated, by evaluating data collected from the build service. For example - verify the use of caches an secrets.
​
In order to perform such data collection and evaluation, Scribe provides tools that create attestations to the build run, and perform the verifications needed.  

​Please **[Contact-us](https://scribesecurity.com/contact-us/)** for designing and implementing such a deployment.
