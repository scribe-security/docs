---
sidebar_label: "Azure"
sidebar_position: 3
title: Setting up an integration in Azure Pipelines
toc_min_heading_level: 2
toc_max_heading_level: 5
---

### The steps to take to integrate Azure Pipelines with Scribe Hub

1. If you haven't yet done so, open a free Scribe Hub account **[here](https://scribesecurity.com/scribe-platform-lp/ "Start Using Scribe For Free")**.


2. Get your **Client ID** and **Client Secret** credentials from your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** **Integrations** page. 

<img src='../../../../img/ci/integrations-secrets.jpg' alt='Scribe Integration Secrets' width='70%' min-width='400px'/>

3. login to your **[Azure](https://portal.azure.com/#home)** account.

4. Follow the **[install-an-extension](https://learn.microsoft.com/en-us/azure/devops/marketplace/install-extension?view=azure-devops&tabs=browser#install-an-extension)** instructions to install our **[Valint-task](https://marketplace.visualstudio.com/items?itemName=ScribeSecurity.valint-cli)** from the Azure marketplace.

<img src='../../../../img/start/azure-4.1.jpeg' alt='Azure marketplace'/><br/>  

<img src='../../../../img/start/azure-5.1.jpeg' alt='Azure marketplace'/><br/>  

<img src='../../../../img/start/azure-6.jpeg' alt='Azure marketplace'/><br/>  

<img src='../../../../img/start/azure-7.jpeg' alt='Azure marketplace'/><br/>  

<img src='../../../../img/start/azure-8.jpeg' alt='Azure marketplace'/><br/>  

<img src='../../../../img/start/azure-9.jpeg' alt='Azure marketplace'/><br/>  

<img src='../../../../img/start/azure-10.jpeg' alt='Azure marketplace'/>

4. Create a new project or go to an existing project

<img src='../../../../img/start/azure-1.1.jpg' alt='Azure project' width='70%' min-width='400px'/>

5. Inside the project create a new repository (repo) if you don't already have one you want to use Valint with an Azure pipeline on 

<img src='../../../../img/start/azure-1.jpeg' alt='Azure repos' width='70%' min-width='400px'/>

<img src='../../../../img/start/azure-6.png' alt='New Azure repository'/>

6. Open your Azure DevOps project repository and make sure you have a YAML file named `azure-pipelines.yml` Or just click on `Create a new pipeline`.

<img src='../../../../img/start/azure-11.jpg' alt='New Azure pipeline' width='70%' min-width='400px'/>

<img src='../../../../img/start/azure-7.png' alt='azure-pipelines.yml'/>

7. Add the Scribe code example shown below to your `azure-pipelines.yml` file.

```yaml
trigger:
  branches:
    include:
    - main

jobs:
- job: scribe_azure_job
  displayName: 'Scribe Azure Job'
  pool:
    name: Mikey
    agent: azure-runner-ubuntu

  variables:
    imageName: 'pipelines-javascript-docker'
    LOGICAL_APP_NAME: demo-project # The app name all these SBOMs will be associated with
    APP_VERSION: "1.0.1" # The app version all these SBOMs will be associated with
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
      app-name: $(LOGICAL_APP_NAME)
      app-version: $(APP_VERSION)
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
<img src='../../../../img/start/azure-8.png' alt='azure-pipelines.yml'/>

8. Add the credentials to your Azure environment according to the **[Azure DevOps - Set secret variables](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/set-secret-variables?view=azure-devops&tabs=yaml%2Cbash "Azure DevOps - Set secret variables")**: 
    * Go to the **Pipelines** page, select the appropriate pipeline, and then select **Edit**.
    * Locate the **Variables** for this pipeline.

      <img src='../../../../img/start/azure-12.jpeg' alt='Azure Pipeline Variables'/>

    * Add or update the variable.

      <img src='../../../../img/start/azure-13.jpeg' alt='Azure Pipeline Variables'/>

      <img src='../../../../img/start/azure-14.jpeg' alt='Azure Pipeline Variables'/>

    * Select the **Secret** lock icon to store the variable in an encrypted manner.

      <img src='../../../../img/start/azure-15.jpeg' alt='Azure Pipeline Variables'/>

    * **Save** the pipeline.

      <img src='../../../../img/start/azure-16.jpeg' alt='Azure Pipeline Variables'/>

9. You can now run the pipeline you created for your repository.

<img src='../../../../img/start/azure-18.jpeg' alt='Save and Run Azure Pipeline'/>

<img src='../../../../img/start/azure-32.jpeg' alt='Azure Pipeline Run'/>