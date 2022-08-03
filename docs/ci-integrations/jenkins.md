---
sidebar_position: 2
---

# Jenkins

Important to note that this is for Jenkins over Kubernetes only.

## Scribe integrity report - full pipeline

Full workflow example, uploading evidence using gensbom and downloading the report using valint.
In this example the final step is to attach the report and evidence to your pipeline run.

This example pipeline Jenkinsfile does a checkout on a docker image, creates an *SBOM* for it from the local repository, creates another *SBOM* from the docker image and, finally, downloads the integrity report from the Scribe backend. 

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
              - name: bomber
                // taking the image from scribesecuriy means you don't need to have a local version
                image: scribesecuriy.jfrog.io/scribe-docker-public-local/bomber:latest 
                command:
                - cat
                tty: true
              - name: valint
                // taking the image from scribesecuriy means you don't need to have a local version
                image: scribesecuriy.jfrog.io/scribe-docker-public-local/valint:latest
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

                container('gensbom') {
                    // these credentials can be copied from your CLI page: https://beta.hub.scribesecurity.com/producer-products
                    withCredentials([usernamePassword(credentialsId: 'scribe-staging-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')]) {
                        // this stage creats the first SBOM
                        sh '''
                        // this SBOM is created on the local directory, it's running on the source code of the image
                        gensbom bom dir: mongo - express - scm\
                            --context - type jenkins\
                            --output - directory. / scribe / gensbom\ 
                            -E - U $SCRIBE_CLIENT_ID - P $SCRIBE_CLIENT_SECRET\
                            --scribe.loginurl = https: //scribesecurity-staging.us.auth0.com --scribe.auth0.audience=api.staging.scribesecurity.com --scribe.url https://api.staging.scribesecurity.com \
                            -v '''
                    }
                }
            }
        }

        stage('image-bom') {
            steps {
                container('gensbom') {
                    // these credentials can be copied from your CLI page: https://beta.hub.scribesecurity.com/producer-products
                    withCredentials([usernamePassword(credentialsId: 'scribe-staging-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')]) {
                        // this stage creats the second SBOM 
                        sh '''
                        // this SBOM is created on the docker image, it's running on the uploaded image of this repository
                        gensbom bom mongo - express: 1.0 .0 - alpha .4\
                            --context - type jenkins\
                            --output - directory. / scribe / gensbom\ 
                            -E - U $SCRIBE_CLIENT_ID - P $SCRIBE_CLIENT_SECRET\
                            --scribe.loginurl = https: //scribesecurity-staging.us.auth0.com --scribe.auth0.audience=api.staging.scribesecurity.com --scribe.url https://api.staging.scribesecurity.com \
                            -v '''
                    }
                }
            }
        }

        stage('download-report') {
            steps {
                container('valint') {
                    // these credentials can be copied from your CLI page: https://beta.hub.scribesecurity.com/producer-products
                    withCredentials([usernamePassword(credentialsId: 'scribe-staging-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')]) {
                        // this stage downloads the integrity report from Scribe's backend   
                        sh '''
                        valint report\
                            // the default location for the report to be downloaded here is 'scribe/valint'
                            -U $SCRIBE_CLIENT_ID - P $SCRIBE_CLIENT_SECRET--output - directory scribe / valint\
                            --scribe.loginurl = https: //scribesecurity-staging.us.auth0.com --scribe.auth.audience=api.staging.scribesecurity.com --scribe.url https://api.staging.scribesecurity.com \
                            -v '''
                    }
                }
            }
        }
    }
}
```