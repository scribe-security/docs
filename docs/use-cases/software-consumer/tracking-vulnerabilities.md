---
sidebar_label: "Tracking and managing vulnerabilities"
title: Tracking and managing vulnerabilities
sidebar_position: 2
---

Once a producer SBOM is uploaded, Scribe Hub will scan it for known vulnerabilities. To review these vulnerabilities go to **Products > {Your Product} > {Version} > Vulnerabilities**.

<img src='../../../../../img/start/vulnerabilities-start.jpg' alt='Your Vulnerabilities Report'/>

### Explanation

* **Severity** - severity assigned by the CVE Numbering Authority (CNA)

* **CVE ID** - the published CVE identifier

* **Database** - the name of the the CVE Numbering Authority (CNA)

* **CVSS** - CVE’s CVSS version 3.2 score

* **EPSS** - Exploitability probability score as predicted by [https://www.first.org/epss/](https://www.first.org/epss/)

* **Package & version** - the package name and version as reported in the SBOM

* **Fix Version** - a newer version that fixes the vulnerability if exists

### Vulnerability advisories

When sharing an SBOM is shared with you note that some vulnerabilities might have relevant advisories attached to them that explain why the vulnerability doesn’t affect the overall product or otherwise, how you, the consumer, should mitigate this vulnerability.

You can download these advisories in a [VEX format](https://cyclonedx.org/capabilities/vex/) which is machine readable and can be used by Scribe’s policy agent.

To export the VEX report click the Export button at the top right and select VEX document.

<img src='../../../../../img/start/export-start.jpg' alt='Export dialog'/>




