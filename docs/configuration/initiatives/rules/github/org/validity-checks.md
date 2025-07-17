---
sidebar_label: Verify `secret_scanning_validity_checks_enabled` Setting
title: Verify `secret_scanning_validity_checks_enabled` Setting
---  
# Verify `secret_scanning_validity_checks_enabled` Setting  
**Type:** Rule  
**ID:** `github-org-validity-checks`  
**Source:** [v2/rules/github/org/validity-checks.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/github/org/validity-checks.yaml)  
**Rego Source:** [validity-checks.rego](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/github/org/validity-checks.rego)  
**Labels:** GitHub, Organization  

Verify validity checks for secrets are configured for the GitHub repository.

:::note 
This rule requires Github Organization Discovery Evidence. See [here](/docs/platforms/discover#github-discovery) for more details.  
::: 
:::tip 
Signed Evidence for this rule **IS NOT** required by default but is recommended.  
::: 
:::warning  
Rule requires evaluation with a target. Without one, it will be **disabled** unless the `--all-evidence` flag is provided.
::: 

## Usage example

```yaml
uses: github/org/validity-checks@v2
```

## Evidence Requirements  
| Field | Value |
|-------|-------|
| signed | False |
| content_body_type | generic |
| target_type | data |
| predicate_type | http://scribesecurity.com/evidence/discovery/v0.1 |
| asset_platform | github |
| asset_type | organization |
| asset_name | `{{- if eq .Context.asset_type "organization" -}} {{- on_target .Context.asset_name -}} {{- else -}} {{- on_target nil -}} {{- end -}}` |

## Rule Parameters (`with`)  
| Parameter | Default |
|-----------|---------|
| desired_value | True |

