---
title: GitLab CI
sidebar_position: 4
---

# Gitlab CI
Scribe support evidence collecting and integrity verification for GitLab CI.

Integrations provides several options enabling generation of SBOMs from various sources.
The usage examples on this page demonstrate several use cases of SBOM collection (SBOM from a publicly available Docker image, SBOM from a Git repository,
SBOM from a local directory) as well as several use cases of uploading the evidence either to the Gitliab CI workflows or to the Scribe Service.


## Installation
Install the Scribe `valint` CLI tool:
```yaml
before_script:
  - apt update
  - apt install git curl -y
  - curl -sSfL http://get.scribesecurity.com/install.sh | sh -s -- -b /usr/local/bin```
```

### Usage
```yaml
before_script:
  - apt update
  - apt install git curl -y
  - curl -sSfL http://get.scribesecurity.com/install.sh | sh -s -- -b /usr/local/bin

stages:
    - scribe-gitlab-job

scribe-gitlab-job:
    stage: scribe-gitlab-job
    script:
      - valint bom busybox:latest 
          --context-type gitlab
          --vv
```

## Before you begin
Integrating Scribe Hub with Gitlab requires the following credentials that are found in the product setup dialog (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **Home>Products>[$product]>Setup**)

* **Product Key**
* **Client ID**
* **Client Secret**

> Note that the product key is unique per product, while the client ID and secret are unique for your account.

## Scribe service integration
Scribe provides a set of services to store, verify and manage the supply chain integrity. <br />
Following are some integration examples.

## Procedure

* Store credentials using [GitLab  project variable](https://docs.gitlab.com/ee/ci/variables/#add-a-cicd-variable-to-a-project) 

* Open your GitLab project and make sure you have a yaml file named `.gitlab-ci.yml`

* Install `valint` tool using the following command
```bash
curl -sSfL http://get.scribesecurity.com/install.sh | sh -s -- -b /usr/local/bin
```

As an example update it to contain the following steps:

```yaml
image: ubuntu:latest
before_script:
  - apt update
  - apt install git curl -y
  - curl -sSfL http://get.scribesecurity.com/install.sh | sh -s -- -b /usr/local/bin

stages:
    - scribe-gitlab-simple-test

scribe-gitlab-job:
    stage: scribe-gitlab-job
    script:
      - valint bom busybox:latest 
          --context-type gitlab
          --product-key $PRODUCT_KEY
          -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET
          --vv -f
```

> Use `gitlab` as context-type.

<details>
  <summary>  Scribe integrity </summary>

Full workflow example of a workflow, upload evidence on source and image to Scribe. <br />
Verifying the  target integrity on Scribe.

  ```yaml
  image: ubuntu:latest
  before_script:
    - apt update
    - apt install git curl -y
    - curl -sSfL http://get.scribesecurity.com/install.sh | sh -s -- -b /usr/local/bin

  stages:
      - scribe-gitlab-job

  scribe-gitlab-job:
      tags: [ saas-linux-large-amd64 ]
      stage: scribe-gitlab-job
      script:
        - git clone -b v1.0.0-alpha.4 --single-branch https://github.com/mongo-express/mongo-express.git mongo-express-scm
        - valint bom dir:mongo-express-scm
              --context-type gitlab
              --output-directory ./scribe/valint
              --product-key $PRODUCT_KEY
              -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET
              -vv
        - valint bom mongo-express:1.0.0-alpha.4
              --context-type gitlab
              --output-directory ./scribe/valint
              --product-key $PRODUCT_KEY
              -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET
              -vv
  ```
</details>

## Basic examples
<details>
  <summary>  Public registry image (SBOM) </summary>

Create SBOM for remote `busybox:latest` image.

```YAML
- valint bom busybox
      --context-type gitlab
      --output-directory ./scribe/valint
      -vv -f
``` 

</details>

<details>
  <summary>  Docker built image (SBOM) </summary>

Create SBOM for image built by local docker `image_name:latest` image.

```YAML
- valint bom image_name:latest
      --context-type gitlab
      --output-directory ./scribe/valint
      -vv -f
``` 
</details>

<details>
  <summary>  Private registry image (SBOM) </summary>

Create SBOM for image hosted on private registry.

> Use `docker login` to add access.

```YAML
- valint bom scribesecuriy.jfrog.io/scribe-docker-local/stub_remote:latest \
      --context-type gitlab \
      --output-directory ./scribe/valint \
      -vv -f
```
</details>

<details>
  <summary>  Custom metadata (SBOM) </summary>

Custom metadata added to SBOM.

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
      -vv -f
```
</details>


<details>
  <summary> Save as artifact (SBOM, SLSA) </summary>

Using command `output-directory` or `output-file` to export evidence as an artifact.

> Use `--format`, `-o` to select between the format.

```YAML
save-artifact-job:
  script:
    - valint bom busybox:latest
      --context-type gitlab
      --output-directory ./scribe/valint
      --output-file ./my_sbom.json
      -vv -f
  artifacts:
      paths:
        - ./scribe/valint
        - ./my_sbom.json
```

</details>

<details>
  <summary> Archive image (SBOM) </summary>

Create SBOM for local `docker save` output.

> Use `oci-archive` target type when creating a OCI archive (`podman save`).

```YAML
before_script:
  - apk update
  - apk add curl
  - curl -sSfL http://get.scribesecurity.com/install.sh | sh -s -- -b /usr/local/bin

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
          -vv -f
``` 
</details>

<details>
  <summary> Directory target (SBOM) </summary>

Create SBOM for a local directory.

```YAML
dir-sbom-job:
  script:
    - mkdir testdir
    - echo "test" > testdir/test.txt
    - valint bom dir:testdir
          --context-type gitlab
          --output-directory ./scribe/valint
          -vv -f
``` 
</details>


<details>
  <summary> Git target (SBOM) </summary>

Create SBOM for `mongo-express` remote git repository.

```YAML
git-remote-job:
  script:
    - valint bom git:https://github.com/mongo-express/mongo-express.git
          --context-type gitlab
          --output-directory ./scribe/valint
          -vv -f

``` 

Create SBOM for local git repository. <br />

> When using implicit checkout note the Gitlab-CI [git-strategy](https://docs.gitlab.com/ee/ci/runners/configure_runners.html#git-strategy) will effect the commits collected by the SBOM.

```YAML
git-remote-job:
  script:
    - valint bom .
          --context-type gitlab
          --output-directory ./scribe/valint
          -vv -f
``` 
</details>

## Resources

[Gitlab CI Jobs Page](https://docs.gitlab.com/ee/ci/) - Github CI docs.
