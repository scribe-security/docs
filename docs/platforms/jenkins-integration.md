---
sidebar_label: "Platforms Jenkins Integration"
title: Scribe Platforms Jenkins Pipelines
sidebar_position: 2
toc_min_heading_level: 2
toc_max_heading_level: 5
---

Scribe offers integration with Jenkins pipelines to enable the embedding of evidence collection and integrity validation directly into your CI/CD processes, helping to secure your software supply chain.

Further documentation [Platforms integration](**[Platforms integration](../../../platforms/overview)**).

## Prerequisites
Before you integrate Scribe Platforms with Jenkins, ensure the following prerequisites are met:

* Docker Daemon: The Jenkins agent running the pipeline must have access to a Docker daemon. This is required because the Scribe Platforms CLI runs within a Docker container.

* Docker-in-Docker (DIND) Setup: To issue platforms commands, especially those involving image scanning or evidence collection, your Jenkins pipeline needs to be configured with Docker-in-Docker (DIND). This setup allows the platforms CLI to execute Docker commands within the container, which is essential for interacting with Docker images and registries.

### Signing with x509 Keys

We recommend storing keys as secret files and mapping them to Valint.

Related Valint flags:
* `--key`: Path to the x509 private key.
* `--cert`: Path to the x509 certificate.
* `--ca`: Path to the x509 CA chain.

Platforms will automatically switch to the x509 signing scheme when the following environment variables are set:
* `VALINT_ATTEST_X509_PRIVATE`: Path to the x509 private key PEM.
* `VALINT_ATTEST_X509_CERT`: Path to the x509 certificate PEM.
* `VALINT_ATTEST_X509_CA`: Path to the x509 CA chain PEM.

> If you're using the Docker CLI, ensure that the temporary filesystem for secret files is correctly mapped, e.g., `-v $WORKSPACE@tmp:$WORKSPACE@tmp:rw,z`.


### Docker in Docker and Private Registries

Platforms can scan images from various registries. For certain commands, such as platforms bom, the image is pulled and analyzed locally. To optimize this process, we recommend using the Docker Daemon.

Mapping the docker.sock and setting the correct group permissions for the container allows it to access the Docker Daemon. Additionally, to customize the Docker configuration location, you can use the DOCKER_CONFIG environment variable.

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
    SCRIBE_PRODUCT_VERSION = "v0.0.2-jenkins"
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
        SCRIBE_PRODUCT_VERSION = "v0.0.2-jenkins"

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
<summary> Github Platform Example (Docker Plugin) </summary>

