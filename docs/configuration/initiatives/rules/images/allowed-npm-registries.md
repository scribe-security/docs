---
sidebar_label: Verify NPM Packages Origin
title: Verify NPM Packages Origin
---  
# Verify NPM Packages Origin  
**Type:** Rule  
**ID:** `sbom-allowed-npm-registries`  
**Source:** [v2/rules/images/allowed-npm-registries.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/images/allowed-npm-registries.yaml)  
**Rego Source:** [allowed-npm-registries.rego](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/images/allowed-npm-registries.rego)  
**Labels:** SBOM, Image  

Verify that the artifact contains only components from allowed NPM registries.

:::note 
This rule requires Image SBOM. See [here](/docs/valint/sbom) for more details.  
::: 
:::note 
Components type reference: https://cyclonedx.org/docs/1.6/json/#components_items_type  
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
uses: images/allowed-npm-registries@v2
with:
  types:
    - library
    - operating-system
```

## Mitigation  
Ensures that only NPM components from approved registries are included in the SBOM, reducing the risk of introducing vulnerabilities or unapproved dependencies into the software supply chain.


## Description  
This rule inspects the CycloneDX SBOM evidence for the artifact to verify that it contains only components from allowed registries.
It performs the following steps:

1. Iterates over NPM components listed in the SBOM.
2. For remotely installed components, checks the `registryUrl` property to ensure it matches one of the allowed NPM registries specified in the `with.allowed_registries` configuration.

**Evidence Requirements:**
- Evidence must be provided in the CycloneDX JSON format.
- The SBOM must include a list of components with their types and names.

## Evidence Requirements  
| Field | Value |
|-------|-------|
| filter-by | ['product', 'target'] |
| signed | False |
| content_body_type | cyclonedx-json |
| target_type | container |

## Input Definitions  
| Parameter | Type | Required | Description | Default |
|-----------|------|----------|-------------| --------|
| allowed_registries | array | False | A list of allowed NPM registries. | ['https://registry.npmjs.org/'] |

