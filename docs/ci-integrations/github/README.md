---
sidebar_position: 2
---

# GitHub Actions

This action includes *gensbom* - the tool creating the *SBOM*.

*gensbom* has other capabilities and CLI options but the simplest integration is to call it to create an *SBOM* of the repository and the final image. these *SBOMs* are then automatically uploaded to Scribe Hub.

For the integration to work, you must first set the repository-specific secrets provided for you on the <a href='https://beta.hub.scribesecurity.com'>'add project'</a> page. Of the provided secrets, `clientid` and `clientsecret` are identical for all your future projects and `productkey` is unique for this particular project only.

## Creating encrypted secrets for a repository

The instructions on how to configure secrets in GitHub can be found in the GitHub documentation <a href='https://docs.github.com/en/actions/security-guides/encrypted-secrets'>here</a>. For your convenience, we present the instructions here as well.

To create secrets for a personal account repository, you must be the repository owner. To create secrets for an organization repository, you must have `admin` access.

1. On GitHub.com, navigate to the main page of the repository.
2. Under your repository name, click <b>Settings</b>. <img src='../../../img/ci/repo-actions-settings.png' alt='Settings' width="100%"/>
3. In the left sidebar, click <b>Secrets</b>.
4. Click <b>New repository secret</b>.
5. Type a name for your secret in the <b>Name</b> input box.
6. Enter the value for your secret.
7. Click <b>Add secret</b>.

If your repository has environment secrets or can access secrets from the parent organization, then those secrets are also listed on this page.

## Scribe *SBOM* upload - full pipeline example

This is a full workflow example, connecting your pipeline to Scribe Hub and uploading evidence using *gensbom*.

In this example pipeline, the YAML file does a checkout on a docker image, creates an *SBOM* for it from the local repository, and creates another *SBOM* from the docker image. In this example the project used is `mongo-express`.  

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
           scribe-clientid: ${{ secrets.clientid }}
           scribe-clientsecret: ${{ secrets.clientsecret }}
           scribe-productkey: ${{ secrets.productkey }}

      - name: Build and push remote
        uses: docker/build-push-action@v2
        with:
          context: .
          push: true
          tags: mongo-express:1.0.0-alpha.4

      - name: Gensbom Image generate bom, upload to scribe
        id: gensbom_bom_image
        uses: scribe-security/actions/gensbom/bom@master
        with:
           target: 'mongo-express:1.0.0-alpha.4'
           verbose: 2
           scribe-enable: true
           scribe-clientid: ${{ secrets.clientid }}
           scribe-clientsecret: ${{ secrets.clientsecret }}
           scribe-productkey: ${{ secrets.productkey }}

      - uses: actions/upload-artifact@v2
        with:
          name: scribe-reports
          path: |
            ${{ steps.gensbom_bom_scm.outputs.OUTPUT_PATH }}
            ${{ steps.gensbom_bom_image.outputs.OUTPUT_PATH }}
            ${{ steps.valint_report.outputs.OUTPUT_PATH }}
```