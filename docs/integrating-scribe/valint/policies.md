---
sidebar_label: "Policies"
title: Policies
author: mikey strauss - Scribe
sidebar_position: 3
date: April 5, 2021
geometry: margin=2cm
---

# Policies
Each `policy` proposes to enforce a set of requirements your supply chain must comply with. Policies reports include valuations, compliance details, verdicts as well as references to provided `evidence`. <br />
Policy configuration can be set under the main configuration `policies` section.

Each `policy` consists of a set of `policy modules` that your supply chain must comply with. 
A `policy` is verified if ALL required `modules` included in it are evaluated and verified. A `module` is verified if ANY `evidence` is found that complies with the `module` configuration and setting.

### Usage
Policies are configured as part of Valint configuration file, under the `policies` section.

```yaml
attest:
  cocosign:
    policies:  # Set of policies - grouping modules
      - name: <policy_name>
        enable: true      
        modules: Set of module settings/configuration and input
          - name: <module_name>
            type: <verify-artifact> # Currently supporting the following types
            enable: true
            input: {} # Module input, depending on the module type
``` 

> For configuration details, see [configuration](docs/configuration) section.

> For PKI setting, see [attestations](docs/attestations) section.

### Policy 
Policy support the following fields:
* `enable`, enable module (default false). 
* `name`, policy name (**required**). 
* `modules`, list of policy module configuration.

# Policy modules
Module is a compliance checks that you can configure to your specific organization requirements.
* `enable`, enable module (default false). 
* `name`, policy module name (**required**). 
* `type`, type of the module, currently supporting `veirfy-arifact` and `git-owner`.
* `match`, match on evidence with a specific context.
* `input`, module specific configuration.

