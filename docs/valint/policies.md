---
sidebar_label: "Applying policies"
title: Applying policies
author: mikey strauss - Scribe
sidebar_position: 5
date: April 5, 2021
geometry: margin=2cm
---

# Policies

Each `policy` proposes to enforce a set of requirements your supply chain must comply with. Policies reports include valuations, compliance details, verdicts as well as references to provided `evidence`. <br />
Policy configuration can be set under the main configuration `policies` section.

Each `policy` consists of a set of `policy rules` that your supply chain must comply with.
A `policy` is verified if ALL required `rules` included in it are evaluated and verified. A `rule` is verified if ANY `evidence` is found that complies with the `rule` configuration and setting.

### Usage

Policies are configured as part of Valint configuration file, under the `policies` section.

```yaml
attest:
  cocosign:
    policies:  # Set of policies - grouping rules
      - name: <policy_name>
        rules: Set of rule settings/configuration and input
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

> For configuration details, see [configuration](docs/configuration) section.

> For PKI setting, see [attestations](docs/attestations) section.

### Policy

Policy support the following fields:

* `disable`, disable rule (default false).
* `name`, policy name (**required**).
* `rules`, list of policy rule configuration.

# Policy rules

Rule is a compliance checks that you can configure to your specific organization requirements.

* `disable`, disable rule (default false).
* `name`, policy rule name (**required**).
* `type`, type of the rule, currently supporting `verify-artifact` (_default_) and `git-owner`.
* `evidence`, match on evidence with a specified parameters.
* `with`, rule-specific configuration parameters.

> For `evidence` details, see [Policies](#context-match-fields) section
> For `with` details, see related rule section

## Verify Artifact rule

---
The Verify Artifact rule enforces a set of requirements on who produced artifacts across your supply chain as well as what information should be collected on each artifact.
In other words, it ensures produced artifacts' (`targets`) integrity by checking the expected evidence, signatures and origin in your supply chain.

* Signed Evidence: The artifact should include signed or unsigned evidence, as specified by the `signed` field in the input.
* Signing Identity: The artifact should be signed by a specific identity, as specified by the `identity` fields in the input (for signed evidence).
* Evidence Format: The evidence format should follow the specified format(s) either in the format-type or format field of the input.
* Origin of artifact: The artifact should originate from an expected source, as specified by the `evidence` [origin labels](##origin-context).
For instance, you can verify that an artifact is generated from a particular pipeline or repository.
* Artifact details: The rule applies to a specific artifact or any group of artifacts, as specified by the `evidence` [subject labels](##subject-context).
* Policy as code: The rule allows extension of the verification using custom scripts, as specified by the `rego` or `script` input.

### Use cases

The `verify-artifact` rule can be used to enforce compliance with specific supply chain requirements, such as:

* Images must be signed and produce a CycloneDX SBOM.
* Images must be built by a CircleCI workflow and produce a signed SLSA provenance.
* Tagged sources must be signed and verified by a set of individuals or processes.
* Released binaries must be built by Azure DevOps on a specific git repository using unsigned SLSA provenance.

### Configuration

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

> For configuration details, see [configuration](docs/configuration) section.

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
              format-type: cyclonedx-json
              target_type: image
            with:
              identity:
                common-names:
                  - mycompany.com
```

**Command:**<br />
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

**Command:**<br />
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

**Command:**<br />
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

**Command:**<br />
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

**Command:**<br />
Run the command on the required supply chain location.

```bash
# Generate required evidence
valint bom 3rd-party-scan.json -o attest-generic --predicate-type https://scanner.com/scan_format

# Verify policy (cache store)
valint verify 3rd-party-scan.json -i attest-generic --predicate-type https://scanner.com/scan_format
```

</details>


### Policy as Code

You can define custom policies for artifacts verified by the rule by attaching them as code. After the rule enforces the origin and subject of the evidence, you can further analyze and customize the content to meet your organization's requirements.

### Usage

Rule verifies the predicate of the evidence in a custom Rego script embedded in the policy.

```yaml
- name: signed_image_custom_policy
  evidence:
    signed: true
    format-type: cyclonedx-json
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
A Rego script can be provided in two forms: as an embedded code snippet in the `rego` section or as a dedicated file using the `path` field.

> By default `valint` looks for ``.valint.rego` file.

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

Copy the Examples configuration into file name `.valint.yaml` and Copy Examples custom script into file name `.valint.rego`.
Files should be in the same directory as running Valint commands.

> For configuration details, see [configuration](docs/configuration) section.
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
              format-type: cyclonedx-json
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


**Command:**<br />
Run the command on the required supply chain location.

```bash
# Generate required evidence, requires signing capabilities.
valint bom busybox:latest -o attest

# Verify policy (cache store)
valint verify busybox:latest
```

</details>

## Git Owner rule

The Git Owner rule enforces a set of requirements on the identity editing files on git repositories.

* Verifiable owners: enforce Commit signature for a set of files, as specified by the `signed-commit` field in the rule input.
* File owners: enforce the Committer identity for a set of files, as specified by the `user` field in the rule input.

> NOTICE: We currently do not verify the commit signature as it requires the public key of all the signatures keys.

> NOTICE: Rule only enforces file requirement on the LATEST commit not the entire chain.

### Evidence requirements

Rule requires a populated CycloneDX SBOM with commit, file and relations.
Rule supports both signed and unsigned forms of CycloneDX evidence.

* `--components` must include the following groups `commits`,`files`, `dep` (optionally include, `packages`).
* `-o`, `--format` must be either `statement-cyclonedx-json` or `attest-cyclonedx-json`.
* Optional use `--git-tag`, `--git-branch` and `--git-commit` to target the specific

