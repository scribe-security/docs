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

Following is a Jenkinsfile in the [declarative](https://www.jenkins.io/doc/book/pipeline/syntax/#declarative-pipeline) syntax.
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
      sh 'curl -sSfL https://get.scribesecurity.com/install.sh | sh -s -- -b ./temp/bin'
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

### Acquiring credentials from Scribe Hub
Integrating Scribe Hub with Jenkins requires the following credentials that are found in the **Integrations** page. (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **integrations**)

* **Client ID**
* **Client Secret**

<img src='../../../../img/ci/integrations-secrets.jpg' alt='Scribe Integration Secrets' width='70%' min-width='400px'/>

### Adding Credentials to Jenkins

1. Go to your Jenkins Web Console.
1. Select **Dashboard> Manage Jenkins> Manage credentials (under Security options)**.
1. Go to the Global Credential setup: click on any one of the clickable **Global** Domains in the **Domain** column.
1. To add Client ID and Client Secret, in the **Global credentials** area, click **+ Add Credentials**.
A new **Credentials** form opens.
1. In the **Kind** field, select **Username with password**.

1. Set **ID** to **`scribe-production-auth-id`** (lowercase).
1. Copy the *Client ID* provided by Scribe to the **Username**.
1. Copy the *Client Secret* provided by Scribe to the **Password**.
1. Leave **Scope** as **Global**.
1. Click **Create**.
1. Another Global credential is created as a **Username with Password** (Kind)


<!-- The final state of the secrets definition should be as shown in the following screenshot:
![Jenkins Credentials](../../../../../img/ci/JenkinsCredentials.png "Scribe Credentials integrated as Global Jenkins credentials")
  -->

### Avoiding costly commits
To avoid potentially costly commits, we recommended adding the Scribe output directory to your .gitignore file.
By default, add `**/scribe` to your .gitignore.

<!---
### Using Jenkins Shared Library (JSL)

Use JSL to ease your integration. 
Read [Scribe JSL Documentation](./JSL/) for instructions.
-->

### Procedure
Scribe installation includes Command Line Interpreter (CLI) tools. Scribe provides the following a CLI tool called **Valint**. This tool is used to generate evidence in the form of SBOMs as well as SLSA provenance.  

Every integration pipeline is unique. 
Integrating Scribe's code into your pipeline varies from one case to another.

The following are examples that illustrate where to add Scribe code snippets. 

The code in these examples of a workflow executes these steps:
1. Calls `valint` right after checkout to collect hash value evidence of the source code files and upload the evidence.
2. Calls `valint` to generate an SBOM from the final Docker image and upload the evidence.
 
The examples use a sample pipeline building a Mongo express project. 

#### Jenkins over Docker
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

  **Procedure**

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
      
      stage('dir-bom') {
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
              -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET  \
              --author-name $AUTHOR_NAME --author-email AUTHOR_EMAIL --author-phone $AUTHOR_PHONE \
              --supplier-name $SUPPLIER_NAME --supplier-url $SUPPLIER_URL --supplier-email $SUPPLIER_EMAIL \ 
              --supplier-phone $SUPPLIER_PHONE'''
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

 <details>
    <summary>  <b> Sample SLSA integration code </b> </summary>

  ```javascript
  pipeline {
  agent any
  stages {
    stage('slsa-provenance') {
      agent {
        docker {
          image 'scribesecuriy.jfrog.io/scribe-docker-public-local/valint:latest'
          reuseNode true
          args "--entrypoint="
        }
      }
      steps {        
        sh '''
            valint slsa busybox:latest \
            --context-type jenkins \
            --output-directory ./scribe/valint \
            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET '''
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
            valint verify busybox:latest -i statement-slsa \
              --context-type jenkins \
              --output-directory ./scribe/valint \
              -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET '''
        }
      }
  }
}
```
</details>

  **See Also**
  **[Jenkins over Docker documentation](https://plugins.jenkins.io/docker-plugin/)**
</details>

#### Jenkins over Kubernetes (K8s)
<details>
  <summary> <b> Jenkins over Kubernetes (K8s) </b></summary>
  <h3>  Prerequisites </h3>

**[Jenkins over Kubernetes](https://plugins.jenkins.io/kubernetes/ "Jenkins over Kubernetes extension")** installed.

**Procedure**
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

 <details>
    <summary>  <b> Sample SLSA integration code </b> </summary>

```javascript
pipeline {
  agent {
    kubernetes {
      yamlFile './KubernetesPod.yaml'
    }
  }
  stages {
    stage('slsa-provenance') {
      steps {                
        container('valint') {
          withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')]) {
            sh '''
            valint slsa busybox:latest \
              --context-type jenkins \
              --output-directory ./scribe/valint \
              -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET '''
          }
        }
      }
    }

    stage('verify') {
      steps {
        container('valint') {
            sh '''
            valint verify busybox:latest -i statement-slsa \
              --context-type jenkins \
              --output-directory ./scribe/valint \
              -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET '''
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

**See Also**
**[Jenkins over Kubernetes documentation](https://plugins.jenkins.io/kubernetes/)**

</details>

#### Jenkins over Vanilla (No Agent)
<details>
  <summary> <b> Jenkins Vanilla (No Agent) </b></summary>
  <h3>  Prerequisites </h3>

 `curl` installed on your build node in Jenkins.

**Procedure**

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
    
    stage('dir-bom') {
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

<details>
    <summary>  <b> Sample SLSA integration code </b> </summary>

```javascript
pipeline {
  agent any
  stages {
    stage('install') {
        steps {
          cleanWs()
          sh 'curl -sSfL https://raw.githubusercontent.com/scribe-security/misc/master/install.sh | sh -s -- -b ./temp/bin'
        }
    }
    
    stage('slsa-provenance') {
      steps {        
        withCredentials([usernamePassword(credentialsId: 'scribe-staging-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')]) {
        sh '''
            valint slsa busybox:latest \
            --context-type jenkins \
            --output-directory ./scribe/valint \
            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET '''
        }
      }
    }

    stage('image-bom') {
      steps {
            withCredentials([usernamePassword(credentialsId: 'scribe-staging-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')]) {  
            sh '''
            valint verify busybox:latest -i statement-slsa \
            --context-type jenkins \
            --output-directory ./scribe/valint testing \
            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET '''
          }
      }
    }
  }
}

```

</details>

</details>

### Alternative evidence stores
> You can learn more about alternative stores **[here](../other-evidence-stores)**.

<details>
  <summary> <b> OCI Evidence store </b></summary>

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

Following is a Jenkinsfile in the [declarative](https://www.jenkins.io/doc/book/pipeline/syntax/#declarative-pipeline) syntax.

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
              -o [attest, statement, attest-slsa (depricated), statement-slsa (depricated), attest-generic, statement-generic] \
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
    stage('bom') {
      withCredentials([
        usernamePassword(credentialsId: 'scribe-auth-id', usernameVariable: 'SCRIBE_CLIENT_ID', passwordVariable: 'SCRIBE_CLIENT_SECRET')
      ]) {
        sh '''
            valint bom [target] \
              -o [attest, statement, attest-slsa (depricated), statement-slsa (depricated), attest-generic, statement-generic] \
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

> Use `jenkins` as context-type.

</details>

### Using custom x509 keys
x509 signer allows you store utilize file based keys for signing.

Related flags:
* `--key` x509 Private key path.
* `--cert` - x509 Certificate path.
* `--ca` - x509 CA Chain path.

> While using `x509`, for example `valint slsa busybox:latest --attest.default x509 --key my_key.pem ..`

Related environment:
* `ATTEST_KEY` x509 Private key pem content.
* `ATTEST_CERT` - x509 Cert pem content.
* `ATTEST_CA` - x509 CA Chain pem content.

> While using `x509-env`, for example `ATTEST_KEY=$(cat my_key.pem) .. valint slsa busybox:latest --attest.default x509-env`

> While using `x509-env` Refrain from using `slsa` command `--all-env`


#### Adding Credentials to Jenkins
1. Go to your Jenkins Web Console.
2. Select **Dashboard> Manage Jenkins> Manage credentials (under Security options)**.
3. Go to the Global Credential setup: click on any one of the clickable **Global** Domains in the **Domain** column.
4. To add Attestation key, cert and CA, in the **Global credentials** area, click **+ Add Credentials**.
A new **Credentials** form opens.

Repeat the following to attach secrets for your local `key`, `cert` and `ca` files
1. In the **Kind** field, select **Secret File**.
2. Set related **ID** **`attest-key`**, **`attest-cert`** and **`attest-ca`** (lowercase).
3. Choose related local file.
4. Click **Create**.

3 new Global credential are created with **Secret File** (Kind)

> Further secure access to `attest-key` credential is recommended, for example using a Role-Based Access Control plugin.

### Usage example
As an example a SLSA attest command can be issued using the following snippet.
```javascript
withCredentials([file(credentialsId: 'attest-key', variable: 'ATTEST_KEY_PATH'),
        file(credentialsId: 'attest-cert', variable: 'ATTEST_CERT_PATH'),
        file(credentialsId: 'attest-ca', variable: 'ATTEST_CA_PATH')
   {
            sh '''
            valint slsa [target] \
              --key $ATTEST_KEY_PATH \
              --cert $ATTEST_CERT_PATH \
              --ca $ATTEST_CA_PATH \
              --context-type jenkins \
              -o attest \
              --attest.default x509 \
              --output-directory ./scribe/valint \
              -f '''
    }
```

And as an example a SLSA verify command can be issued using the following snippet.
```javascript
withCredentials([file(credentialsId: 'attest-cert', variable: 'ATTEST_CERT_PATH'),
        file(credentialsId: 'attest-ca', variable: 'ATTEST_CA_PATH')
   {
            sh '''
            valint verify [target] \
              --cert $ATTEST_CERT_PATH \
              --ca $ATTEST_CA_PATH \
              --context-type jenkins \
              -i attest-slsa \
              --attest.default x509 \
              --output-directory ./scribe/valint \
              -f '''
    }
```
