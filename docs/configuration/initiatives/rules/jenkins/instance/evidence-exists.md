---
sidebar_label: Require Jenkins Instance Discovery Evidence
title: Require Jenkins Instance Discovery Evidence
---  
# Require Jenkins Instance Discovery Evidence  
**Type:** Rule  
**ID:** `jenkins-instance-exists`  
**Source:** [v2/rules/jenkins/instance/evidence-exists.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/jenkins/instance/evidence-exists.yaml)  
**Rego Source:** [evidence-exists.rego](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/jenkins/instance/evidence-exists.rego)  
**Labels:** Jenkins, Instance  

Verify the Jenkins Instance exists as evidence.

:::note 
This rule requires Jenkins Instance Discovery Evidence. See [here](/docs/platforms/discover#jenkins-discovery) for more details.  
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
uses: jenkins/instance/evidence-exists@v2
```

## Evidence Requirements  
| Field | Value |
|-------|-------|
| filter-by | ['product', 'target'] |
| signed | False |
| content_body_type | generic |
| target_type | data |
| predicate_type | http://scribesecurity.com/evidence/discovery/v0.1 |
| asset_platform | jenkins |
| asset_type | instance |

