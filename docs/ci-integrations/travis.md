---
title: Travis CI
sidebar_position: 6
---

# Travis CI
If you are using Travis CI as your Continuous Integration tool (CI), use these instructions to integrate Scribe into your pipeline to protect your projects. 

## Installation
Install the Scribe `valint` CLI tool:
```yaml
install:
  - mkdir ./bin
  - curl -sSfL http://get.scribesecurity.com/install.sh| sh -s -- -b $PWD/bin
  - export PATH=$PATH:$PWD/bin/
```

### Usage
```yaml
jobs:
  include:
    - name: 'bom-targets'
      git:
        depth: false
      install:
        - mkdir ./bin
        - curl -sSfL http://get.scribesecurity.com/install.sh| sh -s -- -b $PWD/bin
        - export PATH=$PATH:$PWD/bin/
      env: test_env=test_env_value
      script:
        - |
          valint bom busybox:latest \
              --context-type travis \
              --output-directory ./scribe/valint \
              -vv -f
```

## Before you begin
Integrating Scribe Hub with Travis CI requires the following credentials that are found in the product setup dialog (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **Home>Products>[$product]>Setup**)

* **Product Key**
* **Client ID**
* **Client Secret**

>Note that the product key is unique per product, while the client ID and secret are unique for your account.

* Add the credentials (client id, client secret, and product key) to your Travis environment according to the [Travis CI setting up environment variables instructions](https://docs.travis-ci.com/user/environment-variables/ "Travis CI - setting up environment variables") to avoid revealing secrets.

* Open your Travis project and make sure you have a YAML file named `.travis-ci.yml`.
The code in the following examples of a workflow running on the mongo-express image 

* Install `valint` tool using the following command
```bash
curl -sSfL http://get.scribesecurity.com/install.sh| sh -s -- -b $PWD/bin
```

As an example update it to contain the following steps:

```yaml
language: go
go:
 - 1.18.x

install:
  - mkdir ./bin
  - curl -sSfL http://get.scribesecurity.com/install.sh| sh -s -- -b $PWD/bin
  - export PATH=$PATH:$PWD/bin/


name: "scribe-travis-job"

script:
  - git clone -b v1.0.0-alpha.4 --single-branch https://github.com/mongo-express/mongo-express.git mongo-express-scm
  - |
    valint bom dir:mongo-express-scm \
        --context-type travis \
        --output-directory ./scribe/valint \
        --product-key $PRODUCT_KEY \
        -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
        -vv
  - |
    valint bom mongo-express:1.0.0-alpha.4 \
        --context-type travis \
        --output-directory ./scribe/valint \
        --product-key $PRODUCT_KEY \
        -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
        -vv
```


## Basic examples
<details>
  <summary>  Public registry image (SBOM) </summary>

Create SBOM for remote `busybox:latest` image.

```YAML
- |
  valint bom busybox:latest \
      --context-type travis \
      --output-directory ./scribe/valint \
      -vv -f
``` 

</details>

<details>
  <summary>  Docker built image (SBOM) </summary>

Create SBOM for image built by local docker `image_name:latest` image.

```YAML
- |
  valint bom image_name:latest \
      --context-type travis \
      --output-directory ./scribe/valint \
      -vv -f
``` 
</details>

<details>
  <summary>  Private registry image (SBOM) </summary>

Create SBOM for image hosted on private registry.

> Use `docker login` to add access.

```YAML
- |
  valint bom scribesecuriy.jfrog.io/scribe-docker-local/stub_remote:latest \
      --context-type travis \
      --output-directory ./scribe/valint \
      -vv -f
```
</details>

<details>
  <summary>  Custom metadata (SBOM) </summary>

Custom metadata added to SBOM.
```YAML
- name: 'bom-targets'
  env: test_env=test_env_value
  script:
    - |
      valint bom busybox:latest \
          --context-type travis \
          --output-directory ./scribe/valint \
          --env test_env --label test_label \
          -vv -f
```
</details>


<details>
  <summary> Save as artifact (SBOM, SLSA) </summary>

Using command `output-directory` or `output-file` to export evidence as an artifact.

> Use `--format`, `-o` to select between the format.

> and add the following environment variables in the repository settings:
```
ARTIFACTS_KEY=(AWS access key id)
ARTIFACTS_SECRET=(AWS secret access key)
ARTIFACTS_BUCKET=(S3 bucket name)
```
For more details see [Artifact documentation](https://docs.travis-ci.com/user/uploading-artifacts/)

```YAML
- name: 'save-artifact'
      git:
        depth: false

      install:
        - mkdir ./bin
        - curl -sSfL http://get.scribesecurity.com/install.sh| sh -s -- -b $PWD/bin
        - export PATH=$PATH:$PWD/bin/
      
      script:

      - |
        valint bom busybox:latest \
            --context-type travis \
            --output-directory ./scribe/valint \
            --output-file ./my_sbom.json \
            -vv -f
      
      addons:
      
        artifacts:
          paths:
          - ./scribe/valint
          - ./my_sbom.json
```

</details>

<details>
  <summary> Directory target (SBOM) </summary>

Create SBOM for a local directory.

```YAML
- |
  mkdir testdir
  echo "test" > testdir/test.txt

- |
  valint bom dir:testdir \
      --context-type travis \
      --output-directory ./scribe/valint \
      -vv -f
``` 
</details>


<details>
  <summary> Git target (SBOM) </summary>

Create SBOM for `mongo-express` remote git repository.

```YAML
- |
  valint bom git:https://github.com/mongo-express/mongo-express.git \
      --context-type travis \
      --output-directory ./scribe/valint \
      -vv -f
``` 

Create SBOM for local git repository. <br />

> When using implicit checkout note the travis-CI [git-strategy](https://docs.travis.com/ee/ci/runners/configure_runners.html#git-strategy) will effect the commits collected by the SBOM.

```YAML
- |
  valint bom git:. \
      --context-type travis \
      --output-directory ./scribe/valint \
      -vv -f
``` 
</details>

## Resources
If you're new to Travis this link should help you get started:
* [Travis CI](https://docs.travis-ci.com/user/tutorial/ "Travis tutorial") - Travis CI Tutorial.