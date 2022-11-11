---
title: travis ci
sidebar_position: 6
---

# Travis
Scribe offers images for evidence collecting and integrity verification using Travis CI. \
* Gensbom - bill of material generation tool
* Valint - validate supply chain integrity tool 

# Integration
## Before you begin
Integrating Scribe Hub with Travis CI requires the following credentials that are found in the product setup dialog (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **Home>Products>[$product]>Setup**)

* **Product Key**
* **Client ID**
* **Client Secret**

>Note that the product key is unique per product, while the client ID and secret are unique for your account.


1. Open your Travis project and make sure you have a yaml file named .travis-ci.yml
As an example update it to contain the following steps:

```yaml
language: go
go:
 - 1.18.x

install:
  - mkdir ./bin
  - curl -sSfL https://raw.githubusercontent.com/scribe-security/misc/master/install.sh | sh -s -- -b $PWD/bin
  - export PATH=$PATH:$PWD/bin/

before_script:
  - git clone -b v1.0.0-alpha.4 --single-branch https://github.com/mongo-express/mongo-express.git mongo-express-scm
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

script:
  - echo "hello travis"
```


2. Please make sure you use environment variables for client id, client secret and prodyct key in the build settings to avoid revealing secrets.
