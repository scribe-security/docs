---
sidebar_label: "Source Code integrity"
title: Source Code integrity
sidebar_position: 3
---

The integrity of your source code files is of utmost importance. If your source code files are modified without your knowledge, it can indicate potential foul play, as exemplified by the infamous **[SolarWinds hack](https://www.techtarget.com/whatis/feature/SolarWinds-hack-explained-Everything-you-need-to-know "SolarWinds hack explained")**. 

There are multiple ways in which Scribe can assist you in verifying the integrity of your source code files.

1. Utilize *Valint* to cryptographically sign your repository after each commit. Then, verify that the signed version and the source code files pulled into your CI/CD at checkout match. For a comprehensive explanation of Valint's sign-verify capabilities go **[here](../../../../docs/how-to-run-scribe/signVerify "Signing And Verifying Evidence")**. 

2. Establish a workflow that employs Valint to generate SBOM evidence after each commit. Additionally, create another SBOM evidence once you initiate your source code checkout during the CI/CD pipeline. Once the build is complete, Scribe will compare the checkout SBOM to the SBOM of the relevant commit. If they match, all the files will be displayed as matching. However, if any mismatches occur, you will receive an alert indicating the files that don't match. If there is no commit SBOM or there is no checkout SBOM Scribe simply doesn't preform an integrity check as there is nothing to compare. 

### How does it work

Here's an example yaml workflow for creating a signed SBOM using *Valint* after each commit. Notice the label flag with "*is_git_commit*".

```yaml
name: Create signed git commit sbom

on: push

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

build:
    runs-on: ubuntu-latest

    permissions:
      id-token: write # workload identity access needed for signing using sigstore-github 

    steps:
    - uses: actions/checkout@v3

    - name: Generate signed git SBOM
      uses: scribe-security/action-bom@master
      with:
        target: 'git:.'
        scribe-enable: true
        product-key: ${{ github.repository }}
        scribe-client-id: ${{ secrets.CLIENT_ID }}
        scribe-client-secret: ${{ secrets.CLIENT_SECRET }}
        app-name: $LOGICAL_APP_NAME
        app-version: $APP_VERSION
        author-name: $AUTHOR_NAME
        author-email: $AUTHOR_EMAIL
        author-phone: $AUTHOR_PHONE
        supplier-name: $SUPPLIER_NAME
        supplier-url: $SUPPLIER_URL
        supplier-email: $SUPPLIER_EMAIL 
        supplier-phone: $SUPPLIER_PHONE
        label: is_git_commit
        format: attest
```

To learn more about how *Valint* is used to sign evidence and about `sigstore-github`, check out *Valint*'s sign-verify **[page](../../../../docs/how-to-run-scribe/signVerify "Signing And Verifying Evidence")**.

To create an SBOM of your checkout repo you need to use *Valint* again right after your CI/CD checkout. As this step is dependent on your CI/CD platform I encourage you to go to our **[CI Integrations page](../../../../docs/how-to-run-scribe/ci-integrations "CI Integrations")** to see what we can offer.

As an example, here's what you need to do in a general pipeline where you use CLI commands:

* **Source Code Checkout**: Calling `valint` at this point will collect evidence from the source code files hash values to facilitate the Scribe integrity validation. 

```
$HOME/.scribe/bin/valint bom dir:<path> --scribe.client-id=$CLIENT-ID \
--scribe.client-secret=$CLIENT-SECRET -E -f -v \ 
--logical-app-name $LOGICAL-APP-NAME --app-version $APP-VERSION \
--author-name $AUTHOR-NAME --author-email AUTHOR-EMAIL --author-phone $AUTHOR-PHONE \
--supplier-name $SUPPLIER-NAME --supplier-url $SUPPLIER-URL --supplier-email $SUPPLIER-EMAIL \ 
--supplier-phone $SUPPLIER-PHONE
```

* **Final built image**: Generating SBOM right after the final Docker image is created. This is the main and ___mandatory___ point.  
```
   $HOME/.scribe/bin/valint bom <your_docker_repository:tag> --scribe.client-id=$CLIENT-ID \
   --scribe.client-secret=$CLIENT-SECRET -E -f -v \ 
   --logical-app-name $LOGICAL-APP-NAME --app-version $APP-VERSION \
   --author-name $AUTHOR-NAME --author-email AUTHOR-EMAIL --author-phone $AUTHOR-PHONE \
   --supplier-name $SUPPLIER-NAME --supplier-url $SUPPLIER-URL --supplier-email $SUPPLIER-EMAIL \ 
   --supplier-phone $SUPPLIER-PHONE   
```

After the image is built and the evidence collected is sent to the Scribe platform our backend will compare the checkout SBOM with the SBOM from the relevant commit. Scribe matches the checkout SBOM to the commit SBOM by comparing the commit id (also known as a commit hash) that is present in each SBOM we create. Another important point is that the commit SBOM and the checkout SBOM should be from different pipeline runs. If any of these SBOMs isn't found Scribe would simply skip this integrity check.

The result would appear as part of your project icon:

<!-- <img src='../../../img/ci/integrity.jpg' alt='Project integrity example'/> -->
<img src='../../../../../img/ci/integrity-validated-1.jpg' alt='Project integrity example'/>

This is how a specific validated build run would look:

<img src='../../../../../img/ci/integrity-validated-3.jpg' alt='build integrity example'/>

In this example the project's source code integrity has been validated. If there is a problem you'll see this result:

<img src='../../../../../img/ci/integrity-modified-1.jpg' alt='Project integrity modified example'/>

And this is how a specific modified build run would look:

<img src='../../../../../img/ci/integrity-modified-2.jpg' alt='build integrity modified example'/>

Clicking on the build run displays the breakdown of the integrity analysis.


