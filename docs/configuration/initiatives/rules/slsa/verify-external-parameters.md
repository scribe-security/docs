---
sidebar_label: SLSA External Parameters Match in Provenance Document
title: SLSA External Parameters Match in Provenance Document
---  
# SLSA External Parameters Match in Provenance Document  
**Type:** Rule  
**ID:** `slsa-external-parameters`  
**Source:** [v2/rules/slsa/verify-external-parameters.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/slsa/verify-external-parameters.yaml)  
**Rego Source:** [verify-external-parameters.rego](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/slsa/verify-external-parameters.rego)  
**Labels:** SLSA  

Verify the specified external parameters value match in the provenance document.

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
uses: slsa/verify-external-parameters@v2
with:
  parameters:
    "key_1": "value_1"  # match the value exactly
    "key_2":            # match any of the values in the array
      - "value_2"
      - "value_3"
    "key_3":            # match any of the values in the numeric array
      - 4
      - 5
    "key_4":            # match a number between min and max
      "min": 1
      "max": 10
```

## Mitigation  
Ensure that the external parameters field is present in the provenance document and that its value matches the expected value. To add such a field, pass it as `key=value` in the `--external` flag for the `valint slsa` command.


## Description  
This rule verifies that the specified external parameters value matches in the provenance document.
It checks if the external parameters field exists and if its value matches the expected value.
The allowed parameters values can be passed to the rule in the `key: value` format, where `value` can be:
- `string` or `number` -- requires a direct match
- `array` of `strings` or `numbers` -- requires the actual value to match one of the values in the array
- `object` with `min` and `max` -- requires the actual value to be a number between the min and max values

## Evidence Requirements  
| Field | Value |
|-------|-------|
| signed | False |
| content_body_type | slsa |

## Input Definitions  
| Parameter | Type | Required | Description | Default |
|-----------|------|----------|-------------| --------|
| parameters | object | False | The expected external parameters to match in the provenance document given as `key:value` map. | `{}` |

