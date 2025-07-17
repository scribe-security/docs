---
sidebar_label: Require Jenkins Folder Discovery Evidence
title: Require Jenkins Folder Discovery Evidence
---  
# Require Jenkins Folder Discovery Evidence  
**Type:** Rule  
**ID:** `jenkins-folder-exists`  
**Source:** [v2/rules/jenkins/folder/evidence-exists.yaml](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/jenkins/folder/evidence-exists.yaml)  
**Rego Source:** [evidence-exists.rego](https://github.com/scribe-public/sample-policies/blob/main/v2/rules/jenkins/folder/evidence-exists.rego)  
**Labels:** Jenkins, Folder  

Verify the Jenkins Folder exists as evidence.

:::note 
This rule requires Jenkins Folder Discovery Evidence. See [here](/docs/platforms/discover#jenkins-discovery) for more details.  
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
uses: jenkins/folder/evidence-exists@v2
```

## Evidence Requirements  
| Field | Value |
|-------|-------|
| signed | False |
| content_body_type | generic |
| target_type | data |
| predicate_type | http://scribesecurity.com/evidence/discovery/v0.1 |
| asset_platform | jenkins |
| asset_type | folder |
| asset_name | `{{- if eq .Context.asset_type "folder" -}} {{- on_target .Context.asset_name -}} {{- else -}} {{- on_target nil -}} {{- end -}}` |

