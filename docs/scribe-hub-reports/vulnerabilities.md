<p><a target="_blank" href="https://app.eraser.io/workspace/0U9OVC1hI2V8f47dzJ0E" id="edit-in-eraser-github-link"><img alt="Edit in Eraser" src="https://firebasestorage.googleapis.com/v0/b/second-petal-295822.appspot.com/o/images%2Fgithub%2FOpen%20in%20Eraser.svg?alt=media&amp;token=968381c8-a7e7-472a-8ed6-4a6626da5501"></a></p>

---

## sidebar_label: "Vulnerabilities"
title: Vulnerabilities
sidebar_position: 3
toc_min_heading_level: 2
toc_max_heading_level: 5
A product's build vulnerabilities report shows you all the vulnerabilities discovered in the build built at the end of the pipeline.

To reach the vulnerabilities report go to **Products > {Your Product} > {Version} > Vulnerabilities**.

![Your Vulnerabilities Report](../../img/start/vulnerabilities-start.jpg "")

### Explanation
**Explanation:**
**Product** - The product name where this vulnerability was found
**Version** - The build version as reported in the SBOM
**ID** - The published CVE identifier
**Severity** - Severity assigned by the CVE Numbering Authority (CNA)
**Component** - The build component (an image) where the vulnerability was found
**Component Version** - the build component version where the vulnerability was found
**Layer** - The image layer where this vulnerability was found
**Dependency** - The name of the library where this vulnerability was found
**Dependency Version** - The library version where this vulnerability was found
**Dependency latest version** - The latest version of the library where this vulnerability was found. If this version is different from the version used in your image consider updating your version.
**CVSS 3.1** - CVE’s CVSS version 3.1 score
**EPSS** - Exploitability probability score as predicted by [﻿https://www.first.org/epss/](https://www.first.org/epss)
**Date** - The date when the vulnerability scan was done
**Labels** - Any additional labels linked to this component or dependency
**References** - A link to the CVE information and other relevant links
**Source** - The name of the CVE Numbering Authority (CNA)
**Tool** - The tool used to discover this vulnerability



<!--- Eraser file: https://app.eraser.io/workspace/0U9OVC1hI2V8f47dzJ0E --->