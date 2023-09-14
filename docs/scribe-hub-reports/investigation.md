---
sidebar_label: "Investigation"
title: Investigation
sidebar_position: 9
toc_min_heading_level: 2
toc_max_heading_level: 5
---

#### Aggregated SBOM

The Investigation page shows the total evidence of all your projects with added information and dashboards. This is Scribe's BI tool allowing you to analyze the aggregated SBOM in more detail.

To reach the Investigation page go to the **Investigation** tag on the left.

<img src='../../img/start/arsbom-2.jpg' alt='Investigation page, Aggregate SBOM'/>

The first thing you can see is an **Aggregate SBOM** view. This view shows you all packages in all your projects' SBOMs. You can filter by project name and/or version or run a search on all packages. This report is particularly useful if you want to check for a particular package name and version in all your projects, for example the Apache Log4j package containing the **[Log4J](https://logging.apache.org/log4j/2.x/)** vulnerability. 

##### Aggregate SBOM Fields

* **Product** - The product scanned to get this SBOM 
* **Version** - The specific build version scanned to get this SBOM
* **Component** - The build component (an image) where the vulnerability was found   
* **Component Version** - the build component version where the vulnerability was found   
* **Dependency** - The name of the library where this vulnerability was found  
* **Dependency Version** - The library version where this vulnerability was found  
* **Dependency latest version** - The latest version of the library where this vulnerability was found. If this version is different from the version used in your image consider updating your version.  
* **Package Manager** - The package manager this library was downloaded from such as *npm* or *apk*
* **Layer** - The image layer where this library was found  
* **Licenses** - The package license
* **Is Prmisive** - Whether the package license is permissive or not. Software under a permissive license can be modified, copied, added to, subtracted from, etc. without any obligation to share those updates. Scribe decides based on a policy we created whether a license type is permissive or not.
* **OpenSSF Score** - Based on the **[OpenSSF Scorecard](https://github.com/ossf/scorecard)** project.
* **Maintained Score** - The package maintenance score. It helps determine whether or not an OSS package is still being maintained. This score helps us find unmaintained or packages that have not been updated in the code.  
* **C+H Vulns** - Critical and High vulnerabilities found in this package/file  
* **SBOM Type** - What was scanned to produce this SBOM - A Git repository, an image, a file, etc'  
* **Labels** - Metadata included during the SBOM creation. For example the label 'is_git_commit' denotes that this is an SBOM of the git repository at the commit stage. You can create and manage your own labels.
* **SCA Tool** - The tool used to build this SBOM, in this case 'Scribe'

You can sort the information in the table by each of these columns. For example, if you want to see only the components with the highest number of Critical and High vulnerabilities click on the column header and the table will be sorted by that field.

#### The Filter Bar

The filter bar at the top of the page is design to allow you to narrow down the information presented by project, time, version, layer, labels used etc. 

<img src='../../img/start/investigation-filter-3.jpg' alt='Investigation filter bar'/>

No matter the report page you're viewing, in all cases you'll be seeing the aggregated information of all your projects and builds unless you use some filter to view something more specific.

#### The Out of Date Components Report

The **Out of Date Components** report displays packages that have newer versions available. 

<img src='../../img/start/out-of-date-components-1.jpg' alt='Out of Date Components Report'/>

##### Out of Date Components Fields

* **Product** - The product scanned to get this SBOM 
* **Version** - The specific build version scanned to get this SBOM
* **Component** - The build component (an image) where the vulnerability was found   
* **Component Version** - the build component version where the vulnerability was found   
* **Dependency** - The name of the library where this vulnerability was found  
* **Package Manager** - The package manager this library was downloaded from such as *npm* or *apk*
* **Layer** - The image layer where this library was found  
* **Dependency Version** - The library version where this vulnerability was found  
* **Dependency latest version** - The latest version of the library where this vulnerability was found. If this version is different from the version used in your image consider updating your version.  
* **C+H Vulns** - Critical and High vulnerabilities found in this package/file  
* **SCA Tool** - The tool used to build this SBOM, in this case 'Scribe'

#### The Vulnerabilities Report

Other than the Aggregate SBOM you can choose to see the **vulnerabilities**, where you can go via link (**vul_hyperlinks**) to the vulnerability's description. This report shows you the vulnerabilities progression by version and date of creation. For example, in this image we see 2 different images and we can see that the first one has more vulnerabilities than the second.

<img src='../../img/start/vulnerabilities-rep-start-1.jpg' alt='Investigation page, Vulnerabilities report'/>

##### Vulnerabilities Report Fields

* **Product** - The product scanned to get this SBOM 
* **ID** - The ID given to this vulnerability by the DB where we got it from
* **Severity** - The vulnerability severity  
* **Component** - The build component (an image) where the vulnerability was found   
* **Component Version** - the build component version where the vulnerability was found  
* **Dependency** - The name of the library where this vulnerability was found  
* **Layer** - The image layer where this library was found  
* **Dependency latest version** - The latest version of the library where this vulnerability was found. If this version is different from the version used in your image consider updating your version.  
* **CVSS 3.1** - The **[Common Vulnerability Scoring System](https://www.balbix.com/insights/understanding-cvss-scores/)** provides a numerical (0-10) representation of the severity of a vulnerability. 
* **EPSS** - The **[Exploit Prediction Scoring System](https://www.first.org/epss/faq)** is one way to try and estimate the likelihood (probability) that a vulnerability will be exploited in the wild in the next 30 days. EPSS produces a probability of exploitation activity (a value between 0 and 1 where 1 represents 100%). The higher the number, the more likely it is to see this vulnerability exploited in the wild within the next 30 days.
* **Date** - The date when the vulnerability scan was done  
* **Labels** - Any additional labels linked to this component or dependency  
* **References** - A link to the CVE information and other relevant links  
* **Source** - The name of the CVE Numbering Authority (CNA)  
* **Dependency Version** - The library version where this vulnerability was found  
* **Tool** - The tool used to discover this vulnerability 

#### The Compliance report

The **Compliance Report** where you can look at compliance on a company-wide scale rather than just 1 project at a time.

<img src='../../img/start/compliance-rep-start-1.jpg' alt='Investigation page, Compliance report'/>

#### The Library reputation report

Or the **Library reputation**, based on the **[OpenSSF Scorecard](https://github.com/ossf/scorecard)** project. If you see a package with a particularly low score it might behoove you to consider replacing it with a more secure option. 

<img src='../../img/start/library-rep-start-1.jpg' alt='Investigation page, Library reputation report'/>

#### The Evidence report

The evidence report shows all the evidence you have collected and uploaded to Scribe Hub from all your pipelines and projects.

<img src='../../img/start/evidence-1.jpg' alt='Evidence page, all evidence uploaded by this account'/>

You can search and drill down by timestamp or project to find the evidence set of a specific project or build run.

If you want to know if you have uploaded a particular piece of evidence to be able to call it and use it later in a policy you can check here to see if it's been uploaded successfully.

### Use cases

#### All evidence for a single product
The simplest use case is to view all the information for a single logical application (**logical_app**). The logical_app metadata groups all SBOMs of a particular product together. If, for example, you have a pipeline that generates 3 different images that are all part of the same application or service you can add the logical_app metadata field as well as the app_version metadata field to all their SBOMs to group the evidence together. 

To see all the evidence linked to a particular product or logical application, go to the search bar at the top of the page and type in the product or application name. If that application has multiple versions released you can narrow the search by adding the specific version you're looking for. To make it easier, all app/product names and all versions that have been identified in your data are present as a list in the relevant field for you to choose from.

<img src='../../img/start/investigation-search-1.jpg' alt='Investigation Search bar' width='40%' min-width='400px'/>

Be aware that unless you added the logical_app and app_version metadata fields to the SBOMs you generated, the product name will be derived from the pipeline that created the evidence. We strongly encourage you to include that information to make it easier to search for and analyze your evidence data.

#### Check before you publish
We recommend you create a checklist to follow before you decide to publish a new version. You should check that:
* There are no **[out of date components](#the-out-of-date-components-report)** in your build or components that are no longer maintained (check the maintenance score in the **[Aggregated SBOM report](#aggregate-sbom-fields)**)
* That there are no components with too low of a **[reputation score](#the-library-reputation-report)**
* That you're aware of all High and Critical **[Vulnerabilities](#the-vulnerabilities-report)** in your build, have looked into them and have created advisories for them
* That you have not included any non permissive component licenses by mistake (in the **[Aggregated SBOM report](#aggregate-sbom-fields)**)
* That your build complies with the regulations you wish it to (like SLSA and SSDF). You can check that in the **[Compliance Report](#the-compliance-report)**



