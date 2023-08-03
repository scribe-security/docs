---
sidebar_position: 2
sidebar_label: "Jenkins"
title: Setting up an integration in Jenkins
toc_min_heading_level: 2
toc_max_heading_level: 5
---

### The steps to take to integrate Jenkins with Scribe Hub

1. If you haven't yet done so, open a free Scribe Hub account **[here](https://scribesecurity.com/scribe-platform-lp/ "Start Using Scribe For Free")**.


2. Get your **Client ID** and **Client Secret** credentials from your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** **Integrations** page. 

<img src='../../../../img/ci/integrations-secrets.jpg' alt='Scribe Integration Secrets' width='70%' min-width='400px'/>

3. login to your Jenkins Web Console.
  <img src='../../../../img/start/jenkins-login.png' alt='Jenkins login' width='30%' min-width='200px'/>

4. Select **Dashboard> Manage Jenkins> Manage credentials (under Security options)**.
  <img src='../../../../img/start/jenkins-1.jpg' alt='Jenkins Dashboard - Manage credentials'/>

5. Select 'Global' in the list of domains:
  <img src='../../../../img/start/jenkins-global.jpg' alt='Jenkins Global domain' width='40%' min-width='300px'/>

6. To add Client ID and Client Secret, in the **Global credentials** area, click **+ Add Credentials**. A new **Credentials** form will open.
  <img src='../../../../img/start/jenkins-add-credentials.jpg' alt='Jenkins Add Credentials'/>

7. Apply the **Client ID** provided by Scribe to the **Username** and the **Client Secret** to the **Password**.
  <img src='../../../../img/start/jenkins-username.jpg' alt='Jenkins Credentials Username/Password' width='70%' min-width='600px'/>

8. Set **ID** to **`scribe-auth-id`** (lowercase).
  <img src='../../../../img/start/jenkins-auth-id.jpg' alt='Jenkins Credentials ID' width='40%' min-width='300px'/>

9. Click **Create**.
  <img src='../../../../img/start/jenkins-cred-create.jpg' alt='Jenkins Credentials Create' width='40%' min-width='300px'/>

10. Click on 'Dashboard' to go to the main dashboard 
  <img src='../../../../img/start/jenkins-dashboard.jpg' alt='Manage Jenkins' width='40%' min-width='300px'/>

11. Click on 'New Item'
  <img src='../../../../img/start/jenkins-new.jpg' alt='Jenkins New Item' width='50%' min-width='300px'/>

12. Create a new folder such as 'integration-scribe-in-jenkins'. Click on 'New Folder' to create it once you enter the name and then click 'ok'.
  <img src='../../../../img/start/jenkins-folder.jpg' alt='Jenkins New Item' width='50%' min-width='500px'/>

13. Click 'Apply' and then 'Save'.
  <img src='../../../../img/start/jenkins-apply.jpg' alt='Jenkins Apply' width='20%' min-width='200px'/>

14. Now to create the pipeline, click on 'New Item'
  <img src='../../../../img/start/jenkins-new-2.jpg' alt='Jenkins New Item' width='70%' min-width='600px'/>

15. Name it 'install-valint-pipeline'. Click on 'New Pipeline' to create it once you enter the name and then click 'ok'. 
  <img src='../../../../img/start/jenkins-pipeline.jpg' alt='Jenkins New Pipeline' width='50%' min-width='400px'/>

16. Once you created a pipeline a new job is created. Click on the job:
  <img src='../../../../img/start/jenkins-job.jpg' alt='Jenkins Job' width='70%' min-width='600px'/>

17. Scroll down till you reach a 'pipeline' section and add the following script:
  <img src='../../../../img/start/jenkins-pipeline-1.jpg' alt='Jenkins Job' width='70%' min-width='600px'/>
  
### Jenkins pipeline JavaScript code example

