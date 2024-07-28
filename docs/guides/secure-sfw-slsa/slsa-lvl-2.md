<p><a target="_blank" href="https://app.eraser.io/workspace/4Rsk6DveWl4TtaN78fAI" id="edit-in-eraser-github-link"><img alt="Edit in Eraser" src="https://firebasestorage.googleapis.com/v0/b/second-petal-295822.appspot.com/o/images%2Fgithub%2FOpen%20in%20Eraser.svg?alt=media&amp;token=968381c8-a7e7-472a-8ed6-4a6626da5501"></a></p>

---

## sidebar_label: "SLSA Level 2"
title: "Attaining SLSA Level 2"
sidebar_position: 3
toc_min_heading_level: 2
toc_max_heading_level: 5
Checklist for attaining SLSA v1.0 Level 2:

- [﻿SLSA Level 1 checklist](slsa-lvl-1) 
- Build with a hosted build service (as opposed to building on the developer’s machine).
- Generate and sign a Provenance Document (a signed SLSA Level 1 document).
- Verify downstream the authenticity of the Provenance Document.
#### Generating a signed Provenance Document
Call the following from your build script after the build artifact is complete:

```
# Create signed SLSA Provenance
valint slsa [target] -o attest --context-type [jenkins github circleci azure gitlab travis bitbucket] 
 -E \
 -P [SCRIBE_TOKEN]
```
Where `[Target]` is the build artifact name. You can find signing configuration instructions [﻿here](../../guides/enforcing-sdlc-policy).

#### Secure key management​
Store keys and access tokens in the build platform or preferably in a secret management system. Make sure to expose the keys only at the provenance generation step.

#### Verifying the Provenance Document
To verify make the following call:

```
# Create signed SLSA Provenance
valint verify [target] -i attest-slsa --email [build-platform-identity]
```




<!--- Eraser file: https://app.eraser.io/workspace/4Rsk6DveWl4TtaN78fAI --->