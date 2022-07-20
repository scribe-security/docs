---
description: CI/CD Integration
---

# CI/CD Integration

Now that you have tried our tool manually on a repository and received the integrity report here's a way for you to automate the process.
Scribe allows you to integrate our *SBOM* creation tool and our report directly into your pipeline. Below are two suggested integrations, using <a href='/docs/ci-cd-integration/github-actions'>GitHub actions</a> and <a href='/docs/ci-cd-integration/jenkins'>Jenkins over Kubernetes</a>. We also offer a more generalized option allowing integration with other <a href='/docs/ci-cd-integration/general'>CI systems</a>.  

No matter the pipeline the basic operation is the same: You need to create two *SBOMs*, one of the repository files and one of the final image using gensbom. Then, you need to call the integrity report from Scrib's backend using Valint.  

<img src='../img/cicd/cicd_diagram.jpg' alt='Grype alpine' width="100%"/>

:::info GitHub actions
<img src='../img/cicd/github.png' alt='GitHub' width="30px"/> Integrate as a step in <b><a href='/docs/ci-cd-integration/github-actions'>GitHub actions</a></b>. 
:::

:::info Jenkins
<img src='../img/cicd/jenkins.png' alt='Jenkins' width="30px"/> Integrate as a step in a <b><a href='/docs/ci-cd-integration/jenkins'>Jenkins</a></b> pipeline.  
Important to note that this is for <b>Jenkins over Kubernetes</b> only. 
:::

:::info Other CI Systems
Integrate into other <b><a href='/docs/ci-cd-integration/general'>CI systems</a></b>.  
:::

<!-- [![button](http://www.presentationpro.com/images/product/medium/slide/PPP_CGENE_LT3_Presentation-PowerPoint-Slide-Graphic_Push_Button_Up.jpg)](/docs/ci-cd-integration/github-actions) -->

Let's get started.

