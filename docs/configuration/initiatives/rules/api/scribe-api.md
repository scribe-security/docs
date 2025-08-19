---
sidebar_label: Apply Scribe Template Policy
title: Apply Scribe Template Policy
---  
# Apply Scribe Template Policy  
**Type:** Rule  
**ID:** `scribe-template`  
**Source:** [v2/rules/api/scribe-api.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/api/scribe-api.yaml)  
**Rego Source:** [scribe-api.rego](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/api/scribe-api.rego)  
**Labels:** Scribe  

Verify XX using the Scribe API template rule.

:::tip 
Rule requires the Scribe API to be enabled. Ensure that you provide the Scribe Token to the `valint` utility.  
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
uses: api/scribe-api@v2
```

## Evidence Requirements  
| Field | Value |
|-------|-------|
| filter-by | ['product', 'target'] |
| signed | False |
| content_body_type | cyclonedx-json |

## Rule Parameters (`with`)  
| Parameter | Default |
|-----------|---------|
| superset | `{'cve': {'max': 0, 'severity': 6}, 'licences': {'max': 500}, 'unmaintained': {'max': 2000}, 'images': {'max': 20}}` |