```yaml
pipeline {
  agent any
  environment {
    SCRIBE_PRODUCT_VERSION = "v0.0.2-jenkins"
    SCRIBE_TOKEN     = credentials('scribe-staging-token')
    GITHUB_TOKEN =  credentials('github-pat-token')
    VALINT_ATTEST_X509_PRIVATE     = credentials('attest-key-file')
    VALINT_ATTEST_X509_CERT     = credentials('attest-cert-file')
    VALINT_ATTEST_X509_CA     = credentials('attest-ca-file')
    DOCKER_GID = """${sh(returnStdout: true, script: 'getent group docker | cut -d: -f3')}""".trim()
    PLATFORM_DOCKER_CONFIG="$WORKSPACE/.docker"
    PLATFORMS_DB_PATH="$WORKSPACE/platforms.db"
    PLATFORMS_DB_STORE_POLICY="replace"
    VALINT_OUTPUT_DIRECTORY="$WORKSPACE/evidence"
    LOG_LEVEL="INFO"
  }
  stages {
    
    stage('github-discovery') {
      agent {
              docker { 
                  image 'scribesecurity/platforms:dev-latest'
                  args '-e DOCKER_CONFIG=$PLATFORM_DOCKER_CONFIG --entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock:rw -v $HOME/.docker/config.json:/$WORKSPACE/.docker/config.json:rw --group-add ${DOCKER_GID}'
                  reuseNode true
              }
          }
      steps {
          sh '''
          platforms --log-level $LOG_LEVEL discover github \
                    --scope.organization=scribe-security \
                    --scope.repository *mongo* *scribe-training-vue-project \
                    --workflow.skip --commit.skip --scope.branch=main

          platforms --log-level $LOG_LEVEL evidence --valint.sign github \
                    --organization.mapping=scribe-security::scribe-training-vue-project::$SCRIBE_PRODUCT_VERSION \
                    --repository.mapping=scribe-security*scribe-training-vue-project::scribe-training-vue-project::$SCRIBE_PRODUCT_VERSION'''
      }
    }

    stage('github-bom') {
      agent {
              docker { 
                  image 'scribesecurity/platforms:dev-latest'
                  args ' -e DOCKER_CONFIG=$PLATFORM_DOCKER_CONFIG --entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock:rw -v $HOME/.docker/config.json:/$WORKSPACE/.docker/config.json:rw --group-add ${DOCKER_GID}'
                  reuseNode true
              }
          }
      steps {
            sh '''
            platforms --log-level $LOG_LEVEL bom --valint.sign --allow-failures github \
              --organization.mapping=scribe-security::scribe-training-vue-project::$SCRIBE_PRODUCT_VERSION \
              --repository.mapping=scribe-security*scribe-training-vue-project::scribe-training-vue-project::$SCRIBE_PRODUCT_VERSION'''
      }
    }

    stage('github-policy') {
      agent {
              docker { 
                  image 'scribesecurity/platforms:dev-latest'
                  args '-e DOCKER_CONFIG=$PLATFORM_DOCKER_CONFIG --entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock:rw -v $HOME/.docker/config.json:/$WORKSPACE/.docker/config.json:rw --group-add ${DOCKER_GID}'
                  reuseNode true
              }
          }
      steps {
          sh '''
          platforms --log-level $LOG_LEVEL verify --max-threads 10 --valint.sign github \
             --organization.mapping=scribe-security::scribe-training-vue-project::$SCRIBE_PRODUCT_VERSION \
              --repository.mapping=scribe-security*scribe-training-vue-project::scribe-training-vue-project::$SCRIBE_PRODUCT_VERSION  \
              --organization.policy github/ct-1@discovery github/ct-3@discovery \
              --repository.policy github/ct-2@discovery github/ct-9@discovery'''
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
<summary> Kubernetes Platform Example (Docker Plugin) </summary>

```yaml
pipeline {
  agent any
  environment {
    SCRIBE_PRODUCT_VERSION = "v0.0.2-jenkins"
    SCRIBE_TOKEN     = credentials('scribe-staging-token')
    K8S_TOKEN =  credentials('k8s-token')
    K8S_URL = "https://my_cluster.com"
    VALINT_ATTEST_X509_PRIVATE     = credentials('attest-key-file')
    VALINT_ATTEST_X509_CERT     = credentials('attest-cert-file')
    VALINT_ATTEST_X509_CA     = credentials('attest-ca-file')
    SCRIBE_URL = "https://api.staging.scribesecurity.com"
    DOCKER_GID = """${sh(returnStdout: true, script: 'getent group docker | cut -d: -f3')}""".trim()
    PLATFORM_DOCKER_CONFIG="$WORKSPACE/.docker"
    PLATFORMS_DB_PATH="$WORKSPACE/platforms.db"
    PLATFORMS_DB_STORE_POLICY="replace"
    VALINT_OUTPUT_DIRECTORY="$WORKSPACE/evidence"
    LOG_LEVEL="DEBUG"
  }
  stages {
    
    stage('k8s-discovery') {
      agent {
              docker { 
                  image 'scribesecurity/platforms:dev-latest'
                  args '-e DOCKER_CONFIG=$PLATFORM_DOCKER_CONFIG --entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock:rw -v $HOME/.docker/config.json:/$WORKSPACE/.docker/config.json:rw --group-add ${DOCKER_GID}'
                  reuseNode true
              }
          }
      steps {
          sh '''
          platforms --log-level $LOG_LEVEL discover k8s --scope.namespace default

          platforms --log-level $LOG_LEVEL evidence --valint.sign k8s \
              --namespace.mapping=default::flask-monorepo-project::$SCRIBE_PRODUCT_VERSION default::dhs-vue-sample-proj::SCRIBE_PRODUCT_VERSION \
              --pod.mapping='*service-*::flask-monorepo-project::$SCRIBE_PRODUCT_VERSION *dhs*::dhs-vue-sample-proj::SCRIBE_PRODUCT_VERSION'''
      }
    }

    stage('k8s-bom') {
      agent {
              docker { 
                  image 'scribesecurity/platforms:dev-latest'
                  args ' -e DOCKER_CONFIG=$PLATFORM_DOCKER_CONFIG --entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock:rw -v $HOME/.docker/config.json:/$WORKSPACE/.docker/config.json:rw --group-add ${DOCKER_GID}'
                  reuseNode true
              }
          }
      steps {
            sh '''
            platforms --log-level $LOG_LEVEL bom --valint.sign --allow-failures k8s \
              --image.mapping \
                *service-*::flask-monorepo-project::$SCRIBE_PRODUCT_VERSION \
                *dhs*::dhs-vue-sample-proj::$SCRIBE_PRODUCT_VERSION'''
      }
    }

    stage('k8s-policy') {
      agent {
              docker { 
                  image 'scribesecurity/platforms:dev-latest'
                  args '-e DOCKER_CONFIG=$PLATFORM_DOCKER_CONFIG --entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock:rw -v $HOME/.docker/config.json:/$WORKSPACE/.docker/config.json:rw --group-add ${DOCKER_GID}'
                  reuseNode true
              }
          }
      steps {
          sh '''
          platforms --log-level $LOG_LEVEL verify --allow-failures --max-threads 10 --valint.sign k8s \
              --ignore-state \
              --image.mapping \
                default::*service-*::*service-*::flask-monorepo-project::$SCRIBE_PRODUCT_VERSION'''
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

```yaml
pipeline {
  agent any
  environment {
    SCRIBE_PRODUCT_VERSION = "v0.0.2-jenkins"
    SCRIBE_TOKEN     = credentials('scribe-staging-token')
    VALINT_ATTEST_X509_PRIVATE     = credentials('attest-key-file')
    VALINT_ATTEST_X509_CERT     = credentials('attest-cert-file')
    VALINT_ATTEST_X509_CA     = credentials('attest-ca-file')
    SCRIBE_URL = "https://api.staging.scribesecurity.com"
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
        withCredentials([usernamePassword(credentialsId: 'dockerhub-access-pat2', usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_PASSWORD')]) {
          sh 'docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_PASSWORD'
        }
      }
    }
    
    stage('dockerhub-discovery') {
      agent {
              docker { 
                  image 'scribesecurity/platforms:dev-latest'
                  args '-e DOCKER_CONFIG=$PLATFORM_DOCKER_CONFIG --entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock:rw -v $HOME/.docker/config.json:/$WORKSPACE/.docker/config.json:rw --group-add ${DOCKER_GID}'
                  reuseNode true
              }
          }
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-access-pat2', usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_PASSWORD')]) {
          sh '''
          platforms --log-level DEBUG discover dockerhub --scope.past_days=60
          platforms --log-level DEBUG evidence --valint.sign dockerhub \
            --namespace.mapping \
                *::sky-mapper::$SCRIBE_PRODUCT_VERSION \
              --repository.mapping \
                *star-generator*::sky-mapper::$SCRIBE_PRODUCT_VERSION \
                *sky-mapper*::sky-mapper::$SCRIBE_PRODUCT_VERSION'''
        }
      }
    }

    stage('dockerhub-bom') {
      agent {
              docker { 
                  image 'scribesecurity/platforms:dev-latest'
                  args ' -e DOCKER_CONFIG=$PLATFORM_DOCKER_CONFIG --entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock:rw -v $HOME/.docker/config.json:/$WORKSPACE/.docker/config.json:rw --group-add ${DOCKER_GID}'
                  reuseNode true
              }
          }
      steps {
          sh '''
          platforms --log-level DEBUG bom --valint.sign --allow-failures --max-threads 10 dockerhub \
              --image.mapping \
                *star-generator*::sky-mapper::$SCRIBE_PRODUCT_VERSION \
                *sky-mapper*::sky-mapper::$SCRIBE_PRODUCT_VERSION'''
      }
    }

    stage('dockerhub-policy') {
      agent {
              docker { 
                  image 'scribesecurity/platforms:dev-latest'
                  args '-e DOCKER_CONFIG=$PLATFORM_DOCKER_CONFIG --entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock:rw -v $HOME/.docker/config.json:/$WORKSPACE/.docker/config.json:rw --group-add ${DOCKER_GID}'
                  reuseNode true
              }
          }
      steps {
          sh '''
          platforms --log-level DEBUG verify --max-threads 10 --valint.sign dockerhub \
              --image.mapping \
                *star-generator*::sky-mapper::$SCRIBE_PRODUCT_VERSION \
                *sky-mapper*::sky-mapper::$SCRIBE_PRODUCT_VERSION'''
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
<summary> Gitlab Platform Example (Docker Plugin) </summary>


```yaml
pipeline {
  agent any
  environment {
    SCRIBE_PRODUCT_VERSION = "v0.0.2-jenkins"
    SCRIBE_TOKEN     = credentials('scribe-staging-token')
    GITLAB_TOKEN =  credentials('gitlab-token')
    VALINT_ATTEST_X509_PRIVATE     = credentials('attest-key-file')
    VALINT_ATTEST_X509_CERT     = credentials('attest-cert-file')
    VALINT_ATTEST_X509_CA     = credentials('attest-ca-file')
    SCRIBE_URL = "https://api.staging.scribesecurity.com"
    DOCKER_GID = """${sh(returnStdout: true, script: 'getent group docker | cut -d: -f3')}""".trim()
    PLATFORM_DOCKER_CONFIG="$WORKSPACE/.docker"
    PLATFORMS_DB_PATH="$WORKSPACE/platforms.db"
    PLATFORMS_DB_STORE_POLICY="replace"
    VALINT_OUTPUT_DIRECTORY="$WORKSPACE/evidence"
    LOG_LEVEL="DEBUG"
  }
  stages {
    
    stage('gitlab-discovery') {
      agent {
              docker { 
                  image 'scribesecurity/platforms:dev-latest'
                  args '-e DOCKER_CONFIG=$PLATFORM_DOCKER_CONFIG --entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock:rw -v $HOME/.docker/config.json:/$WORKSPACE/.docker/config.json:rw --group-add ${DOCKER_GID}'
                  reuseNode true
              }
          }
      steps {
          sh '''
          platforms --log-level $LOG_LEVEL discover gitlab \
            --scope.commit.past_days 60 \
            --scope.pipeline.past_days 60 \
            --token $GITLAB_TOKEN

          platforms --log-level $LOG_LEVEL evidence --valint.sign \
            gitlab \
            --organization.mapping \
               *::flask-monorepo-project::$SCRIBE_PRODUCT_VERSION \
               *::dhs-vue-sample-proj::$SCRIBE_PRODUCT_VERSION \
            --project.mapping \
               Scribe-Test*flask-monorepo-project::flask-monorepo-project::$SCRIBE_PRODUCT_VERSION \
               Scribe-Test*dhs-vue-sample-proj::dhs-vue-sample-proj::$SCRIBE_PRODUCT_VERSION'''
      }
    }

    stage('gitlab-bom') {
      agent {
              docker { 
                  image 'scribesecurity/platforms:dev-latest'
                  args ' -e DOCKER_CONFIG=$PLATFORM_DOCKER_CONFIG --entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock:rw -v $HOME/.docker/config.json:/$WORKSPACE/.docker/config.json:rw --group-add ${DOCKER_GID}'
                  reuseNode true
              }
          }
      steps {
            sh '''
            platforms --log-level $LOG_LEVEL bom --valint.sign --allow-failures gitlab \
            --organization.mapping \
               *::flask-monorepo-project::$SCRIBE_PRODUCT_VERSION \
               *::dhs-vue-sample-proj::$SCRIBE_PRODUCT_VERSION \
            --project.mapping \
               Scribe-Test*flask-monorepo-project::flask-monorepo-project::$SCRIBE_PRODUCT_VERSION \
               Scribe-Test*dhs-vue-sample-proj::dhs-vue-sample-proj::$SCRIBE_PRODUCT_VERSION'''
      }
    }

    stage('gitlab-policy') {
      agent {
              docker { 
                  image 'scribesecurity/platforms:dev-latest'
                  args '-e DOCKER_CONFIG=$PLATFORM_DOCKER_CONFIG --entrypoint="" -v /var/run/docker.sock:/var/run/docker.sock:rw -v $HOME/.docker/config.json:/$WORKSPACE/.docker/config.json:rw --group-add ${DOCKER_GID}'
                  reuseNode true
              }
          }
      steps {
          sh '''
          platforms --log-level $LOG_LEVEL verify --max-threads 10 --valint.sign gitlab \
          --organization.mapping \
              *::flask-monorepo-project::$SCRIBE_PRODUCT_VERSION \
              *::dhs-vue-sample-proj::$SCRIBE_PRODUCT_VERSION \
          --project.mapping \
              Scribe-Test*flask-monorepo-project::flask-monorepo-project::$SCRIBE_PRODUCT_VERSION \
              Scribe-Test*dhs-vue-sample-proj::dhs-vue-sample-proj::$SCRIBE_PRODUCT_VERSION'''
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


## .gitignore
It's recommended to add output directory value to your .gitignore file.
By default add `**/scribe` to your `.gitignore`.