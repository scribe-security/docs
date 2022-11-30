---
title: Azure-DevOps
sidebar_position: 4
---

# Integrating Scribe in your Azure DevOps pipeline

## Before you begin
Integrating Scribe Hub with Azure DevOps requires the following credentials that are found in the product setup dialog (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **Home>Products>[$product]>Setup**)

* **Product Key**
* **Client ID**
* **Client Secret**

>Note that the product key is unique per product, while the client ID and secret are unique for your account.

# Procedure

* Store credentials using [Azure DevOps - Set secret variables](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/set-secret-variables?view=azure-devops&tabs=yaml%2Cbash) 

* Open your Azure DevOps project and make sure you have a yaml file named `azure-pipelines.yml`
As an example update it to contain the following steps:

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
<details>
  <summary>  Public registry image </summary>

Create SBOM from remote `busybox:latest` image, skip if found by the cache.

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

Create SBOM for image built by local docker `image_name:latest` image, overwrite cache.

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

Custom private registry, skip cache (using `Force`), output verbose (debug level) log output.
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

Custom metadata added to SBOM
Data will be included in the signed payload when the output is an attestation.
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

Create SBOM from the local oci archive.

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

## Integration examples
<details>
  <summary>  Scribe integrity report download </summary>

Download integrity report. \
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
  <summary> Simple download report verbose, custom output path </summary>

Download report for CI run and save the output to a local file.

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
