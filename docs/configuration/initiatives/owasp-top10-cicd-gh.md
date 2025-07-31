---
sidebar_label: OWASP Top 10 CI/CD Security Controls for GitHub
title: OWASP Top 10 CI/CD Security Controls
---  
# OWASP Top 10 CI/CD Security Controls  
**Type:** Initiative  
**ID:** `OWASP-TOP10-CICD-SC-GH`  
**Version:** ``  
**Bundle-Version:** `v2`  
**Source:** [v2/initiatives/owasp-top10-cicd-gh.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/initiatives/owasp-top10-cicd-gh.yaml)  
**Help:** https://owasp.org/www-project-top-10-ci-cd-security-risks/  

OWASP Top 10 CI/CD Security Controls - GitHub

## **Description**

This initiative provides a set of security controls for CI/CD pipelines implementing the OWASP Top 10 CI/CD Security Risks framework.

## Required Evidence

This initiative requires the following evidence types:

- [Signed SBOM](/docs/valint/sbom)
- [Image SBOM](/docs/valint/sbom)
- [Git SBOM](/docs/valint/sbom)
- [Signed Git SBOM](/docs/valint/sbom)
- [Signed SLSA Provenance](/docs/valint/help/valint_slsa)
- [SARIF Evidence](/docs/valint/sarif)
- [Github Organization Discovery Evidence](/docs/platforms/discover#github-discovery)
- [Github Repository Discovery Evidence](/docs/platforms/discover#github-discovery)

## Evidence Defaults

| Field | Value |
|-------|-------|
| signed | False |

## Rule Parameters
To configure this initiative for your organization needs, the following parameters should be specified:

- **[CICD-SEC-1] Insufficient Flow Control Mechanisms**
  - **Require Branch Protection**
    - **`branches`**: `array` - List of branches to be protected.  
      *Default:* `['main', 'master']`.
  - **Pull request approval policy check**
    - **`approvals_required_min`**: `number` - Minimum number of approvals required for pull requests.  
      *Default:* `1`.
- **[CICD-SEC-2] Inadequate Identity and Access Management**
  - **Limit Admin Number**
    - **`max_admins`**: `integer` - Maximum number of admins allowed.  
      *Default:* `4`.
  - **Allowed GitHub Organization Admins**
    - **`allowed_admins`**: `array` - List of allowed GitHub organization admins.
  - **Allowed GitHub Organization Users**
    - **`allowed_users`**: `array` - List of allowed users.
  - **'Create repositories' permissions check**
  - **Limit Public Repositories**
    - **`allowed_repo_names`**: `array` - List of repository pattern allowed to be visible.
- **[CICD-SEC-3] Dependency Chain Abuse**
  - **Ensure that base images are from an approved source**
    - **`approved_sources`**: `array` - A list of approved base image registry URL prefixes.  
      *Default:* `['index.docker.io/library/.*', 'gcr.io/.*']`.
  - **Verify NPM Packages Origin**
    - **`allowed_registries`**: `array` - A list of allowed NPM registries.  
      *Default:* `['https://registry.npmjs.org/']`.
- **[CICD-SEC-4] Poisoned Pipeline Execution**
  - **Restrict Pipeline Script Modification**
    - **`files`**: `array` - The list of files that are allowed to be committed to the repository.  
      *Default:* `['.github/workflow/*.yml', '.github/workflow/*.yaml']`.
    - **`ids`**: `array` - The list of user (commit.author) IDs allowed to commit to the repository.
  - **Require Branch Protection**
    - **`branches`**: `array` - List of branches to be protected.  
      *Default:* `['main', 'master']`.
- **[CICD-SEC-6] Insufficient Credential Hygiene**
  - **Verify No Old Secrets Exist in Organization**
    - **`max_secret_age`**: `integer` - Maximum age of secrets in months.  
      *Default:* `6`.
  - **Verify No Old Secrets Exist in Repository**
    - **`max_secret_age`**: `integer` - Maximum age of secrets in months.  
      *Default:* `6`.
  - **Verify Trivy Secret Scan Report**
    - **`rule_names`**: `array` - List of rule names to check for in the Trivy SARIF report.  
      *Default:* `['Secret']`.
    - **`max_allowed`**: `integer` - The maximum number of allowed violations.

## Controls Overview

| Control Name | Control Description | Mitigation |
|--------------|---------------------|------------|
| [[CICD-SEC-1] Insufficient Flow Control Mechanisms](#cicd-sec-1-insufficient-flow-control-mechanisms) | Ensure that the CI/CD pipeline has sufficient flow control mechanisms  to prevent unauthorized pushing of malicious code into artifacts. | Implement branch protection rules to prevent unauthorized changes.  Require signed commits to maintain code integrity. |
| [[CICD-SEC-2] Inadequate Identity and Access Management](#cicd-sec-2-inadequate-identity-and-access-management) | Ensure that the CI/CD pipeline has adequate identity and access management to prevent unauthorized access to the pipeline and artifacts. | Implement strong identity and access management practices. Enforce multi-factor authentication (MFA) for all users. Limit the number of administrators to the minimum required. Ensure repositories are private to prevent unauthorized access. |
| [[CICD-SEC-3] Dependency Chain Abuse](#cicd-sec-3-dependency-chain-abuse) | Ensure that the CI/CD pipeline has mechanisms to prevent dependency chain abuse. |  |
| [[CICD-SEC-4] Poisoned Pipeline Execution](#cicd-sec-4-poisoned-pipeline-execution) | Ensure that the pipeline script cannot be tampered with | Restrict access to the pipeline script to prevent unauthorized modifications.  Implement strict permissions and review processes for any changes to the pipeline script. |
| [[CICD-SEC-5] Insufficient Pipeline Access Controls](#cicd-sec-5-insufficient-pipeline-access-controls) | Ensure that the CI/CD pipeline has sufficient access controls to prevent unauthorized access to the pipeline and artifacts. Implement strict access controls for the CI/CD pipeline to prevent unauthorized access. Use ephemeral runners to ensure a clean environment for each pipeline run. Ensure that secrets are not shared across pipelines and are scoped to the minimum required. |  |
| [[CICD-SEC-6] Insufficient Credential Hygiene](#cicd-sec-6-insufficient-credential-hygiene) | Ensure that the CI/CD pipeline has sufficient credential hygiene to prevent  unauthorized access to the pipeline and artifacts. |  |
| [[CICD-SEC-7] Insecure System Configuration](#cicd-sec-7-insecure-system-configuration) | Ensure that the CI/CD pipeline has secure system configuration to prevent unauthorized access to the pipeline and artifacts. |  |
| [[CICD-SEC-8] Ungoverned Usage of 3rd Party Services](#cicd-sec-8-ungoverned-usage-of-3rd-party-services) | Ensure that the CI/CD pipeline has mechanisms to prevent ungoverned usage of 3rd party services. |  |
| [[CICD-SEC-9] Improper Artifact Integrity Validation](#cicd-sec-9-improper-artifact-integrity-validation) | Ensure that the CI/CD pipeline has mechanisms to validate the integrity of artifacts. | Implement processes and technologies to validate the integrity of resources all the way from development to production. |
| [[CICD-SEC-10] Insufficient Logging and Visibility](#cicd-sec-10-insufficient-logging-and-visibility) | Ensure that the CI/CD pipeline has sufficient logging and visibility to detect unauthorized access to the pipeline and artifacts. | Identify and build an inventory of all the systems in use within the organization, containing every instance of these systems. |

---

# Detailed Controls

## [CICD-SEC-1] Insufficient Flow Control Mechanisms

Ensure that the CI/CD pipeline has sufficient flow control mechanisms  to prevent unauthorized pushing of malicious code into artifacts.


### Mitigation  
Implement branch protection rules to prevent unauthorized changes.  Require signed commits to maintain code integrity.

### Rules

| Rule ID | Rule Name | Rule Description |
|---------|-----------|------------------|
| [github-repo-branch-protection](rules/github/repository/branch-protection.md) | [Require Branch Protection](rules/github/repository/branch-protection.md) | Configure branch protection rules on branches hosting code which is used in production and other sensitive systems. |
| [github-repo-pr-approval](rules/github/repository/approvals-policy-check.md) | [Pull request approval policy check](rules/github/repository/approvals-policy-check.md) | Ensure that the repository's PR approval policy requires a minimum number of approvals. |
| [github-repo-signed-commits](rules/github/repository/check-signed-commits.md) | [Accept Signed Commits](rules/github/repository/check-signed-commits.md) | Ensure all commits signing is required by branch protection, in order to maintain code integrity. |
| [github-repo-web-commit-signoff](rules/github/repository/web-commit-signoff.md) | [Require Signoff on Web Commits](rules/github/repository/web-commit-signoff.md) | Ensure that the GitHub repository requires signoff on web commits. |
| [sbom-signed](rules/sbom/artifact-signed.md) | [Require Image and Git SBOMs to be signed](rules/sbom/artifact-signed.md) | Verify images and git SBOMs are signed. |

## [CICD-SEC-2] Inadequate Identity and Access Management

Ensure that the CI/CD pipeline has adequate identity and access management to prevent unauthorized access to the pipeline and artifacts.


### Mitigation  
Implement strong identity and access management practices. Enforce multi-factor authentication (MFA) for all users. Limit the number of administrators to the minimum required. Ensure repositories are private to prevent unauthorized access.

### Rules

| Rule ID | Rule Name | Rule Description |
|---------|-----------|------------------|
| [github-org-2fa](rules/github/org/2fa.md) | [Enforce MFA](rules/github/org/2fa.md) | Mandate multi-factor authentication. |
| [github-org-max-admins](rules/github/org/max-admins.md) | [Limit Admin Number](rules/github/org/max-admins.md) | Limit the number of admins to the minimum required. |
| [github-org-allowed-admins](rules/github/org/allow-admins.md) | [Allowed GitHub Organization Admins](rules/github/org/allow-admins.md) | Verify only users in the Allowed List have admin privileges. |
| [github-org-allowed-users](rules/github/org/allow-users.md) | [Allowed GitHub Organization Users](rules/github/org/allow-users.md) | Verify only users in the Allowed List have user access to the GitHub organization. |
| [github-org-create-repos](rules/github/org/create-repos.md) | ['Create repositories' permissions check](rules/github/org/create-repos.md) | Ensure only allowed users can create repositories in the GitHub organization. |
| [github-org-repo-visibility](rules/github/org/repo-visibility.md) | [Limit Public Repositories](rules/github/org/repo-visibility.md) | Verify only repositories in the Allowed List are public in the GitHub organization. |

## [CICD-SEC-3] Dependency Chain Abuse

Ensure that the CI/CD pipeline has mechanisms to prevent dependency chain abuse.

### Rules

| Rule ID | Rule Name | Rule Description |
|---------|-----------|------------------|
| [allowed-base-image](rules/images/allowed-base-image.md) | [Ensure that base images are from an approved source](rules/images/allowed-base-image.md) | Verify that every base image is from an approved source. |
| [allowed-npm-registries](rules/images/allowed-npm-registries.md) | [Verify NPM Packages Origin](rules/images/allowed-npm-registries.md) | Verify that NPM packages are pulled from an approved registry. |

## [CICD-SEC-4] Poisoned Pipeline Execution

Ensure that the pipeline script cannot be tampered with


### Mitigation  
Restrict access to the pipeline script to prevent unauthorized modifications.  Implement strict permissions and review processes for any changes to the pipeline script.

### Rules

| Rule ID | Rule Name | Rule Description |
|---------|-----------|------------------|
| [git-coding-permissions](rules/git/coding-permissions.md) | [Restrict Pipeline Script Modification](rules/git/coding-permissions.md) | Restrict access to the pipeline script to prevent tampering. |
| [github-repo-branch-protection](rules/github/repository/branch-protection.md) | [Require Branch Protection](rules/github/repository/branch-protection.md) | Implement branch protection rules to prevent unauthorized changes. |

## [CICD-SEC-5] Insufficient Pipeline Access Controls

Ensure that the CI/CD pipeline has sufficient access controls to prevent unauthorized access to the pipeline and artifacts. Implement strict access controls for the CI/CD pipeline to prevent unauthorized access. Use ephemeral runners to ensure a clean environment for each pipeline run. Ensure that secrets are not shared across pipelines and are scoped to the minimum required.

### Rules

| Rule ID | Rule Name | Rule Description |
|---------|-----------|------------------|
| [github-repo-ephemeral-runners-only](rules/github/repository/ephemeral-runners-only.md) | [Use Ephemeral GitHub Runner](rules/github/repository/ephemeral-runners-only.md) | Use ephemeral runners to ensure a clean environment for each pipeline run. |
| [github-repo-no-org-secrets](rules/github/repository/no-org-secrets.md) | [Separate Repo Secrets](rules/github/repository/no-org-secrets.md) | Avoid sharing the same set of credentials across multiple contexts. |

## [CICD-SEC-6] Insufficient Credential Hygiene

Ensure that the CI/CD pipeline has sufficient credential hygiene to prevent  unauthorized access to the pipeline and artifacts.

### Rules

| Rule ID | Rule Name | Rule Description |
|---------|-----------|------------------|
| [github-org-old-secrets](rules/github/org/old-secrets.md) | [Verify No Old Secrets Exist in Organization](rules/github/org/old-secrets.md) | Verify secrets in the GitHub organization are not older than the specified threshold. |
| [github-repo-old-secrets](rules/github/repository/old-secrets.md) | [Verify No Old Secrets Exist in Repository](rules/github/repository/old-secrets.md) | Verify secrets in the GitHub repository are not older than the specified threshold. |
| [github-repo-no-org-secrets](rules/github/repository/no-org-secrets.md) | [Separate Repo Secrets](rules/github/repository/no-org-secrets.md) | Avoid sharing the same set of credentials across multiple contexts. |
| [github-repo-secret-scanning](rules/github/repository/secret-scanning.md) | [Verify secret_scanning setting](rules/github/repository/secret-scanning.md) | Detect secrets pushed to and stored on code repositories. |
| [trivy-secret-scan](rules/sarif/trivy/verify-trivy-report.md) | [Verify Trivy Secret Scan Report](rules/sarif/trivy/verify-trivy-report.md) | Verify the Trivy report for exposed secrets. |

## [CICD-SEC-7] Insecure System Configuration

Ensure that the CI/CD pipeline has secure system configuration to prevent unauthorized access to the pipeline and artifacts.

### Rules

| Rule ID | Rule Name | Rule Description |
|---------|-----------|------------------|
| [github-repo-ephemeral-runners-only](rules/github/repository/ephemeral-runners-only.md) | [Use Github Runner](rules/github/repository/ephemeral-runners-only.md) | Use ephemeral runners to ensure a clean environment for each pipeline run. |

## [CICD-SEC-8] Ungoverned Usage of 3rd Party Services

Ensure that the CI/CD pipeline has mechanisms to prevent ungoverned usage of 3rd party services.

:::warning  
This control not currently supported on this platform.
::: 

## [CICD-SEC-9] Improper Artifact Integrity Validation

Ensure that the CI/CD pipeline has mechanisms to validate the integrity of artifacts.


### Mitigation  
Implement processes and technologies to validate the integrity of resources all the way from development to production.

### Rules

| Rule ID | Rule Name | Rule Description |
|---------|-----------|------------------|
| [sbom-signed](rules/sbom/artifact-signed.md) | [Artifact verification software (Image SBOM)](rules/sbom/artifact-signed.md) | Verify image SBOMs are signed. |
| [git-sbom-signed](rules/git/artifact-signed.md) | [Artifact verification software (Git SBOM)](rules/git/artifact-signed.md) | Verify Git SBOMs are signed. |
| [SLSA.L2](rules/slsa/l2-provenance-authenticated.md) | [Artifact verification software (SLSA)](rules/slsa/l2-provenance-authenticated.md) | Verify SLSA Provenance attestations are signed. |
| [git-disallow-unsigned-commits](rules/git/no-unsigned-commits.md) | [Code signing (Git SBOM)](rules/git/no-unsigned-commits.md) | Verify all commits are signed. |
| [github-repo-signed-commits](rules/github/repository/check-signed-commits.md) | [Code signing (GitHub repo)](rules/github/repository/check-signed-commits.md) | Verify all commits are verified on GitHub. |
| [github-repo-web-commit-signoff](rules/github/repository/web-commit-signoff.md) | [Verify GitHub Repository Requires Signoff on Web Commits](rules/github/repository/web-commit-signoff.md) | Ensure that the GitHub repository requires signoff on web commits. |

## [CICD-SEC-10] Insufficient Logging and Visibility

Ensure that the CI/CD pipeline has sufficient logging and visibility to detect unauthorized access to the pipeline and artifacts.


### Mitigation  
Identify and build an inventory of all the systems in use within the organization, containing every instance of these systems.

### Rules

| Rule ID | Rule Name | Rule Description |
|---------|-----------|------------------|
| [github-repo-exists](rules/github/repository/evidence-exists.md) | [GitHub repository evidence](rules/github/repository/evidence-exists.md) | Identify and build an inventory of all the systems in use within the organization, containing every instance of these systems. |
| [workflows-discovered](rules/github/repository/workflows-discovered.md) | [Repo Workflows and Pipelines Discovered](rules/github/repository/workflows-discovered.md) | Repository workflows scan helps to keep track of the repo workflows, pipeline runs, run reasons, authors and other relevant information. |
