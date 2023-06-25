---
title: Compliance
sidebar_position: 2
---

# Compliance

In July 2022, the United States Office of Management and Budget (OMB) published a memo addressing compliance with new cybersecurity regulations, which we covered in [detail](https://scribesecurity.com/blog/how-can-you-make-sure-your-bottom-line-doesnt-get-knocked-out-by-the-omb-memo/ "OMB memo"). Subsequently, in September 2022, another memo was released, focusing on the security and integrity of the software supply chain and highlighting the significant role of SBOMs. This memo presents a list of precise requirements and, for the first time, provides a binding timeline for implementing changes. 

The memo contains two main points related to the [Executive Order (EO) 14028](https://www.whitehouse.gov/briefing-room/presidential-actions/2021/05/12/executive-order-on-improving-the-nations-cybersecurity/ "Executive Order (EO) 14028"), Improving the Nation’s Cybersecurity: 

1. The EO directs the National Institute of Standards and Technology (NIST) to share guidance on developing practices aimed at enhancing the security of the software supply chain. To support this objective, NIST has released two documents: the Secure Software Development Framework (SSDF), [SP 800-218](https://csrc.nist.gov/publications/detail/sp/800-218/final "SP 800-218"), and [Software Supply Chain Security Guidance](https://www.nist.gov/itl/executive-order-14028-improving-nations-cybersecurity/software-supply-chain-security-guidance "Software Supply Chain Security Guidance"). Together, these documents are referred to as NIST Guidance and outline a set of practices that form the foundation for creating secure software

2. The EO also mandates that the Office of Management and Budget require agencies to align with the NIST Guidance and any future updates.

While self-attestation is the minimum level of requirement, agencies may be exempt from it if the product or service they require is critical and cannot provide self-attestation in a standard form.

Importantly, the memo encourages agencies to obtain artifacts from vendors that demonstrate adherence to secure software development practices, including the implementation of an SBOM.

Scribe's platform can assist you in creating an SBOM for each of your builds, as well as collecting various other evidence. Explore our [CI Integrations](../../docs/ci-integrations "CI Integrations") to discover the features we offer, and refer to the ["generating SLSA provenance"](../../docs/ci-integrations/github/#generating-the-slsa-provenance-in-your-pipeline "generating SLSA provenance") section to learn more.

