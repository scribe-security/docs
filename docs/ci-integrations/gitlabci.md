---
title: gitlab ci
sidebar_position: 5
---

# Scribe Gitlab CI

You can use gitlab ci
just install use the following example:

```
image: ubuntu:latest
before_script:
  - apt update && apt install git
  - apt install git -y
  - curl -sSfL https://raw.githubusercontent.com/scribe-security/misc/master/install.sh | sh -s -- -b /usr/local/bin

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
            --scribe.login-url https://scribesecurity-staging.us.auth0.com --scribe.auth.audience api.staging.scribesecurity.com --scribe.url https://api.staging.scribesecurity.com \
            -vv
      - >-
        gensbom bom mongo-express:1.0.0-alpha.4 \
            --context-type jenkins \
            --output-directory ./scribe/gensbom \
            --product-key $PRODUCT_KEY \
            -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
            --scribe.login-url=https://scribesecurity-staging.us.auth0.com --scribe.auth.audience=api.staging.scribesecurity.com --scribe.url https://api.staging.scribesecurity.com \
            -vv
      - >-
        valint report \
            --product-key $PRODUCT_KEY \
            -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET --output-directory scribe/valint \
            --scribe.login-url=https://scribesecurity-staging.us.auth0.com --scribe.auth.audience=api.staging.scribesecurity.com --scribe.url https://api.staging.scribesecurity.com \
            --timeout 120s \
            -vv

```

Please make sure you use secret variables for client id, client secret and prodyct key. To avoid revealing secrets
---

## Resources

[Gitlab CI Jobs Page](https://docs.gitlab.com/ee/ci/) - The page where gitlab ci is described.
