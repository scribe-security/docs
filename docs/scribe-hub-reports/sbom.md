
---

## sidebar_label: "SBOM"
title: SBOM
sidebar_position: 5
toc_min_heading_level: 2
toc_max_heading_level: 5
A product's build SBOM report shows you all the components of the build built at the end of the pipeline. 

To reach the SBOM go to **Products > {Your Product} > {Version} > SBOM**.

![Your SBOM Report](../../img/start/sbom-report.jpg "")

### Explanation
- **Product** - The product scanned to get this SBOM 
- **Version** - The specific build version scanned to get this SBOM
- **Component** - The build component (an image) where the vulnerability was found 
- **Component Version** - the build component version where the vulnerability was found 
- **Dependency** - The name of the library where this vulnerability was found 
- **Dependency Version** - The library version where this vulnerability was found 
- **Dependency latest version** - The latest version of the library where this vulnerability was found. If this version is different from the version used in your image consider updating your version. 
- **Package Manager** - The package manager this library was downloaded from such as _npm_ or _apk_
- **Layer** - The image layer where this library was found 
- **Licenses** - The package license
- **Is Prmisive** - Whether the package license is permissive or not. Software under a permissive license can be modified, copied, added to, subtracted from, etc. without any obligation to share those updates. Scribe decides based on a policy we created whether a license type is permissive or not.
- **OpenSSF Score** - Based on the [﻿OpenSSF Scorecard](https://github.com/ossf/scorecard)  project.
- **Maintained Score** - The package maintenance score. It helps determine whether or not an OSS package is still being maintained. This score helps us find unmaintained or packages that have not been updated in the code. 
- **C+H Vulns** - Critical and High vulnerabilities found in this package/file 
- **SBOM Type** - What was scanned to produce this SBOM - A Git repository, an image, a file, etc' 
- **Labels** - Metadata included during the SBOM creation. For example the label 'is_git_commit' denotes that this is an SBOM of the git repository at the commit stage. You can create and manage your own labels.
- **SCA Tool** - The tool used to build this SBOM, in this case 'Scribe'
You can choose to download the SBOM using the **export** button on the top right of the report.

![Export dialog](../../img/start/export-start.jpg "")

The SBOM would exported as a JSON in a CycloneDX format. It looks like this:

![Your SBOM JSON](../../img/start/sbom-json-start.jpg "")





<!--- Eraser file: https://app.eraser.io/workspace/FBV6aXBeOwqMaXNq9ZTO --->