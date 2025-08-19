---
sidebar_label: Verify that members can create private repositories setting is configured
title: Verify that members can create private repositories setting is configured
---  
# Verify that members can create private repositories setting is configured  
**Type:** Rule  
**ID:** `github-org-create-private-repos`  
**Source:** [v2/rules/github/org/create-private-repos.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/github/org/create-private-repos.yaml)  
**Rego Source:** [create-private-repos.rego](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/github/org/create-private-repos.rego)  
**Labels:** GitHub, Organization  

Verify only allowed users can create private repositories in the GitHub organization.

:::note 
This rule requires Github Organization Discovery Evidence. See [here](/docs/platforms/discover#github-discovery) for more details.  
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
uses: github/org/create-private-repos@v2
with:
  allowed_users:
    - "user1"
    - "user2"
```

## Mitigation  
Ensures that only approved users can create private repositories in the GitHub organization, reducing the risk of unauthorized repository creation.


## Description  
This rule ensures that only users specified in the allowed list can create private repositories in the GitHub organization.
Note: this setting is supported only in GitHub Enterprise.
It performs the following steps:

1. Iterates over the users in the GitHub organization.
2. Checks users' permissions to create private repositories against the allowed list specified in the `with.allowed_users` configuration.
   - If a user not on the allowed list has permission to create private repositories, the rule flags this as a violation.

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

## Input Definitions  
| Parameter | Type | Required | Description | Default |
|-----------|------|----------|-------------| --------|
| allowed_users | array | False | List of allowed users. |  |

