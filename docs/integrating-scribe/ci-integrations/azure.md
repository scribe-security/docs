---
sidebar_label: "Azure Pipelines"
title: Azure Pipelines
sidebar_position: 4
---

Use the following instructions to integrate your Azure pipelines with Scribe.

### 1. Obtain a Scribe Hub API Token
1. Sign in to [Scribe Hub](https://app.scribesecurity.com). If you don't have an account you can sign up for free [here](https://scribesecurity.com/scribe-platform-lp/ "Start Using Scribe For Free").

2. Create a Scribe Hub API token [here](https://app.scribesecurity.com/settings/tokens). Copy it to a safe temporary notepad until you complete the integration. </br></br>
**Note** the token is a secret and will not be accessible from the UI after you finalize the token generation. 

### 2. Add the API token to the Azure DevOps secrets

Add the Scribe Hub API token as SCRIBE_TOKEN to your Azure environment by following the instructions in [Azure DevOps - Set secret variables](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/set-secret-variables?view=azure-devops&tabs=yaml%2Cbash "Azure DevOps - Set secret variables").
### 3. Install Scribe CLI

**Valint** -Scribe CLI- is required to generate evidence in such as SBOMs and SLSA provenance. 
1. Install Azure DevOps [Valint-task](https://marketplace.visualstudio.com/items?itemName=ScribeSecurity.valint-cli) from the Azure marketplace.  <br />
2. Follow **[install-an-extension](https://learn.microsoft.com/en-us/azure/devops/marketplace/install-extension?view=azure-devops&tabs=browser#install-an-extension)** to add the extension to your organization and use the task in your pipelines.  <br />

### 4. Instrument your build scripts

### Basic example
Generate an SBOM of an image built in the pipeline by adding a step to call Valint at the end of the build. 
In your Azure DevOps project make sure you have a file named `azure-pipelines.yml` and add the following steps to it after the build step:

```yaml
  - job: scribe_azure_job
    displayName: scribe azure job
  
    pool:
      vmImage: 'ubuntu-latest'

    steps:
    - task: ScribeInstall@0
    - task: ValintCli@0
      displayName: SBOM image `busybox:latest`.
      command: bom
      target: nginx
      format: statement
      outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
      scribeEnable: true
      scribeClientSecret: $(SCRIBE_TOKEN)
```

### Additional examples

<details>
  <summary> Generate an SBOM for an image in a public registry </summary>

```YAML
- task: ValintCli@0
  displayName: Generate cyclonedx json SBOM
  inputs:
    commandName: bom
    target: busybox:latest
    outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
    force: true
    scribeEnable: true
    scribeClientSecret: $(SCRIBE_TOKEN)
``` 

</details>

<details>
  <summary> Add NTIA metadata to SBOM </summary>

```YAML
trigger:
  branches:
    include:
    - main

jobs:
- job: scribe_azure_job
  displayName: 'Scribe Azure Job'
  pool:
    name: {Update pool name here}		# Example: Mikey
    agent: {Update agent name here}		# Example: azure-runner-ubuntu

  variables:
    imageName: 'pipelines-javascript-docker'
    # SBOM Author meta data - Optional
    AUTHOR_NAME: John-Smith
    AUTHOR_EMAIL: john@thiscompany.com
    AUTHOR_PHONE: 555-8426157
    # SBOM Supplier meta data - Optional
    SUPPLIER_NAME: Scribe-Security
    SUPPLIER_URL: www.scribesecurity.com
    SUPPLIER_EMAIL: info@scribesecurity.com
    SUPPLIER_PHONE: 001-001-0011

  steps:
  - task: scribeInstall@0

  - task: ValintCli@0
    inputs:
      command: bom
      target: nginx
      format: statement
      outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
      scribeEnable: true
      scribeClientSecret: $(SCRIBE_TOKEN)
      author-name: $(AUTHOR_NAME)
      author-email: $(AUTHOR_EMAIL)
      author-phone: $(AUTHOR_PHONE)
      supplier-name: $(SUPPLIER_NAME)
      supplier-url: $(SUPPLIER_URL)
      supplier-email: $(SUPPLIER_EMAIL)
      supplier-phone: $(SUPPLIER_PHONE)

  - task: ValintCli@0
    inputs:
      command: verify
      target: nginx
      inputFormat: statement
      outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
      scribeEnable: true
      scribeClientSecret: $(SCRIBE_TOKEN)
```
</details>


<details>
  <summary> Generate SLSA provenance for an image in a public registry </summary>

```YAML
- task: ValintCli@0
  displayName: Generate SLSA provenance
  inputs:
    commandName: slsa
    target: busybox:latest
    outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
    force: true
    scribeEnable: true
    scribeClientSecret: $(SCRIBE_TOKEN)
``` 

</details>

<details>
  <summary> Generate an SBOM for for an image built with local docker </summary>

```YAML
- task: ValintCli@0
  displayName: Generate cyclonedx json SBOM
  inputs:
    commandName: bom
    target: image_name:latest
    outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
    force: true
    scribeEnable: true
    scribeClientSecret: $(SCRIBE_TOKEN)
``` 
</details>

<details>
  <summary> Generate SLSA provenance for for an image built with local docker </summary>

```YAML
- task: ValintCli@0
  displayName: Generate SLSA provenance
  inputs:
    commandName: slsa
    target: image_name:latest
    outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
    force: true
    scribeEnable: true
    scribeClientSecret: $(SCRIBE_TOKEN)
``` 
</details>

<details>
  <summary>  Generate an SBOM for an image in a private registry </summary>

> Add a `docker login` task before the adding the following task:

```YAML
- task: ValintCli@0
  displayName: Generate cyclonedx json SBOM
  inputs:
    commandName: bom
    target: scribesecurity.jfrog.io/scribe-docker-local/example:latest
    outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
    force: true
    scribeEnable: true
    scribeClientSecret: $(SCRIBE_TOKEN)
``` 
</details>

<details>
  <summary> Generate SLSA provenance for an image in a private registry </summary>

> Before the following task add a `docker login` task 

```YAML
- task: ValintCli@0
  displayName: Generate SLSA provenance
  inputs:
    commandName: slsa
    target: scribesecurity.jfrog.io/scribe-docker-local/example:latest
    outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
    force: true
    scribeEnable: true
    scribeClientSecret: $(SCRIBE_TOKEN)
``` 
</details>

<details>
  <summary>  Add custom metadata to SBOM </summary>

```YAML
- job: custom_bom
  displayName: Custom bom

  variables:
    - name: test_env
      value: test_env_value

  pool:
    vmImage: 'ubuntu-latest'

  steps:
  - task: ValintCli@0
    displayName: Generate cyclonedx json SBOM - add metadata - labels, envs, name
    inputs:
      commandName: bom
      target: 'busybox:latest'
      outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
      force: true
      env: test_env
      label: test_label
      scribeEnable: true
      scribeClientSecret: $(SCRIBE_TOKEN)
```
</details>
<details>
  <summary>  Add custom metadata to SLSA provenance </summary>

```YAML
- job: custom_slsa
  displayName: Custom slsa

  variables:
    - name: test_env
      value: test_env_value

  pool:
    vmImage: 'ubuntu-latest'

  steps:
  - task: ValintCli@0
    displayName: Generate cyclonedx json SBOM - add metadata - labels, envs, name
    inputs:
      commandName: slsa
      target: 'busybox:latest'
      outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
      force: true
      env: test_env
      label: test_label
      scribeEnable: true
      scribeClientSecret: $(SCRIBE_TOKEN)
```
</details>

<details>
  <summary> Export SBOM as an artifact </summary>

> Use `format` input argumnet to set the format.

```YAML
- task: ValintCli@0
  displayName: SBOM image `busybox:latest`.
  inputs:
    command: bom
    target: busybox:latest
    outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
    outputFile: $(Build.ArtifactStagingDirectory)/my_sbom.json
    force: true
    scribeEnable: true
    scribeClientSecret: $(SCRIBE_TOKEN)

# Using `outputDirectory` evidence cache dir
- publish: $(Build.ArtifactStagingDirectory)/scribe/valint
  artifact: scribe-evidence

# Using `outputFile` custom path.
- publish: $(Build.ArtifactStagingDirectory)/my_sbom.json
  artifact: scribe-sbom
``` 
</details>

<details>
  <summary> Export SLSA provenance as an artifact </summary>

> Use `format` input argumnet to set the format.

```YAML
- task: ValintCli@0
  displayName: SLSA image `busybox:latest`.
  inputs:
    command: slsa
    target: busybox:latest
    outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
    outputFile: $(Build.ArtifactStagingDirectory)/my_slsa.json
    force: true
    scribeEnable: true
    scribeClientSecret: $(SCRIBE_TOKEN)

# Using `outputDirectory` evidence cache dir
- publish: $(Build.ArtifactStagingDirectory)/scribe/valint
  artifact: scribe-evidence

# Using `outputFile` custom path.
- publish: $(Build.ArtifactStagingDirectory)/my_slsa.json
  artifact: scribe-slsa
``` 
</details>

<details>
  <summary> Generate an SBOM of a local file directory </summary>

```YAML
- bash: |
    mkdir testdir
    echo "test" > testdir/test.txt

- task: ValintCli@0
  displayName: SBOM local directory.
  inputs:
    command: bom
    target: dir:testdir
    outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
    force: true
    scribeEnable: true
    scribeClientSecret: $(SCRIBE_TOKEN)
``` 
</details>

<details>
  <summary> Generate SLSA provenance of a local file directory </summary>

```YAML
- bash: |
    mkdir testdir
    echo "test" > testdir/test.txt

- task: ValintCli@0
  displayName: SLSA local directory.
  inputs:
    command: slsa
    target: dir:testdir
    outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
    force: true
    scribeEnable: true
    scribeClientSecret: $(SCRIBE_TOKEN)

``` 
</details>

<details>
  <summary> Generate an SBOM of a git repo </summary>
For a remote git repo: </br>
  
```YAML
- task: ValintCli@0
  displayName: SBOM remote git repository.
  inputs:
    command: bom
    target: git:https://github.com/mongo-express/mongo-express.git 
    outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
    force: true
    scribeEnable: true
    scribeClientSecret: $(SCRIBE_TOKEN)
```
For a local git repo: </br>
**Note** If you use implicit checkout, **[git-strategy](https://learn.microsoft.com/en-us/azure/devops/pipelines/yaml-schema/steps-checkout?view=azure-pipelines)** affects the commits collected into the SBOM.

```YAML
- checkout: self

- task: ValintCli@0
  displayName: SBOM local git repository.
  inputs:
    command: bom
    target: git:. 
    outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
    force: true
    scribeEnable: true
    scribeClientSecret: $(SCRIBE_TOKEN)
``` 
</details>
<details>
  <summary> Generate SLSA provenance of a git reop </summary>
For a remote git repo:
  
```YAML
- task: ValintCli@0
  displayName: SBOM remote git repository.
  inputs:
    command: slsa
    target: git:https://github.com/mongo-express/mongo-express.git 
    outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
    force: true
``` 

> For a local git repo

```YAML
- checkout: self

- task: ValintCli@0
  displayName: SLSA local git repository.
  inputs:
    command: slsa
    target: git:. 
    outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
    force: true
``` 
</details>
<details>
  <summary> Using an OCI registry as an evidence store instead of Scribe Hub </summary>
For on-prem deployment scenarios where you do not want to utilize Scribe Hub as a SaaS you can store, retrieve, and verify evidence with an OCI Resitry <a href="https://scribe-security.netlify.app/docs/integrating-scribe/other-evidence-stores">(learn more)</a>

Related flags:
* `--oci` Enable OCI store.
* `--oci-repo` - Evidence store location.

1. Allow Valint Read and Write access to this registry.
2. Login to the registry, for example by `docker login`.

```yaml
- job: scribe_azure_job
  pool:
    vmImage: 'ubuntu-latest'

  variables:
    imageName: 'pipelines-javascript-docker'

  steps:
  - script: echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin [my_registry]

  - task: scribeInstall@0

  - task: ValintCli@0
    inputs:
      commandName: bom
      target: [target]
      format: [attest, statement]
      outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
      oci: true
      ociRepo: [oci_repo]

  - task: ValintCli@0
    inputs:
      commandName: verify
      target: [target]
      inputFormat: [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic]
      outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
      oci: true
      ociRepo: [oci_repo]
```
</details>
