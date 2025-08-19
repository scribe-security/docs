---
sidebar_label: Require Bitbucket Repository Discovery Evidence
title: Require Bitbucket Repository Discovery Evidence
---  
# Require Bitbucket Repository Discovery Evidence  
**Type:** Rule  
**ID:** `bb-repo-exists`  
**Source:** [v2/rules/bitbucket/repository/evidence-exists.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/bitbucket/repository/evidence-exists.yaml)  
**Rego Source:** [evidence-exists.rego](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/bitbucket/repository/evidence-exists.rego)  
**Labels:** Bitbucket, Repository  

Verify the Bitbucket Repository exists as evidence.

:::note 
This rule requires Bitbucket Repository Discovery Evidence. See [here](/docs/platforms/discover#bitbucket-discovery) for more details.  
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
uses: bitbucket/repository/evidence-exists@v2
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
| asset_type | repo |

