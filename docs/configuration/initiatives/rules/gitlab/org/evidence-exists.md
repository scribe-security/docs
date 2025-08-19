---
sidebar_label: Require Gitlab Organization Discovery Evidence
title: Require Gitlab Organization Discovery Evidence
---  
# Require Gitlab Organization Discovery Evidence  
**Type:** Rule  
**ID:** `gitlab-org-exists`  
**Source:** [v2/rules/gitlab/org/evidence-exists.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/gitlab/org/evidence-exists.yaml)  
**Rego Source:** [evidence-exists.rego](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/gitlab/org/evidence-exists.rego)  
**Labels:** Gitlab, Organization  

Verify the Gitlab Organization exists as evidence.

:::note 
This rule requires Gitlab Organization Discovery Evidence. See [here](/docs/platforms/discover#gitlab-discovery) for more details.  
::: 
:::tip 
> Evidence **IS** required for this rule and will fail if missing.  
::: 
:::tip 
Signed Evidence for this rule **IS NOT** required by default but is recommended.  
::: 
:::warning  
Rule requires evaluation with a target. Without one, it will be **disabled** unless the `--all-evidence` flag is provided.
::: 
:::info  
Rule is scoped by product and target.  
:::  

## Usage example

```yaml
uses: gitlab/org/evidence-exists@v2
```

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

