---
sidebar_position: 2
sidebar_label: "Jenkins"
title: Integrating Scribe in your Jenkins pipeline
---

If you are using Jenkins as your Continuous Integration tool (CI), use these instructions to integrate Scribe into your pipeline to protect your projects.

### Installation
Install the Scribe `valint` CLI tool:
```javascript
    stage('install-valint') {
        steps {
          sh 'curl -sSfL https://get.scribesecurity.com/install.sh | sh -s -- -b ./temp/bin'
        }
    }
```

### Usage

<!--DOCUSAURUS_CODE_TABS-->
<!--Declarative-->
Following is a Jenkinsfile in the [declarative](https://www.jenkins.io/doc/book/pipeline/syntax/#declarative-pipeline.

```javascript
pipeline {
  agent any
  environment {
    PATH="./temp/bin:$PATH"
  }
  stages {
    stage('install-valint') {
        steps {
          sh 'curl -sSfL https://get.scribesecurity.com/install.sh | sh -s -- -b ./temp/bin'
        }
    }
    
    stage('bom') {
      steps {        
        sh '''
            valint bom busybox:latest \
              --context-type jenkins \
              --output-directory ./scribe/valint -f '''
      }
    }

```
<!--Scripted-->
Following is a Jenkinsfile in the [scripted](https://www.jenkins.io/doc/book/pipeline/syntax/#scripted-pipeline) syntax.

```groovy
node {
  withEnv([
    "PATH=./temp/bin:$PATH"
  ]) {
    stage('install') {
      sh 'curl -sSfL https://get.scribesecurity.com/install.sh | sh -s -- -b ./temp/bin -D'
    }
    
    stage('bom') {
        sh '''
          valint bom busybox:latest \
              --context-type jenkins \
              --output-directory ./scribe/valint -f '''
    }
  }
}
```
<!--END_DOCUSAURUS_CODE_TABS-->

### Target types - `[target]`
---
Target types are types of artifacts produced and consumed by your supply chain.
Using supported targets, you can collect evidence and verify compliance on a range of artifacts.

> Fields specified as [target] support the following format.

### Format

`[scheme]:[name]:[tag]` 

| Sources | target-type | scheme | Description | example
| --- | --- | --- | --- | --- |
| Docker Daemon | image | docker | use the Docker daemon | docker:busybox:latest |
| OCI registry | image | registry | use the docker registry directly | registry:busybox:latest |
| Docker archive | image | docker-archive | use a tarball from disk for archives created from "docker save" | image | docker-archive:path/to/yourimage.tar |
| OCI archive | image | oci-archive | tarball from disk for OCI archives | oci-archive:path/to/yourimage.tar |
| Remote git | git| git | remote repository git | git:https://github.com/yourrepository.git |
| Local git | git | git | local repository git | git:path/to/yourrepository | 
| Directory | dir | dir | directory path on disk | dir:path/to/yourproject | 
| File | file | file | file path on disk | file:path/to/yourproject/file | 

### Evidence Stores
Each storer can be used to store, find and download evidence, unifying all the supply chain evidence into a system is an important part to be able to query any subset for policy validation.

| Type  | Description | requirement |
| --- | --- | --- |
| scribe | Evidence is stored on scribe service | scribe credentials |
| OCI | Evidence is stored on a remote OCI registry | access to a OCI registry |

### Scribe Evidence store
Scribe evidence store allows you store evidence using scribe Service.

Related Flags:
> Note the flag set:
>* `-U`, `--scribe.client-id`
>* `-P`, `--scribe.client-secret`
>* `-E`, `--scribe.enable`

### Before you begin
Integrating Scribe Hub with your environment requires the following credentials that are found in the **Integrations** page. (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **integrations**)

* **Client ID**
* **Client Secret**

<img src='../../../../img/ci/integrations-secrets.jpg' alt='Scribe Integration Secrets' width='70%' min-width='400px'/>

#### Adding Credentials to Jenkins
1. Go to your Jenkins Web Console.
1. Select **Dashboard> Manage Jenkins> Manage credentials (under Security options)**.
1. Go to the Global Credential setup: click on any one of the clickable **Global** Domains in the **Domain** column.
1. To add Client ID and Client Secret, in the **Global credentials** area, click **+ Add Credentials**.
A new **Credentials** form opens.
1. In the **Kind** field, select **Username with password**.

1. Set **ID** to **`scribe-auth-id`** (lowercase).
1. Copy the *Client ID* provided by Scribe to the **Username**.
1. Copy the *Client Secret* provided by Scribe to the **Password**.
1. Leave **Scope** as **Global**.
1. Click **Create**.
1. Another Global credential is created as a **Username with Password** (Kind)

The final state of the secrets definition should be as shown in the following screenshot:
<img src='../../../../img/ci/JenkinsCredentials.png' alt='"Scribe Credentials integrated as Global Jenkins credentials' width='70%' min-width='400px'/>

### Avoiding costly commits
To avoid potentially costly commits, we recommended adding the Scribe output directory to your .gitignore file.
By default, add `**/scribe` to your .gitignore.

### Usage

<!--DOCUSAURUS_CODE_TABS-->
<!--Declarative-->
Following is a Jenkinsfile in the [declarative](https://www.jenkins.io/doc/book/pipeline/syntax/#declarative-pipeline.
```javascript
pipeline {
  agent any
  environment {
    PATH="./temp/bin:$PATH"
    LOGICAL_APP_NAME="demo-project"
    APP_VERSION=1.0.1
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
          sh 'curl -sSfL https://get.scribesecurity.com/install.sh | sh -s -- -b ./temp/bin'
        }
    }
    stage('bom') {
      steps {        
        withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')]) {
        sh '''
            valint bom [target] \
              -o [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] \
              --context-type jenkins \
              --output-directory ./scribe/valint \
              -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
              --app-name $LOGICAL_APP_NAME --app-version $APP_VERSION  \
              --author-name $AUTHOR_NAME --author-email AUTHOR_EMAIL --author-phone $AUTHOR_PHONE  \
              --supplier-name $SUPPLIER_NAME --supplier-url $SUPPLIER_URL --supplier-email $SUPPLIER_EMAIL  \
              --supplier-phone $SUPPLIER_PHONE \
              -f '''
        }
      }
    }

    stage('verify') {
      steps {
            withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')]) {  
            sh '''
            valint verify [target] \
              -i [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] \
              --context-type jenkins \
              --output-directory ./scribe/valint \
              -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
              --app-name $LOGICAL_APP_NAME --app-version $APP_VERSION  \
              --author-name $AUTHOR_NAME --author-email AUTHOR_EMAIL --author-phone $AUTHOR_PHONE  \
              --supplier-name $SUPPLIER_NAME --supplier-url $SUPPLIER_URL --supplier-email $SUPPLIER_EMAIL  \
              --supplier-phone $SUPPLIER_PHONEE '''
          }
      }
    }
  }
}

```

<!--Scripted-->
Following is a Jenkinsfile in the [scripted](https://www.jenkins.io/doc/book/pipeline/syntax/#scripted-pipeline) syntax.

```groovy
node {
  withEnv([
    "PATH=./temp/bin:$PATH",
    "SCRIBE_PRODUCT_KEY=${credentials('scribe-product-key')}",
    "SCRIBE_URL=https://airflow.staging.scribesecurity.com",
    "SCRIBE_LOGIN_URL=https://scribe-hub-staging.us.auth0.com",
    "SCRIBE_AUDIENCE=api.staging.scribesecurity.com",
    "LOGICAL_APP_NAME=demo-project",
    "APP_VERSION=1.0.1",
    "AUTHOR_NAME=John-Smith", 
    "AUTHOR_EMAIL=jhon@thiscompany.com",
    "AUTHOR_PHONE=555-8426157",
    "SUPPLIER_NAME=Scribe-Security",
    "SUPPLIER_URL=www.scribesecurity.com",
    "SUPPLIER_EMAIL=info@scribesecurity.com",
    "SUPPLIER_PHONE=001-001-0011"
  ]) {
    stage('install') {
      sh 'curl -sSfL https://get.scribesecurity.com/install.sh | sh -s -- -b ./temp/bin -D'
    }
    stage('sbom') {
      withCredentials([
        usernamePassword(credentialsId: 'scribe-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')
      ]) {
        sh '''
          valint bom [target] \
            -o [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] \
            --context-type jenkins \
            --output-directory ./scribe/valint \
            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
            --app-name $LOGICAL_APP_NAME --app-version $APP_VERSION  \
            --author-name $AUTHOR_NAME --author-email AUTHOR_EMAIL --author-phone $AUTHOR_PHONE  \
            --supplier-name $SUPPLIER_NAME --supplier-url $SUPPLIER_URL --supplier-email $SUPPLIER_EMAIL  \
            --supplier-phone $SUPPLIER_PHONE \
            -f '''
      }
    }

    stage('verify') {
      withCredentials([
        usernamePassword(credentialsId: 'scribe-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')
      ]) {
        sh '''
            valint verify [target] \
              -i [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] \
              --context-type jenkins \
              --output-directory ./scribe/valint \
              -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
              --app-name $LOGICAL_APP_NAME --app-version $APP_VERSION  \
              --author-name $AUTHOR_NAME --author-email AUTHOR_EMAIL --author-phone $AUTHOR_PHONE  \
              --supplier-name $SUPPLIER_NAME --supplier-url $SUPPLIER_URL --supplier-email $SUPPLIER_EMAIL  \
              --supplier-phone $SUPPLIER_PHONEE '''
      }
    }
  }
}
```
<!--END_DOCUSAURUS_CODE_TABS-->

> Use `jenkins` as context-type.

### OCI Evidence store
Valint supports both storage and verification flows for `attestations`  and `statement` objects utilizing OCI registry as an evidence store.

Using OCI registry as an evidence store allows you to upload, download and verify evidence across your supply chain in a seamless manner.

Related flags:
* `--oci` Enable OCI store.
* `--oci-repo` - Evidence store location.


### Before you begin
Evidence can be stored in any accusable registry.
* Write access is required for upload (generate).
* Read access is required for download (verify).

You must first login with the required access privileges to your registry before calling Valint.
For example, using `docker login` command or [Docker Pipeline custom registry](https://www.jenkins.io/doc/book/pipeline/docker/#custom-registry).

### Usage
<!--DOCUSAURUS_CODE_TABS-->
<!--Declarative-->
Following is a Jenkinsfile in the [declarative](https://www.jenkins.io/doc/book/pipeline/syntax/#declarative-pipeline.

```javascript
pipeline {
  agent any
  environment {
    PATH="./temp/bin:$PATH"
  }
  stages {
    stage('install') {
        steps {
          sh 'curl -sSfL https://get.scribesecurity.com/install.sh | sh -s -- -b ./temp/bin'
        }
    }
    stage('bom') {
      steps {        
        withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')]) {
        sh '''
            valint bom [target] \
              -o [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] \
              --context-type jenkins \
              --output-directory ./scribe/valint \
              --oci --oci-repo=[my_repo] '''
        }
      }
    }

    stage('verify') {
      steps {
            withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')]) {  
            sh '''
                valint verify [target] \
                  -i [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] \
                  --context-type jenkins \
                  --output-directory ./scribe/valint \
                  --oci --oci-repo=[my_repo] '''
          }
      }
    }
  }
}

```

<!--Scripted-->
Following is a Jenkinsfile in the [scripted](https://www.jenkins.io/doc/book/pipeline/syntax/#scripted-pipeline) syntax.

```groovy
node {
  withEnv([
    "PATH=./temp/bin:$PATH"
  ]) {
    stage('install') {
      sh 'curl -sSfL https://get.scribesecurity.com/install.sh | sh -s -- -b ./temp/bin -D'
    }
    stage('sbom') {
      withCredentials([
        usernamePassword(credentialsId: 'scribe-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')
      ]) {
        sh '''
            valint bom [target] \
              -o [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] \
              --context-type jenkins \
              --output-directory ./scribe/valint \
              --oci --oci-repo=[my_repo] '''
      }
    }

    stage('verify') {
      withCredentials([
        usernamePassword(credentialsId: 'scribe-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')
      ]) {
        sh '''
            valint verify [target] \
              -i [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] \
              --context-type jenkins \
              --output-directory ./scribe/valint \
              --oci --oci-repo=[my_repo] '''
      }
    }
  }
}
```
<!--END_DOCUSAURUS_CODE_TABS-->

> Use `jenkins` as context-type.

## Jenkins over Kubernetes plugin
Make sure [Jenkins over Kubernetes](https://plugins.jenkins.io/kubernetes/ "Jenkins over Kubernetes extension") installed.

<details>
  <summary>  <b> Sample integration code </b> </summary>

```javascript
pipeline {
  agent {
    kubernetes {
      yamlFile './KubernetesPod.yaml'
    }
  }
  stages {
    stage('bom') {
      steps {                
        container('valint') {
          withCredentials([usernamePassword(credentialsId: 'scribe-staging-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')]) {
            sh '''
            valint bom busybox:latest \
              --context-type jenkins \
              --output-directory ./scribe/valint \
              -f '''
          }
        }
      }
    }

    stage('verify') {
      steps {
        container('valint') {
            sh '''
            valint verify busybox:latest \
              --context-type jenkins \
              --output-directory ./scribe/valint \
              -f '''
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
[Jenkins over Kubernetes documentation](https://plugins.jenkins.io/kubernetes/)

## Jenkins over Docker plugin
Make sure Jenkins extensions installed:
   1. [Docker pipeline](https://plugins.jenkins.io/docker-workflow/ "Docker Pipeline extension")
   2. [Docker commons](https://plugins.jenkins.io/docker-commons/ "Docker Commons extension")
   3. [Docker plugin](https://plugins.jenkins.io/docker-plugin/ "Docker plugin extension" )
   4. [Docker API](https://plugins.jenkins.io/docker-java-api/ "Docker API extension")
   5. [Workspace Cleanup](https://plugins.jenkins.io/ws-cleanup/ "Workspace Cleanup extension") (optional)

* A `docker` is installed on your build node in Jenkins.

If your using private registries you must first login with the required access privileges to your registry before calling Valint.
For example, using `docker login` command or [Docker Pipeline custom registry](https://www.jenkins.io/doc/book/pipeline/docker/#custom-registry).


<details>
  <summary>  <b> Sample integration code </b> </summary>

```javascript
pipeline {
  agent any
  stages {
    stage('bom') {
      agent {
        docker {
          image 'scribesecuriy.jfrog.io/scribe-docker-public-local/valint:latest'
          reuseNode true
          args "--entrypoint="
        }
      }
      steps {        
        sh '''
            valint bom busybox:latest \
            --context-type jenkins \
            --output-directory ./scribe/valint \
            -f '''
      }
    }

    stage('verify') {
      agent {
        docker {
          image 'scribesecuriy.jfrog.io/scribe-docker-public-local/valint:latest'
          reuseNode true
          args "--entrypoint="
        }
      }
      steps {
            sh '''
            valint verify busybox:latest \
              --context-type jenkins \
              --output-directory ./scribe/valint \
              -f '''
        }
      }
  }
}
```
</details>

### See Also
[Jenkins over Docker documentation](https://plugins.jenkins.io/docker-plugin/)

### Basic examples
<details>
  <summary>  Public registry image (SBOM) </summary>

Create SBOM for remote `busybox:latest` image.

```javascript
sh ''' valint bom busybox \
        --context-type jekins \
        --output-directory ./scribe/valint \
        -f '''
``` 

</details>

<details>
  <summary>  Docker built image (SBOM) </summary>

Create SBOM for image built by local docker `image_name:latest` image.

```javascript
sh ''' valint bom image_name:latest \
      --context-type jenkins \
      --output-directory ./scribe/valint \
       -f '''
``` 
</details>

<details>
  <summary>  Private registry image (SBOM) </summary>

Create SBOM for image hosted on private registry.

> Use `docker login` to add access.

```javascript
sh ''' valint bom scribesecuriy.jfrog.io/scribe-docker-local/stub_remote:latest \
        --context-type jenkins \
        --output-directory ./scribe/valint \
        -f '''
```
</details>

<details>
  <summary>  Custom metadata (SBOM) </summary>

Custom metadata added to SBOM.

```javascript
pipeline {
  agent any
  environment {
    test_env="test_env_value"
  }
  stages{
    stage('bom') {
      sh '''valint bom busybox:latest \
            --context-type jenkins \
            --output-directory ./scribe/valint \
            --env test_env \
            --label test_label \
            -f '''
    }
  }
}
```
</details>

<details>
  <summary> Directory target (SBOM) </summary>

Create SBOM for a local directory.

```javascript
sh 'mkdir testdir; echo "test" > testdir/test.txt'
sh ''' valint bom dir:testdir \
          --context-type jenkins \
          --output-directory ./scribe/valint \
          -f '''
``` 
</details>


<details>
  <summary> Git target (SBOM) </summary>

Create SBOM for `mongo-express` remote git repository.

```javascript
sh ''' valint bom git:https://github.com/mongo-express/mongo-express.git \
          --context-type jenkins \
          --output-directory ./scribe/valint \
           -f '''

``` 

Create SBOM for local git repository. <br />

```javascript
sh ''' valint bom . \
          --context-type jenkins \ 
          --output-directory ./scribe/valint \
           -f '''
``` 
</details>

## Resources

[Jenkins user docs](https://www.jenkins.io/doc/)
