---
title: Travis
sidebar_position: 6
---

# Travis
If you are using Travis as your Continuous Integration tool (CI), use these instructions to integrate Scribe into your pipeline to protect your projects. 

# Integration
## Before you begin
Integrating Scribe Hub with Travis CI requires the following credentials that are found in the product setup dialog (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **Home>Products>[$product]>Setup**)

* **Product Key**
* **Client ID**
* **Client Secret**

>Note that the product key is unique per product, while the client ID and secret are unique for your account.

* Add the credentials (client id, client secret, and product key) to your Travis environment according to the [Travis CI setting up environment variables instructions](https://docs.travis-ci.com/user/environment-variables/ "Travis CI - setting up environment variables") to avoid revealing secrets.

* Open your Travis project and make sure you have a YAML file named `.travis-ci.yml`.
The code in the following examples of a workflow running on the mongo-express image executes these three steps:
  * Collect evidence (`valint bom`) right after checkout including hash value evidence of the source code files and upload that evidence.
  * Generate an SBOM (`valint bom`) from the final Docker image and upload the evidence.
  * Get the integrity report (`valint report`) results and attach the report and evidence to the pipeline run.  

```yaml
language: go
go:
 - 1.18.x

install:
  - mkdir ./bin
  - curl -sSfL https://raw.githubusercontent.com/scribe-security/misc/master/install.sh | sh -s -- -b $PWD/bin
  - export PATH=$PATH:$PWD/bin/


name: "scribe-travis-simple-test"

script:
  - git clone -b v1.0.0-alpha.4 --single-branch https://github.com/mongo-express/mongo-express.git mongo-express-scm
  - >-
    valint bom dir:mongo-express-scm \
        --context-type travis \
        --output-directory ./scribe/valint \
        --product-key $PRODUCT_KEY \
        -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
        -vv
  - >-
    valint bom mongo-express:1.0.0-alpha.4 \
        --context-type travis \
        --output-directory ./scribe/valint \
        --product-key $PRODUCT_KEY \
        -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
        -vv
  - >-
    valint report \
        --context-type travis \
        --product-key $PRODUCT_KEY \
        -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET --output-directory scribe/valint \
        --timeout 120s \
        -vv
```