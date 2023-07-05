---
title: Source code integrity
sidebar_position: 1
---

# Source code integrity

The integrity of your source code files is of utmost importance. If your source code files are modified without your knowledge, it can indicate potential foul play, as exemplified by the infamous [SolarWinds hack](https://www.techtarget.com/whatis/feature/SolarWinds-hack-explained-Everything-you-need-to-know "SolarWinds hack explained"). 

There are multiple ways in which Scribe can assist you in verifying the integrity of your source code files.

1. Utilize *Valint* to cryptographically sign your repository after each commit. Then, verify that the signed version and the source code files pulled into your CI/CD at checkout match. For a comprehensive explanation of Valint's sign-verify capabilities go [here](../../docs/signVerify "Signing And Verifying Evidence"). 

2. Establish a workflow that employs Valint to generate SBOM evidence after each commit. Additionally, create another SBOM evidence once you initiate your source code checkout during the CI/CD pipeline. Once the build is complete, Scribe will compare the checkout SBOM to the SBOM of the relevant commit. If they match, all the files will be displayed as matching. However, if any mismatches occur, you will receive an alert indicating the files that don't match. If there is no commit SBOM or there is no checkout SBOM Scribe simply doesn't preform an integrity check as there is nothing to compare. 

# How does it work

Source code integrity requires three SBOMs that share the same commit hash and are produced inside two different workflows, in this sequence: 

1. The first workflow produces git_commit SBOM and is automatically triggered on push (only once per commit and should never be triggered manually). Here's an example yaml workflow for creating a signed SBOM using *Valint* upon commit. Notice the label flag with "*is_git_commit*".

```yaml
name: Create signed git commit sbom

on:
  workflow_dispatch:
  push:
    branches:
      - master

jobs:
  checkout-sign:
    runs-on: ubuntu-latest
    permissions:
      id-token: write # workload identity access needed for signing using sigstore-github 

    steps:
    - uses: actions/checkout@v3

    - name: Generate signed SBOM for repo content
      uses: scribe-security/action-bom@master
      with:
        target: 'git:.'
        scribe-enable: true
        product-key: ${{ github.repository }}
        scribe-client-id: ${{ secrets.CLIENT_ID }}
        scribe-client-secret: ${{ secrets.CLIENT_SECRET }}
        label: is_git_commit
        format: attest
```

To learn more about how *Valint* is used to sign evidence and about `sigstore-github`, check out *Valint*'s sign-verify [page](../../docs/signVerify "Signing And Verifying Evidence").

The git_commit SBOM is "guaranteed to be valid", is produced once per commit, in a dedicated and highly protected workflow that requires elevated permission to be modified. It is labeled using "*is_git_commit*" to denote that git_clone SBOMs sharing the same commit hash should be validated against this git_commit.

2. The second workflow produces *git_clone* and *image* in a sequence (inside the same pipeline run). To create an SBOM of your checkout repo you need to use *Valint* again right after your CI/CD checkout (the *git_clone*). As this step is dependent on your CI/CD platform I encourage you to go to our [CI Integrations page](../../docs/ci-integrations "CI Integrations") to see what we can offer.

The *git_clone* SBOM should be produced immediately after checkout and before the image was built. It shares the commit hash of the *git_commit* SBOM but isn't labeled with *is_git_commit*.

As an example, here's what you need to do in a general pipeline where you use CLI commands:

* **Source Code Checkout**: Calling `valint` at this point will collect evidence from the source code files hash values to facilitate the Scribe integrity validation. 

```
$HOME/.scribe/bin/valint bom dir:<path> --scribe.client-id=$CLIENT-ID \
--scribe.client-secret=$CLIENT-SECRET -E -f -v
```

* **Final built image**: Generating SBOM right after the final Docker image is created. This is the main and ___mandatory___ point.  
```
   $HOME/.scribe/bin/valint bom <your_docker_repository:tag> --scribe.client-id=$CLIENT-ID \
   --scribe.client-secret=$CLIENT-SECRET -E -f -v
```

At the end of the second workflow an *image* SBOM is created. It shares the commit hash of the *git_clone* and *git_commit* which preceded it and is produced in the same pipeline and immediately after the *git_clone*.
After the image is built and the evidence collected is sent to the Scribe platform our backend will compare the checkout SBOM with the SBOM from the relevant commit. If any of these SBOMs isn't found Scribe would simply skip this integrity check.

The result would appear as part of your project icon:

<img src='../../../img/ci/integrity.jpg' alt='Project integrity example'/>

In this example the project's source code integrity has been validated. If there is a problem you'll see a large red <span style={{"color": "red"}}><b>'X'</b></span>.

Clicking on the icon displays the breakdown of the integrity analysis.


