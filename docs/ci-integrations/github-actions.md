---
sidebar_position: 1
---

# GitHub Actions

Scribe includes 2 elements in this action:  
*gensbom* - the tool creating the *SBOM* and
*valint* - the tool getting the report.

Both tools have other capabilites and CLI option but the simplest integration is to call  
*gensbom* to create an *SBOM* of the repository and the final image and then, call *valint*  
to get Scribe's integrity report of the result.

Use default configuration path `.gensbom.yaml` to make sure you have set all the input parameters you need.  
At minimum, you need to set the scribe `clientid` and `clientsecret`.  

These credentials can be copied from your <a href='https://beta.hub.scribesecurity.com/producer-products'>CLI page</a>.

```yaml
  scribe-clientid: <scribe-client-id>
    description: 'Scribe client id' 
  scribe-clientsecret: <scribe-access-token>
    description: 'Scribe access token' 
```

Here's usage example for generating an SBOM in GitHub workflow:
```bash
- name: Generate cyclonedx json SBOM
  uses: scribe-security/actions/gensbom/bom@master
  with:
    target: '<target_name:tag>'
    verbose: 2
```
In order to get a valid integrity report you should create 2 *SBOMs*, 1 for your repository source code, and 1 for your final image.
The created *SBOMs* are automatically uploaded to Scribe's backend for integrity analysis.

Here's usage example for calling Scribe's report in GitHub workflow:
```bash
- name: Valint - download report
  id: valint_report
  uses: scribe-security/actions/valint/report@master
  with:
      verbose: 2
      scribe-enable: true
      scribe-clientid: ${{ inputs.clientid }}
      scribe-clientsecret: ${{ inputs.clientsecret }}
```

## Scribe integrity report - full pipeline

Full workflow example, uploading evidence using gensbom and downloading the report using valint.
In this example the final step is to attach the report and evidence to your pipeline run.

This example pipeline YAML does a checkout on a docker image, creates an *SBOM* for it from the local repository, creates another *SBOM* from the docker image and, finally, downloads the integrity report from the Scribe backend. 

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
           scribe-projectid: ${{ secrets.projectid }}

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
           scribe-projectid: ${{ secrets.projectid }}

      - name: Valint - download report
        id: valint_report
        uses: scribe-security/actions/valint/report@master
        with:
           verbose: 2
           scribe-enable: true
           scribe-clientid: ${{ secrets.clientid }}
           scribe-clientsecret: ${{ secrets.clientsecret }}
           scribe-projectid: ${{ secrets.projectid }}

      - uses: actions/upload-artifact@v2
        with:
          name: scribe-reports
          path: |
            ${{ steps.gensbom_bom_scm.outputs.OUTPUT_PATH }}
            ${{ steps.gensbom_bom_image.outputs.OUTPUT_PATH }}
            ${{ steps.valint_report.outputs.OUTPUT_PATH }}
```