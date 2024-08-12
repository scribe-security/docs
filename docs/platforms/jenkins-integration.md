---
sidebar_label: "Platforms Jenkins Integration"
title: Scribe Platforms Jenkins Pipelines
sidebar_position: 4
toc_min_heading_level: 2
toc_max_heading_level: 5
---

Scribe offers integration with Jenkins pipelines to enable the embedding of evidence collection and integrity validation directly into your CI/CD processes, helping to secure your software supply chain.

Further documentation [Platforms integration](**[Platforms integration](../../../platforms/overview)**).

## Prerequisites
Before you integrate Scribe Platforms with Jenkins, ensure the following prerequisites are met:

* Docker Daemon: The Jenkins agent running the pipeline must have access to a Docker daemon. This is required because the Scribe Platforms CLI runs within a Docker container.

* Docker-in-Docker (DIND) Setup: To issue platforms commands, especially those involving image scanning or evidence collection, your Jenkins pipeline needs to be configured with Docker-in-Docker (DIND). This setup allows the platforms CLI to execute Docker commands within the container, which is essential for interacting with Docker images and registries.

## Setting Secret Flags

Platforms CLI supports passing secrets as environment variables:

- `VALINT_ATTEST_X509_PRIVATE`, `VALINT_ATTEST_X509_CERT`, `VALINT_ATTEST_X509_CA`: Set evidence signing file paths.
- `SCRIBE_TOKEN`: Set Scribe Client Secret.
- `VALINT_OUTPUT_DIRECTORY`: Set evidence local cache directory.
- `PLATFORMS_DB_PATH`: Set platforms database path.
- `JFROG_TOKEN`: Set Jfrog discovery access.
- `GITHUB_TOKEN`: Set GitHub discovery access.
- `DOCKERHUB_USERNAME`, `DOCKERHUB_PASSWORD`: Set DockerHub discovery access.
- `K8S_URL`, `K8S_TOKEN`: Set Kubernetes discovery access.
- `GITLAB_TOKEN`: Set GitLab discovery access.

<details>
<summary> Jfrog Platform Example (Docker Plugin) </summary>

```yaml
pipeline {
  agent any
  environment {
    SCRIBE_PRODUCT_VERSION     = credentials('scribe-product-key')
    SCRIBE_TOKEN     = credentials('scribe-staging-token')
    VALINT_ATTEST_X509_PRIVATE     = credentials('attest-key-file')
    VALINT_ATTEST_X509_CERT     = credentials('attest-cert-file')
    VALINT_ATTEST_X509_CA     = credentials('attest-ca-file')
    JFROG_URL = https://mycompany.jfrog.io
    DOCKER_GID = """${sh(returnStdout: true, script: 'getent group docker | cut -d: -f3')}""".trim()
    PLATFORM_DOCKER_CONFIG="$WORKSPACE/.docker"
    PLATFORMS_DB_PATH="$WORKSPACE/platforms.db"
    PLATFORMS_DB_STORE_POLICY="replace"
    VALINT_OUTPUT_DIRECTORY="$WORKSPACE/evidence"
  }
  stages {
    stage('docker login')
    {
      steps {
        withCredentials([usernamePassword(credentialsId: 'jfrog-oci', usernameVariable: 'JFROG_USER', passwordVariable: 'JFROG_PASS')]) {
          sh 'docker login $JFROG_URL -u $JFROG_USER -p $JFROG_PASS'
        }
      }
    }
    
    stage('jfrog-discovery') {
      agent {
              docker { 
                  image 'scribesecurity/platforms:dev-latest'
                  args '-e DOCKER_CONFIG=$PLATFORM_DOCKER_CONFIG --entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock:rw -v $HOME/.docker/config.json:/$WORKSPACE/.docker/config.json:rw --group-add ${DOCKER_GID}'
                  reuseNode true
              }
          }
      steps {
        withCredentials([usernamePassword(credentialsId: 'jfrog-access', usernameVariable: 'JFROG_URL', passwordVariable: 'JFROG_TOKEN')]) {
          sh '''
          printenv
          platforms --log-level DEBUG discover jfrog  --scope.tag_limit 2
          platforms --log-level DEBUG evidence --valint.sign jfrog \
            --jf-repository.mapping *::flask-monorepo-project::$SCRIBE_PRODUCT_VERSION'''
        }
      }
    }

    stage('jfrog-bom') {
      agent {
              docker { 
                  image 'scribesecurity/platforms:dev-latest'
                  args ' -e DOCKER_CONFIG=$PLATFORM_DOCKER_CONFIG --entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock:rw -v $HOME/.docker/config.json:/$WORKSPACE/.docker/config.json:rw --group-add ${DOCKER_GID}'
                  reuseNode true
              }
          }
      steps {
          sh '''
          platforms --log-level DEBUG bom --valint.sign --allow-failures jfrog \
            --image.mapping=*stub*::flask-monorepo-project::$SCRIBE_PRODUCT_VERSION \
            --exclude.repository *stub_remote_empty*'''
      }
    }

    stage('jfrog-policy') {
      agent {
              docker { 
                  image 'scribesecurity/platforms:dev-latest'
                  args '-e DOCKER_CONFIG=$PLATFORM_DOCKER_CONFIG --entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock:rw -v $HOME/.docker/config.json:/$WORKSPACE/.docker/config.json:rw --group-add ${DOCKER_GID}'
                  reuseNode true
              }
          }
      steps {
          sh '''
          platforms --log-level DEBUG verify --valint.sign jfrog \
            --image.mapping=*stub*::flask-monorepo-project::$SCRIBE_PRODUCT_VERSION \
            --exclude.repository *stub_remote_empty*'''
      }
    }
  }

  post {
      always {
          archiveArtifacts artifacts: '**/evidence/*.sarif.*', fingerprint: true 
      }
  }
}
```
</details>

