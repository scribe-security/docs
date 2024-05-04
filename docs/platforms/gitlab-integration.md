---
sidebar_label: "Platforms GitLab Integration"
title: "Platforms GitLab Integration"
sidebar_position: 2
---

# Scribe Security Platform GitLab Integration Guide

Welcome to the official documentation for integrating the Scribe Security Platform with GitLab CI/CD. This guide provides comprehensive instructions on configuring your GitLab CI pipeline to leverage the powerful security features of the Scribe Security Platform. Below, you'll find detailed information on how to structure your CI/CD pipeline, utilize cache mechanisms, manage runner considerations, and leverage global variables effectively.

## Overview
The integration revolves around three main stages: `discovery`, `bom-sign`, and `policy`. Each stage serves a specific purpose in enhancing the security of your software development lifecycle.

Reusable Jobs Can be pulled from the following [repository](https://github.com/scribe-public/gitlab_platforms.git).

### Quick-start
To use our provided reusable Jobs, add the 'include' section with a 'remote' reference:

```yaml
include:
  - remote: `https://raw.githubusercontent.com/scribe-public/gitlab_platforms/main/[ Job ]
    inputs:
      [ARGS]

```

2. **Set Global Variables**: Customize global variables according to your environment and requirements.

3. **Configure Stages**: Customize stages based on your platform (GitLab, Dockerhub, or Kubernetes).

4. **Adjust Runner Considerations**: Ensure your CI/CD runner environment meets the necessary requirements for cache management and optimal performance.

You may find the reusable Jobs in the following location.
- [GitLab Workflow](https://github.com/scribe-public/gitlab_platforms/blob/main/discover-gitlab.yml)
- [Dockerhub Workflow](https://github.com/scribe-public/gitlab_platforms/blob/main/discover-dockerhub.yml)
- [Kubernetes Workflow](https://github.com/scribe-public/gitlab_platforms/blob/main/discover-k8s.yml)
- [BOM Dockerhub Workflow](https://github.com/scribe-public/gitlab_platforms/blob/main/bom-dockerhub.yml)
- [BOM Kubernetes Workflow](https://github.com/scribe-public/gitlab_platforms/blob/main/bom-k8s.yml)
- [Policy GitLab Workflow](https://github.com/scribe-public/gitlab_platforms/blob/main/policy-gitlab.yml)
- [Policy Dockerhub Workflow](https://github.com/scribe-public/gitlab_platforms/blob/main/policy-dockerhub.yml)
- [Policy Kubernetes Workflow](https://github.com/scribe-public/gitlab_platforms/blob/main/policy-k8s.yml)

### Usage

<details>
<summary> Gitlab Workflow Example </summary>

```yaml
variables:
  ####### PLATFORMS TOOL VERSION #######
  PLATFORMS_VERSION: "latest" # Platform APP Version
  
  ####### VALINT GLOBAL VARIABLES #######
  VALINT_SCRIBE_AUTH_CLIENT_SECRET: $SCRIBE_CLIENT_TOKEN # Scribe Service Client Secret
  VALINT_SCRIBE_ENABLE: true
  VALINT_SCRIBE_URL: https://api.dev.scribesecurity.com
  VALINT_CONTEXT_TYPE: "gitlab"
  VALINT_DISABLE_EVIDENCE_CACHE: false

  ####### SIGNING/VERIFYING GLOBAL VARIABLES #######
  ATTEST_KEY_B64: $ATTEST_KEY_B64 # Evidence Signing Key
  ATTEST_CERT_B64: $ATTEST_CERT_B64 # Evidence Signing Cert
  ATTEST_CA_B64: $ATTEST_CA_B64 # Evidence Signing CA

  ######### DISCOVERY GITLAB VARIABLES #########
  GITLAB_TOKEN: $GITLAB_PAT_TOKEN # Gitlab discovery token

stages:
  - discovery
  - bom-sign
  - policy

include:
  # DISCOVERY
  - remote: https://raw.githubusercontent.com/scribe-public/gitlab_platforms/main/discover-gitlab.yml
    inputs:
      project-mapping: "flask-monorepo-project::Flask::V.2 dhs-vue-sample-proj::dhs-vue-sample-proj::V.2"
      organization-mapping: "*::Flask::V.2 *::dhs-vue-sample-proj::V.2"
      gitlab-token: ${GITLAB_TOKEN}

  # POLICY
  - remote: https://raw.githubusercontent.com/scribe-public/gitlab_platforms/main/policy-gitlab.yml
    inputs:
      project-mapping: "flask-monorepo-project::Flask::V.2 dhs-vue-sample-proj::dhs-vue-sample-proj::V.2"
      organization-mapping: "*::Flask::V.2 *::dhs-vue-sample-proj::V.2"

discovery-gitlab:
  stage: discovery
  cache:
  - key: gitlab.platforms.db
    paths:
    - gitlab.platforms.db
  - key: discovery-gitlab-product-version
    paths:
    - discovery-gitlab-product-version
  - key: evidence-gitlab
    paths:
    - evidence/gitlab
  variables:
    PLATFORMS_DB_PATH: gitlab.platforms.db
    VALINT_OUTPUT_DIRECTORY: evidence/gitlab

policy-gitlab:
  stage: policy
  needs: ["discovery-gitlab"]
  cache:
  - key: gitlab.platforms.db
    paths:
    - gitlab.platforms.db
  - key: discovery-gitlab-product-version
    paths:
    - discovery-gitlab-product-version
  - key: evidence-gitlab
    paths:
    - evidence/gitlab
  variables:
    PLATFORMS_DB_PATH: gitlab.platforms.db
    VALINT_OUTPUT_DIRECTORY: evidence/gitlab
  artifacts:
    paths:
      - evidence/gitlab/*sarif*
    expire_in: 1 week
```

</details>

<details>
<summary> Dockerhub Workflow Example </summary>

```yaml
variables:
  ####### PLATFORMS TOOL VERSION #######
  PLATFORMS_VERSION: "latest" # Platform APP Version
  
  ####### VALINT GLOBAL VARIABLES #######
  VALINT_SCRIBE_AUTH_CLIENT_SECRET: $SCRIBE_CLIENT_TOKEN # Scribe Service Client Secret
  VALINT_SCRIBE_ENABLE: true
  VALINT_SCRIBE_URL: https://api.dev.scribesecurity.com
  VALINT_CONTEXT_TYPE: "gitlab"
  VALINT_DISABLE_EVIDENCE_CACHE: false

  ####### SIGNING/VERIFYING GLOBAL VARIABLES #######
  ATTEST_KEY_B64: $ATTEST_KEY_B64 # Evidence Signing Key
  ATTEST_CERT_B64: $ATTEST_CERT_B64 # Evidence Signing Cert
  ATTEST_CA_B64: $ATTEST_CA_B64 # Evidence Signing CA
 
  ######### DISCOVERY DOCKERHUB VARIABLES #########
  DOCKERHUB_USERNAME: $DOCKERHUB_USERNAME
  DOCKERHUB_PASSWORD: $DOCKERHUB_PASSWORD_B64

  ######### DIND VARIABLES #########
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_VERIFY: 1
  DOCKER_TLS_CERTDIR: "/certs"
  DOCKER_CERT_PATH: "/certs/client"
  DOCKER_HOST: tcp://docker:2376

  ############# DEBUG VARIABLES #############
  MONITOR_MOUNT: /builds
  MONITOR_CLEAN_DOCKER: true
  # LOG_LEVEL: "INFO"
  # DEBUG: false
  # VALINT_LOG_LEVEL: "info"

stages:
  - discovery
  - bom-sign
  - policy

include:
  # DISCOVERY
  - remote: https://raw.githubusercontent.com/scribe-public/gitlab_platforms/main/discover-dockerhub.yml
    inputs:
      mapping: "*service-*::Flask::V.2 *dhs*::dhs-vue-sample-proj::V.2"
      username: ${DOCKERHUB_USERNAME}
      password-b64: ${DOCKERHUB_PASSWORD_B64}

  # BOM
  - remote: https://raw.githubusercontent.com/scribe-public/gitlab_platforms/main/bom-dockerhub.yml
    inputs:
      mapping: "*service-*::Flask::V.2 *dhs*::dhs-vue-sample-proj::V.2"

  # POLICY
  - remote: https://raw.githubusercontent.com/scribe-public/gitlab_platforms/main/policy-dockerhub.yml
    inputs:
      mapping: "*service-*::Flask::V.2 *dhs*::dhs-vue-sample-proj::V.2"

discovery-dockerhub:
  stage: discovery
  cache:
  - key: dockerhub.platforms.db
    paths:
    - dockerhub.platforms.db
  - key: evidence-dockerhub-discovery
    paths:
    - evidence/dockerhub-discovery
  variables:
    PLATFORMS_DB_PATH: dockerhub.platforms.db
    VALINT_OUTPUT_DIRECTORY: evidence/dockerhub-discovery

############### BOM ################
bom-dockerhub:
  stage: bom-sign
  needs: ["discovery-dockerhub"]
  timeout: 5 hours
  cache:
  - key: dockerhub.platforms.db
    paths:
    - dockerhub.platforms.db
  - key: evidence-dockerhub
    paths:
    - evidence/dockerhub
  variables:
    PLATFORMS_DB_PATH: dockerhub.platforms.db
    VALINT_OUTPUT_DIRECTORY: evidence/dockerhub

policy-dockerhub:
  stage: policy
  needs: ["bom-dockerhub"]
  timeout: 5 hours
  cache:
  - key: dockerhub.platforms.db
    paths:
      - dockerhub.platforms.db
  - key: evidence-dockerhub
    paths:
    - evidence/dockerhub
  variables:
    PLATFORMS_DB_PATH: dockerhub.platforms.db
    VALINT_OUTPUT_DIRECTORY: evidence/dockerhub
  artifacts:
    paths:
      - evidence/dockerhub/*sarif*
    expire_in: 1 week
```
</details>

<details>
<summary> Kuberneties Workflow Example </summary>

```yaml
variables:
  ####### PLATFORMS TOOL VERSION #######
  PLATFORMS_VERSION: "latest" # Platform APP Version
  
  ####### VALINT GLOBAL VARIABLES #######
  VALINT_SCRIBE_AUTH_CLIENT_SECRET: $SCRIBE_CLIENT_TOKEN # Scribe Service Client Secret
  VALINT_SCRIBE_ENABLE: true
  VALINT_SCRIBE_URL: https://api.dev.scribesecurity.com
  VALINT_CONTEXT_TYPE: "gitlab"
  VALINT_DISABLE_EVIDENCE_CACHE: false

  ####### SIGNING/VERIFYING GLOBAL VARIABLES #######
  ATTEST_KEY_B64: $ATTEST_KEY_B64 # Evidence Signing Key
  ATTEST_CERT_B64: $ATTEST_CERT_B64 # Evidence Signing Cert
  ATTEST_CA_B64: $ATTEST_CA_B64 # Evidence Signing CA

  ######### DISCOVERY KUBERNETES VARIABLES #########
  K8S_TOKEN: $K8S_TEST_CLUSTER_TOKEN # K8s discovery token
  K8S_URL: https://56E073BB3D6C84F4E42CEF28C0AEA1CE.sk1.us-west-2.eks.amazonaws.com # K8s discovery URL
  
  ######### DIND VARIABLES #########
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_VERIFY: 1
  DOCKER_TLS_CERTDIR: "/certs"
  DOCKER_CERT_PATH: "/certs/client"
  DOCKER_HOST: tcp://docker:2376

  ############# DEBUG VARIABLES #############
  MONITOR_MOUNT: /builds
  MONITOR_CLEAN_DOCKER: true

stages:
  - discovery
  - bom-sign
  - policy

include:
  # DISCOVERY
  - remote: https://raw.githubusercontent.com/scribe-public/gitlab_platforms/main/discover-gitlab.yml
    inputs:
      project-mapping: "flask-monorepo-project::Flask::V.2 dhs-vue-sample-proj::dhs-vue-sample-proj::V.2"
      organization-mapping: "*::Flask::V.2 *::dhs-vue-sample-proj::V.2"
      gitlab-token: ${GITLAB_TOKEN}

  - remote: https://raw.githubusercontent.com/scribe-public/gitlab_platforms/main/discover-dockerhub.yml
    inputs:
      mapping: "*service-*::Flask::V.2 *dhs*::dhs-vue-sample-proj::V.2"
      username: ${DOCKERHUB_USERNAME}
      password-b64: ${DOCKERHUB_PASSWORD_B64}

  - remote: https://raw.githubusercontent.com/scribe-public/gitlab_platforms/main/discover-k8s.yml
    inputs:
      namespace-mapping: "*default*::factory2::V.2"
      pod-mapping: "*::factory2::V.2"
      token: ${K8S_URL}
      url: ${K8S_TOKEN}

  # BOM
  - remote: https://raw.githubusercontent.com/scribe-public/gitlab_platforms/main/bom-dockerhub.yml
    inputs:
      mapping: "*service-*::Flask::V.2 *dhs*::dhs-vue-sample-proj::V.2"

  - remote: https://raw.githubusercontent.com/scribe-public/gitlab_platforms/main/bom-k8s.yml
    inputs:
      mapping: "*default*::*::*::factory2::V.2"

  # POLICY
  - remote: https://raw.githubusercontent.com/scribe-public/gitlab_platforms/main/policy-gitlab.yml
    inputs:
      project-mapping: "flask-monorepo-project::Flask::V.2 dhs-vue-sample-proj::dhs-vue-sample-proj::V.2"
      organization-mapping: "*::Flask::V.2 *::dhs-vue-sample-proj::V.2"

  - remote: https://raw.githubusercontent.com/scribe-public/gitlab_platforms/main/policy-dockerhub.yml
    inputs:
      mapping: "*service-*::Flask::V.2 *dhs*::dhs-vue-sample-proj::V.2"

  - remote: https://raw.githubusercontent.com/scribe-public/gitlab_platforms/main/policy-k8s.yml
    inputs:
      mapping: "*default*::*::*::factory2::V.2"

discovery-gitlab:
  stage: discovery
  cache:
  - key: gitlab.platforms.db
    paths:
    - gitlab.platforms.db
  - key: discovery-gitlab-product-version
    paths:
    - discovery-gitlab-product-version
  - key: evidence-gitlab
    paths:
    - evidence/gitlab
  variables:
    PLATFORMS_DB_PATH: gitlab.platforms.db
    VALINT_OUTPUT_DIRECTORY: evidence/gitlab


discovery-dockerhub:
  stage: discovery
  cache:
  - key: dockerhub.platforms.db
    paths:
    - dockerhub.platforms.db
  - key: evidence-dockerhub-discovery
    paths:
    - evidence/dockerhub-discovery
  variables:
    PLATFORMS_DB_PATH: dockerhub.platforms.db
    VALINT_OUTPUT_DIRECTORY: evidence/dockerhub-discovery

discovery-k8s:
  stage: discovery
  cache:
  - key: k8s.platforms.db
    paths:
    - k8s.platforms.db
  - key: evidence-k8s-discovery
    paths:
    - evidence/k8s-discovery
  variables:
    PLATFORMS_DB_PATH: k8s.platforms.db
    VALINT_OUTPUT_DIRECTORY: evidence/k8s-discovery

############### BOM ################
bom-dockerhub:
  stage: bom-sign
  needs: ["discovery-dockerhub"]
  timeout: 5 hours
  cache:
  - key: dockerhub.platforms.db
    paths:
    - dockerhub.platforms.db
  - key: evidence-dockerhub
    paths:
    - evidence/dockerhub
  variables:
    PLATFORMS_DB_PATH: dockerhub.platforms.db
    VALINT_OUTPUT_DIRECTORY: evidence/dockerhub

bom-k8s:
  stage: bom-sign
  needs: ["discovery-k8s"]
  cache:
  - key: k8s.platforms.db
    paths:
    - k8s.platforms.db
  - key: evidence-k8s
    paths:
    - evidence/k8s
  variables:
    PLATFORMS_DB_PATH: k8s.platforms.db
    VALINT_OUTPUT_DIRECTORY: evidence/k8s

############### POLICY ################
policy-gitlab:
  stage: policy
  needs: ["discovery-gitlab"]
  cache:
  - key: gitlab.platforms.db
    paths:
    - gitlab.platforms.db
  - key: discovery-gitlab-product-version
    paths:
    - discovery-gitlab-product-version
  - key: evidence-gitlab
    paths:
    - evidence/gitlab
  variables:
    PLATFORMS_DB_PATH: gitlab.platforms.db
    VALINT_OUTPUT_DIRECTORY: evidence/gitlab
  artifacts:
    paths:
      - evidence/gitlab/*sarif*
    expire_in: 1 week

policy-dockerhub:
  stage: policy
  needs: ["bom-dockerhub"]
  timeout: 5 hours
  cache:
  - key: dockerhub.platforms.db
    paths:
      - dockerhub.platforms.db
  - key: evidence-dockerhub
    paths:
    - evidence/dockerhub
  variables:
    PLATFORMS_DB_PATH: dockerhub.platforms.db
    VALINT_OUTPUT_DIRECTORY: evidence/dockerhub
  artifacts:
    paths:
      - evidence/dockerhub/*sarif*
    expire_in: 1 week

policy-k8s:
  stage: policy
  needs: ["bom-k8s"]
  cache:
  - key: k8s.platforms.db
    paths:
      - k8s.platforms.db
  - key: evidence-k8s
    paths:
    - evidence/k8s
  variables:
    PLATFORMS_DB_PATH: k8s.platforms.db
    VALINT_OUTPUT_DIRECTORY: evidence/k8s
  artifacts:
    paths:
      - evidence/k8s/*sarif*
    expire_in: 1 week
```
</details>

## `Discovery` Stage

In the `discovery` stage, assets are identified within your GitLab, Dockerhub, or Kubernetes environments. These assets are then stored in a database, and evidence is generated for subsequent analysis.

### Cache
- Database cache is essential for all subsequent stages.
- Evidence cache is recommended for improved performance.

### Variables
| Variable                  | Description                                |
|---------------------------|--------------------------------------------|
| `PLATFORMS_DB_PATH`       | Path to the database file.                 |
| `VALINT_OUTPUT_DIRECTORY` | Path to the evidence output directory.     |

### Jobs
| Job                       | Description                                   | Required Tokens |
|---------------------------|-----------------------------------------------|-----------------|
| `discovery-gitlab`        | Discovers artifacts in GitLab environment.   | `GITLAB_TOKEN`  |
| `discovery-dockerhub`     | Discovers artifacts in Dockerhub environment.| `DOCKERHUB_USERNAME`, `DOCKERHUB_PASSWORD` |
| `discovery-k8s`           | Discovers artifacts in Kubernetes environment.| `K8S_TOKEN`, `K8S_URL` |

## `BOM-SIGN` Stage

In the `bom-sign` stage, assets retrieved from the database are used to create SBOMs (Software Bill of Materials), which are then signed and uploaded to the Scribe Security Platform.

### Cache
- Database cache from the discovery stage is required.
- Evidence cache is recommended for policy evaluation.

### Jobs
| Job                       | Description                                |
|---------------------------|--------------------------------------------|
| `bom-sign-dockerhub`      | Creates and signs SBOMs for Dockerhub.     |
| `bom-sign-k8s`            | Creates and signs SBOMs for Kubernetes.    |

## `Policy` Stage

The `policy` stage evaluates the security framework policy against signed evidence, generating SARIF reports that are subsequently signed and uploaded.

### Cache
- Database cache from the discovery stage is required.
- Evidence cache is recommended for improved performance.

### Jobs
| Job                       | Description                                |
|---------------------------|--------------------------------------------|
| `policy-gitlab`           | Evaluates policy against GitLab evidence.  |
| `policy-dockerhub`        | Evaluates policy against Dockerhub evidence. |
| `policy-k8s`              | Evaluates policy against Kubernetes evidence. |

The next chapters of this documentation provide a comprehensive guide to seamlessly integrating the Scribe Security Platform into your GitLab CI/CD pipeline, ensuring enhanced security throughout your development lifecycle.

## Runner Considerations

When managing your GitLab CI/CD pipeline, it's essential to consider various factors related to your runner environment to ensure smooth operation and optimal performance. Here are some key considerations:

- **DIND Runner Space**: If you're using a Docker-in-Docker (DIND) runner, ensure that it has sufficient space to cache images pulled by the 'bom-sign' and 'policy' jobs. This cache is instrumental in reducing the time it takes to scan a large array of images.

- **Database Cache**: Database cache is required for all stages of your pipeline and must be shared across all stages. Each platform type (GitLab, Dockerhub, Kubernetes) may have its own database. It's essential to allocate adequate space for the database cache and monitor its usage regularly. If you remove the database cache, you must first run the 'discovery' stage to recreate it. Helper functions like 'cleanup-database-cache' can be used to remove the database cache when needed.

- **Evidence Cache**: While evidence cache is optional, it's recommended for improved performance. It can be shared across some or all stages of your pipeline. Evidence cache is created by any job using it, and evidence is pushed to it in all stages. If you remove the evidence cache, the required evidence will be pulled from the Scribe Security Platform. Helper functions like 'cleanup-evidence-cache' can be used to remove the evidence cache when needed.

## GitLab Cache API

In our examples, we utilize the GitLab Cache API to seamlessly share the database and evidence cache across stages. GitLab CI shares the Docker cache across jobs by default, simplifying cache management and optimizing resource utilization.

### Docker Cache

When using a DIND runner, ensure that it has enough space to store the database and evidence cache. Additionally, allocate sufficient space to store image caches when using 'bom-sign' and 'policy' for both Dockerhub and Kubernetes. You can utilize helper functions like 'cleanup-docker-cache' to remove the Docker cache and maintain optimal storage usage.

### Automatic Cleanup

The Platforms CLI includes the ability to automate Docker cache cleanup by invoking `docker system prune -af` automatically. You can configure parameters such as `MONITOR_MOUNT`, `MONITOR_CLEAN_DOCKER`, and `MONITOR_THRESHOLD` to manage space usage effectively. If the space usage exceeds the threshold, the runner will automatically clean up the Docker cache, ensuring smooth operation of your CI/CD pipeline.

## Global Variables

Effortlessly configure global variables to tailor the integration to your specific requirements.

| Variable                         | Description                                                     |
|----------------------------------|-----------------------------------------------------------------|
| `PLATFORMS_VERSION`              | Version of the Scribe Security Platform to use.                 |
| `VALINT_SCRIBE_AUTH_CLIENT_SECRET` | Scribe Service Client Secret.                                 |
| `VALINT_SCRIBE_ENABLE`           | Enable Scribe Service.                                          |
| `VALINT_SCRIBE_URL`              | Scribe Service URL.                                             |
| `VALINT_CONTEXT_TYPE`            | Context type to use.                                            |
| `VALINT_DISABLE_EVIDENCE_CACHE`  | Disable evidence cache.                                         |
| `ATTEST_KEY_B64`                 | Evidence signing key.                                           |
| `ATTEST_CERT_B64`                | Evidence signing certificate (use PEM format).                                   |
| `ATTEST_CA_B64`                  | Evidence signing CA (use PEM format).                                            |
| `GITLAB_TOKEN`                   | GitLab discovery token.                                         |
| `K8S_TOKEN`                      | Kubernetes discovery token.                                     |
| `K8S_URL`                        | Kubernetes discovery URL.                                       |
| `DOCKERHUB_USERNAME`             | Dockerhub username.                                             |
| `DOCKERHUB_PASSWORD`             | Dockerhub password.                                             |
| `DOCKER_DRIVER`                  | Docker driver to use.                                           |
| `DOCKER_TLS_VERIFY`              | Docker TLS verify.                                              |
| `DOCKER_TLS_CERTDIR`             | Docker TLS cert directory.                                      |
| `DOCKER_CERT_PATH`               | Docker cert path.                                               |
| `DOCKER_HOST`                    | Docker host.                                                    |
| `MONITOR_MOUNT`                  | Path to monitor for space usage.                                |
| `MONITOR_CLEAN_DOCKER`           | If true, clean up docker cache if space is low.                 |
| `MONITOR_THRESHOLD`              | Threshold for space usage.                                      |
| `LOG_LEVEL`                      | Log level to use.                                               |
| `DEBUG`                          | Enable API trace mode.                                          |
| `VALINT_LOG_LEVEL`               | Valint log level to use.                                        
