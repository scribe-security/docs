---
sidebar_position: 2
sidebar_label: "Jenkins"
title: Integrating Scribe in your Jenkins pipeline
---

Use the following instructions to integrate your Jenkins pipelines with Scribe.

### 1. Obtain a Scribe Hub API Token
1. Sign in to [Scribe Hub](https://app.scribesecurity.com). If you don't have an account you can sign up for free [here](https://scribesecurity.com/scribe-platform-lp/ "Start Using Scribe For Free").

2. Create a Scribe Hub API token [here](https://app.scribesecurity.com/settings/tokens). Note that this token is secret and will not be accessible from the UI after you finalize the token generation. You should copy it to a safe temporary notepad until you complete the integration.

### 2. Add the API token to Jenkins secrets
1. Login to your Jenkins account and select **Dashboard > Manage Jenkins > Manage credentials (under Security options)**.
   ![Jenkins Dashboard - Manage credentials](/img/start/jenkins-1.jpg){: style="width:50%; min-width:300px;"}

2. Select 'Global' in the list of domains:
   ![Jenkins Global domain](/img/start/jenkins-global.jpg){: style="width:50%; min-width:300px;"}

3. In the **Global credentials** section, click **+ Add Credentials**. A new **Credentials** form opens.
   ![Jenkins Add Credentials](/img/start/jenkins-add-credentials.jpg){: style="width:50%; min-width:300px;"}

4. Copy the Scribe Hub API Token to the **Password** field and set username to `SCRIBE_CLIENT_ID`.
   ![Jenkins Credentials Username/Password](/img/start/jenkins-username.jpg){: style="width:50%; min-width:300px;"}

5. Set **ID** to `scribe-auth-id` (lowercase).
   ![Jenkins Credentials ID](/img/start/jenkins-auth-id.jpg){: style="width:50%; min-width:300px;"}

6. Click **Create**.
   ![Jenkins Credentials Create](/img/start/jenkins-cred-create.jpg){: style="width:50%; min-width:300px;"}

### 3. Install Scribe CLI

**Valint** -Scribe CLI- is required to generate evidence in such as SBOMs and SLSA provenance. 
Install Valint on your build runner with the following command
```
sh 'curl -sSfL https://get.scribesecurity.com/install.sh | sh -s -- -b ./temp/bin'
```

Alternatively, add an instalation stage at the beginning of your relevant builds as follows:
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

A basic usage generating SBOM of an image built in the pipeline by adding a step to call Valint at the end of the build. 

Example Jenkinsfile in [declarative](https://www.jenkins.io/doc/book/pipeline/syntax/#declarative-pipeline) syntax:
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
        withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', passwordVariable: 'SCRIBE_API_TOKEN')]) {
        sh '''
            valint bom busybox:latest \
              --context-type jenkins \
              --output-directory ./scribe/valint -f '''
              -E -P $SCRIBE_API_TOKEN
        '''
      }
    }
  }
}

```
<!--Scripted-->

Example in [scripted](https://www.jenkins.io/doc/book/pipeline/syntax/#scripted-pipeline) syntax:

```groovy
node {
  withEnv([
    "PATH=./temp/bin:$PATH"
  ]) {
    stage('install') {
      sh 'curl -sSfL https://get.scribesecurity.com/install.sh | sh -s -- -b ./temp/bin'
    }
    
    stage('bom') {
        withCredentials([usernamePassword(credentialsId: 'scribe-auth-id', passwordVariable: 'SCRIBE_API_TOKEN')]) {
        sh '''
            valint bom busybox:latest \
              --context-type jenkins \
              --output-directory ./scribe/valint -f '''
              -E -P $SCRIBE_API_TOKEN
        '''
    }
  }
}
```

#### Additional scenarios 
Here are more examples of integration of Valint with Jenkins deployed in different forms. In these example we added usage of Valint to generate source code SBOM by calling it in the build script right after the code is checked out:

<details>
  <summary> <b> Jenkins over Docker </b></summary>
  <h4>  Prerequisites </h4>
    
    Jenkins extensions installed:
    1. **[Docker pipeline](https://plugins.jenkins.io/docker-workflow/ "Docker Pipeline extension")**
    1. **[Docker commons](https://plugins.jenkins.io/docker-commons/ "Docker Commons extension")**
    1. **[Docker plugin](https://plugins.jenkins.io/docker-plugin/ "Docker plugin extension" )**
    1. **[Docker API](https://plugins.jenkins.io/docker-java-api/ "Docker API extension")**
    1. **[Workspace Cleanup](https://plugins.jenkins.io/ws-cleanup/ "Workspace Cleanup extension")** (optional)

  * A `docker` is installed on your build node in Jenkins.

  <details>
    <summary>  <b> Example SBOM generation </b> </summary>

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
    <summary>  <b> Example SLSA prvenance generation and verification </b> </summary>

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
  <summary> <b> Jenkins over Kubernetes </b></summary>
  <h4>  Prerequisites </h4>

**[Jenkins over Kubernetes](https://plugins.jenkins.io/kubernetes/ "Jenkins over Kubernetes extension")** installed.

<details>
  <summary>  <b> Example SBOM generation </b> </summary>

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
  <summary>  <b> Example SLSA generationa nd verification </b> </summary>

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
  <summary> <b> Vanilla Jenkins (without an agent) </b></summary>
  <h4>  Prerequisites </h4>

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
    <summary>  <b> Example SLSA provenance </b> </summary>

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

<details>
  <summary> <b> Using an OCI registry as an evidence store instead of Scribe Hub </b></summary>
For on-prem deployment scenarios where you do not want to utilize Scribe Hub as a SaaS you can store, retrieve, and verify evidence with an OCI Resitry [learn more](https://scribe-security.netlify.app/docs/integrating-scribe/other-evidence-stores).

Related flags:
* `--oci` Enable OCI store.
* `--oci-repo` - Evidence store location.

1. Allow Valint Read and Write access to this registry.
2. Login to the registry. For example, `docker login` command or [Docker Pipeline custom registry](https://www.jenkins.io/doc/book/pipeline/docker/#custom-registry).

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
              --oci --oci-repo=[my_repo] '''
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
  <summary> <b> Example of genrating and verifying a SLSA provenance attestation </b></summary>

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
              -f '''
    }
```
<details>
