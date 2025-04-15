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
   valint bom busybox:latest -o attest \
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
   INFO PS/PS.2/PS.2.1: Control "Make software integrity verification information available to software acquirers" Evaluation Summary: 
   ┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
   │ [PS/PS.2/PS.2.1] Control "Make software integrity verification information available to software acquirers" Evaluati │
   │ on Summary                                                                                                           │
   ├────────────────┬──────────────────┬───────┬──────────┬────────┬─────────────────────────────┬────────────────────────┤
   │ RULE ID        │ RULE NAME        │ LEVEL │ VERIFIED │ RESULT │ SUMMARY                     │ TARGET                 │
   ├────────────────┼──────────────────┼───────┼──────────┼────────┼─────────────────────────────┼────────────────────────┤
   │ sbom-is-signed │ Image-verifiable │ none  │ true     │ pass   │ Evidence signature verified │ busybox:1.36.1 (image) │
   ├────────────────┼──────────────────┼───────┼──────────┼────────┼─────────────────────────────┼────────────────────────┤
   │ CONTROL RESULT │                  │       │          │ PASS   │                             │                        │
   └────────────────┴──────────────────┴───────┴──────────┴────────┴─────────────────────────────┴────────────────────────┘
   INFO PS/PS.3/PS.3.1: Control "Securely archive the necessary files and supporting data to be retained for each software release" Evaluation Summary: 
   ┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
   │ [PS/PS.3/PS.3.1] Control "Securely archive the necessary files and supporting data to be retained for each software  │
   │ release" Evaluation Summary                                                                                          │
   ├───────────────────┬───────────────────┬───────┬──────────┬────────┬─────────────────────────┬────────────────────────┤
   │ RULE ID           │ RULE NAME         │ LEVEL │ VERIFIED │ RESULT │ SUMMARY                 │ TARGET                 │
   ├───────────────────┼───────────────────┼───────┼──────────┼────────┼─────────────────────────┼────────────────────────┤
   │ provenance-exists │ Provenance exists │ error │ false    │ fail   │ SLSA Provenance missing │ busybox:1.36.1 (image) │
   ├───────────────────┼───────────────────┼───────┼──────────┼────────┼─────────────────────────┼────────────────────────┤
   │ CONTROL RESULT    │                   │       │          │ FAIL   │                         │                        │
   └───────────────────┴───────────────────┴───────┴──────────┴────────┴─────────────────────────┴────────────────────────┘
   INFO PS/PS.3/PS.3.2: Control "Collect, safeguard, maintain, and share provenance data for all components of each software release" Evaluation Summary: 
   ┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
   │ [PS/PS.3/PS.3.2] Control "Collect, safeguard, maintain, and share provenance data for all components of each soft │
   │ ware release" Evaluation Summary                                                                                  │
   ├────────────────┬───────────────┬───────┬──────────┬────────┬─────────────────────────────┬────────────────────────┤
   │ RULE ID        │ RULE NAME     │ LEVEL │ VERIFIED │ RESULT │ SUMMARY                     │ TARGET                 │
   ├────────────────┼───────────────┼───────┼──────────┼────────┼─────────────────────────────┼────────────────────────┤
   │ sbom-is-signed │ SBOM archived │ none  │ true     │ pass   │ Evidence signature verified │ busybox:1.36.1 (image) │
   ├────────────────┼───────────────┼───────┼──────────┼────────┼─────────────────────────────┼────────────────────────┤
   │ CONTROL RESULT │               │       │          │ PASS   │                             │                        │
   └────────────────┴───────────────┴───────┴──────────┴────────┴─────────────────────────────┴────────────────────────┘
   INFO SSDF: Initiative "SSDF Client Initiative" Evaluation Summary: 
   ┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
   │ [SSDF] Initiative "SSDF Client Initiative" Evaluation Summary                                                              │
   ├───────────────────┬──────────────────────────────────────────────────────────────────┬────────────────────────────┬────────┤
   │ CONTROL ID        │ CONTROL NAME                                                     │ RULE LIST                  │ RESULT │
   ├───────────────────┼──────────────────────────────────────────────────────────────────┼────────────────────────────┼────────┤
   │ PS/PS.2/PS.2.1    │ Make software integrity verification information available to so │ - Image-verifiable (pass)  │ pass   │
   │                   │ ftware acquirers                                                 │                            │        │
   ├───────────────────┼──────────────────────────────────────────────────────────────────┼────────────────────────────┼────────┤
   │ PS/PS.3/PS.3.1    │ Securely archive the necessary files and supporting data to be r │ - Provenance exists (fail) │ fail   │
   │                   │ etained for each software release                                │                            │        │
   ├───────────────────┼──────────────────────────────────────────────────────────────────┼────────────────────────────┼────────┤
   │ PS/PS.3/PS.3.2    │ Collect, safeguard, maintain, and share provenance data for all  │ - SBOM archived (pass)     │ pass   │
   │                   │ components of each software release                              │                            │        │
   ├───────────────────┼──────────────────────────────────────────────────────────────────┼────────────────────────────┼────────┤
   │ INITIATIVE RESULT │                                                                  │                            │ FAIL   │
   └───────────────────┴──────────────────────────────────────────────────────────────────┴────────────────────────────┴────────┘
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
   ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
   │ [default] Control "Default" Evaluation Summary                                                                                                          │
   ├───────────────────────────────────┬───────────────────────────────────┬───────┬──────────┬────────┬────────────────────────────┬────────────────────────┤
   │ RULE ID                           │ RULE NAME                         │ LEVEL │ VERIFIED │ RESULT │ SUMMARY                    │ TARGET                 │
   ├───────────────────────────────────┼───────────────────────────────────┼───────┼──────────┼────────┼────────────────────────────┼────────────────────────┤
   │ sbom-require-complete-license-set │ Enforce SBOM License Completeness │ error │ false    │ pass   │ All packages have licenses │ busybox:1.36.1 (image) │
   ├───────────────────────────────────┼───────────────────────────────────┼───────┼──────────┼────────┼────────────────────────────┼────────────────────────┤
   │ CONTROL RESULT                    │                                   │       │          │ PASS   │                            │                        │
   └───────────────────────────────────┴───────────────────────────────────┴───────┴──────────┴────────┴────────────────────────────┴────────────────────────┘
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
INFO PS/PS.3/PS.3.1: Control "Securely archive the necessary files and supporting data to be retained for each software release" Evaluation Summary: 
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [PS/PS.3/PS.3.1] Control "Securely archive the necessary files and supporting data to be retained for each software  │
│ release" Evaluation Summary                                                                                          │
├───────────────────┬───────────────────┬───────┬──────────┬────────┬─────────────────────────┬────────────────────────┤
│ RULE ID           │ RULE NAME         │ LEVEL │ VERIFIED │ RESULT │ SUMMARY                 │ TARGET                 │
├───────────────────┼───────────────────┼───────┼──────────┼────────┼─────────────────────────┼────────────────────────┤
│ provenance-exists │ Provenance exists │ error │ false    │ fail   │ SLSA Provenance missing │ busybox:1.36.1 (image) │
├───────────────────┼───────────────────┼───────┼──────────┼────────┼─────────────────────────┼────────────────────────┤
│ CONTROL RESULT    │                   │       │          │ FAIL   │                         │                        │
└───────────────────┴───────────────────┴───────┴──────────┴────────┴─────────────────────────┴────────────────────────┘
INFO PS/PS.3/PS.3.2: Control "Collect, safeguard, maintain, and share provenance data for all components of each software release" Evaluation Summary: 
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [PS/PS.3/PS.3.2] Control "Collect, safeguard, maintain, and share provenance data for all components of each soft │
│ ware release" Evaluation Summary                                                                                  │
├────────────────┬───────────────┬───────┬──────────┬────────┬─────────────────────────────┬────────────────────────┤
│ RULE ID        │ RULE NAME     │ LEVEL │ VERIFIED │ RESULT │ SUMMARY                     │ TARGET                 │
├────────────────┼───────────────┼───────┼──────────┼────────┼─────────────────────────────┼────────────────────────┤
│ sbom-is-signed │ SBOM archived │ none  │ true     │ pass   │ Evidence signature verified │ busybox:1.36.1 (image) │
├────────────────┼───────────────┼───────┼──────────┼────────┼─────────────────────────────┼────────────────────────┤
│ CONTROL RESULT │               │       │          │ PASS   │                             │                        │
└────────────────┴───────────────┴───────┴──────────┴────────┴─────────────────────────────┴────────────────────────┘
INFO PS/PS.1/PS.1.1: Control "Store all forms of code based on the principle of least privilege" Evaluation Summary: 
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [PS/PS.1/PS.1.1] Control "Store all forms of code based on the principle of least privilege" Evaluation Summary                                                  │
├────────────────────┬────────────────────────────────┬───────┬──────────┬────────┬────────────────────────────────────────┬───────────────────────────────────────┤
│ RULE ID            │ RULE NAME                      │ LEVEL │ VERIFIED │ RESULT │ SUMMARY                                │ TARGET                                │
├────────────────────┼────────────────────────────────┼───────┼──────────┼────────┼────────────────────────────────────────┼───────────────────────────────────────┤
│ 2fa                │ Enforce 2FA                    │ error │ true     │ fail   │ 2FA authentication is NOT enabled      │ my-org (github organization)          │
├────────────────────┼────────────────────────────────┼───────┼──────────┼────────┼────────────────────────────────────────┼───────────────────────────────────────┤
│ branch-protection  │ Branch protected               │ error │ true     │ fail   │ 1 unprotected branches | 0 max allowed │ my-repo (github repo)                 │
├────────────────────┼────────────────────────────────┼───────┼──────────┼────────┼────────────────────────────────────────┼───────────────────────────────────────┤
│ max-admins         │ Limit admins                   │ error │ true     │ fail   │ 6 admins | 3 max allowed               │ my-org (github organization)          │
├────────────────────┼────────────────────────────────┼───────┼──────────┼────────┼────────────────────────────────────────┼───────────────────────────────────────┤
│ repo-is-private    │ Repo private                   │ none  │ true     │ pass   │ The repository is private              │ my-repo (github repo)                 │
├────────────────────┼────────────────────────────────┼───────┼──────────┼────────┼────────────────────────────────────────┼───────────────────────────────────────┤
│ web-commit-signoff │ Require signoff on web commits │ error │ true     │ fail   │ web_commit_signoff_required is NOT set │ my-org (github organization)          │
├────────────────────┼────────────────────────────────┼───────┼──────────┼────────┼────────────────────────────────────────┼───────────────────────────────────────┤
│ CONTROL RESULT     │                                │       │          │ FAIL   │                                        │                                       │
└────────────────────┴────────────────────────────────┴───────┴──────────┴────────┴────────────────────────────────────────┴───────────────────────────────────────┘
INFO PS/PS.2/PS.2.1: Control "Make software integrity verification information available to software acquirers" Evaluation Summary: 
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [PS/PS.2/PS.2.1] Control "Make software integrity verification information available to software acquirers" Evaluati │
│ on Summary                                                                                                           │
├────────────────┬──────────────────┬───────┬──────────┬────────┬─────────────────────────────┬────────────────────────┤
│ RULE ID        │ RULE NAME        │ LEVEL │ VERIFIED │ RESULT │ SUMMARY                     │ TARGET                 │
├────────────────┼──────────────────┼───────┼──────────┼────────┼─────────────────────────────┼────────────────────────┤
│ sbom-is-signed │ Image-verifiable │ none  │ true     │ pass   │ Evidence signature verified │ busybox:1.36.1 (image) │
├────────────────┼──────────────────┼───────┼──────────┼────────┼─────────────────────────────┼────────────────────────┤
│ CONTROL RESULT │                  │       │          │ PASS   │                             │                        │
└────────────────┴──────────────────┴───────┴──────────┴────────┴─────────────────────────────┴────────────────────────┘
INFO SSDF: Initiative "SSDF Client Initiative" Evaluation Summary: 
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [SSDF] Initiative "SSDF Client Initiative" Evaluation Summary                                                                           │
├───────────────────┬──────────────────────────────────────────────────────────────────┬─────────────────────────────────────────┬────────┤
│ CONTROL ID        │ CONTROL NAME                                                     │ RULE LIST                               │ RESULT │
├───────────────────┼──────────────────────────────────────────────────────────────────┼─────────────────────────────────────────┼────────┤
│ PS/PS.1/PS.1.1    │ Store all forms of code based on the principle of least privileg │ - Branch protected (fail),              │ fail   │
│                   │ e                                                                │ - Repo private (pass),                  │        │
│                   │                                                                  │ - Enforce 2FA (fail),                   │        │
│                   │                                                                  │ - Limit admins (fail),                  │        │
│                   │                                                                  │ - Require signoff on web commits (fail) │        │
├───────────────────┼──────────────────────────────────────────────────────────────────┼─────────────────────────────────────────┼────────┤
│ PS/PS.2/PS.2.1    │ Make software integrity verification information available to so │ - Image-verifiable (pass)               │ pass   │
│                   │ ftware acquirers                                                 │                                         │        │
├───────────────────┼──────────────────────────────────────────────────────────────────┼─────────────────────────────────────────┼────────┤
│ PS/PS.3/PS.3.1    │ Securely archive the necessary files and supporting data to be r │ - Provenance exists (fail)              │ fail   │
│                   │ etained for each software release                                │                                         │        │
├───────────────────┼──────────────────────────────────────────────────────────────────┼─────────────────────────────────────────┼────────┤
│ PS/PS.3/PS.3.2    │ Collect, safeguard, maintain, and share provenance data for all  │ - SBOM archived (pass)                  │ pass   │
│                   │ components of each software release                              │                                         │        │
├───────────────────┼──────────────────────────────────────────────────────────────────┼─────────────────────────────────────────┼────────┤
│ INITIATIVE RESULT │                                                                  │                                         │ FAIL   │
└───────────────────┴──────────────────────────────────────────────────────────────────┴─────────────────────────────────────────┴────────┘
```

</details>

In this case, no rule was disabled, and all of them were verified.

### Migration from an older version

Before initiatives were introduced in `valint v2.0.0`, a slightly different format of configs was used for the policy engine. Essentially, there were only `rule` and `policy` configs, so if you're using one of those, here's how you can migrate to the new format.

#### Rule configs migration

In general, older rule configs can be used in `valint v2.0.0` and newer with some minor changes. The main difference is that, from now on, `valint` requires each config to state its format. The only change needed is to add this line to your rule config:

```yaml
config-type: rule
```

After that, you can pass the rule config to `valint` using the same `--rule` flag as before.

#### Policy configs migration

Policy configs were deprecated in `valint v2.0.0`. Policies themselves were renamed to _controls_ and are now consumed as part of the _initiative_ config. The migration process is slightly more complex but still quite straightforward.

If you use a single policy config, you can copy it entirely under the `controls` key in the new initiative config. For example, if you have a policy config like this:

```yaml
name: "MyPolicy"
rules:
  - uses: images/blocklist-build-scripts@v1
    level: error
    with:
      blocklist:
      - "wget"
      - "curl"
