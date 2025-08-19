---
sidebar_label: Verify secret_scanning_enabled_for_new_repositories setting
title: Verify secret_scanning_enabled_for_new_repositories setting
---  
# Verify secret_scanning_enabled_for_new_repositories setting  
**Type:** Rule  
**ID:** `github-org-secret-scanning`  
**Source:** [v2/rules/github/org/secret-scanning.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/github/org/secret-scanning.yaml)  
**Rego Source:** [secret-scanning.rego](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/github/org/secret-scanning.rego)  
**Labels:** GitHub, Organization  

Verify secret scanning is configured for new repositories in the GitHub organization.

:::note 
This rule requires Github Organization Discovery Evidence. See [here](/docs/platforms/discover#github-discovery) for more details.  
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
uses: github/org/secret-scanning@v2
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

## Rule Parameters (`with`)  
| Parameter | Default |
|-----------|---------|
| desired_value | True |

