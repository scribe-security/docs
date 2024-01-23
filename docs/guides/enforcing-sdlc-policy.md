---
sidebar_label: "Applying Policies to your SDLC"
title: Applying Policies to your SDLC
sidebar_position: 3
toc_min_heading_level: 2
toc_max_heading_level: 5
---

You can use Scribe to apply policies at different points along your SDLC. For example, at the end of a build or at the admission control point to the production cluster. Use cases for example:

* Images must be signed and have a matching CycloneDX SBOM.
* Images must be built by a CircleCI workflow and produce a signed SLSA provenance.
* Tagged sources must be signed and verified by a set of individuals or processes.
* Released binaries must be built by Azure DevOps on a specific git repository using unsigned SLSA provenance.

### Policies and Policy Rules

A `policy` consists of a set of `rules` and is verified if all of them are evaluated and verified. A `rule` is verified if ANY `evidence` is found that complies with the `rule` configuration and setting.

#### Usage

Policies are configured as part of Valint configuration file, under the `policies` section.

```yaml
attest:
  cocosign:
    policies:  # Set of policies - grouping rules
      - name: <policy_name>
        rules: # Set of rule settings/configuration and input
          - name: <rule_name>
            path: <rule_path> # Specify if an external script is used
            description: "A brief rule description"
            labels: [] # list of user-specified labels
            initiatives: [] # list of related initatives, like SLSA, SSDF, etc.
            evidence: #Evidence lookup parameters
              signed: false
              format-type: <format-type>
              filter-by: [] # A group of Context fields to use for the evidence lookup
            with:  {} # rule input, depending on the rule type
```

For configuration details, see the **[configuration](../integrating-scribe/valint/configuration)** section.
For PKI configuration, see the **[attestations](../guides/securing-builds)** section.

The Policy supports the following fields:

* `disable`, disable rule (default false).
* `name`, policy name (**required**).
* `rules`, list of policy rule configuration.

A rule is a compliance check that you can configure to your specific organization's requirements.

* `disable`, disable rule (default _false_).
* `name`, policy rule name (**required**).
* `type`, type of the rule, currently supporting only `verify-artifact`.
* `description`, rule description (_optional_).
* `labels`, list of user-specified labels (_optional_).
* `initiatives`, list of related initiatives, like SLSA, SSDF, etc. (_optional_).
* `path`, path to a custom rule script **OR** `script`, embedded rule script.
* `script-lang` script language, currently only `rego` is supported.
* `evidence`, match on evidence with a specified parameters.
* `with`, rule-specific configuration parameters.

