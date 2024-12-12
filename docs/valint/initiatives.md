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

Initiative is a representation of a supply chain security framework. It is a collection of controls, rules, and gates that define the security policy for a product or a set of products. Initiatives are versioned and can be adopted by multiple products.

### Initiative config format

```yaml
config-type: initiative
id: initiative-id
name: "Initiative name"
version: "1.0.0"
description: "Initiative description"
url: <http://help_uri>

# optional set of params to override the existing evidence lookup params
# for each rule in the initiative
defaults:
    evidence:
        signed: true

controls:
    - name: "Control-1"
      description: "Control description"
      when: # optional filters
        gate: "Build" # type of gate to run the control on
      rules:
        - name: "my-rule-1"
          uses: sbom/blocklist-packages@v2/rules # reuse an existing rule from the bundle
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
        description: "Control description"
        when:
            gate: "Deploy"
        rules:
            - name: "my-rule-3"
            uses: sbom/evidence-exists@v2/rules
```

Fields `id` and `name` are required. The `version` field is optional and can be used to easily track the changes in the initiative.
The `url` field is optional and can be used to provide a link to the documentation.

`id` for the initiative/control/rule can be specified by the user, but they cannot contain forward slashes `/`.

Each initiative can have one or more controls. Each control can have one or more rules. Rules can be reused from the existing rule in the bundle or defined inline.

### How to adopt an initiative?

An initiative is defined as a file that can be consumed locally or from a git bundle. To run the initiative from a local file, use the following command:

```bash
valint verify --initiative initiative.yaml --product-key <product-key> --product-version <product-version>
```

To run an initiative from a git bundle, use the following command:

```bash
valint verify --initiative my-initiative@v2/initiatives --product-key <product-key> --product-version <product-version>
```

To run a part of an initiative filtered by gate, use the following command:

```bash
valint verify --initiative my-initiative@v2/initiatives --product-key <product-key> --product-version <product-version> --gate-type Build --gate-name "Build of My Product"
```

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
