---
sidebar_label: Repo Workflows and Pipelines Discovered
title: Repo Workflows and Pipelines Discovered
---  
# Repo Workflows and Pipelines Discovered  
**Type:** Rule  
**ID:** `workflows-discovered`  
**Source:** [v2/rules/github/repository/workflows-discovered.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/github/repository/workflows-discovered.yaml)  
**Rego Source:** [workflows-discovered.rego](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/github/repository/workflows-discovered.rego)  
**Labels:** GitHub, Repository  

Ensure that repository pipelines discovery was not skipped.

:::note 
This rule requires Github Repository Discovery Evidence. See [here](/docs/platforms/discover#github-discovery) for more details.  
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
uses: github/repository/workflows-discovered@v2
```

## Mitigation  
Ensure not to use the `--workflow.skip` flag when running the Scribe Platforms CLI tool for repository scans.


## Description  
This rule checks that the repository pipelines discovery was not skipped by verifying Scribe Platforms CLI tool configuration
used for the repository scan.

## Evidence Requirements  
| Field | Value |
|-------|-------|
| filter-by | ['product', 'target'] |
| signed | False |
| content_body_type | generic |
| target_type | data |
| predicate_type | http://scribesecurity.com/evidence/discovery/v0.1 |
| asset_platform | github |
| asset_type | repo |

