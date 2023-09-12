---
sidebar_label: "Generating SBOMs"
title: Generating SBOMs
sidebar_position: 1
toc_min_heading_level: 2
toc_max_heading_level: 5
---

### Generating SBOMs from CI pipeline runs

In order to generate an SBOM out of a build pipeline you must first **[install the Scribe Valint plugin in your CI system](../integrating-scribe/ci-integrations/)**. After that, Valint will generate an SBOM and upload it to the Scribe Hub upon every pipeline run. Valint generates an SBOM for build artifacts you specify as targets. 

In your build script call `valint bom <target> <flags>`.

`<target>` is a build artifact of either type of container image, file or file directory, or a git repo formatted as  
`[<image:tag>, <dir path>, <git url>]`.  

You can label several different build artifacts in one or more pipelines as belonging to the same application and version. To this end use the flags `--product-key` (`-n`) and `--product-version` (`-v`). You can read about other optional flags **[here](../integrating-scribe/valint/command/valint_bom/#optional-flags)**.

### Example

```
valint bom my_image:my_tag --app-name my_app --app-version 1.0.1
```

It is possible to call Valint more than one step in a build run in order to add necessary information to render an accurate the SBOM. At each point Valint analyzes the data available in that context. The number of calling points depends on the source code language, the package manager type and the method of building the final artifact. See advanced SBOM generation. However, generally speaking it suffices to call valiant at the end of the build pointing its target to the final built artifact such as a container image.

### Generating SBOMs from a container registry - coming soon

<img src='../../../../img/help/coming-soon.jpg' alt='Coming Soon'/>

You can connect Scribe Hub to your container registry API and generate SBOMs of container images.
Go to the Integrations page and select the container registry platform you wish to connect. In the dialog that appears input your registry account URL and API token. You will see platform specific instructions in the dialog.

<img src='../../../../img/start/integrations-start.jpg' alt='Integration Options'/>

After the connection succeeds you will be redirected to the registry repo selection page where you can select whole repos or only specific tags within them. When you are done, Scribe will scan these repositories periodically for new images and generate SBOMs for them.  

Go to the Products catalog to review the available scanned repositories.  

You can drill down to the relevant image to view and download its SBOM. You can also share SBOMs with subscribers.

