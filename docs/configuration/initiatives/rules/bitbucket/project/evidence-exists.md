---
sidebar_label: Require Bitbucket Project Discovery Evidence
title: Require Bitbucket Project Discovery Evidence
---  
# Require Bitbucket Project Discovery Evidence  
**Type:** Rule  
**ID:** `bb-project-exists`  
**Source:** [v2/rules/bitbucket/project/evidence-exists.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/bitbucket/project/evidence-exists.yaml)  
**Rego Source:** [evidence-exists.rego](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/bitbucket/project/evidence-exists.rego)  
**Labels:** Bitbucket, Project  

Verify the Bitbucket Project exists as evidence.

:::note 
This rule requires Bitbucket Project Discovery Evidence. See [here](/docs/platforms/discover#bitbucket-discovery) for more details.  
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

## Usage example

```yaml
uses: bitbucket/project/evidence-exists@v2
```

## Evidence Requirements  
| Field | Value |
|-------|-------|
| signed | False |
| content_body_type | generic |
| target_type | data |
| predicate_type | http://scribesecurity.com/evidence/discovery/v0.1 |
| asset_platform | bitbucket |
| asset_type | project |
| asset_name | Template value (see below) |

**Template Value** (see [here](/docs/valint/initiatives#template-arguments) for more details)

```
{{- if eq .Context.asset_type "project" -}}
{{- on_target .Context.asset_name -}}
{{- else -}}
{{- on_target nil -}}
{{- end -}}
```

