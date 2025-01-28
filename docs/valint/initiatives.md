---
sidebar_label: "Adopting intiatives"
title: Adopting intiatives
author: viktor kartashov - Scribe
sidebar_position: 5
date: December 10, 2024
geometry: margin=2cm
toc_max_heading_level: 3
---

## What is an initiative?

Each `initiative` proposes to enforce a set of requirements (aka `rules`) grouped into `controls` that your supply chain must comply with. The outcome of an initiative evaluation is an initiative result attestation, a report that details the rule evaluatoin results and references to the verified assets and evidences.  

An initiative consists of a set of `controls`, each of which in turn consists of a set of `rules` and is verified if all of them are evaluated and verified.
A `rule` is verified if ANY `evidence` is found that complies with the `rule` configuration and setting.

Rules can reuse from the existing ones from a bundle or be defined inline.

## Initiative config format

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
    content_body_type: content_body_type>
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

#### `id`

- **Type:** String
- **Required:** No
- **Description:** A unique identifier for the initiative. Cannot contain the `::` symbol. If no ID is provided, it is generated from the name.

#### `name`

- **Type:** String
- **Required:** Yes
- **Description:** The name of the initiative.

#### `version`

- **Type:** String
- **Required:** No
- **Description:** The version of the initiative.

#### `description`

- **Type:** String
- **Required:** No
- **Description:** A brief description of the initiative.

#### `help`

- **Type:** String (URL)
- **Required:** No
- **Description:** A URL pointing to the help or documentation for the initiative.

#### `defaults`

- **Type:** Object
- **Required:** No
- **Description:** Optional parameters to override the existing evidence lookup and other parameters for each rule in the initiative.

##### `defaults.level`

- **Type:** String
- **Required:** No
- **Description:** Rule level to use for all rules in the initiative

##### `defaults.evidence`

- **Type:** Object
- **Required:** No
- **Description:** Evidence lookup parameters. Any parameters supported by the `rule.evidence` field can be used here.

#### `env`

- **Type:** Object
- **Required:** No
- **Description:** File-wise environment variables for the template engine.

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
- **Description:** A unique identifier for the control. Cannot contain the `::` symbol. If no ID is provided, it is generated from the name.

##### `controls[].description`

- **Type:** String
- **Required:** No
- **Description:** A brief description of the control.

##### `controls[].disable`

- **Type:** Boolean
- **Required:** No
- **Description:** Indicates whether the control should be disabled. If set to `true`, the control will not be evaluated.

##### `controls[].when`

- **Type:** Object
- **Required:** No
- **Description:** Optional filters for when the control should be run.

###### `controls[].when.gate`

- **Type:** String
- **Required:** No
- **Description:** The type of gate to run the control on.

##### `controls[].rules`

