---
sidebar_label: "Applying Initiatives to your SDLC"
title: Applying Initiatives to your SDLC
sidebar_position: 3
toc_min_heading_level: 2
toc_max_heading_level: 5
---

You can use Scribe to apply policies at different points along your SDLC.
For example, at the end of a build or at the admission control point to the production cluster. Use cases include:

- Images must be signed, and they must have a matching CycloneDX SBOM.
- Images must be built by a CircleCI workflow and produce signed SLSA provenance.
- Tagged sources must be signed and verified by a set of individuals or processes.

For a detailed initiative description, see the **[initiatives](../valint/initiatives)** section.

## Quickstart

### Creating an SBOM

1. Install `valint`:

   ```bash
   curl -sSfL https://get.scribesecurity.com/install.sh  | sh -s -- -t valint
   ```

2. Create an SBOM of the type you want to verify. For a Docker image, the command would be:

   ```bash
   valint bom busybox:latest -o statement \
      --product-key <PRODUCT_KEY> -- product-version <PRODUCT_VERSION> \
      --scribe.client-secret <SCRIBE_TOKEN>
   ```

See [Getting started with valint](../valint/getting-started-valint.md) for more information on the `bom` command.

Alternatively, you can use GitHub actions, as described in detail in [Setting up an integration in GitHub](../quick-start/set-up-integration/set-up-github.md).

### Verifying an initiative

