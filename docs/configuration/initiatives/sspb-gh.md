---
sidebar_label: Secure Software Pipeline Blueprint for GitHub
title: Secure Software Pipeline Blueprint
---  
# Secure Software Pipeline Blueprint  
**Type:** Initiative  
**ID:** `SSPB-GH`  
**Version:** `1.0.0`  
**Bundle-Version:** `v2`  
**Source:** [v2/initiatives/sspb-gh.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/initiatives/sspb-gh.yaml)  
**Help:** https://github.com/Venafi/blueprint-securesoftwarepipeline  

Blueprint for secure pipelines - GitHub

## **Description**

This initiative defines a set of best practices and technical guidelines designed to safeguard every stage of the software delivery process—from code development and build, to testing and production deployment. It emphasizes the importance of ensuring code integrity, authenticating build artifacts, and continuously monitoring system changes to mitigate the risk of supply chain attacks. The framework is adaptable to various environments and aligned with industry standards, providing organizations with actionable steps to enhance their overall security posture.

## Controls Overview

| Control Name | Control Description | Mitigation |
|--------------|---------------------|------------|
| [[CTL-1] Restrict administrative access to CI/CD tools](#ctl-1-restrict-administrative-access-to-cicd-tools) | Restrict administrative access to CI/CD tools | Limit administrative privileges to a minimal, controlled group to reduce the risk of unauthorized pipeline changes. |
| [[CTL-2] Only accept commits signed with a developer GPG key](#ctl-2-only-accept-commits-signed-with-a-developer-gpg-key) | The use of these rules enables first measuring the adoption of commit signing without enforcement that could interfere with the developers work, and only when signed commits are well deployed to move to enforcement by GitHub | Require all commits to be signed to improve accountability and reduce the risk of unauthorized code modifications. |
| [[CTL-3] Automation access keys expire automatically](#ctl-3-automation-access-keys-expire-automatically) | Automation access keys expire automatically | Configure automation keys to expire automatically, limiting the window in which compromised keys can be exploited. |
| [[CTL-4] Reduce automation access to read-only](#ctl-4-reduce-automation-access-to-read-only) | Reduce automation access to read-only | Restrict automation accounts to read-only access, following the principle of least privilege to minimize potential damage. |
| [[CTL-5] Only dependencies from trusted registries can be used](#ctl-5-only-dependencies-from-trusted-registries-can-be-used) | Only dependencies from trusted registries can be used | Restrict dependencies to trusted registries to prevent the introduction of malicious code through third-party packages. |
| [[CTL-6] Any critical or high severity vulnerability breaks the build](#ctl-6-any-critical-or-high-severity-vulnerability-breaks-the-build) | Any critical or high severity vulnerability breaks the build | Immediately fail the build when critical or high-severity vulnerabilities are detected, forcing prompt investigation and remediation. |
| [[CTL-7] Artifacts are stored in a repository in development, stage and production](#ctl-7-artifacts-are-stored-in-a-repository-in-development-stage-and-production) | Artifacts are stored in a repository in development, stage and production | Store all artifacts in a repository at each stage of the build pipeline to ensure traceability and maintain immutability. |
| [[CTL-8] Validate artifact digest](#ctl-8-validate-artifact-digest) | Validate artifact digest | Validate the artifact’s digest before deployment to ensure it has not been tampered with and maintains software integrity. |
| [[CTL-9] Pull-requests require two reviewers (including one default reviewer) and a passing build to be merged](#ctl-9-pull-requests-require-two-reviewers-including-one-default-reviewer-and-a-passing-build-to-be-merged) | Pull-requests require two reviewers (including one default reviewer) and a passing build to be merged | Enforce a review process requiring at least two reviewers and a passing build, ensuring thorough evaluation and testing before code is merged. |
| [[CTL-10] Artifacts in higher repositories are signed](#ctl-10-artifacts-in-higher-repositories-are-signed) | Artifacts in higher repositories are signed | Require artifacts to be signed in higher repositories to ensure authenticity and prevent tampering. |
| [[CTL-11] Available container images don’t have any high or critical vulnerabilities](#ctl-11-available-container-images-dont-have-any-high-or-critical-vulnerabilities) | Available container images don’t have any high or critical vulnerabilities | Continuously scan container images for vulnerabilities and ensure that only images without high or critical issues are deployed. |
| [[CTL-12] Validate artifact signatures and digests](#ctl-12-validate-artifact-signatures-and-digests) | Validate artifact signatures and digests | Ensure that artifacts are properly signed and their digests validated, confirming authenticity and preventing tampering. |
| [[CTL-13] Scan deployed images in production](#ctl-13-scan-deployed-images-in-production) | Scan deployed images in production | Continuously monitor and scan production images to ensure ongoing compliance with security standards. |
| [[CTL-14] Validate Kubernetes resource manifests](#ctl-14-validate-kubernetes-resource-manifests) | Validate Kubernetes resource manifests | Ensure that Kubernetes manifests are validated to prevent misconfigurations and security vulnerabilities. |
| [[CTL-15] Ensure build environments are ephemeral and immutable](#ctl-15-ensure-build-environments-are-ephemeral-and-immutable) | Ensure build environments are ephemeral and immutable | Build environments should be defined in code with automated creation and teardown, and that a fresh environment is created for every build |

## Evidence Defaults

| Field | Value |
|-------|-------|
| signed | True |

---

# Detailed Controls

## [CTL-1] Restrict administrative access to CI/CD tools

Restrict administrative access to CI/CD tools


### Mitigation  
Limit administrative privileges to a minimal, controlled group to reduce the risk of unauthorized pipeline changes.

### **Description**

It's important to ensure that only authorized persons can make administrative changes to the CI/CD system. If an unauthorized person gains access, they could modify pipeline definitions and subvert other controls.

Both host and application-layer access to CI/CD tools should be protected with multi-factor authentication.

> :skull: Instead of manipulating code, attackers may target the CI/CD pipeline itself, leading to undetected breaches and long-term damage.

### Rules

| Rule ID | Rule Name | Rule Description |
|---------|-----------|------------------|
| [max-admins](rules/github/org/max-admins.md) | [max-admins](rules/github/org/max-admins.md) | Verify the maximum number of GitHub organization admins is restricted. |
| [allowed-admins](rules/github/org/allow-admins.md) | [allowed-admins](rules/github/org/allow-admins.md) | Verify only users in the Allowed List have admin privileges in the GitHub organization. |

## [CTL-2] Only accept commits signed with a developer GPG key

The use of these rules enables first measuring the adoption of commit signing without enforcement that could interfere with the developers work, and only when signed commits are well deployed to move to enforcement by GitHub


### Mitigation  
Require all commits to be signed to improve accountability and reduce the risk of unauthorized code modifications.

### **Description**

Unsigned code commits are difficult to trace and pose a risk to the integrity of the codebase. Requiring commits to be signed with a developer GPG key ensures nonrepudiation and increases the burden on attackers.

> :skull: Attackers may exploit unsigned commits by stealing credentials or infecting developer machines, allowing them to inject malicious code.

### Rules

| Rule ID | Rule Name | Rule Description |
|---------|-----------|------------------|
| [disallow-committing-unsigned](rules/github/repository/signed-commits.md) | [disallow-committing-unsigned](rules/github/repository/signed-commits.md) | Verify all commits are signed in a repository attestation. |
| [all-commits-verified](rules/github/repository/check-signed-commits.md) | [all-commits-verified](rules/github/repository/check-signed-commits.md) | Verify all commits in the GitHub repository are signed. |
| [web-commit-signoff-required](rules/github/repository/web-commit-signoff.md) | [web-commit-signoff-required](rules/github/repository/web-commit-signoff.md) | Verify contributors sign off on commits to the GitHub repository through the GitHub web interface. |

## [CTL-3] Automation access keys expire automatically

Automation access keys expire automatically


### Mitigation  
Configure automation keys to expire automatically, limiting the window in which compromised keys can be exploited.

### **Description**

Ensuring that access keys used by automation expire periodically reduces the risk when keys are compromised.

> :skull: Automated systems run continuously and are attractive targets; compromised keys with a short lifespan minimize potential damage.

:::warning  
This control is not supported yet.
::: 

## [CTL-4] Reduce automation access to read-only

Reduce automation access to read-only


### Mitigation  
Restrict automation accounts to read-only access, following the principle of least privilege to minimize potential damage.

### **Description**

CI systems should have read access only to source code repositories to limit the risk from compromised automation accounts.

> :skull: Attackers who gain write access via automation credentials can bypass review processes; restricting access reduces this risk.

:::warning  
This control is not supported yet.
::: 

## [CTL-5] Only dependencies from trusted registries can be used

Only dependencies from trusted registries can be used


### Mitigation  
Restrict dependencies to trusted registries to prevent the introduction of malicious code through third-party packages.

### **Description**

Modern software dependency managers, including `npm`, `maven`, `Nuget`, `pip`, and others, rely on declaring the dependencies required for the application and then fetching them at build time. By configuring the dependency manager to only allow connections to an authorized list of registries, these attacks can be blunted by keeping malicious packages in the public registries from entering the pipeline.

The trusted repository can also ensure that security policies are enforced on dependencies. For example, trusted repositories could ensure that only dependencies that are free of critical or high vulnerabilities are used. Implementing a control at the repository that returns an error when a component with known vulnerabilities is requested helps to reduce the chances of an attack against a known vulnerability downstream.

Teams should be aware of implicit runtime dependencies as well as explicit buildtime dependencies (see Control 14).

> :skull: 
> Attackers can quickly spread malicious code through dependencies. Attackers might insert malicious code that is then incorporated into the application’s manifest by stealing credentials en masse for sophisticated, targeted thefts.
> Hackers can also target mistakes and oversights through _typo-squatting_ and _dependency confusion_. Adversaries go to great ends to publish packages under a trusted name or even with common typos so that they are included in builds.
> All of the stakes are raised exponentially when public repositories are used.  

### Rules

| Rule ID | Rule Name | Rule Description |
|---------|-----------|------------------|
| [allowed-base-image](rules/images/allowed-base-image.md) | [Ensure that base images are from an approved source](rules/images/allowed-base-image.md) | Verifies that every base image is from an approved source. The rule returns a summary including the component names and versions of valid base images, or lists the invalid ones. This rule requires Dockerfile context; for example, run it with: `valint my_image --base-image Dockerfile`. |

## [CTL-6] Any critical or high severity vulnerability breaks the build

Any critical or high severity vulnerability breaks the build


### Mitigation  
Immediately fail the build when critical or high-severity vulnerabilities are detected, forcing prompt investigation and remediation.

### **Description**

Supply chain attacks may introduce code vulnerabilities. Using SAST and SCA to identify serious security issues and failing the build prevents insecure code from being merged.

> NOTE: This control complements Control-4 by ensuring no critical vulnerabilities are ignored.

Early detection reduces remediation costs, but also requires a well-defined vulnerability exception process.

> :skull: Vulnerabilities, if undetected, can proliferate quickly and cause widespread damage.

### Rules

| Rule ID | Rule Name | Rule Description |
|---------|-----------|------------------|
| [stop-critical-or-high-vuln](rules/api/scribe-api-cve.md) | [stop-critical-or-high-vuln](rules/api/scribe-api-cve.md) | Verify via Scribe API that there are no critical or high severity vulnerabilities in the target artifact (container image, folder, etc.). |

## [CTL-7] Artifacts are stored in a repository in development, stage and production

Artifacts are stored in a repository in development, stage and production


### Mitigation  
Store all artifacts in a repository at each stage of the build pipeline to ensure traceability and maintain immutability.

### **Description**

All artifacts should be stored in a repository at each stage of the build pipeline so that there is clear traceability between the test results and the actual artifact that was tested. This control also helps to enforce the immutability of the artifacts, such that we can compare artifacts in the development, staging and production repositories and ensure that we maintain a chain of control.

Repositories for dev, stage and production should be segregated so that role-based access control can ensure least privilege at each stage, and so that more stringent policies (such as artifact signing) can be enforced in higher environments.

Artifacts should be promoted from repository to repository in accordance with the principle of immutability.

### Rules

| Rule ID | Rule Name | Rule Description |
|---------|-----------|------------------|
| [artifacts-stored-in-registries](rules/images/allowed-image-source.md) | [Artifacts are stored in a repository](rules/images/allowed-image-source.md) | Ensures the main container image referenced in the SBOM is from an approved source. |

## [CTL-8] Validate artifact digest

Validate artifact digest


### Mitigation  
Validate the artifact’s digest before deployment to ensure it has not been tampered with and maintains software integrity.

### **Description**

Before deployment, an artifact’s digest is checked against the expected value to confirm it has not been compromised.

> :skull: Attackers often attempt to alter artifacts; validating the digest helps ensure integrity.

### Rules

| Rule ID | Rule Name | Rule Description |
|---------|-----------|------------------|
| [require-sbom](rules/sbom/evidence-exists.md) | [Require SBOM Existence](rules/sbom/evidence-exists.md) | Verify the SBOM exists as evidence. |

## [CTL-9] Pull-requests require two reviewers (including one default reviewer) and a passing build to be merged

Pull-requests require two reviewers (including one default reviewer) and a passing build to be merged


### Mitigation  
Enforce a review process requiring at least two reviewers and a passing build, ensuring thorough evaluation and testing before code is merged.

### **Description**

Requiring multiple code reviews and successful tests helps ensure that no changes are merged without proper oversight.

> :skull: Without proper reviews, attackers can insert malicious changes; this control mitigates that risk.

### Rules

| Rule ID | Rule Name | Rule Description |
|---------|-----------|------------------|
| [merge-approval](rules/github/repository/approvals-policy-check.md) | [merge-approval](rules/github/repository/approvals-policy-check.md) | Verify the repository's pull request approval policy |

## [CTL-10] Artifacts in higher repositories are signed

Artifacts in higher repositories are signed


### Mitigation  
Require artifacts to be signed in higher repositories to ensure authenticity and prevent tampering.

### **Description**

Requiring artifacts to be signed in a repository throughout the process ensures visibility and traceability for whatever is deployed to production. Requiring signed artifacts helps to ensure that untrusted binaries are not deployed to customer environments and allows validating the source of the binaries.

> :skull: 
> Through credential theft, vulnerability exploit, targeted attacks or more, attackers succeed in inserting their malicious code into pipelines and repositories. Code should be considered suspect and malicious.

### Rules

| Rule ID | Rule Name | Rule Description |
|---------|-----------|------------------|
| [sbom-is-signed](rules/sbom/artifact-signed.md) | [sbom-is-signed](rules/sbom/artifact-signed.md) | Verify the SBOM is signed. |
| [artifacts-stored-in-registries](rules/images/allowed-image-source.md) | [Artifacts are stored in a repository](rules/images/allowed-image-source.md) | Ensures the main container image referenced in the SBOM is from an approved source. |

## [CTL-11] Available container images don’t have any high or critical vulnerabilities

Available container images don’t have any high or critical vulnerabilities


### Mitigation  
Continuously scan container images for vulnerabilities and ensure that only images without high or critical issues are deployed.

### **Description**

Container images must be scanned before deployment to prevent the inclusion of images with serious vulnerabilities.

> :skull: Vulnerable containers can be a major attack vector; this control helps prevent their use.

### Rules

| Rule ID | Rule Name | Rule Description |
|---------|-----------|------------------|
| [stop-critical-or-high-vuln](rules/api/scribe-api-cve.md) | [stop-critical-or-high-vuln](rules/api/scribe-api-cve.md) | Verify via Scribe API that there are no critical or high severity vulnerabilities in the target artifact (container image, folder, etc.). |

## [CTL-12] Validate artifact signatures and digests

Validate artifact signatures and digests


### Mitigation  
Ensure that artifacts are properly signed and their digests validated, confirming authenticity and preventing tampering.

### **Description**

Validating the signature and digest of an artifact ensures that it has not been altered between testing and deployment.

> :skull: This control helps prevent the deployment of artifacts that may have been modified by attackers.

### Rules

| Rule ID | Rule Name | Rule Description |
|---------|-----------|------------------|
| [sbom-is-signed](rules/sbom/artifact-signed.md) | [sbom-is-signed](rules/sbom/artifact-signed.md) | Verify the SBOM is signed. |

## [CTL-13] Scan deployed images in production

Scan deployed images in production


### Mitigation  
Continuously monitor and scan production images to ensure ongoing compliance with security standards.

### **Description**

Production images should be validated to ensure that controls enforced during earlier stages continue to be effective in production.

> :skull: Ongoing monitoring helps detect any security issues that may emerge post-deployment.

### Rules

| Rule ID | Rule Name | Rule Description |
|---------|-----------|------------------|
| [sbom-is-signed](rules/sbom/artifact-signed.md) | [sbom-is-signed](rules/sbom/artifact-signed.md) | Verify the SBOM is signed. |
| [disallow-dependencies](rules/sbom/blocklist-packages.md) | [disallow-dependencies](rules/sbom/blocklist-packages.md) | Verify the number of disallowed dependencies remains below the specified threshold. |
| [stop-critical-or-high-vuln](rules/api/scribe-api-cve.md) | [stop-critical-or-high-vuln](rules/api/scribe-api-cve.md) | Verify via Scribe API that there are no critical or high severity vulnerabilities in the target artifact (container image, folder, etc.). |

## [CTL-14] Validate Kubernetes resource manifests

Validate Kubernetes resource manifests


### Mitigation  
Ensure that Kubernetes manifests are validated to prevent misconfigurations and security vulnerabilities.

### **Description**

The last line of defense is the _container orchestration layer_. Kubernetes is responsible for deploying the containers of the application into production, and if the resource manifests are tampered with, it could be tricked into deploying a container of the attacker’s choice. It is important to ensure that the Kubernetes resource manifests are controlled and validated just as the actual images are.

### Rules

| Rule ID | Rule Name | Rule Description |
|---------|-----------|------------------|
| [k8s-manifests-integrity-validated](rules/generic/evidence-exists.md) | [Validate Kubernetes resource manifests integrity](rules/generic/evidence-exists.md) | Verify required evidence exists. |

## [CTL-15] Ensure build environments are ephemeral and immutable

Ensure build environments are ephemeral and immutable


### Mitigation  
Build environments should be defined in code with automated creation and teardown, and that a fresh environment is created for every build

### **Description**

Build environments should be defined in code with automated creation and teardown, and that a fresh environment is created for every build. Build hosts should not be accessible using interactive logins.

> :skull: 
> Attackers who gain access to build environments are able to bypass controls implemented earlier in the build pipeline. Ensuring build environments are themselves defined as code and live only for the duration of a build prevents attackers from persisting in build infrastructures.


### Rules

| Rule ID | Rule Name | Rule Description |
|---------|-----------|------------------|
| [ensure-ephemeral-runners](rules/github/repository/ephemeral-runners-only.md) | [ensure-ephemeral-runners](rules/github/repository/ephemeral-runners-only.md) | Verify self-hosted runners are disallowed in the GitHub repository. |
