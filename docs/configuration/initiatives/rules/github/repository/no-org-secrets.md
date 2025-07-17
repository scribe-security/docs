---
sidebar_label: Verify No Organization Secrets Exist in Repository
title: Verify No Organization Secrets Exist in Repository
---  
# Verify No Organization Secrets Exist in Repository  
**Type:** Rule  
**ID:** `github-repo-no-org-secrets`  
**Source:** [v2/rules/github/repository/no-org-secrets.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/github/repository/no-org-secrets.yaml)  
**Rego Source:** [no-org-secrets.rego](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/github/repository/no-org-secrets.rego)  
**Labels:** GitHub, Repository  

Verify no organization secrets exist in the GitHub repository.

:::note 
This rule requires Github Repository Discovery Evidence. See [here](/docs/platforms/discover#github-discovery) for more details.  
::: 
:::tip 
Signed Evidence for this rule **IS NOT** required by default but is recommended.  
::: 
:::warning  
Rule requires evaluation with a target. Without one, it will be **disabled** unless the `--all-evidence` flag is provided.
::: 

## Usage example

```yaml
uses: github/repository/no-org-secrets@v2
```

## Mitigation  
Ensures that no organization secrets are used, reducing the risk of unauthorized access.


## Description  
This rule ensures that no organization secrets are used in the GitHub repository.
It performs the following steps:

1. Checks the repository settings for organization secrets.
2. Verifies that no organization secrets are used.

**Evidence Requirements:**
- Evidence must be provided by the Scribe Platform's CLI tool through scanning GitHub repository settings.

## Evidence Requirements  
| Field | Value |
|-------|-------|
| signed | False |
| content_body_type | generic |
| target_type | data |
| predicate_type | http://scribesecurity.com/evidence/discovery/v0.1 |
| asset_platform | github |
| asset_type | repo |
| asset_name | Template value (see below) |

**Template Value** (see [here](/docs/valint/initiatives#template-arguments) for more details)

```
{{- if eq .Context.asset_type "repo" -}}
{{- on_target .Context.asset_name -}}
{{- else -}}
{{- on_target nil -}}
{{- end -}}
```

