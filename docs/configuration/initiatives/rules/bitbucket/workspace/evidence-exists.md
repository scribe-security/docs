---
sidebar_label: Require Bitbucket Workspace Discovery Evidence
title: Require Bitbucket Workspace Discovery Evidence
---  
# Require Bitbucket Workspace Discovery Evidence  
**Type:** Rule  
**ID:** `bb-workspace-exists`  
**Source:** [v2/rules/bitbucket/workspace/evidence-exists.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/bitbucket/workspace/evidence-exists.yaml)  
**Rego Source:** [evidence-exists.rego](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/bitbucket/workspace/evidence-exists.rego)  
**Labels:** Bitbucket, Workspace  

Verify the Bitbucket Workspace exists as evidence.

:::note 
This rule requires Bitbucket Workspace Discovery Evidence. See [here](/docs/platforms/discover#bitbucket-discovery) for more details.  
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
uses: bitbucket/workspace/evidence-exists@v2
```

## Evidence Requirements  
| Field | Value |
|-------|-------|
| filter-by | ['product', 'target'] |
| signed | False |
| content_body_type | generic |
| target_type | data |
| predicate_type | http://scribesecurity.com/evidence/discovery/v0.1 |
| asset_platform | bitbucket |
| asset_type | workspace |

