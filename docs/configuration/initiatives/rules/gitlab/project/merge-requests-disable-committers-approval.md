---
sidebar_label: Disable Committers' Approval for Merge Requests in GitLab
title: Disable Committers' Approval for Merge Requests in GitLab
---  
# Disable Committers' Approval for Merge Requests in GitLab  
**Type:** Rule  
**ID:** `gitlab-project-merge-requests-disable-committers-approval`  
**Source:** [v2/rules/gitlab/project/merge-requests-disable-committers-approval.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/gitlab/project/merge-requests-disable-committers-approval.yaml)  
**Rego Source:** [merge-requests-disable-committers-approval.rego](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/gitlab/project/merge-requests-disable-committers-approval.rego)  
**Labels:** Gitlab, Project  

Verify `merge_requests_disable_committers_approval` is set for the GitLab project.

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
uses: gitlab/project/merge-requests-disable-committers-approval@v2
with:
  merge_requests_disable_committers_approval: false
```

## Mitigation  
Ensure that the binary Merge Requests Disable Committers Approval field is set for the GitLab project to prevent unauthorized approvals.


## Description  
This rule ensures that the binary field Merge Requests Disable Committers Approval is set for the GitLab project.
It performs the following steps:

1. Checks the settings of the GitLab project.
2. Verifies that the binary field `merge_requests_disable_committers_approval` is set.

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
| merge_requests_disable_committers_approval | boolean | False | The binary field to enforce for merge requests committers' approval. | False |

