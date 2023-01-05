---
description: Setting up your Continuous Integration (CI)
---


# Setting up Scribe protection in your CI pipeline

Adding Scribe's code snippets to your Continuous Integration (CI) pipeline automates the process of generating SBOMs and analysis reports for your builds. You may also use Scribe's tool to generate SLSA provenance for your final artifact.

The following scheme demonstrates the points on your CI pipeline to enter the code snippets calling Scribe's tool:

![Two points on a generic pipeline to enter scribe code snippets](../../static/img/ci/ci_diagram.jpg "Two points on a generic pipeline to enter scribe code snippets")


Scribe installation includes a Command Line Interpreter (CLI) tool called **Valint**. This tool is used to generate evidence in the form of SBOMs as well as SLSA provenance. 

## Creating an SBOM and collecting evidence

The simplest integration is to automate calling *Valint* to collect evidence of the repository and create an SBOM of the final artifact. Scribe currently supports collecting evidence from the following entities:
* An image - Image formats supported are currently docker manifest v2 and Oracle Cloud Infrastructure (OCI). An image is the most common final artifact.
* A folder
* A file
* A GIT repository - A remote/local GIT repository   

Once you generate the evidence in the pipeline it is then automatically uploaded to Scribe Hub. 
While *Valint* does have other capabilities and CLI options, we will focus on its basic usage.
<!--You can read more about *Gensbom* [here](../CLI/gensbom "Gensbom documentation").-->

## Generating SLSA provenance

At this time Scribe's tool can be used to collect SLSA provenance only from a GitHub pipeline. To collect this provenance you'll need to connect the Scribe GitHub app to your GitHub organizational account and add the appropriate code snippet to your GitHub repositories' pipeline. You can find more details on the [Github](../ci-integrations/github "GitHub") integration quick-start page.

## Where to place Scribe's Code in your pipeline 
For the SBOM generation, these are the two points for adding the code snippet:
* **Source Code Checkout**: Collects evidence of your source code files after checkout. This is an important but ___optional___ point. It's used to generate an integrity report for Node.js projects and NPM files/packages.

* **Final built artifact**: Generates an SBOM right after the final artifact is created. This is the main and ___mandatory___ point. 

Note that you can generate an SBOM for various other entities as stated earlier. You can save and use these SBOMs at your discretion.

Regarding SLSA provenance generation, if relevant, it would be placed after the final artifact is created. 

___Note___ that if you do not collect evidence about your source code, you cannot get integrity information about your code. You can get integrity information about your NPM dependencies regardless of localized evidence collection.   

## Supported CIs

Currently, Scribe natively supports the following CI setups:
* [Jenkins](../ci-integrations/jenkins "Jenkins"). 
* [GitHub Actions](../ci-integrations/github "GitHub Actions").
* [GitLab CI/CD](../ci-integrations/gitlabci "GitLab CI/CD").
* [Bitbucket](../ci-integrations/bitbucket "Bitbucket").
* [Azure Pipelines](../ci-integrations/azure "Azure Pipelines").
* [CircleCI](../ci-integrations/circleci "CircleCI").
* [Travis CI](../ci-integrations/travis "Travis CI").

If you have another CI, you can integrate it using these [generic integration instructions](../ci-integrations/general "generic integration instructions"). 