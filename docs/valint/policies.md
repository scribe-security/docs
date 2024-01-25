---
sidebar_label: "Applying policies"
title: Applying policies
author: mikey strauss - Scribe
sidebar_position: 5
date: April 5, 2021
geometry: margin=2cm
---

# Policies

Each `policy` proposes to enforce a set of requirements (aka `rules`) your supply chain must comply with. The outcome of a policy evaluation is a policy result attestation, a report that details the rule evaluatoin results and references to the provided evidence.  
Policy configuration can be set under the main configuration `policies` section.

A `policy` consists of a set of `rules` and is verified if all of them are evaluated and verified.
A `rule` is verified if ANY `evidence` is found that complies with the `rule` configuration and setting.

### Usage

Policies are configured as part of Valint configuration file, under the `policies` section.

```yaml
attest:
  cocosign:
    policies:  # Set of policies - grouping rules
      - name: <policy_name>
        rules: # Set of rule settings/configuration and input
          - name: "<rule_name>"
            path: "<rule_path>" # Specify if an external script is used
            description: "A brief rule description"
            labels: [] # list of user-specified labels
            initiatives: [] # list of related initatives, like SLSA, SSDF, etc.
            evidence: #Evidence lookup parameters
              signed: false
              format-type: <format-type>
              filter-by: [] # A group of Context fields to use for the evidence lookup
            with:  {} # rule input, depending on the rule type
```

> For configuration details, see the [configuration](configuration) section.

> For PKI configuration, see the [attestations](attestations) section.

### Policy

Policy support the following fields:

* `disable`, disable rule (default _false_).
* `name`, policy name (**required**).
* `rules`, list of policy rule configuration.

# Policy rules

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

