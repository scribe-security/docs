---
sidebar_position: 1
sidebar_label: Jenkins
---

# Integrating Scribe in your Jenkins pipeline 

## Before you begin
* This procedure is supported only for Jenkins over Kubernetes.

Integrating Scribe Hub with Jenkins requires the following credentials that are found in the product setup dialog (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to Home>Products>[$product]>Setup)

* **product key**
* **client id**
* **client secret**

>Note that the product key is unique per product, while the client id and secret are unique for your account.

## Procedure
Every integration pipeline is unique. 
Integrating Scribe code to your pipeline varies from one case to another.

The following is an example that illustrates where to add Scribe code snippets. 

This example uses a sample pipeline building a Mongo express project. 

The code snippets call `gensbom`, the evidence collector and SBOM generator developed by Scribe, twice: at checkout and after creating the Docker image.

1. Add the credentials to your environment according to the [Jenkins instructions](https://www.jenkins.io/doc/book/using/using-credentials/ "Jenkins Instructions"). Following the code example below, be sure to use the names **usernameVariable** for the **client-id**, **passwordVariable** for the  **client-secret** and **productkeyVariable** for the **product-key**.
2. Add Code snippets to your pipeline:   
    * Add `gensbom` declarations to the container definitions.
    ```javascript
              - name: gensbom
                // taking the image from scribesecuriy means you don't need to have a local version
                image: scribesecuriy.jfrog.io/scribe-docker-public-local/gensbom:latest 
                command:
                - cat
                tty: true
    ``` 
    * Replace the `Mongo express` repo in the example with your repo name.
    ```javascript
                container('git') {
                    sh 'git clone -b <repo version> --single-branch <link to repository> <repo name>'
                }
    ```
    * Call `gensbom` right after checkout to collect hash value evidence of the source code files.
    ```javascript
              container('gensbom') {
                    withCredentials([usernamePassword(usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET', productkeyVariable: 'SCRIBE_PRODUCT_KEY')]) {
                        sh '''
                        gensbom dir:<repo-name> \
                            --context-type jenkins \
                            --output-directory ./scribe/gensbom \ 
                            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
                            --product-key $SCRIBE_PRODUCT_KEY \
                            -v '''
                    }
                }
    ```
    * Call `gensbom` to generate an SBOM from the final Docker image.
    ```javascript
        stage('image-bom') {
            steps {
                container('gensbom') {
                    withCredentials([usernamePassword(usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET', productkeyVariable: 'SCRIBE_PRODUCT_KEY')]) {
                        sh '''
                        gensbom <image-name:tag> \
                            --context-type jenkins \
                            --output-directory ./scribe/gensbom \ 
                            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
                            --product-key $SCRIBE_PRODUCT_KEY \
                            -v '''
                    }
                }
            }
        }
    ```
         
Here's the full example pipeline:

```javascript
pipeline {
    agent {
        kubernetes {
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
                // taking the image from scribesecuriy means you don't need to have a local version
                image: scribesecuriy.jfrog.io/scribe-docker-public-local/gensbom:latest 
                command:
                - cat
                tty: true
              - name: git
                image: alpine/git
                command:
                  - cat
                tty: true
        }
    }
    stages {
        stage('checkout-bom') {
            steps {
                container('git') {
                    // this is an example of the repository this pipeline is running on. replace with your own repository
                    sh 'git clone -b v1.0.0-alpha.4 --single-branch https://github.com/mongo-express/mongo-express.git mongo-express-scm'
                }
                // The following call to gensbom collects hash value evidence of the source code files to facilitate the integrity validation
                container('gensbom') {
                    withCredentials([usernamePassword(usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET', productkeyVariable: 'SCRIBE_PRODUCT_KEY')]) {
                        sh '''
                        gensbom dir:mongo-express-scm \
                            --context-type jenkins \
                            --output-directory ./scribe/gensbom \ 
                            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
                            --product-key $SCRIBE_PRODUCT_KEY \
                            -v '''
                    }
                }
            }
        }

        stage('image-bom') {
            steps {
                // The following call to gensbom generates an SBOM from the docker image
                container('gensbom') {
                    withCredentials([usernamePassword(usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET', productkeyVariable: 'SCRIBE_PRODUCT_KEY')]) {
                        sh '''
                        gensbom mongo-express:1.0.0-alpha.4 \
                            --context-type jenkins \
                            --output-directory ./scribe/gensbom \ 
                            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
                            --product-key $SCRIBE_PRODUCT_KEY \
                            -v '''
                    }
                }
            }
        }
    }
}
```
