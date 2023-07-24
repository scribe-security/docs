---
sidebar_label: "GitHub Actions"
title: Integrating Scribe with your GitHub Actions
sidebar_position: 1
toc_min_heading_level: 2
toc_max_heading_level: 5
---

If you are using GitHub Actions as your Continuous Integration tool (CI), use these quick start instructions to integrate Scribe into your pipeline to protect your projects. 

<!-- This is the simplified quick-start guide. To learn more about Scribe's GitHub capabilities check out the following GitHub Actions documentation links:
* **[Bom](../../../../docs/integrating-scribe/ci-integrations/github/action-bom)**
* **[Verify](../../../../docs/integrating-scribe/ci-integrations/github/action-verify)**
* **[Installer](../../../../docs/integrating-scribe/ci-integrations/github/action-installer)** -->

### Target types - `[target]`
---
Target types are types of artifacts produced and consumed by your supply chain.
Using supported targets, you can collect evidence and verify compliance on a range of artifacts.

> Fields specified as [target] support the following format.

### Format

`[scheme]:[name]:[tag]` 

> Backwards compatibility: It is still possible to use the `type: [scheme]`, `target: [name]:[tag]` format.

| Sources | target-type | scheme | Description | example
| --- | --- | --- | --- | --- |
| Docker Daemon | image | docker | use the Docker daemon | docker:busybox:latest |
| OCI registry | image | registry | use the docker registry directly | registry:busybox:latest |
| Docker archive | image | docker-archive | use a tarball from disk for archives created from "docker save" | image | docker-archive:path/to/yourimage.tar |
| OCI archive | image | oci-archive | tarball from disk for OCI archives | oci-archive:path/to/yourimage.tar |
| Remote git | git| git | remote repository git | git:https://github.com/yourrepository.git |
| Local git | git | git | local repository git | git:path/to/yourrepository | 
| Directory | dir | dir | directory path on disk | dir:path/to/yourproject | 
| File | file | file | file path on disk | file:path/to/yourproject/file | 

### Evidence Stores
Each storer can be used to store, find and download evidence, unifying all the supply chain evidence into a system is an important part to be able to query any subset for policy validation.

| Type  | Description | requirement |
| --- | --- | --- |
| scribe | Evidence is stored on scribe service | scribe credentials |
| OCI | Evidence is stored on a remote OCI registry | access to a OCI registry |

### Scribe Evidence store
Scribe evidence store allows you to store evidence using scribe Service.

Related Flags:
> Note the flag set:
>* `scribe-client-id`
>* `scribe-client-secret`
>* `scribe-enable`

### Before you begin
Integrating Scribe Hub with your environment requires the following credentials that are found on the **Integrations** page. (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **integrations**)

* **Client ID**
* **Client Secret**

<img src='../../../../img/ci/integrations-secrets.jpg' alt='Scribe Integration Secrets' width='70%' min-width='400px'/>

