<p><a target="_blank" href="https://app.eraser.io/workspace/z8DjjAq0ukFLBHWKyjm1" id="edit-in-eraser-github-link"><img alt="Edit in Eraser" src="https://firebasestorage.googleapis.com/v0/b/second-petal-295822.appspot.com/o/images%2Fgithub%2FOpen%20in%20Eraser.svg?alt=media&amp;token=968381c8-a7e7-472a-8ed6-4a6626da5501"></a></p>

---

## sidebar_label: "Source code integrity"
title: Source code integrity
sidebar_position: 2
toc_min_heading_level: 2
toc_max_heading_level: 5
The integrity of your source code files is of utmost importance. If your source code files are modified without your knowledge, it can indicate potential foul play, as exemplified by the infamous [﻿SolarWinds hack](https://www.techtarget.com/whatis/feature/SolarWinds-hack-explained-Everything-you-need-to-know). 

There are multiple ways in which Scribe can assist you in verifying the integrity of your source code files.

1. Utilize _Valint_ to cryptographically sign your repository after each commit. Then, verify that the signed version and the source code files pulled into your CI/CD at checkout match. For a comprehensive explanation of Valint's sign-verify capabilities go [﻿here](../advanced-guide/standalone-deployment/signVerify) . 
2. Establish a workflow that employs Valint to generate SBOM evidence after each commit. Additionally, create another SBOM evidence once you initiate your source code checkout during the CI/CD pipeline. Once the build is complete, Scribe will compare the checkout SBOM to the SBOM of the relevant commit. If they match, all the files will be displayed as matching. However, if any mismatches occur, you will receive an alert indicating the files that don't match. If there is no commit SBOM or there is no checkout SBOM Scribe simply doesn't preform an integrity check as there is nothing to compare.
# How does it work
Here's an example yaml workflow for creating a signed SBOM using _Valint_ after each commit. Notice the label flag with "_is_git_commit_".

```yaml
name: Create signed git commit sbom
on: push
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
         scribe-client-secret: ${{ secrets.CLIENT_SECRET }}
        label: is_git_commit
        format: attest
```
To learn more about how _Valint_ is used to sign evidence and about `sigstore-github`, check out _Valint_'s sign-verify [﻿page](../guides/securing-builds).

To create an SBOM of your checkout repo you need to use _Valint_ again right after your CI/CD checkout. As this step is dependent on your CI/CD platform I encourage you to go to our [﻿CI Integrations page](../integrating-scribe/ci-integrations) to see what we can offer.

As an example, here's what you need to do in a general pipeline where you use CLI commands:

- **Source Code Checkout**: Calling `valint`  at this point will collect evidence from the source code files hash values to facilitate the Scribe integrity validation.
```
$HOME/.scribe/bin/valint bom dir:<path> --scribe.client-id=$CLIENT-ID \
--scribe.client-secret=$CLIENT-SECRET -E -f -v
```
- **Final built image**: Generating SBOM right after the final Docker image is created. This is the main and **_mandatory_** point.
```
$HOME/.scribe/bin/valint bom <your_docker_repository:tag> --scribe.client-id=$CLIENT-ID \
--scribe.client-secret=$CLIENT-SECRET -E -f -v
--supplier-phone $SUPPLIER-PHONE
```
After the image is built and the evidence collected is sent to the Scribe platform our backend will compare the checkout SBOM with the SBOM from the relevant commit. Scribe matches the checkout SBOM to the commit SBOM by comparing the commit id (also known as a commit hash) that is present in each SBOM we create. Another important point is that the commit SBOM and the checkout SBOM should be from different pipeline runs. If any of these SBOMs isn't found Scribe would simply skip this integrity check.

The result would appear as part of your project icon:

![Project integrity example](../../../img/ci/integrity-validated-1.jpg "")

This is how a specific validated build run would look:

![build integrity example](../../../img/ci/integrity-validated-3.jpg "")

In this example the project's source code integrity has been validated. If there is a problem you'll see this result:

![Project integrity modified example](../../../img/ci/integrity-modified-1.jpg "")

And this is how a specific modified build run would look:

![build integrity modified example](../../../img/ci/integrity-modified-2.jpg "")

Clicking on the build run displays the breakdown of the integrity analysis.



<!--- Eraser file: https://app.eraser.io/workspace/z8DjjAq0ukFLBHWKyjm1 --->