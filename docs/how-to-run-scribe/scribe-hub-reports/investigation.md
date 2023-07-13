---
sidebar_label: "Investigation"
title: Investigation
sidebar_position: 7
---

The Investigation page shows the total evidence of all your projects with added information and dashboards.

To reach the Investigation page go to the **Investigation** tag on the left.

<img src='../../../../img/start/BI-start.jpg' alt='Investigation page, Aggregate SBOM'/>

The first thing you can see is an **Aggregate SBOM** view. This view shows you all packages in all your project SBOMs. You can filter by project name and/or version or run a search on all packages. This report is particularly useful if you want to check for a particular package name and version in all your projects, for example the Apache Log4j package containing the [Log4J](https://logging.apache.org/log4j/2.x/) vulnerability. 

The filter bar at the top of the page is design to allow you to narrow down the information presented by project, time, version, layer, labels used etc. 

<img src='../../../../img/start/investigation-filter-2.jpg' alt='Investigation filter bar'/>

Other than the Aggregate SBOM you can choose to see the **vulnerabilities**, where you can go via link to the vulnerability's description.

<img src='../../../../img/start/vulnerabilities-rep-start.jpg' alt='Investigation page, Vulnerabilities report'/>

The **Compliance Report** where you can look at compliance on a company-wide scale rather than just 1 project at a time.

<img src='../../../../img/start/compliance-rep-start.jpg' alt='Investigation page, Compliance report'/>

Or the **Library reputation**, based on the [OpenSSF Scorecard](https://github.com/ossf/scorecard) project. If you see a package with a particularly low score it might behoove you to consider replacing it with a more secure option. 

<img src='../../../../img/start/library-rep-start.jpg' alt='Investigation page, Library reputation report'/>

In all cases you see the aggregated information of all your projects and builds unless you use some filter to view something more specific.





