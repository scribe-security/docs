---
sidebar_label: "Azure Pipelines"
title: Azure Pipelines
sidebar_position: 4
---

# Azure Pipelines Task

Scribe offers users of Azure Pipelines to use DevOps Tasks for embedding evidence collection and integrity verification in their workflows.

Task in Azure DevOps is a feature that enables users to create, schedule, and manage tasks from a central location. Task provides users with an easy way to automate common workflows and activities in Azure DevOps. It provides several actions enabling the generation of SBOMs from various sources.
The usage examples on this page demonstrate several use cases of SBOM collection (SBOM from a publicly available Docker image, SBOM from a Git repository, SBOM from a local directory) as well as several use cases of uploading the evidence either to the Azure DevOps pipelines or to the Scribe Service.

### Installation
**[Valint-task](https://marketplace.visualstudio.com/items?itemName=ScribeSecurity.valint-cli)** Can be found in Azure marketplace.  <br />
Follow **[install-an-extension](https://learn.microsoft.com/en-us/azure/devops/marketplace/install-extension?view=azure-devops&tabs=browser#install-an-extension)** to add the extension to your organization.  <br />
Once you have the extension installed you can use the task in your pipeline.

### Usage
```yaml
  - job: scribe_azure_job
    displayName: scribe azure job
  
    pool:
      vmImage: 'ubuntu-latest'

    steps:
    - task: ScribeInstall@0
    - task: ValintCli@0
      displayName: SBOM image `busybox:latest`.
      inputs:
        command: bom
        target: busybox:latest
        outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
```

### Target types - `[target]`
---
Target types are types of artifacts produced and consumed by your supply chain.
Using supported targets, you can collect evidence and verify compliance on a range of artifacts.

### Format

`[scheme]:[name]:[tag]` 

| Sources | target-type | scheme | Description | example
| --- | --- | --- | --- | --- |
| Docker Daemon | image | docker | use the Docker daemon | docker:busybox:latest |
| OCI registry | image | registry | use the docker registry directly | registry:busybox:latest |
| Docker archive | image | docker-archive | use a tarball from disk for archives created from "docker save" | image | docker-archive:path/to/yourimage.tar |
| OCI archive | image | oci-archive | tarball from disk for OCI archives | oci-archive:path/to/yourimage.tar |
| Remote git | git| git | remote repository git | git:https://github.com/yourrepository.git |
| Local git | git | git | local repository git | git:path/to/yourrepository | 
| Directory | dir | dir | directory path on disk | dir:path/to/yourproject | 
| File | file | file | file path on disk | file:path/to/yourproject/file | 


### Evidence Stores
Each storer can be used to store, find and download evidence, unifying all the supply chain evidence into a system is an important part to be able to query any subset for policy validation.

| Type  | Description | requirement |
| --- | --- | --- |
| scribe | Evidence is stored on scribe service | scribe credentials |
| OCI | Evidence is stored on a remote OCI registry | access to a OCI registry |

### Scribe Evidence store
Scribe evidence store allows you store evidence using scribe Service.

Related Flags:
> Note the flag set:
>* `scribeClientId`
>* `scribeClientSecret`
>* `scribeEnable`

### Before you begin
Integrating Scribe Hub with your environment requires the following credentials that are found in the **Integrations** page. (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **integrations**)

* **Client ID**
* **Client Secret**

<img src='../../../../img/ci/integrations-secrets.jpg' alt='Scribe Integration Secrets' width='70%' min-width='400px'/>


* Add the credentials to your Azure environment according to the **[Azure DevOps - Set secret variables](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/set-secret-variables?view=azure-devops&tabs=yaml%2Cbash "Azure DevOps - Set secret variables")**. 

* Open your Azure DevOps project and make sure you have a YAML file named `azure-pipelines.yml`.  

* Use the Scribe custom task as shown in the example bellow

:::note
***[Refer to this Azure document to configure runners.](https://learn.microsoft.com/en-us/azure/devops/pipelines/?view=azure-devops#:~:text=Manage%20agents%20%26%20self%2Dhosted%20agents)***
:::

### Usage
```yaml
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

  steps:
  - task: scribeInstall@0

  - task: ValintCli@0
    inputs:
      command: bom
      target: nginx
      format: statement
      outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
      scribeEnable: true
      scribeClientId: $(CLIENTID)
      scribeClientSecret: $(CLIENTSECRET)

  - task: ValintCli@0
    inputs:
      command: verify
      target: nginx
      inputFormat: statement
      outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
      scribeEnable: true
      scribeClientId: $(CLIENTID)
      scribeClientSecret: $(CLIENTSECRET)
```

### Alternative evidence stores
> You can learn more about alternative stores **[here](../other-evidence-stores)**.

<details>
  <summary> <b> OCI Evidence store </b></summary>

Valint supports both storage and verification flows for `attestations`  and `statement` objects utilizing OCI registry as an evidence store.

Using OCI registry as an evidence store allows you to upload, download and verify evidence across your supply chain in a seamless manner.

Related flags:
* `oci` Enable OCI store.
* `ociRepo` - Evidence store location.

### Before you begin
Evidence can be stored in any accusable registry.
* Write access is required for upload (generate).
* Read access is required for download (verify).

You must first login with the required access privileges to your registry before calling Valint.
For example, using `docker login` command.

### Usage
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
      format: [attest, statement, attest-slsa (depricated), statement-slsa (depricated), attest-generic, statement-generic]
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

### Basic examples

<details>
  <summary>  Public registry image (SBOM) </summary>

Create SBOM for remote `busybox:latest` image.

```YAML
- task: ValintCli@0
  displayName: Generate cyclonedx json SBOM
  inputs:
    commandName: bom
    target: busybox:latest
    outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
    force: true
``` 

</details>

<details>
  <summary>  NTIA Custom metadata (SBOM) </summary>

Attach custom SBOM NTIA metadata.

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
      scribeClientId: $(CLIENTID)
      scribeClientSecret: $(CLIENTSECRET)
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
      scribeClientId: $(CLIENTID)
      scribeClientSecret: $(CLIENTSECRET)
```
</details>


<details>
  <summary>  Public registry image (SLSA) </summary>

Create SLSA for remote `busybox:latest` image.

```YAML
- task: ValintCli@0
  displayName: Generate SLSA provenance
  inputs:
    commandName: slsa
    target: busybox:latest
    outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
    force: true
``` 

</details>

<details>
  <summary>  Docker built image (SBOM) </summary>

Create SBOM for image built by local docker `image_name:latest` image.

```YAML
- task: ValintCli@0
  displayName: Generate cyclonedx json SBOM
  inputs:
    commandName: bom
    target: image_name:latest
    outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
    force: true
``` 
</details>

<details>
  <summary>  Docker built image (SLSA) </summary>

Create SLSA for image built by local docker `image_name:latest` image.

```YAML
- task: ValintCli@0
  displayName: Generate SLSA provenance
  inputs:
    commandName: slsa
    target: image_name:latest
    outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
    force: true
``` 
</details>

<details>
  <summary>  Private registry image (SBOM) </summary>

Create SBOM for image hosted on private registry.

> Use `docker login` task to add access.

```YAML
- task: ValintCli@0
  displayName: Generate cyclonedx json SBOM
  inputs:
    commandName: bom
    target: scribesecurity.jfrog.io/scribe-docker-local/example:latest
    outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
    force: true
``` 
</details>

<details>
  <summary>  Private registry image (SLSA) </summary>

Create SBOM for image hosted on private registry.

> Use `docker login` task to add access.

```YAML
- task: ValintCli@0
  displayName: Generate SLSA provenance
  inputs:
    commandName: slsa
    target: scribesecurity.jfrog.io/scribe-docker-local/example:latest
    outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
    force: true
``` 
</details>

<details>
  <summary>  Custom metadata (SBOM) </summary>

Custom metadata added to SBOM.

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
```
</details>
<details>
  <summary>  Custom metadata (SLSA) </summary>

Custom metadata added to SLSA.

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
```
</details>

<details>
  <summary>  Save as artifact SBOM </summary>

Using input variable `outputDirectory` or `outputFile` to export evidence as an artifact.

> Use input variable `format` to select between supported formats.

```YAML
- task: ValintCli@0
  displayName: SBOM image `busybox:latest`.
  inputs:
    command: bom
    target: busybox:latest
    outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
    outputFile: $(Build.ArtifactStagingDirectory)/my_sbom.json
    force: true

# Using `outputDirectory` evidence cache dir
- publish: $(Build.ArtifactStagingDirectory)/scribe/valint
  artifact: scribe-evidence

# Using `outputFile` custom path.
- publish: $(Build.ArtifactStagingDirectory)/my_sbom.json
  artifact: scribe-sbom
``` 
</details>

<details>
  <summary>  Save as artifact SLSA </summary>

Using input variable `outputDirectory` or `outputFile` to export evidence as an artifact.

> Use input variable `format` to select between supported formats.

```YAML
- task: ValintCli@0
  displayName: SLSA image `busybox:latest`.
  inputs:
    command: slsa
    target: busybox:latest
    outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
    outputFile: $(Build.ArtifactStagingDirectory)/my_slsa.json
    force: true

# Using `outputDirectory` evidence cache dir
- publish: $(Build.ArtifactStagingDirectory)/scribe/valint
  artifact: scribe-evidence

# Using `outputFile` custom path.
- publish: $(Build.ArtifactStagingDirectory)/my_slsa.json
  artifact: scribe-slsa
``` 
</details>

<details>
  <summary> Directory target (SBOM) </summary>

Create SBOM from a local directory. 

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
``` 
</details>

<details>
  <summary> Directory target (SLSA) </summary>

Create SLSA from a local directory. 

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
``` 
</details>

<details>
  <summary> Git target (SBOM) </summary>

Create SBOM for `mongo-express` remote git repository.

```YAML
- task: ValintCli@0
  displayName: SBOM remote git repository.
  inputs:
    command: bom
    target: git:https://github.com/mongo-express/mongo-express.git 
    outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
    force: true
``` 

Create SBOM for local git repository. <br />

> When using implicit checkout note the Azure-DevOps **[git-strategy](https://learn.microsoft.com/en-us/azure/devops/pipelines/yaml-schema/steps-checkout?view=azure-pipelines)** will effect the commits collected by the SBOM.

```YAML
- checkout: self

- task: ValintCli@0
  displayName: SBOM local git repository.
  inputs:
    command: bom
    target: git:. 
    outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
    force: true
``` 
</details>
<details>
  <summary> Git target (SLSA) </summary>

Create SLSA for `mongo-express` remote git repository.

```YAML
- task: ValintCli@0
  displayName: SBOM remote git repository.
  inputs:
    command: slsa
    target: git:https://github.com/mongo-express/mongo-express.git 
    outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
    force: true
``` 

Create SBOM for local git repository. <br />

> When using implicit checkout note the Azure-DevOps [git-strategy](https://learn.microsoft.com/en-us/azure/devops/pipelines/yaml-schema/steps-checkout?view=azure-pipelines) will effect the commits collected by the SBOM.

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

### Resources
If you're new to Azure pipelines these links should help you get started:

* **[What is an Azure Pipelines?](https://learn.microsoft.com/en-us/azure/devops/pipelines/get-started/what-is-azure-pipelines?view=azure-devops "What is an Azure Pipelines?")**.
* **[Key concepts for new Azure Pipelines users](https://learn.microsoft.com/en-us/azure/devops/pipelines/get-started/key-pipelines-concepts?view=azure-devops "Key concepts for new Azure Pipelines users")**.
* **[Getting started with Azure Pipelines](https://learn.microsoft.com/en-us/azure/devops/pipelines/get-started/pipelines-get-started?view=azure-devops "Getting started with Azure Pipelines")**.
* **[Create your first Azure pipeline](https://learn.microsoft.com/en-us/azure/devops/pipelines/create-first-pipeline?view=azure-devops&tabs=java%2Ctfs-2018-2%2Cbrowser "Create your first Azure pipeline")**.

