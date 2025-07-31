---
sidebar_label: Protect CI Secrets in GitLab Project
title: Protect CI Secrets in GitLab Project
---  
# Protect CI Secrets in GitLab Project  
**Type:** Rule  
**ID:** `gitlab-project-protect-ci-secrets`  
**Source:** [v2/rules/gitlab/project/protect-ci-secrets.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/gitlab/project/protect-ci-secrets.yaml)  
**Rego Source:** [protect-ci-secrets.rego](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/gitlab/project/protect-ci-secrets.rego)  
**Labels:** Gitlab, Project  

Verify secrets in the GitLab project are not shared.

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
uses: gitlab/project/protect-ci-secrets@v2
with:
  pattern: "(?i)(token|secret)"
```

## Mitigation  
Ensure that secrets in the GitLab project are not shared to prevent unauthorized changes.


## Description  
This rule ensures that secrets in the GitLab project are not shared.
It performs the following steps:

1. Checks the settings of the GitLab project.
2. Verifies that secrets are not shared.

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
| pattern | string | False | The pattern to match secrets. | (?i)(token|secret) |

