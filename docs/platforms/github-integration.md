---
sidebar_label: "Platforms Github Integration"
title: Scribe Platforms CLI Action
sidebar_position: 2
toc_min_heading_level: 2
toc_max_heading_level: 5
---

Scribe offers the use of GitHub Actions to enable the embedding of evidence collection and integrity validation into your pipeline as a way to help secure your software supply chain.

Further documentation **[Platforms integration](../../../platforms/overview)**.

### Input arguments
```yaml
  command:
    description: Command to run
    required: true
  valint_args:
    description: Valint args
  sign:
    description: Sign evidence
  platform:
    description: Select Platform
    required: true
  args:
    description: "Additional arguments to pass to Platforms"
  log-level:
    description: Log verbosity level {DEBUG,INFO,WARNING,ERROR,CRITICAL}
  log-file:
    description: Log file path
  config:
    description: Path to a configuration file
  print-config:
    description: Print the configuration after applying all other arguments and exit
  db-local-path:
    description: Local db path
```

### Usage
```yaml
- name: Discover k8s assets
  uses: scribe-security/action-platforms@master
  with:
    cmd: [discover, evidence, bom, verify]
    platform: [k8s, dockerhub, gitlab, github]
```

## Setting Secret Flags

Platforms CLI supports passing secrets as environment variables:

- `ATTEST_KEY`, `ATTEST_CERT`, `ATTEST_CA`: Set evidence signing.
- `VALINT_SCRIBE_AUTH_CLIENT_SECRET`: Set Scribe Client Secret.
- `VALINT_SCRIBE_ENABLE`: Enable Scribe service.
- `VALINT_OUTPUT_DIRECTORY`: Set evidence local cache directory.
- `PLATFORMS_DB_PATH`: Set platforms database path.
- `GITHUB_TOKEN`: Set GitHub discovery access.
- `DOCKERHUB_USERNAME`, `DOCKERHUB_PASSWORD`: Set DockerHub discovery access.
- `K8S_URL`, `K8S_TOKEN`: Set Kubernetes discovery access.
- `GITLAB_TOKEN`: Set GitLab discovery access.

<details>
<summary> Github Platform Example </summary>

```yaml
on:
  workflow_dispatch:

concurrency: 
  group: github-ci-${{ github.ref }}
  cancel-in-progress: true

env:
  PLATFORMS_VERSION: "latest"
  K8S_URL: https://my_cluster.com # K8s discovery URL
  K8S_TOKEN: ${{ secrets.INTEGRATION_K8S_TOKEN }}
  LOG_LEVEL: "INFO"
  VALINT_SCRIBE_ENABLE: true 
  DOCKER_DRIVER: overlay2
  DOCKERHUB_USERNAME: scribesecurity
  DEBUG: false
  SCRIBE_PRODUCT_VERSION: "v0.0.2-github"

jobs:
  discovery_github:
    runs-on: ubuntu-latest
    env:
      ATTEST_KEY: ${{ secrets.ATTEST_KEY }}
      ATTEST_CERT: ${{ secrets.ATTEST_CERT }}
      ATTEST_CA: ${{ secrets.ATTEST_CA }}
      GITHUB_TOKEN: ${{ secrets.GH_PAT_TOKEN }}
      VALINT_OUTPUT_DIRECTORY: evidence/github
      VALINT_SCRIBE_AUTH_CLIENT_SECRET: ${{ secrets.SCRIBE_SECRET }}
      PLATFORMS_DB_PATH: github.platforms.db
    steps:
      - name: Cache Github DB
        uses: actions/cache@v4
        with:
          path: github.platforms.db
          key: github-platforms-db-${{ hashFiles('github.platforms.db') }}
          restore-keys: |
            github-platforms-db-
            github-platforms-db

      - name: Discovery Github
        uses: scribe-security/action-platforms@dev
        with:
          command: discover
          platform: github
          args: 
            --scope.organization=scribe-security
            --scope.repository=*mongo*
            --workflow.skip --commit.skip --scope.branch=main
            
      - name: Evidence Github
        uses: scribe-security/action-platforms@dev
        with:
          command: evidence
          sign: true
          platform: github
          args: --organization.mapping=scribe-security::scribe-training-vue-project::${{ env.SCRIBE_PRODUCT_VERSION }} --repository.mapping=Scribe-Security*scribe-training-vue-project::scribe-training-vue-project::${{ env.SCRIBE_PRODUCT_VERSION }}

      - name: Upload DB artifact
        uses: actions/upload-artifact@v4
        with:
          name: ${{ env.PLATFORMS_DB_PATH }}
          path: ${{ env.PLATFORMS_DB_PATH }}
```

</details>

<details>
<summary> Kubernetes Platform Example </summary>

