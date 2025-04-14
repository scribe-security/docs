---
sidebar_label: SLSA Field Value Matches in Provenance Document
title: SLSA Field Value Matches in Provenance Document
---  
# SLSA Field Value Matches in Provenance Document  
**Type:** Rule  
**ID:** `slsa-field-matches`  
**Source:** [v2/rules/slsa/verify-custom-fields.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/slsa/verify-custom-fields.yaml)  
**Rego Source:** [verify-custom-fields.rego](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/slsa/verify-custom-fields.rego)  
**Labels:** SLSA  

Verify the specified field value matches in the provenance document.

:::note 
This rule requires SLSA Provenance. See [here](/docs/valint/help/valint_slsa) for more details.  
::: 
:::tip 
Signed Evidence for this rule **IS NOT** required by default but is recommended.  
::: 
:::warning  
Rule requires evaluation with a target. Without one, it will be **disabled** unless the `--all-evidence` flag is provided.
::: 

## Usage example

```yaml
uses: slsa/verify-custom-fields@v2
with:
  fields:
    "predicate/buildDefinition/externalParameters/key": "value"
```

## Mitigation  
Ensure that the field exists in the provenance document and that its value matches the expected value.


## Description  
This rule verifies that the specified field value matches in the provenance document.
It checks if the field exists and if its value matches the expected value.
The parameters are passed as key-value pairs.
The key must be a path within the Provenance document, and the value must be a string.

## Evidence Requirements  
| Field | Value |
|-------|-------|
| signed | False |
| content_body_type | slsa |

## Input Definitions  
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| fields | array | False | The expected field values to match in the provenance document. |

