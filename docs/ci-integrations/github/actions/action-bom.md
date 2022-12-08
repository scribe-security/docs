---
title: Bom
sidebar_position: 2
---
# Scribe Github Action for `gensbom bom`
Scribe offers GitHub Actions for embedding evidence collecting and validated integrity of your supply chain.

Use `gensbom bom` to collect evidence and generate an SBOM.

Further documentation regarding [Github integration](https://scribe-security.netlify.app/docs/ci-integrations/github/)


## Other Actions
* [bom - action](https://github.com/scribe-security/action-bom/README.md)
* [verify - action](https://github.com/scribe-security/action-verify/README.md)
* [installer - action](https://github.com/scribe-security/action-installer/README.md)
<!-- * [integrity report - action](https://github.com/scribe-security/action-report/README.md) -->

## Bom Action
Action for `gensbom bom`.
The command allows users to generate and manage SBOMs.
- Signing SBOMs, SLSA provenance objects, supporting Sigstore keyless flow while using GitHub's workload auth ODIC identity.
- Generates detailed SBOMs, SLSA provenance objects for various types of targets: images, directories, files and git repositories targets. 
- GitHub-specific context attached to all SBOMs (includes GitHub specific descriptors: GIT_URL, JOB_ID, JOB_NAME .. etc)
- Store and manage SBOMs on the Scribe Service.
- Attach SBOM in your CI or releases.
- Generate an SBOM directly from your private OCI registry.
- Customizable SBOM with environments, labels, sections, etc.
- Attach external reports to your SBOM.
- Generate In-Toto attestation, statement or predicates.

> BOM Action is containerized which limites the ability to generate sboms outside of the workflow working dir.
To overcome the limitation install the Gensbom tool directly - [installer - action](https://github.com/scribe-security/action-installer/README.md)

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
  format:
    description: 'Sbom formatter, options=[cyclonedx-json cyclonedx-xml attest-cyclonedx-json statement-cyclonedx-json predicate-cyclonedx-json attest-slsa statement-slsa predicate-slsa]'
    default: cyclonedxjson
  output-directory:
    description: 'Report output directory'
    default: ./scribe/gensbom
  output-file:
    description: 'Output result to file'
  name:
    description: 'Custom/project name'
  label:
    description: 'Custom label'
  env:
    description: 'Custom env'
  filter-regex:
    description: 'Filter out files by regex'
    default: .*\.pyc,\.git/.*
  collect-regex:
    description: 'Collect files content by regex'
  force:
    description: 'Force overwrite cache'
    default: false
  attest-config:
    description: 'Attestation config map'
  attest-name:
    description: 'Attestation config name (default "gensbom")'
  attest-default:
    description: 'Attestation default config, options=[sigstore sigstore-github x509]'
    default: sigstore-github
  scribe-enable:
    description: 'Enable scribe client'
    default: false
  scribe-client-id:
    description: 'Scribe client id' 
  scribe-client-secret:
    description: 'Scribe access token' 
  scribe-url:
    description: 'Scribe url' 
  context-dir:
    description: 'Context dir' 
```

### Output arguments
```yaml
  output-file:
    description: 'Bom output file path'
```

### Usage
```yaml
- name: Generate cyclonedx json SBOM
  uses: scribe-security/action-bom@master
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

## Integrations

### Before you begin
See [Github integration](https://scribe-security.netlify.app/docs/ci-integrations/github/)

### Usage
```yaml
- name: generate sbom for image
  uses: scribe-security/action-bom@master
  with:
    target: 'busybox:latest'
    scribe-enable: true
    product-key:  ${{ secrets.product-key }}
    scribe-client-id: ${{ secrets.client-id }}
    scribe-client-secret: ${{ secrets.client-secret }}
```

### Scribe service integration

If you are using Github Actions as your Continuous Integration tool (CI), use these instructions to integrate Scribe into your workflows to protect your projects.

<details>
  <summary>  Scribe integrity </summary>

Full workflow example of a workflow, upload evidence on source and image to Scribe. <br />
Verifying the  target integrity on Scribe.

```YAML
name: example workflow

on: 
  push:
    tags:
      - "*"

jobs:
  scribe-evidence-test:
    runs-on: ubuntu-latest
    steps:

      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - uses: actions/checkout@v3
        with:
          repository: mongo-express/mongo-express
          ref: refs/tags/v1.0.0-alpha.4
          path: mongo-express-scm

      - name: gensbom Scm generate bom, upload to scribe
        id: gensbom_bom_scm
        uses: scribe-security/action-bom@master
        with:
           type: dir
           target: 'mongo-express-scm'
           verbose: 2
           scribe-enable: true
           product-key:  ${{ secrets.product-key }}
           scribe-client-id: ${{ secrets.client-id }}
           scribe-client-secret: ${{ secrets.client-secret }}

      - name: Build and push remote
        uses: docker/build-push-action@v3
        with:
          context: .
          push: true
          tags: mongo-express:1.0.0-alpha.4

      - name: gensbom Image generate bom, upload to scribe
        id: gensbom_bom_image
        uses: scribe-security/action-bom@master
        with:
           target: 'mongo-express:1.0.0-alpha.4'
           verbose: 2
           scribe-enable: true
           product-key:  ${{ secrets.product-key }}
           scribe-client-id: ${{ secrets.client-id }}
           scribe-client-secret: ${{ secrets.client-secret }}

      - uses: actions/upload-artifact@v3
        with:
          name: scribe-evidence
          path: |
            ${{ steps.gensbom_bom_scm.outputs.OUTPUT_PATH }}
            ${{ steps.gensbom_bom_image.outputs.OUTPUT_PATH }}
```
</details>

## Basic examples
<details>
  <summary>  Public registry image (SBOM) </summary>

Create SBOM for remote `busybox:latest` image.

```YAML
- name: Generate cyclonedx json SBOM
  uses: scribe-security/action-bom@master
  with:
    target: 'busybox:latest'
    format: json
``` 

</details>

<details>
  <summary>  Docker built image (SBOM) </summary>

Create SBOM for image built by local docker `image_name:latest` image, overwrite cache.

```YAML
- name: Generate cyclonedx json SBOM
  uses: scribe-security/action-bom@master
  with:
    type: docker
    target: 'image_name:latest'
    format: json
    force: true
``` 
</details>

<details>
  <summary>  Private registry image (SBOM) </summary>

Custom private registry, output verbose (debug level) log output.

```YAML
- name: Generate cyclonedx json SBOM
  uses: scribe-security/action-bom@master
  with:
    target: 'scribesecuriy.jfrog.io/scribe-docker-local/stub_remote:latest'
    verbose: 2
    force: true
```
</details>

<details>
  <summary>  Custom metadata (SBOM) </summary>

Custom metadata added to SBOM
Data will be included in the signed payload when the output is an attestation.
```YAML
- name: Generate cyclonedx json SBOM - add metadata - labels, envs, name
  id: gensbom_labels
  uses: scribe-security/action-bom@master
  with:
      target: 'busybox:latest'
      verbose: 2
      format: json
      force: true
      name: name_value
      env: test_env
      label: test_label
  env:
    test_env: test_env_value
```
</details>


<details>
  <summary> Save as artifact (SBOM) </summary>

Using action `output_path` you can access the generated SBOM and store it as an artifact.
```YAML
- name: Generate cyclonedx json SBOM
  id: gensbom_json
  uses: scribe-security/action-bom@master
  with:
    target: 'busybox:latest'
    format: json

- uses: actions/upload-artifact@v3
  with:
    name: gensbom-busybox-output-test
    path: ${{ steps.gensbom_json.outputs.OUTPUT_PATH }}
``` 
</details>

<details>
  <summary> Save provenance statement as artifact (SLSA) </summary>
Using action `output_path` you can access the generated SBOM and store it as an artifact.

```YAML
- name: Generate SLSA provenance statement
  id: gensbom_slsa_statement
  uses: scribe-security/action-bom@master
  with:
    target: 'busybox:latest'
    format: statement-slsa

- uses: actions/upload-artifact@v3
  with:
    name: scribe-evidence
    path: ${{ steps.gensbom_slsa_statement.outputs.OUTPUT_PATH }}
``` 
</details>

<details>
  <summary> Docker archive image (SBOM) </summary>

Create SBOM for local `docker save ...` output.
```YAML
- name: Build and save local docker archive
  uses: docker/build-push-action@v3
  with:
    context: .
    file: .GitHub/workflows/fixtures/Dockerfile_stub
    tags: scribesecuriy.jfrog.io/scribe-docker-public-local/stub_local:latest
    outputs: type=docker,dest=stub_local.tar

- name: Generate cyclonedx json SBOM
  uses: scribe-security/action-bom@master
  with:
    type: docker-archive
    target: '/GitHub/workspace/stub_local.tar'
``` 
</details>

<details>
  <summary> OCI archive image </summary>

Create SBOM for the local oci archive.

```YAML
- name: Build and save local oci archive
  uses: docker/build-push-action@v3
  with:
    context: .
    file: .GitHub/workflows/fixtures/Dockerfile_stub
    tags: scribesecuriy.jfrog.io/scribe-docker-public-local/stub_local:latest
    outputs: type=docker,dest=stub_oci_local.tar

- name: Generate cyclonedx json SBOM
  uses: scribe-security/action-bom@master
  with:
    type: oci-archive
    target: '/GitHub/workspace/stub_oci_local.tar'
``` 
</details>

<details>
  <summary> Directory target (SBOM) </summary>

Create SBOM for a local directory.

```YAML
- name: Create dir
  run: |
    mkdir testdir
    echo "test" > testdir/test.txt

- name: gensbom attest dir
  id: gensbom_attest_dir
  uses: scribe-security/action-bom@master
  with:
    type: dir
    target: 'testdir'
``` 
</details>


<details>
  <summary> Git target (SBOM) </summary>

Create SBOM for `mongo-express` remote git repository.

```YAML
- name: Generate cyclonedx json SBOM
  uses: scribe-security/action-bom@master
  with:
    type: git
    target: 'https://github.com/mongo-express/mongo-express.git'
    format: json
``` 

Create SBOM for `my_repo` local git repository.

```YAML

- uses: actions/checkout@v3
  with:
    fetch-depth: 0
    path: my_repo

- name: Generate cyclonedx json SBOM
  uses: scribe-security/action-bom@master
  with:
    type: git
    target: 'my_repo'
    format: json
``` 

</details>

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

>Default attestation config **Required** `id-token` permission access.

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

Verify targets against a signed attestation. <br />

Default attestation config: `sigstore-config` - sigstore (Fulcio, Rekor). <br />
Gensbom will look for both a bom or slsa attestation to verify against.  <br />

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
          path: scribe/gensbom
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
          path: scribe/gensbom
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
          name: gensbom-workdir-evidence
          path: |
            scribe/gensbom      
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
          name: gensbom-git-evidence
          path: |
            scribe/gensbom      
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
    gensbom busybox:latest -vv
``` 
</details>

## .gitignore
It is recommended to add output directory value to your .gitignore file.  <br />
By default add `**/scribe` to your `.gitignore`.
