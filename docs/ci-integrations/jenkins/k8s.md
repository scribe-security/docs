# Jenkins over Kubernetes
Scribe offers images for evidence collecting and integrity verification using Jenkins over K8s. \
Images are are wrappers to provided CLI tools.
* Gensbom - gitHub Action for SBOM Generation (Scribe) 
* Valint - validate supply chain integrity tool

[See Jenkins documentation](https://plugins.jenkins.io/kubernetes/)

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
  agent {
    kubernetes {
      yamlFile 'jenkins/k8s/scribe-test/KubernetesPod.yaml'
    }
  }
  stages {
    stage('checkout-bom') {
      steps {        
        container('git') {
          sh 'git clone -b v1.0.0-alpha.4 --single-branch https://github.com/mongo-express/mongo-express.git mongo-express-scm'
        }
        
        container('gensbom') {
          withCredentials([usernamePassword(credentialsId: 'scribe-staging-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET', productkeyVariable: 'SCRIBE_PRODUCT_KEY')]) {
            sh '''
            gensbom bom dir:mongo-express-scm \
            --context-type jenkins \
            --output-directory ./scribe/gensbom \
            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
            --product-key $SCRIBE_PRODUCT_KEY \
            -vv'''
          }
        }
      }
    }

    stage('image-bom') {
      steps {
        container('gensbom') {
           withCredentials([usernamePassword(credentialsId: 'scribe-staging-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET', productkeyVariable: 'SCRIBE_PRODUCT_KEY')]) {  
            sh '''
            gensbom bom mongo-express:1.0.0-alpha.4 \
            --context-type jenkins \
            --output-directory ./scribe/gensbom \
            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
            --product-key $SCRIBE_PRODUCT_KEY \
            -vv'''
          }
        }
      }
    }

    stage('download-report') {
      steps {
        container('valint') {
           withCredentials([usernamePassword(credentialsId: 'scribe-staging-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')]) {  
            sh '''
            valint report \
            -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
            --output-directory scribe/valint \
            -vv'''
          }
          publish()
        }
      }
    }
  }
}
```
Example uses Jenkins over k8s plugin, 
Pod template defined
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
  - name: gensbom
    image: scribesecuriy.jfrog.io/scribe-docker-public-local/gensbom:latest 
    command:
    - cat
    tty: true
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


# Using JSL
Scribe provides JSL to ease your integration.

* [See documentation](./JSL/)