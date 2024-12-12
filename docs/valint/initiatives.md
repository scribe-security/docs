---
sidebar_label: "Adopting intiatives"
title: Adopting intiatives
author: viktor kartashov - Scribe
sidebar_position: 5
date: December 10, 2024
geometry: margin=2cm
---

## Initiatives

### What is an initiative?

Each `initiative` proposes to enforce a set of requirements (aka `rules`) grouped into `controls` that your supply chain must comply with. The outcome of an initiative evaluation is an initiative result attestation, a report that details the rule evaluatoin results and references to the verified assets and evidences.  

An initiative consists of a set of `controls`, each of which in turn consists of a set of `rules` and is verified if all of them are evaluated and verified.
A `rule` is verified if ANY `evidence` is found that complies with the `rule` configuration and setting.

Rules can be reused from the existing rule in the bundle or defined inline.

### Initiative config format

```yaml
config-type: initiative
id: <initiative-id>
name: <initiative-name>
version: <initiative-version>
description: <initiative-description>
url: <http://help_uri>

# optional set of params to override the existing evidence lookup params
# for each rule in the initiative
defaults:
  labels: []
  evidence:
    signed: false
    content_body_type: content_body_type>
    filter-by: []

env: # File-wise environment variables for the template engine (see below)
  <ENV_VAR_NAME>: <value>

controls:
    - name: <control-name>
      id: <control-id> # if no ID is provided, the ID is generated from the name
      description: <control-description>
      when: # optional filters
        gate: <gate-type> # type of gate to run the control on
      rules:
        - name: <rule-name>
          id: <rule-id> # if no ID is provided, the ID is generated from the name
          path: <path_to_rego> # specify if a custom external script is used
          uses: <bundle-rule-reference> # reuse an existing rule from the bundle
          description: <rule-description>
          aggregate-results: false # Aggregate all of the rule violations to a single SARIF result
          labels: [] # list of user-specified labels
          evidence: #Evidence lookup parameters
            signed: true | false
            content_body_type: <content_body_type>
            filter-by: [] # A group of Context fields to use for the evidence lookup
          with: {} # rule input, depending on the rule type
```

> Fields `id` and `name` are required. The `version` field is optional and can be used to easily track the changes in the initiative.
>
> The `url` field is optional and can be used to provide a link to the documentation.
>
> `id` for the initiative/control/rule can be specified by the user, but they cannot contain forward slashes `/`.

> For configuration details, see the [configuration](./configuration.md) section.
>
> For PKI configuration, see the [attestations](https://scribe-security.netlify.app/docs/valint/attestations) section.

An example of an initiative could be:

```yaml
config-type: initiative
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

More examples of rules and initiatives can be found in the [sample-policies bundle](https://github.com/scribe-public/sample-policies).

### How to adopt an initiative?

An initiative is defined as a file that can be consumed locally or from a git bundle. To run the initiative from a local file, first one needs to create the required evidences:

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
Then, the initiative can be run with the following command:

```bash
valint verify --initiative initiative.yaml --product-key <product-key> --product-version <product-version> -P <scribe-client-secret>
```

To run an initiative from a git bundle, use the following command:

```bash
valint verify --initiative my-initiative@v2/initiatives --product-key <product-key> --product-version <product-version> -P <scribe-client-secret>
```

To run a part of an initiative filtered by gate, use the following command:

```bash
valint verify --initiative my-initiative@v2/initiatives --product-key <product-key> --product-version <product-version> -P <scribe-client-secret> --gate-type Build --gate-name "Build of My Product"
```

### Using private bundle

Rules and initiatives can be provided locally, reused from the public Scribe bundle or from a private bundle. To use a private bundle, the following rules should be followed:

1. The private bundle should be a git repository referenced in `valint` command with the `--bundle` flag, for example:

```bash
valint verify ... --bundle https://github.com/scribe-public/sample-policies ...
```

2. If git authentication is required, it can be provided either in the git url or through the `--bundle-auth` flag.

3. A specific branch, tag or commit can be specified with the `--bundle-branch`, `--bundle-tag` or `--bundle-commit` flags respectively.

4. File structure within the bundle is up to the administrator, but when referencing the rules in initiative configs, the path should be relative to the bundle root and at least one level deep, for example:

```yaml
...
rules:
  - uses: sbom/blocklist-packages@v2/rules
...
```

means that the rule path within the bundle is `v2/rules/sbom/blocklist-packages.yaml`.
Note that the `.yaml` extension is omitted in the path and replaced with `@v2`, which is used here as a version tag.

### Additional features

#### Template arguments

Rules can have template arguments that can be used to simplify the rule configuration. For example, `github/api/branch-protection@v2/rules` relies on several arguments provided in the runtime:

```yaml

...
with:
  api_token: '{{ .Args.Token }}'
  owner: '{{ .Args.Owner }}'
  repo: '{{ .Args.Repo }}'
  branch: '{{ .Args.Branch }}
...
```

To specify those, `valint` should be run with args `--rule-args Token=MyToken,Owner=MyOwner,Repo=MyRepo,Branch=MyBranch`.

When required template arg is not specified, the rule will be disabled with a warning.

##### Built-in functions

To simplify the rule-args input, the rules template engine has built-in functions that can be used to define the rule arguments. Another use of such functions is to disable filtering when the `--all-evidence` flag is used, see below.

List of supported functions:

* `on_target` - returns the value of the argument if the `--all-evidence` flag is not used, see below
* `asset` -- used for specifying asset labels as they are set by `platforms`, for example: `asset_name` would result in `asset=asset_name`
* `asset_on_target` -- same as `asset`, but disables filtering when the `--all-evidence` flag is used
* `asset_if_found` -- same as `asset`, but doesn't disable the rule if no arg value is found and uses an empty string instead

#### Whole product evaluation

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

#### Rules that don't require evidence

If a rule doesn't require any evidence to be verified, the `skip-evidence` flag can be used in the rule config:

```yaml
...
skip-evidence: true
...
```

#### Rules that require Scribe API

If a rule requires an API call to be verified, it can use the `require-scribe-api` flag to ensure that all the uploaded attestations are processed and the API is ready to be used:

```yaml
...
require-scribe-api: true
...
```

#### Rules that should fail on missing evidence

By default, if no evidence for a rule found, it returns an "open" result, meaning that there was insufficient information to decide whether there are any violations. If a rule should fail in that case, the `fail-on-missing-evidence` flag can be used:

```yaml
...
fail-on-missing-evidence: true
...
```

#### Unicode symbols in rule results

To make the rule results more readable, one can use Unicode emojis in the rule results by specifying the `--allow-unicode` flag in the runtime. THis would result in replacing rule levels and results in `valint` logs with emojis.
