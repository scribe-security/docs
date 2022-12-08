---
sidebar_position: 4
title: Bitbucket
---


# Bitbucket Pipeline
If you are using Bitbucket pipelines as your Continuous Integration tool (CI), use these instructions to integrate Scribe into your pipeline to protect your projects. Scribe offers a custom pipe to easily integrate our code snippets with your existing pipelines.

## Before you begin
Integrating Scribe Hub with Bitbucket Pipeline requires the following credentials that are found in the product setup dialog (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **Home>Products>[$product]>Setup**)

* **Product Key**
* **Client ID**
* **Client Secret**

>Note that the product key is unique per product, while the client ID and secret are unique for your account.

## Scribe Bitbucket Pipeline

Scribe offers a custom bitbucket pipe `docker://scribesecurity/scribe-cli-pipe:0.1.2`

# Procedure

* Set your Scribe credentials as environment variables according to [Bitbucket instructions](https://support.atlassian.com/bitbucket-cloud/docs/variables-and-secrets/ "Bitbucket instructions").
* Use the Scribe custom pipe as shown in the example bellow

<details>
  <summary>  Sample integration code using Scribe's custom Bitbucket pipe</summary>

  ```YAML
  image:
    name: python:3.7

  scribe-bitbucket-simple-job: &scribe-bitbucket-simple-job
    step:
      name: scribe-bitbucket-simple-test
      - git clone -b v1.0.0-alpha.4 --single-branch https://github.com/mongo-express/mongo-express.git mongo-express-scm
      - pipe: docker://scribesecuriy.jfrog.io/scribe-docker-public-local/valint-pipe:dev-latest
        variables:
          COMMAND_NAME: bom
          TARGET: dir:mongo-express-scm
          PRODUCT_KEY: $PRODUCT_KEY
          SCRIBE_CLIENT_ID: $SCRIBE_CLIENT_ID
          SCRIBE_CLIENT_SECRET: $SCRIBE_CLIENT_SECRET
      - pipe: docker://scribesecuriy.jfrog.io/scribe-docker-public-local/valint-pipe:dev-latest
        variables:
          COMMAND_NAME: bom
          TARGET: "mongo-express:1.0.0-alpha.4" 
          VERBOSE: 2
          SCRIBE_ENABLE: "true"
          PRODUCT_KEY: $PRODUCT_KEY
          SCRIBE_CLIENT_ID: $SCRIBE_CLIENT_ID
          SCRIBE_CLIENT_SECRET: $SCRIBE_CLIENT_SECRET
      - pipe: docker://scribesecuriy.jfrog.io/scribe-docker-public-local/valint-pipe:dev-latest
        variables:
          COMMAND_NAME: report
          VERBOSE: 2
          SCRIBE_ENABLE: "true"
          PRODUCT_KEY: $PRODUCT_KEY
          SCRIBE_CLIENT_ID: $SCRIBE_CLIENT_ID
          SCRIBE_CLIENT_SECRET: $SCRIBE_CLIENT_SECRET
          TIMEOUT: 120s
      services:
      - docker

  pipelines:
    default:
    - \>\>: *scribe-bitbucket-simple-job
  ```

</details>

---
## Generating SBOM examples
Since there could be several different options for where the final image is created/stored here's how Scribe's `gensbom` code handles the various options:

<details>
  <summary>  Public registry image </summary>

Create SBOM from remote `busybox:latest` image. The SBOM will not be created if an appropriate one is already found in the cache.

```YAML
  step:
    name: Test
    script:
    - pipe: docker://scribesecurity/scribe-cli-pipe:0.1.2
      variables:
        COMMAND: bom
        TARGET: busybox:latest
        PRODUCT_KEY: $PRODUCT_KEY
        SCRIBE_CLIENT_ID: $SCRIBE_CLIENT_ID
        SCRIBE_CLIENT_SECRET: $SCRIBE_CLIENT_SECRET
``` 

</details>


<details>
  <summary>  Docker built image </summary>

Create SBOM for image built by local docker `image_name:latest` image. This SBOM will overwrite the SBOM found in local cache (assuming there is one).

```YAML
  step:
    name: Test
    script:
    - pipe: docker://scribesecurity/scribe-cli-pipe:0.1.2
      variables:
        COMMAND: bom
        TARGET: image_name:latest
        PRODUCT_KEY: $PRODUCT_KEY
        SCRIBE_CLIENT_ID: $SCRIBE_CLIENT_ID
        SCRIBE_CLIENT_SECRET: $SCRIBE_CLIENT_SECRET
        FORCE: true
        format: json
``` 
</details>

<details>
  <summary>  Private registry image </summary>

Create SBOM for image in a custom private registry. You can skip the cache search for an appropriate SBOM by using the `Force` flag. The output in this example uses verbose (debug level) 2 which will create a log output.
```YAML
step:
  name: Test
  script:
  - pipe: docker://scribesecurity/scribe-cli-pipe:0.1.2
    variables:
      COMMAND: bom
      TARGET: scribesecuriy.jfrog.io/scribe-docker-local/stub_remote:latest
      PRODUCT_KEY: $PRODUCT_KEY
      SCRIBE_CLIENT_ID: $SCRIBE_CLIENT_ID
      SCRIBE_CLIENT_SECRET: $SCRIBE_CLIENT_SECRET
      FORCE: true
      VERBOSE: 2
```
</details>

<details>
  <summary>  Custom SBOM metadata </summary>

Create SBOM from remote `busybox:latest` image and add custom metadata to the SBOM created.  
The data will be included in the signed payload when the output is an attestation. In this example the metadata included is the env (environment) and label of the image. 

```YAML
step:
  name: Test
  script:
  - pipe: docker://scribesecurity/scribe-cli-pipe:0.1.2
    variables:
      COMMAND: bom
      TARGET: busybox:latest
      PRODUCT_KEY: $PRODUCT_KEY
      SCRIBE_CLIENT_ID: $SCRIBE_CLIENT_ID
      SCRIBE_CLIENT_SECRET: $SCRIBE_CLIENT_SECRET
      FORCE: true
      VERBOSE: 2
      FORMAT: json
      LABEL: test_label
      ENV: test_env
```
</details>

<details>
  <summary> Docker archive image </summary>

Create SBOM from local `docker save ...` output.
```YAML
step:
  name: Test
  script:
  - pipe: docker://scribesecurity/scribe-cli-pipe:0.1.2
    variables:
      COMMAND: bom
      TARGET: saved_docker.tar
      PRODUCT_KEY: $PRODUCT_KEY
      SCRIBE_CLIENT_ID: $SCRIBE_CLIENT_ID
      SCRIBE_CLIENT_SECRET: $SCRIBE_CLIENT_SECRET
      VERBOSE: 2
``` 
</details>

<details>
  <summary> OCI archive image </summary>

Create SBOM from the local OCI (Oracle Cloud Infrastructure) archive.

```YAML
step:
  name: Test
  script:
  - pipe: docker://scribesecurity/scribe-cli-pipe:0.1.2
    variables:
      COMMAND: bom
      TARGET: oci-archive:saved_oci.tar
      PRODUCT_KEY: $PRODUCT_KEY
      SCRIBE_CLIENT_ID: $SCRIBE_CLIENT_ID
      SCRIBE_CLIENT_SECRET: $SCRIBE_CLIENT_SECRET
      VERBOSE: 2
``` 
</details>

<details>
  <summary> Directory target </summary>

Create SBOM from a local directory. 

```YAML
step:
  name: Test
  script:
  - pipe: docker://scribesecurity/scribe-cli-pipe:0.1.2
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
  <summary> Save SBOM as artifact </summary>

Using action `output_path` you can access the generated SBOM and store it as an artifact.
```YAML
step:
  name: Test
  script:
  - pipe: docker://scribesecurity/scribe-cli-pipe:0.1.2
    variables:
      COMMAND: bom
      TARGET: busybox:latest
      PRODUCT_KEY: $PRODUCT_KEY
      SCRIBE_CLIENT_ID: $SCRIBE_CLIENT_ID
      SCRIBE_CLIENT_SECRET: $SCRIBE_CLIENT_SECRET
      VERBOSE: 2
      OUTPUT_FILE: "./result_report.json"
``` 
</details>

## Integrity report download examples
<details>
  <summary>  Scribe integrity report download </summary>

Integrity report standard download.  
The default output will be set to `scribe/valint/` subdirectory (Use `output-directory` argument to overwrite location).

```YAML
step:
  name: Test
  script:
  - pipe: docker://scribesecurity/scribe-cli-pipe:0.1.2
    variables:
      COMMAND: report
      TARGET: dir:./testdir
      PRODUCT_KEY: $PRODUCT_KEY
      SCRIBE_CLIENT_ID: $SCRIBE_CLIENT_ID
      SCRIBE_CLIENT_SECRET: $SCRIBE_CLIENT_SECRET
      VERBOSE: 2
``` 


</details>

<details>
  <summary> Integrity report download with added verbosity and a custom output file </summary>

Download report for current CI run and save the output to a local file.

```YAML
step:
  name: Test
  script:
  - pipe: docker://scribesecurity/scribe-cli-pipe:0.1.2
    variables:
      COMMAND: report
      PRODUCT_KEY: $PRODUCT_KEY
      SCRIBE_CLIENT_ID: $SCRIBE_CLIENT_ID
      SCRIBE_CLIENT_SECRET: $SCRIBE_CLIENT_SECRET
      VERBOSE: 2
      OUTPUT_FILE: "./result_report.json"
``` 
</details>


## Resources
If you're new to Bitbucket pipelines this link should help you get started:
* [Bitbucket Pipelines](https://support.atlassian.com/bitbucket-cloud/docs/get-started-with-bitbucket-pipelines/ "Get started with Bitbucket Pipelines") - Get started with Bitbucket Pipelines.

