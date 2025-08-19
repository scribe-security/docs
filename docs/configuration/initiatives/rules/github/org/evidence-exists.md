---
sidebar_label: Require GitHub Organization Discovery Evidence
title: Require GitHub Organization Discovery Evidence
---  
# Require GitHub Organization Discovery Evidence  
**Type:** Rule  
**ID:** `github-org-exists`  
**Source:** [v2/rules/github/org/evidence-exists.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/github/org/evidence-exists.yaml)  
**Rego Source:** [evidence-exists.rego](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/github/org/evidence-exists.rego)  
**Labels:** GitHub, Organization  

Verify the GitHub Organization exists as evidence.

:::note 
This rule requires Github Organization Discovery Evidence. See [here](/docs/platforms/discover#github-discovery) for more details.  
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
uses: github/org/evidence-exists@v2
```

## Evidence Requirements  
| Field | Value |
|-------|-------|
| filter-by | ['product', 'target'] |
| signed | False |
| content_body_type | generic |
| target_type | data |
| predicate_type | http://scribesecurity.com/evidence/discovery/v0.1 |
| asset_platform | github |
| asset_type | organization |