```javascript
pipeline {
  agent any
  environment {
    LOGICAL_APP_NAME="demo-project"
    APP_VERSION="1.0.1"
    AUTHOR_NAME="John-Smith" 
    AUTHOR_EMAIL="jhon@thiscompany.com" 
    AUTHOR_PHONE="555-8426157" 
    SUPPLIER_NAME="Scribe-Security" 
    SUPPLIER_URL="www.scribesecurity.com" 
    SUPPLIER_EMAIL="info@scribesecurity.com"
    SUPPLIER_PHONE="001-001-0011"
  }
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
          image 'scribesecuriy.jfrog.io/scribe-docker-public-local/valint:latest'
          reuseNode true
          args "--entrypoint="
        }
      }
      steps {        
        withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')]) {
        sh '''
            valint bom dir:mongo-express-scm \
            --context-type jenkins \
            --output-directory ./scribe/valint \
            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
            --logical-app-name $LOGICAL_APP_NAME --app-version $APP_VERSION \
            --author-name $AUTHOR_NAME --author-email AUTHOR_EMAIL --author-phone $AUTHOR_PHONE \
            --supplier-name $SUPPLIER_NAME --supplier-url $SUPPLIER_URL --supplier-email $SUPPLIER_EMAIL \ 
            --supplier-phone $SUPPLIER_PHONE '''
        }
      }
    }

    stage('image-bom') {
      agent {
        docker {
          image 'scribesecuriy.jfrog.io/scribe-docker-public-local/valint:latest'
          reuseNode true
          args "--entrypoint="
        }
      }
      steps {
            withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')]) {  
            sh '''
            valint bom mongo-express:1.0.0-alpha.4 \
            --context-type jenkins \
            --output-directory ./scribe/valint \
            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
            --logical-app-name $LOGICAL_APP_NAME --app-version $APP_VERSION \
            --author-name $AUTHOR_NAME --author-email AUTHOR_EMAIL --author-phone $AUTHOR_PHONE \
            --supplier-name $SUPPLIER_NAME --supplier-url $SUPPLIER_URL --supplier-email $SUPPLIER_EMAIL \ 
            --supplier-phone $SUPPLIER_PHONE '''
          }
      }
    }
  }
}
```  
:::note
The above pipeline script is an example. It connects to the GitHub repository [https://github.com/mongo-express/mongo-express.git](https://github.com/mongo-express/mongo-express.git), clones it and creates an image for it. 

An SBOM is created after the clone is done and after the image has been created. 

The above example was created under the assumption that you're using **Jenkins over Docker**. If you have a different version of Jenkins like **Jenkins over Kubernetes (K8s)** or **Jenkins Vanilla (No Agent)** you can find the needed JavaScript needed to create your pipeline in our full **[Jenkins Documentation](../../integrating-scribe/ci-integrations/jenkins#procedure)**.   
:::

18. Click 'Apply' and then 'Save'.<br/>
  <img src='../../../../img/start/jenkins-apply-2.jpg' alt='Jenkins Apply' width='60%' min-width='500px'/>

19. Click on 'Build now' to run the pipeline:
  <img src='../../../../img/start/jenkins-build-now.jpg' alt='Jenkins Build' width='60%' min-width='500px'/>

20. Click on the '#' to see the pipeline log output
  <img src='../../../../img/start/jenkins-log-1.jpg' alt='Jenkins Log' width='60%' min-width='500px'/>  
  <img src='../../../../img/start/jenkins-log-2.jpg' alt='Jenkins Log' width='60%' min-width='500px'/>

21. To add your own policies to the pipeline check out **[this guide](../../guides/enforcing-sdlc-policy#enforcing-your-own-policies)**.

22. To capture 3rd party tool results in the pipeline and turn it into evidence, check out **[this guide](../../guides/manag-sbom-and-vul#importing-evidence-generated-by-other-tools)**.

### Where to go on Scribe Hub

Now that you've created your first set of evidence you can log into your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** to view the results. 

The first place you can look into to make sure your evidence has been uploaded properly is the **[Evidence report](../../scribe-hub-reports/evidence)**. The evidence report shows all the evidence you have collected and uploaded to Scribe Hub from all your pipelines and projects.

To see more details on your pipeline you can check out the **[Product page](../../scribe-hub-reports/product)**.

<img src='../../../../img/start/products-start.jpg' alt='Products page'/>

The **products** page shows you your products along with some basic information: How many subscribers have you added to this product, when the latest version of it was created (the last pipeline run), how many components were identified in the project, if the source code integrity was verified or not, how many high (or higher) vulnerabilities were identified, and how the project stands in terms of compliance to the SSDF and SLSA frameworks.