> For `evidence` details, see [Policies](#context-match-fields) section.  
> For `with` details, see related rule section.

## Verify Artifact rule type

---
A rule of Verify Artifact type verifies some properties of an artifact. Examples of such checks are:

* Signed Evidence: The artifact should include signed or unsigned evidence, as specified by the `signed` field in the input.
* Signing Identity: The artifact should be signed by a specific identity, as specified by the `identity` fields in the input (for signed evidence).
* Evidence Format: The evidence format should follow the specified format(s) provided in the `format-type` field of the input.
* Origin of artifact: The artifact should originate from an expected source, as specified by the `evidence` [origin labels](##origin-context).
For instance, you can verify that an artifact is generated from a particular pipeline or repository.
* Artifact details: The rule applies to a specific artifact or any group of artifacts, as specified by the `evidence` [subject labels](##subject-context).
* Policy as code: The rule allows extension of the verification using custom scripts, as specified by the `path` or `script` input.

### Use cases

A rule of `verify-artifact` type can be used to enforce compliance with specific supply chain requirements, such as:

* Images must be signed and have a matching CycloneDX SBOM.
* Images must be built by a CircleCI workflow and produce a signed SLSA provenance.
* Tagged sources must be signed and verified by a set of individuals or processes.
* Released binaries must be built by Azure DevOps on a specific git repository using unsigned SLSA provenance.

### Configuration

```yaml
- name: "" # Any user provided name
  evidence:
    signed: <true|false> # Should target be signed
    format-type: "<cyclonedx-json, slsa>" # Expected evidence format
    filter-by: [<product, pipeline, target, none>] # A group of Context fields to use for the evidence lookup
    {environment-context} # Any origin or subject fields used by
  with:
    identity:
      emails: [] # Signed email identities 
      uris: [] # Signed URIs identities 
      common-names: [] # Signed common name identities
    {custom script input} # Any rule-specific input
  path: <path to policy script>
  script-lang: rego # Currently only rego is supported
  script: |
    package verify

    verify = v {
        v := {
          "allow": {Custom policy validation}
        }
    }
```

### Examples

Copy the Examples into a file named `.valint.yaml` in the same directory as running Valint commands.

> For configuration details, see [configuration](configuration) section.

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
In this example, the policy, named "binary_origin" enforces requirements on the binary `my_binary.exe` was Originated from which Azure DevOps triggered by the `https://dev.azure.com/mycompany/somerepo` repo.
The policy rule also enforces an unsigned SLSA provenance statement is produced as evidence.

```yaml
attest:
  cocosign:
    policies:
      - name: my_policy
        rules:
          - name: binary_origin
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
valint evidence 3rd-party-scan.json -o attest --predicate-type https://scanner.com/scan_format

# Verify policy (cache store)
valint verify 3rd-party-scan.json -i attest-generic --predicate-type https://scanner.com/scan_format
```

</details>

### Policy as Code

You can define custom policies for artifacts verified by the rule by attaching them as code. After the rule enforces the origin and subject of the evidence, you can further analyze and customize the content to meet your organization's requirements.

### Usage

The following rule verifies the predicate of the evidence in a custom Rego script embedded in the policy.

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

#### Rego script

In order to add a verification script you must provide a `verify` rule in your script.
A Rego script can be provided in two forms: as an embedded code snippet in the `script` section or as a dedicated file using the `path` field.

> By default `valint` looks for a `.valint.rego` file.

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

#### Input structure

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

> When using Signed Attestations, the Custom Rego script receives the raw In-toto statement along with the identity of the signer.

#### Output structure

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

Copy the Examples into a file named `.valint.yaml` and Copy Examples custom script into file name `.valint.rego`.
Files should be in the same directory as running Valint commands.

> For configuration details, see [configuration](configuration) section.
> You may also use `path` field to set a custom path for your script.


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

## Default policy

When no policy configuration is found, the signed artifact policy is used.

By default, the following command runs a signature and identity verification on the target provided:

```bash
valint verify [target] --input-format [attest, attest-slsa] \
   --email [email] --common-name <common name> --uri [uri]
```

In other words, the Signed Artifact policy allows you to verify signature compliance and format of artifacts in your supply chain.

> For full command details, see [valint verify](#evidence-verification---verify-command) section.

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
        sbomversion: ${current.sbomversion} # Populated from the artifact version provided to verify command.
      with:
        identity: # Populated by `--email`, `--uri` and `--common-name flags sets
```

> For rule details, see [verify artifact rule](#verify-artifact-rule) section.

</details>

## Templating policy params

The template engine for policy configuration provides users with a flexible mechanism to define and customize policies through the use of template arguments. These template arguments act as placeholders within the policy configuration, allowing users to dynamically substitute values before the policy is evaluated.

Currently `valint` supports three groups of template arguments:

1. Context-defined  
Context arguments are derived from the evidence context, enabling users to directly reference any field within it. The syntax for referencing a context variable is as follows: `{{ .Context.<var_name> }}`.  
Replace `<var_name>` with the specific variable name from the evidence context that you want to use. Foe example, `{{ .Context.git_commit }}`.

2. Environment-defined  
Environment arguments are derived from the environment variables. The syntax for referencing an environment variable is as follows: `{{ .Env.<var_name> }}`.

3. User-defined  
Users can pass custom arguments through the command line using the `--policy-args` flag. These user-defined arguments are then referenced in the policy configuration using the following syntax: `{{ .Args.<var_name> }}`.

For example,

```bash
valint verify git:repo.git --policy-args "my_arg"="foo"
```

In the policy configuration: `{{ .Args.my_arg }}`.

***Replacement and Error Handling***

Before a policy is evaluated, template engine performs a substitution of templated arguments with the corresponding values.
If the replacement process encounters an issue, such as no value provided for a variable used by the configuration, an error is issued and policy evaluation is halted.

<details>
  <summary> Usage </summary>

This example demonstrates the use of template arguments in a policy configuration. The policy requires that the evidence is generated from a specific git repository and branch. The git repository and branch should beare passed as arguments to the policy using the `--policy-args` flag as `--policy-args git_url=<url> --policy-args git_branch=<branch>`. The target_type is passed as a field from the evidence context.

```yaml
attest:
  cocosign:
    policies:
      - name: my_policy
        rules:
          - name: my_rule
            with:
              signed: true
              format-type: cyclonedx
              target_type: '{{ .Context.target_type }}'
              git_url: '{{ .Args.git_url }}'
              git_branch: '{{ .Args.git_branch }}'
```

</details>

## Evidence Lookup

In order to run a policy rule, `valint` requires relevant evidence, which can be found in a storage using a number of parameters. These parameters can be set manually by the user or automatically derived from the context. Parameters that can be derived automatically are categorized into three context groups: "target," "pipeline", and "product".

1. `target` context group specifies parameters that can be derived from the target provided (if any). Those parameters are:
    * `target_type` - the type of the target provided (e.g., image, git, generic etc.)
    * `sbomversion` - the version of the SBOM provided (usually it's sha256 or sha1 hash)

2. `pipeline` context group specifies parameters that can be derived from the running environment. Those parameters are:
    * `context_type` - type of the environment (e.g., local, github, etc.)
    * `git_url` - git url of the repository (if any)
    * `git_commit` - git commit of the current repository state (if any)
    * `run_id` - run id
    * `build_num` - build number

3. `product` context group specifies product parameters that can be derived from the command line arguments. Those parameters are:
    * `name` - name of the product
    * `product_version` - version of the product
    * `predicate_type` - type of the predicate (e.g., https://cyclonedx.org/bom, https://slsa.dev/provenance/v0.1, etc.)

User can specify any combination of these three groups or a special value `none` to indicate that the parameter should not be derived automatically.
By default `target` and `product` groups are used.
The list of groups to be used should be provided to the `attest.cocosign.policies.<policy>.rules.<rule>.evidence.filter-by` field in the configuration file.

In addition, one can manually specify any parameters that they want to be matched by an evidence. For example, these can be `git_url` or `timestamp`.

If more than one evidence is found, the newest one is used.

<details>
  <summary> Usage </summary>

An example of using the `target` context group and a specific timestamp value is shown below:

```yaml
attest:
  cocosign:
    policies:
      - name: my_policy
        rules:
          - name: my_rule
            evidence:
              signed: true
              format-type: cyclonedx
              timestamp: "2023-11-16T09:46:25+02:00" # manually specified timestamp
              filter-by:
                - target
```

</details>

### Targetless Run

Using `evidence` field it's possible to run a policy rule without providing a target. In this case, the evidence will be looked up using the provided parameters for each rule and no values from any target will be used (simply, the `filter-by: target` flag will be ignored).
To be able to run `valint verify` in targetless mode, the `evidence` field in a rule config should describe the needed evidence well enough.  
In the following example, the newest evidence of `target_type: image` for the provided product (defined by the name & version) will be used.

```yaml
# my_policy.yaml
attest:
  cocosign:
    policies:
      - name: my_policy
        rules:
          - name: my_rule
            evidence:
              signed: true
              format-type: cyclonedx
              target_ttpe: image
              filter-by:
                - product
            with:
              identity:
                emails:
                  - my@email.com
```

```bash
valint bom busybox:latest -o attest --product-key my_product --product-version 1.0.0
```

```bash
valint verify --product-key my_product --product-version 1.0.0 -c my_policy.yaml
```

## External policy configs - Coming Soon!

Policy or rule configuration can be set not only in the main configuration file but also in external files. This can be useful when you want to reuse the same policy configuration for different targets or as a part of a configuration bundle or when you just want to keep your main configuration file clean.

External policy/rule configuration can be set in a separate file and then referenced in the cmd args via the `--policy` flag or in the main configuration file via the `attest.policy_configs` field of type `[]string`.

Each extermal configuration should represent an entry to `attest.cocosign.policies` or to `attest.cocosign.policies[].rules` field of the main configuration file.

For example, a policy configuration defined by the following file:

```yaml
attest:
  cocosign:
  policies:
  - name: default
    rules:
    - name: "default-rule"
      evidence:
        signed: true
        format-type: cyclonedx
      with:
        identity:
          emails:
            - my@email.com
```

Can be represented in an external file like

```yaml
name: default
rules:
  - name: "default-rule"
    evidence:
      signed: true
      format-type: cyclonedx
    with:
      identity:
        emails:
          - my@email.com
```

or

```yaml
name: "default-rule"
evidence:
  signed: true
  format-type: cyclonedx
with:
  identity:
    emails:
      - my@email.com
```

One can use as many policies per `valint verify` run as they want.

### Bundling policy configs - Coming Soon!

Policy configurations along with the corresponding rego scripts can be bundled together in a directory or a git repo and then referenced in the cmd args via the `--bundle` flag or in the main configuration file via the `attest.bundle` field.  
In case of using a git repo, it's possible to also specify a branch and a commit or a tag to be used with `--git-branch`, `--git-commit` and `--git-tag` options respectively. The repo would be cloned automatically by `valint`.  
For the GitHub authentication, a token can be provided via `GITHUB_TOKEN` environment variable or as part of url like `<token>@github.com`.

To reference a policy rule in a bundle, the relative path to the bundle root should be provided in the `--policy` flag.

### Examples

To run an external policy, say, on a docker image target, first we need to create an image SBOM:

```bash
valint bom busybox:latest -o attest
```

Then, if we have a policy rule like

```yaml
name: "default-rule"
evidence:
  signed: true
  format-type: cyclonedx
with:
  identity:
    emails:
      - my@email.com
```

saved in `path/to/rule.yaml`, we can run the policy:

```bash
valint verify busybox:latest --policy /path/to/default-rule.yaml
```

If the rule is a part of a bundle and the bath in the bundle looks like `policies/images/rule.yaml`, then we can run it like

```bash
valint verify busybox:latest --bundle https://github.com/user/bundle --git-tag v1.0.0 --policy policies/images/default-rule.yaml
```

An example of policy evaluation results can be found in the [policy results](policy-results) section.
