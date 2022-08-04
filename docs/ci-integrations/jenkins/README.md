---
sidebar_position: 2
---

# Jenkins

Important to note that this is for Jenkins over Kubernetes only.

In order for the integration with Scribe Hub to work you must first make sure you have the secrets provided for you at the <a href='https://beta.hub.scribesecurity.com/producer-products'>'add project'</a> page. Of the provided secrets, `clientid` and `clientsecret` are identical for all your future projects and `projectkey` is unique for this particular project only.

## Adding new credentials in Jenkins 

To add new global credentials to your Jenkins instance:

1. If required, ensure you are logged in to Jenkins (as a user with the <b>Credentials > Create</b> permission).
2. From the Jenkins home page (i.e. the Dashboard of the Jenkins classic UI), click <b>Manage Jenkins > Manage Credentials</b>. <img src='../../../img/ci/jenkins-manage.png' alt='Manage' width="100%"/>
3. Under <b>Stores scoped to Jenkins</b> on the right, click on <b>Jenkins</b>. <img src='../../../img/ci/jenkins-store.png' alt='Store' width="60%"/>
4. Under <b>System</b>, click the <b>Global credentials (unrestricted)</b> link to access this default domain. <img src='../../../img/ci/system_global_credentials.png' alt='System Global Credentials' width="100%"/>
5. Click <b>Add Credentials</b> on the left.
6. From the <b>Kind</b> field, choose the type of credentials to add.
7. From the Scope field, choose <b>Global</b> since the credentials to be added are for a Pipeline project/item. Choosing this option applies the scope of the credentials to the Pipeline project/item "object" and all its descendent objects.
8. Add the credentials themselves into the appropriate fields for your chosen credential type. In this case all of the credentials we're adding are of the type <b>Secret text</b>. You should copy the secret text and paste it into the <b>Secret</b> field.
9. In the <b>ID</b> field, specify a meaningful credential ID value, for example `jenkins-clientid-for-xyz-repository`. The inbuilt (default) credentials provider can use upper- or lower-case letters for the credential ID, as well as any valid separator character, other credential providers may apply further restrictions on allowed characters or lengths. However, for the benefit of all users on your Jenkins instance, it is best to use a single and consistent convention for specifying credential IDs. <b>Note</b>: This field is optional. If you do not specify its value, Jenkins assigns a globally unique ID (GUID) value for the credential ID. Bear in mind that once a credential ID is set, it can no longer be changed.
10. Specify an optional <b>Description</b> for the credential.
11. Click <b>OK</b> to save the credentials.

You can learn more about setting up Jenkins credentials <a href='https://www.jenkins.io/doc/book/using/using-credentials/'>here</a>.

## Scribe *SBOM* upload - full pipeline

This is a full workflow example, connecting your pipeline to Scribe Hub and uploading evidence using *gensbom*.

This example pipeline Jenkinsfile does a checkout on a docker image, creates an *SBOM* for it from the local repository, and creates another *SBOM* from the docker image. In this example the project used is `mongo-express`.  

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
                    withCredentials([usernamePassword(credentialsId: 'scribe-staging-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET', projectkeyVariable: 'SCRIBE_PROJECT_KEY')]) {
                        // this stage creats the first SBOM
                        // this SBOM is created on the local directory, it is running on the source code of the image
                        sh '''
                        gensbom bom dir:mongo-express-scm \
                            --context-type jenkins \
                            --output-directory ./scribe/gensbom \ 
                            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
                            --product-key $SCRIBE_PROJECT_KEY \
                            -v '''
                    }
                }
            }
        }

        stage('image-bom') {
            steps {
                container('gensbom') {
                    // these credentials can be copied from your CLI page: https://beta.hub.scribesecurity.com/producer-products
                    withCredentials([usernamePassword(credentialsId: 'scribe-staging-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET', projectkeyVariable: 'SCRIBE_PROJECT_KEY')]) {
                        // this stage creats the second SBOM 
                        // this SBOM is created on the docker image, it is running on the uploaded image of this repository
                        sh '''
                        gensbom bom mongo-express:1.0 .0-alpha.4 \
                            --context-type jenkins \
                            --output-directory ./scribe/gensbom \ 
                            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
                            --product-key $SCRIBE_PROJECT_KEY \
                            -v '''
                    }
                }
            }
        }
    }
}
```