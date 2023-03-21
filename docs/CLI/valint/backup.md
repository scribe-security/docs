
## Policies
---
Each `policy` proposes to enforce a set of rules your supply chain must comply with. Policies reports include valuations, compliance details, verdicts as well as references to provided `evidence`. <br />
Policy configuration can be set under the main configuration `policies` section.

### Usage
```yaml
attest:
  cocosign:
    policies:  # Set of policies - grouping rules
      - name: <policy_name>
        rules: 
          # Set of rule settings/configuration/input
``` 
> For configuration details, see [configuration](docs/configuration.md) section.

# Rules
Rules are set of compliance checks you can configure to your specific compliance requirements.

# Global fields
All rules support the following fields.

* `match`, match policy to evidence including context labels.
   valint verify <target> will match on rules provoided the target+envrionment match the policy.
   While `valint verify`, will match rules for any accessible evidence.
   
    ```yaml
    policies:
     - name: artifactPolicy
       rules:
       - type: verifyTarget
          name: myBusyboxRule
          require: true
          match:
            context_type: circle
            build_num: 23
            group: image

      - type: verifyTarget
          name: myCircleRule
          require: true
          origin:
            context_type: circle
            sbomname: busybox
            build_num: 23
    ```
  verify target busybox -> verified myBusyboxRule - > success (OR)
  verify target artifactPolicy -> look for any evidence that complies to each rule. (AND)

* `require` Require the rule for verification failer.
* `enable` Enable rule

### Default policy
When no policy configuration is found, the default policy is a single a policy including a single verifyTarget rule. The rule configuration fields `allowed_emails`, `allowed_uris`, and `allowed_names` are obtained from the corresponding flag sets `--emails`, `--uri`, and `--common-name`.

## Verify target rule
The Verify Target rule enforces set of rules on who produced artifacts across your supply chain but also what information should be collected on each artifact.
In other words, it ensures produced artifacts (`targets`) integrity by checking the expected evidence, signature identity and origin of said evidence.

Given any artifact, the policy engine enforces the following:
* Should the artifact include signed/unsigned evidence.
  * See `signed` field
* What identity must sign the artifact (for signed evidence).
  * See `identity` field
* Where was the artifact expected to originate from.
  * See `origin` field
* What format(s) should the evidence follow.
  * See `format` field

### Use cases
* An image release must provide signed CycloneDX SBOM attestation.
* An image release must be produced by a CircleCI workflow and must provide a signed SLSA provenance attestation (`valint bom my_image:latest -o attest-slsa`).
* Any git repository release tag must produce a signed SBOM in CycloneDX format, and only certain individuals within the organization should be able to produce this version.
* A binary release must be produced by a specific Azure workflow run from your specific git repository and must provide an unsigned SLSA provenance statement.


## Verify target rule
The Verify Target policy enforces set of rules on who produced artifacts across your supply chain but also what information should be collected on each artifact.
In other words, it ensures produced artifacts (`targets`) integrity by checking the expected evidence, signature identity and origin of said evidence.


### Configuration
```yaml
- type: verifyTarget # Policy name
  enable: true/false # Policy enable (default false) 
  required: <true | false> # Is the rule required to fail the command line .
  name: "" # Any user provided name
  identity:
    allowed_emails: [] # Signed email identities 
    allowed_uris: [] # Signed URIs identities 
    allowed_names: [] # Signed common name identities 
  signed: <true|false> # Should target be signed
  format: <cyclonedx, slsa> # Expected evidence format
  origin: {envrionment-context} # Expected origin of the evidence - EG pipeline context fields, git context fields (maybe simply all context fields),
``` 

## Valint Verify extention, verifyTarget Extention use case.
new flag proposed.
`--set-env` Set the envrionment for policy configuraiton
Allowing one to use the following configuration
```yaml
attest:
  cocosign:
    policies:

      - type: VerifyTarget
        enable: true
        name: git_policy
        input:
          identity:
            allowed_emails:
            - john.doe@mycompany.com
            allowed_names: []
          origin:
            build_num: ${MY_BULID_NUM}
            context_type: cicle
          match:
            group: git # Match on git targets
            url: my_url

      - type: VerifyTarget
        enable: true
        name: docker_policy
        input:
          identity:
            allowed_emails:
            - second@example.com
          origin:
            build_num: ${MY_BULID_NUM}
            context_type: cicle
          match:
            group: docker # Match on image targets
            url: my_url

```
then run verify no target required.
```
valint verify --set-env MY_GIT_BRANCH=<url>
```

### Details
* `allowed_emails`, `allowed_uris` and `allowed_names` default the identity
required the identity that signed the target.

> Important to note, empty fields seen as `accept all`. 

* `filter` any environment context flag to match on target before verification.
Flag provides a way to define multiple policies each refereeing to a different set of targets.

### Flags

* `--input-format` in [verify command](#evidence-verification---verify-command)
Verify target includes specified format.

> For example, `valint verify busybox:latest -i statement-slsa` will force verifyTarget to look for evidence in the format of slsa statement.

* `--email`, `--uri`, `--common-name` each flag set allows one to set the identity expected to sign the target. 

> for signed evidence only.

### Examples
Following are configuration examples. <br />
Create a file name `.valint.yaml` with the following content.

<details>
  <summary> Image policy verification </summary>
In this example, the policy, named "image_policy," enforces rules on any image produced and verified by a specific identity.

Specifically, the policy requires that:
* Image target must be signed by `mycompany.com`.
* CI or developer will produce an signed CycloneDX SBOM (`attest-cyclonedx-json`).

```yaml
attest:
  cocosign:
    policies:
    - type: verifyTarget
      enable: true
      name: image_policy
      allowed_names:
        - mycompany.com
      filter:
        sbomgroup: image
        content_type: attest-cyclonedx-json
```
