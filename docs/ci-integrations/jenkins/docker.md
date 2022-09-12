# Jenkins over Docker
Scribe offers images for evidence collecting and integrity verification using Jenkins over docker. \
Images are are wrappers to provided CLI tools.
* Gensbom - gitHub Action for SBOM Generation (Scribe) 
* Valint - validate supply chain integrity tool

[See Jenkins documentation](https://plugins.jenkins.io/docker-plugin/)

### Pre requisites

You need the following jenkins extenstions
1. [docker pipeline](https://plugins.jenkins.io/docker-workflow/)
2. [docker commons](https://plugins.jenkins.io/docker-commons/)
3. [docker plugin](https://plugins.jenkins.io/docker-plugin/)
4. [Docker API](https://plugins.jenkins.io/docker-java-api/)
5. [Workspace Cleanup](https://plugins.jenkins.io/ws-cleanup/) (optional)

You also need to have a `docker` installed on your build node in jenkins.


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

```javascript
pipeline {
  agent any
  environment {
    SCRIBE_PRODUCT_KEY     = credentials('scribe-product-key')
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
            --product-key $SCRIBE_PRODUCT_KEY \
            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
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
            --product-key $SCRIBE_PRODUCT_KEY \
            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
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
            --product-key $SCRIBE_PRODUCT_KEY \
            -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET --output-directory scribe/valint \
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
