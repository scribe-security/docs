---
sidebar_label: "Adopting initiatives"
title: Adopting initiatives
author: viktor kartashov - Scribe
sidebar_position: 5
date: December 10, 2024
geometry: margin=2cm
toc_max_heading_level: 3
---

## What is an initiative?

An `initiative` is a high-level, abstract requirement that comprises a set of `controls`. For example, a security framework such as SSDF can be represented as an `initiative`. A `control` is an abstract requirement that comprises a set of `rules`. For example, the SSDF framework (initiative) requires a `control` of protecting access to the source code. This `control` can be materialized by requiring MFA, limiting the number and identity of admins, and requiring the source code repository to be private -- each of the requirements is a `rule`.

The outcome of an initiative evaluation is an initiative result report that details the rule evaluation results and references the verified assets and statements/attestations. `valint` produces initiative results in the SARIF format and uploads them as an in-toto statement of SARIF to Scribe Hub. For more details on this, see the [Initi] [Policy Results](./policy-results.md) page.

Rules can be defined inline in the initiative config or reuse existing ones from a bundle. See the [Rule configuration](#rule-configuration-format), [Initiative configuration](#initiative-configuration), and [Using a private bundle](#using-a-private-bundle) sections for more details.

### Evidence

Scribe rules operate on evidence; each rule consumes evidence previously created. Each rule specifies which evidence it requires by providing criteria for fetching the evidence. This allows for abstracting the rules and avoiding the need to know an exact evidence id; so instead of specifying "use the SBOM of alpine@sha:ab87ehk..." the user can specify "use the SBOM created in this pipeline", or "use the SBOM of this product". See the [Evidence Lookup](#evidence-lookup) section for more details.

### Gates

Initiative evaluation may require evaluating different rules in different locations in the supply chain. For example, an SBOM of a built image would be tested for vulnerabilities on the build pipeline, while evaluating DAST results would happen on a different testing pipeline. Scribe initiatives support specifying for each control the gate it should be evaluated at; when evaluating an initiative the user can specify the "current location" - the gate that should be evaluated. A gate is defined by its name (serves for human readability of the results, optional) and type (required to use the filtering feature). See the [Rule filtering](#rule-filtering) section for more details.

## Initiative configuration

```yaml
config-type: initiative
required-valint-version: "2.0.0"
id: <initiative-id>
name: <initiative-name>
version: <initiative-version>
description: <initiative-description>
help: <http://help_uri>

defaults:
  evidence:
    signed: <true | false>
    content_body_type: <content_body_type>
    filter-by: []

env:
  <ENV_VAR_NAME>: <value>

controls:
    - name: <control-name>
      id: <control-id>
      description: <control-description>
      disable: <true | false>
      when:
        gate: <gate-type>
      rules: []
```

### Initiative configuration fields

#### `config-type`

- **Type:** String
- **Required:** Yes
- **Description:** Specifies the type of configuration. For initiatives, this should be set to `initiative`.

#### `required-valint-version`

- **Type:** String
- **Required:** No
- **Description:** The minimum version of Valint required to run the initiative.
- **Example:** `"2.0.0"`
- **Default:** No `valint` version matching check is performed.

#### `id`

- **Type:** String
- **Required:** No
- **Description:** A unique identifier for the initiative. It cannot contain the `::` string. IDs can be seen in the UI and are needed in Scribe Hub to define rule uniqueness. If no ID is provided, it is generated from the name.
- **Default:** If no `id` is provided, the value is calculated from the `name` field.

#### `name`

- **Type:** String
- **Required:** Yes
- **Description:** The name of the initiative.

#### `version`

- **Type:** String
- **Required:** No
- **Description:** The version of the initiative.
- **Default:** If no value is provided, initiative versioning is not applied.

#### `description`

- **Type:** String
- **Required:** No
- **Description:** A brief description of the initiative.
- **Default:** If no value is provided, it is omitted in the output data.

#### `help`

- **Type:** String (URL)
- **Required:** No
- **Description:** A URL pointing to the help or documentation for the initiative.
- **Default:** If no value is provided, it is omitted in the output data.

#### `defaults`

- **Type:** Object
- **Required:** No
- **Description:** Optional parameters to override the existing evidence lookup and other parameters for each rule in the initiative. It is recommended to start adopting the initiative with the `defaults.signed` value set to `false` and set it to `true` when certificates and keys are deployed.
- **Default:** If no value is provided, the rules' values are used.

##### `defaults.level`

- **Type:** String
- **Required:** No
- **Description:** Rule level to use for all rules in the initiative. It is recommended to start with a `warning` level and only after the security controls have been adopted, set it to "error".
- **Default:** If no value is provided, the original rules' levels are used.

##### `defaults.evidence`

- **Type:** Object
- **Required:** No
- **Description:** Evidence lookup parameters. Any field from the evidence context can be used here.
- **Default:** If no value is provided, the rules' values are used.

#### `env`

- **Type:** Object
- **Required:** No
- **Description:** File-wide environment variables for the template engine.
- **Default:** If no value is provided, only the variables from the actual environment are used.

#### `controls`

- **Type:** Array of Objects
- **Required:** Yes
- **Description:** A list of controls for the initiative.

##### `controls[].name`

- **Type:** String
- **Required:** Yes
- **Description:** The name of the control.

##### `controls[].id`

- **Type:** String
- **Required:** No
- **Description:** A unique identifier for the control. Cannot contain the `::` string. If no ID is provided, it is generated from the name.

##### `controls[].description`

- **Type:** String
- **Required:** No
- **Description:** A brief description of the control.

##### `controls[].disable`

- **Type:** Boolean
- **Required:** No
- **Default:** `false`
- **Description:** Indicates whether the control should be disabled. If set to `true`, the control will not be evaluated.

##### `controls[].when`

- **Type:** Object
- **Required:** No
- **Description:** Optional filters for when the control should be run. Currently only `gate` filters are supported (see below).
- **Default:** If no value is provided, no user-defined control filters are applied.

###### `controls[].when.gate`

- **Type:** String
- **Required:** No
- **Description:** The type of gate on which to run the control. This value is used to filter controls when the `--gate-type` input is provided to `valint`. See the [Rule filtering](#rule-filtering) section below for more details.
- **Default:** If no value is provided, the control will run on all gates.

##### `controls[].rules`

- **Type:** Array of Objects
- **Description:** A list of rules for the control. For details, see the [Rules](#rule-configuration-format) section below.

:::info
For `valint` configuration details, see the [configuration](./configuration.md) section.
:::
:::info
For PKI configuration, see the [attestations](./attestations.md) section.
:::

An example of an initiative is:

```yaml
config-type: initiative
required-valint-version: "2.0.0"
id: my-initiative
name: "My Initiative"
version: "v1.0.0"
description: "This initiative enforces a couple of simple checks on Docker images"

defaults:
  evidence:
    signed: true

controls:
    - name: "My Control"
      when:
        gate: "Build"
      rules:
          uses: sbom/blocklist-packages@v2
          with:
            blocklist:
                - "liblzma5@5.6.0"
                - "liblzma5@5.6.1"
                - "xz-utils@5.6.0"
                - "xz-utils@5.6.1"
        - name: "my-rule-2"
          uses: sbom/banned-licenses@v2
          level: warning
          with:
            identity:
              emails:
                - my@email.com
            banned-licenses:
                - "GPL-2.0"
                - "GPL-3.0"
    - name: "Control-2"
      when:
        gate: "Deploy"
      rules:
        - name: "my-rule-3"
          uses: sbom/evidence-exists@v2
```

## Rule configuration format

Each rule that is used separately via the `--rule` argument or as part of an initiative should be defined in YAML:

```yaml
config-type: rule
required-valint-version: "2.0.0"
disable: <true | false>
id: <rule-id>
name: <rule-name>
path: <path_to_rego>
uses: <bundle-rule-reference>
description: <rule-description>
help: <http://help_uri>

labels: []

level: <error | warning | note>

require-scribe-api: <true | false>
fail-on-missing-evidence: <true | false>
skip-evidence: <true | false>
aggregate-results: <true | false>

evidence: {}

with: {}
```

### Rule configuration fields

#### `config-type`

- **Type:** String
- **Required:** Yes
- **Description:** Specifies the type of configuration. For rule configuration files, this should be set to `rule`. For rules defined inline in the initiative config, this field is omitted.

#### `required-valint-version`

- **Type:** String
- **Required:** No
- **Description:** The minimum version of Valint required to run the initiative.
- **Default:** No `valint` version matching check is performed.
- **Example:** `"2.0.0"`

#### `disable`

- **Type:** Boolean
- **Required:** No
- **Default:** `false`
- **Description:** Indicates whether the rule should be disabled. If set to `true`, the rule will not be evaluated.

#### `id`

- **Type:** String
- **Required:** No
- **Description:** A unique identifier for the rule. Cannot contain the `::` string. Must be unique within the initiative. If no ID is provided, it is generated from the name.
- **Default:** If no value is provided, it is generated from the name.

#### `name`

- **Type:** String
- **Required:** Yes
- **Description:** The name of the rule. This should be unique within the initiative.

#### `path`

- **Type:** String
- **Required:** No
- **Description:** The path to a custom external script, if used. Should be relative to the rule file.
- **Default:** If no value is provided, no external script file is used for the rule.

#### `uses`

- **Type:** String
- **Required:** No
- **Description:** A reference to a rule in a bundle that should be used as a base rule. The format is `<path-to-rule-in-catalog>@<config-interface-version>`. When used, the current rule's values will  override the external rule's ones.
- **Default:** If no value is provided, no external rule is used as a base rule.

#### `description`

- **Type:** String
- **Required:** No
- **Description:** A brief description of the rule.
- **Default:** If no value is provided, the value is omitted in the output data.

#### `help`

- **Type:** String (URL)
- **Required:** No
- **Description:** A URL pointing to the help or documentation for the rule.
- **Default:** If no value is provided, it is omitted in the output data.

#### `labels`

- **Type:** Array of Strings
- **Required:** No
- **Description:** A list of user-specified labels for the rule itself. These labels can be used for filtering out the rules to be run with the `--rule-label` valint flag. A rule will be run if at least one of its labels matches one of the `--rule-label` values. Label filters are used within the whole initiative, regardless of the controls. See the [Rule filtering](#rule-filtering) section below for more details.
- **Default:** No labels used.

#### `level`

- **Type:** String
- **Required:** No
- **Description:** The level of the rule. Can be `error`, `warning`, or `note`. Default is `error`. The levels affect how rule results affect the overall initiative result: `valint` run overall would fail only if there are `error` level violations. Results on Scribe Hub are also displayed according to the levels.
- **Default:** `error`

#### `require-scribe-api`

- **Type:** Boolean
- **Required:** No
- **Description:** Indicates whether the Scribe API is required. See the details in the [Rules that require the Scribe API](#rules-that-require-the-scribe-api) section.
- **Default:** `false`

#### `fail-on-missing-evidence`

- **Type:** Boolean
- **Required:** No
- **Description:** Indicates whether the rule should fail if evidence is missing. If set to `false` (default), the rule will have the `open` result if no evidence is found.
- **Default:** `false`

#### `skip-evidence`

- **Type:** Boolean
- **Required:** No
- **Description:** Indicates whether the rule should skip evidence downloading and go straight to the rule evaluation. Can be helpful for rules that don't require evidence, like API rules.
- **Default:** `false`

#### `aggregate-results`

- **Type:** Boolean
- **Required:** No
- **Description:** Indicates whether the rule results should be aggregated. If set to `true`, the rule will return a single result for all the violations found.
- **Default:** `false`

#### `evidence`

- **Type:** Object
- **Required:** No
- **Description:** Evidence lookup parameters. Any field from the evidence context can be used here. See the [Evidence Lookup](#evidence-lookup) section for more details.
- **Default:** No user-specified options will be used for the evidence lookup.

##### `evidence.filter-by`

- **Type:** List of Strings
- **Required:** No
- **Description:** A list of parameters in the environment to filter the evidence by (see [Evidence Lookup](#evidence-lookup)).
- **Default:** `[target, product]`

#### `with`

- **Type:** Object
- **Required:** No
- **Description:** Rule input, depending on the rule script.
- **Default:** Depends on the rule script.

Examples of rules and initiatives can be found in the [sample-policies bundle](https://github.com/scribe-public/sample-policies).

An example of a rule is:

```yaml
config-type: rule
id: require-sbom
name: Require SBOM Existence
path: require-sbom.rego

description: Verify the SBOM exists as evidence.

fail-on-missing-evidence: true

evidence:
  filter-by:
    - product
    - target
  content_body_type: cyclonedx-json
  signed: false
```

This rule requires a CycloneDX SBOM to be present as evidence for the product and target. The rule accepts both signed and unsigned SBOMs and fails if no SBOM is found. It uses an external `rego` script to provide some additional logic (in this specific case, it's just used to fetch some additional data from the SBOM and return it in the result).

## How to adopt an initiative?

An initiative is defined as a file that can be consumed locally or from an external bundle. To run an initiative, one first needs to create the required statements and attestations, for example:

```bash
valint bom <image>:<tag> \
  --product-key <PRODUCT_KEY> -- product-version <PRODUCT_VERSION> \
  --scribe.client-secret <SCRIBE_TOKEN>
```

<details>

<summary>Additional options</summary>

In addition, other type of statements can be created. See the [Getting started with valint](./getting-started-valint.md) guide for more details.

- SLSA Provenance

```bash
valint slsa <image>:<tag> \
  --product-key <PRODUCT_KEY> -- product-version <PRODUCT_VERSION> \
  --scribe.client-secret <SCRIBE_TOKEN>
```

- Generic evidence from a 3rd party tool report:

```bash
valint evidence <path-to-report> \
  --product-key <PRODUCT_KEY> -- product-version <PRODUCT_VERSION> \
  --scribe.client-secret <SCRIBE_TOKEN>
```

</details>

-------------------
Then, a local initiative can be run with the following command:

```bash
valint verify --initiative initiative.yaml \
  --product-key <PRODUCT_KEY> -- product-version <PRODUCT_VERSION> \
  --scribe.client-secret <SCRIBE_TOKEN>
```

To run an initiative from the [Scribe sample bundle](https://github.com/scribe-public/sample-policies), use the following command:

```bash
valint verify --initiative ssdf@v2 \
  --product-key <PRODUCT_KEY> -- product-version <PRODUCT_VERSION> \
  --scribe.client-secret <SCRIBE_TOKEN>
```

To run a part of an initiative filtered by gate type, use the following command:

```bash
valint verify --initiative ssdf@v2 \
  --product-key <PRODUCT_KEY> -- product-version <PRODUCT_VERSION> \
  --scribe.client-secret <SCRIBE_TOKEN> \
  --gate-type Build --gate-name "Build of My Product"
```

## Specifying parameters for an initiative from Scribe Bundle

To customize parameters for an initiative from the Scribe Bundle — such as specifying a list of allowed registries for the [NIST Application Container Security (SP-800-190) Initiative](../configuration/initiatives/sp-800-190) — the recommended approach is to copy the initiative configuration file from the bundle and modify it locally.

A local initiative file enables the definition of configuration parameters specific to an organization, while still referencing rules from the Scribe Bundle. This local initiative file can then be used with the `--initiative` flag in the `valint verify` command, for example:

```bash
valint verify --initiative my-initiative.yaml \
  --product-key <PRODUCT_KEY> -- product-version <PRODUCT_VERSION> \
  --scribe.client-secret <SCRIBE_TOKEN>
```

## Using a private bundle

Rules and initiatives can be provided locally or reused either from the public Scribe bundle or a private bundle managed by the user. By default, the public Scribe bundle is used.
To use a private bundle instead, the following rules should be followed:

1. The private bundle should be a git repository referenced in `valint` command with the `--bundle` flag, for example:

  ```bash
  valint verify ... --bundle https://github.com/scribe-public/sample-policies ...
  ```

2. If git authentication is required, it can be provided either in the git URL or through the `--bundle-auth` flag.

3. A specific branch, tag, or commit can be provided using the `--bundle-branch`, `--bundle-tag`, or `--bundle-commit` flags respectively.

4. The file structure within the bundle is up to the administrator, but when referencing the rules in initiative configs, the path should be relative to the bundle root and at least one level deep.
For example, this is how to reference a rule from the public Scribe bundle:

  ```yaml
  ...
  rules:
    - uses: sbom/blocklist-packages@v2
  ...
  ```

Here `sbom/blocklist-packages@v2` means that the rule path within the bundle is`v2/rules/sbom/blocklist-packages.yaml`.
Note that the `.yaml` extension is omitted in the path and replaced with `@v2`, which is used here as a version tag.

## Rule configuration

Rules are defined as a combination of a `.yaml` configuration file and a `.rego` script. The `.yaml` file contains the rule configuration, while the `.rego` script contains the rule logic.
The rule configuration is described above along with the initiative configuration.

The rego script gets two inputs: verifying evidence as `input.evidence` and configurable args as `input.config.args`, the latter is specified in the rule config as a `with` object.

The rego script should produce an output object in the following format:

```go
package verify
default allow = false

verify = {
    "allow": true | false,
    "violation": {
      "type": "violation_type",
      "details": [{}], // arbitrary object list
    },
    "asset": asset,
    "summary": [{
      "allow": true | false,
      "violations": count(violations),
      "reason": "some reason string"
    }],
}
```

To generate the asset object, the script should call the built-in function `get_asset_data()`, providing it with the input evidence like this:

```go
import data.scribe as scribe
default asset = {}
asset := scribe.get_asset_data(input.evidence)
```

## Technical Details

### Evidence Lookup

In order to run a policy rule, `valint` requires relevant evidence, which can be found in storage using several parameters.
These parameters can be set manually by the user or automatically derived from the context.

Parameters that can be derived automatically by `valint` are categorized into three context groups: `target`, `pipeline`, and `product`.
By default, the `product` group is enabled for each rule.

1. The `target` context group specifies parameters that can be derived from the target provided to the `valint verify` command (a docker image, a git repo or a file). These parameters are:
    - `target_type` - the type of the target provided (e.g., image, git, generic, etc.)
    - `sbomversion` - the version of the SBOM provided (usually it's sha256 or sha1 hash)

    :::info
    If this parameter is set and no target is provided, the rule is disabled with a warning.
    :::
    :::info
    If `target_type` is set manually in the rule config and a target of a different type is provided, the rule is disabled with a warning.
    :::

2. The `pipeline` context group specifies parameters that can be derived from the running environment. These parameters are:
    - `context_type` - the type of the environment (e.g., local, github, etc.)
    - `git_url` - the git URL of the repository (if any)
    - `git_commit` - the git commit of the current repository state (if any)
    - `run_id` - the run ID (if any)
    - `build_num` - the build number (if any)

3. The `product` context group specifies product parameters that can be derived from the command line arguments. These parameters are:
    - `name` - the name of the product (provided to `valint` as a `--product-key` argument)
    - `product_version` - the version of the product (provided to `valint` as a `--product-version` argument)

Users can specify any combination of these three groups or a special value `none` to indicate that the parameter should not be derived automatically.
By default, the `product` group is used.
The list of groups to be used should be provided to the `<rule>.evidence.filter-by` field in the configuration file. Any value provided overrides the default list.
See the usage example below for more details.

-------------------

In addition, one can specify other parameters that they want to be matched by evidence.
In most of the rules, the following parameters would be used to define the type of statement:

| Field              | Description                                                                                                                | Examples                                                                                       |
|--------------------|----------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| `signed`           | Specifies whether the evidence is required to be signed.<br/>When set to `false`, both unsigned (statements) and signed (attestations) are accepted, and signature verification failure for the signed ones doesn't affect the rule result. | `true`, `false`                                                                                |
| `content_body_type`| Defines the content type of the attestation.                                                                                | `cyclonedx-json`, `generic`, `slsa`                                                            |
| `target_type`      | The type of the target that was used to create the evidence.                                                                | `container` for Docker images<br/>`git` for Git repositories<br/>`policy-results` for `valint` SARIFs<br/>`data` for generic data files |
| `predicate_type`   | The type of the predicate used in `generic` evidence, usually a URI.                                                      | `http://scribesecurity.com/evidence/discovery/v0.1`<br/>`http://docs.oasis-open.org/sarif/sarif/2.1.0` |

The following example requires an unsigned statement of Scribe Security discovery evidence:

```yaml
...
evidence:
  signed: false
  content_body_type: generic
  target_type: data
  predicate_type: http://scribesecurity.com/evidence/discovery/v0.1
...
```

<details>
  <summary>Full list of supported parameters</summary>

The parameters are named the same way as they are in the evidence context.

```yaml
name
product_version
labels
predicate_type
input_name
input_scheme
input_tag

content_body_type
context_type
target_type
signed

tool
tool_vendor
tool_version
format_encoding
format_type
format_version
gate_type
gate_name

sbomname
sbomgroup
sbompurl
sbomversion
sbomhashs
sbomcomponents

imageID
image_name
repoDigest
tag

git_branch
git_uuid
git_commit
git_ref
git_tag
git_url

pipeline_name
job_name
workflow
run_id
build_num
actor

target_git_brahc
target_git_commit
target_git_uuid
target_git_ref
target_git_tag
target_git_url

dir_id
dir_path

file_id
file_path

parser
event_name
target_k8s_name
target_kind
target_namespace
content_type
organization
sbomtype

warning
allow

asset_id
asset_name
asset_type
asset_platform
```

</details>

If more than one piece of evidence is found, the newest one is used.

<details>
  <summary>Usage</summary>

An example of a rule that requires signed CycloneDX SBOM evidence and uses target and product contexts would look like this:

```yaml
config-type: rule
name: "My Rule"
id: my-rule

evidence:
  signed: true
  content_body_type: "cyclonedx-json"
  target_type: "container"
  filter-by:
  - target
  - product
```

When running this rule on the `alpine:latest` image target for the `MyProduct` product of the `v1.0.0` version, the evidence lookup would be performed with the following parameters:

```json
{
 "name": "MyProduct",
 "product_version": "v1.0.0",
 "content_body_type": "cyclonedx-json",
 "signed": true,
 "predicate_type": "https://cyclonedx.org/bom/v1.5",
 "target_type": "container",
 "sbomversion": "sha256:8ca4688f4f356596b5ae539337c9941abc78eda10021d35cbc52659c74d9b443"
}
```

In this example,

- The `name` (stands for _product name_) and `product_version` fields were fetched from the `valint` input because the `filter-by: product` value was set in the rule config.
- The `sbomversion` field was set as a result of target analysis because the `filter-by: target` value was set in the rule config.
- The `content_body_type`, `target_type`, and `signed` fields were explicitly specified in the rule config.
- The `predicate_type` field was set to the default value for CycloneDX SBOMs (based on the `cyclonedx-json` value for `content_body_type`).

</details>

### Rule filtering

When running an initiative, there are several options to decide which rules will be evaluated. Some of the criteria are used by `valint` automatically based on the context, while others can be specified by the user.

The following criteria are used by `valint` automatically:

- Rules that have the `filter-by: target` value set in the config (see the [Evidence Lookup](#evidence-lookup) section) are disabled if no target is provided to the `valint verify` command.
- Rules that use some of the built-in functions for template arguments are disabled if the required arguments are not provided, see the [Built-in functions](#built-in-functions) for more details.

The only exception for both of these is when the `--all-evidence` flag is used, see the [Whole product evaluation](#whole-product-evaluation) section.

The following criteria can be specified by the user:

- The `when.gate` field is used to filter _***controls***_ by the gate type provided to the `valint verify` command using the `--gate-type` flag. When this flag is used, only controls with a matching gate and controls without a gate filter are executed. This feature operates at the _***control***_ level only.
- The `rule.labels` field is used to filter _***rules***_ by the labels provided to the `valint verify` command using the `--rule-label` flag. This feature operates at the _***rule***_ level only and excludes rules that do not have any matching labels, regardless of the control they belong to.

<details>
  <summary>Gate Filtering Example</summary>

In the following initiative example,

- The "MyBuildControl" control will be evaluated only when the `--gate-type Build` flag is used or no gate type is provided.
- The "MyDeployControl" control will be evaluated only when the `--gate-type Deploy` flag is used or no gate type is provided.
- The "MyGenericControl" control will be evaluated regardless of the gate type.

```yaml
config-type: initiative
id: "my-initiative"
name: "My Initiative"

controls:
# The following control matches the Build gate type
  - name: "Any critical or high severity vulnerability breaks the build"
    id: "MyBuildControl"
    when:
      gate: Build
    rules:
      - uses: api/scribe-api-cve@v2
        with:
          superset:
            cve:
              severity: 6
              max: 0

# The following control matches the Deploy gate type
  - name: "Root and Admin users prevent image deployment"
    id: "MyDeployControl"
    when:
      gate: Deploy
    rules:
      - uses: images/banned-users@v2
        with:
          users:
            - "root"
            - "admin"

# The following control doesn't have a gate filter and will be evaluated regardless of the gate type
  - name: "Require signed SBOM"
    id: "MyGenericControl"
    rules:
      - uses: sbom/artifact-signed@v2
```

```bash
# Running on the Build gate type
$ valint verify alpine:latest --initiative my-initiative@v2 --gate-type Build
...
INFO [my-initiative] Initiative "My Initiative" Evaluation Summary:
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [my-initiative] Initiative "My Initiative" Evaluation Summary                                                 │
├───────────────────┬──────────────────────────────────────────────────────────────┬───────────────────┬────────┤
│ CONTROL ID        │ CONTROL NAME                                                 │ RULE LIST         │ RESULT │
├───────────────────┼──────────────────────────────────────────────────────────────┼───────────────────┼────────┤
│ MyBuildControl    │ Any critical or high severity vulnerability breaks the build │ scribe-cve(pass)  │ pass   │
├───────────────────┼──────────────────────────────────────────────────────────────┼───────────────────┼────────┤
│ MyGenericControl  │ Require signed SBOM                                          │ sbom-signed(pass) │ pass   │
├───────────────────┼──────────────────────────────────────────────────────────────┼───────────────────┼────────┤
│ INITIATIVE RESULT │                                                              │                   │ PASS   │
└───────────────────┴──────────────────────────────────────────────────────────────┴───────────────────┴────────┘
```

```bash
# Running on the Deploy gate type
$ valint verify alpine:latest --initiative my-initiative@v2 --gate-type Deploy
...
INFO [my-initiative] Initiative "My Initiative" Evaluation Summary:
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [my-initiative] Initiative "My Initiative" Evaluation Summary                                            │
├───────────────────┬───────────────────────────────────────────────┬─────────────────────────────┬────────┤
│ CONTROL ID        │ CONTROL NAME                                  │ RULE LIST                   │ RESULT │
├───────────────────┼───────────────────────────────────────────────┼─────────────────────────────┼────────┤
│ MyDeployControl   │ Root and Admin users prevent image deployment │ sbom-disallowed-users(pass) │ pass   │
├───────────────────┼───────────────────────────────────────────────┼─────────────────────────────┼────────┤
│ MyGenericControl  │ Require signed SBOM                           │ sbom-signed(pass)           │ pass   │
├───────────────────┼───────────────────────────────────────────────┼─────────────────────────────┼────────┤
│ INITIATIVE RESULT │                                               │                             │ PASS   │
└───────────────────┴───────────────────────────────────────────────┴─────────────────────────────┴────────┘
```

```bash
# Running without the gate type
$ valint verify alpine:latest --initiative my-initiative@v2
...
INFO [my-initiative] Initiative "My Initiative" Evaluation Summary:
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [my-initiative] Initiative "My Initiative" Evaluation Summary                                                           │
├───────────────────┬──────────────────────────────────────────────────────────────┬─────────────────────────────┬────────┤
│ CONTROL ID        │ CONTROL NAME                                                 │ RULE LIST                   │ RESULT │
├───────────────────┼──────────────────────────────────────────────────────────────┼─────────────────────────────┼────────┤
│ MyBuildControl    │ Any critical or high severity vulnerability breaks the build │ scribe-cve(pass)            │ pass   │
├───────────────────┼──────────────────────────────────────────────────────────────┼─────────────────────────────┼────────┤
│ MyDeployControl   │ Root and Admin users prevent image deployment                │ sbom-disallowed-users(pass) │ pass   │
├───────────────────┼──────────────────────────────────────────────────────────────┼─────────────────────────────┼────────┤
│ MyGenericControl  │ Require signed SBOM                                          │ sbom-signed(pass)           │ pass   │
├───────────────────┼──────────────────────────────────────────────────────────────┼─────────────────────────────┼────────┤
│ INITIATIVE RESULT │                                                              │                             │ PASS   │
└───────────────────┴──────────────────────────────────────────────────────────────┴─────────────────────────────┴────────┘
```

</details>

<details>
  <summary>Rule Label Filtering Example</summary>

In the following initiative example, the "MyRule" rule will be evaluated only when the `--rule-label` flag is used with the `MyLabel` value or no label is provided.

```yaml
config-type: initiative
id: "my-initiative"
name: "My Initiative"

controls:
  - name: "My Control"
    rules:
      - name: "My Rule"
        id: "MyRule"
        labels:
          - "MyLabel"
        uses: sbom/blocklist-packages@v2
        with:
          blocklist:
            - "liblzma5@5.6.0"
            - "liblzma5@5.6.1"
            - "xz-utils@5.6.0"
            - "xz-utils@5.6.1"
      - name: "My Rule 2"
        id: "MyRule2"
        uses: sbom/banned-licenses@v2
        level: warning
        with:
          blocklist:
            - "GPL-2.0"
            - "GPL-3.0"
```

```bash
# Running with the rule label
$ valint verify alpine:latest --initiative my-initiative@v2 --rule-label MyLabel
...
INFO [my-initiative] Initiative "My Initiative" Evaluation Summary:
┌───────────────────────────────────────────────────────────────┐
│ [my-initiative] Initiative "My Initiative" Evaluation Summary │
├───────────────────┬───────────────┬──────────────────┬────────┤
│ CONTROL ID        │ CONTROL NAME  │ RULE LIST        │ RESULT │
├───────────────────┼───────────────┼──────────────────┼────────┤
│ My Control        │ My Control    │ MyRule(pass),    │ pass   │
├───────────────────┼───────────────┼──────────────────┼────────┤
│ INITIATIVE RESULT │               │                  │ PASS   │
└───────────────────┴───────────────┴──────────────────┴────────┘
```

```bash
# Running without the rule label
$ valint verify alpine:latest --initiative my-initiative@v2
...
INFO [my-initiative] Initiative "My Initiative" Evaluation Summary:
┌───────────────────────────────────────────────────────────────┐
│ [my-initiative] Initiative "My Initiative" Evaluation Summary │
├───────────────────┬───────────────┬──────────────────┬────────┤
│ CONTROL ID        │ CONTROL NAME  │ RULE LIST        │ RESULT │
├───────────────────┼───────────────┼──────────────────┼────────┤
│ My Control        │ My Control    │ MyRule(pass),    │ pass   │
│                   │               │ MyRule2(warning) │        │
├───────────────────┼───────────────┼──────────────────┼────────┤
│ INITIATIVE RESULT │               │                  │ PASS   │
└───────────────────┴───────────────┴──────────────────┴────────┘
```

</details>

## Advanced features

### Template arguments

Rules can have template arguments that can be used to simplify rule configuration. For example, `github/api/branch-protection@v2` relies on several arguments provided at runtime:

```yaml

...
with:
  api_token: '{{ .Args.Token }}'
  owner: '{{ .Args.Owner }}'
  repo: '{{ .Args.Repo }}'
  branch: '{{ .Args.Branch }}'
...
```

To specify those, `valint` should be run with args `--rule-args Token=MyToken,Owner=MyOwner,Repo=MyRepo,Branch=MyBranch`.

When a required template argument is not specified, the rule will be disabled with a warning.

#### Built-in functions

To simplify the rule-args input, the rules template engine has built-in functions that can be used to define the rule arguments. Another use of these functions is to disable filtering when the `--all-evidence` flag is used, see below.

List of supported functions:

- `on_target` - returns the value of the argument if the `--all-evidence` flag is not used, see below
- `asset` -- used for specifying asset labels as they are set by `platforms`, for example: `asset_name` would result in `asset=asset_name`.
- `asset_on_target` -- same as `asset`, but disables filtering when the `--all-evidence` flag is used.
- `asset_if_found` -- same as `asset`, but doesn't disable the rule if no arg value is found and uses an empty string instead.

<details>
  <summary>Example</summary>

In the following rule, the `MyAsset` input arg (specified as `--rule-args MyAsset=MyAssetValue`) is used to filter the evidence by the asset label as it is set by the `platforms` tool:

```yaml
...
with:
  defaults:
    evidence:
      labels:
        - '{{ asset .Args.MyAsset }}'
...
```

When being run with the `--rule-args MyAsset=MyAssetValue` flag, the rule will use the `asset=MyAssetValue` label for the evidence lookup.

</details>

### Whole product evaluation

One can run an initiative to verify all the existing evidences in a product. In this case, the initiative will try to find all matching evidences for every rule and verify those. To do that, the `--all-evidence` flag should be used:

```bash
valint verify --initiative my-initiative@v2 --all-evidence \
  --product-key <PRODUCT_KEY> -- product-version <PRODUCT_VERSION> \
  --scribe.client-secret <SCRIBE_TOKEN>
```

If template args are used within the initiative, they should be defined through built-in functions that disable filtering when the `--all-evidence` flag is used. For example, the following example filters evidence by label only when the `--all-evidence` flag is not used:

```yaml
...
with:
   defaults:
      evidence:
        labels:
          - '{{ on_target .Args.MyLabel }}'
...
```

Also, in this mode, the provided target doesn't affect evidence lookup, as `valint` tries to find all matching evidence for the rules.
For the rules that fail to find any evidence, the `open` result is returned.

### Rules that don't require evidence

If a rule doesn't require any evidence to be verified, the `skip-evidence` flag can be used in the rule configuration:

```yaml
...
skip-evidence: true
...
```

### Rules that require the Scribe API

If a rule requires an API call to be verified, it can use the `require-scribe-api` flag to ensure that all the uploaded attestations are processed and the API is ready to be used:

```yaml
...
require-scribe-api: true
...
```

`valint` will try to reach the Scribe API and wait for it to be ready. The waiting timeout is set by the `--timeout` flag and defaults to 2 minutes.
If the API is not ready, the rule will produce the `open` result the same way as when no evidence is found. This can be changed with the `fail-on-missing-evidence` flag, see the [Rules that should fail on missing evidence](#rules-that-should-fail-on-missing-evidence) section.

### Rules that should fail on missing evidence

By default, if no evidence for a rule is found, it returns an "open" result, meaning that there was insufficient information to decide whether there are any violations. If a rule should fail in that case, the `fail-on-missing-evidence` flag can be used:

```yaml
...
fail-on-missing-evidence: true
...
```

### Rich text support in rule results

To make rule results more readable, one can specify the `--beautify` flag at runtime. This allows `valint` to use emojis and hyperlinks in result tables.  
It affects both `valint` logs and other outputs, except for SARIF.
