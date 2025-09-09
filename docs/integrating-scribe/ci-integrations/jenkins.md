
---
sidebar_position: 2
sidebar_label: "Jenkins"
title: Integrating Scribe in your Jenkins pipeline
---

Use the following instructions to integrate your Jenkins pipelines with Scribe.

### 1. Obtain a Scribe Hub API Token

Create an API token in [Scribe Hub > Account > Tokens](https://app.scribesecurity.com/account/tokens). Copy it to a safe temporary notepad until you complete the integration.

:::note Important
The token is a secret and will not be accessible from the UI after you finalize the token generation. 
:::

### 2. Add the API token to Jenkins secrets
1. Log in to your Jenkins account and select **Dashboard > Manage Jenkins > Manage credentials (under Security options)**.
   <img src="/img/start/jenkins-1.jpg" alt="Jenkins Dashboard - Manage credentials"/>

2. Select 'Global' in the list of domains:
   <img src="/img/start/jenkins-global.jpg" alt="Jenkins Global domain"/>

3. In the **Global credentials** section, click **+ Add Credentials**. A new **Credentials** form opens.
   <img src="/img/start/jenkins-add-credentials.jpg" alt="Jenkins Add Credentials"/>

4. Copy the Scribe Hub API Token to the **Password**,  and **Username** with anything:
   <img src="/img/start/jenkins-username.jpg" alt="Jenkins Credentials Username/Password"/>

5. Set **ID** to `scribe-auth-id` (lowercase)
   <img src="/img/start/jenkins-auth-id.jpg" alt="Jenkins Credentials ID"/>

6. Click **Create**.
   <img src="/img/start/jenkins-cred-create.jpg" alt="Jenkins Credentials Create"/>

### 3. Install Scribe CLI

**Valint** - Scribe CLI is required to generate evidence such as SBOMs and SLSA provenance. 
Install Valint on your build runner with the following command:
```bash
sh 'curl -sSfL https://get.scribesecurity.com/install.sh | sh -s -- -b ./temp/bin'
```

Alternatively, add an installation stage at the beginning of your relevant builds as follows:
```javascript
stage('install-valint') {
    steps {
      sh 'curl -sSfL https://get.scribesecurity.com/install.sh | sh -s -- -b ./temp/bin'
    }
}
```
**Note:** To avoid potentially costly commits, add the Scribe output directory `**/scribe` to your .gitignore file.

### 4. Instrument your build scripts

#### Basic usage

Generate an SBOM of an image built in the pipeline by adding a step to call Valint at the end of the build. 

Example Jenkinsfile in [declarative syntax](https://www.jenkins.io/doc/book/pipeline/syntax/#declarative-pipeline):
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
        withCredentials([token(credentialsId: 'scribe-auth-id', variable: 'SCRIBE_TOKEN')]) {
        sh '''
            valint bom busybox:latest \
              --context-type jenkins \
              --output-directory ./scribe/valint \
              -P $SCRIBE_TOKEN
        '''
      }
    }
  }
}
```

Jenkinsfile [scripted](https://www.jenkins.io/doc/book/pipeline/syntax/#scripted-pipeline) syntax:

```groovy
node {
  withEnv([
    "PATH=./temp/bin:$PATH"
  ]) {
    stage('install') {
      sh 'curl -sSfL https://get.scribesecurity.com/install.sh | sh -s -- -b ./temp/bin'
    }
    
    stage('bom') {
        withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', passwordVariable: 'SCRIBE_TOKEN')]) {
        sh '''
            valint bom busybox:latest \
              --context-type jenkins \
              --output-directory ./scribe/valint \
              -P $SCRIBE_TOKEN '''
        '''
    }
  }
}
```

#### Additional examples 
Following are more examples of integration of Valint with Jenkins deployed in different forms. In these example we added Valint usage examples that generate source code SBOM by calling it in the build script right after the code is checked out and SLSA provenance generation.
<details>
  <summary>Jenkins over Docker</summary>
  Make sure you have the following Jenkins extensions installed:

<!-- <strong>See Also</strong> <a href="https://plugins.jenkins.io/docker-plugin/">Jenkins over Docker documentation</a>
   
  <ol>
    <li><a href="https://plugins.jenkins.io/docker-workflow/" title="Docker Pipeline extension">Docker pipeline</a></li>
    <li><a href="https://plugins.jenkins.io/docker-commons/" title="Docker Commons extension">Docker commons</a></li>
    <li><a href="https://plugins.jenkins.io/docker-plugin/" title="Docker plugin extension">Docker plugin</a></li>
    <li><a href="https://plugins.jenkins.io/docker-java-api/" title="Docker API extension">Docker API</a></li>
    <li><a href="https://plugins.jenkins.io/ws-cleanup/" title="Workspace Cleanup extension">Workspace Cleanup</a> (optional)</li>
    <li>Docker is installed on your build node in Jenkins.</li>
  </ol>

  <details style="margin-left: 20px;">
    <summary>Example SBOM generation</summary>
    <pre><code class="language-javascript">pipeline {
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
          image 'scribesecurity/valint:latest'
          reuseNode true
          args "--entrypoint="
        }
      }
      steps {        
        withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', passwordVariable: 'SCRIBE_TOKEN')]) {
          sh '''
            valint bom dir:mongo-express-scm \
            --context-type jenkins \
            --output-directory ./scribe/valint \
            -P $SCRIBE_TOKEN '''
        }
      }
    }

    stage('image-bom') {
      agent {
        docker {
          image 'scribesecurity/valint:latest'
          reuseNode true
          args "--entrypoint="
        }
      }
      steps {
        withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', passwordVariable: 'SCRIBE_TOKEN')]) {  
          sh '''
            valint bom mongo-express:1.0.0-alpha.4 \
            --context-type jenkins \
            --output-directory ./scribe/valint \
            -P $SCRIBE_TOKEN '''
        }
      }
    }
  }
}</code></pre>
  </details>
</details> -->

<details>
    <summary> Example SLSA prvenance generation and verification </summary>

  ```javascript
  pipeline {
  agent any
  stages {
    stage('slsa-provenance') {
      agent {
        docker {
          image 'scribesecurity/valint:latest'
          reuseNode true
          args "--entrypoint="
        }
      }
      steps {
        withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', passwordVariable: 'SCRIBE_TOKEN')])       
        sh '''
            valint slsa busybox:latest \
            --context-type jenkins \
            --output-directory ./scribe/valint \
            -P $SCRIBE_TOKEN '''
      }
    }

    stage('verify') {
      agent {
        docker {
          image 'scribesecurity/valint:latest'
          reuseNode true
          args "--entrypoint="
        }
      }
      steps {
         withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', passwordVariable: 'SCRIBE_TOKEN')])
         sh '''
         valint verify busybox:latest -i statement-slsa \
              --context-type jenkins \
              --output-directory ./scribe/valint \
              -P $SCRIBE_TOKEN '''
        }
      }
  }
}

```

</details>

</details>


<details>
  <summary>Jenkins over Kubernetes</summary>
  <h4>  Prerequisites </h4>

**[Jenkins over Kubernetes](https://plugins.jenkins.io/kubernetes/ "Jenkins over Kubernetes extension")** installed.

<details>
  <summary>   Example SBOM generation </summary>

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
          withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', passwordVariable: 'SCRIBE_TOKEN')]) {
            sh '''
            valint bom dir:mongo-express-scm \
            --context-type jenkins \
            --output-directory ./scribe/valint \
            -P $SCRIBE_TOKEN '''
          }
        }
      }
    }

    stage('image-bom') {
      steps {
        container('valint') {
           withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', passwordVariable: 'SCRIBE_TOKEN')]) {  
            sh '''
            valint bom mongo-express:1.0.0-alpha.4 \
            --context-type jenkins \
            --output-directory ./scribe/valint \
            -P $SCRIBE_TOKEN '''
          }
        }
      }
    }
  }
}
```
This example uses Jenkins over k8s plugin with the Pod template as follows:
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
    image: scribesecurity/valint:latest 
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
  <summary>   Example SLSA generationa nd verification </summary>

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
          withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', passwordVariable: 'SCRIBE_TOKEN')]) {
            sh '''
            valint slsa mongo-express:1.0.0-alpha.4 \
              --context-type jenkins \
              --output-directory ./scribe/valint \
              -P $SCRIBE_TOKEN '''
          }
        }
      }
    }

    stage('verify') {
      steps {
        container('valint') {
          withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', passwordVariable: 'SCRIBE_TOKEN')]) {
            sh '''
            valint verify mongo-express:1.0.0-alpha.4 -i statement-slsa \
              --context-type jenkins \
              --output-directory ./scribe/valint \
              -P $SCRIBE_TOKEN '''
        }
      }
    }
  }
}
}
```
This example uses Jenkins over k8s plugin with the Pod template defined as follows:
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
    image: scribesecurity/valint:latest 
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
  <summary>Vanilla Jenkins (without an agent)</summary>
  <h4>  Prerequisites </h4>

 `curl` installed on your build node in Jenkins.

<details>
  <summary>   Sample integration code </summary>

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
        withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', passwordVariable: 'SCRIBE_TOKEN')]) {
        sh '''
            valint bom dir:mongo-express-scm \
            --context-type jenkins \
            --output-directory ./scribe/valint \
            -P $SCRIBE_TOKEN '''
        }
      }
    }

    stage('image-bom') {
      steps {
            withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', passwordVariable: 'SCRIBE_TOKEN')]) {  
            sh '''
            valint bom mongo-express:1.0.0-alpha.4 \
            --context-type jenkins \
            --output-directory ./scribe/valint testing \
            -P $SCRIBE_TOKEN '''
          }
      }
    }
  }
}

```

</details>

<details>
    <summary> Example SLSA provenance </summary>

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
        withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', passwordVariable: 'SCRIBE_TOKEN')]) {
        sh '''
            valint slsa busybox:latest \
            --context-type jenkins \
            --output-directory ./scribe/valint \
            -P $SCRIBE_TOKEN '''
        }
      }
    }

    stage('image-bom') {
      steps {
            withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', passwordVariable: 'SCRIBE_TOKEN')]) {  
            sh '''
            valint verify busybox:latest -i statement-slsa \
            --context-type jenkins \
            --output-directory ./scribe/valint testing \
            -P $SCRIBE_TOKEN '''
          }
      }
    }
  }
}

```

</details>

</details>

<details>
  <summary> Using an OCI registry as an evidence store instead of Scribe Hub </summary>
For on-prem deployment scenarios where you do not want to utilize Scribe Hub as a SaaS you can store, retrieve, and verify evidence with an OCI Resitry <a href="https://scribe-security.netlify.app/docs/integrating-scribe/other-evidence-stores">(learn more)</a>
   
Related flags:
* `--oci` Enable OCI store.
* `--oci-repo` - Evidence store location.

1. Allow Valint Read and Write access to this registry.
2. Login to the registry, for example with `docker login`.

#### Basic usage
A basic usage generating SBOM of an image built in the pipeline by adding a step to call Valint at the end of the build. 

Example Jenkinsfile in [declarative](https://www.jenkins.io/doc/book/pipeline/syntax/#declarative-pipeline) syntax:

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
        sh '''
            valint [bom,slsa,evidence] [target] \
              -o [attest, statement] \
              --context-type jenkins \
              --output-directory ./scribe/valint \
              --oci --oci-repo=[my_repo]
        }
      }
    }

    stage('verify') {
      steps {
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
Example Jenkinsfile in [scripted](https://www.jenkins.io/doc/book/pipeline/syntax/#scripted-pipeline) syntax.

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
            valint [bom,slsa,evidence] [target] \
              -o [attest, statement] \
              --context-type jenkins \
              --output-directory ./scribe/valint \
              --oci --oci-repo=[my_repo] '''
      }
    }

    stage('verify') {
      withCredentials([
        token(credentialsId: 'scribe-auth-id', variable: 'SCRIBE_TOKEN')
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
</details>

### 5. Signing with x509 keys
You can sign evidence with x509 file based keys.

Related flags:
* `--key` x509 Private key path.
* `--cert` - x509 Certificate path.
* `--ca` - x509 CA Chain path.

> While using `x509`, for example `valint slsa busybox:latest --attest.default x509 --key my_key.pem ..`

Related environment:
* `ATTEST_KEY` x509 Private key pem
* `ATTEST_CERT` x509 Cert pem
* `ATTEST_CA` x509 CA Chain pem

> While using `x509-env`, for example `ATTEST_KEY=$(cat my_key.pem) .. valint slsa busybox:latest --attest.default x509-env`

> While using `x509-env` Refrain from using `slsa` command `--all-env`

> Further secure access to `attest-key` credential is recommended, for example using a Role-Based Access Control plugin.

<details>
  <summary>Example of generating and verifying a SLSA provenance attestation</summary>

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
              '''
    }
```

Verification:
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
              '''
    }
```
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


### Alternative evidence stores

> You can learn more about alternative stores **[here](https://scribe-security.netlify.app/docs/integrating-scribe/other-evidence-stores)**.

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
        sh '''
            valint [bom,slsa,evidence] [target] \
              -o [attest, statement] \
              --context-type jenkins \
              --output-directory ./scribe/valint \
              --oci --oci-repo=[my_repo] '''
      }
    }

    stage('verify') {
      steps {
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
            valint [bom,slsa,evidence] [target] \
              -o [attest, statement] \
              --context-type jenkins \
              --output-directory ./scribe/valint \
              --oci --oci-repo=[my_repo] '''
    }

    stage('verify') {
      withCredentials([
        sh '''
            valint verify [target] \
              -i [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] \
              --context-type jenkins \
              --output-directory ./scribe/valint \
              --oci --oci-repo=[my_repo] '''
    }
  }
}
```

> Use `jenkins` as context-type.

</details>