For `evidence` details, see the **[Policies](../guides/enforcing-sdlc-policy#context-match-fields)** section For `with` details, see related rule section.

### Verify Artifact rule​

The Verify Artifact rule enforces a set of requirements on who produced artifacts across your supply chain as well as what information should be collected on each artifact. In other words, it ensures produced artifacts' (`targets`) integrity by checking the expected evidence, signatures, and origin in your supply chain.

* Signed Evidence: The artifact should include signed or unsigned evidence, as specified by the `signed` field in the input.
* Signing Identity: The artifact should be signed by a specific identity, as specified by the `identity` fields in the input (for signed evidence).
* Evidence Format: The evidence format should follow the specified format(s) either in the `format-type` or `format` field of the input.
* Origin of artifact: The artifact should originate from an expected source, as specified by the `evidence` **[origin labels](../guides/enforcing-sdlc-policy#context-match-fields)**. For instance, you can verify that an artifact is generated from a particular pipeline or repository.
* Artifact details: The rule applies to a specific artifact or any group of artifacts, as specified by the `evidence` **[subject labels](../guides/enforcing-sdlc-policy#context-match-fields)**.
* Policy as code: The rule allows extension of the verification using custom scripts, as specified by the `rego` input.

#### Configuration​

```yaml
- name: "" # Any user provided name
  evidence:
    signed: <true|false> # Should target be signed
    format-type: <cyclonedx-json, slsa> # Expected evidence format
    filter-by: [<product, pipeline, target, none>] # A group of Context fields to use for the evidence lookup
    {environment-context} # Any origin or subject fields used by
  with:
    identity:
      emails: [] # Signed email identities 
      uris: [] # Signed URIs identities 
      common-names: [] # Signed common name identities
    {custom script input} # Any rule-specific input
  path: <path to policy script>
  script: |
    # embedded policy script
    package verify

    verify = v {
        v := {
          "allow": {Custom policy validation}
        }
    }
```

### Examples

Copy the Examples into a file named `.valint.yaml` in the same directory as running Valint commands.

> For configuration details, see the **[configuration](../integrating-scribe/valint/configuration)** section.

<details>
  <summary> Signed Images policy </summary>
In this example, the policy rule named `signed_image` will evaluate images where signed by `mycompony.com` using `attest-cyclondex-json` format.

```yaml
attest:
  cocosign:
    policies:
      - name: my_policy
        rules:
          - name: signed_image
            evidence:
              signed: true
              format-type: cyclonedx
              target_type: image
            with:
              identity:
                common-names:
                  - mycompany.com
```

**Command:**  
Run the command on the required supply chain location.

```bash
# Generate required evidence, requires signing capabilities.
valint bom busybox:latest -o attest

# Verify policy (cache store)
valint verify busybox:latest
```

</details>

<details>
  <summary> Image SLSA provenance policy </summary>
In this example, the policy rule named `slsa_prov_rule` will evaluate images where signed by `bob@mycompany.com` or `alice@mycompany.com` using `attest-slsa` format.

```yaml
attest:
  cocosign:
    policies:
      - name: my_policy
        rules:
          - name: slsa_prov_rule
            evidence:
              signed: true
              format-type: slsa
              target_type: image
            with:
              identity:
                emails:
                  - bob@mycompany.com
                  - alice@mycompany.com
```

***Command:**  
Run the command on the required supply chain location.

```bash
# Generate required evidence, requires signing capabilities.
valint bom busybox:latest -o attest-slsa

# Verify policy (cache store)
valint verify busybox:latest
```

</details>

<details>
  <summary> Signed tagged sourced rule </summary>
In this example, the policy rule named "tagged_git_rule" will evaluate sources' `mycompany/somerepo` tags where defined in the `main` branch and signed by `bob@mycompany.com`.

> The policy requires only the **HEAD** of the git target to comply to the policy not the entire history.

```yaml
attest:
  cocosign:
    policies:
      - name: my_policy
        rules:
          - name: tagged_git_rule
            evidence:
              signed: true
              format-type: slsa
              target_type: git
              target_git_url: git@github.com:mycompany/somerepo.git # Git url of the target.
              branch: main
            with:
              identity:
                emails:
                - bob@mycompany.com
```

***Command:**  
Run the command on the required supply chain location.

```bash
# Generate required evidence, requires signing capabilities.
valint bom git:github.com:your_org/your_repo.git --tag 0.1.3 -o attest-slsa

# Verify policy (cache store)
valint verify git:github.com:your_org/your_repo.git --tag 0.1.3 -i statement-slsa
```

</details>

<details>
  <summary> Binary verification </summary>
In this example, the policy, named "binary_rule" enforces requirements on the binary `my_binary.exe` was Originated from which Azure DevOps triggered by the `https://dev.azure.com/mycompany/somerepo` repo.
The policy rule also enforces an unsigned SLSA provenance statement is produced as evidence.

```yaml
attest:
  cocosign:
    policies:
      - name: my_policy
        rules:
          - name: binary_rule
            evidence:
              signed: false
              format-type: slsa
              target_type: file
              context_type: azure
              git_url: https://dev.azure.com/mycompany/somerepo # Git url of the environment.
              input_name: my_binary.exe
```

***Command:**  
Run the command on the required supply chain location.

```bash
# Generate required evidence
valint bom file:my_binary.exe -o statement-slsa

# Verify policy (cache store)
valint verify file:my_binary.exe
```

</details>

<details>
  <summary> 3rd party verification </summary>
In this example, the policy rule named "3rd-party-scan" will evaluate scanned `3rd-party-scan.json` file, Originated from Azure DevOps triggered by the `https://dev.azure.com/mycompany/somerepo` and signed by `bob@mycompany.com`.

```yaml
attest:
  cocosign:
    policies:
      - name: my_policy
        rules:
          - name: 3rd-party-rule
            evidence:
              signed: true
              format-type: generic
              target_type: generic
              context_type: azure
              git_url: https://dev.azure.com/mycompany/somerepo
              git_branch: main
              input_name: 3rd-party-scan.json
            with:
              identity:
                emails:
                - bob@mycompany.com
```

***Command:**  
Run the command on the required supply chain location.

```bash
# Generate required evidence
valint bom 3rd-party-scan.json -o attest-generic --predicate-type https://scanner.com/scan_format

# Verify policy (cache store)
valint verify 3rd-party-scan.json -i attest-generic --predicate-type https://scanner.com/scan_format
```

</details>

You can define custom policies for artifacts verified by the rule by attaching them as code. After the rule enforces the origin and subject of the evidence, you can further analyze and customize the content to meet your organization's requirements.

##### Usage

Rule verifies the predicate of the evidence in a custom Rego script embedded in the policy.

```yaml
- name: signed_image_custom_policy
  evidence:
    signed: true
    format-type: cyclonedx
    target_type: image
  with:
    identity:
      common-names:
        - mycompany.com
    script: |
      package verify
      default allow = false
      verify = {
        "allow": allow
      }

      allow = {
        input.evidence.predicate-type == "https://cyclonedx.org/bom"
      }
```

### Policy As Code​

#### Rego script​

In order to add a verification script you must provide a `verify` rule in your script. A Rego script can be provided in two forms: as an embedded code snippet in the `rego` section or as a dedicated file using the `path` field.

By default `valint` looks for a `.valint.rego` file.

Use the following rule structure.

```bash
package verify
default allow = false

verify = {
    "allow": false,
    "violation": {
      "type": "violation_type",
      "details": [],
    },
    "summary": [{
      "allow": false,
      "violations": count(violations),
      "reason": "some reason string"
    }],
}
```

#### Input structure​

Script input has the following structure.

```yaml
evidence: {Intoto-statment}
verifier: {verifier-context}
config:
args: {custom script input}
stores:
   oci: {OCI store configuration}
   cache: {Cache store configuration}
   scribe: {Scribe store configuration}
```

When using Signed Attestations, the Custom Rego script receives the raw In-toto statement along with the identity of the signer.

#### Output structure​

Script output must provide the following structure.

```json
{
  "allow": bool, # Required
  "summary": [ # Optional
    {
      "allow": bool,
      "type": "string",
      "details": "string",
      "violations": "int",
      "reason": "string"
    },
  ],
  "errors": [], # Optional
  "violation": [ # Optional
    {
        "type": "string",
        "details": [{}],
    },
  ]
}
```

### Examples

Copy the Examples into a file named `.valint.yaml` and Copy Examples custom script into file name `.valint.rego`. Files should be in the same directory as running Valint commands. 

> For configuration details, see the **[configuration](../integrating-scribe/valint/configuration)** section. You may also use `path` field to set a custom path for your script.

<details>
  <summary> Custom package policy </summary>
In this example, the policy rule named `custom-package-policy` to verify a custom package requirements.
In the example Alpine packages are forbidden.

```yaml
attest:
  cocosign:
    policies:
      - name: my_policy
        rules:
          - name: signed_image
            evidence:
              signed: true
              format-type: cyclonedx
              target_type: image
            script: |
              package verify
              import data.policies.sbom_parser as parser
              default allow = false

              verify = v {
                v := {
                  "allow": allow,
                  "violation": violation(input.evidence.predicate.bom.components),
                }
              }

              allow {
                v := violation(input.evidence.predicate.bom.components)
                count(v) == 0
                input.evidence.predicateType == "https://cyclonedx.org/bom"
              }

              violation(components) = v {
                v := { x |
                      some i
                      comp := components[i]
                      comp.type == "library"
                      comp.group == "apk"
                      x := comp["purl"]
                  }
              }
```

**Command:**  
Run the command on the required supply chain location.

```bash
# Generate required evidence, requires signing capabilities.
valint bom busybox:latest -o attest

# Verify policy (cache store)
valint verify busybox:latest
```

</details>

### Default policy​

When no policy configuration is found, the signed artifact policy is used.

By default, the following command runs a signature and identity verification on the target provided:

```bash
valint verify [target] --input-format [attest, attest-slsa] \
   --email [email] --common-name <common name> --uri [uri]
```

In other words, the Signed Artifact policy allows you to verify signature compliance and format of artifacts in your supply chain.  

For full command details, see **[Valint verify](../integrating-scribe/valint/help/valint_verify)** command.

<details>
  <summary> Default Policy Evaluation </summary>
The default policy can also be evaluated as the following policy configuration:

```yaml
attest:
  cocosign:
  policies:
  - name: default-policy
    rules:
      name: "default-rule"
      evidence:
        signed: true
        format: ${current.content_type} # Populated by --input-format flag.
        sbomversion: ${current.sbomversion> # Populated from the artifact version provided to verify command.
      with:
        identity: # Populated by `--email`, `--uri` and `--common-name flags sets
```

> For rule details, see **[verify artifact rule](#verify-artifact-rule)** section.

</details>

## Context match fields

Context match fields is a set of labels supported by all rules.
These labels add requirements on the origin or the subject of the provided evidence considered for compliance.

Using these fields allows you to set different compliance requirements for different layers of your supply chain.
<!-- For full label fields list see **[environment-context](https://tbd)** section. -->

#### Usage

Here's an example of usage: If you want to evaluate images named myorg/myimage:latest, you may set the rule with the following labels:

```yaml
evidence:
   sbomgroup: image
   sbomname: myorg/myimage:latest
```

If you also add `context_type: github` label, it requires the origin of the evidence to be generated by a Github.
If you also add `git_url: github.com/my_org/myimage.git`, it requires the evidence to be collected from a pipeline on a specific repo.
