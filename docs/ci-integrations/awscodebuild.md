---
title: AWS Code Pipeline
sidebar_position: 6
---

# Integrating Scribe in your Azure DevOps pipeline

## Before you begin
Integrating Scribe Hub with Azure DevOps requires the following credentials that are found in the product setup dialog (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **Home>Products>[$product]>Setup**)

* **Product Key**
* **Client ID**
* **Client Secret**

>Note that the product key is unique per product, while the client ID and secret are unique for your account.

# Procedure

* Store credentials using [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/)

* Create a file `buildspec.yml` 

<details>
  <summary>  <b> Sample integration code </b> </summary>

```YAML
version: 0.2

env:
  secrets-manager:
    PRODUCT_KEY: scribe:product_key
    SCRIBE_CLIENT_ID: scribe:client_id
    SCRIBE_CLIENT_SECRET: scribe:client_secret

phases:
  install:
    commands:
      - echo Entered the install phase...
      - git clone -b v1.0.0-alpha.4 --single-branch https://github.com/mongo-express/mongo-express.git mongo-express-scm
      - curl -sSfL https://raw.githubusercontent.com/scribe-security/misc/master/install.sh | sh -s -- -b /usr/$USER/bin
    finally:
      - echo This always runs even if the update or install command fails 
  pre_build:
    commands:
      - echo Entered the pre_build phase...
      - >-
        gensbom bom dir:mongo-express-scm \
            --context-type jenkins \
            --output-directory ./scribe/gensbom \
            --product-key $PRODUCT_KEY \
            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
            -vv
      - >-
        gensbom bom mongo-express:1.0.0-alpha.4 \
            --context-type jenkins \
            --output-directory ./scribe/gensbom \
            --product-key $PRODUCT_KEY \
            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
            -vv
      - >-
        valint report \
            --product-key $PRODUCT_KEY \
            -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET --output-directory scribe/valint \
            --timeout 120s \
            -vv
    finally:
      - echo This always runs even if the login command fails 
  build:
    commands:
      - echo Entered the build phase...
      - echo Build started on `date`
    finally:
      - echo This always runs even if the install command fails
  post_build:
    commands:
      - echo Entered the post_build phase...
      - echo Build completed on `date`
```
</details>



## Generating SBOM examples
<details>
  <summary>  Public registry image </summary>

Create SBOM from remote `busybox:latest` image, skip if found by the cache.

```YAML
phases:
  pre_build:
    commands:
      - echo Entered the pre_build phase...
      - gensbom bom busybox:latest
``` 

</details>

<details>
  <summary>  Docker built image </summary>

Create SBOM for image built by local docker `image_name:latest` image, overwrite cache.

```YAML
phases:
  pre_build:
    commands:
      - echo Entered the pre_build phase...
      - gensbom bom image_name:latest --format json --force true
``` 
</details>

<details>
  <summary>  Private registry image </summary>

Custom private registry, skip cache (using `Force`), output verbose (debug level) log output.
```YAML
phases:
  pre_build:
    commands:
      - echo Entered the pre_build phase...
      - gensbom bom scribesecuriy.jfrog.io/scribe-docker-local/stub_remote:latest -vv --force true
```
</details>

<details>
  <summary>  Custom SBOM metadata </summary>

Custom metadata added to SBOM
Data will be included in the signed payload when the output is an attestation.
```YAML
phases:
  pre_build:
    commands:
      - echo Entered the pre_build phase...
      - export test_env=value
      - gensbom bom busybox:latest --format json --name name_value --env test_env --label test_label -vv --force true
```
</details>


<details>
  <summary> Save SBOM as artifact </summary>

Using action `output_path` you can access the generated SBOM and store it as an artifact.
```YAML
phases:
  pre_build:
    commands:
      - echo Entered the pre_build phase...
      - gensbom bom busybox:latest --output_path ./scribe/gensbom
``` 
</details>

<details>
  <summary> Docker archive image </summary>

Create SBOM from local `docker save ...` output.
```YAML
phases:
  pre_build:
    commands:
      - echo Entered the pre_build phase...
      - gensbom bom saved_docker.tar
``` 
</details>

<details>
  <summary> OCI archive image </summary>

Create SBOM from the local oci archive.

```YAML
phases:
  pre_build:
    commands:
      - echo Entered the pre_build phase...
      - gensbom bom oci-archive:saved_oci.tar
``` 
</details>

<details>
  <summary> Directory target </summary>

Create SBOM from a local directory. 

```YAML
phases:
  pre_build:
    commands:
      - echo Entered the pre_build phase...
      - gensbom bom dir:./testdir
``` 
</details>

## Integration examples
<details>
  <summary>  Scribe integrity report download </summary>

Download integrity report. \
The default output will be set to `scribe/valint/` subdirectory (Use `output-directory` argument to overwrite location).

```YAML
phases:
  pre_build:
    commands:
      - echo Entered the pre_build phase...
      - >-
        valint report \
            --product-key $PRODUCT_KEY \
            -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET
``` 


</details>

<details>
  <summary> Simple download report verbose, custom output path </summary>

Download report for CI run and save the output to a local file.

```YAML
phases:
  pre_build:
    commands:
      - echo Entered the pre_build phase...
      - >-
        valint report \
            --product-key $PRODUCT_KEY \
            -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET
            --output-file ./result_report.json -vv
``` 
</details>
