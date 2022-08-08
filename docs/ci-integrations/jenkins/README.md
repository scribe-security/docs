# Jenkins

Important to note that this is for Jenkins over Kubernetes only.

:::info Note:
The configuration requires <em><b>productkey</b></em>, <em><b>clientid</b></em>, and <em><b>clientsecret</b></em> credentials obtained from your Scribe hub account at: `Home>Products>[$your_product]>Setup`

Or when you add a new product.
:::

## Step 1: Add the credentials to Jenkins​ 

Add the credentials according to the Jenkins instructions found <a href='https://www.jenkins.io/doc/book/using/using-credentials/'>here</a>. 

## Step 2: Call Scribe *gensbom* command from your pipeline’s Jenkins file

The following example pipeline builds project mongo express and calls Scribe *gensbom* twice: after checkout and after the docker image is built.  

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
                    withCredentials([usernamePassword(credentialsId: 'scribe-staging-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET', productkeyVariable: 'SCRIBE_PRODUCT_KEY')]) {
                        sh '''
                        gensbom bom dir:mongo-express-scm \
                            --context-type jenkins \
                            --output-directory ./scribe/gensbom \ 
                            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
                            --product-key $SCRIBE_PRODUCT_KEY \
                            --scribe.loginurl=https://scribesecurity-beta.us.auth0.com --scribe.auth0.audience=api.beta.scribesecurity.com \
                            --scribe.url https://api.beta.scribesecurity.com \
                            -v '''
                    }
                }
            }
        }

        stage('image-bom') {
            steps {
                // The following call to gensbom generates an SBOM from the docker image
                container('gensbom') {
                    withCredentials([usernamePassword(credentialsId: 'scribe-staging-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET', productkeyVariable: 'SCRIBE_PRODUCT_KEY')]) {
                        sh '''
                        gensbom bom mongo-express:1.0 .0-alpha.4 \
                            --context-type jenkins \
                            --output-directory ./scribe/gensbom \ 
                            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
                            --product-key $SCRIBE_PRODUCT_KEY \
                            --scribe.loginurl=https://scribesecurity-beta.us.auth0.com --scribe.auth0.audience=api.beta.scribesecurity.com \
                            --scribe.url https://api.beta.scribesecurity.com \
                            -v '''
                    }
                }
            }
        }
    }
}
```# Jenkins

Important to note that this is for Jenkins over Kubernetes only.

:::info Note:
The configuration requires <em><b>productkey</b></em>, <em><b>clientid</b></em>, and <em><b>clientsecret</b></em> credentials obtained from your Scribe hub account at: `Home>Products>[$your_product]>Setup`

Or when you add a new product.
:::

## Step 1: Add the credentials to Jenkins​ 

Add the credentials according to the Jenkins instructions found <a href='https://www.jenkins.io/doc/book/using/using-credentials/'>here</a>. 

## Step 2: Call Scribe *gensbom* command from your pipeline’s Jenkins file

The following example pipeline builds project mongo express and calls Scribe *gensbom* twice: after checkout and after the docker image is built.  

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
                    withCredentials([usernamePassword(credentialsId: 'scribe-staging-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET', productkeyVariable: 'SCRIBE_PRODUCT_KEY')]) {
                        sh '''
                        gensbom bom dir:mongo-express-scm \
                            --context-type jenkins \
                            --output-directory ./scribe/gensbom \ 
                            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
                            --product-key $SCRIBE_PRODUCT_KEY \
                            --scribe.loginurl=https://scribesecurity-beta.us.auth0.com --scribe.auth0.audience=api.beta.scribesecurity.com \
                            --scribe.url https://api.beta.scribesecurity.com \
                            -v '''
                    }
                }
            }
        }

        stage('image-bom') {
            steps {
                // The following call to gensbom generates an SBOM from the docker image
                container('gensbom') {
                    withCredentials([usernamePassword(credentialsId: 'scribe-staging-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET', productkeyVariable: 'SCRIBE_PRODUCT_KEY')]) {
                        sh '''
                        gensbom bom mongo-express:1.0 .0-alpha.4 \
                            --context-type jenkins \
                            --output-directory ./scribe/gensbom \ 
                            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
                            --product-key $SCRIBE_PRODUCT_KEY \
                            --scribe.loginurl=https://scribesecurity-beta.us.auth0.com --scribe.auth0.audience=api.beta.scribesecurity.com \
                            --scribe.url https://api.beta.scribesecurity.com \
                            -v '''
                    }
                }
            }
        }
    }
}
```