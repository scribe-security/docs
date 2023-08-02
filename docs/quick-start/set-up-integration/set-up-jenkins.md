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

3. login to your **[Jenkins Web Console](https://www.jenkins.io/)**.
4. Select **Dashboard> Manage Jenkins> Manage credentials (under Security options)**.

<img src='../../../../img/start/jenkins-1.jpg' alt='Jenkins Dashboard - Manage credentials'/>

5. Go to the Global Credential setup: click on any one of the clickable **Global** Domains in the **Domain** column.

<img src='../../../../img/start/jenkins-2.jpg' alt='Jenkins Dashboard - Domain column'/>

6. To add Client ID and Client Secret, in the **Global credentials** area, click **+ Add Credentials**.
A new **Credentials** form opens.
7. In the **Kind** field, select **Username with password**.
8. Set **ID** to **`scribe-production-auth-id`** (lowercase).
9. Copy the *Client ID* provided by Scribe to the **Username**.
10. Copy the *Client Secret* provided by Scribe to the **Password**.
11. Leave **Scope** as **Global**.
12. Click **Create**.
13. Another Global credential is created as a **Username with Password** (Kind)
14. Add the Scribe default output directory `**/scribe` to your .gitignore file.
15. Now that you have added the `SCRIBE_CLIENT_ID` and `SCRIBE_CLIENT_SECRET` variables as global Jenkins variables you can add the Scribe code snippets into your CI/CD pipeline JavaScript file. 
16. Since every integration pipeline is unique, this guide will include 3 separate examples that differ in what plugins you have installed and added to your Jenkins installation.  

<details>
  <summary> <b> Jenkins over Docker </b></summary>
  <h3>  Prerequisites </h3>

* Jenkins extensions installed:
   1. **[Docker pipeline](https://plugins.jenkins.io/docker-workflow/ "Docker Pipeline extension")**
   1. **[Docker commons](https://plugins.jenkins.io/docker-commons/ "Docker Commons extension")**
   1. **[Docker plugin](https://plugins.jenkins.io/docker-plugin/ "Docker plugin extension" )**
   1. **[Docker API](https://plugins.jenkins.io/docker-java-api/ "Docker API extension")**
   1. **[Workspace Cleanup](https://plugins.jenkins.io/ws-cleanup/ "Workspace Cleanup extension")** (optional)

* A `docker` is installed on your build node in Jenkins.

### Procedure

<details>
  <summary>  <b> Sample integration code </b> </summary>

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
        withCredentials([usernamePassword(credentialsId: 'scribe-staging-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')]) {
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
            withCredentials([usernamePassword(credentialsId: 'scribe-staging-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')]) {  
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

</details>


### See Also
**[Jenkins over Docker documentation](https://plugins.jenkins.io/docker-plugin/)**
</details>




<details>
  <summary> <b> Jenkins over Kubernetes (K8s) </b>
  </summary>

  <h3>  Prerequisites </h3>

**[Jenkins over Kubernetes](https://plugins.jenkins.io/kubernetes/ "Jenkins over Kubernetes extension")** installed.
### Procedure

<details>
  <summary>  <b> Sample integration code </b> </summary>


```javascript
pipeline {
  agent {
    kubernetes {
      yamlFile 'jenkins/k8s/scribe-test/KubernetesPod.yaml'
    }
  }
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
    stage('checkout-bom') {
      steps {        
        container('git') {
          sh 'git clone -b v1.0.0-alpha.4 --single-branch https://github.com/mongo-express/mongo-express.git mongo-express-scm'
        }
        
        container('valint') {
          withCredentials([usernamePassword(credentialsId: 'scribe-staging-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')]) {
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
    }

    stage('image-bom') {
      steps {
        container('valint') {
           withCredentials([usernamePassword(credentialsId: 'scribe-staging-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')]) {  
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
}
```
This example uses Jenkins over k8s plugin with the Pod template defined like this:
```YAML
metadata:
  labels:
    some-label: jsl-scribe-test
spec:
  containers:
  - name: jnlp
    env:
    - name: CONTAINER_ENV_VAR
      value: jnlp
  - name: valint
    image: scribesecuriy.jfrog.io/scribe-docker-public-local/valint:latest 
    command:
    - cat
    tty: true
  - name: git
    image: alpine/git
    command:
      - cat
    tty: true
```
</details>

### See Also
**[Jenkins over Kubernetes documentation](https://plugins.jenkins.io/kubernetes/)**

</details>


<details>
  <summary> <b> Jenkins Vanilla (No Agent) </b>
  </summary>
<h3>  Prerequisites </h3>

 `curl` installed on your build node in JAPP_VERSION=1.0.1enkins.
### Procedure

<details>
  <summary>  <b> Sample integration code </b> </summary>

```javascript
pipeline {
  agent any
  environment {
    PATH="./temp/bin:$PATH"
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
    stage('install') {
        steps {
          cleanWs()
          sh 'curl -sSfL https://raw.githubusercontent.com/scribe-security/misc/master/install.sh | sh -s -- -b ./temp/bin'
        }
    }
    stage('checkout') {
      steps {
          sh 'git clone -b v1.0.0-alpha.4 --single-branch https://github.com/mongo-express/mongo-express.git mongo-express-scm'
      }
    }
    
    stage('sbom') {
      steps {        
        withCredentials([usernamePassword(credentialsId: 'scribe-staging-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')]) {
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
      steps {
            withCredentials([usernamePassword(credentialsId: 'scribe-staging-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')]) {  
            sh '''
            valint bom mongo-express:1.0.0-alpha.4 \
            --context-type jenkins \
            --output-directory ./scribe/valint testing \
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

</details>
</details>