```bash
valint bom git:<repo>
  --components commits,files,dep
  -o [statement,attest]
  --git-tag [tag] # OPTIONAL
  --git-branch [branch] # OPTIONAL
  --git-commit [commit] # OPTIONAL
```

```bash
valint verify git:<repo>
  -i [statement,attest]
  --git-tag [tag] # OPTIONAL
  --git-branch [branch] # OPTIONAL
  --git-commit [commit] # OPTIONAL
```

### Use cases

The Git Owner rule can be used to enforce compliance with specific supply chain requirements, such as:

* Only permitted Committer identities can update the `package.json` file.
* Commits must be signed for all files excluding the tests related files.
* Only permitted signed Committer identities can update the CircleCI workflows.

### Configuration

```yaml
- type: git-owner # Policy name
  disable: true/false # Policy enable (default false)
  name: "" # Any user provided name
  evidence:
    {environment-context} # Any origin or subject fields used by
  with:
    default: # Default files requirements
      signed-commit: <true|false> # Should commits be signed
      users: [] # Commiter identities
    specific: # List of Specific files requirements
      - path: <regex> # Match to specific files
        signed-commit: <true|false> # Should commits be signed
        users: [] # Commiter identities
``` 

> Detailed regex syntax of `path` field is defined by https://github.com/google/re2/wiki/Syntax.path.

### Examples

Copy the Examples into a file named `.valint.yaml` in the same directory as running Valint commands.

> For configuration details, see [configuration](docs/configuration) section.

<details>
  <summary> Package git owners </summary>
In this example, the policy rule named "package-git-owner" enforces `package.json` committer identity.

```yaml
attest:
  cocosign:
    policies:
      - name: package-git-owner
        rules:
          - name: npm-owner-rule
            type: git-owner
            with:
              specific:
                - path: package.json
                  users:
                    - alice@email.com
                    - bob@email.com
                - path: package-lock.json
                  users:
                    - alice@email.com
                    - bob@email.com
```

**Command:**<br />
Run the command on the required supply chain location.

```bash
# Generate required evidence
valint bom git:https://github.com/myorg/my_npm_pkg.git -o attest --components commits,files,dep

# Verify policy (cache store)
valint verify git:https://github.com/myorg/my_npm_pkg.git -i attest
```
</details>

<details>
  <summary> Signed Commit history </summary>
In this example, the policy rule named " signed-commits-policy" enforces Commits are signed excluding files used for testing.

```yaml
attest:
  cocosign:
    policies:
      - name: signed-commits-policy
        rules:
          - name: signed-commits-js-rule
            type: git-owner
            with:
              default:
                signed-commit: true
              specific:
                - path: test/.*
                  signed-commit: false
```

**Command:**<br />
Run the command on the required supply chain location.

```bash
# Generate required evidence
valint bom git:https://github.com/myorg/some_repo.git -o attest  --components commits,files,dep

# Verify policy (cache store)
valint verify git:https://github.com/myorg/some_repo.git -i attest
```
</details>

<details>
  <summary> Workflows owners </summary>
In this example, the policy rule named "workflow-owners-policy" enforces only permitted signed Committer identitied can update CircleCI workflows under `.circle` subdirectory.

```yaml
attest:
  cocosign:
    policies:
      - name: workflow-owners-policy
        rules:
          - name: cirlce-workflow-rule
            type: git-owner
            evidence:
              context_type: circle
            with:
              specific:
                - path: \.circle/.*
                  signed-commit: true
                  users:
                    - alice@email.com
                    - bob@email.com
```

**Command:**<br />
Run the command on the required supply chain location.

```bash
# Generate required evidence (triggered by a Circle CI)
valint bom git:https://github.com/myorg/some_repo.git -o attest  --components commits,files,dep --context circle

# Verify policy (cache store)
valint verify git:https://github.com/myorg/some_repo.git -i attest
```
</details>

## SLSA Framework rule - Coming Soon!

The SLSA Framework rule enforces Levels 1 to 3 of SLSA Specifications.
For example, Branch Protection and Build Provenance requirements can be enforced.
SLSA Framework rule requires a SLSA provenance object as well as Security Posture evidence.

## Third-Party rule - Coming Soon!

The Third-Party rule enforces requirements on any third-party scan, reports or settings that may be required internally or externally.
For example, the NPM Audit result, Synk or Sonarqube scans, not only should pass but also be exposed as compliance evidence.

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
    - type: verify-artifact
      name: "default-rule"
      evidence:
        signed: true
        format: ${current.content_type} # Populated by --input-format flag.
        sbomversion: ${current.sbomversion> # Populated from the artifact version provided to verify command.
      with:
        identity: # Populated by `--email`, `--uri` and `--common-name flags sets
```

> For rule details, see [verify artifact rule](#verify-artifact-rule) section.

</details>

## Context match fields

Context match fields is a set of labels supported by all rules.
These labels add requirements on the origin or the subject of the provided evidence considered for compliance.

Using these fields allows you to set different compliance requirements for different layers of your supply chain.

> For full label fields list see [environment-context](#environment-context) section.

<details>
  <summary> Usage </summary>

Here's an example of usage: 
If you want to evaluate images named `myorg/myimage:latest`, you may set the rule with the following labels:
```
evidence:
    sbomgroup: image
    sbomname: myorg/myimage:latest
```

> If you also add `context_type: github` label, it requires the origin of the evidence to be generated by a GitHub.

> If you also add `git_url: github.com/my_org/myimage.git`, it requires the evidence to be collected from a pipeline on a specific repo.

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
              format-type: cyclonedx-json
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
            input:
              signed: true
              format-type: cyclonedx-json
              timestamp: "2023-11-16T09:46:25+02:00" # manually specified timestamp
              filter-by:
                - target
```
</details>
