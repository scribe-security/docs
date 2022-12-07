---
title: Verify
sidebar_position: 2
---
# Scribe Github Action for `gensbom bom`
Scribe offers GitHub Actions for embedding evidence collecting and validated integrity of your supply chain.

Use `gensbom verify` to verify evidence (attestations) and policies.

Further documentation [Github integration](https://scribe-security.netlify.app/docs/ci-integrations/github/)


## Other Actions
* [bom - action](https://github.com/scribe-security/action-bom/README.md)
* [verify - action](https://github.com/scribe-security/action-verify/README.md)
* [integrity report - action](https://github.com/scribe-security/action-report/README.md)
* [installer - action](https://github.com/scribe-security/action-installer/README.md)

## Verify Action
Action for `gensbom verify`.
The command allows users to verify an image via a signed attestation (In-toto).
- Verify targets using signed sbom, SLSA provanence attestations.
- Signed SBOM supports, the action will verify Sigstore keyless flow (Fulcio CA + Rekor log) while using GitHub (See example below).
- Verify signer identity, for example, GitHub workflow ids.
- Download attestations (signed SBOMs) from Scribe service.
- Verify attestations via OPA/CUE policies (see cocosign documentation).
- Verify the trust of target images, directories, files or git repositories.

### Input arguments
```yaml
  type:
    description: 'Target source type options=[docker,docker-archive, oci-archive, dir, registry]'
    default: registry
  target:
    description: 'Target object name format=[<image:tag>, <dir_path>]'
    required: true
  verbose:
    description: 'Increase verbosity (-v = info, -vv = debug)'
    default: 1
  config:
    description: 'Application config file'
  input-format:
    description: 'Sbom input formatter, options=[attest-cyclonedx-json attest-slsa] (default "attest-cyclonedx-json")'
    default: attest-cyclonedx-json
  output-directory:
    description: 'report output directory'
    default: ./scribe/gensbom
  output-file:
    description: 'Output result to file'
  filter-regex:
    description: 'Filter out files by regex'
    default: .*\.pyc,\.git/.*
  attest-config:
    description: 'Attestation config map'
  attest-name:
    description: 'Attestation config name (default "gensbom")'
  attest-default:
    description: 'Attestation default config, options=[sigstore sigstore-github x509]'
    default: sigstore-github
```

### Usage
```
- name: Gensbom verify
  id: gensbom_verify
  uses: scribe-security/action-installer@master
  with:
      target: 'busybox:latest'
      verbose: 2
```

## Configuration
Use default configuration path `.gensbom.yaml`, or provide a custom path using `--config` flag.

See detailed [configuration](docs/configuration.md)


## Attestations 
Attestations allows you to sign and verify your targets. <br />
Attestations allow you to connect PKI-based identities to your evidence and policy management.  <br />
Supported outputs:
- In-toto statements - cyclonedx BOM, SLSA Provenance
- In-toto predicate - cyclonedx, BOM, SLSA Provenance
- In-toto attestations -cyclonedx, BOM, SLSA Provenance

Use default configuration path `.cocosign.yaml`, or
provide custom path using `attest-config` input argument.

See details [attestations](docs/attestations.md)

## .gitignore
Recommended to add output directory value to your .gitignore file.
By default add `**/scribe` to your `.gitignore`.

## Verify SBOMs examples

<details>
  <summary> Attest target (SBOM) </summary>

Create and sign SBOM targets. <br />
By default the `sigstore-github` flow is used, GitHub workload identity and Sigstore (Fulcio, Rekor).

>Default attestation config **Required** `id-token` permission access. <br />

```YAML
job_example:
  runs-on: ubuntu-latest
  permissions:
    id-token: write
  steps:
    - name: gensbom attest
    uses: scribe-security/action-bom@master
    with:
        target: 'busybox:latest'
        format: attest
``` 
</details>

<details>
  <summary> Attest target (SLSA) </summary>

Create and sign SLSA targets. <br />
By default the `sigstore-github` flow is used, GitHub workload identity and Sigstore (Fulcio, Rekor).

>Default attestation config **Required** `id-token` permission access. <br />

```YAML
job_example:
  runs-on: ubuntu-latest
  permissions:
    id-token: write
  steps:
    - name: gensbom attest
    uses: scribe-security/action-bom@master
    with:
        target: 'busybox:latest'
        format: attest-slsa
``` 
</details>

<details>
  <summary> Verify target (SBOM) </summary>

Verify targets against a signed attestation.
Default attestation config: `sigstore-config` - sigstore (Fulcio, Rekor). <br />
Gensbom will look for both a bom or slsa attestation to verify against. <br />

```YAML
- name: gensbom verify
  uses: scribe-security/action-verify@master
  with:
    target: 'busybox:latest'
``` 

</details>

<details>
  <summary> Verify target (SLSA) </summary>

Verify targets against a signed attestation. <br />
Default attestation config: `sigstore-config` - sigstore (Fulcio, Rekor). <br />
Gensbom will look for both a bom or slsa attestation to verify against. <br />


```YAML
- name: gensbom verify
  uses: scribe-security/action-verify@master
  with:
    target: 'busybox:latest'
    input-format: attest-slsa
``` 

</details>

<details>
  <summary> Attest and verify image target (SBOM) </summary>

Full job example of a image signing and verifying flow.

```YAML
 gensbom-busybox-test:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
      id-token: write
    steps:

      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: gensbom attest
        id: gensbom_attest
        uses: scribe-security/action-bom@master
        with:
           target: 'busybox:latest'
           verbose: 2
           format: attest
           force: true

      - name: gensbom verify
        id: gensbom_verify
        uses: scribe-security/action-verify@master
        with:
           target: 'busybox:latest'
           verbose: 2

      - uses: actions/upload-artifact@v3
        with:
          name: gensbom-busybox-test
          path: gensbom_reports
``` 

</details>

<details>
  <summary> Attest and verify image target (SLSA) </summary>

Full job example of a image signing and verifying flow.

```YAML
 gensbom-busybox-test:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
      id-token: write
    steps:

      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: gensbom attest slsa
        id: gensbom_attest
        uses: scribe-security/action-bom@master
        with:
           target: 'busybox:latest'
           verbose: 2
           format: attest-slsa
           force: true

      - name: gensbom verify attest slsa
        id: gensbom_verify
        uses: scribe-security/action-verify@master
        with:
           target: 'busybox:latest'
           input-format: attest-slsa
           verbose: 2

      - uses: actions/upload-artifact@v3
        with:
          name: gensbom-busybox-test
          path: gensbom_reports
``` 

</details>

<details>
  <summary> Attest and verify directory target (SBOM) </summary>

Full job example of a directory signing and verifying flow.

```YAML
  gensbom-dir-test:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
      id-token: write
    steps:

      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: gensbom attest workdir
        id: gensbom_attest_dir
        uses: scribe-security/action-bom@master
        with:
           type: dir
           target: '/GitHub/workspace/'
           verbose: 2
           format: attest
           force: true

      - name: gensbom verify workdir
        id: gensbom_verify_dir
        uses: scribe-security/action-verify@master
        with:
           type: dir
           target: '/GitHub/workspace/'
           verbose: 2
      
      - uses: actions/upload-artifact@v3
        with:
          name: gensbom-workdir-reports
          path: |
            gensbom_reports      
``` 

</details>


<details>
  <summary> Attest and verify Git repository target (SBOM) </summary>

Full job example of a git repository signing and verifying flow.
> Support for both local (path) and remote git (url) repositories.

```YAML
  gensbom-dir-test:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
      id-token: write
    steps:

      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: gensbom attest local repo
        id: gensbom_attest_dir
        uses: scribe-security/action-bom@master
        with:
           type: git
           target: '/GitHub/workspace/my_repo'
           verbose: 2
           format: attest
           force: true

      - name: gensbom verify local repo
        id: gensbom_verify_dir
        uses: scribe-security/action-verify@master
        with:
           type: git
           target: '/GitHub/workspace/my_repo'
           verbose: 2
      
      - uses: actions/upload-artifact@v3
        with:
          name: gensbom-git-reports
          path: |
            gensbom_reports      
``` 

</details>

<details>
  <summary> Install gensbom (tool) </summary>

Install gensbom as a tool
```YAML
- name: install gensbom
  uses: scribe-security/action-installer@master

- name: gensbom run
  run: |
    gensbom --version
    gensbom bom busybox:latest -vv
``` 
</details>