<details>
<summary> Jfrog Platform Example (Docker CLI) </summary>

```yaml
def dockerRunPlatforms = { args ->
  sh """
  docker run -t \
    -e SCRIBE_URL \
    -e SCRIBE_TOKEN \
    -e SCRIBE_PRODUCT_VERSION \
    -e PLATFORMS_DB_STORE_POLICY \
    -e VALINT_OUTPUT_DIRECTORY \
    -e VALINT_ATTEST_X509_PRIVATE \
    -e VALINT_ATTEST_X509_CERT \
    -e VALINT_ATTEST_X509_CA \
    -e VALINT_LOG_LEVEL \
    -e BUILD_ID \
    -e BUILD_NUMBER \
    -e JOB_NAME \
    -e NODE_NAME \
    -e WORKSPACE \
    -e GIT_URL \
    -e GIT_BRANCH \
    -e GIT_COMMIT \
    -e JFROG_URL \
    -e JFROG_TOKEN \
    -e PLATFORMS_DB_PATH \
    -e DOCKER_CONFIG=$PLATFORM_DOCKER_CONFIG \
    -v /var/run/docker.sock:/var/run/docker.sock:rw \
    -v $HOME/.docker/config.json:/$WORKSPACE/.docker/config.json:rw \
    -v $WORKSPACE:$WORKSPACE:rw,z \
    -v $WORKSPACE@tmp:$WORKSPACE@tmp:rw,z \
    -w $WORKSPACE \
    --group-add ${DOCKER_GID} \
    scribesecurity/platforms:dev-latest ${args}
  """
}

pipeline {
  agent any
  environment {
    SCRIBE_PRODUCT_VERSION     = credentials('scribe-product-key')
    SCRIBE_TOKEN     = credentials('scribe-staging-token')
    VALINT_ATTEST_X509_PRIVATE     = credentials('attest-key-file')
    VALINT_ATTEST_X509_CERT     = credentials('attest-cert-file')
    VALINT_ATTEST_X509_CA     = credentials('attest-ca-file')
    SCRIBE_URL = "https://api.staging.scribesecurity.com"
    JFROG_URL = "scribesecuriy.jfrog.io"
    DOCKER_GID = """${sh(returnStdout: true, script: 'getent group docker | cut -d: -f3')}""".trim()
    PLATFORM_DOCKER_CONFIG="$WORKSPACE/.docker"
    PLATFORMS_DB_PATH="$WORKSPACE/platforms.db"
    PLATFORMS_DB_STORE_POLICY="replace"
    VALINT_OUTPUT_DIRECTORY="$WORKSPACE/evidence"
    VALINT_LOG_LEVEL="DEBUG"
  }
  stages {
    stage('docker login')
    {
      steps {
        withCredentials([usernamePassword(credentialsId: 'jfrog-oci', usernameVariable: 'JFROG_USER', passwordVariable: 'JFROG_PASS')]) {
          sh 'docker login $JFROG_URL -u $JFROG_USER -p $JFROG_PASS'
        }
      }
    }
    
    stage('jfrog-discovery') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'jfrog-access', usernameVariable: 'JFROG_URL', passwordVariable: 'JFROG_TOKEN')]) {
          script {
            dockerRunPlatforms('discover jfrog --scope.tag_limit 2')
            dockerRunPlatforms('''--log-level DEBUG evidence --valint.sign jfrog \
                --jf-repository.mapping *::flask-monorepo-project::$SCRIBE_PRODUCT_VERSION''')
          }
        }
      }
    }

    stage('jfrog-bom') {
      steps {
          script {
            dockerRunPlatforms('--log-level DEBUG bom --valint.sign --allow-failures jfrog \
              --image.mapping=*stub*::flask-monorepo-project::$SCRIBE_PRODUCT_VERSION \
              --exclude.repository *stub_remote_empty*')
          }
      }
    }

    stage('jfrog-policy') {
      steps {
          script {
          dockerRunPlatforms('--log-level DEBUG verify --valint.sign jfrog \
            --image.mapping=*stub*::flask-monorepo-project::$SCRIBE_PRODUCT_VERSION \
            --exclude.repository *stub_remote_empty*')
          }
      }
    }
  }

  post {
      always {
          archiveArtifacts artifacts: '**/evidence/*.sarif.*', fingerprint: true 
      }
  }
}
```

</details>

<details>
<summary> Dockerhub Platform Example (Docker Plugin) </summary>
</details>

## .gitignore
It's recommended to add output directory value to your .gitignore file.
By default add `**/scribe` to your `.gitignore`.