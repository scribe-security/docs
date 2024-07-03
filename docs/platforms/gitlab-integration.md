---
sidebar_label: "Platforms GitLab Integration"
title: "Platforms GitLab Integration"
sidebar_position: 2
---

# Scribe Security Platforms GitLab Integration Guide

Welcome to the official documentation for integrating Scribe Security Platforms Tool with GitLab CI/CD. This guide provides comprehensive instructions on configuring your GitLab CI pipeline to leverage the powerful security features of the Scribe Security Platform. Below, you'll find detailed information on how to structure your CI/CD pipeline, utilize cache mechanisms, manage runner considerations, and leverage global variables effectively.

## Overview

The integration revolves around three main stages: `discovery`, `bom-sign`, and `policy`. Each stage serves a specific purpose in enhancing the security of your software development lifecycle.

Reusable Jobs Can be pulled from the following [repository](https://github.com/scribe-public/gitlab_platforms.git).

### Quickstart

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

- [Discover GitLab Workflow](https://github.com/scribe-public/gitlab_platforms/blob/main/discover-gitlab.yml)
- [Discover Dockerhub Workflow](https://github.com/scribe-public/gitlab_platforms/blob/main/discover-dockerhub.yml)
- [Discover Kubernetes Workflow](https://github.com/scribe-public/gitlab_platforms/blob/main/discover-k8s.yml)
- [BOM Dockerhub Workflow](https://github.com/scribe-public/gitlab_platforms/blob/main/bom-dockerhub.yml)
- [BOM Kubernetes Workflow](https://github.com/scribe-public/gitlab_platforms/blob/main/bom-k8s.yml)
- [Policy GitLab Workflow](https://github.com/scribe-public/gitlab_platforms/blob/main/policy-gitlab.yml)
- [Policy Dockerhub Workflow](https://github.com/scribe-public/gitlab_platforms/blob/main/policy-dockerhub.yml)
- [Policy Kubernetes Workflow](https://github.com/scribe-public/gitlab_platforms/blob/main/policy-k8s.yml)

### Usage

<details>
<summary> Gitlab Platform Example </summary>

```yaml
variables:
  ####### PLATFORMS TOOL VERSION #######
  PLATFORMS_VERSION: "latest" # Platform APP Version
  SCRIBE_PRODUCT_VERSION: "v1.6"

  ####### VALINT GLOBAL VARIABLES #######
  VALINT_SCRIBE_AUTH_CLIENT_SECRET: $SCRIBE_CLIENT_TOKEN # Scribe Service Client Secret
  VALINT_SCRIBE_ENABLE: true
  VALINT_CONTEXT_TYPE: "gitlab"
  VALINT_DISABLE_EVIDENCE_CACHE: false

  ####### SIGNING/VERIFYING GLOBAL VARIABLES #######
  ATTEST_KEY_B64: $ATTEST_KEY_B64 # Evidence Signing Key
  ATTEST_CERT_B64: $ATTEST_CERT_B64 # Evidence Signing Cert
  ATTEST_CA_B64: $ATTEST_CA_B64 # Evidence Signing CA

  ######### DISCOVERY GITLAB VARIABLES #########
  GITLAB_TOKEN: $GITLAB_PAT_TOKEN 
  GITLAB_COMMIT_TIME_SCOPE: 90
  GITLAB_PIPELINE_TIME_SCOPE: 90

stages:
  - discovery
  - bom-sign
  - policy

include:
  # DISCOVERY
  - remote: https://raw.githubusercontent.com/scribe-public/gitlab_platforms/main/discover-gitlab.yml
    inputs:
      project-mapping: "*flask-monorepo-project::flask-monorepo-project::${SCRIBE_PRODUCT_VERSION} *dhs-vue-sample-proj::dhs-vue-sample-proj::${SCRIBE_PRODUCT_VERSION}"
      organization-mapping: "*::flask-monorepo-project::${SCRIBE_PRODUCT_VERSION} *::dhs-vue-sample-proj::${SCRIBE_PRODUCT_VERSION}"
      gitlab-token: ${GITLAB_TOKEN}
      scope-commit-days: ${GITLAB_COMMIT_TIME_SCOPE}
      scope-pipeline-days: ${GITLAB_PIPELINE_TIME_SCOPE}

  # POLICY
  - remote: https://raw.githubusercontent.com/scribe-public/gitlab_platforms/main/policy-gitlab.yml
    inputs:
       project-mapping: "*flask-monorepo-project::flask-monorepo-project::${SCRIBE_PRODUCT_VERSION} *dhs-vue-sample-proj::dhs-vue-sample-proj::${SCRIBE_PRODUCT_VERSION}"
      organization-mapping: "*::flask-monorepo-project::${SCRIBE_PRODUCT_VERSION} *::dhs-vue-sample-proj::${SCRIBE_PRODUCT_VERSION}"

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
<summary> Dockerhub Platform Example </summary>

```yaml
variables:
  ####### PLATFORMS TOOL VERSION #######
  PLATFORMS_VERSION: "latest" # Platform APP Version
  SCRIBE_PRODUCT_VERSION: "v1.6"

  ####### VALINT GLOBAL VARIABLES #######
  VALINT_SCRIBE_AUTH_CLIENT_SECRET: $SCRIBE_CLIENT_TOKEN # Scribe Service Client Secret
  VALINT_SCRIBE_ENABLE: true
  VALINT_CONTEXT_TYPE: "gitlab"
  VALINT_DISABLE_EVIDENCE_CACHE: false

  ####### SIGNING/VERIFYING GLOBAL VARIABLES #######
  ATTEST_KEY_B64: $ATTEST_KEY_B64 # Evidence Signing Key
  ATTEST_CERT_B64: $ATTEST_CERT_B64 # Evidence Signing Cert
  ATTEST_CA_B64: $ATTEST_CA_B64 # Evidence Signing CA
 
  ######### DISCOVERY DOCKERHUB VARIABLES #########
  DOCKERHUB_USERNAME: $DOCKERHUB_USERNAME
  DOCKERHUB_PASSWORD: $DOCKERHUB_PASSWORD_B64
  DOCKERHUB_TIME_SCOPE: 90

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
      namespace-mapping: "*::flask-monorepo-project::${SCRIBE_PRODUCT_VERSION} *::dhs-vue-sample-proj::${SCRIBE_PRODUCT_VERSION}"
      repository-mapping: "*service-*::flask-monorepo-project::${SCRIBE_PRODUCT_VERSION} *dhs*::dhs-vue-sample-proj::${SCRIBE_PRODUCT_VERSION}"
      username: ${DOCKERHUB_USERNAME}
      password-b64: ${DOCKERHUB_PASSWORD_B64}
      scope-days: ${DOCKERHUB_TIME_SCOPE}

  # BOM
  - remote: https://raw.githubusercontent.com/scribe-public/gitlab_platforms/main/bom-dockerhub.yml
    inputs:
      mapping: "*service-*::flask-monorepo-project::${SCRIBE_PRODUCT_VERSION} *dhs*::dhs-vue-sample-proj::${SCRIBE_PRODUCT_VERSION}"

  # POLICY
  - remote: https://raw.githubusercontent.com/scribe-public/gitlab_platforms/main/policy-dockerhub.yml
    inputs:
      image-mapping: "*service-*::flask-monorepo-project::${SCRIBE_PRODUCT_VERSION} *dhs*::dhs-vue-sample-proj::${SCRIBE_PRODUCT_VERSION}"

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
<summary> Kubernetes Platform Example </summary>

```yaml
variables:
  ####### PLATFORMS TOOL VERSION #######
  PLATFORMS_VERSION: "latest" # Platform APP Version
  SCRIBE_PRODUCT_VERSION: "v1.6"

  ####### VALINT GLOBAL VARIABLES #######
  VALINT_SCRIBE_AUTH_CLIENT_SECRET: $SCRIBE_CLIENT_TOKEN # Scribe Service Client Secret
  VALINT_SCRIBE_ENABLE: true
  VALINT_CONTEXT_TYPE: "gitlab"
  VALINT_DISABLE_EVIDENCE_CACHE: false

  ####### SIGNING/VERIFYING GLOBAL VARIABLES #######
  ATTEST_KEY_B64: $ATTEST_KEY_B64 # Evidence Signing Key
  ATTEST_CERT_B64: $ATTEST_CERT_B64 # Evidence Signing Cert
  ATTEST_CA_B64: $ATTEST_CA_B64 # Evidence Signing CA

  ######### DISCOVERY KUBERNETES VARIABLES #########
  K8S_TOKEN: $K8S_TEST_CLUSTER_TOKEN # K8s discovery token
  K8S_URL: https://my_cluster.com # K8s discovery URL
  
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
  - remote: https://raw.githubusercontent.com/scribe-public/gitlab_platforms/main/discover-k8s.yml
    inputs:
      namespace-mapping: "*default*::factory2::V.2"
      pod-mapping: "*::factory2::V.2"
      token: ${K8S_URL}
      url: ${K8S_TOKEN}

  # BOM
  - remote: https://raw.githubusercontent.com/scribe-public/gitlab_platforms/main/bom-k8s.yml
    inputs:
      mapping: "default::*service-*::*service-*::flask-monorepo-project::${SCRIBE_PRODUCT_VERSION}"

  # POLICY
  - remote: https://raw.githubusercontent.com/scribe-public/gitlab_platforms/main/policy-k8s.yml
    inputs:
      image-mapping: "default::*service-*::*service-*::flask-monorepo-project::${SCRIBE_PRODUCT_VERSION}"

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

## `discovery` Stage

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
| `discovery-dockerhub`     | Discovers artifacts in Dockerhub environment.| `DOCKERHUB_USERNAME`, `DOCKERHUB_PASSWORD_B64` |
| `discovery-k8s`           | Discovers artifacts in Kubernetes environment.| `K8S_TOKEN`, `K8S_URL` |

> We recommended to base64 encode Dockerhub Password to ensure they can be marked as protected and masked.

## `bom-sign` Stage

In the `bom-sign` stage, assets retrieved from the database are used to create SBOMs (Software Bill of Materials), which are then signed and uploaded to the Scribe Security Platform.

### Cache

- Database cache from the discovery stage is required.
- Evidence cache is recommended for policy evaluation.

### Jobs

| Job                       | Description                                |
|---------------------------|--------------------------------------------|
| `bom-sign-dockerhub`      | Creates and signs SBOMs for Dockerhub.     |
| `bom-sign-k8s`            | Creates and signs SBOMs for Kubernetes.    |

## `policy` Stage

The `policy` stage evaluates the security framework policy against signed evidence, generating SARIF reports that are subsequently signed and uploaded.

Our default policies can be reviewed and managed as code, for more details see our default [Policy As Code Bundle](https://github.com/scribe-public/sample-policies/tree/main/v1).

### Cache

- Database cache from the discovery stage is required.
- Evidence cache is recommended for improved performance.

### Jobs

| Job                       | Description                                |
|---------------------------|--------------------------------------------|
| `policy-gitlab`           | Evaluates policy against GitLab evidence.  |
| `policy-dockerhub`        | Evaluates policy against Dockerhub evidence. |
| `policy-k8s`              | Evaluates policy against Kubernetes evidence. |

The next chapters of this documentation provide a comprehensive guide to seamlessly integrating the Platforms Tool into your GitLab CI/CD pipeline, ensuring enhanced security throughout your development lifecycle.

## Using custom x509 keys

Utilizing X509 Keys for Platform Jobs

- Prepare the X509 key in PEM format, including the Certificate and CA-chain.

- Encode the keys using the commands below:

```yaml
cat my_key.pem | base64
cat my_cert.pem | base64
cat my_ca-chain.pem | base64
```

- Store The following Secrets as project variable using **[GitLab  project variable](https://docs.gitlab.com/ee/ci/variables/#add-a-cicd-variable-to-a-project)**.

<img src='../../../../img/ci/platforms_gitlab_keys.png' alt='Signing Variables'/>

- `ATTEST_KEY_B64` Base64 encoded x509 Private key pem content.
- `ATTEST_CERT_B64` - Base64 encoded x509 Cert pem content.
- `ATTEST_CA_B64` - Base64 encoded x509 CA Chain pem content

We recommended to base64 encode your PEM files to ensure they can be marked as protected and masked.

> Explore additional signing options in the [attestations](./attestations.md) section.

## Runner Considerations

When managing your GitLab CI/CD pipeline, it's essential to consider various factors related to your runner environment to ensure smooth operation and optimal performance. Here are some key considerations:

- **DIND Runner Space**: If you're using a Docker-in-Docker (DIND) runner, ensure that it has sufficient space to cache images pulled by the 'bom-sign' and 'policy' jobs. This cache is instrumental in reducing the time it takes to scan a large array of images.

- **Database Cache**: Database cache is required for all stages of your pipeline and must be shared across all stages. Each platform type (GitLab, Dockerhub, Kubernetes) may have its own database. It's essential to allocate adequate space for the database cache and monitor its usage regularly. If you remove the database cache, you must first run the 'discovery' stage to recreate it. Helper functions like 'cleanup-database-cache' can be used to remove the database cache when needed.

- **Evidence Cache**: While evidence cache is optional, it's recommended for improved performance. It can be shared across some or all stages of your pipeline. Evidence cache is created by any job using it, and evidence is pushed to it in all stages. If you remove the evidence cache, the required evidence will be pulled from the Scribe Security Platform. Helper functions like 'cleanup-evidence-cache' can be used to remove the evidence cache when needed.

### GitLab Cache API

In our examples, we utilize the GitLab Cache API to seamlessly share the database and evidence cache across stages. GitLab CI shares the Docker cache across jobs by default, simplifying cache management and optimizing resource utilization.

### Docker Cache

When using a DIND runner, ensure that you allocate sufficient space to store image caches when using 'bom-sign' and 'policy' for both Dockerhub and Kubernetes. You can utilize helper functions like 'cleanup-docker-cache' to remove the Docker cache and maintain optimal storage usage.

#### Automatic Cleanup

The Platforms Tool includes the ability to automate Docker cache cleanup by invoking `docker system prune -af` automatically. You can configure parameters such as `MONITOR_MOUNT`, `MONITOR_CLEAN_DOCKER`, and `MONITOR_THRESHOLD` to manage space usage effectively. If the space usage exceeds the threshold, the runner will automatically clean up the Docker cache, ensuring smooth operation of your CI/CD pipeline.

## Global Variables

Effortlessly configure global variables to tailor the integration to your specific requirements.

| Variable                         | Description                                                     |
|----------------------------------|-----------------------------------------------------------------|
| `PLATFORMS_VERSION`              | Version of the Platforms tool.                 |
| `VALINT_SCRIBE_AUTH_CLIENT_SECRET` | Scribe Service Client Secret.                                 |
| `VALINT_SCRIBE_ENABLE`           | Enable Scribe Service.                                          |
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

## Hosted Runner Setup

**Utilizing Gitlab's Hosted Runner for Platform Jobs**

When orchestrating jobs on the Platforms, Gitlab's Hosted Runner offers a convenient solution. Here's what you need to ensure for a smooth setup:

### 1. Pull Policy Configuration

- **Configuration Check:** Ensure that the `pull_policy` parameter in your job setup aligns with the permissions allowed by your runner's `allowed_pull_policies` configuration.

[Learn More](https://docs.gitlab.com/runner/executors/docker.html#allow-docker-pull-policies)

### 2. Docker-in-Docker (DIND) Setup

- **Certificate Mapping:** When employing Docker-in-Docker (DIND), make sure that communication certificates are correctly mapped to the runner.

[Explore Setup Details](https://docs.gitlab.com/ee/ci/docker/using_docker_build.html#docker-in-docker-with-tls-enabled-in-the-docker-executor)

### 3. Distributed Cache Requirement

- **Database Transfer:** A vital requirement involves transporting the database from the Discovery Stage to subsequent stages such as BOM and Policy. This necessitates a distributed cache setup.

[Refer Implementation Guide](https://docs.gitlab.com/runner/configuration/autoscale.html#distributed-runners-caching)

### 4. DNS Failure Issues

- **DNS Service:** To ensure proper DNS functionality for the runners, we recommend using the DNSCache DaemonSet.

[Using NodeLocal DNSCache in Kubernetes Clusters](https://kubernetes.io/docs/tasks/administer-cluster/nodelocaldns/)

### 5. Enabling `pull_policy`

- **Pull Strategy:** In our examples, we use the pull policy `always`, which requires adding it to the runners' allowed list.

[Set pull policy](https://docs.gitlab.com/runner/executors/kubernetes/#set-a-pull-policy)