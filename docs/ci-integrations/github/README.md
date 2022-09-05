---
sidebar_position: 2
sidebar_label: GitHub Actions
---

# GitHub Actions

## Before you begin

Integrating Scribe Hub with Jenkins requires the following credentials that are found in the product setup dialog (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to Home>Products>[$product]>Setup)

* **product key**
* **client id**
* **client secret**

>Note that the product key is unique per product, while the client id and secret are unique for your account.

## Gensbom - Creating your SBOM
*Gensbom* is Scribe Hubs' tool used to collect evidence and generate an SBOM.

The simplest integration is to automate calling Scribe to collect evidence of the repository and create an SBOM of the final image. The evidence and SBOM are then automatically uploaded to Scribe Hub. 
While *Gensbom* does have other capabilities and CLI options, we will focus on its' basic usage.


1. Add the credentials according to the [GitHub instructions](https://docs.github.com/en/actions/security-guides/encrypted-secrets/ "GitHub Instructions"). Based on the code example below be sure to call the secrets **clientid** for the **client-id**, **clientsecret** for the           **client-secret** and **productkey** for the **product-key**.
2. Add Code snippets to your pipeline from your GitHub flow:   
    * Replace the `Mongo express` repo in the example with your repo name.
    ```YAML
      target: <repo-name>
    ```
    * Call `gensbom` right after checkout to collect hash value evidence of the source code files.
    ```YAML
      - name: Gensbom Scm generate bom, upload to scribe
        id: gensbom_bom_scm
        uses: scribe-security/actions/gensbom/bom@master
        with:
           type: dir
           target: <repo-name>
           verbose: 2
           scribe-enable: true
           scribe-client-id: ${{ secrets.clientid }}
           scribe-client-secret: ${{ secrets.clientsecret }}
           product-key: ${{ secrets.productkey }}
    ```
    * Call `gensbom` to generate an SBOM from the final Docker image.
    ```YAML
        - name: Gensbom Image generate bom, upload to scribe
        id: gensbom_bom_image
        uses: scribe-security/actions/gensbom/bom@master
        with:
          type: docker # To be included only if you want to to use docker daemon to access the image (for example, creating your docker image locally)
           target: <image-name:tag>
           verbose: 2
           scribe-enable: true
           scribe-client-id: ${{ secrets.clientid }}
           scribe-client-secret: ${{ secrets.clientsecret }}
           product-key: ${{ secrets.productkey }}
    ```

Here's the full example pipeline:

```YAML
name: example workflow

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

      # Build and push your image - this example skips this step as we're using the published mongo express.
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

      - uses: actions/upload-artifact@v2
        with:
          name: scribe-reports
          path: |
            ${{ steps.gensbom_bom_scm.outputs.OUTPUT_PATH }}
            ${{ steps.gensbom_bom_image.outputs.OUTPUT_PATH }}
```
