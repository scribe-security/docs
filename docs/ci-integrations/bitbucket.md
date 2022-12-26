---
sidebar_position: 4
title: Bitbucket
---

# Bitbucket Pipelines Pipe: Scribe evidence generator

Scribe support evidence collecting and integrity verification for Bitbucket pipelines.

## YAML Definition

Add the following snippet to the script section of your `bitbucket-pipelines.yml` file:

```yaml
- pipe: scribe-security/valint-pipe:0.1.4
  variables:
    COMMAND_NAME: "<string>"
    TARGET: "<string>"
    # VERBOSE "<boolean>" # Optional
    # CONFIG: "<string>" # Optional
    # FORMAT: "<string>" # Optional
    # INPUT_FORMAT: '<string>' # Optional
    # OUTPUT_DIRECTORY: '<boolean>' # Optional
    # OUTPUT_FILE: '<string>' # Optional
    # PRODUCT_KEY: '<string>' # Optional
    # LABEL: '<string>' # Optional
    # ENV: '<string>' # Optional
    # FILTER_REGEX: '<string>' # Optional
    # FILTER_SCOPE: '<string>' # Optional
    # PACKAGE_TYPE: '<string>' # Optional
    # PACKAGE_GROUP: '<string>' # Optional
    # FORCE: '<boolean>' # Optional
    # ATTEST_CONFIG: '<string>' # Optional
    # ATTEST_DEFAULT: '<string>' # Optional
    # SCRIBE_ENABLE: '<string>' # Optional
    # SCRIBE_CLIENT_ID: '<string>' # Optional
    # SCRIBE_CLIENT_SECRET: '<string>' # Optional
    # ATTESTATION: '<string>' # Optional
    # COMPONENTS: '<string>' # Optional
    # OCI: '<boolean>' # Optional
    # OCI_REPO: '<string>' # Optional
```

<details>
<summary> <b> Bitbucket Scribe Variables </b>
  </summary>
<h3>  Variables </h3>

| Variable              | Usage                                                       | Default | COMMAND |
| --------------------- | ----------------------------------------------------------- | ------- | ------- |
| COMMAND_NAME (*) | Name of the command to execute (bom, verify) | | |
| TARGET (*) |  Target object name format=[docker:{image:tag}, dir:{dir_path}, git:{git_path}, docker-archive:{archive_path}, oci-archive:archive_path, registry:image:tag] | | any |
| VERBOSE | Log verbosity level [-v,--verbose=1] = info, [-vv,--verbose=2] = debug' | | any |
| CONFIG | Config of the application | | any |
| FORMAT | Evidence format, options=[cyclonedx-json cyclonedx-xml attest-cyclonedx-json statement-cyclonedx-json predicate-cyclonedx-json attest-slsa statement-slsa predicate-slsa] | | bom |
| INPUT_FORMAT | Evidence format, options=[attest-cyclonedx-json attest-slsa statement-slsa statement-cyclonedx-json] | | verify |
| OUTPUT_DIRECTORY | Output directory path |  scribe/valint | any |
| OUTPUT_FILE | Output file name | | any |
| PRODUCT_KEY | Custom/project product-key | | any |
| LABEL |  Custom labels | | bom | 
| ENV | Custom env | | bom |
| FILTER_REGEX | Filter out files by regex | | bom |
| FILTER_SCOPE | Filter packages by scope | | bom |
| PACKAGE_TYPE | Select package type | | bom |
| PACKAGE_GROUP | Select package group | | bom |
| ATTACH_REGEX | Attach files content by regex| | bom |
| FORCE | Force overwrite cache | | bom |
| ATTEST_CONFIG | Attestation config path | | any |
| ATTEST_DEFAULT | Attestation default config, options=[sigstore sigstore-github x509 kms] | | any |
| SCRIBE_ENABLE |  Enable scribe client | | any |
| SCRIBE_CLIENT_ID | Scribe client id | | any |
| SCRIBE_CLIENT_SECRET |  Scribe access token | | any |
| ATTESTATION | Attestation for target  | | verify |
| COMPONENTS | Select sbom components groups, options=[metadata layers packages files dep]  | | bom |
| OCI | Enable OCI store  | | any |
| OCI_REPO | Select OCI custom attestation repo  | | any |
(*) = required variable.
</details>

