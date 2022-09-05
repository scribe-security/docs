---
description: Setting up your Continuous Integration (CI)
---


# Setting up Scribe protection in your CI pipeline

Adding Scribe Hub code snippets to your Continuous Integration (CI) pipeline automates the process of generating SBOMs and analysis reports.

The following scheme demonstrates the two points on your CI pipeline to enter the Scribe Hub code snippets:

![Two points on a generic pipeline to enter scribe code snippets](../../static/img/ci/ci_diagram.jpg "Two points on a generic pipeline to enter scribe code snippets")


Once your CI pipeline is set up, running your pipeline (your builds) will activate Scribes' evidence collectors automatically. The integrity of your project code is validated and the results are uploaded to Scribe Hub.

## Where to place Scribe Code in your pipeline 
These are the two points for adding Scribe Hub code:
* **Source Code Checkout**: Collects evidence of your Node.js source code files after checkout. This is an important but ___optional___ point.

* **Final built image**: Generates an SBOM right after the final image is created. This is the main and ___mandatory___ point.

## Supported CIs

Currently, Scribe natively supports the following CI setups:
*  [Jenkins](../ci-integrations/jenkins "Jenkins over Kubernetes"): This version supports ***Jenkins over Kubernetes*** only. 
* [Github Actions](../ci-integrations/github "GitHub actions").

If you have another CI, you can integrate it using these [generic integration instructions](../ci-integrations/general "generic integration instructions").  

