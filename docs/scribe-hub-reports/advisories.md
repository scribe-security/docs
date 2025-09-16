---
sidebar_label: "Advisories"
title: Advisories
sidebar_position: 4
toc_min_heading_level: 2
toc_max_heading_level: 5
---

A product's vulnerability advisories report shows you all the advisories added to the vulnerabilities discovered in this build.

When sharing an SBOM with your stakeholders you might often require to include relevant advisories to the reported CVEs that explain why the vulnerability doesn’t affect the overall product or otherwise, how the consumer of your software should mitigate this vulnerability.

Your team and your stakeholders can download these advisories in a **[VEX format](https://cyclonedx.org/capabilities/vex/)** which is machine readable and can be used by Scribe’s policy agent.

To add an advisory to a vulnerability reported, go to **Products > (Your Product) > (Version) > Advisories**.

Find the vulnerability according to its ID and click ‘+Add’ in its line in the rightmost column. Note that the CVE ID is identical to the one found on the **Vulnerabilities** page.

![Scribe Hub Product Build Advisories Page](/img/start/advisories-start.jpg)
  
A dialog appears:

![Scribe Hub Product Build Vulnerabilitiy Advisory VEX window](/img/start/vex-start.JPG)

Fill the form according to your analysis of the vulnerability. If you set the status to ‘Not Affected’ the severity would be modified to 'low' and the vulnerability line would be pushed to the end of the report.

If a vulnerability already has an advisory attached to it you'll see the following icon at the end of the vulnerability line:

![VEX Advisory icon](/img/start/advisory-icon.JPG)

Clicking on the advisory icon allows you to update the advisory, for example from a status of 'under investigation' to a status of 'not affected'.

To export the VEX report click the Export button at the top right and select VEX document.

![Export dialog](/img/start/export-start.JPG)

:::note
Once a build is published all of the product's subscribers are exposed to all its information including this vulnerabilities report. Any advisory you add to this report will likewise be exposed to the product's subscribers so you do not have to export and send vulnerability advisories to stake holders separately.
:::







