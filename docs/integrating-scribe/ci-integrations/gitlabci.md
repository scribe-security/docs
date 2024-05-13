---
sidebar_label: "GitLab CI/CD"
title: GitLab CI/CD
sidebar_position: 3
---

Use the following instructions to integrate your GitLab pipelines with Scribe.

### 1. Obtain a Scribe Hub API Token
1. Sign in to [Scribe Hub](https://app.scribesecurity.com). If you don't have an account you can sign up for free [here](https://scribesecurity.com/scribe-platform-lp/ "Start Using Scribe For Free").

2. Create a API token in [Scribe Hub > Settings > Tokens](https://app.scribesecurity.com/settings/tokens). Copy it to a safe temporary notepad until you complete the integration.

:::note Important
The token is a secret and will not be accessible from the UI after you finalize the token generation. 
:::

### 2. Add the API token to GitLab secrets

Set your Scribe Hub API token in GitLab with a key named SCRIBE_TOKEN as instructed in [GitLab project variables](https://docs.gitlab.com/ee/ci/variables/#define-a-cicd-variable-in-the-ui)

### 3. Install Scribe CLI

**Valint** (Scribe CLI) is required to generate evidence in such as SBOMs and SLSA provenance. 
Install Valint on your build runner with the following command:
```
sh 'curl -sSfL https://get.scribesecurity.com/install.sh | sh -s -- -b ./temp/bin'
```
Alternatively, add an instalation stage at the beginning of your relevant builds as follows:
```yaml
before_script:
  - apt update
  - apt install git curl -y
  - curl -sSfL https://get.scribesecurity.com/install.sh | sh -s -- -b /usr/local/bin
```
### 4. Instrument your build scripts

#### Usage
```yaml
image: ubuntu:latest
before_script:
  - apt update
  - apt install git curl -y
  - curl -sSfL https://get.scribesecurity.com/install.sh | sh -s -- -b /usr/local/bin

stages:
    - scribe-gitlab-stage

scribe-gitlab-job:
    stage: scribe-gitlab-stage
    script:
      - valint [bom,slsa,evidence] [target]
          -o [attest, statement]
          --context-type gitlab
          --output-directory ./scribe/valint
          -E -P $SCRIBE_CLIENT_SECRET

      - valint verify [target]
          -i [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic]
          --context-type gitlab
          --output-directory ./scribe/valint
          -E -P $SCRIBE_CLIENT_SECRET
```
#### Basic example

```yaml
before_script:
  - apt update
  - apt install git curl -y
  - curl -sSfL https://get.scribesecurity.com/install.sh | sh -s -- -b /usr/local/bin

stages:
    - scribe-gitlab-job

scribe-gitlab-job:
    stage: scribe-gitlab-job
    script:
      - valint bom busybox:latest
          --context-type gitlab
          --output-directory ./scribe/valint
          -E -P $SCRIBE_TOKEN
```
#### Additional examples
<details>
  <summary> Generate an SBOM for an image in a public registry </summary>

```YAML
- valint bom busybox
      --context-type gitlab
      --output-directory ./scribe/valint
``` 

</details>

<details>
  <summary> Add NTIA metadata to SBOM </summary>

```YAML
image: docker:latest

services:
  - docker:dind

stages:
    - custom-ntia-metadata-stage

custom-ntia-metadata:
    stage: custom-ntia-metadata-stage
    script:
      - valint bom busybox
            --context-type gitlab
            --output-directory ./scribe/valint
```
</details>

<details>
  <summary> Generate SLSA provenance for an image in a public registry </summary>

```YAML

- valint slsa busybox
      --context-type gitlab
      --output-directory ./scribe/valint
``` 

</details>

<details>
  <summary> Generate an SBOM for for an image built with local docker </summary>

```YAML
- valint bom image_name:latest
      --context-type gitlab
      --output-directory ./scribe/valint
``` 
</details>

<details>
  <summary> Generate SLSA provenance for for an image built with local docker </summary>

```YAML
- valint slsa image_name:latest
      --context-type gitlab
      --output-directory ./scribe/valint
``` 
</details>

<details>
  <summary>  Generate an SBOM for an image in a private  registry </summary>

> Before the following task add a `docker login` task 

```YAML
- valint bom scribesecurity.jfrog.io/scribe-docker-local/example:latest \
      --context-type gitlab \
      --output-directory ./scribe/valint \
```
</details>

<details>
  <summary> Generate SLSA provenance for an image in a private registry </summary>

> Before the following task add a `docker login` task 

```YAML
- valint slsa scribesecurity.jfrog.io/scribe-docker-local/example:latest \
      --context-type gitlab \
      --output-directory ./scribe/valint \
```
</details>

<details>
  <summary>  Add custom metadata to SBOM </summary>

```YAML
valint_image_job:
  variables:
    test_env: "test_env_value"
  script:
    - valint bom busybox:latest
      --context-type gitlab
      --output-directory ./scribe/valint
      --env test_env
      --label test_label
```
</details>

<details>
  <summary>  Add custom metadata to SLSA provenance </summary>

```YAML
valint_image_job:
  variables:
    test_env: "test_env_value"
  script:
    - valint slsa busybox:latest
      --context-type gitlab
      --output-directory ./scribe/valint
      --env test_env
      --label test_label
```
</details>


<details>
  <summary> Export SBOM as an artifact </summary>

> Use `format` input argumnet to set the format.

```YAML
save-artifact-job:
  script:
    - valint bom busybox:latest
      --context-type gitlab
      --output-directory ./scribe/valint
      --output-file ./my_sbom.json
  artifacts:
      paths:
        - ./scribe/valint
        - ./my_sbom.json
```

</details>

<details>
  <summary> Export SLSA provenance as an artifact </summary>

Using command `output-directory` or `output-file` to export evidence as an artifact.

> Use `--format`, `-o` to select between the format.

```YAML
save-artifact-job:
  script:
    - valint slsa busybox:latest
      --context-type gitlab
      --output-directory ./scribe/valint
      --output-file ./my_slsa.json

  artifacts:
      paths:
        - ./scribe/valint
        - ./my_slsa.json
```

</details>

<details>
  <summary> Generate an SBOM for 'docker save' </summary>

> Use `oci-archive` target type when creating a OCI archive (`podman save`).

```YAML
before_script:
  - apk update
  - apk add curl
  - curl -sSfL https://get.scribesecurity.com/install.sh | sh -s -- -b /usr/local/bin

valint-docker-job:
    tags: [ saas-linux-large-amd64 ]
    stage: valint-docker-job
    image: docker:latest
    variables:
      DOCKER_DRIVER: overlay2
      DOCKER_TLS_CERTDIR: "/certs"
    services:
      - docker:dind
    script:
      - docker pull busybox:latest
      - docker save -o busybox.tar busybox:latest
      - valint bom docker-archive:busybox.tar
          --context-type gitlab
          --output-directory ./scribe/valint
          --output-file ./busybox.json
``` 
</details>

<details>
  <summary> Generate SLSA provenance for 'docker save' </summary>

> Use `oci-archive` target type when creating a OCI archive (`podman save`).

```YAML
before_script:
  - apk update
  - apk add curl
  - curl -sSfL https://get.scribesecurity.com/install.sh | sh -s -- -b /usr/local/bin

valint-docker-job:
    tags: [ saas-linux-large-amd64 ]
    stage: valint-docker-job
    image: docker:latest
    variables:
      DOCKER_DRIVER: overlay2
      DOCKER_TLS_CERTDIR: "/certs"
    services:
      - docker:dind
    script:
      - docker pull busybox:latest
      - docker save -o busybox.tar busybox:latest
      - valint slsa docker-archive:busybox.tar
          --context-type gitlab
          --output-directory ./scribe/valint
          --output-file ./busybox.json
``` 
</details>

<details>
  <summary> Generate an SBOM for a local directory </summary>


```YAML
dir-sbom-job:
  script:
    - mkdir testdir
    - echo "test" > testdir/test.txt
    - valint bom dir:testdir
          --context-type gitlab
          --output-directory ./scribe/valint
``` 
</details>

<details>
  <summary> Generate SLSA provenance for a local directory </summary>

```YAML
dir-sbom-job:
  script:
    - mkdir testdir
    - echo "test" > testdir/test.txt
    - valint slsa dir:testdir
          --context-type gitlab
          --output-directory ./scribe/valint
``` 
</details>


<details>
  <summary> Generate an SBOM for a remote git repository </summary>

```YAML
git-remote-job:
  script:
    - valint bom git:https://github.com/mongo-express/mongo-express.git
          --context-type gitlab
          --output-directory ./scribe/valint

``` 

**Note** If you use implicit checkout, **[git-strategy](https://docs.gitlab.com/ee/ci/runners/configure_runners.html#git-strategy)** affects the commits collected into the SBOM.

```YAML
git-remote-job:
  script:
    - valint bom .
          --context-type gitlab
          --output-directory ./scribe/valint
``` 
</details>

<details>
  <summary> Generate SLSA provenance for a git repo </summary>

<p>For a remote git repo:</p>

```YAML
git-remote-job:
  script:
    - valint slsa git:https://github.com/mongo-express/mongo-express.git
          --context-type gitlab
          --output-directory ./scribe/valint
``` 

<p>For a local git repo:</p>

```YAML
git-remote-job:
  script:
    - valint slsa .
          --context-type gitlab
          --output-directory ./scribe/valint
``` 
</details>
