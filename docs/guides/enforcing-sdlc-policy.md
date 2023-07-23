---
sidebar_label: "Enforcing SDLC policies"
title: Enforcing SDLC policies
sidebar_position: 3
toc_min_heading_level: 2
toc_max_heading_level: 5
---

You can gather evidence form your SDLC (Software Development Lifecycle) and enforce supply chain policies accordingly in different enforcement points: at end of the build, admission to production, or

## Generating evidence

You can collect the following types of evidence from your software-building process. The evidence is formatted as an [in-toto](https://in-toto.io/) attestation and can be cryptographically signed.

### 1. SBOM

**Step 1:** Install the Valint Plugin.
If you haven’t installed the CI plugin yet, [Install the Scribe Valint plugin in your CI system](../integrating-scribe/ci-integrations/). 

**Step 2:** Basic Integration for SBOM Generation
As a basic integration step, generate an SBOM from the final built artifact such as a docker image. Use the following command either from the command line or in your build script immediately after the artifact is built:

```
valint bom <target> <flags>
```

Here, `<target>` refers to a build artifact of either a container image, file or file directory, or a git repo, formatted as either `<image:tag>`, `<dir path>`, or `<git url>`.

**Example:**
```
valint bom my_image:my_tag
```

**Step 3:** Advanced SBOM Generation
For a more detailed SBOM, you can generate additional SBOMs from the source code or from the package manager installation process during the build process. These additional SBOMs can be combined to create a more comprehensive and accurate SBOM.

For more detailed information about SBOM generation, read [here](http://tbd).


