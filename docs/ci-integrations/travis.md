---
title: travis ci
sidebar_position: 6
---

# Travis
Scribe offers images for evidence collecting and integrity verification using Travis CI. \
* Gensbom - bill of material generation tool
* Valint - validate supply chain integrity tool 

# Integration
1. Open your Travis project and make sure you have a yaml file named .travis-ci.yml
As an example update it to contain the following steps:

```yaml

language: go
go:
 - 1.18.x

env:
  LOGIN_URL: https://scribesecurity-staging.us.auth0.com
  AUTH_AUDIENCE: api.staging.scribesecurity.com
  SCRIBE_URL: https://api.staging.scribesecurity.com

install:
  - curl -sSfL https://raw.githubusercontent.com/scribe-security/misc/master/install.sh | sh -s -- -b /usr/local/bin

pre_script:
  - git clone -b v1.0.0-alpha.4 --single-branch https://github.com/mongo-express/mongo-express.git mongo-express-scm
  - >-
    gensbom bom dir:mongo-express \
        --context-type jenkins \
        --output-directory ./scribe/gensbom \
        --product-key $PRODUCT_KEY \
        -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
        --scribe.login-url $LOGIN_URL --scribe.auth.audience $AUTH_AUDIENCE --scribe.url $SCRIBE_URL \
        -vv
  - >-
    gensbom bom mongo-express:1.0.0-alpha.4 \
        --context-type jenkins \
        --output-directory ./scribe/gensbom \
        --product-key $PRODUCT_KEY \
        -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
        --scribe.login-url $LOGIN_URL --scribe.auth.audience $AUTH_AUDIENCE --scribe.url $SCRIBE_URL \
        -vv
  - >-
    valint report \
        --product-key $PRODUCT_KEY \
        -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET --output-directory scribe/valint \
        --scribe.login-url $LOGIN_URL --scribe.auth.audience $AUTH_AUDIENCE --scribe.url $SCRIBE_URL \
        --timeout 120s \
        -vv

script:
 - go test -v ./...
```


2. Please make sure you use secret variables for client id, client secret and prodyct key. To avoid revealing secrets.
