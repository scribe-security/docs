---
sidebar_label: Verify No 3rd Party Findings via Scribe API
title: Verify No 3rd Party Findings via Scribe API
---  
# Verify No 3rd Party Findings via Scribe API  
**Type:** Rule  
**ID:** `scribe-findings`  
**Source:** [v2/rules/api/scribe-api-findings.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/api/scribe-api-findings.yaml)  
**Rego Source:** [scribe-api-findings.rego](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/api/scribe-api-findings.rego)  
**Labels:** SCA, Blueprint, Scribe  

Verify via Scribe API that there are no findings reported by 3rd party tools in the target product.

:::tip 
Evidence **IS NOT** required for this rule.  
::: 
:::tip 
Rule requires the Scribe API to be enabled. Ensure that you provide the Scribe Token to the `valint` utility.  
::: 

## Usage example

```yaml
uses: api/scribe-api-findings@v2
with:
  superset:
    findings:
      severities:
        - Critical
        - High
      tools:
        - Trivy
        - Snyk
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
```

## Mitigation  
Ensure that all findings reported by 3rd party tools are addressed before delivering the product.


## Description  
This rule ensures that there are no findings, such as vulnerabilities, misconfigurations, or other issues reported by 3rd party tools, in any component of the product by verifying via the Scribe API.

## Input Definitions  
| Parameter | Type | Required | Description | Default |
|-----------|------|----------|-------------| --------|
| superset | object | False | Filters for the findings. See usage example. | {'findings': {'severities': [], 'tools': [], 'titles': [], 'cwes': [], 'descriptions': [], 'descriptions_to_ignore': []}} |

