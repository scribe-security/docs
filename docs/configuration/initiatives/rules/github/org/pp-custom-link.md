---
sidebar_label: Verify `secret_scanning_push_protection_custom_link_enabled` Setting
title: Verify `secret_scanning_push_protection_custom_link_enabled` Setting
---  
# Verify `secret_scanning_push_protection_custom_link_enabled` Setting  
**Type:** Rule  
**ID:** `github-org-pp-custom-link`  
**Source:** [v2/rules/github/org/pp-custom-link.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/github/org/pp-custom-link.yaml)  
**Rego Source:** [pp-custom-link.rego](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/github/org/pp-custom-link.rego)  
**Labels:** GitHub, Organization  

Verify secret scanning push protection custom link is enabled in the GitHub organization.

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
uses: github/org/pp-custom-link@v2
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
| asset_name | Template value (see below) |

**Template Value** (see [here](/docs/valint/initiatives#template-arguments) for more details)

```
{{- if eq .Context.asset_type "organization" -}}
{{- on_target .Context.asset_name -}}
{{- else -}}
{{- on_target nil -}}
{{- end -}}
```

## Rule Parameters (`with`)  
| Parameter | Default |
|-----------|---------|
| desired_value | True |

