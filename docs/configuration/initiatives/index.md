# Documentation Index

## Initiatives

<!-- START TABLE -->
| Name | Description |
|------|-------------|
| [NIST Application Container Security Initiative](/docs/configuration/initiatives/sp-800-190.md) | This initiative enforces container security controls as outlined in  NIST SP 800-190. It ensures that containerized applications follow  security best practices, including vulnerability scanning, trusted  image sources, registry security, and proper configuration to minimize risk. The initiative enables policy-driven enforcement of security controls  throughout the software development lifecycle (SDLC), providing real-time  feedback to developers and enforcement in CI/CD pipelines. |
| [NIST Supply Chain Integrity Initiative](/docs/configuration/initiatives/sp-800-53.md) | This initiative enforces key supply chain requirements from NIST SP 800-53. It mandates that container builds include:   - A Software Bill of Materials (SBOM) to ensure component inventory and traceability,     addressing requirements from SR-4 and CM-8.   - Provenance data to support architectural traceability, as outlined in SA-8. Both the SBOM and the provenance artifacts must be cryptographically signed to meet integrity requirements specified in SA-12. |
| [OWASP Top 10 CI/CD Security Controls -- GitHub](/docs/configuration/initiatives/owasp-top10-cicd-gh.md) | This initiative implements a policy to verify compliance with the OWASP Top 10 Security Controls. |
| [SLSA L1 Framework](/docs/configuration/initiatives/slsa.l1.md) | Evaluate SLSA Level 1 |
| [SLSA L2 Framework](/docs/configuration/initiatives/slsa.l2.md) | Evaluate SLSA Level 2 |
| [SSDF Client Initiative](/docs/configuration/initiatives/ssdf.md) | Evaluate PS rules from the SSDF initiative |
| [Secure Software Pipeline Blueprint](/docs/configuration/initiatives/sspb-gl.md) | Blueprint for secure pipelines - Gitlab |
| [Secure Software Pipeline Blueprint](/docs/configuration/initiatives/sspb-gh.md) | Blueprint for secure pipelines - GitHub |

## Rules

### SBOM
**Evidence Type:** [SBOM](/docs/valint/sbom)

| Rule Name | Description |
|-----------|-------------|
| [Apply Scribe Template Policy](/docs/configuration/initiatives/rules/api/scribe-api.md) | Verify XX using the Scribe API template rule. |
| [Scribe Published Policy](/docs/configuration/initiatives/rules/api/scribe-api-published.md) | Verify image Scribe Publish flag is set for container image. |
| [Verify No Critical or High Vulnerabilities](/docs/configuration/initiatives/rules/api/scribe-api-cve.md) | Verify via Scribe API that there are no critical or high severity vulnerabilities in the target artifact (container image, folder, etc.). |
| [NTIA SBOM Compliance Check](/docs/configuration/initiatives/rules/sbom/NTIA-compliance.md) | Validates that SBOM metadata meets basic NTIA requirements for authors and supplier. |
| [Enforce SBOM Freshness](/docs/configuration/initiatives/rules/sbom/fresh-sbom.md) | Verify the SBOM is not older than the specified duration. |
| [Require SBOM Existence](/docs/configuration/initiatives/rules/sbom/evidence-exists.md) | Verify the SBOM exists as evidence. |
| [Require SBOM Signature](/docs/configuration/initiatives/rules/sbom/artifact-signed.md) | Verify the SBOM is signed. |
| [Require SBOM Existence](/docs/configuration/initiatives/rules/sbom/require-sbom.md) | Verify the SBOM exists as evidence. |

### Image SBOM
**Evidence Type:** [Image SBOM](/docs/valint/sbom)

