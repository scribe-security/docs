---
sidebar_label: "Tracking and managing vulnerabilities"
title: Tracking and managing vulnerabilities
sidebar_position: 3
---

Once an SBOM is uploaded, Scribe Hub will scan it for known vulnerabilities. To review these vulnerabilities go to **Products > {Your Product} > {Version} > Vulnerabilities**.

<img src='../../../../../img/start/vulnerabilities-start.jpg' alt='Your Vulnerabilities Report'/>

### Explanation

* **Severity** - severity assigned by the CVE Numbering Authority (CNA)

* **CVE ID** - the published CVE identifier

* **Database** - the name of the the CVE Numbering Authority (CNA)

* **CVSS** - CVE’s CVSS version 3.2 score

* **EPSS** - Exploitability probability score as predicted by [https://www.first.org/epss/](https://www.first.org/epss/)

* **Package & version** - the package name and version as reported in the SBOM

* **Fix Version** - a newer version that fixes the vulnerability if exists

### Adding your advisories to reported vulnerabilities

When sharing an SBOM with your stakeholders you might often require to include relevant advisories to the reported CVEs that explain why the vulnerability doesn’t affect the overall product or otherwise, how the consumer of your software should mitigate this vulnerability.

Your team and your stakeholders can download these advisories in a [VEX format](https://cyclonedx.org/capabilities/vex/) which is machine readable and can be used by Scribe’s policy agent.

To add an advisory to a vulnerability reported go to **Products > {Your Product} > {Version} > Vulnerabilities**.

Find the vulnerability according to it ID and click **‘+Add’** in its line in the right end column.

A dialog appears:

<img src='../../../../../img/start/vex-start.jpg' alt='VEX Advisories dialog'/>

Fill the form according to your analysis of the vulnerability. If you set the status to ‘Not Affected’ the severity would be canceled and the vulnerability line would be pushed to the end of the report.

To export the VEX report click the Export button at the top right and select VEX document.

<img src='../../../../../img/start/export-start.jpg' alt='Export dialog'/>