1. Create an image SBOM as described in [Creating an SBOM](#creating-an-sbom).

2. Verify the SBOM against an initiative. Let's take the SSDF initiative provided in the [Scribe Sample Catalog](#sample-rule-catalog):

   ```bash
   valint verify busybox:latest --initiative ssdf@v2 \
      --product-key <PRODUCT_KEY> -- product-version <PRODUCT_VERSION> \
      --scribe.client-secret <SCRIBE_TOKEN>
   ```

   As a result, you will see the output table of the initiative verification. A detailed description of the fields is provided in the corresponding section of the [Policy Results](../valint/policy-results.md#policy-results-in-valint-logs) page.

   <details>

   <summary>Initiative results</summary>

   ```bash
   INFO SSDF-IMAGE: Control "SSDF IMAGE" Evaluation Summary:
   ┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
   │ [SSDF-IMAGE] Control "SSDF IMAGE" Evaluation Summary                                                         │
   ├────────────────┬──────────────────┬───────┬──────────┬────────┬─────────────────────────────┬────────────────┤
   │ RULE ID        │ RULE NAME        │ LEVEL │ VERIFIED │ RESULT │ SUMMARY                     │ TARGET         │
   ├────────────────┼──────────────────┼───────┼──────────┼────────┼─────────────────────────────┼────────────────┤
   │ PS.2           │ Image-verifiable │ error │ false    │ pass   │ Evidence signature verified │ busybox:1.36.1 │
   ├────────────────┼──────────────────┼───────┼──────────┼────────┼─────────────────────────────┼────────────────┤
   │ PS.3.2         │ SBOM archived    │ error │ false    │ pass   │ Evidence signature verified │ busybox:1.36.1 │
   ├────────────────┼──────────────────┼───────┼──────────┼────────┼─────────────────────────────┼────────────────┤
   │ CONTROL RESULT │                  │       │          │ PASS   │                             │                │
   └────────────────┴──────────────────┴───────┴──────────┴────────┴─────────────────────────────┴────────────────┘

   INFO SSDF: Initiative "SSDF Client Initiative" Evaluation Summary:
   ┌──────────────────────────────────────────────────────────────────┐
   │ [SSDF] Initiative "SSDF Client Initiative" Evaluation Summary    │
   ├───────────────────┬───────────────┬─────────────────────┬────────┤
   │ CONTROL ID        │ CONTROL NAME  │ RULE LIST           │ RESULT │
   ├───────────────────┼───────────────┼─────────────────────┼────────┤
   │ SSDF-IMAGE        │ SSDF IMAGE    │ PS.2(pass),         │ pass   │
   │                   │               │ PS.3.2(pass)        │        │
   ├───────────────────┼───────────────┼─────────────────────┼────────┤
   │ INITIATIVE RESULT │               │                     │ PASS   │
   └───────────────────┴───────────────┴─────────────────────┴────────┘
   Evaluation Target Name 'index.docker.io/library/busybox:latest'
   ```

   </details>

   :::info
   Only the rules that are applicable to the target (the `busybox:latest` docker image) were verified. Other rules were disabled automatically, and no result was generated for them.
   :::
   :::info
   To verify the whole SSDF initiative, you need to run SCM platform discovery. See [platforms discovery](../platforms/overview).
   :::

### Running a single rule verification

Similar to [initiatives](#verifying-an-initiative), you can verify a single rule. Let's take as an example the `sbom-require-complete-license-set` rule from the [Scribe Sample Catalog](#sample-rule-catalog):

1. Create an image SBOM as described in [Creating an SBOM](#creating-an-sbom).

2. Verify the SBOM against an existing rule from the bundle. The [Scribe Sample Rule Catalog](#sample-rule-catalog) will be used as the default rule bundle for `valint`.

   ```bash
   valint verify busybox:latest --rule sbom/complete-licenses@v2 \
      --product-key <PRODUCT_KEY> -- product-version <PRODUCT_VERSION> \
      --scribe.client-secret <SCRIBE_TOKEN>
   ```

   As a result, you will see the output table of the rule verification. A detailed description of the fields is provided in the corresponding section of the [Policy Results](../valint/policy-results.md#policy-results-in-valint-logs) page.

   <details>

   <summary>Rule evaluation results</summary>

   ```bash
   ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
   │ [default] Control "Default" Evaluation Summary                                                                                                  │
   ├───────────────────────────────────┬───────────────────────────────────┬───────┬──────────┬────────┬────────────────────────────┬────────────────┤
   │ RULE ID                           │ RULE NAME                         │ LEVEL │ VERIFIED │ RESULT │ SUMMARY                    │ TARGET         │
   ├───────────────────────────────────┼───────────────────────────────────┼───────┼──────────┼────────┼────────────────────────────┼────────────────┤
   │ sbom-require-complete-license-set │ Enforce SBOM License Completeness │ error │ false    │ pass   │ All packages have licenses │ busybox:1.36.1 │
   ├───────────────────────────────────┼───────────────────────────────────┼───────┼──────────┼────────┼────────────────────────────┼────────────────┤
   │ CONTROL RESULT                    │                                   │       │          │ PASS   │                            │                │
   └───────────────────────────────────┴───────────────────────────────────┴───────┴──────────┴────────┴────────────────────────────┴────────────────┘
   ```

   You will also see the results table of the initiative evaluation:

   ```bash
   ┌─────────────────────────────────────────────────────────────────────────────────────────────┐
   │ [client-initiative] Initiative "client-initiative" Evaluation Summary                       │
   ├───────────────────┬───────────────┬────────────────────────────────────────────────┬────────┤
   │ CONTROL ID        │ CONTROL NAME  │ RULE LIST                                      │ RESULT │
   ├───────────────────┼───────────────┼────────────────────────────────────────────────┼────────┤
   │ default           │ Default       │ sbom-require-complete-license-set(pass)        │ pass   │
   ├───────────────────┼───────────────┼────────────────────────────────────────────────┼────────┤
   │ INITIATIVE RESULT │               │                                                │ PASS   │
   └───────────────────┴───────────────┴────────────────────────────────────────────────┴────────┘
   ```

   </details>

   :::info
   The rule was put in the `client-initiative` initiative. To change that, you can use the `--initiative-name` and `--initiative-id` flags.
   It was also put in the `default` control. This cannot be changed unless you provide a full initiative config with custom names and IDs for your controls.
   :::

### Targetless Run

Some of the rules in this catalog can also be run in "targetless" mode,
meaning that the evidence will be looked up based only on the product name, version, and options specified in the rule config.
No target for preliminary analysis is needed.
This is usually helpful for third-party reports, such as security scans and [platform discoveries](../platforms/overview).

As an example, let's run `trivy` to create a SARIF report:

```bash
trivy image --format sarif --output results.sarif ubuntu:latest
```

Then, create evidence from this report:

```bash
valint evidence results.sarif \
   --product-key <PRODUCT_KEY> -- product-version <PRODUCT_VERSION> \
   --scribe.client-secret <SCRIBE_TOKEN>
```

Finally, verify the evidence against the rule. Note that we don't need to provide `valint` with the target report:

```bash
valint verify --rule sarif/trivy/verify-trivy-report@v2 \
   --product-key <PRODUCT_KEY> -- product-version <PRODUCT_VERSION> \
   --scribe.client-secret <SCRIBE_TOKEN>
```

`valint` will use the latest evidence for the specified product name and version that meets the other rule requirements.
In our example, the rule needs an evidence created by the "Trivy Vulnerability Scanner" tool,
so `valint` was able to find it just by this partial context.

<details>

<summary>Initiative results</summary>

```bash
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [default] Control "Default" Evaluation Summary                                                                                     │
├────────────────┬──────────────────────────────────────┬───────┬──────────┬────────┬────────────────────────────────┬───────────────┤
│ RULE ID        │ RULE NAME                            │ LEVEL │ VERIFIED │ RESULT │ SUMMARY                        │ TARGET        │
├────────────────┼──────────────────────────────────────┼───────┼──────────┼────────┼────────────────────────────────┼───────────────┤
│ trivy-report   │ Verify Trivy SARIF Report Compliance │ error │ false    │ fail   │ 113 violations | 0 max allowed │ results.sarif │
├────────────────┼──────────────────────────────────────┼───────┼──────────┼────────┼────────────────────────────────┼───────────────┤
│ CONTROL RESULT │                                      │       │          │ FAIL   │                                │               │
└────────────────┴──────────────────────────────────────┴───────┴──────────┴────────┴────────────────────────────────┴───────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ [client-initiative] Initiative "client-initiative" Evaluation Summary  │
├───────────────────┬───────────────┬───────────────────────────┬────────┤
│ CONTROL ID        │ CONTROL NAME  │ RULE LIST                 │ RESULT │
├───────────────────┼───────────────┼───────────────────────────┼────────┤
│ default           │ Default       │ trivy-report(fail)        │ fail   │
├───────────────────┼───────────────┼───────────────────────────┼────────┤
│ INITIATIVE RESULT │               │                           │ FAIL   │
└───────────────────┴───────────────┴───────────────────────────┴────────┘
```

</details>

### Whole initiative verification

If you want to verify an initiative on all existing attestations, provide `valint` with the `--all-evidence` flag.
It disables using of target for evidence filtering and verifies all matching attestations for each rule.

```bash
valint verify --initiative ssdf@v2 --all-evidence \
   --product-key <PRODUCT_KEY> -- product-version <PRODUCT_VERSION> \
   --scribe.client-secret <SCRIBE_TOKEN>
```

<details>

<summary>Initiative results</summary>

```bash
INFO SSDF-IMAGE: Control "SSDF IMAGE" Evaluation Summary:
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [SSDF-IMAGE] Control "SSDF IMAGE" Evaluation Summary                                                         │
├────────────────┬──────────────────┬───────┬──────────┬────────┬─────────────────────────────┬────────────────┤
│ RULE ID        │ RULE NAME        │ LEVEL │ VERIFIED │ RESULT │ SUMMARY                     │ TARGET         │
├────────────────┼──────────────────┼───────┼──────────┼────────┼─────────────────────────────┼────────────────┤
│ PS.2           │ Image-verifiable │ error │ true     │ pass   │ Evidence signature verified │ busybox:1.36.1 │
├────────────────┼──────────────────┼───────┼──────────┼────────┼─────────────────────────────┼────────────────┤
│ PS.3.2         │ SBOM archived    │ error │ true     │ pass   │ Evidence signature verified │ busybox:1.36.1 │
├────────────────┼──────────────────┼───────┼──────────┼────────┼─────────────────────────────┼────────────────┤
│ CONTROL RESULT │                  │       │          │ PASS   │                             │                │
└────────────────┴──────────────────┴───────┴──────────┴────────┴─────────────────────────────┴────────────────┘

INFO SSDF-ORG: Control "SSDF ORG" Evaluation Summary:
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [SSDF-ORG] Control "SSDF ORG" Evaluation Summary                                                                                                             │
├────────────────┬────────────────────────────────┬───────┬──────────┬────────┬────────────────────────────────────────┬───────────────────────────────────────┤
│ RULE ID        │ RULE NAME                      │ LEVEL │ VERIFIED │ RESULT │ SUMMARY                                │ TARGET                                │
├────────────────┼────────────────────────────────┼───────┼──────────┼────────┼────────────────────────────────────────┼───────────────────────────────────────┤
│ PS.1.1         │ Enforce 2FA                    │ error │ true     │ pass   │ 2FA authentication is enabled          │ my-org (github organization)          │
├────────────────┼────────────────────────────────┼───────┼──────────┼────────┼────────────────────────────────────────┼───────────────────────────────────────┤
│ PS.1.3         │ Limit admins                   │ error │ true     │ fail   │ 9 admins | 3 max allowed               │ my-org (github organization)          │
├────────────────┼────────────────────────────────┼───────┼──────────┼────────┼────────────────────────────────────────┼───────────────────────────────────────┤
│ PS.1.5         │ Require signoff on web commits │ error │ true     │ fail   │ web_commit_signoff_required is NOT set │ my-org (github organization)          │
├────────────────┼────────────────────────────────┼───────┼──────────┼────────┼────────────────────────────────────────┼───────────────────────────────────────┤
│ CONTROL RESULT │                                │       │          │ FAIL   │                                        │                                       │
└────────────────┴────────────────────────────────┴───────┴──────────┴────────┴────────────────────────────────────────┴───────────────────────────────────────┘

INFO SSDF-REPO: Control "SSDF REPO" Evaluation Summary:
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [SSDF-REPO] Control "SSDF REPO" Evaluation Summary                                                                                                      |
├────────────────┬──────────────────┬───────┬──────────┬────────┬─────────────────────────────────────────────────┬───────────────────────────────────────|
│ RULE ID        │ RULE NAME        │ LEVEL │ VERIFIED │ RESULT │ SUMMARY                                         │ TARGET                                |
├────────────────┼──────────────────┼───────┼──────────┼────────┼─────────────────────────────────────────────────┼───────────────────────────────────────┤
│ PS.1.2         │ Branch protected │ error │ true     │ fail   │ 1 unprotected branches | 0 max allowed          │ my-org/my-repo (github repo)          │
├────────────────┼──────────────────┼───────┼──────────┼────────┼─────────────────────────────────────────────────┼───────────────────────────────────────┤
│ PS.1.4         │ Repo private     │ error │ true     │ pass   │ The repository is private                       │ my-org/my-repo (github repo)          │
├────────────────┼──────────────────┼───────┼──────────┼────────┼─────────────────────────────────────────────────┼───────────────────────────────────────┤
│ CONTROL RESULT │                  │       │          │ FAIL   │                                                 │                                       │
└────────────────┴──────────────────┴───────┴──────────┴────────┴─────────────────────────────────────────────────┴───────────────────────────────────────┘

INFO SSDF: Initiative "SSDF Client Initiative" Evaluation Summary:
┌───────────────────────────────────────────────────────────────────┐
│ [SSDF] Initiative "SSDF Client Initiative" Evaluation Summary     │
├───────────────────┬───────────────┬──────────────────────┬────────┤
│ CONTROL ID        │ CONTROL NAME  │ RULE LIST            │ RESULT │
├───────────────────┼───────────────┼──────────────────────┼────────┤
│ SSDF-IMAGE        │ SSDF IMAGE    │ PS.2(pass),          │ pass   │
│                   │               │ PS.3.2(pass)         │        │
├───────────────────┼───────────────┼──────────────────────┼────────┤
│ SSDF-ORG          │ SSDF ORG      │ PS.1.1(pass),        │ fail   │
│                   │               │ PS.1.3(fail),        │        │
│                   │               │ PS.1.5(fail)         │        │
├───────────────────┼───────────────┼──────────────────────┼────────┤
│ SSDF-REPO         │ SSDF REPO     │ PS.1.2(fail),        │ fail   │
│                   │               │ PS.1.4(pass)         │        │
├───────────────────┼───────────────┼──────────────────────┼────────┤
│ INITIATIVE RESULT │               │                      │ FAIL   │
└───────────────────┴───────────────┴──────────────────────┴────────┘
```

</details>

In this case, no rule was disabled, and all of them were verified.

## Sample Rule Catalog

We provide a set of sample rules that can be used to verify the compliance of your software supply chain. This catalog is used by `valint` by default.
To use a different version of this catalog, use the `--bundle-tag` valint flag.

To use a custom rule catalog, you can specify the path to the catalog in the `--bundle` flag (it may be a local path or a git repo). Additionally, `--bundle-branch` and `--bundle-tag` flags can be used to specify the branch or tag of the catalog git repo.

| Rule | Description | Additional Info |
| --- | --- | --- |
| [Require SBOM Signature](#require-sbom-signature) | Verify the SBOM is signed. | [SBOM](#sbom) |
| [Restrict Disallowed Dependencies](#restrict-disallowed-dependencies) | Verify the number of disallowed dependencies remains below the specified threshold. | [SBOM](#sbom) |
| [Enforce SBOM Dependencies](#enforce-sbom-dependencies) | Verify the artifact includes all required dependencies. | [SBOM](#sbom) |
| [Restrict Disallowed SBOM Licenses](#restrict-disallowed-sbom-licenses) | Verify specific users are not allowed in an SBOM. | [SBOM](#sbom) |
| [Enforce SBOM License Completeness](#enforce-sbom-license-completeness) | Verify all dependencies in the artifact have a license. | [SBOM](#sbom) |
| [Enforce SBOM Freshness](#enforce-sbom-freshness) | Verify the SBOM is not older than the specified duration. | [SBOM](#sbom) |
| [Fresh Image](#fresh-image) |Verify the image is not older than the specified threshold. | [Image SBOM](#images) |
| [Disallow Container Shell Entrypoint](#disallow-container-shell-entrypoint) | Verify the container image disallows shell entrypoint. | [Image SBOM](#images) |
| [Restrict Build Scripts](#restrict-build-scripts) | Verify no build scripts commands appear in block list. | [Image SBOM](#images) |
| [Verify Image Labels](#verify-image-labels) | Verify specified labels key-value pairs exist in the image. | [Image SBOM](#images)  |
| [Forbid Large Images](#forbid-large-images) | Verify the image size is below the specified threshold. | [Image SBOM](#images) |
| [Restrict Coding Permissions](#restrict-coding-permissions) | Verify only allowed users committed to the repository. | [Git SBOM](#git) |
| [Disallow Unsigned Commits](#disallow-unsigned-commits) | Verify all commits are signed. | [Git SBOM](#git) |
| [Disallow Commits to Main Branch](#disallow-commits-to-main-branch) | Verify commits made directly to the main branch are disallowed. | [Git SBOM](#git) |
| [Verify that artifact was created by the specified builder](#verify-that-artifact-was-created-by-the-specified-builder) | Verify the artifact was created by the specified builder. | [SLSA-Prov](#slsa) |
| [Disallow dependencies in SLSA Provenance Document](#disallow-dependencies-in-slsa-provenance-document) | Verify that dependencies in the block list do not appear in the SLSA Proveance document. | [SLSA-Prov](#slsa) |
| [Verify Build Time](#verify-build-time) | Verify the artifact was created within the specified time window. | [SLSA-Prov](#slsa) |
| [Verify that artifact has no disallowed builder dependencies](#verify-that-artifact-has-no-disallowed-builder-dependencies) | Verify the artifact has no disallowed builder dependencies. | [SLSA-Prov](#slsa) |
| [SLSA Field Exists in Provenance Document](#slsa-field-exists-in-provenance-document) | Verify the specified field exists in the provenance document. | [SLSA-Prov](#slsa) |
| [Verify Rule Compliance in SARIF](#verify-rule-compliance-in-sarif) | Verify the SARIF report complies with defined generic rules for compliance and security. | [SARIF](#sarif-reports) |
| [Do Not Allow Vulnerabilities Based On Specific Attack Vector](#do-not-allow-vulnerabilities-based-on-specific-attack-vector) | Restrict vulnerabilities based on specific attack vector. | [SARIF](#sarif-reports) |
| [Verify IaC Misconfiguration Threshold in SARIF](#verify-iac-misconfiguration-threshold-in-sarif) | Verify the number of infrastructure-as-code (IaC) errors in the SARIF report remains below the specified threshold. | [SARIF](#sarif-reports) |
| [Verify Semgrep Rule in SARIF](#verify-semgrep-rule-in-sarif) | Verify the Semgrep SARIF report complies with predefined rules to ensure compliance and detect issues. | [SARIF](#sarif-reports) |
| [Verify Tool Evidence in SARIF](#verify-tool-evidence-in-sarif) | Verify required tools were used to generate the SARIF report. | [SARIF](#sarif-reports) |
| [K8s Jailbreak](#k8s-jailbreak) | Verify no misconfigurations from the prohibited ids list in the Kuberentes scan is below specified threshold. | [Generic](#generic) |
| [Verify Github Branch Protection](https://github.com/scribe-public/sample-policies/blob/v2/v2/rules/github/api/branch-protection.md) | Verify that the branch protection rules are compliant to required | None |
| [Verify GitLab Push Rules](https://github.com/scribe-public/sample-policies/blob/v2/v2/rules/gitlab/api/push-rules.md) | Verify that the push rules are compliant to required. GitLabs push rules overlap some of GitHub's branch protection rules | None |

### General Information

Most of the policy rules in this bundle consist of two files: a `.yaml` and a `.rego`.

The first is a rule configuration file that should be referenced by on runtime or merged to the actual `valint.yaml`.
The second is a rego script that contains the actual verifyer code. It can be used as is or merged to the `.yaml` using `script` option.

#### Modifying rules in the Catalog

Each rule in this catalog consists of a `rego` script and `yaml` configuration file.
In order to run a rule, its script file should be referred by a rule config. Each `.yaml` represents such a config and is ready for use.

### SBOM

An example of creating an SBOM evidence:

```bash
valint bom ubuntu:latest -o statement
```

To verify the evidence against the rule, run:

```bash
valint verify ubuntu:latest -i statement-cyclonedx-json --rule sbom/rule_config@v2
```

#### Require SBOM Signature

This rule ([artifact-signed.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sbom/artifact-signed.yaml)) verifies that the SBOM is signed and the signer identity equals to a given value.

If you have not created an SBOM yet, create an sbom attestation, for example:

In [artifact-signed.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sbom/artifact-signed.yaml) file,
edit policy parameters ```attest.cocosign.policies.rules.input identity``` to reflect the expected signers identity.

You can also edit `target_type` to refelct the artifact type.

:::info
Optional target types are `git`,`directory`, `image`, `file`, `generic`.
:::

```yaml
evidence:
   target_type: container
with:
   identity:
      emails:
         - example@company.com
```

#### Restrict Disallowed Dependencies

This rule ([blocklist-packages.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sbom/blocklist-packages.yaml), [blocklist-packages.rego](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sbom/blocklist-packages.rego)) verifies an SBOM does not include packages in the list of risky packages.

`rego` code for This rule can be found in the [blocklist-packages.rego](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sbom/blocklist-packages.rego) file.

Edit the list of the risky licenses in the `input.rego.args` parameter in file [blocklist-packages.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sbom/blocklist-packages.yaml):

```yaml
with:
   blocklist:
      - "pkg:deb/ubuntu/tar@1.34+dfsg-1ubuntu0.1.22.04.1?arch=arm64&distro=ubuntu-22.04"
      - "log4j"
   blocklisted_limit: 0
```

#### Enforce SBOM Dependencies

This rule ([required-packages.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sbom/required-packages.yaml), [required-packages.rego](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sbom/required-packages.rego)) verifies that the SBOM includes packages from the list of required packages.

Edit the list of the required packages in the `input.rego.args` parameter in file [required-packages.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sbom/required-packages.yaml):

```yaml
with:
   required_pkgs:
      - "pkg:deb/ubuntu/bash@5.1-6ubuntu1?arch=amd64\u0026distro=ubuntu-22.04"
   violations_limit: 1
```

The rule checks if there is a package listed in SBOM whose name contains the name of a required package as a substring. For example, if the package name is ```pkg:deb/ubuntu/bash@5.1-6ubuntu1?arch=amd64\u0026distro=ubuntu-22.04```, it will match any substring, like just ```bash``` or ```bash@5.1-6ubuntu1```.

#### Restrict Disallowed SBOM Licenses

This rule ([banned-licenses.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sbom/banned-licenses.yaml), [banned-licenses.rego](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sbom/banned-licenses.rego)) verifies that the SBOM does not include licenses from the list of risky licenses.

Edit the list of the risky licenses in the `input.rego.args` parameter in file [banned-licenses.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sbom/banned-licenses.yaml):

```yaml
rgs:
   blocklist:
      - GPL
      - MPL
   blocklisted_limit : 10
```

#### Enforce SBOM License Completeness

This rule ([complete-licenses.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sbom/complete-licenses.yaml), [complete-licenses.rego](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sbom/complete-licenses.rego)) verifies that every package in the SBOM has a license.

It doesn't have any additional parameters.

#### Enforce SBOM Freshness

This rule ([fresh-sbom.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sbom/fresh-sbom.yaml), [fresh-sbom.rego](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sbom/fresh-sbom.rego)) verifies that the SBOM is not older than a given number of days.

Edit the config `input.rego.args` parameter in file [fresh-sbom.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sbom/fresh-sbom.yaml):

```yaml
with:
   max_days : 30
```

### Images

An example of creating an evidence:

```bash
valint bom ubuntu:latest -o statement
```

To verify the evidence against the rule:

```bash
valint verify ubuntu:latest -i statement --rule images/rule_config@v2
```

#### Disallow Container Shell Entrypoint

This rule ([restrict-shell-entrypoint.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/images/restrict-shell-entrypoint.yaml), [restrict-shell-entrypoint.rego](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/images/restrict-shell-entrypoint.rego)) verifies that the image entrypoint does not provide shell access by default. It does so by verifying that both `Entrypoint` and `Cmd` don't contain `sh` (there's an exclusion for `.sh` though).

This rule is not configurable.

#### Restrict Build Scripts

This rule ([blocklist-build-scripts.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/images/blocklist-build-scripts.yaml), [blocklist-build-scripts.rego](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/images/blocklist-build-scripts.rego)) verifies that the image did not run blocklisted scripts on build.

Edit the list of the blocklisted scripts in the `input.rego.args` parameter in file [blocklist-build-scripts.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/images/no-build-scripts.yaml):

```yaml
with:
   blocklist:
      - curl
```

#### Verify Image Labels

This rule ([verify-labels.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/images/verify-labels.yaml), [verify-labels.rego](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/images/verify-labels.rego)) verifies that image has labels with required values.

Edit the list of the required labels in the config object in file [verify-labels.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/images/verify-labels.yaml):

```yaml
with:
   labels:
      - label: "org.opencontainers.image.version"
        value: "22.04"
```

#### Fresh Image

This rule ([fresh-image.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/images/fresh-image.yaml), [fresh-image.rego](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/images/fresh-image.rego)) verifies that the image is not older than a given number of days.

Edit the config `input.rego.args` parameter in file [fresh-image.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/images/fresh-image.yaml):

```yaml
with:
   max_days: 183
```

#### Forbid Large Images

This rule ([forbid-large-images.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/images/forbid-large-images.yaml), [forbid-large-images.rego](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/images/forbid-large-images.rego)) verifies that the image is not larger than a given size.

Set max size in bytes in the `input.rego.args` parameter in file [forbid-large-images.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/images/forbid-large-images.yaml):

```yaml
with:
   max_size: 77808811
```

### Git

An example of creating a Git evidence:

```bash
valint bom git:https://github.com/golang/go -o statement
```

To verify the evidence against the rule:

```bash
valint verify git:https://github.com/golang/go -i statement --rule git/rule_config@v2
```

#### Restrict Coding Permissions

This rule ([coding-permissions.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/git/coding-permissions.yaml), [coding-permissions.rego](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/git/coding-permissions.rego)) verifies that files from the specified list were modified by authorized users only.

For This rule be able to run, the evidence must include a reference to the files that were modified in the commit. This can be done by adding parameter `--components commits,files` to the `valint bom` command.

For specifying the list of files and identities, edit the `input.rego.args` parameter in file [coding-permissions.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/git/coding-permissions.yaml).
This example for repository [Golang Build](https://github.com/golang/build) verifies that files `build.go` and `internal/https/README.md` were modified only by identities containing `@golang.com` and `@golang.org`:

```yaml
with:
   ids:
      - "@golang.com"
      - "@golang.org"
   files:
      - "a.txt"
      - "somedir/b.txt"
```

#### Disallow Unsigned Commits

This rule ([no-unsigned-commits.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/git/no-unsigned-commits.yaml), [no-unsigned-commits.rego](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/git/no-unsigned-commits.rego)) verifies that evidence has no unsigned commits. It does not verify the signatures though.

#### Disallow Commits to Main Branch

This rule ([no-commit-to-main.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/git/no-commit-to-main.yaml), [no-commit-to-main.rego](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/git/no-commit-to-main.rego)) verifies that evidence has no commits made to main branch.

### SLSA

Example of creating a SLSA statement:

```bash
valint slsa ubuntu:latest -o statement
```

Example of verifying a SLSA statement:

```bash
valint verify ubuntu:latest -i statement-slsa --rule slsa/rule_config@v2
```

#### Verify that artifact was created by the specified builder

This rule ([verify-builder.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/slsa/verify-builder.yaml), [verify-builder.rego](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/slsa/verify-builder.rego)) verifies that the builder name of the SLSA statement equals to a given value.

Edit config `input.rego.args` parameter in file [verify-builder.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/slsa/verify-builder.yaml):

```yaml
with:
   id: "local"
```

#### Disallow dependencies in SLSA Provenance Document

This rule ([banned-builder-deps.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/slsa/banned-builder-deps.yaml), [banned-builder-deps.rego](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/slsa/banned-builder-deps.rego)) verifies that the builder used to build an artifact does not have banned dependencies (such as an old openSSL version).

Edit config `input.rego.args` parameter in file [banned-builder-deps.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/slsa/banned-builder-deps.yaml):

```yaml
with:
   blocklist:
      - name: "valint"
         version: "0.0.0"
```

#### Verify Build Time

This rule ([build-time.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/slsa/build-time.yaml), [build-time.rego](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/slsa/build-time.rego)) verifies that the build time of the SLSA statement is within a given time window The timezone is derived from the timestamp in the statement.

Edit config `input.rego.args` parameter in file [build-time.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/slsa/build-time.yaml):

```yaml
with:
   start_hour: 8
   end_hour: 20
   workdays:
      - "Sunday"
      - "Monday"
      - "Tuesday"
      - "Wednesday"
      - "Thursday"
```

#### Verify that artifact has no disallowed builder dependencies

This rule ([verify-byproducts.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/slsa/verify-byproducts.yaml), [verify-byproducts.rego](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/slsa/verify-byproducts.rego)) verifies that the SLSA statement contains all the required byproducts.
According to the SLSA Provenance [documentation](https://slsa.dev/spec/v1.0/provenance), there are no mandatory fields in the description of a byproduct, but at least one of `uri, digest, content` should be specified.
So, the rule checks if each byproduct specified in the configuration is present in one of those fields of any byproduct in the SLSA statement. It does so by calling the `contains` function, so the match is not exact.

Before running the rule, specify desired byproducts in the `input.rego.args` parameter in file [verify-byproducts.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/slsa/verify-byproducts.yaml):

```yaml
with:
   byproducts:
      - 4693057ce2364720d39e57e85a5b8e0bd9ac3573716237736d6470ec5b7b7230
```

#### SLSA Field Exists in Provenance Document

This rule ([field-exists.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/slsa/field-exists.yaml), [field-exists.rego](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/slsa/field-exists.rego)) verifies that the SLSA statement contains a field with the given path.

Before running the rule, specify desired paths in the `input.rego.args` parameter in file [field-exists.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/slsa/field-exists.yaml):

```yaml
with:
   paths:
      - "predicate/runDetails/builder/builderDependencies"
   violations_threshold: 0
```

### Sarif Reports

#### Generic SARIF Rule

This rule ([verify-sarif.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sarif/verify-sarif.yaml), [verify-sarif.rego](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sarif/verify-sarif.rego)) allows to verify any SARIF report against a given rule. The rule has several parameters to check against:

- ruleLevel: the level of the rule, can be "error", "warning", "note", "none"
- ruleIds: the list of the rule IDs to check against
- precision: the precision of the check, can be "exact", "substring", "regex"
- ignore: the list of the rule IDs to ignore
- maxAllowed: the maximum number of violations allowed

These values can be changed in the `input.rego.args` section in the [verify-sarif.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sarif/verify-sarif.yaml) file.

##### Creating a BOM out of a SARIF report

Create a trivy sarif report of the vulnerabilities of an image:

```bash
trivy image ubuntu:latest -f sarif -o ubuntu-cve.json
```

Create an evidence from this report:

```bash
valint evidence ubuntu-cve.json  -o statement
```

Verify the attestation against the rule:

```bash
valint verify ubuntu-cve.json -i statement-generic --rule sarif/verify-sarif@v2
```

###### Running Trivy On Docker Container Rootfs

As an alternative, one can run `trivy` against an existing Docker container rootfs:

```bash
docker run --rm -it alpine:3.11
```

Then, inside docker run:

```bash
curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
trivy rootfs / -f sarif -o rootfs.json
```

Then, outside docker run this to copy the report from the container:

```bash
docker cp $(docker ps -lq):/rootfs.json .
```

After that create the evidence and verify it as described above.

##### Verify Rule Compliance in SARIF

To verify that the SARIF report complies with defined generic rules for compliance and security, set the following parameters in the `rego.args` section in the[verify-sarif.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sarif/verify-sarif.yaml) file:

```yaml
with:
   rule_level: []
   precision: []
   rule_ids: []
   ignore: []
   max_allowed: 0
```

For example, to alarm on specific rule levels & rule IDs, modify config as follows:

```yaml
with:
   rule_level:
      - "error"
      - "warning"
      - "note"
      - "none"
   precision: []
   rule_ids:
      - "CVE-2021-1234"
      - "CVE-2021-5678"
   ignore: []
   max_allowed: 0
```

##### Do Not Allow Vulnerabilities Based On Specific Attack Vector

Trivy/grype reports usually contain descriptions for some CVEs, like impact and attack vector.
This rule ([verify-attack-vector.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sarif/verify-attack-vector.yaml), [verify-attack-vector.rego](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sarif/verify-attack-vector.rego)) is meant to restrict number of vulnerabilities with specific attack vectors.
For example, to restrict vulnerabilities with attack vector "stack buffer overflow", set the following parameters in the `rego.args` section in the [verify-attack-vector.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sarif/verify-attack-vector.yaml) file:

```yaml
with:
   attack_vectors:
      - "stack buffer overflow"
   violations_threshold: 0
```

Then run the rule against the SARIF report as described above.

#### Verify IaC Misconfiguration Threshold in SARIF

This rule ([report-iac-errors.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sarif/report-iac-errors.yaml), [report-iac-errors.rego](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sarif/report-iac-errors.rego)) allows to verify a Trivy IaC report and check if there are any errors in the configuration.

First, create a trivy report of the misconfigurations of a Dockerfile:

```bash
trivy config <dir_containing_dockerfile> -f sarif -o my-image-dockerfile.json
```

Create an evidence from this report:

```bash
valint evidence my-image-dockerfile.json -o statement
```

Verify the attestation against the rule:

```bash
valint verify my-image-dockerfile.json -i statement-generic --rule sarif/report-iac-errors@v2
```

The only configurable parameter in [report-iac-errors.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sarif/report-iac-errors.yaml) is `violations_threshold`, which is the maximum number of errors allowed in the report:

```yaml
with:
   violations_threshold: 0
```

#### Verify Semgrep Rule in SARIF

`semgrep`, a code analysis tool, can produce SARIF reports, which later can be verified by `valint` against a given rule.

This rule ([verify-semgrep-report.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sarif/verify-semgrep-report.yaml), [verify-semgrep-report.rego](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sarif/verify-semgrep-report.rego)) allows to verify that given SARIF report does not contain specific rules violations.

First, one needs to create a semgrep report (say, for the `openvpn` repo):

```bash
cd openvpn/
semgrep scan --config auto -o semgrep-report.sarif --sarif
```

Then, create an evidence from this report:

```bash
valint evidence semgrep-report.sarif -o statement
```

Configuration of This rule is done in the file [verify-semgrep-report.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sarif/verify-semgrep-report.yaml). In this example we forbid any violations of the `use-after-free` rule:

```yaml
with:
   rule_ids:
      - "use-after-free"
   violations_threshold: 0
```

Then, run `valint verify` as usual:

```bash
valint verify semgrep-report.sarif -i statement-generic --rule sarif/verify-semgrep-report@v2
```

If any violations found, the output will contain their description, including the violated rule and the file where the violation was found.

#### Verify Tool Evidence in SARIF

This rule ([verify-tool-evidence.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sarif/verify-tool-evidence.yaml)) allows to verify the existence of an evidence of SARIF report created by a specified tool. By default, the rule checks for an evidence created out of _any_ SARIF report. To specify a tool, use the `tool` parameter in the `evidence` section of the rule configuration. For example, to verify that there is an evidence of a SARIF report created by `trivy`, use the following configuration:

```yaml
uses: sarif/verify-tool-evidence@v2
evidence:
   tool: "Trivy Vulnerability Scanner"
```

### K8s Jailbreak

Trivy k8s analysis can highlight some misconfigurations which allow container to access host filesystem or network. The goal of This rule is to detect such misconfigurations.

To run this rule one has to create a Trivy k8s report and create a generic statement with `valint` from it. Then, simply verify the statement against this rule. No additional configuration required.

## Writing Rule Files

Rego policy rules can be written either as snippets in the yaml file, or as separate rego files.

An example of such a rego script is given in the [verify-sarif.rego](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sarif/verify-sarif.rego) file, that is consumed by the [verify-sarif.yaml](https://github.com/scribe-public/sample-policies/tree/v2/v2/rules/sarif/verify-sarif.yaml) configuraion. To evaluate the rule, run

```bash
valint verify ubuntu-cve.json -i statement-generic --rule sarif/verify-sarif@v2
```