| Rule Name | Description |
|-----------|-------------|
| [Verify Image Labels](/docs/configuration/initiatives/rules/images/verify-labels.md) | Verify specified labels key-value pairs exist in the image. |
| [Forbid Large Images](/docs/configuration/initiatives/rules/images/forbid-large-images.md) | Verify the image size is below the specified threshold. |
| [Disallow Container Shell Entrypoint](/docs/configuration/initiatives/rules/images/restrict-shell-entrypoint.md) | Verify the container image disallows shell entrypoint. |
| [Fresh Base Image](/docs/configuration/initiatives/rules/images/fresh-base-image.md) | Verifies that each base image is not older than the specified threshold (max_days) from its creation date. |
| [Banned Ports](/docs/configuration/initiatives/rules/images/banned-ports.md) | Ensures that the container image does not expose ports that are disallowed by organizational policy. The rule examines properties in the SBOM metadata and checks each value (expected in the format "port/protocol") against a provided banned ports list. It fails if any banned port is exposed or if no banned ports list is provided. |
| [Disallow Specific Users in SBOM](/docs/configuration/initiatives/rules/images/banned-users.md) | Verify specific users are not allowed in an SBOM. |
| [Restrict Build Scripts](/docs/configuration/initiatives/rules/images/blocklist-build-scripts.md) | Verify no build scripts commands appear in block list. |
| [Registry Connection HTTPS](/docs/configuration/initiatives/rules/images/enforce-https-registry.md) | Checks if the container's registry scheme is HTTPS |
| [Verify NPM Packages Origin](/docs/configuration/initiatives/rules/images/allowed-npm-registries.md) | Verify that the artifact contains only components from allowed NPM registries. |
| [Require Image Labels](/docs/configuration/initiatives/rules/images/verify-labels-exist.md) | Verify the image has the specified labels. |
| [Require Healthcheck](/docs/configuration/initiatives/rules/images/require-healthcheck.md) | Checks that the container image includes at least one healthcheck property. |
| [Allowed Base Image](/docs/configuration/initiatives/rules/images/allowed-base-image.md) | Verifies that every base image is from an approved source. The rule returns a summary including the component names and versions of valid base images, or lists the invalid ones. This rule requires Dockerfile context; for example, run it with: `valint my_image --base-image Dockerfile`. |
| [Fresh Image](/docs/configuration/initiatives/rules/images/fresh-image.md) | Verify the image is not older than the specified threshold. |
| [Allowed Main Image Source](/docs/configuration/initiatives/rules/images/allowed-image-source.md) | Ensures the main container image referenced in the SBOM is from an approved source. |
| [Require Signed Container Image](/docs/configuration/initiatives/rules/images/image-signed.md) | Enforces that container images (target_type=container) are cryptographically signed. |
| [Disallow Specific Users in SBOM](/docs/configuration/initiatives/rules/sbom/banned-users.md) | Verify specific users are not allowed in an SBOM. |
| [Enforce SBOM Dependencies](/docs/configuration/initiatives/rules/sbom/required-packages.md) | Verify the artifact includes all required dependencies. |
| [Enforce SBOM License Completeness](/docs/configuration/initiatives/rules/sbom/complete-licenses.md) | Verify all dependencies in the artifact have a license. |
| [Restrict Disallowed SBOM Licenses](/docs/configuration/initiatives/rules/sbom/banned-licenses.md) | Verify the number of disallowed licenses in SBOM dependencies remains below the specified threshold. |
| [Enforce Allowed SBOM Components](/docs/configuration/initiatives/rules/sbom/allowed-components.md) | Verify the artifact contains only allowed components. |
| [Require Specified SBOM Licenses](/docs/configuration/initiatives/rules/sbom/verify-huggingface-license.md) | Verify the artifact includes all specified licenses. |
| [Restrict Disallowed Dependencies](/docs/configuration/initiatives/rules/sbom/blocklist-packages.md) | Verify the number of disallowed dependencies remains below the specified threshold. |

### Git SBOM
**Evidence Type:** [Git SBOM](/docs/valint/sbom)

| Rule Name | Description |
|-----------|-------------|
| [Restrict Coding Permissions](/docs/configuration/initiatives/rules/git/coding-permissions.md) | Verify only allowed users committed to the repository. |
| [Required Git Evidence Exists](/docs/configuration/initiatives/rules/git/evidence-exists.md) | Verify required Git evidence exists. |
| [Git Artifact Signed](/docs/configuration/initiatives/rules/git/artifact-signed.md) | Verify the Git artifact is signed. |
| [Disallow Commits to Main Branch](/docs/configuration/initiatives/rules/git/no-commit-to-main.md) | Verify commits made directly to the main branch are disallowed. |
| [Disallow Unsigned Commits](/docs/configuration/initiatives/rules/git/no-unsigned-commits.md) | Verify all commits are signed. |

### SLSA Provenance
**Evidence Type:** [SLSA Provenance](/docs/valint/help/valint_slsa)

| Rule Name | Description |
|-----------|-------------|
| [SLSA External Parameters Match in Provenance Document](/docs/configuration/initiatives/rules/slsa/verify-external-parameters.md) | Verify the specified external parameters value match in the provenance document. |
| [Verify that provenance is authenticated](/docs/configuration/initiatives/rules/slsa/l2-provenance-authenticated.md) | Verify the artifact is signed. |
| [SLSA Field Exists in Provenance Document](/docs/configuration/initiatives/rules/slsa/field-exists.md) | Verify the specified field exists in the provenance document. |
| [Verify Provenance Document Exists](/docs/configuration/initiatives/rules/slsa/l1-provenance-exists.md) | Verify that the Provenance document evidence exists. |
| [Disallow dependencies in SLSA Provenance Document](/docs/configuration/initiatives/rules/slsa/banned-builder-deps.md) | Verify that dependencies in the block list do not appear in the SLSA Proveance document. |
| [Verify build time](/docs/configuration/initiatives/rules/slsa/build-time.md) | Verify the artifact was created within the specified time window. |
| [Verify that artifact was created by the specified builder](/docs/configuration/initiatives/rules/slsa/verify-builder.md) | Verify the artifact was created by the specified builder. |
| [Verify that artifact has no disallowed builder dependencies](/docs/configuration/initiatives/rules/slsa/verify-byproducts.md) | Verify the artifact has no disallowed builder dependencies. |
| [SLSA Field Value Matches in Provenance Document](/docs/configuration/initiatives/rules/slsa/verify-custom-fields.md) | Verify the specified field value matches in the provenance document. |

### SARIF Evidence
**Evidence Type:** [SARIF Evidence](/docs/valint/sarif)