## Usage
```yaml
 - pipe: scribe-security/valint-pipe:0.1.4
   variables:
    COMMAND_NAME: bom
    TARGET: busybox:latest
    VERBOSE: 2
    FORCE: "true"
```

## Before you begin
Integrating Scribe Hub with Bitbucket Pipeline requires the following credentials that are found in the product setup dialog (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **Home>Products>[$product]>Setup**)

* **Product Key**
* **Client ID**
* **Client Secret**

>Note that the product key is unique per product, while the client ID and secret are unique for your account.

## Scribe service integration
Scribe provides a set of services to store, verify and manage the supply chain integrity. <br />
Following are some integration examples.

## Procedure

* Set your Scribe credentials as environment variables according to [Bitbucket instructions](https://support.atlassian.com/bitbucket-cloud/docs/variables-and-secrets/ "Bitbucket instructions").

* Use the Scribe custom pipe as shown in the example bellow

* As an example update it to contain the following steps:

```yaml
pipelines:
  default:
    - step:
        name: scribe-bitbucket-pipeline
        script:      
          - pipe: scribe-security/valint-pipe:0.1.4
            variables:
              COMMAND_NAME: bom
              TARGET: busybox:latest 
              PRODUCT_KEY: $PRODUCT_KEY
              SCRIBE_CLIENT_ID: $SCRIBE_CLIENT_ID
              SCRIBE_CLIENT_SECRET: $SCRIBE_CLIENT_SECRET
```

<details>
  <summary>  Scribe integrity </summary>

A full working example of a workflow - upload evidence on source code and on the final built image to Scribe.<br /> 
Verifying the target integrity on Scribe.<br />
This example workflow uses the public repository of the mongo-express project to demonstrate Scribe's capability to verify the integrity of a build product. <br />


  ```YAML
pipelines:
  default:
    - step:
        name: scribe-bitbucket-simple-test
        script:      
          - git clone -b v1.0.0-alpha.4 --single-branch https://github.com/mongo-express/mongo-express.git mongo-express-scm
          - pipe: scribe-security/valint-pipe:0.1.4
            variables:
              COMMAND_NAME: bom
              TARGET: dir:mongo-express-scm
              PRODUCT_KEY: $PRODUCT_KEY
              SCRIBE_CLIENT_ID: $SCRIBE_CLIENT_ID
              SCRIBE_CLIENT_SECRET: $SCRIBE_CLIENT_SECRET
          - pipe: scribe-security/valint-pipe:0.1.4
            variables:
              COMMAND_NAME: bom
              TARGET: "mongo-express:1.0.0-alpha.4" 
              SCRIBE_ENABLE: "true"
              PRODUCT_KEY: $PRODUCT_KEY
              SCRIBE_CLIENT_ID: $SCRIBE_CLIENT_ID
              SCRIBE_CLIENT_SECRET: $SCRIBE_CLIENT_SECRET
  ```
</details>


## Basic examples

<details>
  <summary>  Public registry image (SBOM) </summary>

Create SBOM from remote `busybox:latest` image.

```YAML
  - pipe: scribe-security/valint-pipe:0.1.4
      variables:
        COMMAND: bom
        TARGET: busybox:latest
        VERBOSE: 2
        FORCE: "true"
``` 

</details>


<details>
  <summary>  Docker built image (SBOM) </summary>

Create SBOM for image built by local docker `image_name:latest` image.

```YAML
- pipe: scribe-security/valint-pipe:0.1.4
  variables:
    COMMAND: bom
    TARGET: image_name:latest
    VERBOSE: 2
    FORCE: "true"
``` 
</details>

<details>
  <summary>  Private registry image (SBOM) </summary>

Create SBOM for image hosted on private registry.

> Use `docker login` to add access.

```YAML
- pipe: scribe-security/valint-pipe:0.1.4
  variables:
    COMMAND: bom
    TARGET: scribesecuriy.jfrog.io/scribe-docker-local/stub_remote:latest
    FORCE: true
    VERBOSE: 2
```
</details>

<details>
  <summary>  Custom metadata (SBOM) </summary>

Custom metadata added to SBOM.
```YAML
- step:
    name: valint-image-step
    script:
      - export test_env=test_env_value
      - pipe: docker://scribesecuriy.jfrog.io/scribe-docker-public-local/valint-pipe:dev-latest
        variables:
          COMMAND_NAME: bom
          TARGET: busybox:latest
          VERBOSE: 2
          FORCE: "true"
          ENV: test_env
          LABEL: test_label
```
</details>

<details>
  <summary> Save as artifact (SBOM, SLSA) </summary>

Using input variable `OUTPUT_DIRECTORY` or `OUTPUT_FILE` to export evidence as an artifact.

> Use input variable `FORMAT` to select between the format, .


```YAML
- step:
    name: save-artifact-step
    script:
      - pipe: docker://scribesecuriy.jfrog.io/scribe-docker-public-local/valint-pipe:dev-latest
        variables:
          COMMAND_NAME: bom
          OUTPUT_FILE: my_sbom.json
          TARGET: busybox:latest
          VERBOSE: 2
          FORCE: "true"
    artifacts:
      - scribe/**
      - my_sbom.json
```
</details>

<details>
  <summary> Directory target (SBOM) </summary>

Create SBOM from a local directory. 

```YAML
step:
  name: dir-sbom-step
  script:
  - mkdir testdir
  - echo "test" > testdir/test.txt
  - pipe: scribe-security/valint-pipe:0.1.4
    variables:
      COMMAND: bom
      TARGET: dir:./testdir
      PRODUCT_KEY: $PRODUCT_KEY
      SCRIBE_CLIENT_ID: $SCRIBE_CLIENT_ID
      SCRIBE_CLIENT_SECRET: $SCRIBE_CLIENT_SECRET
      VERBOSE: 2
``` 
</details>

<details>
  <summary> Git target (SBOM) </summary>

Create SBOM for `mongo-express` remote git repository.

```YAML
- step:
    name: valint-git-step
    script:
      - pipe: docker://scribesecuriy.jfrog.io/scribe-docker-public-local/valint-pipe:dev-latest
        variables:
          COMMAND_NAME: bom
          TARGET: git:https://github.com/mongo-express/mongo-express.git
          VERBOSE: 2
          FORCE: "true"
``` 

Create SBOM for local git repository. <br />

```YAML
    - step:
        name: valint-git-step
        script:
          - git clone https://github.com/mongo-express/mongo-express.git scm_mongo_express
          - pipe: docker://scribesecuriy.jfrog.io/scribe-docker-public-local/valint-pipe:dev-latest
            variables:
              COMMAND_NAME: bom
              TARGET: dir:scm_mongo_express
              VERBOSE: 2
              FORCE: "true"
``` 
</details>

## Resources
If you're new to Bitbucket pipelines this link should help you get started:
* [Bitbucket Pipelines](https://support.atlassian.com/bitbucket-cloud/docs/get-started-with-bitbucket-pipelines/ "Get started with Bitbucket Pipelines") - Get started with Bitbucket Pipelines.

## Support

If you'd like help with this pipe, or you have an issue or a feature request, [let us know](https://github.com/scribe-security/valint-pipe/issues).

If you are reporting an issue, please include:

- the version of the pipe
- relevant logs and error messages
- steps to reproduce

By email or slack.
[Contact-us] (https://scribesecurity.com/contact-us/)

## License

Copyright (c) 2019 Atlassian and others.
Apache 2.0 licensed, see [LICENSE](LICENSE.txt) file.