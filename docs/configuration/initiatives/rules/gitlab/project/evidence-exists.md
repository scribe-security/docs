---
sidebar_label: Require Gitlab Project Discovery Evidence
title: Require Gitlab Project Discovery Evidence
---  
# Require Gitlab Project Discovery Evidence  
**Type:** Rule  
**ID:** `gitlab-project-exists`  
**Source:** [v2/rules/gitlab/project/evidence-exists.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/gitlab/project/evidence-exists.yaml)  
**Rego Source:** [evidence-exists.rego](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/gitlab/project/evidence-exists.rego)  
**Labels:** Gitlab, Project  

Verify the Gitlab Project exists as evidence.

:::note 
This rule requires Gitlab Project Discovery Evidence. See [here](/docs/platforms/discover#gitlab-discovery) for more details.  
::: 
:::tip 
> Evidence **IS** required for this rule and will fail if missing.  
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
uses: gitlab/project/evidence-exists@v2
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
| asset_type | repo |