| Rule Name | Description |
|-----------|-------------|
| [Verify Attack Vector Exists in SARIF](/docs/configuration/initiatives/rules/sarif/verify-attack-vector.md) | Verify required evidence validates attack vectors in the SARIF report. |
| [Verify IaC Misconfiguration Threshold in SARIF](/docs/configuration/initiatives/rules/sarif/report-iac-errors.md) | Verify the number of infrastructure-as-code (IaC) errors in the SARIF report remains below the specified threshold. |
| [Verify Required Evidence in SARIF](/docs/configuration/initiatives/rules/sarif/evidence-exists.md) | Verify all required evidence exists as defined by the SARIF policy. |
| [Verify Artifact Signature in SARIF](/docs/configuration/initiatives/rules/sarif/artifact-signed.md) | Verify the artifact referenced in the SARIF report is signed to confirm its integrity. |
| [Verify Rule Compliance in SARIF](/docs/configuration/initiatives/rules/sarif/verify-sarif.md) | Verify the SARIF report complies with defined generic rules for compliance and security. vulnerability profiles. |
| [Verify Tool Evidence in SARIF](/docs/configuration/initiatives/rules/sarif/verify-tool-evidence.md) | Verify required tools were used to generate the SARIF report. |
| [Verify Semgrep Rule in SARIF](/docs/configuration/initiatives/rules/sarif/verify-semgrep-report.md) | Verify the Semgrep SARIF report complies with predefined rules to ensure compliance and detect issues. |
| [Verify Trivy SARIF Report Compliance](/docs/configuration/initiatives/rules/sarif/trivy/verify-trivy-report.md) | Verify the Trivy SARIF report complies with predefined rules to ensure compliance and detect issues. |
| [Verify IaC Misconfiguration Threshold in Trivy SARIF](/docs/configuration/initiatives/rules/sarif/trivy/report-trivy-iac-errors.md) | Verify the number of infrastructure-as-code (IaC) errors in the Trivy SARIF report remains below the specified threshold. |
| [Trivy Blocklist CVE Check](/docs/configuration/initiatives/rules/sarif/trivy/blocklist-cve.md) | Verify a CVE Blocklist against a SARIF report |
| [Trivy Vulnerability Findings Check](/docs/configuration/initiatives/rules/sarif/trivy/verify-cve-severity.md) | Verifies that vulnerability findings in the SARIF evidence from Trivy do not exceed the defined severity threshold.  |
| [Verify Attack Vector Threshold in Trivy SARIF](/docs/configuration/initiatives/rules/sarif/trivy/verify-trivy-attack-vector.md) | Verify no attack vector in the Trivy SARIF report exceeds the specified threshold. |
| [SARIF Update Needed](/docs/configuration/initiatives/rules/sarif/patcheck/updates-needed.md) | Verify no security packages require updates. |
| [K8s Jailbreak](/docs/configuration/initiatives/rules/generic/k8s-jailbreak.md) | Verify no misconfigurations from the prohibited ids list in the Kuberentes scan is below specified threshold |

### Generic Statement
**Evidence Type:** [Generic Statement](/docs/valint/generic)

| Rule Name | Description |
|-----------|-------------|
| [3rd Party Scanner Violations](/docs/configuration/initiatives/rules/generic/3rd-pty.md) | Limit allowed violations in 3rd party scanner reports |
| [Required Trivy Evidence Exists](/docs/configuration/initiatives/rules/generic/trivy-exists.md) | Verify required Trivy evidence exists |
| [Required Generic Evidence Exists](/docs/configuration/initiatives/rules/generic/evidence-exists.md) | Verify required evidence exists. |
| [Generic Artifact Signed](/docs/configuration/initiatives/rules/generic/artifact-signed.md) | Verify required evidence is signed. |

