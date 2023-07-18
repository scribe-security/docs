---
sidebar_label: "GitLab CI/CD"
title: GitLab CI/CD
sidebar_position: 3
---

Scribe support evidence collecting and integrity verification for GitLab CI/CD.

Integrations provides several options enabling generation of SBOMs from various sources.
The usage examples on this page demonstrate several use cases of SBOM collection (SBOM from a publicly available Docker image, SBOM from a Git repository, SBOM from a local directory) as well as several use cases of uploading the evidence either to the GitLab CI/CD workflows or to the Scribe Service.


### Installation
Install the Scribe `valint` CLI tool:
```yaml
before_script:
  - apt update
  - apt install git curl -y
  - curl -sSfL https://get.scribesecurity.com/install.sh | sh -s -- -b /usr/local/bin
```

### Usage
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
          -f
```

### Target types - `[target]`
---
Target types are types of artifacts produced and consumed by your supply chain.
Using supported targets, you can collect evidence and verify compliance on a range of artifacts.

> Fields specified as [target] support the following format.

### Format

`[scheme]:[name]:[tag]` 

| Sources | target-type | scheme | Description | example
| --- | --- | --- | --- | --- |
| Docker Daemon | image | docker | use the Docker daemon | docker:busybox:latest |
| OCI registry | image | registry | use the docker registry directly | registry:busybox:latest |
| Docker archive | image | docker-archive | use a tarball from disk for archives created from "docker save" | image | docker-archive:path/to/yourimage.tar |
| OCI archive | image | oci-archive | tarball from disk for OCI archives | oci-archive:path/to/yourimage.tar |
| Remote git | git| git | remote repository git | git:https://github.com/yourrepository.git |
| Local git | git | git | local repository git | git:path/to/yourrepository | 
| Directory | dir | dir | directory path on disk | dir:path/to/yourproject | 
| File | file | file | file path on disk | file:path/to/yourproject/file | 

### Evidence Stores
Each storer can be used to store, find and download evidence, unifying all the supply chain evidence into a system is an important part to be able to query any subset for policy validation.

| Type  | Description | requirement |
| --- | --- | --- |
| scribe | Evidence is stored on scribe service | scribe credentials |
| OCI | Evidence is stored on a remote OCI registry | access to a OCI registry |

### Scribe Evidence store
Scribe evidence store allows you store evidence using scribe Service.

Related Flags:
> Note the flag set:
>* `-U`, `--scribe.client-id`
>* `-P`, `--scribe.client-secret`
>* `-E`, `--scribe.enable`

### Before you begin
Integrating Scribe Hub with your environment requires the following credentials that are found in the **Integrations** page. (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **integrations**)

* **Client ID**
* **Client Secret**

<img src='../../../../img/ci/integrations-secrets.jpg' alt='Scribe Integration Secrets' width='70%' min-width='400px'/>

* Store credentials using [GitLab  project variable](https://docs.gitlab.com/ee/ci/variables/#add-a-cicd-variable-to-a-project) 

* Open your GitLab project and make sure you have a yaml file named `.gitlab-ci.yml`

* Install `valint` tool using the following command
```bash
curl -sSfL https://get.scribesecurity.com/install.sh | sh -s -- -b /usr/local/bin
```

### Usage
```yaml
image: ubuntu:latest
before_script:
  - apt update
  - apt install git curl -y
  - curl -sSfL https://get.scribesecurity.com/install.sh | sh -s -- -b /usr/local/bin

variables:
  LOGICAL_APP_NAME: demo-project # The app name all these SBOMs will be assosiated with
  APP_VERSION: 1.0.1 # The app version all these SBOMs will be assosiated with
  # SBOM Author meta data - Optional
  AUTHOR_NAME: John-Smith 
  AUTHOR_EMAIL: jhon@thiscompany.com 
  AUTHOR_PHONE: 555-8426157 
  # SBOM Supplier meta data - Optional
  SUPPLIER_NAME: Scribe-Security 
  SUPPLIER_URL: www.scribesecurity.com 
  SUPPLIER_EMAIL: info@scribesecurity.com
  SUPPLIER_PHONE: 001-001-0011  

stages:
    - scribe-gitlab-stage

scribe-gitlab-job:
    stage: scribe-gitlab-stage
    script:
      - valint bom [target]
          -o [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic]
          --context-type gitlab
          --output-directory ./scribe/valint
          -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET
          --app-name $LOGICAL_APP_NAME --app-version $APP_VERSION 
          --author-name $AUTHOR_NAME --author-email AUTHOR_EMAIL --author-phone $AUTHOR_PHONE 
          --supplier-name $SUPPLIER_NAME --supplier-url $SUPPLIER_URL --supplier-email $SUPPLIER_EMAIL 
          --supplier-phone $SUPPLIER_PHONE 
          -f

      - valint verify [target]
          -i [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic]
          --context-type gitlab
          --output-directory ./scribe/valint
          -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET
          --app-name $LOGICAL_APP_NAME --app-version $APP_VERSION 
          --author-name $AUTHOR_NAME --author-email AUTHOR_EMAIL --author-phone $AUTHOR_PHONE 
          --supplier-name $SUPPLIER_NAME --supplier-url $SUPPLIER_URL --supplier-email $SUPPLIER_EMAIL 
          --supplier-phone $SUPPLIER_PHONE
```

> Use `gitlab` as context-type.

### OCI Evidence store
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
For example, using `docker login` command or [DOCKER_AUTH_CONFIG field](https://docs.gitlab.com/ee/ci/docker/using_docker_images.html#define-an-image-from-a-private-container-registry).

### Usage
```yaml
image: docker:latest
variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"

services:
  - docker:dind

before_script:
  - apt update
  - apt install git curl -y
  - curl -sSfL https://get.scribesecurity.com/install.sh | sh -s -- -b /usr/local/bin
  - echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin [my_registry]

stages:
    - scribe-gitlab-oci-stage

scribe-gitlab-job:
    stage: scribe-gitlab-oci-stage
    script:
      - echo $CI_REGISTRY_PASSWORD | docker login -u $CI_REGISTRY_USER $CI_REGISTRY --password-stdin

      - valint bom [target]
          -o [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic]
          --context-type gitlab
          --output-directory ./scribe/valint
          --oci --oci-repo=[my_repo]

      - valint verify [target]
          -i [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic]
          --context-type gitlab
          --output-directory ./scribe/valint
          --oci --oci-repo=[my_repo]
```

> Use `gitlab` as context-type.

### Basic examples
<details>
  <summary>  Public registry image (SBOM) </summary>

Create SBOM for remote `busybox:latest` image.

```YAML
- valint bom busybox
      --context-type gitlab
      --output-directory ./scribe/valint
       -f
``` 

</details>

<details>
  <summary>  Docker built image (SBOM) </summary>

Create SBOM for image built by local docker `image_name:latest` image.

```YAML
- valint bom image_name:latest
      --context-type gitlab
      --output-directory ./scribe/valint
       -f
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
       -f
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
       -f
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
       -f
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
           -f
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
           -f
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
           -f

``` 

Create SBOM for local git repository. <br />

> When using implicit checkout note the Gitlab-CI [git-strategy](https://docs.gitlab.com/ee/ci/runners/configure_runners.html#git-strategy) will effect the commits collected by the SBOM.

```YAML
git-remote-job:
  script:
    - valint bom .
          --context-type gitlab
          --output-directory ./scribe/valint
           -f
``` 
</details>

## Resources

[Gitlab CI Jobs Page](https://docs.gitlab.com/ee/ci/) - Github CI docs.
