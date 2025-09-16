---
sidebar_label: "GitLab CI/CD"
title: GitLab CI/CD
sidebar_position: 3
---

Use the following instructions to integrate your GitLab pipelines with Scribe.

### 1. Obtain a Scribe Hub API Token

Create an API token in [Scribe Hub > Account > Tokens](https://app.scribesecurity.com/account/tokens). Copy it to a safe temporary notepad until you complete the integration.

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
          -P $SCRIBE_TOKEN

      - valint verify [target]
          -i [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic]
          --context-type gitlab
          --output-directory ./scribe/valint
          -P $SCRIBE_TOKEN
```

#### Example: Enforcing SP 800-190 Controls with Valint Initiatives

In this example, we use Valint’s initiative framework to apply a suite of SP 800-190 policies against a container image. The job automatically generates evidence (SBOM or provenance), feeds it into Valint, and evaluates the defined controls.

```yaml
image: ubuntu:latest

before_script:
  - apt update
  - apt install -y git curl
  - curl -sSfL https://get.scribesecurity.com/install.sh | sh -s -- -b /usr/local/bin
  - curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin

stages:
  - validate

validate-image:
  stage: validate
  script:
    # Run Trivy to produce a SARIF report:
    - trivy image --format sarif --output scan_report_trivy.sarif ubuntu:latest

    # Verify the image against SP 800-190 initiatives:
    - valint verify [target]
        -i attest
        --bom                          # Auto-generate the SBOM for evidence
        --base-image Dockerfile       # Specify the Dockerfile or base image
        --input sarif:scan_report_trivy.sarif
        --context-type gitlab
        --output-directory ./scribe/valint
        -P $SCRIBE_TOKEN
```

> **Note:** The `--bom`, `--provenance`, or `--input` flags ensure that Valint includes evidence generation as part of the verification process.

#### Using custom x509 keys

Utilizing X509 Keys on Gitlab CI.

- Prepare the X509 key in PEM format, including the Certificate and CA-chain.

- Encode the keys using the commands below:

```yaml
cat my_key.pem | base64
cat my_cert.pem | base64
cat my_ca-chain.pem | base64
```

- Store The following Secrets as project variable using **[GitLab  project variable](https://docs.gitlab.com/ee/ci/variables/#add-a-cicd-variable-to-a-project)**.

![Signing Variables](/img/ci/platforms_gitlab_keys.png)

- `ATTEST_KEY_B64` Base64 encoded x509 Private key pem content, make sure to mask the value.
- `ATTEST_CERT_B64` - Base64 encoded x509 Cert pem content.
- `ATTEST_CA_B64` - Base64 encoded x509 CA Chain pem content

We recommended to base64 encode your PEM files to ensure they can be marked as protected and masked.

> Explore additional signing options in the [attestations](https://scribe-security.github.io/docs/valint/attestations) section.

Lastly Use the masked environment variables with Valint by decoding them:
```yaml
   - export ATTEST_KEY=$(echo $ATTEST_KEY_B64 | base64 -d | tr -d '\r' )
   - export ATTEST_CERT=$(echo $ATTEST_CERT_B64 | base64 -d | tr -d '\r' )
   - export ATTEST_CA=$(echo $ATTEST_CA_B64 | base64 -d | tr -d '\r' )
   - valint bom my_image:latest -o attest
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
          -P $SCRIBE_TOKEN
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
            --author-name bom --author-email bob@company.com
            --supplier-name alice --supplier-url company2.com --supplier-email alice@company2.com --supplier-phone 001
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
- valint bom scribesecurity/example:latest \
      --context-type gitlab \
      --output-directory ./scribe/valint \
```
</details>

<details>
  <summary> Generate SLSA provenance for an image in a private registry </summary>

> Before the following task add a `docker login` task 

```YAML
- valint slsa scribesecurity/example:latest \
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

For a remote git repo:

```YAML
git-remote-job:
  script:
    - valint slsa git:https://github.com/mongo-express/mongo-express.git
          --context-type gitlab
          --output-directory ./scribe/valint
``` 

For a local git repo:

```YAML
git-remote-job:
  script:
    - valint slsa .
          --context-type gitlab
          --output-directory ./scribe/valint
``` 
</details>

### Alternative evidence stores

> You can learn more about alternative stores **[here](https://scribe-security.github.io/docs/integrating-scribe/other-evidence-stores)**.

<details>
  <summary> <b> OCI Evidence store </b></summary>
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
For example, using `docker login` command or **[DOCKER_AUTH_CONFIG field](https://docs.gitlab.com/ee/ci/docker/using_docker_images.html#define-an-image-from-a-private-container-registry)**.

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

      - valint [bom,slsa,evidence] [target]
          -o [attest, statement]
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

</details>
