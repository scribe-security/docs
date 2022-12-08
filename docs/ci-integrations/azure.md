---
title: Azure
sidebar_position: 4
---

# Integrating Scribe in your Azure DevOps pipeline

If you are using Azure DevOps as your Continuous Integration tool (CI), use these instructions to integrate Scribe into your pipeline to protect your projects.

## Before you begin
Integrating Scribe Hub with Azure DevOps requires the following credentials that are found in the product setup dialog (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **Home>Products>[$product]>Setup**)

* **Product Key**
* **Client ID**
* **Client Secret**

>Note that the product key is unique per product, while the client ID and secret are unique for your account.

# Procedure

* Add the credentials to your Azure environment according to the [Azure DevOps - Set secret variables](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/set-secret-variables?view=azure-devops&tabs=yaml%2Cbash "Azure DevOps - Set secret variables"). 

* Open your Azure DevOps project and make sure you have a YAML file named `azure-pipelines.yml`.  
The code in the following examples of a workflow running on the mongo-express image executes these three steps:
  * Calls `gensbom` (`commandName: bom`) right after checkout to collect hash value evidence of the source code files and upload the evidence.
  * Calls `gensbom` (`commandName: bom`) to generate an SBOM from the final Docker image and upload the evidence.
  * Calls `valint` (`commandName: report`) to download the integrity report results and attach the report and evidence to the pipeline run.  

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

          - task: scribeCli@2
            inputs:
              commandName: bom
              target: dir:mongo-express-scm
              scribeEnable: true
              scribeClientId: $(SCRIBE-CLIENT-ID)
              scribeClientSecret:  $(SCRIBE-CLIENT-SECRET)

          - task: scribeCli@2
            inputs:
              commandName: bom
              target: mongo-express:1.0.0-alpha.4
              scribeEnable: true
              scribeClientId: $(SCRIBE-CLIENT-ID)
              scribeClientSecret:  $(SCRIBE-CLIENT-SECRET)

          - task: scribeCli@2
            inputs:
              commandName: report
              scribeClientId: $(SCRIBE-CLIENT-ID)
              scribeClientSecret:  $(SCRIBE-CLIENT-SECRET)
  ```
</details>



## Generating SBOM examples
Since there could be several different options for where the final image is created/stored here's how Scribe's `gensbom` code handles the various options:

<details>
  <summary>  Public registry image </summary>

Create SBOM for remote `busybox:latest` image.

```YAML
- task: scribeCli@2 
  displayName: Generate cyclonedx json SBOM
  inputs:
    commandName: bom
    target: busybox:latest
``` 

</details>

<details>
  <summary>  Docker built image </summary>

Create SBOM for image built by local docker `image_name:latest` image. This SBOM will overwrite the SBOM found in local cache (assuming there is one).

```YAML
- task: scribeCli@2 
  displayName: Generate cyclonedx json SBOM
  inputs:
    commandName: bom
    target: image_name:latest
    format: json
    force: true
``` 
</details>

<details>
  <summary>  Private registry image </summary>

Create SBOM for image in a custom private registry. You can skip the cache search for an appropriate SBOM by using the `Force` flag. The output in this example uses verbose (debug level) 2 which will create a log output.
```YAML
- task: scribeCli@2 
  displayName: Generate cyclonedx json SBOM
  inputs:
    commandName: bom
    target: scribesecuriy.jfrog.io/scribe-docker-local/stub_remote:latest
    verbose: 2
    force: true
```
</details>

<details>
  <summary>  Custom SBOM metadata </summary>

Create SBOM from remote `busybox:latest` image and add custom metadata to the SBOM created.  
The data will be included in the signed payload when the output is an attestation. In this example the metadata included is the name, env (environment), and label of the image. 
```YAML
- task: scribeCli@2 
  displayName: Generate cyclonedx json SBOM - add metadata - labels, envs, name
  inputs:
    commandName: bom
    target: 'busybox:latest'
    verbose: 2
    format: json
    force: true
    name: name_value
    env: test_env
    label: test_label
  env:
    test_env: test_env_value
```
</details>

<details>
  <summary> Docker archive image </summary>

Create SBOM from local `docker save ...` output.
```YAML
- task: scribeCli@2 
  displayName: Generate cyclonedx json SBOM
  inputs:
    commandName: bom
    target: saved_docker.tar
``` 
</details>

<details>
  <summary> OCI archive image </summary>

Create SBOM from the local OCI (Oracle Cloud Infrastructure) archive.

```YAML
- task: scribeCli@2 
  displayName: Generate cyclonedx json SBOM
  inputs:
    commandName: bom
    target: oci-archive:saved_oci.tar
``` 
</details>

<details>
  <summary> Directory target </summary>

Create SBOM from a local directory. 

```YAML
- task: scribeCli@2 
  displayName: Generate cyclonedx json SBOM
  inputs:
    commandName: bom
    target: dir:./testdir
``` 
</details>

<details>
  <summary> Save SBOM as artifact </summary>

Using action `output_path` you can access the generated SBOM and store it as an artifact.
```YAML
- task: scribeCli@2 
  displayName: Generate cyclonedx json SBOM
  inputs:
    commandName: bom
    target: busybox:latest

- publish: $(System.DefaultWorkingDirectory)/scribe/gensbom
  artifact: gensbom-busybox-output-test
``` 
</details>

## Integrity report download examples
<details>
  <summary>  Scribe integrity report download </summary>

Integrity report standard download.  
The default output will be set to `scribe/valint/` subdirectory (Use `output-directory` argument to overwrite location).

```YAML
- task: scribeCli@2
  displayName: Valint - download integrity report
  inputs:
    commandName: report
    scribeClientId: $(SCRIBE-CLIENT-ID)
    scribeClientSecret:  $(SCRIBE-CLIENT-SECRET)
``` 


</details>

<details>
  <summary> Integrity report download with added verbosity and a custom output file </summary>

Download report for current CI run and save the output to a local file.

```YAML
- task: scribeCli@2
  displayName: Valint - download integrity report
  inputs:
    commandName: report
    verbose: 2
    scribeClientId: $(SCRIBE-CLIENT-ID)
    scribeClientSecret:  $(SCRIBE-CLIENT-SECRET)
    outputFile: "./result_report.json"
``` 
</details>

## Resources
If you're new to Azure pipelines these links should help you get started:

* [What is an Azure Pipelines?](https://learn.microsoft.com/en-us/azure/devops/pipelines/get-started/what-is-azure-pipelines?view=azure-devops "What is an Azure Pipelines?")
* [Key concepts for new Azure Pipelines users](https://learn.microsoft.com/en-us/azure/devops/pipelines/get-started/key-pipelines-concepts?view=azure-devops "Key concepts for new Azure Pipelines users").
* [Getting started with Azure Pipelines](https://learn.microsoft.com/en-us/azure/devops/pipelines/get-started/pipelines-get-started?view=azure-devops "Getting started with Azure Pipelines")
* [Create your first Azure pipeline](https://learn.microsoft.com/en-us/azure/devops/pipelines/create-first-pipeline?view=azure-devops&tabs=java%2Ctfs-2018-2%2Cbrowser "Create your first Azure pipeline").