* Add the credentials according to the **[GitHub instructions](https://docs.github.com/en/actions/security-guides/encrypted-secrets/ "GitHub Instructions")**. Based on the code example below, be sure to call the secrets **clientid** for the **client_id**, and **clientsecret** for the **client_secret**.

* Use the Scribe custom pipe as shown in the example bellow

### Usage

```yaml
name:  scribe_github_workflow

env:
  LOGICAL_APP_NAME: demo-project # The app name all these SBOMs will be assosiated with
  APP_VERSION: 1.0.1 # The app version all these SBOMs will be assosiated with
  # SBOM Author meta data - Optional
  AUTHOR_NAME: John-Smith 
  AUTHOR_EMAIL: jhon@thiscompany.com 
  AUTHOR_PHONE: 555-8426157 
  # SBOM Supplier meta data - Optional
  SUPPLIER_NAME: Scribe-Security 
  SUPPLIER_URL: www.scribesecurity.com 
  SUPPLIER_EMAIL: info@scribesecurity.com
  SUPPLIER_PHONE: 001-001-0011

on: 
  push:
    tags:
      - "*"

jobs:
  scribe-sign-verify:
    runs-on: ubuntu-latest
    steps:

        uses: scribe-security/action-bom@master
        with:
          target: [target]
          format: [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic]
          scribe-enable: true
          scribe-client-id: ${{ secrets.clientid }}
          scribe-client-secret: ${{ secrets.clientsecret }}
          app-name: $LOGICAL_APP_NAME
          app-version: $APP_VERSION
          author-name: $AUTHOR_NAME
          author-email: $AUTHOR_EMAIL
          author-phone: $AUTHOR_PHONE
          supplier-name: $SUPPLIER_NAME
          supplier-url: $SUPPLIER_URL
          supplier-email: $SUPPLIER_EMAIL 
          supplier-phone: $SUPPLIER_PHONE

        uses: scribe-security/action-verify@master
        with:
          target: [target]
          format: [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic]
          scribe-enable: true
          scribe-client-id: ${{ secrets.clientid }}
          scribe-client-secret: ${{ secrets.clientsecret }}
          app-name: $LOGICAL_APP_NAME
          app-version: $APP_VERSION
          author-name: $AUTHOR_NAME
          author-email: $AUTHOR_EMAIL
          author-phone: $AUTHOR_PHONE
          supplier-name: $SUPPLIER_NAME
          supplier-url: $SUPPLIER_URL
          supplier-email: $SUPPLIER_EMAIL 
          supplier-phone: $SUPPLIER_PHONE
```

### OCI Evidence store
Valint supports both storage and verification flows for `attestations` and `statement` objects utilizing OCI registry as an evidence store.

Using OCI registry as an evidence store allows you to upload, download and verify evidence across your supply chain in a seamless manner.

Related flags:
* `oci` Enable OCI store.
* `oci-repo` - Evidence store location.

### Before you begin
Evidence can be stored in any accusable registry.
* Write access is required for upload (generate).
* Read access is required for download (verify).

You must first log in with the required access privileges to your registry before calling Valint.
For example, using `docker login` command or `docker/login-action` action.

### Usage
```yaml
name:  scribe_github_workflow

env:
  LOGICAL_APP_NAME: demo-project # The app name all these SBOMs will be assosiated with
  APP_VERSION: 1.0.1 # The app version all these SBOMs will be assosiated with
  # SBOM Author meta data - Optional
  AUTHOR_NAME: John-Smith 
  AUTHOR_EMAIL: jhon@thiscompany.com 
  AUTHOR_PHONE: 555-8426157 
  # SBOM Supplier meta data - Optional
  SUPPLIER_NAME: Scribe-Security 
  SUPPLIER_URL: www.scribesecurity.com 
  SUPPLIER_EMAIL: info@scribesecurity.com
  SUPPLIER_PHONE: 001-001-0011

on: 
  push:
    tags:
      - "*"

jobs:
  scribe-sign-verify:
    runs-on: ubuntu-latest
    steps:

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.my_registry }}
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name:  Generate evidence step
        uses: scribe-security/action-bom@master
        with:
          target: [target]
          format: [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic]
          oci: true
          oci-repo: [oci_repo]
          app-name: $LOGICAL_APP_NAME
          app-version: $APP_VERSION
          author-name: $AUTHOR_NAME
          author-email: $AUTHOR_EMAIL
          author-phone: $AUTHOR_PHONE
          supplier-name: $SUPPLIER_NAME
          supplier-url: $SUPPLIER_URL
          supplier-email: $SUPPLIER_EMAIL 
          supplier-phone: $SUPPLIER_PHONE

      - name:  Verify policy step
        uses: scribe-security/action-verify@master
        with:
          target: [target]
          format: [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic]
          oci: true
          oci-repo: [oci_repo]
          app-name: $LOGICAL_APP_NAME
          app-version: $APP_VERSION
          author-name: $AUTHOR_NAME
          author-email: $AUTHOR_EMAIL
          author-phone: $AUTHOR_PHONE
          supplier-name: $SUPPLIER_NAME
          supplier-url: $SUPPLIER_URL
          supplier-email: $SUPPLIER_EMAIL 
          supplier-phone: $SUPPLIER_PHONE
```

### Connecting ScribeApp to Your Organizational GitHub Account

To collect security policy information (SLSA and SSDF) from your GitHub pipeline you'll first need to install the Scribe GitHub app in your organizational GitHub account. You'll then need to add the relevant code snippet to your pipeline.

### Where to start

Before you connect to ScribeApp no security policy data will be included in your build version information. To start the integration visit your **[Scribe Hub account](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")**. On the left column go to the **integrations** option.

<!-- <img src='../../../../img/ci/scribe-beta-integrations-1.jpg' alt='Scribe Integrations' width='20%' min-width='150px'/> 

Once you click on **integrations** you'll get to a page that includes links to all possible environments you could integrate with Scribe Hub.
If you scroll down a bit you'd get to the **Source Control** section:

<img src='../../../../img/ci/scribe-beta-source-control-integrations.jpg' alt='Source Control' width='20%' min-width='150px'/> 

To continue press the **connect** link designed to connect ScribeApp to your GitHub organization's account. That will lead you to a page like this:

<img src='../../../../img/ci/install_scribeapp.jpg' alt='Install ScribeApp' width='50%' min-width='500px'/>

Choose the GitHub account you want to integrate the ScribeApp with. Make sure you have owner access to the account to allow the app integration.
Make sure the account is organizational - the integration won't work with a private account.

Once you have chosen the account you wish to integrate with ScribeApp GitHub will present the following window. 

<img src='../../../../img/ci/install_scribeapp_github.jpg' alt='Install ScribeApp Integration' width='50%' min-width='500px'/>

Choose the access level you wish to grant ScribeApp. You can choose to allow it access to all repositories or just select repositories. Note that repositories that are not covered by the ScribeApp will not be able to produce the SLSA provenance. 

After reviewing the access granted to ScribeApp go ahead and approve it by pressing the big green button.

<img src='../../../../img/ci/green_button.jpg' alt='Green button' width='20%' min-width='150px'/> 

Next, you'll be directed to GitHub to approve your access by inputting your password. 

<img src='../../../../img/ci/approve_access.jpg' alt='Approve access' width='30%' min-width='300px'/>

As soon as you provide your password GitHub will handle everything else and redirect you back to the **integrations** page. Note that now there is a green checkmark next to the GitHub icon:

<img src='../../../../img/ci/github_integrated.jpg' alt='Approve access' width='20%' min-width='150px'/>  -->

**Step 1:** Access Integrations Log in to Scribe Hub. Navigate to the left pane and click on "Integrations".

<img src='../../../../img/start/integrations-start.jpg' alt='Scribe Integrations'/>

**Step 2:** Scroll down to find GitHub among the listed services. Select GitHub and click "Connect". 
        
**Step 3:** You will be redirected to GitHub. Sign in to your GitHub account, select the relevant GitHub organization account, and choose the appropriate repositories.

**Step 4:** Once done, you will be redirected back to Scribe Hub. From this point onwards, Scribe will automatically generate a SLSA and Software Supply Chain Assurance Framework (SSDF) compliance report for every build.

**Step 5:** Review Compliance Report To access these reports, navigate to "Products" in Scribe Hub, select the relevant product, choose the specific version, and click on the "Compliance" tab.

Once you integrated the ScribeApp with your organizational GitHub account all available security policies (SLSA, SSDF) will be running automatically every time you run a build. The SSDF policy does not require anything to run. To run the SLSA policy you'll need to add a code snippet to your pipeline and run the action.

If anything isn't clear you can check out the GitHub instruction page for **<a href='https://docs.github.com/en/developers/apps/managing-github-apps/installing-github-apps'>installing GitHub Apps</a>**.

### Generating the SLSA provenance in your pipeline

1. Add the project credential according to the **[GitHub instructions](https://docs.github.com/en/actions/security-guides/encrypted-secrets/ "GitHub Instructions")**. Based on the code example below, be sure to call the secret **productkey** for the **product-key**.
2. Add the Code snippet to your pipeline from your GitHub flow:   
    * Call `valint` to generate SLSA provenance from the final Docker image.
    ```YAML
        - name: Generate SLSA provenance statement
        id: valint_slsa_statement
        uses: scribe-security/action-bom@master
        with:
          target: <image-name:tag>
          format: statement-slsa

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
  scribe-sign-verify:
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

      -uses: actions/upload-artifact@v2
      with:
        name: provenance
        path: ${{ steps.valint_slsa_statement.outputs.OUTPUT_PATH }}
```

This code snippet generates a SLSA provenance file for the artifact it is run on, usually an image. To see that provenance information you need to go to the **Actions** tab in your GitHub repository.

<img src='../../../../img/ci/actions_tab.jpg' alt='Actions tab' width='70%' min-width='750px'/> 

There you can examine the workflows and actions you have run on this GitHub repository. Once you have run a workflow that includes the SLSA provenance generation you'll be able to find the resulting file at the bottom of the page:

<img src='../../../../img/ci/slsa_provenance.jpg' alt='SLSA provenance file' width='70%' min-width='750px'/>

The provenance information is in <a href='../glossary#in-toto'>in-toto</a> format and looks like this:

<img src='../../../../img/ci/slsa_provenance_intoto.jpg' alt='SLSA Provenance in-toto format' width='70%' min-width='750px'/>

### Checking policy compliance for your project

Assuming you have connected the ScribeApp with your organizational GitHub account and enacted the SLSA provenance generation code snippet as described above, you will be able to see the SLSA compliance breakdown in each of the future builds of the project where you added the code. 
The SSDF compliance will be checked automatically for each project build run after you have connected the ScribeApp with your organizational GitHub account.
The compliance icons can be seen in the product line:

<img src='../../../../img/ci/new-UI-project.jpg' alt='Project Description'/>

When you click on a project you'll get the list of builds. The compliance icons do not appear here:

<img src='../../../../img/ci/new-UI-version-history.jpg' alt='Project Version History'/>

To see the full compliance breakdown, click on a build-line. You'll get to this screen:

<img src='../../../../img/ci/new-UI-version-details.jpg' alt='Project Version Details'/>

To see the full breakdown of policies - exactly which policies have passed or failed, click on the **Compliance** tab and you'll get to this screen:

<img src='../../../../img/ci/new-UI-version-compliance.jpg' alt='Project Version Compliance'/>

There are 12 SLSA policies that Scribe checks and if all of them are checked out (pass) that means that the build is approved for SLSA level 3.

To learn more about each policy you can either click on them or see the explanation page **[here](../../../../docs/advanced-guide/ssc-regulations/slsapolicies)**.

There are 36 SSDF policies that Scribe checks and if all of them are checked out (pass) that means that the build is compliant with the SSDF requirements.

To learn more about each policy you can either click on them or see the explanation page **[here](../../../../docs/advanced-guide/ssc-regulations/ssdfpolicies)**.




