---
description: Setup your CI
---

# Setup your CI

<font size="5">Start managing your builds’ *SBOMs* and validating the builds’ integrity in Scribe Hub.</font>  

To generate an *SBOM* for every build run and upload it to Scribe Hub, integrate Scribe into your CI after your build step. If you are building a Node.JS project, you can also validate its integrity (that is, that it hasn’t been tampered with) by integrating Scribe after the checkout step as well.

Currently, Scribe natively supports <a href='/docs/ci-integrations/jenkins'>Jenkins over Kubernetes</a> and <a href='/docs/ci-integrations/github'>GitHub actions</a>. If you have another CI, you can integrate it with the <a href='/docs/ci-integrations/general'>generic integration instructions</a>.  

<img src='../../img/ci/ci_diagram.jpg' alt='CI Diagram' width="100%"/>

:::info Jenkins
<img src='../../img/ci/jenkins.png' alt='Jenkins' width="30px"/> Integrate as a step in a <b><a href='/docs/ci-integrations/jenkins'>Jenkins</a></b> pipeline.  
Important to note that this is for <b>Jenkins over Kubernetes</b> only. 
:::

:::info GitHub actions
<img src='../../img/ci/github.png' alt='GitHub' width="30px"/> Integrate as a step in <b><a href='/docs/ci-integrations/github'>GitHub actions</a></b>. 
:::

:::info Other CI Systems
Integrate into other <b><a href='/docs/ci-integrations/general'>CI systems</a></b>.  
:::

<!-- [![button](http://www.presentationpro.com/images/product/medium/slide/PPP_CGENE_LT3_Presentation-PowerPoint-Slide-Graphic_Push_Button_Up.jpg)](/docosaurus-scribe/docs/ci-integration/github-actions) -->

Let's get started.

