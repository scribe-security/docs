---
sidebar_label: Pull request approval policy check for GitHub repository
title: Pull request approval policy check for GitHub repository
---  
# Pull request approval policy check for GitHub repository  
**Type:** Rule  
**ID:** `github-repo-pr-approval`  
**Source:** [v2/rules/github/repository/approvals-policy-check.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/github/repository/approvals-policy-check.yaml)  
**Rego Source:** [approvals-policy-check.rego](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/github/repository/approvals-policy-check.rego)  
**Labels:** Blueprint, GitHub, Repository  

Verify the repository's pull request approval policy

:::note 
This rule requires Github Repository Discovery Evidence. See [here](/docs/platforms/discover#github-discovery) for more details.  
::: 
:::tip 
Signed Evidence for this rule **IS NOT** required by default but is recommended.  
::: 
:::warning  
Rule requires evaluation with a target. Without one, it will be **disabled** unless the `--all-evidence` flag is provided.
::: 

## Usage example

```yaml
uses: github/repository/approvals-policy-check@v2
with:
  approvals_required_min: 1
```

## Mitigation  
Ensure that the repository's PR approval policy complies with requirements to prevent unauthorized merges.


## Description  
This rule ensures that the repository's PR approval policy complies with requirements.
It performs the following steps:

1. Checks the settings of the GitHub repository.
2. Verifies that the repository's PR approval policy requires a minimum number of approvals as specified in the 'approvals_required_min' field.

**Evidence Requirements:**
- Evidence must be provided by the Scribe Platform's CLI tool through scanning GitHub repository resources.

## Evidence Requirements  
| Field | Value |
|-------|-------|
| signed | False |
| content_body_type | generic |
| target_type | data |
| predicate_type | http://scribesecurity.com/evidence/discovery/v0.1 |
| asset_platform | github |
| asset_type | repo |
| asset_name | `{{- if eq .Context.asset_type "repo" -}} {{- on_target .Context.asset_name -}} {{- else -}} {{- on_target nil -}} {{- end -}}` |

## Input Definitions  
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| approvals_required_min | number | True | Minimum number of approvals required for pull requests. |

