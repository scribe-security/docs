---
sidebar_label: Verify Two-Factor Authentication (2FA) Requirement Enabled
title: Verify Two-Factor Authentication (2FA) Requirement Enabled
---  
# Verify Two-Factor Authentication (2FA) Requirement Enabled  
**Type:** Rule  
**ID:** `github-org-2fa`  
**Source:** [v2/rules/github/org/2fa.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/github/org/2fa.yaml)  
**Rego Source:** [2fa.rego](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/github/org/2fa.rego)  
**Labels:** GitHub, Organization  

Verify Two-factor Authentication is required in the GitHub organization.

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
uses: github/org/2fa@v2
```

## Mitigation  
Enforces two-factor authentication (2FA) for organizational accounts, significantly reducing the risk of unauthorized access  through compromised credentials.


## Description  
This rule verifies that two-factor authentication (2FA) is enabled for the organization by examining the provided evidence.
It checks the organization's details (retrieved from the SARIF or equivalent evidence) and compares the value of the 
`organization_details.two_factor_requirement_enabled` field against the expected value.

The rule iterates over the organization data in the evidence, and if the `two_factor_requirement_enabled` field does not match 
the desired value, a violation is recorded. This ensures that all organizational accounts enforce 2FA, providing an additional 
layer of security against unauthorized access.

### **Evidence Requirements**
- Evidence must include organization data with a field named `organization_details.two_factor_requirement_enabled`.
- The data should come from a trusted source (e.g., a GitHub organization scan).
- The evidence must clearly indicate whether 2FA is enabled.

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

## Rule Parameters (`with`)  
| Parameter | Default |
|-----------|---------|
| desired_value | True |