> For `match` details, see [Policies](#match-field) section
> For `input` details, see related module section

## Verify Artifact module
---
The Verify Artifact module enforces a set of requirements on who produced artifacts across your supply chain as well as what information should be collected on each artifact.
In other words, it ensures produced artifacts' (`targets`) integrity by checking the expected evidence, signatures and origin in your supply chain.

* Signed Evidence: The artifact should include signed or unsigned evidence, as specified by the `signed` field in the input.
* Signing Identity: The artifact should be signed by a specific identity, as specified by the `identity` fields in the input (for signed evidence).
* Evidence Format: The evidence format should follow the specified format(s) in the format field of the input.
* Origin of artifact: The artifact should originate from an expected source, as specified by the `match` [origin labels](##origin-context). 
For instance, you can verify that an artifact is generated from a particular pipeline or repository.
* Artifact details: The module applies to a specific artifact or any group of artifacts, as specified by the `match` [subject labels](##subject-context).
* Policy as code: The module allows extension of the verification using custom scripts, as specified by the `rego` input.

### Use cases
The verify artifact module can be used to enforce compliance with specific supply chain requirements, such as:

* Images must be signed and produce a CycloneDX SBOM.
* Images must be built by a CircleCI workflow and produce a signed SLSA provenance.
* Tagged sources must be signed and verified by a set of individuals or processes.
* Released binaries must be built by Azure DevOps on a specific git repository using unsigned SLSA provenance.

### Configuration
```yaml
- type: verify-artifact # Policy name
  enable: true/false # Policy enable (default false) 
  name: "" # Any user provided name
  input:
    identity:
      emails: [] # Signed email identities 
      uris: [] # Signed URIs identities 
      common-names: [] # Signed common name identities 
    signed: <true|false> # Should target be signed
    format: <statement-cyclonedx-json, attest-cyclonedx-json, statement-slsa, attest-slsa> # Expected evidence format
    match: {envrionment-context} # Any origin or subject fields used by
    script:
      args: {custom script input} 
      path: <path to policy script>
      rego:
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
In this example, the policy module named `signed_image` will evaluate images where signed by `mycompony.com` using `attest-cyclondex-json` format.

```yaml
attest:
  cocosign:
    policies:
      - name: my_policy
        enable: true
        modules:
          - name: signed_image
            type: verify-artifact
            enable: true
            input:
              signed: true
              format: attest-cyclonedx-json
              identity:
                common-names:
                  - mycompany.com
              match:
                target_type: image
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
In this example, the policy module named `slsa_prov_module` will evaluate images where signed by `bob@mycompany.com` or `alice@mycompany.com` using `attest-slsa` format.

```yaml
attest:
  cocosign:
    policies:
      - name: my_policy
        enable: true
        modules:
          - name: slsa_prov_module
            type: verify-artifact
            enable: true
            input:
              signed: true
              format: attest-slsa
              identity:
                emails:
                  - bob@mycompany.com
                  - alice@mycompany.com
              match:
                target_type: image
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
  <summary> Signed tagged sourced module </summary>
In this example, the policy module named "tagged_git_module" will evaluate sources' `mycompany/somerepo` tags where defined in the `main` branch and signed by `bob@mycompany.com`.

> The policy requires only the **HEAD** of the git target to comply to the policy not the entire history.

```yaml
attest:
  cocosign:
    policies:
      - name: my_policy
        enable: true  
        modules:
          - name: tagged_git_module
            type: verify-artifact
            enable: true
            input:
              signed: true
              format: attest-slsa
              identity:
                emails:
                - bob@mycompany.com
              match:
                target_type: git
                target_git_url: git@github.com:mycompany/somerepo.git # Git url of the target.
                branch: main
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
In this example, the policy, named "binary_module" enforces requirements on the binary `my_binary.exe` was Originated from which Azure DevOps triggered by the `https://dev.azure.com/mycompany/somerepo` repo.
The policy module also enforces an unsigned SLSA provenance statement is produced as evidence.

```yaml
attest:
  cocosign:
    policies:
      - name: my_policy
        enable: true  
        modules:
          - name: binary_module
            type: verify-artifact
            enable: true
            input:
              signed: false
              format: statement-slsa
              match:
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
In this example, the policy module named "3rd-party-scan" will evaluate scanned `3rd-party-scan.json` file, Originated from Azure DevOps triggered by the `https://dev.azure.com/mycompany/somerepo` and signed by `bob@mycompany.com`.

```yaml
attest:
  cocosign:
    policies:
      - name: my_policy
        enable: true  
        modules:
          - name: 3rd-party-rule
            type: verify-artifact
            enable: true
            input:
              signed: false
              format: attest-generic
              identity:
                emails:
                - bob@mycompany.com
              match:
                target_type: generic
                context_type: azure
                git_url: https://dev.azure.com/mycompany/somerepo
                git_branch: main
                input_name: 3rd-party-scan.json
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


### Policy As Code
You can define custom policies for artifacts verified by the module by attaching them as code. After the module enforces the origin and subject of the evidence, you can further analyze and customize the content to meet your organization's requirements.

### Usage
Module verifies the predicate of the evidence in a custom rego script embedded in the policy.

```yaml
- name: signed_image_custom_policy
  type: verify-artifact
  enable: true
  input:
    signed: true
    format: attest-cyclonedx-json
    identity:
      common-names:
        - mycompany.com
    match:
      target_type: image
    rego:
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

Usage, use the following rule structure
```bash
package verify
default allow = false

verify = {
    "allow": false,
    "summary": []
    "violations": []
    "errors": []
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
  "violations": [ # Optional
    {
        "type": "string",
        "details": {},
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
In this example, the policy module named `custom-package-policy` to verify a custom package requirements.
In the example Alpine packages are forbidden.

```yaml
attest:
  cocosign:
    policies:
      - name: my_policy
        enable: true
        modules:
          - name: signed_image
            type: verify-artifact
            enable: true
            input:
              signed: true
              format: attest-cyclonedx-json
              match:
                target_type: image
              rego:
                script: |
                  package verify
                  import data.policies.sbom_parser as parser
                  default allow = false

                  verify = v {
                    v := {
                      "allow": allow,
                      "violations": violation(input.evidence.predicate.bom.components),
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

## Git Owner module
The Git Owner module enforces a set of requirements on the identity editing files on git repositories.

* Verifiable owners: enforce Commit signature for a set of files, as specified by the `signed-commit` field in the module input.
* File owners: enforce the Committer identity for a set of files, as specified by the `user` field in the module input.

> NOTICE: We currently do not verify the commit signature as it requires the public key of all the signatures keys.

> NOTICE: Module only enforces file requirement on the LATEST commit not the entire chain.

### Evidence requirements
Module requires a populated CycloneDX SBOM with commit, file and relations.
Module supports both signed and unsigned forms of CycloneDX evidence.

* `--components` must include the following groups `commits`,`files`, `dep` (optionally include, `packages`).
* `-o`, `--format` must be either `statement-cyclonedx-json` or `attest-cyclonedx-json`.
* Optional use `--git-tag`, `--git-branch` and `--git-commit-` to target the specific 

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
The Git Owner module can be used to enforce compliance with specific supply chain requirements, such as:

* Only permitted Committer identities can update the `package.json` file.
* Commits must be signed for all files excluding the tests related files.
* Only permitted signed Committer identities can update the CircleCI workflows.

### Configuration
```yaml
- type: git-owner # Policy name
  enable: true/false # Policy enable (default false) 
  name: "" # Any user provided name
  input:
    default: # Default files requirements
      signed-commit: <true|false> # Should commits be signed
      users: [] # Commiter identities
    specific: # List of Specific files requirements
      - path: <regex> # Match to specific files
        signed-commit: <true|false> # Should commits be signed
        users: [] # Commiter identities
    match: {envrionment-context} # Any origin or subject fields used by
``` 

> Detailed regex syntax of `path` field is defined by https://github.com/google/re2/wiki/Syntax.path.

### Examples
Copy the Examples into a file named `.valint.yaml` in the same directory as running Valint commands.

> For configuration details, see [configuration](docs/configuration) section.

<details>
  <summary> Package git owners </summary>
In this example, the policy module named "package-git-owner" enforces `package.json` committer identity.

```yaml
attest:
  cocosign:
    policies:
      - name: package-git-owner
        enable: true  
        modules:
          - name: npm-owner-rule
            type: git-owner
            enable: true
            input:
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
In this example, the policy module named " signed-commits-policy" enforces Commits are signed excluding files used for testing.

```yaml
attest:
  cocosign:
    policies:
      - name: signed-commits-policy
        enable: true  
        modules:
          - name: signed-commits-js-rule
            type: git-owner
            enable: true
            input:
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
In this example, the policy module named "workflow-owners-policy" enforces only permitted signed Committer identitied can update CircleCI workflows under `.circle` subdirectory.

```yaml
attest:
  cocosign:
    policies:
      - name: workflow-owners-policy
        enable: true  
        modules:
          - name: cirlce-workflow-rule
            type: git-owner
            enable: true
            input:
              specific:
                - path: \.circle/.*
                  signed-commit: true
                  users:
                    - alice@email.com
                    - bob@email.com
              match:
                context_type: circle
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

## SLSA Framework module - Coming Soon!
The SLSA Framework module enforces Levels 1 to 3 of SLSA Specifications.
For example, Branch Protection and Build Provenance requirements can be enforced.
SLSA Framework module requires a SLSA provenance object as well as Security Posture evidence.

## Third-Party module - Coming Soon!
The Third-Party module enforces requirements on any third-party scan, reports or settings that may be required internally or externally.
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
    modules:
    - type: verify-artifact
      enable: true
      name: "default-module"
      input:
        identity: # Populated by `--email`, `--uri` and `--common-name flags sets
        signed: true
        format: ${current.content_type} # Populated by --input-format flag.
        match:
          sbomversion: ${current.sbomversion> # Populated from the artifact version provided to verify command.
```

> For module details, see [verify artifact module](#verify-artifact-module) section.

</details>

## Match field
`match` field is a set of labels supported by all modules. 
These labels add requirements on the origin or the subject of the provided evidence considered for compliance. 

Using these fields allows you to set different compliance requirements for different layers of your supply chain.

> For full label fields list see [environment-context](#environment-context) section.

<details>
  <summary> Usage </summary>

Here's an example of usage: 
If you want to evaluate images named `myorg/myimage:latest`, you may set the module with the following labels:
```
match:
    sbomgroup: image
    sbomname: myorg/myimage:latest
```

> If you also add `context_type: github` label, it requires the origin of the evidence to be generated by a GitHub.

> If you also add `git_url: github.com/my_org/myimage.git`, it requires the evidence to be collected from a pipeline on a specific repo.

</details>
