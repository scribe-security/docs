---
sidebar_label: "Signing & verifying container images"
title: Signing & verifying container images
sidebar_position: 2
---

An attestation is cryptographically signed piece of evidence. It's a mechanism for software to prove its identity and authenticity. The goal of attestation is to prove to a third party that the signed evidence is intact and trustworthy. Scribe's tool *Valint* allows you to not only create various pieces of evidence based on different forms of an SBOM, but also to sign them into an attestation. Once signed, you can later verify that the container image you have signed is indeed intact and trustworthy. You can read more about an in-toto attestation **[here](https://github.com/in-toto/attestation "in-toto attestation GitHub link")** and about the SLSA Attestation Model **[here](https://github.com/slsa-framework/slsa/blob/main/docs/attestation-model.md "SLSA Attestation Model GitHub link")**.

Go [here](../../../how-to-run-scribe/signVerify) to learn more on the mechanics of Scribe's sign/verify tool. 