---
sidebar_label: SSDF Client Initiative
title: SSDF Client Initiative
---  
# SSDF Client Initiative  
**Type:** Initiative  
**ID:** `SSDF`  
**Version:** `1.0.0`  
**Bundle-Version:** `v2`  
**Source:** [v2/initiatives/ssdf.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/initiatives/ssdf.yaml)  
**Help:** https://csrc.nist.gov/pubs/sp/800/218/final  

Evaluate PS rules from the SSDF initiative

## Evidence Requirements

This initiative requires the following evidence types:

- [Signed SBOM](/docs/valint/sbom)
- [SLSA Provenance](/docs/valint/help/valint_slsa)
- [Github Organization Discovery Evidence](/docs/platforms/discover#github-discovery)
- [Github Repository Discovery Evidence](/docs/platforms/discover#github-discovery)

## Evidence Defaults

| Field | Value |
|-------|-------|
| signed | False |

## Controls Overview

| Control Name | Control Description | Mitigation |
|--------------|---------------------|------------|
| [[PS/PS.1/PS.1.1] Store all forms of code based on the principle of least privilege](#psps1ps11-store-all-forms-of-code-based-on-the-principle-of-least-privilege) | Store all forms of code – including source code, executable code, and configuration-as-code – based on the principle of least privilege so that only authorized personnel, tools, services, etc. have access. | Implement strict access controls, enforce multi-factor authentication (MFA), and regularly audit access logs to ensure only authorized personnel can access and modify the code. Use branch protection rules, require signed commits, and make repositories private to prevent unauthorized access and tampering. |
| [[PS/PS.2/PS.2.1] Make software integrity verification information available to software acquirers](#psps2ps21-make-software-integrity-verification-information-available-to-software-acquirers) | Help software acquirers ensure that the software they acquire is legitimate and has not been tampered with. | Use cryptographic signatures to sign software releases and provide a way for users to verify these signatures. Ensure that the signing keys are stored securely and that access to them is restricted. Implement automated processes to sign releases and verify their integrity before distribution. Regularly audit the signing process and keys to ensure their security and integrity. |
| [[PS/PS.3/PS.3.1] Securely archive the necessary files and supporting data to be retained for each software release](#psps3ps31-securely-archive-the-necessary-files-and-supporting-data-to-be-retained-for-each-software-release) | Securely archive the necessary files and supporting data (e.g., integrity verification information, provenance data) to be retained for each software release | Use secure, version-controlled repositories to store software releases and their supporting data. Implement access controls to restrict who can modify or delete these repositories. Use cryptographic signatures to sign software releases and provide a way for users to verify these signatures. Regularly back up the repositories to prevent data loss and ensure that software releases are preserved even in the event of a system failure. |
| [[PS/PS.3/PS.3.2] Collect, safeguard, maintain, and share provenance data for all components of each software release](#psps3ps32-collect-safeguard-maintain-and-share-provenance-data-for-all-components-of-each-software-release) | Collect, safeguard, maintain, and share provenance data for all components of each software release (e.g., in a software bill of materials [SBOM]) | Use software bill of materials (SBOM) to document the provenance of each software release and its components. Store SBOMs in a secure, version-controlled repository to ensure they can be retrieved and analyzed in the future. Implement access controls to restrict who can modify or delete SBOMs. Use cryptographic signatures to sign SBOMs and provide a way for users to verify these signatures. Regularly back up the repository to prevent data loss and ensure that SBOMs are preserved even in the event of a system failure. Document the SBOM creation process and train personnel on its importance and proper handling procedures. |

---

# Detailed Controls

## [PS/PS.1/PS.1.1] Store all forms of code based on the principle of least privilege

Store all forms of code – including source code, executable code, and configuration-as-code – based on the principle of least privilege so that only authorized personnel, tools, services, etc. have access.


### Mitigation  
Implement strict access controls, enforce multi-factor authentication (MFA), and regularly audit access logs to ensure only authorized personnel can access and modify the code. Use branch protection rules, require signed commits, and make repositories private to prevent unauthorized access and tampering.

### Rules

| Rule ID | Rule Name | Rule Description |
|---------|-----------|------------------|
| [2fa](rules/github/org/2fa.md) | [Enforce 2FA](rules/github/org/2fa.md) | PS.1 Require 2FA for accessing code |
| [max-admins](rules/github/org/max-admins.md) | [Limit admins](rules/github/org/max-admins.md) | PS.1 Restrict the maximum number of organization admins |
| [web-commit-signoff](rules/github/org/web-commit-signoff.md) | [Require signoff on web commits](rules/github/org/web-commit-signoff.md) | PS.1 Require contributors to sign when committing to Github through the web interface |
| [branch-protection](rules/github/repository/branch-protection.md) | [Branch protected](rules/github/repository/branch-protection.md) | PS.1 Require branch protection for the repository |
| [repo-is-private](rules/github/repository/repo-private.md) | [Repo private](rules/github/repository/repo-private.md) | PS.1 Assure the repository is private |

## [PS/PS.2/PS.2.1] Make software integrity verification information available to software acquirers

Help software acquirers ensure that the software they acquire is legitimate and has not been tampered with.


### Mitigation  
Use cryptographic signatures to sign software releases and provide a way for users to verify these signatures. Ensure that the signing keys are stored securely and that access to them is restricted. Implement automated processes to sign releases and verify their integrity before distribution. Regularly audit the signing process and keys to ensure their security and integrity.

### Rules

| Rule ID | Rule Name | Rule Description |
|---------|-----------|------------------|
| [sbom-is-signed](rules/sbom/artifact-signed.md) | [Image-verifiable](rules/sbom/artifact-signed.md) | PS.2 Provide a mechanism to verify the integrity of the image |

## [PS/PS.3/PS.3.1] Securely archive the necessary files and supporting data to be retained for each software release

Securely archive the necessary files and supporting data (e.g., integrity verification information, provenance data) to be retained for each software release


### Mitigation  
Use secure, version-controlled repositories to store software releases and their supporting data. Implement access controls to restrict who can modify or delete these repositories. Use cryptographic signatures to sign software releases and provide a way for users to verify these signatures. Regularly back up the repositories to prevent data loss and ensure that software releases are preserved even in the event of a system failure.

### Rules

| Rule ID | Rule Name | Rule Description |
|---------|-----------|------------------|
| [provenance-exists](rules/slsa/l1-provenance-exists.md) | [Provenance exists](rules/slsa/l1-provenance-exists.md) | PS.3 Provenance exists
Ensure that provenance information is available for each software release
 |

## [PS/PS.3/PS.3.2] Collect, safeguard, maintain, and share provenance data for all components of each software release

Collect, safeguard, maintain, and share provenance data for all components of each software release (e.g., in a software bill of materials [SBOM])


### Mitigation  
Use software bill of materials (SBOM) to document the provenance of each software release and its components. Store SBOMs in a secure, version-controlled repository to ensure they can be retrieved and analyzed in the future. Implement access controls to restrict who can modify or delete SBOMs. Use cryptographic signatures to sign SBOMs and provide a way for users to verify these signatures. Regularly back up the repository to prevent data loss and ensure that SBOMs are preserved even in the event of a system failure. Document the SBOM creation process and train personnel on its importance and proper handling procedures.

### Rules

| Rule ID | Rule Name | Rule Description |
|---------|-----------|------------------|
| [sbom-is-signed](rules/sbom/artifact-signed.md) | [SBOM archived](rules/sbom/artifact-signed.md) | PS.3 Archive SBOM |
