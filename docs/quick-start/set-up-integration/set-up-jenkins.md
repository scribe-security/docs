
---

## sidebar_position: 2
sidebar_label: "Jenkins"
title: Setting up an integration in Jenkins
toc_min_heading_level: 2
toc_max_heading_level: 5
### The steps to take to integrate Jenkins with Scribe Hub
1. If you haven't yet done so, open a free Scribe Hub account [﻿here](https://scribesecurity.com/scribe-platform-lp/) .
2. Get your **Client Secret** credentials from your [﻿Scribe Hub](https://scribehub.scribesecurity.com/)  **Integrations** page.
![Scribe Integration Secrets](../../../../img/ci/integrations-secrets.jpg "")

1. Login to your Jenkins Web Console. 
2. Select **Dashboard> Manage Jenkins> Manage credentials (under Security options)**. 
3. Select 'Global' in the list of domains: 
4. To add Client Secret, in the **Global credentials** area, click **+ Add Credentials**. A new **Credentials** form will open. 
5. Apply the **Client Secret** provided by Scribe to the **Password**, Username can be filled in with anything. 
6. Set **ID** to `**scribe-auth-id**`  (lowercase). 
7. Click **Create**. 
8. Click on 'Dashboard' to go to the main dashboard  
9. Click on 'New Item' 
10. Create a new folder such as 'integration-scribe-in-jenkins'. Click on 'New Folder' to create it once you enter the name and then click 'ok'. 
11. Click 'Apply' and then 'Save'. 
12. Now to create the pipeline, click on 'New Item' 
13. Name it 'install-valint-pipeline'. Click on 'New Pipeline' to create it once you enter the name and then click 'ok'.  
14. Once you created a pipeline a new job is created. Click on the job: 
15. Scroll down till you reach a 'pipeline' section and add the following script: 
### Jenkins pipeline JavaScript code example
```javascript
pipeline {
  agent any
  stages {
    stage('checkout') {
      steps {
          cleanWs()
          sh 'git clone -b v1.0.0-alpha.4 --single-branch https://github.com/mongo-express/mongo-express.git mongo-express-scm'
      }
    }
    
    stage('sbom') {
      agent {
        docker {
          image 'scribesecurity/valint:latest'
          reuseNode true
          args "--entrypoint="
        }
      }
      steps {        
        withCredentials([token(credentialsId: 'scribe-auth-id', variable: 'SCRIBE_TOKEN')]) {
        sh '''
            valint bom dir:mongo-express-scm \
            --context-type jenkins \
            --output-directory ./scribe/valint \
            -E -P $SCRIBE_TOKEN '''
        }
      }
    }

    stage('image-bom') {
      agent {
        docker {
          image 'scribesecurity/valint:latest'
          reuseNode true
          args "--entrypoint="
        }
      }
      steps {
            withCredentials([token(credentialsId: 'scribe-auth-id', variable: 'SCRIBE_TOKEN')]) {  
            sh '''
            valint bom mongo-express:1.0.0-alpha.4 \
            --context-type jenkins \
            --output-directory ./scribe/valint \
            -E -P $SCRIBE_TOKEN '''
          }
      }
    }
  }
}
```
:::note
The above pipeline script is an example. It connects to the GitHub repository [﻿https://github.com/mongo-express/mongo-express.git](https://github.com/mongo-express/mongo-express.git), clones it and creates an image for it. 

An SBOM is created after the clone is done and after the image has been created. 

The above example was created under the assumption that you're using **Jenkins over Docker**. If you have a different version of Jenkins like **Jenkins over Kubernetes (K8s)** or **Jenkins Vanilla (No Agent)** you can find the needed JavaScript needed to create your pipeline in our full [﻿Jenkins Documentation](../../integrating-scribe/ci-integrations/jenkins#procedure).
:::

1. Click 'Apply' and then 'Save'.
 
2. Click on 'Build now' to run the pipeline: 
3. Click on the '#' to see the pipeline log output  
4. To add your own policies to the pipeline check out [﻿this guide](../../guides/enforcing-sdlc-policy#policies-and-policy-modules) .
5. To capture 3rd party tool results in the pipeline and turn it into evidence, check out [﻿this guide](../../guides/manag-sbom-and-vul#ingesting-reports-from-application-security-scanners) .
### Where to go on Scribe Hub
Now that you've created your first set of evidence you can log into your [﻿Scribe Hub](https://scribehub.scribesecurity.com/) to view the results. 

The first place you can look into to make sure your evidence has been uploaded properly is the [﻿Evidence report](../../scribe-hub-reports/evidence). The evidence report shows all the evidence you have collected and uploaded to Scribe Hub from all your pipelines and projects.

To see more details on your pipeline you can check out the **Product page**

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




<!--- Eraser file: https://app.eraser.io/workspace/dEF2NcXzRQBxuJDikh6o --->