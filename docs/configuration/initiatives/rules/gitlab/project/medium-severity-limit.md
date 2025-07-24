---
sidebar_label: Enforce Medium Severity Limit
title: Enforce Medium Severity Limit
---  
# Enforce Medium Severity Limit  
**Type:** Rule  
**ID:** `gitlab-project-medium-severity-limit`  
**Source:** [v2/rules/gitlab/project/medium-severity-limit.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/gitlab/project/medium-severity-limit.yaml)  
**Rego Source:** [medium-severity-limit.rego](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/gitlab/project/medium-severity-limit.rego)  
**Labels:** Gitlab, Project  

Verify the maximum allowed medium severity alerts for the GitLab project.

:::note 
This rule requires Gitlab Project Discovery Evidence. See [here](/docs/platforms/discover#gitlab-discovery) for more details.  
::: 
:::tip 
Signed Evidence for this rule **IS NOT** required by default but is recommended.  
::: 
:::warning  
Rule requires evaluation with a target. Without one, it will be **disabled** unless the `--all-evidence` flag is provided.
::: 

## Usage example

```yaml
uses: gitlab/project/medium-severity-limit@v2
with:
  max_allowed_specific_severity: 0
```

## Mitigation  
Ensure that the maximum allowed medium severity alerts for the GitLab project is enforced to prevent unauthorized changes.


## Description  
This rule ensures that the maximum allowed medium severity alerts for the GitLab project is enforced.
It performs the following steps:

1. Checks the settings of the GitLab project.
2. Verifies that the maximum allowed medium severity alerts is enforced.

**Evidence Requirements:**
- Evidence must be provided by the Scribe Platform's CLI tool through scanning GitLab project resources.

## Evidence Requirements  
| Field | Value |
|-------|-------|
| signed | False |
| content_body_type | generic |
| target_type | data |
| predicate_type | http://scribesecurity.com/evidence/discovery/v0.1 |
| asset_platform | gitlab |
| asset_type | repo |
| asset_name | Template value (see below) |

**Template Value** (see [here](/docs/valint/initiatives#template-arguments) for more details)

```
{{- if eq .Context.asset_type "project" "repo" -}}
{{- on_target .Context.asset_name -}}
{{- else -}}
{{- on_target nil -}}
{{- end -}}
```

## Input Definitions  
| Parameter | Type | Required | Description | Default |
|-----------|------|----------|-------------| --------|
| max_allowed_specific_severity | number | False | Maximum allowed medium severity alerts for the GitLab project. | 0 |