```yaml
on:
  workflow_dispatch:

concurrency: 
  group: github-ci-${{ github.ref }}
  cancel-in-progress: true

env:
  PLATFORMS_VERSION: "latest"
  K8S_URL: https://my_cluster.com # K8s discovery URL
  K8S_TOKEN: ${{ secrets.INTEGRATION_K8S_TOKEN }}
  LOG_LEVEL: "INFO"
  VALINT_SCRIBE_ENABLE: true 
  DOCKER_DRIVER: overlay2
  DOCKERHUB_USERNAME: scribesecurity
  DEBUG: false
  SCRIBE_PRODUCT_VERSION: "v0.0.2-github"

jobs:
  discovery_dockerhub:
    runs-on: ubuntu-latest
    env:
      ATTEST_KEY: ${{ secrets.ATTEST_KEY }}
      ATTEST_CERT: ${{ secrets.ATTEST_CERT }}
      ATTEST_CA: ${{ secrets.ATTEST_CA }}
      DOCKERHUB_PASSWORD: ${{ secrets.DOCKERHUB_PASSWORD }}
      VALINT_OUTPUT_DIRECTORY: evidence/dockerhub
      VALINT_SCRIBE_AUTH_CLIENT_SECRET: ${{ secrets.SCRIBE_SECRET }}
      PLATFORMS_DB_PATH: dockerhub.platforms.db
    steps:

        - name: Discovery Dockerhub
          uses: scribe-security/action-platforms@dev
          with:
            command: discover
            platform: dockerhub
            args: --scope.past_days=60
  
        - name: Evidence Dockerhub
          uses: scribe-security/action-platforms@dev
          with:
            command: evidence
            sign: true
            platform: dockerhub
            args: |
              --namespace.mapping
                *::flask-monorepo-project::${{ env.SCRIBE_PRODUCT_VERSION }}
                *::dhs-vue-sample-proj::${{ env.SCRIBE_PRODUCT_VERSION}}
              --repository.mapping
                *service-*::flask-monorepo-project::${{ env.SCRIBE_PRODUCT_VERSION }}
                *dhs*::dhs-vue-sample-proj::${{ env.SCRIBE_PRODUCT_VERSION }}

        - name: Upload DB artifact
          uses: actions/upload-artifact@v4
          with:
            name: ${{ env.PLATFORMS_DB_PATH }}
            path: ${{ env.PLATFORMS_DB_PATH }}


  bom_sign_dockerhub:
    runs-on: ubuntu-latest
    needs: [discovery_dockerhub]
    env:
      ATTEST_KEY: ${{ secrets.ATTEST_KEY }}
      ATTEST_CERT: ${{ secrets.ATTEST_CERT }}
      ATTEST_CA: ${{ secrets.ATTEST_CA }}
      VALINT_OUTPUT_DIRECTORY: evidence/dockerhub
      VALINT_SCRIBE_AUTH_CLIENT_SECRET: ${{ secrets.SCRIBE_SECRET }}
      PLATFORMS_DB_PATH: dockerhub.platforms.db
    steps:
        - name: Download DB artifact
          uses: actions/download-artifact@v4
          with:
            name: ${{ env.PLATFORMS_DB_PATH }}

        - name: Cache Dockerhub Evidence
          uses: actions/cache@v4
          with:
            path: evidence/dockerhub
            key: evidence-dockerhub-${{ hashFiles('evidence/dockerhub/cache.json') }}
            restore-keys: |
              evidence-dockerhub-
              evidence-dockerhub

        - name: BOM Dockerhub
          uses: scribe-security/action-platforms@dev
          with:
            command: bom
            platform: dockerhub
            valint_args: --allow-failures
            sign: true
            args: >-
              --image.mapping
                *service-*::flask-monorepo-project::${{ env.SCRIBE_PRODUCT_VERSION }}
                *dhs*::dhs-vue-sample-proj::${{ env.SCRIBE_PRODUCT_VERSION }}


  policy_dockerhub:
    runs-on: ubuntu-latest
    needs: [bom_sign_dockerhub]
    env:
      ATTEST_KEY: ${{ secrets.ATTEST_KEY }}
      ATTEST_CERT: ${{ secrets.ATTEST_CERT }}
      ATTEST_CA: ${{ secrets.ATTEST_CA }}
      VALINT_OUTPUT_DIRECTORY: evidence/dockerhub
      VALINT_SCRIBE_AUTH_CLIENT_SECRET: ${{ secrets.SCRIBE_SECRET }}
      PLATFORMS_DB_PATH: dockerhub.platforms.db
    steps:

        - name: Download DB artifact
          uses: actions/download-artifact@v4
          with:
            name: ${{ env.PLATFORMS_DB_PATH }}
  
        - name: Cache Dockerhub Evidence
          uses: actions/cache@v4
          with:
            path: evidence/dockerhub
            key: evidence-dockerhub

        - name: Policy Dockerhub
          uses: scribe-security/action-platforms@dev
          with:
            command: verify
            platform: dockerhub
            valint_args: --valint.git-branch main
            sign: true
            args: >-
              --image.mapping
                *service-*::flask-monorepo-project::${{ env.SCRIBE_PRODUCT_VERSION }}
                *dhs*::dhs-vue-sample-proj::${{ env.SCRIBE_PRODUCT_VERSION }}
```

</details>

<details>
<summary> Dockerhub Platform Example </summary>

