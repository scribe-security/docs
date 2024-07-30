
---

## sidebar_position: 2
sidebar_label: "Jenkins"
title: Integrating Scribe in your Jenkins pipeline
Use the following instructions to integrate your Jenkins pipelines with Scribe.

### 1. Obtain a Scribe Hub API Token
1. Sign in to [﻿Scribe Hub](https://app.scribesecurity.com/) . If you don't have an account you can sign up for free [﻿here](https://scribesecurity.com/scribe-platform-lp/) .
2. Create an API token in [﻿Scribe Hub > Settings > Tokens](https://app.scribesecurity.com/settings/tokens) . Copy it to a safe temporary notepad until you complete the integration.
:::note Important
The token is a secret and will not be accessible from the UI after you finalize the token generation.
:::

### 2. Add the API token to Jenkins secrets
1. Log in to your Jenkins account and select **Dashboard > Manage Jenkins > Manage credentials (under Security options)**.
2. Select 'Global' in the list of domains:
3. In the **Global credentials** section, click **+ Add Credentials**. A new **Credentials** form opens.
4. Copy the Scribe Hub API Token to the **Password** field and set the username to `SCRIBE_CLIENT_ID` .
5. Set **ID** to `scribe-auth-id`  (lowercase).
6. Click **Create**.
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

Example Jenkinsfile in [﻿declarative syntax](https://www.jenkins.io/doc/book/pipeline/syntax/#declarative-pipeline):

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
              -E -P $SCRIBE_API_TOKEN
        '''
      }
    }
  }
}
```
Jenkinsfile [﻿scripted](https://www.jenkins.io/doc/book/pipeline/syntax/#scripted-pipeline) syntax:

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
              -E -P $SCRIBE_TOKEN '''
        '''
    }
  }
}
```
#### Additional examples
Following are more examples of integration of Valint with Jenkins deployed in different forms. In these example we added Valint usage examples that generate source code SBOM by calling it in the build script right after the code is checked out and SLSA provenance generation.

Jenkins over Docker

 Make sure you have the following Jenkins extensions installed: 

 Example SLSA prvenance generation and verification 

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
          -E -P $SCRIBE_TOKEN '''
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
            -E -P $SCRIBE_TOKEN '''
      }
    }
}
}
```
Jenkins over Kubernetes

####  Prerequisites 
[﻿Jenkins over Kubernetes](https://plugins.jenkins.io/kubernetes/) installed.

 Example SBOM generation 

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
            -E -P $SCRIBE_TOKEN '''
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
            -E -P $SCRIBE_TOKEN '''
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
 Example SLSA generationa nd verification 

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
              -E -P $SCRIBE_TOKEN '''
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
              -E -P $SCRIBE_TOKEN '''
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
**See Also** [﻿Jenkins over Kubernetes documentation](https://plugins.jenkins.io/kubernetes/) 

Vanilla Jenkins (without an agent)

####  Prerequisites 
 `curl` installed on your build node in Jenkins.

 Sample integration code 

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
            -E -P $SCRIBE_TOKEN '''
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
            -E -P $SCRIBE_TOKEN '''
          }
      }
    }
  }
}
```
 Example SLSA provenance 

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
            -E -P $SCRIBE_TOKEN '''
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
            -E -P $SCRIBE_TOKEN '''
          }
      }
    }
  }
}
```
 Using an OCI registry as an evidence store instead of Scribe Hub 

 For on-prem deployment scenarios where you do not want to utilize Scribe Hub as a SaaS you can store, retrieve, and verify evidence with an OCI Resitry 

[﻿(learn more)](https://scribe-security.netlify.app/docs/integrating-scribe/other-evidence-stores) 

Related flags:

- `--oci`  Enable OCI store.
- `--oci-repo`  - Evidence store location.
1. Allow Valint Read and Write access to this registry.
2. Login to the registry, for example with `docker login` .
#### Basic usage
A basic usage generating SBOM of an image built in the pipeline by adding a step to call Valint at the end of the build. 

Example Jenkinsfile in [﻿declarative](https://www.jenkins.io/doc/book/pipeline/syntax/#declarative-pipeline) syntax:

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
Example Jenkinsfile in [﻿scripted](https://www.jenkins.io/doc/book/pipeline/syntax/#scripted-pipeline) syntax.

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
### 5. Signing with x509 keys
You can sign evidence with x509 file based keys.

Related flags:

- `--key`  x509 Private key path.
- `--cert`  - x509 Certificate path.
- `--ca`  - x509 CA Chain path.
>  While using `x509`, for example `valint slsa busybox:latest --attest.default x509 --key my_key.pem ..` 

Related environment:

- `ATTEST_KEY`  x509 Private key pem
- `ATTEST_CERT`  x509 Cert pem
- `ATTEST_CA`  x509 CA Chain pem
>  While using `x509-env`, for example `ATTEST_KEY=$(cat my_key.pem) .. valint slsa busybox:latest --attest.default x509-env` 

>  While using `x509-env` Refrain from using `slsa` command `--all-env` 

>  Further secure access to `attest-key` credential is recommended, for example using a Role-Based Access Control plugin. 

Example of generating and verifying a SLSA provenance attestation

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
### Using custom x509 keys
x509 signer allows you store utilize file based keys for signing.

Related flags:

- `--key`  x509 Private key path.
- `--cert`  - x509 Certificate path.
- `--ca`  - x509 CA Chain path.
>  While using `x509`, for example `valint slsa busybox:latest --attest.default x509 --key my_key.pem ..` 

Related environment:

- `ATTEST_KEY`  x509 Private key pem content.
- `ATTEST_CERT`  - x509 Cert pem content.
- `ATTEST_CA`  - x509 CA Chain pem content.
>  While using `x509-env`, for example `ATTEST_KEY=$(cat my_key.pem) .. valint slsa busybox:latest --attest.default x509-env` 

>  While using `x509-env` Refrain from using `slsa` command `--all-env` 

### Alternative evidence stores
>  You can learn more about alternative stores [﻿here](https://scribe-security.netlify.app/docs/integrating-scribe/other-evidence-stores). 

** OCI Evidence store **

Valint supports both storage and verification flows for `attestations` and `statement` objects utilizing OCI registry as an evidence store.

Using OCI registry as an evidence store allows you to upload, download and verify evidence across your supply chain in a seamless manner.

Related flags:

- `--oci`  Enable OCI store.
- `--oci-repo`  - Evidence store location.
### Before you begin
Evidence can be stored in any accusable registry.

- Write access is required for upload (generate).
- Read access is required for download (verify).
You must first login with the required access privileges to your registry before calling Valint.
For example, using `docker login` command or [﻿Docker Pipeline custom registry](https://www.jenkins.io/doc/book/pipeline/docker/#custom-registry).

### Usage
Following is a Jenkinsfile in the [﻿declarative](https://www.jenkins.io/doc/book/pipeline/syntax/#declarative-pipeline) syntax.

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
Following is a Jenkinsfile in the [﻿scripted](https://www.jenkins.io/doc/book/pipeline/syntax/#scripted-pipeline) syntax.

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
>  Use `jenkins` as context-type. 





<!--- Eraser file: https://app.eraser.io/workspace/90eUQoznrI6IZsS3f3L7 --->