- **Type:** Array of Objects
- **Description:** A list of rules for the control. For the details, see the [Rules](#rule-config-format) section below.

> For `valint` configuration details, see the [configuration](./configuration.md) section.
>
> For PKI configuration, see the [attestations](./attestations.md) section.

An example of an initiative could be:

```yaml
config-type: initiative
required-valint-version: "2.0.0"
id: my-initiative
name: "My Initiative"
version: "v1.0.0"
description: "This initiative enforces a couple of simple checks on a Docker image"

defaults:
  evidence:
    signed: true

controls:
    - name: "My Control"
      when:
        gate: "Build"
      rules:
          uses: sbom/blocklist-packages@v2/rules
          with:
            blocklist:
                - "liblzma5@5.6.0"
                - "liblzma5@5.6.1"
                - "xz-utils@5.6.0"
                - "xz-utils@5.6.1"
        - name: "my-rule-2"
          uses: sbom/banned-licenses@v2/rules
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
          uses: sbom/evidence-exists@v2/rules
```

## Rule config format

Every rule that is used separately via the `--rule` arg or as part of an initiative should be defined as YAML:

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
- **Description:** Specifies the type of configuration. For rules, this should be set to `rule`.

#### `required-valint-version`

- **Type:** String
- **Required:** No
- **Description:** The minimum version of Valint required to run the initiative.
- **Example:** `"2.0.0"`

#### `disable`

- **Type:** Boolean
- **Required:** No
- **Description:** Indicates whether the rule should be disabled. If set to `true`, the rule will not be evaluated.

#### `id`

- **Type:** String
- **Required:** No
- **Description:** A unique identifier for the rule. Cannot contain the `::` symbol. Must be unique within the initiative. If no ID is provided, it is generated from the name.

#### `name`

- **Type:** String
- **Required:** Yes
- **Description:** The name of the rule. This should be unique within the initiative.

#### `path`

- **Type:** String
- **Required:** No
- **Description:** The path to a custom external script, if used. Should be relative to the rule file.

#### `uses`

- **Type:** String
- **Required:** No
- **Description:** A reference to a rule in a bundle that should be used as a base rule. The format is `<bundle-path>@<version>/rules`.

#### `description`

- **Type:** String
- **Required:** No
- **Description:** A brief description of the rule.

#### `help`

- **Type:** String (URL)
- **Required:** No
- **Description:** A URL pointing to the help or documentation for the rule.

#### `labels`

- **Type:** Array of Strings
- **Required:** No
- **Description:** A list of user-specified labels for the rule itself.

#### `level`

- **Type:** String
- **Required:** No
- **Description:** The level of the rule. Can be `error`, `warning`, or `note`. Default is `error`.

#### `require-scribe-api`

- **Type:** Boolean
- **Required:** No
- **Description:** Indicates whether the Scribe API is required.

#### `fail-on-missing-evidence`

- **Type:** Boolean
- **Required:** No
- **Description:** Indicates whether the rule should fail if evidence is missing. If set to `false` (default), the rule will have the open result if no evidence is found.

#### `skip-evidence`

- **Type:** Boolean
- **Required:** No
- **Description:** Indicates whether the rule should skip evidence downloading and go straight to the rule evaluation. Can be helpful for rules that don't require evidence, like API rules.

#### `aggregate-results`

- **Type:** Boolean
- **Required:** No
- **Description:** Indicates whether the rule results should be aggregated. If set to `true`, the rule will return a single result for all the violations found.

#### `evidence`

- **Type:** Object
- **Required:** No
- **Description:** Evidence lookup parameters. Any field from the evidence context can be used here.

##### `evidence.filter-by`

- **Type:** List of Strings
- **Required:** No
- **Description:** A list of parameters in the environment to filter the evidence by (see [Evidence Lookup](#evidence-lookup)).

#### `with`

- **Type:** Object
- **Required:** No
- **Description:** Rule input, depending on the rule script.

Examples of rules and initiatives can be found in the [sample-policies bundle](https://github.com/scribe-public/sample-policies).

## How to adopt an initiative?

An initiative is defined as a file that can be consumed locally or from a git bundle. To run an initiative, one first needs to create the required evidences:

1. Generate an SBOM

```bash
valint bom <image>:<tag> --product-key <product-key> --product-version <product-version> -P <scribe-client-secret>
```

2. Generate SLSA Provenance

```bash
valint slsa <image>:<tag> --product-key <product-key> --product-version <product-version> -P <scribe-client-secret>
```

3. Create generic evidences from 3rd party tool reports:

```bash
valint evidence <path-to-report> --product-key <product-key> --product-version <product-version> -P <scribe-client-secret>
```

-------------------
Then, a local initiative can be run with the following command:

```bash
valint verify --initiative initiative.yaml --product-key <product-key> --product-version <product-version> -P <scribe-client-secret>
```

To run an initiative from a git bundle, use the following command:

```bash
valint verify --initiative my-initiative@v2/initiatives --product-key <product-key> --product-version <product-version> -P <scribe-client-secret>
```

To run a part of an initiative filtered by gate type, use the following command:

```bash
valint verify --initiative my-initiative@v2/initiatives --product-key <product-key> --product-version <product-version> -P <scribe-client-secret> --gate-type Build --gate-name "Build of My Product"
```

## Using private bundle

Rules and initiatives can be provided locally or reused either from the public Scribe bundle or a private bundle managed by the user. By default, the public Scribe bundle is used.
To use a private bundle instead, the following rules should be followed:

1. The private bundle should be a git repository referenced in `valint` command with the `--bundle` flag, for example:

  ```bash
  valint verify ... --bundle https://github.com/scribe-public/sample-policies ...
  ```

2. If git authentication is required, it can be provided either in the git url or through the `--bundle-auth` flag.

3. A specific branch, tag or commit can be provided using the `--bundle-branch`, `--bundle-tag` or `--bundle-commit` flags respectively.

4. File structure within the bundle is up to the administrator, but when referencing the rules in initiative configs, the path should be relative to the bundle root and at least one level deep.
For example, this is how to reference a rule from the public Scribe bundle:

  ```yaml
  ...
  rules:
    - uses: sbom/blocklist-packages@v2/rules
  ...
  ```

Here `sbom/blocklist-packages@v2/rules` means that the rule path within the bundle is`v2/rules/sbom/blocklist-packages.yaml`.
Note that the `.yaml` extension is omitted in the path and replaced with `@v2`, which is used here as a version tag.

## Rule configuration

Rules are defined as a combination of a `.yaml` configuration file and a `.rego` script. The `.yaml` file contains the rule configuration, while the `.rego` script contains the rule logic.
The rule configuration is described above along with the initiative configuration.

The rego script gets two inputs: the verifying evidence as `input.evidence` and configurable args as `input.config.args`, the latter is specified in the rule config as `with` object.

Rego script should produce an output object of the following format:

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

## Advanced features

### Evidence Lookup

In order to run a policy rule, `valint` requires relevant evidence, which can be found in a storage using a number of parameters.
These parameters can be set manually by the user or automatically derived from the context.
Parameters that can be derived automatically are categorized into three context groups: "target," "pipeline", and "product".
By default, the "target" and "product" groups are enabled for each rule.

1. `target` context group specifies parameters that can be derived from the provided target. Those parameters are:
    * `target_type` - the type of the target provided (e.g., image, git, generic etc.)
    * `sbomversion` - the version of the SBOM provided (usually it's sha256 or sha1 hash)

    > If this parameter is set and no target provided, the rule is disabled with a warning.

2. `pipeline` context group specifies parameters that can be derived from the running environment. Those parameters are:
    * `context_type` - type of the environment (e.g., local, github, etc.)
    * `git_url` - git url of the repository (if any)
    * `git_commit` - git commit of the current repository state (if any)
    * `run_id` - run id
    * `build_num` - build number

3. `product` context group specifies product parameters that can be derived from the command line arguments. Those parameters are:
    * `name` - name of the product
    * `product_version` - version of the product
    * `predicate_type` - type of the predicate (e.g., [CycloneDX](https://cyclonedx.org/bom), [SLSA](https://slsa.dev/provenance/v0.1), etc.)

User can specify any combination of these three groups or a special value `none` to indicate that the parameter should not be derived automatically.
By default `target` and `product` groups are used.
The list of groups to be used should be provided to the `<rule>.evidence.filter-by` field in the configuration file.

In addition, one can manually specify any parameters that they want to be matched by an evidence. For example, these can be `git_url` or `timestamp`.

If more than one evidence is found, the newest one is used.

<details>
  <summary> Usage </summary>

An example of using the `target` context group and a specific timestamp value is shown below:

```yaml
config-type: rule
name: my_rule
evidence:
  signed: true
  content_body_type: cyclonedx
  timestamp: "2023-11-16T09:46:25+02:00" # manually specified timestamp
  filter-by:
    - target
```

</details>

### Template arguments

Rules can have template arguments that can be used to simplify the rule configuration. For example, `github/api/branch-protection@v2/rules` relies on several arguments provided in the runtime:

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

When required template arg is not specified, the rule will be disabled with a warning.

#### Built-in functions

To simplify the rule-args input, the rules template engine has built-in functions that can be used to define the rule arguments. Another use of such functions is to disable filtering when the `--all-evidence` flag is used, see below.

List of supported functions:

* `on_target` - returns the value of the argument if the `--all-evidence` flag is not used, see below
* `asset` -- used for specifying asset labels as they are set by `platforms`, for example: `asset_name` would result in `asset=asset_name`
* `asset_on_target` -- same as `asset`, but disables filtering when the `--all-evidence` flag is used
* `asset_if_found` -- same as `asset`, but doesn't disable the rule if no arg value is found and uses an empty string instead

### Whole product evaluation

One can run an initiative to verify all the existing evidences in a product. In this case, the initiative will try to find all matching evidences for every rule and verify those. To do that, the `--all-evidence` flag should be used:

```bash
valint verify --initiative my-initiative@v2/initiatives --product-key <product-key> --product-version <product-version> --all-evidence
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

### Rules that don't require evidence

If a rule doesn't require any evidence to be verified, the `skip-evidence` flag can be used in the rule config:

```yaml
...
skip-evidence: true
...
```

### Rules that require Scribe API

If a rule requires an API call to be verified, it can use the `require-scribe-api` flag to ensure that all the uploaded attestations are processed and the API is ready to be used:

```yaml
...
require-scribe-api: true
...
```

### Rules that should fail on missing evidence

By default, if no evidence for a rule found, it returns an "open" result, meaning that there was insufficient information to decide whether there are any violations. If a rule should fail in that case, the `fail-on-missing-evidence` flag can be used:

```yaml
...
fail-on-missing-evidence: true
...
```

### Unicode symbols in rule results

To make the rule results more readable, one can use Unicode emojis in the rule results by specifying the `--allow-unicode` flag in the runtime. THis would result in replacing rule levels and results in `valint` logs with emojis.