```yaml
on:
  workflow_dispatch:

concurrency: 
  group: github-ci-${{ github.ref }}
  cancel-in-progress: true

env:
  PLATFORMS_VERSION: "latest"
  K8S_URL: https://my_cluster.com # K8s discovery URL
  K8S_TOKEN: ${{ secrets.INTEGRATION_K8S_TOKEN }}
  LOG_LEVEL: "INFO"
  VALINT_SCRIBE_ENABLE: true 
  DOCKER_DRIVER: overlay2
  DOCKERHUB_USERNAME: scribesecurity
  DEBUG: false
  SCRIBE_PRODUCT_VERSION: "v0.0.2-github"

jobs:
  discovery_k8s:
    runs-on: ubuntu-latest
    env:
      ATTEST_KEY: ${{ secrets.ATTEST_KEY }}
      ATTEST_CERT: ${{ secrets.ATTEST_CERT }}
      ATTEST_CA: ${{ secrets.ATTEST_CA }}
      K8S_TOKEN: ${{ secrets.INTEGRATION_K8S_TOKEN }}
      VALINT_OUTPUT_DIRECTORY: evidence/k8s
      VALINT_SCRIBE_AUTH_CLIENT_SECRET: ${{ secrets.SCRIBE_SECRET }}
      PLATFORMS_DB_PATH: k8s.platforms.db
    steps:
        - name: Discover K8S
          uses: scribe-security/action-platforms@dev
          with:
            command: discover
            platform: k8s

        - name: Evidence K8S
          uses: scribe-security/action-platforms@dev
          with:
            command: evidence
            sign: true
            platform: k8s
            args:
              --namespace.mapping=default::flask-monorepo-project::${{ env.SCRIBE_PRODUCT_VERSION }} default::dhs-vue-sample-proj::${{ env.SCRIBE_PRODUCT_VERSION }}
              --pod.mapping='*service-*::flask-monorepo-project::${{ env.SCRIBE_PRODUCT_VERSION }} *dhs*::dhs-vue-sample-proj::${{ env.SCRIBE_PRODUCT_VERSION}}'
          env:
            VALINT_OUTPUT_DIRECTORY: ${{ env.VALINT_OUTPUT_DIRECTORY }}

        - name: Upload DB artifact
          uses: actions/upload-artifact@v4
          with:
            name: ${{ env.PLATFORMS_DB_PATH }}
            path: ${{ env.PLATFORMS_DB_PATH }}


              
  bom_sign_k8s:
    runs-on: ubuntu-latest
    needs: [discovery_k8s]
    env:
      ATTEST_KEY: ${{ secrets.ATTEST_KEY }}
      ATTEST_CERT: ${{ secrets.ATTEST_CERT }}
      ATTEST_CA: ${{ secrets.ATTEST_CA }}
      VALINT_OUTPUT_DIRECTORY: evidence/k8s
      VALINT_SCRIBE_AUTH_CLIENT_SECRET: ${{ secrets.SCRIBE_SECRET }}
      PLATFORMS_DB_PATH: k8s.platforms.db
    steps:

        - name: Download DB artifact
          uses: actions/download-artifact@v4
          with:
            name: ${{ env.PLATFORMS_DB_PATH }}
            
        - name: Cache K8S Evidence
          uses: actions/cache@v4
          with:
            path: evidence/k8s
            key: evidence-k8s

        - name: BOM K8s
          uses: scribe-security/action-platforms@dev
          with:
            command: bom
            platform: k8s
            valint_args: --allow-failures
            sign: true
            args: >-
              --ignore-state
              --image.mapping
                default::*service-*::*service-*::flask-monorepo-project::${{ env.SCRIBE_PRODUCT_VERSION }}


  policy_k8s:
    runs-on: ubuntu-latest
    needs: [bom_sign_k8s]
    env:
      ATTEST_KEY: ${{ secrets.ATTEST_KEY }}
      ATTEST_CERT: ${{ secrets.ATTEST_CERT }}
      ATTEST_CA: ${{ secrets.ATTEST_CA }}
      VALINT_OUTPUT_DIRECTORY: evidence/k8s
      VALINT_SCRIBE_AUTH_CLIENT_SECRET: ${{ secrets.SCRIBE_SECRET }}
      PLATFORMS_DB_PATH: k8s.platforms.db
    steps:

        - name: Download DB artifact
          uses: actions/download-artifact@v4
          with:
            name: ${{ env.PLATFORMS_DB_PATH }}

        - name: Cache K8S Evidence
          uses: actions/cache@v4
          with:
            path: evidence/k8s
            key: evidence-k8s-${{ hashFiles('evidence/k8s/cache.json') }}
            restore-keys: |
              evidence-k8s-
              evidence-k8s

        - name: Policy K8s
          uses: scribe-security/action-platforms@dev
          with:
            command: verify
            platform: k8s
            valint_args: --allow-failures
            sign: true
            args: >-
              --ignore-state
              --image.mapping
                default::*service-*::*service-*::flask-monorepo-project::${{ env.SCRIBE_PRODUCT_VERSION }}
```

</details>

## .gitignore
It's recommended to add output directory value to your .gitignore file.
By default add `**/scribe` to your `.gitignore`.