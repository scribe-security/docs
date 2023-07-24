---
sidebar_label: "SBOM"
title: SBOM
sidebar_position: 3
toc_min_heading_level: 2
toc_max_heading_level: 5
---


A product's build SBOM report shows you all the components of the build built at the end of the pipeline. 

To reach the SBOM go to **Products > {Your Product} > {Version} > SBOM**.

<img src='../../../../img/start/sbom-start.jpg' alt='Your SBOM Report'/>

You can choose to download the SBOM using the **download** button on the top right of the report.

The SBOM would download as a JSON in a CycloneDX format. It looks like this:

<img src='../../../../img/start/sbom-json-start.jpg' alt='Your SBOM JSON'/>

### Explanation

* **Package** - The package (library) name 

* **Package manager** - where that package was downloaded from  (such as npm, pypi, etc.). If it's not a package the column would indicate 'file'

* **Version** - The package version in use

* **License** - The package license


