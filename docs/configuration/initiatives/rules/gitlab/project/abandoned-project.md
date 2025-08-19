---
sidebar_label: Verify Project Activity
title: Verify Project Activity
---  
# Verify Project Activity  
**Type:** Rule  
**ID:** `gitlab-project-abandoned-project`  
**Source:** [v2/rules/gitlab/project/abandoned-project.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/gitlab/project/abandoned-project.yaml)  
**Rego Source:** [abandoned-project.rego](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/gitlab/project/abandoned-project.rego)  
**Labels:** Gitlab, Project  

Verify the GitLab project is active for a specified duration.

:::note 
This rule requires Gitlab Project Discovery Evidence. See [here](/docs/platforms/discover#gitlab-discovery) for more details.  
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
uses: gitlab/project/abandoned-project@v2
with:
  inactive_for_days: 30
```

## Mitigation  
Ensure that the GitLab project is active for the specified duration to prevent project abandonment.


## Description  
This rule ensures that the GitLab project is active for a specified duration.
It performs the following steps:

1. Checks the settings of the GitLab project.
2. Verifies that the project has been active for the specified duration.

**Evidence Requirements:**
- Evidence must be provided by the Scribe Platform's CLI tool through scanning GitLab project resources.

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

## Input Definitions  
| Parameter | Type | Required | Description | Default |
|-----------|------|----------|-------------| --------|
| inactive_for_days | number | False | Number of days the project has been inactive. | 30 |

