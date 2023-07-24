---
sidebar_label: "Stand-alone deployment"
title: Stand-alone deployment
sidebar_position: 3
toc_min_heading_level: 2
toc_max_heading_level: 5
---

:::note
If you are planning to deploy in this mode, you should **[reach out to us](https://scribesecurity.com/contact-us/ "Contact Us")** to discuss a custom license.
:::

In a local deployment, Valint generates SBOMs, collects additional evidence, and uses a filesystem folder or an OCI registry that you provide as a storage place for this evidence. When evaluating a policy, Valint retrieves the necessary evidence from this designated evidence store.

However, it's important to note that when operating in stand-alone mode, some features of Scribe Hub, such as its supply chain intelligence and analytics and SBOM management services, are not accessible.
