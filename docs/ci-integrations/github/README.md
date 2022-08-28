---
sidebar_position: 2
---

# GitHub Actions

:::info Note:
The configuration requires <em><b>product-key</b></em>, <em><b>client-id</b></em>, and <em><b>client-secret</b></em> credentials obtained from your Scribe hub account at: `Home>Products>[$your_product]>Setup`

Or when you add a new product.
:::

This action includes *gensbom* - the tool creating the *SBOM*.

*gensbom* has other capabilities and CLI options but the simplest integration is to call it to create an *SBOM* of the repository and the final image. these *SBOMs* are then automatically uploaded to Scribe Hub.

## Step 1: Add the credentials to GitHub

Add the credentials according to the GitHub instructions <a href='https://docs.github.com/en/actions/security-guides/encrypted-secrets'>here</a>.  

## Step 2: Call Scribe *gensbom* action from your GitHub workflow

The following example workflow builds project mongo express and calls Scribe *gensbom* twice: after checkout and after the docker image is built.

```YAML
name: example workflow

env:
  LOGIN_URL: "https://scribesecurity-beta.us.auth0.com"
  AUTH: "api.beta.scribesecurity.com"
  SCRIBE_URL: "https://api.beta.scribesecurity.com"

on: 
  push:
    tags:
      - "*"

jobs:
  scribe-report-test:
    runs-on: ubuntu-latest
    steps:

      - uses: actions/checkout@v2
        with:
          fetch-depth: 0

      - uses: actions/checkout@v3
        with:
          repository: mongo-express/mongo-express
          ref: refs/tags/v1.0.0-alpha.4
          path: mongo-express-scm

      - name: Gensbom Scm generate bom, upload to scribe
        id: gensbom_bom_scm
        uses: scribe-security/actions/gensbom/bom@master
        with:
           type: dir
           target: 'mongo-express-scm'
           verbose: 2
           scribe-enable: true
           scribe-client-id: ${{ secrets.clientid }}
           scribe-client-secret: ${{ secrets.clientsecret }}
           product-key: ${{ secrets.productkey }}
           scribe-login-url: ${{ env.LOGIN_URL }}
           scribe-audience: ${{ env.AUTH }}
           scribe-url: ${{ env.SCRIBE_URL }}

      # Build a push your image - example skips this as where using the published mongo express.
      # - name: Build and push remote
      #   uses: docker/build-push-action@v2
      #   with:
      #     context: .
      #     push: true
      #     tags: mongo-express:1.0.0-alpha.4

      - name: Gensbom Image generate bom, upload to scribe
        id: gensbom_bom_image
        uses: scribe-security/actions/gensbom/bom@master
        with:
          type: docker # To be included only if you want to to use docker daemon to access the image (for example, creating your docker image locally)
           target: 'mongo-express:1.0.0-alpha.4'
           verbose: 2
           scribe-enable: true
           scribe-client-id: ${{ secrets.clientid }}
           scribe-client-secret: ${{ secrets.clientsecret }}
           product-key: ${{ secrets.productkey }}
           scribe-login-url: ${{ env.LOGIN_URL }}
           scribe-audience: ${{ env.AUTH }}
           scribe-url: ${{ env.SCRIBE_URL }}

      - uses: actions/upload-artifact@v2
        with:
          name: scribe-reports
          path: |
            ${{ steps.gensbom_bom_scm.outputs.OUTPUT_PATH }}
            ${{ steps.gensbom_bom_image.outputs.OUTPUT_PATH }}
```