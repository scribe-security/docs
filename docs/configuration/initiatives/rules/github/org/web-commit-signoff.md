---
sidebar_label: Verify GitHub Organization Requires Signoff on Web Commits
title: Verify GitHub Organization Requires Signoff on Web Commits
---  
# Verify GitHub Organization Requires Signoff on Web Commits  
**Type:** Rule  
**ID:** `github-org-web-commit-signoff`  
**Source:** [v2/rules/github/org/web-commit-signoff.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/github/org/web-commit-signoff.yaml)  
**Rego Source:** [web-commit-signoff.rego](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/github/org/web-commit-signoff.rego)  
**Labels:** GitHub, Organization  

Verify contributors sign commits through the GitHub web interface.

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
uses: github/org/web-commit-signoff@v2
```

## Mitigation  
Ensure that the Web Commit Signoff setting under the GitHub organization is enabled to require signoff on all web-based commits, enhancing security and accountability.


## Description  
This rule checks if the `web_commit_signoff` setting is enabled to ensure all web-based commits are signed off.
It performs the following steps:

1. Checks the web commit signoff settings of the GitHub organization.
2. Verifies that the web commit signoff setting is enabled.

**Evidence Requirements:**
- Evidence must be provided by the Scribe Platform's CLI tool through scanning GitHub organization resources.

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

