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

1. Add the credentials to your environment according to the [Jenkins instructions](https://www.jenkins.io/doc/book/using/using-credentials/ "Jenkins Instructions"). Following the code example below, be sure to use the names **scribe-login-auth** to store **client-id**, **client-secret** secret, and **scribe-product-key** to store **product-key**.
**product-key** can be stored in local env as plain text as well.
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
    * Add product key to env
    ```javascript
      environment {
       SCRIBE_PRODUCT_KEY = credentials('scribe-product-key')
      }
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
                    withCredentials([usernamePassword(credentialsId: 'scribe-login-auth', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')]) {
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
                    withCredentials([usernamePassword(credentialsId: 'scribe-login-auth', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')]) {
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
    environment {
       SCRIBE_PRODUCT_KEY = credentials('scribe-product-key')
       SCRIBE_URL = "https://api.staging.scribesecurity.com"
       SCRIBE_LOGIN_URL = "https://scribesecurity-staging.us.auth0.com"
       SCRIBE_AUDIENCE = "api.staging.scribesecurity.com"
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
                    withCredentials([usernamePassword(credentialsId: 'scribe-staging-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')]) {
                        sh '''
                        gensbom dir:mongo-express-scm \
                            --context-type jenkins \
                            --output-directory ./scribe/gensbom \ 
                            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
                            --product-key $SCRIBE_PRODUCT_KEY \
                            --scribe.-url=$SCRIBE_LOGIN_URL --scribe.auth.audience=$SCRIBE_AUDIENCE --scribe.url $SCRIBE_URL \
                            -v '''
                    }
                }
            }
        }

        stage('image-bom') {
            steps {
                // The following call to gensbom generates an SBOM from the docker image
                container('gensbom') {

                    withCredentials([usernamePassword(credentialsId: 'scribe-staging-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')]) {
                        sh '''
                        gensbom mongo-express:1.0.0-alpha.4 \
                            --context-type jenkins \
                            --output-directory ./scribe/gensbom \ 
                            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
                            --product-key $SCRIBE_PRODUCT_KEY \
                            --scribe.-url=$SCRIBE_LOGIN_URL --scribe.auth.audience=$SCRIBE_AUDIENCE --scribe.url $SCRIBE_URL \
                            -v '''
                    }
                }
            }
        }
    }
}
```


<!-- ## Full examples

<details>
  <summary>  Example pipeline (Kubernetes) </summary>

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
    environment {
       SCRIBE_PRODUCT_KEY = credentials('scribe-product-key')
       SCRIBE_URL = "https://api.staging.scribesecurity.com"
       SCRIBE_LOGIN_URL = "https://scribesecurity-staging.us.auth0.com"
       SCRIBE_AUDIENCE = "api.staging.scribesecurity.com"
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
                    withCredentials([usernamePassword(credentialsId: 'scribe-staging-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')]) {
                        sh '''
                        gensbom dir:mongo-express-scm \
                            --context-type jenkins \
                            --output-directory ./scribe/gensbom \ 
                            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
                            --product-key $SCRIBE_PRODUCT_KEY \
                            --scribe.-url=$SCRIBE_LOGIN_URL --scribe.auth.audience=$SCRIBE_AUDIENCE --scribe.url $SCRIBE_URL \
                            -v '''
                    }
                }
            }
        }

        stage('image-bom') {
            steps {
                // The following call to gensbom generates an SBOM from the docker image
                container('gensbom') {

                    withCredentials([usernamePassword(credentialsId: 'scribe-staging-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')]) {
                        sh '''
                        gensbom mongo-express:1.0.0-alpha.4 \
                            --context-type jenkins \
                            --output-directory ./scribe/gensbom \ 
                            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
                            --product-key $SCRIBE_PRODUCT_KEY \
                            --scribe.-url=$SCRIBE_LOGIN_URL --scribe.auth.audience=$SCRIBE_AUDIENCE --scribe.url $SCRIBE_URL \
                            -v '''
                    }
                }
            }
        }
    }
}
```
</details>


<details>
  <summary>  Example pipeline (Docker agent) </summary>

### Pre requisites
You need the following jenkins extenstions
1. [docker pipeline](https://plugins.jenkins.io/docker-workflow/)
2. [docker commons](https://plugins.jenkins.io/docker-commons/)
3. [docker plugin](https://plugins.jenkins.io/docker-plugin/)
4. [Docker API](https://plugins.jenkins.io/docker-java-api/)
5. [Workspace Cleanup](https://plugins.jenkins.io/ws-cleanup/) (optional)

You also need to have a `docker` installed on your build node in jenkins.

```javascript
pipeline {
  agent any
  environment {
       SCRIBE_PRODUCT_KEY = credentials('scribe-product-key')
       SCRIBE_URL = "https://api.staging.scribesecurity.com"
       SCRIBE_LOGIN_URL = "https://scribesecurity-staging.us.auth0.com"
       SCRIBE_AUDIENCE = "api.staging.scribesecurity.com"
  }
  stages {
        stage('checkout') {
            steps {
                // Cleans the workspace for old code / build
                cleanWs()
                // this is an example of the repository this pipeline is running on. replace with your own repository
                sh 'git clone -b v1.0.0-alpha.4 --single-branch https://github.com/mongo-express/mongo-express.git mongo-express-scm'
            }
        }
        // The following call to gensbom collects hash value evidence of the source code files to facilitate the integrity validation
        stage('gensbom') {
        agent {
            docker {
                // taking the image from scribesecuriy means you don't need to have a local version
                image 'scribesecuriy.jfrog.io/scribe-docker-public-local/gensbom:latest'
                reuseNode true
                // required to avoid error for jenkins
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
                    --scribe.-url=$SCRIBE_LOGIN_URL --scribe.auth.audience=$SCRIBE_AUDIENCE --scribe.url $SCRIBE_URL \
                    -vv
                '''
                }
            }
        }
        // The following call to gensbom generates an SBOM from the docker image
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
                    --scribe.-url=$SCRIBE_LOGIN_URL --scribe.auth.audience=$SCRIBE_AUDIENCE --scribe.url $SCRIBE_URL \
                    -vv'''
                }
            }
        }
    }
}
```
</details>


<details>
  <summary>  Example pipeline (binary) </summary>

```javascript
pipeline {
  agent any
  environment {
     SCRIBE_PRODUCT_KEY = credentials('scribe-product-key')
     SCRIBE_URL = "https://api.staging.scribesecurity.com"
     SCRIBE_LOGIN_URL = "https://scribesecurity-staging.us.auth0.com"
     SCRIBE_AUDIENCE = "api.staging.scribesecurity.com"
     PATH="./temp/bin:$PATH"
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
            gensbom bom dir:mongo-express-scm \
            --context-type jenkins \
            --output-directory ./scribe/gensbom \
            --product-key $SCRIBE_PRODUCT_KEY \
             -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
            --scribe.-url=$SCRIBE_LOGIN_URL --scribe.auth.audience=$SCRIBE_AUDIENCE --scribe.url $SCRIBE_URL \
            -vv
          '''
        }
      }
    }

    stage('image-bom') {
      steps {
            withCredentials([usernamePassword(credentialsId: 'scribe-staging-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')]) {  
            sh '''
            gensbom bom mongo-express:1.0.0-alpha.4 \
            --context-type jenkins \
            --output-directory ./scribe/gensbom \
            --product-key $SCRIBE_PRODUCT_KEY \
            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
            --scribe.-url=$SCRIBE_LOGIN_URL --scribe.auth.audience=$SCRIBE_AUDIENCE --scribe.url $SCRIBE_URL \
            -vv'''
          }
      }
    }

    stage('download-report') {
      steps {
           withCredentials([usernamePassword(credentialsId: 'scribe-staging-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')]) {  
            sh '''
            valint report \
            -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET --output-directory scribe/valint \
            --scribe.-url=$SCRIBE_LOGIN_URL --scribe.auth.audience=$SCRIBE_AUDIENCE --scribe.url $SCRIBE_URL \
            --timeout 120s \
            -vv'''
          }
      }
    }
  }
}
```
</details>
 -->
