---
sidebar_label: "Azure Pipelines"
title: Azure Pipelines
sidebar_position: 4
---

### Installation
In order to integrate the Scribe CLI, Valint, with Azure Pipelines use the DevOps Tasks.
The **[Valint-task](https://marketplace.visualstudio.com/items?itemName=ScribeSecurity.valint-cli)** can be found on the Azure marketplace.  <br />
Follow **[install-an-extension](https://learn.microsoft.com/en-us/azure/devops/marketplace/install-extension?view=azure-devops&tabs=browser#install-an-extension)** to add the extension to your organization and use the task in your pipelines.  <br />

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

### How the Valint tasks works Target types - `[target]`
---
Valint scans a target artifact to collect and optionally sign evidence such as an SBOM, or SLSA provenance document from it.
These are artifacts typically produced or consumed in your supply chain. Valint supports a range of target types are types as specified in the table below.

#### '[target]' Format

`[scheme]:[name]:[tag]` 

| Sources | target-type | scheme | Description | Example
| --- | --- | --- | --- | --- |
| Docker Daemon | image | docker | use the Docker daemon | docker:busybox:latest |
| OCI registry | image | registry | use the docker registry directly | registry:busybox:latest |
| Docker archive | image | docker-archive | use a tarball from disk for archives created from "docker save" | image | docker-archive:path/to/yourimage.tar |
| OCI archive | image | oci-archive | tarball from disk for OCI archives | oci-archive:path/to/yourimage.tar |
| Remote git | git| git | remote repository git | git:https://github.com/yourrepository.git |
| Local git | git | git | local repository git | git:path/to/yourrepository | 
| Directory | dir | dir | directory path on disk | dir:path/to/yourproject | 
| File | file | file | file path on disk | file:path/to/yourproject/file | 

### Setting up the Scribe Hub API Token in Azure Pipelines

Integrating Valint into your environment requires a Scribe Hub API token which you can create in [here](https://app.scribesecurity.com/settings/tokens). 
:::note as the token is a secret copy it to a safe temporary notepad until you complete the integration. It will not be accessible from the Scribe Hub after you viewed it for the first time.
:::

* Add the Scribe Hub API token as SCRIBE_API_TOKEN to your Azure environment according to the **[Azure DevOps - Set secret variables](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/set-secret-variables?view=azure-devops&tabs=yaml%2Cbash "Azure DevOps - Set secret variables")**. 

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
      scribeAPiToken: $(SCRIBE_API_TOKEN)

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

> When using implicit checkout note the Azure-DevOps **[git-strategy](https://learn.microsoft.com/en-us/azure/devops/pipelines/yaml-schema/steps-checkout?view=azure-pipelines)** will affect the commits collected by the SBOM.

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

### Using alternative evidence stores instead of Scribe Hub
If you prefer not to store evidence with Scribe Hub, you can utilize your OCI registry for stroing and verifying evidence.
Learn more about alternative stores **[here](https://scribe-security.netlify.app/docs/integrating-scribe/other-evidence-stores)**.

<details>
  <summary> <b> Details </b></summary>

### Before you begin
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
