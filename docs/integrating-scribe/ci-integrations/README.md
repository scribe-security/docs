<p><a target="_blank" href="https://app.eraser.io/workspace/EhdwDZqtuIM6zwcE4ccw" id="edit-in-eraser-github-link"><img alt="Edit in Eraser" src="https://firebasestorage.googleapis.com/v0/b/second-petal-295822.appspot.com/o/images%2Fgithub%2FOpen%20in%20Eraser.svg?alt=media&amp;token=968381c8-a7e7-472a-8ed6-4a6626da5501"></a></p>

---

## description: Setting up your Continuous Integration (CI)
sidebar_label: "CI Integration"
title: Setting up Scribe protection in your CI pipeline
Adding code snippets to your Continuous Integration (CI) pipeline that call Scribe's tool, **Valint**, automates the process of generating SBOMs and analysis reports for your builds. You may also use Scribe's tool to generate SLSA provenance for your final artifact. If you're using GitHub then integrating the ScribeApp with your organizational GitHub account will allow you to get SSDF and SLSA compliance reports about your build.

The following scheme demonstrates the points on your CI pipeline to enter the code snippets calling Scribe's tool:

![Points on a generic SDLC to enter scribe code snippets](../../../static/img/ci/sdlc_diagram.jpg "points on a generic SDLC to enter scribe code snippets")

### Supported CIs
Currently, Scribe natively supports the following CI setups:

- [﻿GitHub Actions](../ci-integrations/github) .
- [﻿Jenkins](../ci-integrations/jenkins) . 
- [﻿GitLab CI/CD](../ci-integrations/gitlabci) .
- [﻿Azure Pipelines](../ci-integrations/azure) .
- [﻿CircleCI](../ci-integrations/circleci) .
- [﻿Travis CI](../ci-integrations/travis) .
- [﻿Bitbucket](../ci-integrations/bitbucket) .
If you have another CI, you can integrate it using these [﻿Generic CI integration instructions](../ci-integrations/general).



<!--- Eraser file: https://app.eraser.io/workspace/EhdwDZqtuIM6zwcE4ccw --->