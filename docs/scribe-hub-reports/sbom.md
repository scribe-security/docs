---
sidebar_label: "SBOM"
title: SBOM
sidebar_position: 4
toc_min_heading_level: 2
toc_max_heading_level: 5
---


A product's build SBOM report shows you all the components of the build built at the end of the pipeline. 

To reach the SBOM go to **Products > {Your Product} > {Version} > SBOM**.

<img src='../../img/start/sbom-report.jpg' alt='Your SBOM Report'/>

You can choose to download the SBOM using the **download** button on the top right of the report.

The SBOM would exported as a JSON in a CycloneDX format. It looks like this:

<img src='../../img/start/sbom-json-start.jpg' alt='Your SBOM JSON'/>

### Explanation

* **Logical Application** - The logical_app metadata field included in this SBOM 
* **Logical App version** - The app_version metadata field included in this SBOM
* **Component** - The package name as listed in the SBOM. In the case of the source code, the component name will be the file name.
* **Labels** - Metadata included during the SBOM creation. For example the label 'is_git_commit' denotes that this is an SBOM of the git repository at the commit stage. You can create and manage your own labels.
* **Component name** - The package name as listed in the SBOM. In the case of the source code, the component name will be the file name.
* **Subcomp Version** - The package version in use as listed in the SBOM
* **Subcomp Latest Ver** - The latest package version that exists in the package manager
* **Maintained scr** - The package maintenance score. It helps determine whether or not an OSS package is still being maintained. This score helps us find unmaintained or packages that have not been updated in the code.
* **Subcomp type** - If this package was downloaded from a package manager, what package manager was it downloaded from (NPM, PyPI, etc.)
* **Reputation Score** - Based on the **[OpenSSF Scorecard](https://github.com/ossf/scorecard)** project.
* **License** - The package license
* **Prmsv** - Whether the package license is permissive or not. Software under a permissive license can be modified, copied, added to, subtracted from, etc. without any obligation to share those updates. Scribe decides based on a policy we created whether a license type is permissive or not.
* **SBOM Type** - The SBOM type - whether the SBOM was made from an Image, a Git repository, etc.
* **SBOM Tool** - The tool used to create this SBOM. In most cases this will be listed as 'scribe'
* **Layer** - The image layer this package/file was found in
* **C/H Vulns** - Critical and High vulnerabilities found in this package/file
* **Link** - this is a link to the component 
* **Dtl** - this is a link to the component detail information
    <img src='../../img/start/component.jpg' alt='Component information'/>