### Github Organization Discovery Evidence
**Evidence Type:** [Github Organization Discovery Evidence](/docs/platforms/discover#github-discovery)

| Rule Name | Description |
|-----------|-------------|
| [Verify members_can_create_repositories setting](/docs/configuration/initiatives/rules/github/org/create-repos.md) | Verify only allowed users can create repositories in the GitHub organization. |
| [Verify `secret_scanning_push_protection` Setting](/docs/configuration/initiatives/rules/github/org/push-protection-sa.md) | Verify secret scanning push protection is configured in the GitHub repository. |
| [Verify `secret_scanning_validity_checks_enabled` Setting](/docs/configuration/initiatives/rules/github/org/validity-checks.md) | Verify validity checks for secrets are configured for the GitHub repository. |
| [Verify dependabot_security_updates_enabled_for_new_repositories setting](/docs/configuration/initiatives/rules/github/org/dependabot-security-updates.md) | Verify Dependabot security updates for new repositories are configured in the GitHub organization. |
| [Verify `secret_scanning` Setting in `security_and_analysis`](/docs/configuration/initiatives/rules/github/org/secret-scanning-sa.md) | Verify secret scanning is configured in the GitHub repository. |
| [Limit Admin Number in GitHub Organization](/docs/configuration/initiatives/rules/github/org/max-admins.md) | Verify the maximum number of GitHub organization admins is restricted. |
| [Verify `advanced_security_enabled_for_new_repositories` setting](/docs/configuration/initiatives/rules/github/org/advanced-security.md) | Verify Advanced Security is enabled for new repositories in the GitHub organization. |
| [Require GitHub Organization Discovery Evidence](/docs/configuration/initiatives/rules/github/org/evidence-exists.md) | Verify the GitHub Organization exists as evidence. |
| [Verify dependency_graph_enabled_for_new_repositories setting](/docs/configuration/initiatives/rules/github/org/dependency-graph.md) | Verify dependency graph is enabled for new repositories in the GitHub organization. |
| [Verify GitHub Organization Requires Signoff on Web Commits](/docs/configuration/initiatives/rules/github/org/web-commit-signoff.md) | Verify contributors sign commits through the GitHub web interface. |
| [Verify Two-Factor Authentication (2FA) Requirement Enabled](/docs/configuration/initiatives/rules/github/org/2fa.md) | Verify Two-factor Authentication is required in the GitHub organization. |
| [Verify GitHub Organization Secrets Are Not Too Old](/docs/configuration/initiatives/rules/github/org/old-secrets.md) | Verify secrets in the GitHub organization are not older than the specified threshold. |
| [Allowed GitHub Organization Admins](/docs/configuration/initiatives/rules/github/org/allow-admins.md) | Verify only users in the Allowed List have admin privileges in the GitHub organization. |
| [Verify secret_scanning_enabled_for_new_repositories setting](/docs/configuration/initiatives/rules/github/org/secret-scanning.md) | Verify secret scanning is configured for new repositories in the GitHub organization. |
| [Allowed GitHub Organization Users](/docs/configuration/initiatives/rules/github/org/allow-users.md) | Verify only users in the Allowed List have user access to the GitHub organization. |
| [Verify `secret_scanning_push_protection_custom_link_enabled` Setting](/docs/configuration/initiatives/rules/github/org/pp-custom-link.md) | Verify secret scanning push protection custom link is enabled in the GitHub organization. |
| [Verify dependabot_security_updates setting in security_and_analysis](/docs/configuration/initiatives/rules/github/org/dependabot-security-updates-sa.md) | Verify Dependabot security updates are configured in the GitHub organization. |
| [Verify that members can create private repositories setting is configured](/docs/configuration/initiatives/rules/github/org/create-private-repos.md) | Verify only allowed users can create private repositories in the GitHub organization. |
| [Verify Repo Visibility Setting](/docs/configuration/initiatives/rules/github/org/repo-visibility.md) | Verify only repositories in the Allowed List are public in the GitHub organization. |
| [Verify `secret_scanning_validity_checks` Setting in `security_and_analysis`](/docs/configuration/initiatives/rules/github/org/validity-checks-sa.md) | Verify validity checks for secrets are configured for the GitHub organization. |
| [Verify `secret_scanning_push_protection_enabled_for_new_repositories` Setting](/docs/configuration/initiatives/rules/github/org/push-protection.md) | Verify secret scanning push protection is enabled for new repositories in the GitHub organization. |
| [Verify dependabot_alerts_enabled_for_new_repositories setting](/docs/configuration/initiatives/rules/github/org/dependabot-alerts.md) | Verify Dependabot alerts for new repositories are enabled in the GitHub organization. |

### Github Repository Discovery Evidence
**Evidence Type:** [Github Repository Discovery Evidence](/docs/platforms/discover#github-discovery)

| Rule Name | Description |
|-----------|-------------|
| [Pull request approval policy check for GitHub repository](/docs/configuration/initiatives/rules/github/repository/approvals-policy-check.md) | Verify the repository's pull request approval policy |
| [Verify secret scanning.](/docs/configuration/initiatives/rules/github/repository/validity-checks.md) | Verify both `secret_scanning_validity_checks` and `security_and_analysis` are set in GitHub organization and all the repositories. |
| [Verify Dependabot security updates setting](/docs/configuration/initiatives/rules/github/repository/dependabot.md) | Verify Dependabot security updates are configured in the GitHub repository. |
| [Verify Repository Is Private](/docs/configuration/initiatives/rules/github/repository/repo-private.md) | Verify the GitHub repository is private. |
| [Require GitHub Repository Discovery Evidence](/docs/configuration/initiatives/rules/github/repository/evidence-exists.md) | Verify the GitHub Repository exists as evidence. |
| [Verify Repository Requires Commit Signoff](/docs/configuration/initiatives/rules/github/repository/web-commit-signoff.md) | Verify contributors sign off on commits to the GitHub repository through the GitHub web interface. |
| [Verify Default Branch Protection](/docs/configuration/initiatives/rules/github/repository/default-branch-protection.md) | Verify the default branch protection is configured in the GitHub repository. |
| [Verify No Old Secrets Exist in Repository](/docs/configuration/initiatives/rules/github/repository/old-secrets.md) | Verify secrets in the GitHub repository are not older than the specified threshold. |
| [Verify No Organization Secrets Exist in Repository](/docs/configuration/initiatives/rules/github/repository/no-org-secrets.md) | Verify no organization secrets exist in the GitHub repository. |
| [Verify Branch Verification Setting](/docs/configuration/initiatives/rules/github/repository/branch-verification.md) | Verify branch verification in the GitHub repository matches the value defined in the configuration file. |
| [Verify Branch Protection Setting](/docs/configuration/initiatives/rules/github/repository/branch-protection.md) | Verify branch protection is configured in the GitHub repository. |
| [Verify All Commits Are Signed in Repository](/docs/configuration/initiatives/rules/github/repository/signed-commits.md) | Verify all commits are signed in a repository attestation. |
| [Verify secret_scanning setting](/docs/configuration/initiatives/rules/github/repository/secret-scanning.md) | Verify `secret_scanning` is configured in the GitHub repository. |
| [Verify No Cache Usage Exists in Repository](/docs/configuration/initiatives/rules/github/repository/no-cache-usage.md) | Verify the GitHub repository has no cache usage. |
| [Verify All Commits Are Signed in Repository](/docs/configuration/initiatives/rules/github/repository/check-signed-commits.md) | Verify all commits in the GitHub repository are signed. |
| [Repo Workflows and Pipelines Discovered](/docs/configuration/initiatives/rules/github/repository/workflows-discovered.md) | Ensure that repository pipelines discovery was not skipped. |
| [Verify Only Ephemeral Runners Exist in Repository](/docs/configuration/initiatives/rules/github/repository/ephemeral-runners-only.md) | Verify self-hosted runners are disallowed in the GitHub repository. |
| [Allowed Public Repositories](/docs/configuration/initiatives/rules/github/repository/visibility.md) | Verify only GitHub repositories in the Allowed List are public. |
| [Verify Push Protection Setting](/docs/configuration/initiatives/rules/github/repository/push-protection.md) | Verify `secret_scanning_push_protection` is configured in the GitHub repository. |

### Gitlab Organization Discovery Evidence
**Evidence Type:** [Gitlab Organization Discovery Evidence](/docs/platforms/discover#gitlab-discovery)

| Rule Name | Description |
|-----------|-------------|
| [Limit Admins in GitLab Organization](/docs/configuration/initiatives/rules/gitlab/org/max-admins.md) | Verify the maximum number of admins for the GitLab project is restricted. |
| [Require Gitlab Organization Discovery Evidence](/docs/configuration/initiatives/rules/gitlab/org/evidence-exists.md) | Verify the Gitlab Organization exists as evidence. |
| [Ensure Active Projects in GitLab Organization](/docs/configuration/initiatives/rules/gitlab/org/inactive-projects.md) | Verify no GitLab organization projects are inactive. |
| [Restrict Public Visibility in GitLab Organization](/docs/configuration/initiatives/rules/gitlab/org/projects-visibility.md) | Verify only allowed projects in the GitLab organization have public visibility. |
| [Allowed Admins in GitLab Organization](/docs/configuration/initiatives/rules/gitlab/org/allow-admins.md) | Verify only users in the Allowed List have admin privileges in the GitLab organization. |
| [Forbid Long-Lived Tokens in GitLab Organization](/docs/configuration/initiatives/rules/gitlab/org/longlive-tokens.md) | Verify no GitLab organization tokens have an excessively long lifespan. |
| [Forbid Unused Tokens in GitLab Organization](/docs/configuration/initiatives/rules/gitlab/org/unused-tokens.md) | Verify there are no unused GitLab organization tokens. |
| [Allowed Users in GitLab Organization](/docs/configuration/initiatives/rules/gitlab/org/allow-users.md) | Verify only users in the Allowed List have access to the GitLab organization. |
| [Restrict Token Scopes in GitLab](/docs/configuration/initiatives/rules/gitlab/org/allow-token-scopes.md) | Verify all tokens in the GitLab organization are restricted to allowed scopes to prevent excessive permission. |
| [Block Users in GitLab Organization](/docs/configuration/initiatives/rules/gitlab/org/blocked-users.md) | Verify no users in the GitLab organization are on the block list. |
| [Prevent Token Expiration in GitLab Organization](/docs/configuration/initiatives/rules/gitlab/org/expiring-tokens.md) | Verify no GitLab organization tokens are about to expire. |
| [Forbid Token Scopes in GitLab Organization](/docs/configuration/initiatives/rules/gitlab/org/forbid-token-scopes.md) | Verify no GitLab organization tokens have disallowed scopes. |

### Gitlab Project Discovery Evidence
**Evidence Type:** [Gitlab Project Discovery Evidence](/docs/platforms/discover#gitlab-discovery)

| Rule Name | Description |
|-----------|-------------|
| [Merge approval policy check for GitLab project](/docs/configuration/initiatives/rules/gitlab/project/approvals-policy-check.md) | Verify the project's merge approval policy complies with requirements. |
| [Set Push Rules for GitLab Project](/docs/configuration/initiatives/rules/gitlab/project/push-rules-set.md) | Verify push rules are set for the GitLab project. |
| [Disable Committers' Approval for Merge Requests in GitLab](/docs/configuration/initiatives/rules/gitlab/project/merge-requests-disable-committers-approval.md) | Verify `merge_requests_disable_committers_approval` is set for the GitLab project. |
| [Restrict Commit Authors in GitLab Project](/docs/configuration/initiatives/rules/gitlab/project/commit-author-email-check.md) | Verify only GitLab project users in the Allowed List have commit author permissions. |
| [Require Minimal Approvers in GitLab Project](/docs/configuration/initiatives/rules/gitlab/project/required-minimal-approvers.md) | Verify the required number of approvers for the GitLab project is met. |
| [Enforce Medium Severity Limit](/docs/configuration/initiatives/rules/gitlab/project/medium-severity-limit.md) | Verify the maximum allowed medium severity alerts for the GitLab project. |
| [Enforce Merge Access Level Policy for GitLab Project](/docs/configuration/initiatives/rules/gitlab/project/merge-access-level.md) | Verify the GitLab project's merge access level complies with requirements. |
| [Set Author Email Regex in GitLab Project](/docs/configuration/initiatives/rules/gitlab/project/author-email-regex.md) | Verify the `author_email_regex` for the GitLab project is set to the specified value. |
| [Check CWE Compliance](/docs/configuration/initiatives/rules/gitlab/project/check-cwe.md) | Verify that specified CWEs were not detected in the GitLab project. |
| [Enforce Critical Severity Limit](/docs/configuration/initiatives/rules/gitlab/project/critical-severity-limit.md) | Verify the maximum allowed critical severity alerts for the GitLab project. |
| [Verify Commit Message Format](/docs/configuration/initiatives/rules/gitlab/project/commit-message-check.md) | Verify that commit messages in the GitLab project adhere to the specified format template. |
| [Enable Member Check for GitLab Project](/docs/configuration/initiatives/rules/gitlab/project/member-check.md) | Verify `member_check` is enabled for the GitLab project. |
| [Restrict Selective Code Owner Removals in GitLab](/docs/configuration/initiatives/rules/gitlab/project/selective-code-owner-removals.md) | Verify `selective_code_owner_removals` is set for the GitLab project. |
| [Run Secrets Scanning in GitLab Project](/docs/configuration/initiatives/rules/gitlab/project/secrets-scanning.md) | Verify secrets scanning is performed for the GitLab project. |
| [Reset Approvals on Push in GitLab Project](/docs/configuration/initiatives/rules/gitlab/project/reset-pprovals-on-push.md) | Verify `reset_approvals_on_push` is set for the GitLab project. |
| [Require Gitlab Project Discovery Evidence](/docs/configuration/initiatives/rules/gitlab/project/evidence-exists.md) | Verify the Gitlab Project exists as evidence. |
| [Reject Unsigned Commits in GitLab Project](/docs/configuration/initiatives/rules/gitlab/project/reject-unsigned-commits.md) | Verify `reject_unsigned_commits` is enabled for the GitLab project. |
| [Enable Commit Committer Check in GitLab Project](/docs/configuration/initiatives/rules/gitlab/project/commit-committer-check.md) | Verify `commit_committer_check` is enabled for the GitLab project. |
| [Protect CI Secrets in GitLab Project](/docs/configuration/initiatives/rules/gitlab/project/protect-ci-secrets.md) | Verify secrets in the GitLab project are not shared. |
| [Validate All Commits in GitLab Project](/docs/configuration/initiatives/rules/gitlab/project/commits-validated.md) | Verify all commits in the GitLab project are validated. |
| [Disallow Banned Approvers](/docs/configuration/initiatives/rules/gitlab/project/disallowed-banned-approvers.md) | Verify approvers in the GitLab project are not on the banned list. |
| [Allowed Committer Emails in GitLab Project](/docs/configuration/initiatives/rules/gitlab/project/committer-email-check.md) | Verify only users in the Allowed List use committer email addresses in the GitLab project. |
| [Set Push Access Level in GitLab Project](/docs/configuration/initiatives/rules/gitlab/project/push-access-level.md) | Verify the GitLab project's push access level policy complies with requirements. |
| [Disallow Force Push in GitLab Project](/docs/configuration/initiatives/rules/gitlab/project/force-push-protection.md) | Verify force pushes in the GitLab project are disallowed to maintain repository integrity. |
| [Set Visibility Level in GitLab Project](/docs/configuration/initiatives/rules/gitlab/project/visibility-check.md) | Verify the GitLab project's visibility matches the required level. |
| [Restrict Approvers Per Merge Request](/docs/configuration/initiatives/rules/gitlab/project/approvers-per-merge-request.md) | Verify the binary field `disable_overriding_approvers_per_merge_request` is set for the GitLab project. |
| [Allowed Commit Authors in GitLab Project](/docs/configuration/initiatives/rules/gitlab/project/commit-author-name-check.md) | Verify only users in the Allowed List author commits in the GitLab project. |
| [Disable Author Approval for Merge Requests in GitLab](/docs/configuration/initiatives/rules/gitlab/project/merge-requests-author-approval.md) | Verify the binary field `merge_requests_author_approval` is set for the GitLab project. |
| [Enable Secrets Prevention in GitLab Project](/docs/configuration/initiatives/rules/gitlab/project/prevent-secrets-check.md) | Verify `prevent_secrets` is enabled for the GitLab project. |
| [Ensure All Commits Are Signed in GitLab Project](/docs/configuration/initiatives/rules/gitlab/project/check-signed-commits.md) | Verify all commits in the GitLab project are signed. |
| [Check Description Substring](/docs/configuration/initiatives/rules/gitlab/project/description-substring-check.md) | Verify a specific substring is not found in the description attribute of vulnerabilities for the GitLab project. |
| [Verify Project Activity](/docs/configuration/initiatives/rules/gitlab/project/abandoned-project.md) | Verify the GitLab project is active for a specified duration. |
| [Allowed Committer Names in GitLab Project](/docs/configuration/initiatives/rules/gitlab/project/committer-name-check.md) | Verify only users in the Allowed List commit by name in the GitLab project. |
| [Check Message Substring](/docs/configuration/initiatives/rules/gitlab/project/message-substring-check.md) | Verify a specific substring is not found in the message attribute of vulnerabilities for the GitLab project. |
| [Run SAST Scanning in GitLab Project](/docs/configuration/initiatives/rules/gitlab/project/sast-scanning.md) | Verify SAST scanning is performed for the GitLab project. |
| [Require Code Owner Approval in GitLab Project](/docs/configuration/initiatives/rules/gitlab/project/co-approval-required.md) | Verify code owner approval is required for specific branches in the GitLab project. |
| [Ensure SAST Scanning Passes](/docs/configuration/initiatives/rules/gitlab/project/sast-scan-pass.md) | Verify SAST scanning is successful for the GitLab project. |
| [Ensure Secrets Scanning Passes](/docs/configuration/initiatives/rules/gitlab/project/secrets-scan-pass.md) | Verify secrets scanning is successful for the GitLab project. |
| [Require Password for Approvals in GitLab Project](/docs/configuration/initiatives/rules/gitlab/project/require-password-to-approve.md) | Verify the binary field `require_password_to_approve` is set for the GitLab project. |

### K8s Namespace Discovery Evidence
**Evidence Type:** [K8s Namespace Discovery Evidence](/docs/platforms/discover#k8s-discovery)

| Rule Name | Description |
|-----------|-------------|
| [Allowed Container Images](/docs/configuration/initiatives/rules/k8s/namespace/allowed-images.md) | Verify only container images specified in the Allowed List run within the Kubernetes namespace. |
| [Verify Namespace Termination](/docs/configuration/initiatives/rules/k8s/namespace/verify-namespace-termination.md) | Verify Kubernetes namespaces are properly terminated to prevent lingering resources and maintain cluster hygiene. |
| [Require K8s Namespace Discovery Evidence](/docs/configuration/initiatives/rules/k8s/namespace/evidence-exists.md) | Verify the K8s Namespace exists as evidence. |
| [Allowed Namespaces](/docs/configuration/initiatives/rules/k8s/namespace/white-listed-namespaces.md) | Verify only namespaces specified in the Allowed List are allowed within the cluster. |
| [Verify Namespace Runtime Duration](/docs/configuration/initiatives/rules/k8s/namespace/verify-namespace-duration.md) | Verify Kubernetes namespaces adhere to a specified runtime duration to enforce lifecycle limits. |
| [Allowed Namespace Registries](/docs/configuration/initiatives/rules/k8s/namespace/allowed-registries.md) | Verify container images in Kubernetes namespaces originate from registries in the Allowed List. |
| [Allowed Pods in Namespace](/docs/configuration/initiatives/rules/k8s/namespace/white-listed-pod.md) | Verify only pods explicitly listed in the Allowed List run within a Kubernetes namespace. |

### K8s Pod Discovery Evidence
**Evidence Type:** [K8s Pod Discovery Evidence](/docs/platforms/discover#k8s-discovery)

| Rule Name | Description |
|-----------|-------------|
| [Verify Pod Runtime Duration](/docs/configuration/initiatives/rules/k8s/pods/verify-pod-duration.md) | Verify Kubernetes pods adhere to a specified runtime duration to enforce lifecycle limits. |
| [Require K8s Pod Discovery Evidence](/docs/configuration/initiatives/rules/k8s/pods/evidence-exists.md) | Verify the K8s Pod exists as evidence. |
| [Verify Pod Termination](/docs/configuration/initiatives/rules/k8s/pods/verify-pod-termination.md) | Verify Kubernetes pods are properly terminated to prevent lingering resources and maintain cluster hygiene. |
| [Allowed Pods](/docs/configuration/initiatives/rules/k8s/pods/white-listed-pod.md) | Verify only pods explicitly listed in the Allowed List are allowed to run. |

### Bitbucket Project Discovery Evidence
**Evidence Type:** [Bitbucket Project Discovery Evidence](/docs/platforms/discover#bitbucket-discovery)

| Rule Name | Description |
|-----------|-------------|
| [Prevent Long-Lived Tokens](/docs/configuration/initiatives/rules/bitbucket/project/long-live-tokens.md) | Verify Bitbucket API tokens expire before the maximum time to live. |
| [Require Bitbucket Project Discovery Evidence](/docs/configuration/initiatives/rules/bitbucket/project/evidence-exists.md) | Verify the Bitbucket Project exists as evidence. |
| [Allowed Project Admins](/docs/configuration/initiatives/rules/bitbucket/project/allow-admins.md) | Verify only users specified in the Allowed List have admin privileges in the Bitbucket project. |
| [Allowed Project Users](/docs/configuration/initiatives/rules/bitbucket/project/allow-users.md) | Verify only users specified in the Allowed List have user access to the Bitbucket project. |
| [Prevent Credential Exposure](/docs/configuration/initiatives/rules/bitbucket/project/exposed-credentials.md) | Verify access to the Bitbucket project is blocked if exposed credentials are detected. |

### Bitbucket Repository Discovery Evidence
**Evidence Type:** [Bitbucket Repository Discovery Evidence](/docs/platforms/discover#bitbucket-discovery)

| Rule Name | Description |
|-----------|-------------|
| [Require Bitbucket Repository Discovery Evidence](/docs/configuration/initiatives/rules/bitbucket/repository/evidence-exists.md) | Verify the Bitbucket Repository exists as evidence. |
| [Allowed Repository Admins](/docs/configuration/initiatives/rules/bitbucket/repository/allow-admins.md) | Verify only users specified in the Allowed List have admin privileges in the Bitbucket repository. |
| [Verify Default Branch Protection Setting Is Configured](/docs/configuration/initiatives/rules/bitbucket/repository/branch-protection.md) | Verify the default branch protection is enabled in the Bitbucket repository. |
| [Allowed Repository Users](/docs/configuration/initiatives/rules/bitbucket/repository/allow-users.md) | Verify only users specified in the Allowed List have user access to the Bitbucket repository. |

### Bitbucket Workspace Discovery Evidence
**Evidence Type:** [Bitbucket Workspace Discovery Evidence](/docs/platforms/discover#bitbucket-discovery)

| Rule Name | Description |
|-----------|-------------|
| [Require Bitbucket Workspace Discovery Evidence](/docs/configuration/initiatives/rules/bitbucket/workspace/evidence-exists.md) | Verify the Bitbucket Workspace exists as evidence. |
| [Allowed Workspace Admins](/docs/configuration/initiatives/rules/bitbucket/workspace/allow-admins.md) | Verify only users specified in the Allowed List have admin privileges in the Bitbucket workspace. |
| [Allowed Workspace Users](/docs/configuration/initiatives/rules/bitbucket/workspace/allow-users.md) | Verify only users specified in the Allowed List have user access to the Bitbucket workspace. |

### Dockerhub Project Discovery Evidence
**Evidence Type:** [Dockerhub Project Discovery Evidence](/docs/platforms/discover#dockerhub-discovery)

| Rule Name | Description |
|-----------|-------------|
| [Verify DockerHub Tokens are Active](/docs/configuration/initiatives/rules/dockerhub/token-expiration.md) | Verify that all discovered Dockerhub tokens are set to Active in Dockerhub. |
| [Verify no unused Dockerhub](/docs/configuration/initiatives/rules/dockerhub/token-not-used.md) | Verify that there are no unused Dockerhub. |

### Jenkins Folder Discovery Evidence
**Evidence Type:** [Jenkins Folder Discovery Evidence](/docs/platforms/discover#jenkins-discovery)

| Rule Name | Description |
|-----------|-------------|
| [Require Jenkins Folder Discovery Evidence](/docs/configuration/initiatives/rules/jenkins/folder/evidence-exists.md) | Verify the Jenkins Folder exists as evidence. |
| [Verify Exposed Credentials](/docs/configuration/initiatives/rules/jenkins/folder/exposed-credentials.md) | Verify there are no exposed credentials. |

### Jenkins Instance Discovery Evidence
**Evidence Type:** [Jenkins Instance Discovery Evidence](/docs/platforms/discover#jenkins-discovery)

| Rule Name | Description |
|-----------|-------------|
| [Require Jenkins Instance Discovery Evidence](/docs/configuration/initiatives/rules/jenkins/instance/evidence-exists.md) | Verify the Jenkins Instance exists as evidence. |
| [Disallow Unused Users](/docs/configuration/initiatives/rules/jenkins/instance/unused-users.md) | Verify there are no users with zero activity. |
| [Verify Inactive Users](/docs/configuration/initiatives/rules/jenkins/instance/inactive-users.md) | Verify there are no inactive users. |

### Statement
**Evidence Type:** [Statement](/docs/valint/generic)

| Rule Name | Description |
|-----------|-------------|
| [Verify Selected Commits Are Signed API](/docs/configuration/initiatives/rules/github/api/signed-commits-list.md) | Verify selected commits are signed in the GitHub organization. |
| [Branch protection enabled in GitHub repository](/docs/configuration/initiatives/rules/github/api/branch-protection.md) | Verify GitHub branch protection rules |
| [Disallow Unsigned Commits In Time Range](/docs/configuration/initiatives/rules/github/api/signed-commits-range.md) | Verify commits in the specified time range are signed. |
| [Sign Selected Commits in GitLab](/docs/configuration/initiatives/rules/gitlab/api/signed-commits-list.md) | Verify the selected commits are signed in the GitLab organization. |
| [Set Push Rules in GitLab](/docs/configuration/initiatives/rules/gitlab/api/push-rules.md) | Verify GitLab push rules are configured via the API. |
| [Sign Selected Commit Range in GitLab](/docs/configuration/initiatives/rules/gitlab/api/signed-commits-range.md) | Verify the selected range of commits is signed via the GitLab API. |
| [Verify No 3rd Party Findings via Scribe API](/docs/configuration/initiatives/rules/api/scribe-api-findings.md) | Verify via Scribe API that there are no findings reported by 3rd party tools in the target product. |
| [Verify No Critical or High Vulnerabilities in Product](/docs/configuration/initiatives/rules/api/scribe-api-cve-product.md) | Verify via Scribe API that there are no critical or high severity vulnerabilities in any deliverable component of the product. |

<!-- END TABLE -->