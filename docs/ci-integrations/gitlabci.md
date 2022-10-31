---
title: gitlab ci
sidebar_position: 4
---

# Gitlab CI
Scribe offers images for evidence collecting and integrity verification using Gitlab CI.

## Before you begin
Integrating Scribe Hub with Gitlab requires the following credentials that are found in the product setup dialog (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **Home>Products>[$product]>Setup**)

* **Product Key**
* **Client ID**
* **Client Secret**

>Note that the product key is unique per product, while the client ID and secret are unique for your account.

# Procedure

* Store credentials using [GitLab  project variable](https://docs.gitlab.com/ee/ci/variables/#add-a-cicd-variable-to-a-project) 

* Open your GitLab project and make sure you have a yaml file named `.gitlab-ci.yml`
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

## 
# Examples

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
            --context-type gitlab \
            --output-directory ./scribe/gensbom \
            --product-key $PRODUCT_KEY \
            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
            --scribe.login-url $LOGIN_URL --scribe.auth.audience $AUTH_AUDIENCE --scribe.url $SCRIBE_URL \
            -vv
      - >-
        gensbom bom mongo-express:1.0.0-alpha.4 \
            --context-type gitlab \
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

<!-- <details>
  <summary>  Scribe integrity report - full gitlab ci workflow (docker) </summary>
  
</details> -->

---

## Resources

[Gitlab CI Jobs Page](https://docs.gitlab.com/ee/ci/) - Github CI docs.
