---
title: gitlab ci
sidebar_position: 5
---

# Gitlab CI
Scribe offers images for evidence collecting and integrity verification using Gitlab CI. \
* Gensbom - bill of material generation tool
* Valint - validate supply chain integrity tool 

# Integration
1. Open your GitLab project and make sure you have a yaml file named .gitlab-ci.yml
As an example update it to contain the following steps:

```yaml
image: ubuntu:latest
before_script:
  - curl -sSfL http://get.scribesecurity.com/install.sh | sh -s -- -b /usr/local/bin

stages:
    - test

test:
    stage: test
    script:
      - >-
        gensbom bom busybox:latest \
            -vv
```


2. Please make sure you use secret variables for client id, client secret and prodyct key. To avoid revealing secrets.

## Scribe service integration
Scribe provides a set of services to store,verify and manage the supply chain integrity. \
Following are some integration examples.
Scribe integrity flow - upload evidence using `gensbom` and download the integrity report using `valint`. \
You may collect evidence anywhere in your workflows. 


<details>
  <summary>  Scribe integrity report - full gitlab ci workflow (binary) </summary>

```yaml
image: ubuntu:latest
variables:
  LOGIN_URL: https://scribesecurity-staging.us.auth0.com
  AUTH_AUDIENCE: api.staging.scribesecurity.com
  SCRIBE_URL: https://api.staging.scribesecurity.com
before_script:
  - apt update && apt install git
  - apt install git -y
  - curl -sSfL http://get.scribesecurity.com/install.sh | sh -s -- -b /usr/local/bin

stages:
    - test

test:
    stage: test
    script:
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

```
</details>

<details>
  <summary>  Scribe integrity report - full gitlab ci workflow (docker) </summary>
  
</details>

---

## Resources

[Gitlab CI Jobs Page](https://docs.gitlab.com/ee/ci/) - Github CI docs.
