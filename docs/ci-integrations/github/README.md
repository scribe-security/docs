---
sidebar_position: 2
sidebar_label: GitHub Actions
---

# Integrating Scribe with your GitHub Actions 

If you are using GitHub Actions as your Continuous Integration tool (CI), use these quick start instructions to integrate Scribe into your pipeline to protect your projects. This is the simplified quick-start guide. To learn more about Scribe's GitHub capabilities check out the following GitHub Actions documentation links:
* [Bom](action-bom.md)
* [Verify](action-verify.md)
* [Installer](action-installer.md)

## Before you begin
### Acquiring credentials from Scribe Hub
Integrating Scribe Hub with GitHub actions requires the following credentials that are found in the product setup dialog. (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **Home>Products>[$product]>Setup**)

* **Product Key**
* **Client ID**
* **Client Secret**

>Note that the product key is unique per product, while the client ID and secret are unique for your account.

## Creating an SBOM and collecting evidence
1. Add the credentials according to the [GitHub instructions](https://docs.github.com/en/actions/security-guides/encrypted-secrets/ "GitHub Instructions"). Based on the code example below, be sure to call the secrets **clientid** for the **client-id**, **clientsecret** for the           **client-secret** and **productkey** for the **product-key**.
2. Add Code snippets to your pipeline from your GitHub flow:   
    * Replace the `Mongo express` repo in the example with your repo name.
    ```YAML
      target: <repo-name>
    ```
    * Call `valint` right after checkout to collect hash value evidence of the source code files.
    ```YAML
      - name: Scm generate bom, upload to scribe
        id: valint_bom_scm
        uses: scribe-security/action-bom@master
        with:
          type: dir
          target: <repo-name>
          scribe-enable: true
          scribe-client-id: ${{ secrets.clientid }}
          scribe-client-secret: ${{ secrets.clientsecret }}
          product-key: ${{ secrets.productkey }}
    ```
    * Call `valint` to generate an SBOM from the final Docker image.
    ```YAML
        - name: Image generate bom, upload to scribe
        id: valint_bom_image
        uses: scribe-security/action-bom@master
        with:
          type: docker # To be included only if you want to to use docker daemon to access the image (for example, creating your docker image locally)
          target: <image-name:tag>
          scribe-enable: true
          scribe-client-id: ${{ secrets.clientid }}
          scribe-client-secret: ${{ secrets.clientsecret }}
          product-key: ${{ secrets.productkey }}
    ```
    <!-- * Call `valint` to get the integrity report results.
    ```YAML
        - name: Valint - download report
        id: valint_report
        uses: scribe-security/action-report@master
        with:
           scribe-enable: true
           scribe-client-id: ${{ secrets.clientid }}
           scribe-client-secret: ${{ secrets.clientsecret }}
           product-key: ${{ secrets.productkey }}
    ```
    Note that the `valint` report will be downloaded to where you have determined in the `valint_report.outputs.OUTPUT_PATH` in the `scribe-reports` step (the last step in the example pipeline).  -->

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

      - name: Scm generate bom, upload to scribe
        id: valint_bom_scm
        uses: scribe-security/action-bom@master
        with:
           type: dir
           target: 'mongo-express-scm'
           scribe-enable: true
           scribe-client-id: ${{ secrets.clientid }}
           scribe-client-secret: ${{ secrets.clientsecret }}
           product-key: ${{ secrets.productkey }}

      # Build and push your image - this example skips this step as we're using the published mongo express.

      - name: Image generate bom, upload to scribe
        id: valint_bom_image
        uses: scribe-security/action-bom@master
        with:
          type: docker # To be included only if you want to to use docker daemon to access the image (for example, creating your docker image locally)
           target: 'mongo-express:1.0.0-alpha.4'
           scribe-enable: true
           scribe-client-id: ${{ secrets.clientid }}
           scribe-client-secret: ${{ secrets.clientsecret }}
           product-key: ${{ secrets.productkey }}

      - uses: actions/upload-artifact@v2
        with:
          name: scribe-reports
          path: |
            ${{ steps.valint_bom_scm.outputs.OUTPUT_PATH }}
            ${{ steps.valint_bom_image.outputs.OUTPUT_PATH }}
```

## Connecting ScribeApp to Your Organizational GitHub Account

To collect security policy information (SLSA and SSDF) from your GitHub pipeline you'll first need to install the Scribe GitHub app in your organizational GitHub account. You'll then need to add the relevant code snippet to your pipeline.

### Where to start

Before you connect to ScribeApp no security policy data will be included in your build version information. To start the integration visit your **[Scribe Hub account](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")**. On the left column go to the **integrations** option.

<img src='../../../img/ci/scribe-beta-integrations.jpg' alt='Scribe Integrations' width='20%' min-width='150px'/> 

Once you click on **integrations** you'll get to a page that includes links to all possible environments you could possibly integrate with Scribe Hub.
If you scroll down a bit you'd get to the **Source Control** section:

<img src='../../../img/ci/scribe-beta-source-control-integrations.jpg' alt='Source Control' width='20%' min-width='150px'/> 

To continue press the **connect** link designed to connect ScribeApp to your GitHub organization's account. That will lead you to a page like this:

<img src='../../../img/ci/install_scribeapp.jpg' alt='Install ScribeApp' width='50%' min-width='500px'/>

Choose the GitHub account you want to integrate the ScribeApp with. Make sure you have owner access to the account to allow the app integration.
Make sure the account is organizational - the integration won't work with a private account.

Once you have chosen the account you wish to integrate with ScribeApp GitHub will present the following window. 

<img src='../../../img/ci/install_scribeapp_github.jpg' alt='Install ScribeApp Integration' width='50%' min-width='500px'/>

Choose the access level you wish to grant ScribeApp. You can choose to allow it access to all repositories or just select repositories. Note that repositories that are not covered by the ScribeApp will not be able to produce the SLSA provenance. 

After reviewing the access granted to ScribeApp go ahead and approve it by pressing the big green button.

<img src='../../../img/ci/green_button.jpg' alt='Green button' width='20%' min-width='150px'/> 

Next, you'll be directed to GitHub to approve your access by inputting your password. 

<img src='../../../img/ci/approve_access.jpg' alt='Approve access' width='30%' min-width='300px'/>

As soon as you provide your password GitHub will handle everything else and redirect you back to the **integrations** page. Note that now there is a green checkmark next to the GitHub icon:

<img src='../../../img/ci/github_integrated.jpg' alt='Approve access' width='20%' min-width='150px'/> 

Once you integrated the ScribeApp with your organizational GitHub account all available security policies (SLSA, SSDF) will be running automatically every time you run a build.

You can turn the SLSA policy off or on for each project at any time, assuming that the project's repository is covered by ScribeApp. Note that even if you have turned on the policy you won't see any SLSA provenance results until you have integrated Scribe's code snippet into your pipeline and have run the action.

If anything isn't clear you can check out the GitHub instruction page for <a href='https://docs.github.com/en/developers/apps/managing-github-apps/installing-github-apps'>installing GitHub Apps</a>.

### Generating the SLSA provenance in your pipeline

1. Add the project credential according to the [GitHub instructions](https://docs.github.com/en/actions/security-guides/encrypted-secrets/ "GitHub Instructions"). Based on the code example below, be sure to call the secret **productkey** for the **product-key**.
2. Add the Code snippet to your pipeline from your GitHub flow:   
    * Call `valint` to generate SLSA provenance from the final Docker image.
    ```YAML
        - name: Generate SLSA provenance statement
        id: valint_slsa_statement
        uses: scribe-security/action-bom@master
        with:
          target: <image-name:tag>
          format: statement-slsa
          product-key: ${{ secrets.productkey }}

        -uses: actions/upload-artifact@v2
        with:
          name: provenance
          path: ${{ steps.valint_slsa_statement.outputs.OUTPUT_PATH }}
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

      - name: Generate SLSA provenance statement
        id: valint_slsa_statement
        uses: scribe-security/action-bom@master
        with:
          target: mongo-express:1.0.0-alpha.4
          format: statement-slsa
          product-key: ${{ secrets.productkey }

      -uses: actions/upload-artifact@v2
      with:
        name: provenance
        path: ${{ steps.valint_slsa_statement.outputs.OUTPUT_PATH }}
```

This code snippet generates a SLSA provenance file for the artifact it is run on, usually an image. To see that provenance information you need to go to the **Actions** tab in your GitHub repository.

<img src='../../../img/ci/actions_tab.jpg' alt='Actions tab' width='70%' min-width='750px'/> 

There you can examine the workflows and actions you have run on this GutHub repository. Once you have run a workflow that includes the SLSA provenance generation you'll be able to find the resulting file at the bottom of the page:

<img src='../../../img/ci/slsa_provenance.jpg' alt='SLSA provenance file' width='70%' min-width='750px'/>

The provenance information is in <a href='../glossary.md#in-toto'>in-toto</a> format and looks like this:

<img src='../../../img/ci/slsa_provenance_intoto.jpg' alt='SLSA Provenance in-toto format' width='70%' min-width='750px'/>

### Checking the SLSA policy for your project

To see the results of the SLSA policy you have enacted on your project you can look at the product build where you will now see some results in the SLSA compliance column:

<img src='../../../img/ci/slsa_compliance.jpg' alt='SLSA Compliance Column'/>

When you click on a build to get to the full results you'll see a new option - **Policies Compliance**:

<img src='../../../img/ci/policies_compliance.jpg' alt='Policies Compliance' width='40%' min-width='400px'/>

clicking the **more** link will open the policies report where you can see each of the policies checked and whether they have passed or failed for this run of the workflow.

<img src='../../../img/ci/policies_compliance_more.jpg' alt='Policies Compliance Full List'/>

There are 22 SLSA policies that Scribe checks and if all of them are checkout out (pass) that means that the build is approved for SLSA level 3.

To learn more about each policy you can either click on them or see the explanation page [here](../../slsapolicies.md).




