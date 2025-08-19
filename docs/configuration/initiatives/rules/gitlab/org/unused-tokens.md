---
sidebar_label: Forbid Unused Tokens in GitLab Organization
title: Forbid Unused Tokens in GitLab Organization
---  
# Forbid Unused Tokens in GitLab Organization  
**Type:** Rule  
**ID:** `gitlab-org-unused-tokens`  
**Source:** [v2/rules/gitlab/org/unused-tokens.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/gitlab/org/unused-tokens.yaml)  
**Rego Source:** [unused-tokens.rego](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/gitlab/org/unused-tokens.rego)  
**Labels:** Gitlab, Organization  

Verify there are no unused GitLab organization tokens.

:::note 
This rule requires Gitlab Organization Discovery Evidence. See [here](/docs/platforms/discover#gitlab-discovery) for more details.  
::: 
:::tip 
Signed Evidence for this rule **IS NOT** required by default but is recommended.  
::: 
:::warning  
Rule requires evaluation with a target or an asset input. Without one, it will be **disabled** unless the `--all-evidence` flag is provided.
::: 
:::info  
Rule is scoped by product and target.  
:::  

## Usage example

```yaml
uses: gitlab/org/unused-tokens@v2
with:
  unused_for_days: 90
```

## Mitigation  
Ensure that no GitLab organization tokens are unused to prevent service disruption.


## Description  
This rule ensures that no GitLab organization tokens are unused.
It performs the following steps:

1. Checks the settings of the GitLab organization.
2. Verifies that no tokens are unused.

**Evidence Requirements:**
- Evidence must be provided by the Scribe Platform's CLI tool through scanning GitLab organization resources.

## Evidence Requirements  
| Field | Value |
|-------|-------|
| filter-by | ['product', 'target'] |
| signed | False |
| content_body_type | generic |
| target_type | data |
| predicate_type | http://scribesecurity.com/evidence/discovery/v0.1 |
| asset_platform | gitlab |
| asset_type | organization |

## Input Definitions  
| Parameter | Type | Required | Description | Default |
|-----------|------|----------|-------------| --------|
| unused_for_days | number | False | Number of days before a token is considered unused. | 90 |

