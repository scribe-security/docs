---
title: Azure Pipelines
sidebar_position: 4
---

# Azure Pipeline
Scribe offers users of Azure Pipelines to use Devops Tasks for embedding evidence collecting and integrity verification in their workflows.

Tasks provides several actions enabling generation of SBOMs from various sources.
The usage examples on this page demonstrate several use cases of SBOM collection (SBOM from a publicly available Docker image, SBOM from a Git repository, SBOM from a local directory) as well as several use cases of uploading the evidence either to the Azure DevOps pipelines or to the Scribe Service.

## Installation
Install the Scribe `valint` CLI tool:
```yaml
- task: scribeInstall@0
```

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

## Before you begin
Integrating Scribe Hub with Azure requires the following credentials that are found in the product setup dialog. (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **Home>Products>[$product]>Setup**)

* **Client ID**
* **Client Secret**

# Procedure

* Add the credentials to your Azure environment according to the [Azure DevOps - Set secret variables](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/set-secret-variables?view=azure-devops&tabs=yaml%2Cbash "Azure DevOps - Set secret variables"). 

* Open your Azure DevOps project and make sure you have a YAML file named `azure-pipelines.yml`.  

Here's what all the steps look like in a unified pipeline example:

<details>
  <summary>  <b> Sample integration code </b> </summary>

  ```YAML
  resources:
    repositories:
    - repository: mongo-express
      type: github
      ref: 'refs/tags/v1.0.0-alpha.4'
      name: mongo-express/mongo-express

  trigger:
          - main

          pool:
            vmImage: 'ubuntu-latest'

          variables:
            imageName: 'pipelines-javascript-docker'

          steps:
          - task: scribeInstall@0

          - checkout: mongo-express
            path: mongo-express-scm

          - task: ValintCli@0
            inputs:
              commandName: bom
              target: dir:mongo-express-scm
              outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
            scribeEnable: true
            scribeClientId: $(SCRIBE-CLIENT-ID)
            scribeClientSecret:  $(SCRIBE-CLIENT-SECRET)

          - task: ValintCli@0
            inputs:
              commandName: bom
              target: mongo-express:1.0.0-alpha.4
              outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
              scribeEnable: true
              scribeClientId: $(SCRIBE-CLIENT-ID)
              scribeClientSecret:  $(SCRIBE-CLIENT-SECRET)
  ```
</details>



## Basic examples

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
  <summary>  Private registry image (SBOM) </summary>

Create SBOM for image hosted on private registry.

> Use `docker login` task to add access.

```YAML
- task: ValintCli@0
  displayName: Generate cyclonedx json SBOM
  inputs:
    commandName: bom
    target: scribesecuriy.jfrog.io/scribe-docker-local/stub_remote:latest
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
  <summary>  Save as artifact (SBOM, SLSA) </summary>

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

> When using implicit checkout note the Azure-DevOps [git-strategy](https://learn.microsoft.com/en-us/azure/devops/pipelines/yaml-schema/steps-checkout?view=azure-pipelines) will effect the commits collected by the SBOM.

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

## Resources
If you're new to Azure pipelines these links should help you get started:

* [What is an Azure Pipelines?](https://learn.microsoft.com/en-us/azure/devops/pipelines/get-started/what-is-azure-pipelines?view=azure-devops "What is an Azure Pipelines?")
* [Key concepts for new Azure Pipelines users](https://learn.microsoft.com/en-us/azure/devops/pipelines/get-started/key-pipelines-concepts?view=azure-devops "Key concepts for new Azure Pipelines users").
* [Getting started with Azure Pipelines](https://learn.microsoft.com/en-us/azure/devops/pipelines/get-started/pipelines-get-started?view=azure-devops "Getting started with Azure Pipelines")
* [Create your first Azure pipeline](https://learn.microsoft.com/en-us/azure/devops/pipelines/create-first-pipeline?view=azure-devops&tabs=java%2Ctfs-2018-2%2Cbrowser "Create your first Azure pipeline").




