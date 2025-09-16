---
sidebar_label: "Managing SBOMs and Vulnerabilities"
title: Managing SBOMs and Vulnerabilities
sidebar_position: 1
toc_min_heading_level: 2
toc_max_heading_level: 5
---

### Generating SBOMs

In order to generate an SBOM out of a build pipeline you must first **[install the Scribe Valint plugin in your CI system](../integrating-scribe/ci-integrations/)**. After this, Valint will automatically generate an SBOM and upload it to the Scribe Hub upon every build run. Valint generates an SBOM for build artifacts you specify as targets. 
In your build script call,

```
valint bom <target> -o [statement, attest] <flags> \
 -P [SCRIBE_TOKEN]
```

Where `<target>` of either type of container image, file or file directory, or a git repo. It is formatted as `[<image:tag>, <dir path>, <git url>]`.
`-E` flag specifies that the SBOM is uploaded as evidence to Scribe Hub.
`-U` and `-P` flags specify the Scribe Hub API credentials. You can read about the rest of the optional flags **[here](../integrating-scribe/valint/help/valint_bom#optional-flags)**.

You can find the SBOMs in Scribe Hub under the Products catalog by drilling down from product to its versions, and to a specific version.  

![Scribe Hub Products Page](/img/start/products-start.jpg)  

![Product builds page](/img/start/builds-start.JPG)

![Your SBOM Report](/img/start/sbom-report.JPG)

In cases when the build SBOM doesn’t reflect all the dependency information, you can utilize Valint to generate additional SBOMs from the source code or from the package manager that Scribe Hub will merge to increase the accuracy of the composition analysis. These cases depend on the source code language, the package manager type, and the method of building the final artifact and is not an ordinary case. You can **[contact us](https://scribesecurity.com/contact-us/)** for more support in such cases.

### Importing existing SBOMs

In case you require to manage SBOMs as a software consumer from your own vendors or case you are using additional SBOM tools, for example for reversing binary artifacts, you can import these SBOMs to Scribe Hub. It is also possible to merge these SBOMs with the SBOMs created by Scribe to increase overall accuracy.

To import such an external SBOM call Valint as follows
```
valint bom <filename> -o generic-attest --predicate-type cycloneDX
```

### Managing SBOMs of compound products

In case your end product comprises several components (e.g., images or other deployable artifacts) such as a web application made of several microservices, you can associate the builds with a single product and version.

This will aggregate their SBOMs under the same product in the Scribe Hub Products catalog.

To achieve this, you can use the flags `--product-key` (`-n`) and `--product-version` (`-v`).

By default, our system automatically distinguishes between deliverable and non-deliverable artifacts. To modify this behavior, employ the `--deliverable` flag and set it to either `true` or `false`.

**Example**
```
valint bom my_image:my_tag -n my_app -v 1.0.1
```

Note that you do not have to use these flags explicitly. If you do not specify a product-key (the flag used to specify a product name) the product-key will be populated automatically with the repository name. If you do not specify a product-version the version will be empty. That means that if the exact product name and version number are important to you you should consider adding these flags to your use of Valint.

You can manage evidence such as SBOMs of software products you build or from 3rd party through the Products catalog. Take a minute to explore the Demo Product in your Scribe account to review the different reports available for your products’ vulnerabilities, compliance with supply chain security standards, SBOMs, and contextual metadata.
To gather evidence from your own products **[install the Scribe Valint plugin in your CI system](../integrating-scribe/ci-integrations/)**.

Once evidence is collected you can drill down to the reports by selecting the relevant product card in the catalog or **[search for relevant builds](../scribe-hub-reports/investigation#the-filter-bar)** using a rich set of filters.

### Sharing SBOMs with your software consumers

You can share SBOMs of versions that you publish with stakeholders such as consumers of the software you build. Scribe will alert subscribers on new vulnerabilities when they are later published for this version.

To configure go to the Products catalog and find the relevant product card click ‘Invite Subscribers’ and input the email addresses of the stakeholders.

![Scribe Hub Demo Product](/img/start/demo-start-1.jpg)

Next, click the card and select the specific version that you wish to share, and click publish in its rightmost column. Note that at this point you need to manually publish every version explicitly.

![Scribe Hub Build Publish](/img/start/publish-1.JPG)

### Tracking vulnerabilities and managing security advisories

Once an SBOM is uploaded, Scribe Hub will scan it for known vulnerabilities. 
Scribe will alert subscribers on new vulnerabilities when they are later published for this version.

To review these vulnerabilities go to **Products > (Your Product) > (Version) > Vulnerabilities**

![Scribe Hub Product Build Vulnerabilities Page](/img/start/vulnerabilities-start.JPG)

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
**EPSS** - Exploitability probability score as predicted by **[https://www.first.org/epss/](https://www.first.org/epss)**   
**Date** - The date when the vulnerability scan was done  
**Labels** - Any additional labels linked to this component or dependency  
**References** - A link to the CVE information and other relevant links  
**Source** - The name of the CVE Numbering Authority (CNA)  
**Tool** - The tool used to discover this vulnerability

### Ingesting reports from application security scanners

You can gather the output of your application security scanners (such as SAST, SCA, and DAST) as evidence to attest to your software’s security level and evaluate it with your policies.
In your build script use:
```
valint evidence <file_path> -o [statement, attest] -p [predicate-type] [FLAGS]
```
For example, gathering evidence of a Trivy output:
```
valint bom report.sarif -o attest
```
> Trivy Predicate type and tool information is autodetected.

### Signing & verifying SBOMs

You can sign or verify SBOMs using local keys, a certificate, or a CA file.
```
valint bom busybox:latest -o attest --attest.default x509
valint verify busybox:latest --attest.default x509
```
Where `--attest.default` defines the singing method. 
<!-- For more options, you can read here. -->

### Authoring advisories and VEX documents

When sharing an SBOM with the stakeholders you might often require to include relevant advisories to the reported CVEs that explain why the vulnerability doesn’t affect the overall product or otherwise, how the consumer of your software should mitigate this vulnerability.

Your team and your stakeholders can download these advisories in a **[VEX format](https://cyclonedx.org/capabilities/vex/)** which is machine-readable and can be used by Scribe’s policy agent.

To add an advisory to a vulnerability reported, go to **Products > (Your Product) > (Version) > Advisories**.

Find the vulnerability according to its ID and click ‘+Add’ in its line in the rightmost column. Note that the CVE ID is identical to the one found on the **Vulnerabilities** page.

![Scribe Hub Product Build Advisories Page](/img/start/advisories-start.jpg)
  
A dialog appears:

![Scribe Hub Product Build Vulnerabilitiy Advisory VEX window](/img/start/vex-start.JPG)

Fill the form according to your analysis of the vulnerability. If you set the status to ‘Not Affected’ the severity would be canceled and the vulnerability line would be pushed to the end of the report.

To export the VEX report click the Export button at the top right and select VEX document.

![Scribe Hub Product Build Vulnerabilitiy Advisory VEX export](/img/start/export-start.JPG)

### Searching for SBOMs

In the top header of Scribe Hub’s web pages, you can find a semi-structured search bar, supporting both filter predicates and free text key works. 

Use the following syntax:
```
filter_predicate1: <value> filter_predicate2: <value> text1 text2
```
There is an implicit boolean AND predicate between the search terms.
Use the following filter names to filter your search as follows:  
**product** - product name  
**cve** - ID of vulnerability (as CVE-2021-44228)  
**cveSeverity** - Severity of a vulnerability value: critical, high, medium, or low   
**context** - search for fields in the context added by the user to an SBOM
Use the following search syntax:       
```
context:<user field name>:<field value>
```
`<user field name>:<field value>` are the field name and value that were set in the context JSON by the user, or in the SBOM metadata.  
**cveUpdatedFrom** - Date range’s “From” of the date the CVE was updated by the CVE numbering authority (CNA)   
**cveUpdatedTo** - Date range’s “To” of the date the CVE was updated by the CVE numbering authority  
**cna** - CVE numbering authority (CNA). For example “NVD”  
**advisory** - whether a user-authored advisory exists: true, false  
**advisoryText**- search for a partial string within a user-authored advisory   
**buildNumber** - product version ID or build ID  
**buildDateFrom** - search for a version or a build inside a range from a certain date  
**buildDateTo** - search for a version inside a range up to a certain date  
**buildSignature** - the state of the signature of a version or a build: verified, unverified, unsigned  
**label** - labels add to the context of the SBOM with Scribe Valint’s `--label` flag  
**integrity** - the state of the signature of a product version or a build: true, false  
**published** - product versions that were published: true, false  
**policy** - name or part of a name of a policy  
**policyStatus** - status of a policy verification: fail, pass  
**policyType** - type of compliance SLSA or SSDF  






<!-- You can label several different build artifacts in one or more pipelines as belonging to the same **[logical application](../advanced-guide/generating-sboms/#generating-sboms-from-ci-pipeline-runs)** and its version. To this end use the special flags ```--app-name``` and ```--app-version```. You can read about other optional flags **[here](../integrating-scribe/valint/command/valint_bom#optional-flags)**.

**Example**

```
valint bom my_image:my_tag --app-name my_app --app-version 1.0.1
```

It is possible to call Valint more than one step in a build run in order to add necessary information to render an accurate SBOM. At each point, Valint analyzes the data available in that context. The number of calling points depends on the source code language, the package manager type, and the method of building the final artifact. See **[advanced SBOM generation](../advanced-guide/generating-sboms/#generating-sboms-from-ci-pipeline-runs)**. However, generally speaking, it suffices to call valiant at the end of the build pointing its target to the final built artifact such as a container image.

#### Managing SBOMs of product trees

You can manage security-related evidence, such as SBOMs, of software products you build or from 3rd party through the Products catalog. You can label several different build artifacts in one or more pipelines as belonging to the same **logical application** and its version. To this end use the special Valint call flags `--app-name` and `--app-version`. Any evidence linked by its app-name and version can be filtered in the various Scribe hub reports such as the **[investigation report](../scribe-hub-reports/investigation)**.

![Investigation page, Aggregate SBOM](/img/start/BI-start-1.JPG)

Take a minute to explore the Demo Product in your Scribe account to review the different **[reports](../scribe-hub-reports)** available for your products’ vulnerabilities, compliance with supply chain security standards, SBOMs, and contextual metadata.

![Scribe Hub Products Page](/img/start/products-start.jpg)

To gather evidence from your own products **[install the Scribe Valint plugin in your CI system](../integrating-scribe/ci-integrations/)**.
Once evidence is collected you can drill down to the reports by selecting the relevant product card in the catalog or **[search for relevant builds](#searching-for-anything)** using a rich set of filters.

#### Importing SBOMs generated by other tools

In some cases you might prefer using specific commercial or open-source tools to generate SBOMS of your software artifacts. For example, in a case you wish to reverse a complicated binary artifact. In other cases, you might require to manage in Scribe SBOMs you received from 3rd parties. 
You can import these SBOMs to Scribe Hub and it is also possible to merge these SBOMs with the SBOMs created by Scribe to increase overall accuracy.

To import such an external SBOM call Valint as follows:

```
valint bom <filename> -o generic-attest --predicate-type cycloneDX
```

### Importing evidence generated by other tools
Generic evidence includes custom 3rd party verifiable information containing any required compliance requirements.
Generic evidence allows users to include any file as evidence or attestation (signed) hooking in 3rd party tools.
It allows the creation of more robust and customizable policies to fit your needs.

For example, Attesting to License scanner report can enable you to enforce licensing requirements as part of your build pipeline.

#### Usage
Attach a generic evidence
`valint bom <file_path> -o [statement-generic, attest-generic] [FLAGS]`

Verify a generic evidence artifact
`valint verify <file_path> -i [statement-generic, attest-generic] [FLAGS]`

Using the following flags, <br />
* `--predicate-type`: Customize the predicate type of the evidence, which must be a valid URI (optional) <br />
Default value is `http://scribesecurity.com/evidence/generic/v0.1`. 

* `--compress`: Compress content (optional)

For Example, using Trivy SARIF report as evidence:
```bash
valint bom report.sarif -o attest-generic -p https://aquasecurity.github.io/trivy/v0.42/docs/configuration/reporting/#sarif
```

### Sharing SBOMs with your software consumers

You can share SBOMs of versions that you publish with stakeholders such as consumers of the software you build.

Go to the Products catalog and find the relevant product card click ‘Invite Subscribers’ and input the email addresses of the stakeholders. 

![Scribe Hub Demo Product](/img/start/demo-start-1.jpg)

Next, click the card and select the specific version that you wish to share, and click publish in its rightmost column. Note that at this point you need to manually publish every version explicitly.

### Tracking vulnerabilities and managing security advisories

Once an SBOM is uploaded, Scribe Hub will scan it for known vulnerabilities. To review these vulnerabilities go to Products > (Your Product) > (Version) > Vulnerabilities.

![Scribe Hub Product Build Vulnerabilities Page](/img/start/vulnerabilities-start.JPG)

**Explanation:**  
**Severity** - severity assigned by the CVE Numbering Authority (CNA)  
**CVE ID** - the published CVE identifier  
**Database** - the name of the CVE Numbering Authority (CNA)  
**CVSS** - CVE’s CVSS version 3.2 score  
**EPSS** - Exploitability probability score as predicted by **[https://www.first.org/epss/](https://www.first.org/epss)**  
**Package & version** - the package name and version as reported in the SBOM  
**Fix Version** - a newer version that fixes the vulnerability if exists

### Authoring advisories and VEX documents

When sharing an SBOM with the stakeholders you might often require to include relevant advisories to the reported CVEs that explain why the vulnerability doesn’t affect the overall product or otherwise, how the consumer of your software should mitigate this vulnerability.

Your team and your stakeholders can download these advisories in a VEX format which is machine-readable and can be used by Scribe’s policy agent.

To add an advisory to a vulnerability reported go to Products > (Your Product) > (Version) > Vulnerabilities.  
Find the vulnerability according to its ID and click ‘+Add’ in its line in the right-end column.  
A dialog appears:

![Scribe Hub Product Build Vulnerabilitiy Advisory VEX window](/img/start/vex-start.JPG)

Fill the form according to your analysis of the vulnerability. If you set the status to ‘Not Affected’ the severity would be canceled and the vulnerability line would be pushed to the end of the report.

To export the VEX report click the Export button at the top right and select VEX document.

![Scribe Hub Product Build Vulnerabilitiy Advisory VEX export](/img/start/export-start.JPG)

### Searching for anything

In the top header in Scribe Hub’s web pages you can find a semi-structured search bar, supporting both filter predicates and free text key works. 

Use the following syntax 

```
filter_predicate1: [value] filter_predicate2: [value] text1 text2
```

There is an implicit boolean ```AND``` predicate between the search terms.

Use the following predicates to filter products as follows:  
**product** - product name  
**cve** - CVE ID  
**buildDateFrom** - search for a build inside a range from a certain date   
**buildDateTo** - search for a build inside a range up to a certain date -->