```

then the new initiative config will look like this:

```yaml
config-type: "initiative"
name: "MyInitiative"
controls:
  - name: "MyControl"
    rules:
      - uses: images/blocklist-build-scripts@v1
        level: error
        with:
          blocklist:
          - "wget"
          - "curl"
```

If you use multiple policies at once, you can copy all of them under the `controls` key in the new initiative config.

The next important step is to ensure that the referenced rules work with the new `valint` version. If you use rules from the [Scribe Sample Catalog](#sample-policy-catalog), you only need to change the referenced rule version from `@v1` to `@v2`. If your rule is not listed in the updated catalog, please check whether it was renamed or moved to a different folder. As a result, the initiative configuration will look like this:

```yaml
config-type: "initiative"
name: "MyInitiative"
controls:
  - name: "MyControl"
    rules:
      - uses: images/blocklist-build-scripts@v2
        level: error
        with:
          blocklist:
          - "wget"
          - "curl"
```

This configuration can be passed to `valint` using the `--initiative` flag.

If you're using custom rules, update them as shown in the section above.

:::tip
Note that initiatives provide more flexibility and control over rules and controls than policies,
including smart filtering as shown in the [Rule Filtering](../valint/initiatives#rule-filtering) section. Depending on the scenario, it might be useful to place all controls in a single initiative and filter them by gate or target.
:::

:::note
Starting with `valint v2.0.0`, some initiatives are shipped as part of the Scribe Catalog. See [this section](#example) and [this section](#sample-policy-catalog) for more details.
:::

#### Example

Let's take SLSA L2 as an example. Prior to `valint v2.0.0`, one could verify a single SLSA L2 rule using the following command:

```bash
valint verify alpine:latest --rule slsa/l2-provenance-authenticated@v1 --product-key <PRODUCT_KEY> --product-version <PRODUCT_VERSION>
```

This command would verify the `alpine:latest` image against the `slsa/l2-provenance-authenticated` rule.

To run v2 of the same rule, you could simply replace `@v1` with `@v2` in the command shown above.
However, with the initiatives available, it is recommended to run the following command:

```bash
valint verify alpine:latest --initiative slsa.l2@v2 --product-key <PRODUCT_KEY> --product-version <PRODUCT_VERSION>
```

This command will verify the `alpine:latest` image against all rules in the SLSA L2 initiative, including `slsa/l2-provenance-authenticated`.

We recommend using the initiative configuration also for SLSA L1, as it provides better result descriptions and integration with the Scribe service.
In that case, the command will look like this:

```bash
valint verify alpine:latest --initiative slsa.l1@v2 --product-key <PRODUCT_KEY> --product-version <PRODUCT_VERSION>
```

To get more information about initiatives provided in the Scribe Policy Catalog, see the [Sample Policy Catalog](#sample-policy-catalog) section.

## Sample Policy Catalog

We provide a set of sample initiatives and rules that can be used to verify the compliance of your software supply chain. This catalog is used by `valint` by default.
To use a different version of this catalog, use the `--bundle-tag` valint flag.

To use a custom initiatives rule catalog, you can specify the path to the catalog in the `--bundle` flag (it may be a local path or a git repo). Additionally, `--bundle-branch` and `--bundle-tag` flags can be used to specify the branch or tag of the catalog git repo.

<!-- START TABLE -->
| Name | Description |
|------|-------------|
| [NIST Application Container Security Initiative](/docs/configuration/initiatives/sp-800-190.md) | This initiative enforces container security controls as outlined in  NIST SP 800-190. It ensures that containerized applications follow  security best practices, including vulnerability scanning, trusted  image sources, registry security, and proper configuration to minimize risk. The initiative enables policy-driven enforcement of security controls  throughout the software development lifecycle (SDLC), providing real-time  feedback to developers and enforcement in CI/CD pipelines. |
| [NIST Supply Chain Integrity Initiative](/docs/configuration/initiatives/sp-800-53.md) | This initiative enforces key supply chain requirements from NIST SP 800-53. It mandates that container builds include:   - A Software Bill of Materials (SBOM) to ensure component inventory and traceability,     addressing requirements from SR-4 and CM-8.   - Provenance data to support architectural traceability, as outlined in SA-8. Both the SBOM and the provenance artifacts must be cryptographically signed to meet integrity requirements specified in SA-12. |
| [SLSA L1 Framework](/docs/configuration/initiatives/slsa.l1.md) | Evaluate SLSA Level 1 |
| [SLSA L2 Framework](/docs/configuration/initiatives/slsa.l2.md) | Evaluate SLSA Level 2 |
| [SSDF Client Initiative](/docs/configuration/initiatives/ssdf.md) | Evaluate PS rules from the SSDF initiative |
| [Secure Software Pipeline Blueprint](/docs/configuration/initiatives/sspb.md) | Blueprint for secure pipelines - Gitlab |

## Rules

### SBOM

**Evidence Type:** [SBOM](/docs/valint/sbom)

| Rule Name | Description |
|-----------|-------------|
| [Apply Scribe Template Policy](/docs/configuration/initiatives/rules/api/scribe-api.md) | Verify XX using the Scribe API template rule. |
| [Scribe Published Policy](/docs/configuration/initiatives/rules/api/scribe-api-published.md) | Verify image Scribe Publish flag is set for container image. |
| [NTIA SBOM Compliance Check](/docs/configuration/initiatives/rules/sbom/NTIA-compliance.md) | Validates that SBOM metadata meets basic NTIA requirements for authors and supplier. |
| [Enforce SBOM Freshness](/docs/configuration/initiatives/rules/sbom/fresh-sbom.md) | Verify the SBOM is not older than the specified duration. |
| [Require SBOM Existence](/docs/configuration/initiatives/rules/sbom/evidence-exists.md) | Verify the SBOM exists as evidence. |
| [Require SBOM Signature](/docs/configuration/initiatives/rules/sbom/artifact-signed.md) | Verify the SBOM is signed. |
| [Require SBOM Existence](/docs/configuration/initiatives/rules/sbom/require-sbom.md) | Verify the SBOM exists as evidence. |

### Image SBOM

**Evidence Type:** [Image SBOM](/docs/valint/sbom)

| Rule Name | Description |
|-----------|-------------|
| [Verify File Integrity](/docs/configuration/initiatives/rules/multievidence/files_integrity.md) | Verify the checksum of each file in one SBOM matches the checksum in a second SBOM. |
| [Verify Image Labels](/docs/configuration/initiatives/rules/images/verify-labels.md) | Verify specified labels key-value pairs exist in the image. |
| [Forbid Large Images](/docs/configuration/initiatives/rules/images/forbid-large-images.md) | Verify the image size is below the specified threshold. |
| [Disallow Container Shell Entrypoint](/docs/configuration/initiatives/rules/images/restrict-shell-entrypoint.md) | Verify the container image disallows shell entrypoint. |
| [Fresh Base Image](/docs/configuration/initiatives/rules/images/fresh-base-image.md) | Verifies that each base image is not older than the specified threshold (max_days) from its creation date. |
| [Banned Ports](/docs/configuration/initiatives/rules/images/banned-ports.md) | Ensures that the container image does not expose ports that are disallowed by organizational policy. The rule examines properties in the SBOM metadata and checks each value (expected in the format "port/protocol") against a provided banned ports list. It fails if any banned port is exposed or if no banned ports list is provided. |
| [Disallow Specific Users in SBOM](/docs/configuration/initiatives/rules/images/banned-users.md) | Verify specific users are not allowed in an SBOM. |
| [Restrict Build Scripts](/docs/configuration/initiatives/rules/images/blocklist-build-scripts.md) | Verify no build scripts commands appear in block list. |
| [Registry Connection HTTPS](/docs/configuration/initiatives/rules/images/enforce-https-registry.md) | Checks if the container's registry scheme is HTTPS |
| [Require Image Labels](/docs/configuration/initiatives/rules/images/verify-labels-exist.md) | Verify the image has the specified labels. |
| [Require Healthcheck](/docs/configuration/initiatives/rules/images/require-healthcheck.md) | Checks that the container image includes at least one healthcheck property. |
| [Allowed Base Image](/docs/configuration/initiatives/rules/images/allowed-base-image.md) | Verifies that every base image is from an approved source. The rule returns a summary including the component names and versions of valid base images, or lists the invalid ones. This rule requires Dockerfile context; for example, run it with: `valint my_image --base-image Dockerfile`. |
| [Fresh Image](/docs/configuration/initiatives/rules/images/fresh-image.md) | Verify the image is not older than the specified threshold. |
| [Allowed Main Image Source](/docs/configuration/initiatives/rules/images/allowed-image-source.md) | Ensures the main container image referenced in the SBOM is from an approved source. |
| [Require Signed Container Image](/docs/configuration/initiatives/rules/images/image-signed.md) | Enforces that container images (target_type=container) are cryptographically signed. |
| [Verify No Critical or High Vulnerabilities](/docs/configuration/initiatives/rules/api/scribe-api-cve.md) | Verify via Scribe API that there are no critical or high severity vulnerabilities in the target artifact (container image, folder, etc.). |
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
| [Verify secret scanning.](/docs/configuration/initiatives/rules/github/repository/validity-checks.md) | Verify both `secret_scanning_validity_checks` and `security_and_analysis` are set in GitHub organization and all the repositories. |
| [Verify Dependabot security updates setting](/docs/configuration/initiatives/rules/github/repository/dependabot.md) | Verify Dependabot security updates are configured in the GitHub repository. |
| [Verify Repository Is Private](/docs/configuration/initiatives/rules/github/repository/repo-private.md) | Verify the GitHub repository is private. |
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
| [Verify Only Ephemeral Runners Exist in Repository](/docs/configuration/initiatives/rules/github/repository/ephemeral-runners-only.md) | Verify self-hosted runners are disallowed in the GitHub repository. |
| [Allowed Public Repositories](/docs/configuration/initiatives/rules/github/repository/visibility.md) | Verify only GitHub repositories in the Allowed List are public. |
| [Verify Push Protection Setting](/docs/configuration/initiatives/rules/github/repository/push-protection.md) | Verify `secret_scanning_push_protection` is configured in the GitHub repository. |

### Gitlab Organization Discovery Evidence

**Evidence Type:** [Gitlab Organization Discovery Evidence](/docs/platforms/discover#gitlab-discovery)

| Rule Name | Description |
|-----------|-------------|
| [Limit Admins in GitLab Organization](/docs/configuration/initiatives/rules/gitlab/org/max-admins.md) | Verify the maximum number of admins for the GitLab project is restricted. |
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
| [Allowed Namespaces](/docs/configuration/initiatives/rules/k8s/namespace/white-listed-namespaces.md) | Verify only namespaces specified in the Allowed List are allowed within the cluster. |
| [Verify Namespace Runtime Duration](/docs/configuration/initiatives/rules/k8s/namespace/verify-namespace-duration.md) | Verify Kubernetes namespaces adhere to a specified runtime duration to enforce lifecycle limits. |
| [Allowed Namespace Registries](/docs/configuration/initiatives/rules/k8s/namespace/allowed-registries.md) | Verify container images in Kubernetes namespaces originate from registries in the Allowed List. |
| [Allowed Pods in Namespace](/docs/configuration/initiatives/rules/k8s/namespace/white-listed-pod.md) | Verify only pods explicitly listed in the Allowed List run within a Kubernetes namespace. |

### K8s Pod Discovery Evidence

**Evidence Type:** [K8s Pod Discovery Evidence](/docs/platforms/discover#k8s-discovery)

| Rule Name | Description |
|-----------|-------------|
| [Verify Pod Runtime Duration](/docs/configuration/initiatives/rules/k8s/pods/verify-pod-duration.md) | Verify Kubernetes pods adhere to a specified runtime duration to enforce lifecycle limits. |
| [Verify Pod Termination](/docs/configuration/initiatives/rules/k8s/pods/verify-pod-termination.md) | Verify Kubernetes pods are properly terminated to prevent lingering resources and maintain cluster hygiene. |
| [Allowed Pods](/docs/configuration/initiatives/rules/k8s/pods/white-listed-pod.md) | Verify only pods explicitly listed in the Allowed List are allowed to run. |

### Bitbucket Project Discovery Evidence

**Evidence Type:** [Bitbucket Project Discovery Evidence](/docs/platforms/discover#bitbucket-discovery)

| Rule Name | Description |
|-----------|-------------|
| [Prevent Long-Lived Tokens](/docs/configuration/initiatives/rules/bitbucket/project/long-live-tokens.md) | Verify Bitbucket API tokens expire before the maximum time to live. |
| [Allowed Project Admins](/docs/configuration/initiatives/rules/bitbucket/project/allow-admins.md) | Verify only users specified in the Allowed List have admin privileges in the Bitbucket project. |
| [Allowed Project Users](/docs/configuration/initiatives/rules/bitbucket/project/allow-users.md) | Verify only users specified in the Allowed List have user access to the Bitbucket project. |
| [Prevent Credential Exposure](/docs/configuration/initiatives/rules/bitbucket/project/exposed-credentials.md) | Verify access to the Bitbucket project is blocked if exposed credentials are detected. |

### Bitbucket Repository Discovery Evidence

**Evidence Type:** [Bitbucket Repository Discovery Evidence](/docs/platforms/discover#bitbucket-discovery)

| Rule Name | Description |
|-----------|-------------|
| [Allowed Repository Admins](/docs/configuration/initiatives/rules/bitbucket/repository/allow-admins.md) | Verify only users specified in the Allowed List have admin privileges in the Bitbucket repository. |
| [Verify Default Branch Protection Setting Is Configured](/docs/configuration/initiatives/rules/bitbucket/repository/branch-protection.md) | Verify the default branch protection is enabled in the Bitbucket repository. |
| [Allowed Repository Users](/docs/configuration/initiatives/rules/bitbucket/repository/allow-users.md) | Verify only users specified in the Allowed List have user access to the Bitbucket repository. |

### Bitbucket Workspace Discovery Evidence

**Evidence Type:** [Bitbucket Workspace Discovery Evidence](/docs/platforms/discover#bitbucket-discovery)

| Rule Name | Description |
|-----------|-------------|
| [Allowed Workspace Admins](/docs/configuration/initiatives/rules/bitbucket/workspace/allow-admins.md) | Verify only users specified in the Allowed List have admin privileges in the Bitbucket workspace. |
| [Allowed Workspace Users](/docs/configuration/initiatives/rules/bitbucket/workspace/allow-users.md) | Verify only users specified in the Allowed List have user access to the Bitbucket workspace. |

### Discovery Evidence

**Evidence Type:** [Discovery Evidence](/docs/platforms/discover)

| Rule Name | Description |
|-----------|-------------|
| [Verify GitLab Pipeline Labels](/docs/configuration/initiatives/rules/gitlab/pipeline/verify-labels.md) | Verify the pipeline includes all required label keys and values. |
| [GitLab pipeline verify labels exist](/docs/configuration/initiatives/rules/gitlab/pipeline/verify-labels-exist.md) | Verify the pipeline has all required label keys and values. |
| [Verify Exposed Credentials](/docs/configuration/initiatives/rules/jenkins/folder/exposed-credentials.md) | Verify there are no exposed credentials. |

### Dockerhub Project Discovery Evidence

**Evidence Type:** [Dockerhub Project Discovery Evidence](/docs/platforms/discover#dockerhub-discovery)

| Rule Name | Description |
|-----------|-------------|
| [Verify DockerHub Tokens are Active](/docs/configuration/initiatives/rules/dockerhub/token-expiration.md) | Verify that all discovered Dockerhub tokens are set to Active in Dockerhub. |
| [Verify no unused Dockerhub](/docs/configuration/initiatives/rules/dockerhub/token-not-used.md) | Verify that there are no unused Dockerhub. |

### Jenkins Instance Discovery Evidence

**Evidence Type:** [Jenkins Instance Discovery Evidence](/docs/platforms/discover#jenkins-discovery)

| Rule Name | Description |
|-----------|-------------|
| [Disallow Unused Users](/docs/configuration/initiatives/rules/jenkins/instance/unused-users.md) | Verify there are no users with zero activity. |
| [Verify Inactive Users](/docs/configuration/initiatives/rules/jenkins/instance/inactive-users.md) | Verify there are no inactive users. |

### SLSA Provenance

**Evidence Type:** [SLSA Provenance](/docs/valint/help/valint_slsa)

| Rule Name | Description |
|-----------|-------------|
| [SLSA External Parameters Match in Provenance Document](/docs/configuration/initiatives/rules/slsa/verify-external-parameters.md) | Verify the specified exterenal parameters value match in the provenance document. |
| [Verify that provenance is authenticated](/docs/configuration/initiatives/rules/slsa/l2-provenance-authenticated.md) | Verify the artifact is signed. |
| [SLSA Field Exists in Provenance Document](/docs/configuration/initiatives/rules/slsa/field-exists.md) | Verify the specified field exists in the provenance document. |
| [Verify Provenance Document Exists](/docs/configuration/initiatives/rules/slsa/l1-provenance-exists.md) | Verify that the Provenance document evidence exists. |
| [Disallow dependencies in SLSA Provenance Document](/docs/configuration/initiatives/rules/slsa/banned-builder-deps.md) | Verify that dependencies in the block list do not appear in the SLSA Proveance document. |
| [Verify build time](/docs/configuration/initiatives/rules/slsa/build-time.md) | Verify the artifact was created within the specified time window. |
| [Verify that artifact was created by the specified builder](/docs/configuration/initiatives/rules/slsa/verify-builder.md) | Verify the artifact was created by the specified builder. |
| [Verify that artifact has no disallowed builder dependencies](/docs/configuration/initiatives/rules/slsa/verify-byproducts.md) | Verify the artifact has no disallowed builder dependencies. |
| [SLSA Field Value Matches in Provenance Document](/docs/configuration/initiatives/rules/slsa/verify-custom-fields.md) | Verify the specified field value matches in the provenance document. |

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
| [Verify No Critical or High Vulnerabilities in Product](/docs/configuration/initiatives/rules/api/scribe-api-cve-product.md) | Verify via Scribe API that there are no critical or high severity vulnerabilities in any deliverable component of the product. |

<!-- END TABLE -->

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
