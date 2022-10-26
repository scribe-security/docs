---
title: Installer
---
# Scribe GitHub actions - `installer`
Scribe offers GitHub actions for embedding evidence collecting and validated integrity of your supply chain. \

`installer` is used to install Scribe tools on your workflow. \

Further documentation [Github integration](https://scribe-security.netlify.app/docs/ci-integrations/github/)

## Other actions
* [bom - action](https://github.com/scribe-security/action-bom/README.md)
* [verify - action](https://github.com/scribe-security/action-verify/README.md)
* [integrity report - action](https://github.com/scribe-security/action-report/README.md)
* [installer - action](https://github.com/scribe-security/action-installer/README.md)

## Tool installer action
You can use the `installer` action to install any scribe tool in to your workflow allowing full access to all the CLI options in your workflows. \

Install the tool locally if you want to:
- Generate/verify evidence (SBOMS) from docker daemon.
- Generate/sign local directories (not mapped to the working dir)
- Generate evidence for a global cache directory
- Use tool functionality not exposed by containerized actions.
Note: Installing gensbom locally is very useful when you want to create an SBOM outside the workflow default workspace directory.

> action allows users to utilize `gensbom bom` in a non-containerized environment.

### Input arguments
```yaml
  tools:
    description: 'Select scribe tools <tool:version>'
    required: false
    default: 'gensbom,valint'
```

## Supported tools
* valint
* gensbom

## OS - Arch support
* Linux - arm64, amd64.

### Usage
```YAML
- name: Scribe tool install
  id: scribe_install
  uses: scribe-security/actions/installer@master
```

## Installer action examples

<details>
  <summary> Select tool </summary>

```YAML
- name: Gensbom install
  id: gensbom_install
  uses: scribe-security/actions/installer@master
  with:
    tools: gensbom
``` 

```YAML
- name: Gensbom install
  id: gensbom_install
  uses: scribe-security/actions/installer@master
  with:
    tools: valint
``` 
</details>

<details>
  <summary> Install gensbom (tool) </summary>

Install gensbom as a tool
```YAML
- name: install gensbom
  uses: scribe-security/actions/gensbom/installer@master

- name: gensbom run
  run: |
    gensbom --version
    gensbom bom busybox:latest -vv
``` 
</details>

<details>
  <summary> Install Valint (tool) </summary>

Install Valint as a tool
```YAML
- name: install gensbom
  uses: scribe-security/actions/gensbom/installer@master
  with:
    tool: valint

- name: valint run
  run: |
    valint --version
    valint report --scribe.client-id $SCRIBE_CLIENT_ID $SCRIBE_CLIENT_SECRET
``` 
</details>

