---
sidebar_label: Disallow Unused Users
title: Disallow Unused Users
---  
# Disallow Unused Users  
**Type:** Rule  
**ID:** `jenkins-unused-users`  
**Source:** [v2/rules/jenkins/instance/unused-users.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/jenkins/instance/unused-users.yaml)  
**Rego Source:** [unused-users.rego](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/jenkins/instance/unused-users.rego)  
**Labels:** Jenkins, Instance  

Verify there are no users with zero activity.

:::note 
This rule requires Jenkins Instance Discovery Evidence. See [here](/docs/platforms/discover#jenkins-discovery) for more details.  
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
uses: jenkins/instance/unused-users@v2
```

## Mitigation  
Ensure that there are no users with zero activity in the Jenkins instance to prevent service disruption.


## Description  
This rule ensures that there are no users with zero activity in the Jenkins instance.
It performs the following steps:

1. Checks the settings of the Jenkins instance.
2. Verifies that there are no users with zero activity.

**Evidence Requirements:**
- Evidence must be provided by the Scribe Platform's CLI tool through scanning Jenkins instance resources.

## Evidence Requirements  
| Field | Value |
|-------|-------|
| filter-by | ['product', 'target'] |
| signed | False |
| content_body_type | generic |
| predicate_type | http://scribesecurity.com/evidence/discovery/v0.1 |
| asset_platform | jenkins |
| asset_type | instance |

