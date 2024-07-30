
---

## sidebar_label: "Azure"
sidebar_position: 3
title: Setting up an integration in Azure Pipelines
toc_min_heading_level: 2
toc_max_heading_level: 5
### The steps to take to integrate Azure Pipelines with Scribe Hub
1. If you haven't yet done so, open a free Scribe Hub account [﻿here](https://scribesecurity.com/scribe-platform-lp/) .
2. Get your **Client Secret** credentials from your [﻿Scribe Hub](https://scribehub.scribesecurity.com/)  **Integrations** page.
![Scribe Integration Secrets](../../../../img/ci/integrations-secrets.jpg "")

1. Login to your [﻿Azure](https://portal.azure.com/#home)  account.
2. Follow the [﻿install-an-extension](https://learn.microsoft.com/en-us/azure/devops/marketplace/install-extension?view=azure-devops&tabs=browser#install-an-extension)  instructions to install our [﻿Valint-task](https://marketplace.visualstudio.com/items?itemName=ScribeSecurity.valint-cli)  from the Azure marketplace.
![Azure marketplace](../../../../img/start/azure-4.1.jpg "")

![Azure marketplace](../../../../img/start/azure-5.1.jpg "")

![Azure marketplace](../../../../img/start/azure-6.jpeg "")

![Azure marketplace](../../../../img/start/azure-7.jpeg "")

![Azure marketplace](../../../../img/start/azure-8.jpeg "")

![Azure marketplace](../../../../img/start/azure-9.jpeg "")

![Azure marketplace](../../../../img/start/azure-10.jpeg "")

1. Create a new project or go to an existing project
![Azure project](../../../../img/start/azure-1.1.jpg "")

1. Inside the project create a new repository (repo) if you don't already have one you want to use Valint with an Azure pipeline on
![Azure repos](../../../../img/start/azure-1.jpeg "")

![New Azure repository](../../../../img/start/azure-6.png "")

1. Open your Azure DevOps project repository and make sure you have a YAML file named `azure-pipelines.yml`  Or just click on `Create a new pipeline` .
![New Azure pipeline](../../../../img/start/azure-11.jpeg "")

![azure-pipelines.yml](../../../../img/start/azure-7.png "")

1. Add the Scribe code example shown below to your `azure-pipelines.yml`  file.
:::note
[﻿Refer to this Azure document to configure runners.](https://learn.microsoft.com/en-us/azure/devops/pipelines/?view=azure-devops#:~:text=Manage%20agents%20%26%20self%2Dhosted%20agents)
:::

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
![azure-pipelines.yml](../../../../img/start/azure-8.png "")

1. Add the credentials to your Azure environment according to the [﻿Azure DevOps - Set secret variables](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/set-secret-variables?view=azure-devops&tabs=yaml%2Cbash) : 
    - Go to the **Pipelines** page, select the appropriate pipeline, and then select **Edit**.
    - Locate the **Variables** for this pipeline.
    - Add or update the variable. 
    - Select the **Secret** lock icon to store the variable in an encrypted manner.
    - **Save** the pipeline.
2. You can now run the pipeline you created for your repository.
![Save and Run Azure Pipeline](../../../../img/start/azure-18.jpeg "")

![Azure Pipeline Run](../../../../img/start/azure-32.jpeg "")

1. To add your own policies to the pipeline check out [﻿this guide](../../guides/enforcing-sdlc-policy#policies-and-policy-modules) .
2. To capture 3rd party tool results in the pipeline and turn it into evidence, check out [﻿this guide](../../guides/manag-sbom-and-vul#ingesting-reports-from-application-security-scanners) .
### Where to go on Scribe Hub
Now that you've created your first set of evidence you can log into your [﻿Scribe Hub](https://scribehub.scribesecurity.com/) to view the results. 

The first place you can look into to make sure your evidence has been uploaded properly is the [﻿Evidence report](../../scribe-hub-reports/evidence). The evidence report shows all the evidence you have collected and uploaded to Scribe Hub from all your pipelines and projects.

To see more details on your pipeline you can check out the [﻿Product page](../../scribe-hub-reports/product) 

![Products page](../../../../img/start/products-start.jpg "")

The **products** page shows you your products along with some basic information: How many subscribers have you added to this product, when the latest version of it was created (the last pipeline run), how many components were identified in the project, if the source code integrity was verified or not, how many high (or higher) vulnerabilities were identified, and how the project stands in terms of compliance to the SSDF and SLSA frameworks.

Clicking on a product will show you all the product's builds and their information:

![Product builds page](../../../../img/start/builds-start.jpg "")

For each build you can see its version ID, the build date, if the source code integrity was verified or not, the number and severity of vulnerabilities, how that build stands in terms of compliance, whether the build was published and if its signature was verified.

for more information on the pipeline you just completed, click on the last build uploaded (the top of the list) and you'll get to the build dashboard:

![Product build dashboard page](../../../../img/start/dashboard-start.jpg "")

The dashboard is your main access to see this build's [﻿reports](../../scribe-hub-reports/). You can see a summary of the build's compliance information to each of the frameworks, you can see a summary of the vulnerability information, and you can see the integrity validation information.

### Where to go next
- To learn more about what you can see, learn, and access about your build and your product look at the [﻿reports guide](../../scribe-hub-reports/)  section.
- To learn how to create and manage SBOMs and vulnerabilities go to this [﻿guide](../../guides/manag-sbom-and-vul) .
- To learn about Scribe's use of the SLSA framework go to this [﻿guide](../../guides/secure-sfw-slsa) .
- To learn about enforcing SDLC policies go to this [﻿guide](../../guides/enforcing-sdlc-policy) .
- To learn how to achieve SSDF compliance go to this [﻿guide](../../guides/ssdf-compliance) .
- To learn how to secure your builds go to this [﻿guide](../../guides/securing-builds) .




<!--- Eraser file: https://app.eraser.io/workspace/iuCM2LWNVbbfZZsoE27p --->