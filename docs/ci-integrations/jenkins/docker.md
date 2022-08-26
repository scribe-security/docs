# Jenkins over Docker
Scribe offers images for evidence collecting and integrity verification using Jenkins over K8s. \
Images are are wrappers to provided CLI tools.
* Gensbom - gitHub Action for SBOM Generation (Scribe) 
* Valint - validate supply chain integrity tool

[See Jenkins documentation](https://plugins.jenkins.io/docker-plugin/)

# Integration
## Scribe service integration
Scribe provides a set of services to store,verify and manage the supply chain integrity. \
Following are some integration examples.
Scribe integrity flow - upload evidence using `gensbom` and download the integrity report using `valint`. \
You may collect evidence anywhere in your workflows. 

## .gitignore
Recommended to add output directory value to your .gitignore file.
By default add `**/scribe` to your gitignore.

<details>
  <summary>  Scribe integrity report - full pipeline </summary>

Full workflow example of a workflow, upload evidence using gensbom and download report using valint.
Finally attaching reports and evidence to your pipeline run.

```YAML
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
          image 'scribesecuriy.jfrog.io/scribe-docker-public-local/gensbom:latest'
          reuseNode true
          args "--entrypoint="
        }
      }
      steps {        
        withCredentials([usernamePassword(credentialsId: 'scribe-staging-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')]) {
        sh '''
            gensbom bom dir:mongo-express-scm \
            --context-type jenkins \
            --output-directory ./scribe/gensbom \
            --product-key testing \
             -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
             --scribe.login-url https://scribesecurity-staging.us.auth0.com --scribe.auth.audience api.staging.scribesecurity.com --scribe.url https://api.staging.scribesecurity.com \
            -vv
          '''
        }
      }
    }

    stage('image-bom') {
      agent {
        docker {
          image 'scribesecuriy.jfrog.io/scribe-docker-public-local/gensbom:latest'
          reuseNode true
          args "--entrypoint="
        }
      }
      steps {
            withCredentials([usernamePassword(credentialsId: 'scribe-staging-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')]) {  
            sh '''
            gensbom bom mongo-express:1.0.0-alpha.4 \
            --context-type jenkins \
            --output-directory ./scribe/gensbom \
            --product-key testing \
            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
            --scribe.login-url https://scribesecurity-staging.us.auth0.com --scribe.auth.audience api.staging.scribesecurity.com --scribe.url https://api.staging.scribesecurity.com \
            -vv'''
          }
      }
    }

    stage('download-report') {
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
            valint report \
            -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET --output-directory scribe/valint \
            --scribe.login-url https://scribesecurity-staging.us.auth0.com --scribe.auth.audience api.staging.scribesecurity.com --scribe.url https://api.staging.scribesecurity.com \
            --timeout 120s \
            -vv'''
          }
      }
    }
  }
}
```

</details>



# Using JSL
Scribe provides JSL to ease your integration.

* [See documentation](./JSL/)