---
title: SBOMs
sidebar_position: 3
---

# Generating and managing SBOMs

Today, software packages often contain numerous third-party components, requiring companies to actively monitor and manage each one to ensure security and functionality. Software Bill of Materials (SBOMs) represents a new approach to an established concept. In supply chain management, vendors traditionally used bills of materials (BOMs) to identify the components comprising their products. For instance, the ingredient list on grocery store products serves as a BOM. However, the application of BOMs to software is a more recent development. The widespread recognition of SBOMs occurred in May 2021, following an [executive order highlighting SBOMs](https://www.whitehouse.gov/briefing-room/presidential-actions/2021/05/12/executive-order-on-improving-the-nations-cybersecurity/ "Executive Order (EO) 14028") from the Biden administration emphasizing their importance in bolstering cybersecurity in the USA. As a result, software suppliers selling to the US federal government must provide SBOMs for their products as mandated. It is prudent for organizations to adopt SBOMs as a means of effectively managing these software components. SBOMs are machine-readable lists that encompass the dependencies and elements of a software application.

An SBOM is similar to a BOM used in supply chains and manufacturing, listing all the component parts and software dependencies involved in the development and delivery of an application. While there hasn't been a universal standard in the IT industry to accurately describe the foundational code components of an application, SBOMs fulfill this role.

A typical SBOM includes licensing information, version numbers, component details, and vendors. This comprehensive list mitigates risks for manufacturers and users by enabling others to understand the software's composition and take appropriate actions. While SBOMs are not new to the software industry, their significance has increased as development processes have become more sophisticated and costly. They are now considered a fundamental requirement in various industries.

SBOMs provide organizations with effective means to maintain the security and integrity of their data and processes. They also foster transparency among developers, software suppliers, and clients, setting a precedent in the industry. By adhering to standards, organizations can confidently share operational details with partners during the contracting process. As SBOM adoption becomes more widespread, organizations will be better equipped to identify flaws, vulnerabilities, and zero-day threats. Ultimately, the adoption of SBOMs contributes to enhancing software supply chain security globally.

## Benefits of the SBOM  

* **Addresses Threats to Integrity**: Attacks can occur at any stage of a typical software supply chain and have become increasingly visible, disruptive, and costly in today's world. SBOMs play a crucial role in maintaining integrity by verifying that the components and files listed are as intended. For example, the CycloneDX format includes a hash value component that enables exact matching of files and components. Since an SBOM is not a static document, it should be regularly updated to reflect any changes in the described software or its components.

* **Enables Visibility of Product Components**: Building client trust is essential for fostering loyalty and encouraging repeat purchases. Shared SBOMs provide enhanced visibility into the quality of the technologies utilized, offering more than mere assurances or promises.

* **Facilitates Easier Vulnerability Scanning**: SBOMs enable companies to identify and address vulnerabilities before they reach production. This allows for swift resolution of new vulnerabilities in production software. Ultimately, SBOMs aid engineers in detecting and resolving security flaws more efficiently.

* **Strengthens Licensing Governance for Your Product**: Adoption of Software Bill of Materials can significantly enhance software licensing governance. Each software component within a supply chain may have different licenses, and compliance with these licenses is legally required for businesses using the software. Without a software bill of materials, it can be challenging to determine the specific license requirements and ensure compliance.

Scribe's *Valint* offers the capability to generate evidence in the form of SBOMs, as well as provide SLSA provenance for your builds. 

## Creating an SBOM and collecting evidence

The simplest integration involves automating the use of *Valint* to gather evidence regarding your commits, repository checkout, and generate an SBOM for the final artifact. Scribe currently supports evidence collection from the following entities:

* Image - Supported image formats include Docker manifest v2 and Oracle Cloud Infrastructure (OCI) images. Images are commonly used as the final artifact.
* Folder - Collect evidence from a folder containing relevant files.
* File - Gather evidence from individual files.
* GIT repository - Gather evidence from a remote or local GIT repository.   

Once you have generated the evidence in your software development lifecycle (SDLC) or pipeline, it can be automatically uploaded to Scribe Hub. Visit our [CI Integrations](../../docs/ci-integrations "CI Integrations") to learn more about the integration process.

In Scribe Hub, you can easily access, analyze, and download your SBOM, providing you with comprehensive visibility and control over your software artifacts.

<img src='../../../img/ci/sbom.jpg' alt='Project SBOM'/>


