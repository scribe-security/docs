---
sidebar_label: "SLSA Level 3"
title: "Attaining SLSA Level 3"
sidebar_position: 4
toc_min_heading_level: 2
toc_max_heading_level: 5
---

Checklist for attaining SLSA v1.0 Level 3:
* **[SLSA Level 2 checklist](slsa-lvl-2)**
* Isolate the generation of the Provenance Document with one of the following alternatives:
  * Generate the Provenance Document in the build pipeline and then verify and sign it in a separate pipeline. Verify all possible fields with data collected directly from the build platform, or another trusted source.
  * Generate the Provenance Document in a separate pipeline, preferably on a separate build service.
  * Use a secure build runner such as GitHub Actions.
* Assure the secret materials used for signing the Provenance Document are not exposed beyond the signing step. Particularly, not to the build pipeline.
* Isolate, and verify the isolation of the build pipeline from other build runs as follows:
  * Verify build cache isn’t used, and that volumes aren’t shared with other pipeline runs.
  * Verify secrets aren’t shared with other pipelines.
  * Verify that build runs cannot affect each other. For example, prevent one build from installing an artifact that affects another build run. This can be realized with ephemeral build-runners in containers created for each build, or by verifying that build-runners start each time from a predefined state.

#### Generating a signed Provenance Document

Call the following from your build script after the build artifact is complete:
```
# Create signed SLSA Provenance
valint slsa [target] -o attest --context-type [jenkins github circleci azure gitlab travis bitbucket] 
 -P [SCRIBE_TOKEN]
```
Where `[Target]` is the build artifact name. You can find signing configuration instructions **[here](../../guides/enforcing-sdlc-policy)**.

#### Using a trusted builder

If you are using a trusted build service such as GitHub actions add the flag `--label builder_slsa_evidence`.

#### Attesting that the builder can be trusted
In case your build service **doesn’t** provide a trusted builder you should generally follow the steps below. ​Please contact us for customizing the tools for your specific environment.
* Generate the Provenance Document in the build pipeline. 
* Create a separate verification pipeline that performs the following:
  * Collect data from the build service and use it to verify the Provenance document.
  * Verify the content of attestations created in the build pipeline. For example, verify the content of the build-runner by comparing an SBOM attestation from the build pipeline with an SBOM attestation that was sampled separately.
* Use attestations collected from the build pipeline to update the Provenance document.
* Verify that the build run was isolated, by querying the build service for information about the use of elements such as cache and secrets.

#### Secure key management​
Store keys and access tokens in the build platform or preferably in a secret management system. Make sure to expose the keys only at the provenance generation step.

#### Verifying the Provenance Document
To verify make the following call:
```
# Create signed SLSA Provenance
valint verify [target] -i attest-slsa --email [build-platform-identity]
```