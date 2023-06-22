---
title: Source code integrity
sidebar_position: 1
---

# Source code integrity

The integrity of your source code files is of utmost importance. If your source code files are modified without your knowledge, it can indicate potential foul play, as exemplified by the infamous [SolarWinds hack](https://www.techtarget.com/whatis/feature/SolarWinds-hack-explained-Everything-you-need-to-know "SolarWinds hack explained"). 

There are multiple ways in which Scribe can assist you in verifying the integrity of your source code files.

1. Utilize *Valint* to cryptographically sign your repository after each commit. Then, verify that the signed version and the source code files pulled into your CI/CD at checkout match. For a comprehensive explanation of Valint's sign-verify capabilities go [here](../../docs/signVerify "Signing And Verifying Evidence"). 

2. Establish a workflow that employs Valint to generate SBOM evidence after each commit. Additionally, create another SBOM evidence once you initiate your source code checkout during the CI/CD pipeline. Once the build is complete, Scribe will compare the checkout SBOM to the SBOM of your last commit. If they match, all the files will be displayed as matching. However, if any mismatches occur, you will receive an alert indicating the files that don't match.

# How does it work

Here's an example yaml workflow for creating a signed SBOM using *Valint* after each commit. Notice the label flag with "*is_git_commit*".

```yaml
name: Create signed git commit sbom

on:
  workflow_dispatch:
#   push:
#     branches: [ "main" ]

env:
  IMAGE_NAME: ${{ github.repository }}:${{ github.sha }}

jobs:

  build:
    runs-on: ubuntu-latest

    permissions:
      contents: read
      packages: write
      id-token: write

    steps:
    - uses: actions/checkout@v3

    - name: Generate signed SBOM for repo content
      uses: scribe-security/action-bom@master
      with:
        target: 'git:.'
        scribe-enable: true
        scribe-login-url: https://$AUTH0_DOMAIN
        scribe-audience: $AUTH0_SCRIBE_SERVICE_AUDIENCE
        scribe-url: $SCRIBE_API_BASE_URI
        product-key: ${{ github.repository }}
        scribe-client-id: ${{ secrets.CLIENT_ID }}
        scribe-client-secret: ${{ secrets.CLIENT_SECRET }}
        label: is_git_commit
        format: attest
```

You can run this workflow manually or make it automatic by removing the commenting on the *'push:'* section.

To create an SBOM of your checkout repo you need to use *Valint* again right after your CI/CD checkout. As this step is dependent on your CI/CD platform I encourage you to go to our [CI Integrations page](../../docs/ci-integrations "CI Integrations") to see what we can offer.

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

After the image is built and the evidence collected is sent to the Scribe platform our backend will compare the checkout SBOM with the SBOM from the latest commit.

The result would appear as part of your project icon:

<img src='../../../img/ci/integrity.jpg' alt='Project integrity example'/>

In this example the project's integrity has been validated. If there is a problem you'll see a large red <span style={{"color": "red"}}><b>'X'</b></span>.

Pressing on the icon would show you the break down of the integrity analysis.


