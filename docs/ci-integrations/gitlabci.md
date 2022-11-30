---
title: GitLab-CI
sidebar_position: 4
---

# Gitlab CI
Scribe support evidence collecting and integrity verification for GitLab CI.

## Before you begin
Integrating Scribe Hub with Gitlab requires the following credentials that are found in the product setup dialog (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **Home>Products>[$product]>Setup**)

* **Product Key**
* **Client ID**
* **Client Secret**

> Note that the product key is unique per product, while the client ID and secret are unique for your account.

# Procedure

* Store credentials using [GitLab  project variable](https://docs.gitlab.com/ee/ci/variables/#add-a-cicd-variable-to-a-project) 

* Open your GitLab project and make sure you have a yaml file named `.gitlab-ci.yml`
As an example update it to contain the following steps:

```yaml
image: ubuntu:latest
before_script:
  - apt update
  - apt install git curl -y
  - curl -sSfL http://get.scribesecurity.com/install.sh | sh -s -- -b /usr/local/bin

stages:
    - scribe-gitlab-simple-test


scribe-gitlab-simple-job:
    stage: scribe-gitlab-simple-test
    script:
      - &gt;-
        valint bom busybox:latest -vv
```

## 
# Examples

<details>
  <summary>  Scribe integrity report - full gitlab ci workflow (binary) </summary>

  ```yaml
  image: ubuntu:latest
  before_script:
    - apt update
    - apt install git curl -y
    - curl -sSfL http://get.scribesecurity.com/install.sh | sh -s -- -b /usr/local/bin

  stages:
      - scribe-gitlab-simple-test

  scribe-gitlab-simple-job:
      tags: [ saas-linux-large-amd64 ]
      stage: scribe-gitlab-simple-test
      script:
        - &gt;-
          valint bom dir:mongo-express-scm \
              --context-type gitlab \
              --output-directory ./scribe/valint \
              --product-key $PRODUCT_KEY \
              -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
              --scribe.login-url $SCRIBE_LOGIN_URL --scribe.auth.audience $SCRIBE_AUDIENCE --scribe.url $SCRIBE_URL \
              -vv
        - &gt;-
          valint bom mongo-express:1.0.0-alpha.4 \
              --context-type gitlab \
              --output-directory ./scribe/valint \
              --product-key $PRODUCT_KEY \
              -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
              --scribe.login-url $SCRIBE_LOGIN_URL --scribe.auth.audience $SCRIBE_AUDIENCE --scribe.url $SCRIBE_URL \
              -vv
        - &gt;-
          valint report \
              --context-type gitlab \
              --product-key $PRODUCT_KEY \
              -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET --output-directory scribe/valint \
              --scribe.login-url $SCRIBE_LOGIN_URL --scribe.auth.audience $SCRIBE_AUDIENCE --scribe.url $SCRIBE_URL \
              --timeout 120s \
              -vv

  ```

</details>

---

## Resources

[Gitlab CI Jobs Page](https://docs.gitlab.com/ee/ci/) - Github CI docs.
