---
sidebar_label: "SLSA Level 2"
title: "Attaining SLSA Level 2"
sidebar_position: 3
toc_min_heading_level: 2
toc_max_heading_level: 5
---

Checklist for attaining SLSA v1.0 Level 2:
* **[SLSA Level 1 checklist](slsa-lvl-1)**
* Build with a hosted build service (as opposed to building on the developer’s machine).
* Generate and sign a Provenance Document (a signed SLSA Level 1 document).
* Verify downstream the authenticity of the Provenance Document.

#### Generating a signed Provenance Document

Call the following from your build script after the build artifact is complete:
```
# Create signed SLSA Provenance
valint slsa [target] -o attest --context-type [jenkins github circleci azure gitlab travis bitbucket] 
 -E \
 -U [SCRIBE_CLIENT_ID] \
 -P [SCRIBE_CLIENT_SECRET]
```
Where `[Target]` is the build artifact name. You can find signing configuration instructions **[here](../../guides/enforcing-sdlc-policy)**.

#### Secure key management​

Store keys and access tokens in the build platform or preferably in a secret management system. Make sure to expose the keys only at the provenance generation step.

#### Verifying the Provenance Document
To verify make the following call:
```
# Create signed SLSA Provenance
valint verify [target] -i attest-slsa --email [build-platform-identity]
```