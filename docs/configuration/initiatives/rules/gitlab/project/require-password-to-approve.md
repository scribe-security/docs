---
sidebar_label: Require Password for Approvals in GitLab Project
title: Require Password for Approvals in GitLab Project
---  
# Require Password for Approvals in GitLab Project  
**Type:** Rule  
**ID:** `gitlab-project-require-password-to-approve`  
**Source:** [v2/rules/gitlab/project/require-password-to-approve.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/gitlab/project/require-password-to-approve.yaml)  
**Rego Source:** [require-password-to-approve.rego](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/gitlab/project/require-password-to-approve.rego)  
**Labels:** Gitlab, Project  

Verify the binary field `require_password_to_approve` is set for the GitLab project.

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
uses: gitlab/project/require-password-to-approve@v2
with:
  require_password_to_approve: true
```

## Mitigation  
Ensure that the binary field `require_password_to_approve` is set for the GitLab project to prevent unauthorized approvals.


## Description  
This rule ensures that the binary field `require_password_to_approve` is set for the GitLab project.
It performs the following steps:

1. Checks the settings of the GitLab project.
2. Verifies that the binary field `require_password_to_approve` is set.

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
| require_password_to_approve | boolean | False | The binary field to enforce for requiring password to approve. | True |

