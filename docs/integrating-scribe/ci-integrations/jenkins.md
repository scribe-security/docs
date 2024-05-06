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

## Scribe Hub Integration steps

### 1. Install Scribe CLI
Scribe CLI, **Valint**, is required to generate evidence in such as SBOMs and SLSA provenance. 
Install the Scribe `valint` CLI tool:
```javascript
    stage('install-valint') {
        steps {
          sh 'curl -sSfL https://get.scribesecurity.com/install.sh | sh -s -- -b ./temp/bin'
        }
    }
```
### 2. Configure a Scribe Hub API Token in Jenkins
1. Sign in to [Scribe Hub](https://app.scribesecurity.com), or sign up for free [here](https://scribesecurity.com/scribe-platform-lp/ "Start Using Scribe For Free").

2. Create an API token [here](https://app.scribesecurity.com/settings/tokens). Note that this token is secret and will not be accessible from the UI after you finalize the token generation. You should copy it to a safe temporary notepad until you complete the integration.
  
3. Login to your Jenkins Web Console and select **Dashboard> Manage Jenkins> Manage credentials (under Security options)**.
  <img src='../../../../img/start/jenkins-1.jpg' alt='Jenkins Dashboard - Manage credentials'/>

4. Select 'Global' in the list of domains:
  <img src='../../../../img/start/jenkins-global.jpg' alt='Jenkins Global domain' width='40%' min-width='300px'/>

5. In the **Global credentials** area, click **+ Add Credentials**. A new **Credentials** form will open.
  <img src='../../../../img/start/jenkins-add-credentials.jpg' alt='Jenkins Add Credentials'/>

6. Copy the Scribe Hub API Token to the **Password** field, Set the Username to `SCRIBE_CLIENT_ID`.
  <img src='../../../../img/start/jenkins-username.jpg' alt='Jenkins Credentials Username/Password' width='70%' min-width='600px'/>

7. Set **ID** to `scribe-auth-id` (lowercase).
  <img src='../../../../img/start/jenkins-auth-id.jpg' alt='Jenkins Credentials ID' width='40%' min-width='300px'/>

8. Click **Create**.
  <img src='../../../../img/start/jenkins-cred-create.jpg' alt='Jenkins Credentials Create' width='40%' min-width='300px'/>

### 3. Instrumenting your build scripts

The following examples demonstrate using Valint to collect evidence of source code and image SBOMs:
- Post checkout for a source code SBOM
- Post image build for SBOM for an image SBOM

**Note:** To avoid potentially costly commits, add the Scribe output directory (`**/scribe`) to your .gitignore file.

<details>
  <summary> <b> 1. Jenkins over Docker </b></summary>
  <h3>  Prerequisites </h3>

  * Jenkins extensions installed:
    1. **[Docker pipeline](https://plugins.jenkins.io/docker-workflow/ "Docker Pipeline extension")**
    1. **[Docker commons](https://plugins.jenkins.io/docker-commons/ "Docker Commons extension")**
    1. **[Docker plugin](https://plugins.jenkins.io/docker-plugin/ "Docker plugin extension" )**
    1. **[Docker API](https://plugins.jenkins.io/docker-java-api/ "Docker API extension")**
    1. **[Workspace Cleanup](https://plugins.jenkins.io/ws-cleanup/ "Workspace Cleanup extension")** (optional)

  * A `docker` is installed on your build node in Jenkins.

  <details>
    <summary>  <b> Sample integration code </b> </summary>

  ```javascript
  pipeline {
    agent any
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
          withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', passwordVariable: 'SCRIBE_API_TOKEN')]) {
          sh '''
              valint bom dir:mongo-express-scm \
              --context-type jenkins \
              --output-directory ./scribe/valint \
              -E -P $SCRIBE_API_TOKEN '''
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
              withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', passwordVariable: 'SCRIBE_API_TOKEN')]) {  
              sh '''
              valint bom mongo-express:1.0.0-alpha.4 \
              --context-type jenkins \
              --output-directory ./scribe/valint \
              -E -P $SCRIBE_API_TOKEN '''
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
        withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', passwordVariable: 'SCRIBE_API_TOKEN')])       
        sh '''
            valint slsa busybox:latest \
            --context-type jenkins \
            --output-directory ./scribe/valint \
            -E -P $SCRIBE_API_TOKEN '''
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
         withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', passwordVariable: 'SCRIBE_API_TOKEN')])
         sh '''
         valint verify busybox:latest -i statement-slsa \
              --context-type jenkins \
              --output-directory ./scribe/valint \
              -E -P $SCRIBE_API_TOKEN '''
        }
      }
  }
}

```

</details>

**See Also** [Jenkins over Docker documentation](https://plugins.jenkins.io/docker-plugin/)

</details>


<details>
  <summary> <b> 2. Jenkins over Kubernetes </b></summary>
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
 
  stages {
    stage('checkout-bom') {
      steps {        
        container('git') {
          sh 'git clone -b v1.0.0-alpha.4 --single-branch https://github.com/mongo-express/mongo-express.git mongo-express-scm'
        }
        
        container('valint') {
          withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', passwordVariable: 'SCRIBE_API_TOKEN')]) {
            sh '''
            valint bom dir:mongo-express-scm \
            --context-type jenkins \
            --output-directory ./scribe/valint \
            -E -P $SCRIBE_API_TOKEN '''
          }
        }
      }
    }

    stage('image-bom') {
      steps {
        container('valint') {
           withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', passwordVariable: 'SCRIBE_API_TOKEN')]) {  
            sh '''
            valint bom mongo-express:1.0.0-alpha.4 \
            --context-type jenkins \
            --output-directory ./scribe/valint \
            -E -P $SCRIBE_API_TOKEN '''
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
          withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', passwordVariable: 'SCRIBE_API_TOKEN')]) {
            sh '''
            valint slsa mongo-express:1.0.0-alpha.4 \
              --context-type jenkins \
              --output-directory ./scribe/valint \
              -E -P $SCRIBE_API_TOKEN '''
          }
        }
      }
    }

    stage('verify') {
      steps {
        container('valint') {
          withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', passwordVariable: 'SCRIBE_API_TOKEN')]) {
            sh '''
            valint verify mongo-express:1.0.0-alpha.4 -i statement-slsa \
              --context-type jenkins \
              --output-directory ./scribe/valint \
              -E -P $SCRIBE_API_TOKEN '''
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

**See Also** [Jenkins over Kubernetes documentation](https://plugins.jenkins.io/kubernetes/)

</details>

<details>
  <summary> <b> 3. Vanilla Jenkins (without an agent) </b></summary>
  <h3>  Prerequisites </h3>

 `curl` installed on your build node in Jenkins.

<details>
  <summary>  <b> Sample integration code </b> </summary>

```javascript
pipeline {
  agent any
  environment {
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
    
    stage('dir-bom') {
      steps {        
        withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', passwordVariable: 'SCRIBE_API_TOKEN')]) {
        sh '''
            valint bom dir:mongo-express-scm \
            --context-type jenkins \
            --output-directory ./scribe/valint \
            -E -P $SCRIBE_API_TOKEN '''
        }
      }
    }

    stage('image-bom') {
      steps {
            withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', passwordVariable: 'SCRIBE_API_TOKEN')]) {  
            sh '''
            valint bom mongo-express:1.0.0-alpha.4 \
            --context-type jenkins \
            --output-directory ./scribe/valint testing \
            -E -P $SCRIBE_API_TOKEN '''
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
        withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', passwordVariable: 'SCRIBE_API_TOKEN')]) {
        sh '''
            valint slsa busybox:latest \
            --context-type jenkins \
            --output-directory ./scribe/valint \
            -E -P $SCRIBE_API_TOKEN '''
        }
      }
    }

    stage('image-bom') {
      steps {
            withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', passwordVariable: 'SCRIBE_API_TOKEN')]) {  
            sh '''
            valint verify busybox:latest -i statement-slsa \
            --context-type jenkins \
            --output-directory ./scribe/valint testing \
            -E -P $SCRIBE_API_TOKEN '''
          }
      }
    }
  }
}

```

</details>

</details>

### 4. Alternative evidence stores

> You can learn more about alternative stores **[here](https://scribe-security.netlify.app/docs/integrating-scribe/other-evidence-stores)**.

<details>
  <summary> <b> OCI Evidence store </b></summary>

Valint supports both storage and verification flows for `attestations`  and `statement` objects utilizing OCI registry as an evidence store.

Using OCI registry as an evidence store allows you to upload, download and verify evidence across your supply chain in a seamless manner.

Related flags:
* `--oci` Enable OCI store.
* `--oci-repo` - Evidence store location.


### Before you begin
Evidence can be stored in any accessible registry.
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
        withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', passwordVariable: 'SCRIBE_API_TOKEN')]) {
        sh '''
            valint [bom,slsa,evidence] [target] \
              -o [attest, statement] \
              --context-type jenkins \
              --output-directory ./scribe/valint \
              --oci --oci-repo=[my_repo] '''
        }
      }
    }

    stage('verify') {
      steps {
            withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', passwordVariable: 'SCRIBE_API_TOKEN')]) {  
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
        usernamePassword(credentialsId: 'scribe-auth-id', passwordVariable: 'SCRIBE_API_TOKEN')
      ]) {
        sh '''
            valint [bom,slsa,evidence] [target] \
              -o [attest, statement] \
              --context-type jenkins \
              --output-directory ./scribe/valint \
              --oci --oci-repo=[my_repo] '''
      }
    }

    stage('verify') {
      withCredentials([
        usernamePassword(credentialsId: 'scribe-auth-id', passwordVariable: 'SCRIBE_API_TOKEN')
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

### 5. Using custom x509 keys
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

> Further secure access to `attest-key` credential is recommended, for example using a Role-Based Access Control plugin.

### 6. Example
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
