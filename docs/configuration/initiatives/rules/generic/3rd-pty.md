---
sidebar_label: 3rd Party Scanner Violations
title: 3rd Party Scanner Violations
---  
# 3rd Party Scanner Violations  
**Type:** Rule  
**ID:** `3rd-pty`  
**Source:** [v2/rules/generic/3rd-pty.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/generic/3rd-pty.yaml)  
**Rego Source:** [3rd-pty.rego](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/generic/3rd-pty.rego)  
**Labels:** 3rd-pty, SCA  

Limit allowed violations in 3rd party scanner reports

:::note 
This rule requires Generic Statement. See [here](/docs/valint/generic) for more details.  
::: 
:::tip 
Signed Evidence for this rule **IS NOT** required by default but is recommended.  
::: 
:::warning  
Rule requires evaluation with a target. Without one, it will be **disabled** unless the `--all-evidence` flag is provided.
::: 

## Usage example

```yaml
uses: generic/3rd-pty@v2
with:
  severities:
    - Critical
    - High
  titles:
    - "CVE-2023-1234"
    - "CVE-2023-5678"
    - "CVE-2025"
  cwes:
    - "CWE-123"
    - "CWE-456"
  descriptions:
    - "Vulnerability in component X"
    - "Misconfiguration in component Y"
  descriptions_to_ignore:
    - "False positive in component Z"
    - "Known issue in component A"
  component_names:
    - library-x
    - library-y
```

## Mitigation  
Restricts the number and type of violations from third-party scanner reports, helping to enforce organizational security and compliance policies.


## Description  
This rule verifies that the number and type of violations reported by third-party scanners are within allowed thresholds.
It checks the evidence for findings matching the specified severities, titles, CWEs, descriptions, and component names.
Violations are recorded if any findings exceed the configured limits or match blocklisted criteria.

### **Evidence Requirements**
- Evidence must be provided by a supported third-party scanner and formatted as generic findings (see the `--parser` flag in `valint`).

## Evidence Requirements  
| Field | Value |
|-------|-------|
| signed | False |
| content_body_type | generic |
| target_type | data |
| predicate_type | http://scribesecurity.com/evidence/finding/v0.1 |

## Input Definitions  
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| severities | array | False | List of severities to filter by. |
| titles | array | False | List of titles to filter by. |
| cwes | array | False | List of CWE identifiers to filter by. |
| descriptions | array | False | List of descriptions to filter by. |
| descriptions_to_ignore | array | False | List of descriptions to ignore from findings. |
| component_names | array | False | List of component names to filter by. |

