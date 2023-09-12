---
sidebar_label: "Installer"
title: Scribe GitHub Actions - `installer`
sidebar_position: 1
toc_min_heading_level: 2
toc_max_heading_level: 5
---

Scribe offers GitHub Actions for embedding evidence collecting and validated integrity of your supply chain. 

Use `installer` to install Scribe tools in your workflow.

For Further documentation **[GitHub integration](../../../integrating-scribe/ci-integrations/github)**.

### Tool installer Action
You can use the `installer` Action to install any scribe tool in to your workflow allowing full access to all the CLI options in your workflows. 

Install the tool locally if you want to:
- Generate/verify evidence (SBOMS) from docker daemon.
- Generate/sign local directories (not mapped to the working dir)
- Generate evidence for a global cache directory
- Use tool functionality not exposed by containerized actions.

> action allows users to utilize `valint` in a non-containerized environment.

>Installing `valint` locally is useful when you want to create an evidence (directory or git targets) on targets outside working directory.

### Input arguments
```yaml
  tools:
    description: 'Select scribe tools <tool:version>'
    required: false
```

### Supported tools
* Valint

### OS - Arch support
* Linux - arm64, amd64.

### Usage
```YAML
- name: Scribe tool install
  id: scribe_install
  uses: scribe-security/action-installer@master
```

### Installer action examples

<details>
  <summary> Select tool </summary>

```YAML
- name: valint install
  id: valint_install
  uses: scribe-security/action-installer@master
  with:
    tools: valint
``` 
</details>

## Other Actions
* [bom](action-bom.md), [source](https://github.com/scribe-security/action-bom)
* [slsa](action-slsa.md), [source](https://github.com/scribe-security/action-slsa)
* [verify](action-verify.md), [source](https://github.com/scribe-security/action-verify)
* [installer](action-installer.md), [source](https://github.com/scribe-security/action-installer)
