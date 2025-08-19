---
sidebar_label: Require K8s Pod Discovery Evidence
title: Require K8s Pod Discovery Evidence
---  
# Require K8s Pod Discovery Evidence  
**Type:** Rule  
**ID:** `k8s-pod-exists`  
**Source:** [v2/rules/k8s/pods/evidence-exists.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/k8s/pods/evidence-exists.yaml)  
**Rego Source:** [evidence-exists.rego](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/k8s/pods/evidence-exists.rego)  
**Labels:** K8s, Pod  

Verify the K8s Pod exists as evidence.

:::note 
This rule requires K8s Pod Discovery Evidence. See [here](/docs/platforms/discover#k8s-discovery) for more details.  
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
uses: k8s/pods/evidence-exists@v2
```

## Evidence Requirements  
| Field | Value |
|-------|-------|
| filter-by | ['product', 'target'] |
| signed | False |
| content_body_type | generic |
| target_type | data |
| predicate_type | http://scribesecurity.com/evidence/discovery/v0.1 |
| asset_platform | k8s |
| asset_type | pod |

