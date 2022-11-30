---
title: Bitbucket Pipeline
sidebar_position: 4
---


# Bitbuucket Pipeline
Scribe support evidence collecting and integrity verification for Bitbucket Pipelines.
Scribe offers custom pipe to easily integrate in to your Pipelines.

## Before you begin
Integrating Scribe Hub with Bitbucket Pipeline requires the following credentials that are found in the product setup dialog (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **Home>Products>[$product]>Setup**)

* **Product Key**
* **Client ID**
* **Client Secret**

>Note that the product key is unique per product, while the client ID and secret are unique for your account.

## Scribe Bitbucket Pipeline

Scribe offers bitbucket pipe `docker://scribesecurity/scribe-cli-pipe:0.1.2`

# Procedure

* Set your Scribe credentials as environment variables according to [Bitbucket instructions](https://support.atlassian.com/bitbucket-cloud/docs/variables-and-secrets/).
* Use the pipe as shown in the example bellow

<details>
  <summary>  Sample integration code </summary>

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
          SCRIBE_URL: "https://api.staging.scribesecurity.com"
          SCRIBE_LOGIN_URL: "https://scribesecurity-staging.us.auth0.com"
          SCRIBE_AUDIENCE: "api.staging.scribesecurity.com"
      - pipe: docker://scribesecuriy.jfrog.io/scribe-docker-public-local/valint-pipe:dev-latest
        variables:
          COMMAND_NAME: bom
          TARGET: "mongo-express:1.0.0-alpha.4" 
          VERBOSE: 2
          SCRIBE_ENABLE: "true"
          PRODUCT_KEY: $PRODUCT_KEY
          SCRIBE_CLIENT_ID: $SCRIBE_CLIENT_ID
          SCRIBE_CLIENT_SECRET: $SCRIBE_CLIENT_SECRET
          SCRIBE_URL: "https://api.staging.scribesecurity.com"
          SCRIBE_LOGIN_URL: "https://scribesecurity-staging.us.auth0.com"
          SCRIBE_AUDIENCE: "api.staging.scribesecurity.com"
      - pipe: docker://scribesecuriy.jfrog.io/scribe-docker-public-local/valint-pipe:dev-latest
        variables:
          COMMAND_NAME: report
          VERBOSE: 2
          SCRIBE_ENABLE: "true"
          PRODUCT_KEY: $PRODUCT_KEY
          SCRIBE_CLIENT_ID: $SCRIBE_CLIENT_ID
          SCRIBE_CLIENT_SECRET: $SCRIBE_CLIENT_SECRET
          SCRIBE_URL: "https://api.staging.scribesecurity.com"
          SCRIBE_LOGIN_URL: "https://scribesecurity-staging.us.auth0.com"
          SCRIBE_AUDIENCE: "api.staging.scribesecurity.com"
          TIMEOUT: 120s
      services:
      - docker

  pipelines:
    default:
    - &lt&lt: *scribe-bitbucket-simple-job

  ```

</details>

---
## Generating SBOM examples

<details>
  <summary>  Public registry image </summary>

Create SBOM from remote `busybox:latest` image, skip if found by the cache.

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

Create SBOM for image built by local docker `image_name:latest` image, overwrite cache.

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

Custom private registry, skip cache (using `Force`), output verbose (debug level) log output.
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

Custom metadata added to SBOM
Data will be included in the signed payload when the output is an attestation.
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

Create SBOM from the local oci archive.

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

## Integration examples
<details>
  <summary>  Scribe integrity report download </summary>

Download integrity report. \
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
  <summary> Simple download report verbose, custom output path </summary>

Download report for CI run and save the output to a local file.

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

[Pipelines](https://support.atlassian.com/bitbucket-cloud/docs/get-started-with-bitbucket-pipelines/) - The official registry page of pipeline described.

