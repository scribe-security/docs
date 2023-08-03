---
sidebar_label: "Compliance"
title: Compliance
sidebar_position: 2
toc_min_heading_level: 2
toc_max_heading_level: 5
---

A product's build compliance report shows you how the build complies with NIST's SSDF and SLSA up to level 3. You can check out what policies are being checked by Scribe for each of these frameworks **[here](../ssc-regulations/)**.

To reach the compliance report go to **Products > {Your Product} > {Version} > Compliance**.

This is what the report looks like:

<img src='../../img/start/compliance-start.jpg' alt='Compliance Report'/> 

As you can see, if the policy was checked successfully you'll see a green checkmark next to it. If the check failed you'll see a red exclamation point. 

Each policy under the **policy** column is a link leading to the right policy in the right regulation page such as the **[SLSA Policies](../guides/ssdf-compliance/ssdfpolicies)** or the **[SSDF Policies](../guides/secure-sfw-slsa/slsapolicies)** that Scribe monitors.

The **message** column explains why the policy check was successful or failed. Fix the failure reason to get the policy to pass on the next build run.

:::note
If you're interested in adding any other policies or frameworks to be checked against your products out of the box please **[contact us](https://scribesecurity.com/contact-us/)**.
:::
