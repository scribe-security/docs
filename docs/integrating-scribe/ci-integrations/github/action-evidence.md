---
sidebar_label: "Evidence"
title: Scribe GitHub Action for `valint evidence`
sidebar_position: 2
toc_min_heading_level: 2
toc_max_heading_level: 5
---

Scribe offers the use of GitHub Actions to enable the embedding of evidence collection and integrity validation into your pipeline as a way to help secure your software supply chain.

`valint evidence` is used to collect, Create and Store any file as evidence.

Further documentation **[GitHub integration](../../../integrating-scribe/ci-integrations/github)**.

### Evidence Action
The `valint evidence` action is a versatile action designed to include various types of third-party evidence in your software supply chain. It supports the inclusion of evidence in different formats and can be tailored to fit your specific use cases.

- **Custom Third-Party Evidence:** Attach any third-party evidence.
- **Custom Third-Party CylconeDX:** Attach and third-party SBOM to your product.
- **Flexible Storage:** Store and manage evidence on the Scribe service.
- **OCI Registry Integration:** Attach evidence to any OCI registry or generate evidence directly from your private OCI registry.
- **Licensing Information:** Include any licencing report as part as evidence.
- **Customization Options:** Customize Tool and Format information.
- **Signing SBOM Support:** Attach and sign any third party SBOMs as evidence.
- **Signing Sarif Support:** Attach and sign any third party Sarif as evidence.
- **Signing Capabilities:** Generate In-Toto Attestations out of any file, enhanced security.
- **Keyless Verification:** Support Sigstore keyless verifying as well as [GitHub workload identity](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect).

> Note: Containerized actions may have limitations on generating evidence for targets located outside the working directory. To overcome this, consider installing the tool directly using the [installer](https://github.com/scribe-security/actions/tree/master/installer).

### Input arguments
```yaml
  target:
    description:
    required: true
  compress:
    description: Compress content)
  format:
    description: Evidence format, options=[statement attest]
  format-encoding:
    description: Format encoding
  format-type:
    description: Format type
  format-version:
    description: Format version
  tool:
    description: Tool name
  tool-vendor:
    description: Tool vendor
  tool-version:
    description: Tool version
  allow-expired:
    description: Allow expired certs
  attest-config:
    description: Attestation config path
  attest-default:
    description: Attestation default config, options=[sigstore sigstore-github x509 x509-env]
  backoff:
    description: Backoff duration
  ca:
    description: x509 CA Chain path
  cache-enable:
    description: Enable local cache
  cert:
    description: x509 Cert path
  config:
    description: Configuration file path
  context-dir:
    description: Context dir
  crl:
    description: x509 CRL path
  crl-full-chain:
    description: Enable Full chain CRL verfication
  deliverable:
    description: Mark as deliverable, options=[true, false]
  depth:
    description: Git clone depth
  disable-crl:
    description: Disable certificate revocation verificatoin
  env:
    description: Environment keys to include in sbom
  filter-regex:
    description: Filter out files by regex
  filter-scope:
    description: Filter packages by scope
  git-branch:
    description: Git branch in the repository
  git-commit:
    description: Git commit hash in the repository
  git-tag:
    description: Git tag in the repository
  key:
    description: x509 Private key path
  label:
    description: Add Custom labels
  level:
    description: Log depth level, options=[panic fatal error warning info debug trace]
  log-context:
    description: Attach context to all logs
  log-file:
    description: Output log to file
  oci:
    description: Enable OCI store
  oci-repo:
    description: Select OCI custom attestation repo
  output-directory:
    description: Output directory path
    default: ./scribe/valint
  output-file:
    description: Output file name
  pipeline-name:
    description: Pipeline name
  platform:
    description: Select target platform, examples=windows/armv6, arm64 ..)
  policy-args:
    description: Policy arguments
  predicate-type:
    description: Custom Predicate type (generic evidence format)
  product-key:
    description: Product Key
  product-version:
    description: Product Version
  scribe-auth-audience:
    description: Scribe auth audience
  scribe-client-id:
    description: Scribe Client ID
  scribe-client-secret:
    description: Scribe Client Secret
  scribe-enable:
    description: Enable scribe client
  scribe-url:
    description: Scribe API Url
  structured:
    description: Enable structured logger
  timeout:
    description: Timeout duration
  verbose:
    description: Log verbosity level [-v,--verbose=1] = info, [-vv,--verbose=2] = debug
```

### Output arguments
```yaml
  OUTPUT_PATH:
    description: 'evidence output file path'
```

### Usage
Containerized action can be used on Linux runners as following
```yaml
- name: Include evidence derived from a file
  uses: scribe-security/action-evidence@v1.1.0
  with:
    target: some_file.json
```

Composite Action can be used on Linux or Windows runners as following
```yaml
- name: Include evidence derived from a file
  uses: scribe-security/action-evidence-cli@v1.1.0
  with:
    target: some_file.json
```

> Use `master` instead of tag to automatically pull latest version.

### Configuration
If you prefer using a custom configuration file instead of specifying arguments directly, you have two choices. You can either place the configuration file in the default path, which is `.valint.yaml`, or you can specify a custom path using the `config` argument.

For a comprehensive overview of the configuration file's structure and available options, please refer to the CLI configuration documentation.

### Attestations 
Attestations allow you to sign and verify your targets. <br />
Attestations allow you to connect PKI-based identities to your evidence and policy management.  <br />

Supported outputs:
- In-toto statements (unsigned evidence).
- In-toto attestations (signed evidence).

Select default configuration using `--attest.default` flag. <br />
Select a custom configuration by providing `cocosign` field in the **[configuration](../configuration)** or custom path using `--attest.config`.
Scribe uses the **cocosign** library we developed to deal with digital signatures signing and verification.

* See details of in-toto spec **[here](https://github.com/in-toto/attestation)**.
* See details of what attestations are and how to use them **[here](../attestations)**.

>By default GitHub actions use `sigstore-github` flow, GitHub provided workload identities, this will allow using the workflow identity (`token-id` permissions is required).


### Storing Keys in Secret Vault

GitHub exposes secrets from its vault using environment variables, you may provide these environment as secret to Valint.

> Paths names prefixed with `env://[NAME]` are read from the environment matching the name.

<details>
  <summary> GitHub Secret Vault </summary>

X509 Signer enables the utilization of environments for supplying key, certificate, and CA files in order to sign and verify attestations. It is commonly employed in conjunction with Secret Vaults, where secrets are exposed through environments.

>  path names prefixed with `env://[NAME]` are extracted from the environment corresponding to the specified name.


For example the following configuration and Job.

Configuration File, `.valint.yaml`
```yaml
attest:
  default: "" # Set custom configuration
  cocosign:
    signer:
        x509:
            enable: true
            private: env://SIGNER_KEY
            cert: env://SIGNER_CERT
            ca: env://COMPANY_CA
    verifier:
        x509:
            enable: true
            cert: env://SIGNER_CERT
            ca: env://COMPANY_CA
```
Job example
```yaml
name:  github_vault_workflow

on: 
  push:
    tags:
      - "*"

jobs:
  scribe-sign-verify:
    runs-on: ubuntu-latest
    steps:
        uses: scribe-security/action-evidence@master
        with:
          target: some_file.json
          format: attest
        env:
          SIGNER_KEY: ${{ secrets.SIGNER_KEY }}
          SIGNER_CERT: ${{ secrets.SIGNER_CERT }}
          COMPANY_CA:  ${{ secrets.COMPANY_CA }}

        uses: scribe-security/action-verify@master
        with:
          target: some_file.json
          input-format: attest
        env:
          SIGNER_CERT: ${{ secrets.SIGNER_CERT }}
          COMPANY_CA:  ${{ secrets.COMPANY_CA }}
```

</details>

### Target types - `[target]`
---
Target types are types of artifacts produced and consumed by your supply chain.
Using supported targets, you can collect evidence and verify compliance on a range of artifacts.

> Fields specified as [target] support the following format.

### Format

`[target] file path` 

| Sources | target-type | scheme | Description | example
| --- | --- | --- | --- | --- |
| File | file | file | file path on disk | path/to/yourproject/file | 

### Evidence Stores
Each storer can be used to store, find and download evidence, unifying all the supply chain evidence into a system is an important part to be able to query any subset for policy validation.

| Type  | Description | requirement |
| --- | --- | --- |
| scribe | Evidence is stored on scribe service | scribe credentials |
| OCI | Evidence is stored on a remote OCI registry | access to a OCI registry |

### Scribe Evidence store
Scribe evidence store allows you store evidence using scribe Service.

Related Flags:
> Note the flag set:
>* `scribe-client-id`
>* `scribe-client-secret`
>* `scribe-enable`

### Before you begin
Integrating Scribe Hub with your environment requires the following credentials that are found in the **Integrations** page. (In your **[Scribe Hub](https://scribehub.scribesecurity.com/ "Scribe Hub Link")** go to **integrations**)

* **Client ID**
* **Client Secret**

<img src='../../../../../img/ci/integrations-secrets.jpg' alt='Scribe Integration Secrets' width='70%' min-width='400px'/>

* Add the credentials according to the **[GitHub instructions](https://docs.github.com/en/actions/security-guides/encrypted-secrets/ "GitHub Instructions")**. Based on the code example below, be sure to call the secrets **clientid** for the **client_id**, and **clientsecret** for the **client_secret**.

* Use the Scribe custom actions as shown in the example bellow

### Usage

```yaml
name:  scribe_github_workflow

on: 
  push:
    tags:
      - "*"

jobs:
  scribe-sign-verify:
    runs-on: ubuntu-latest
    steps:
      - uses: scribe-security/action-evidence@master
        with:
          target: [target]
          format: [attest, statement]
          scribe-enable: true
          scribe-client-id: ${{ secrets.clientid }}
          scribe-client-secret: ${{ secrets.clientsecret }}

      - uses: scribe-security/action-verify@master
        with:
          target: [target]
          input-format: [attest-generic, statement-generic]
          scribe-enable: true
          scribe-client-id: ${{ secrets.clientid }}
          scribe-client-secret: ${{ secrets.clientsecret }}
```
You can store the Provenance Document in alternative evidence stores. You can learn more about them **[here](../../../other-evidence-stores)**.


<details>
  <summary> Alternative store OCI </summary>

### OCI Evidence store
Valint supports both storage and verification flows for `attestations` and `statement` objects utilizing OCI registry as an evidence store.

Using OCI registry as an evidence store allows you to upload, download and verify evidence across your supply chain in a seamless manner.

Related flags:
* `oci` Enable OCI store.
* `oci-repo` - Evidence store location.

### Before you begin
Evidence can be stored in any accusable registry.
* Write access is required for upload (generate).
* Read access is required for download (verify).

You must first login with the required access privileges to your registry before calling Valint.
For example, using `docker login` command or `docker/login-action` action.

### Usage
```yaml
name:  scribe_github_workflow

on: 
  push:
    tags:
      - "*"

jobs:
  scribe-sign-verify:
    runs-on: ubuntu-latest
    steps:

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.my_registry }}
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Include evidence step
        uses: scribe-security/action-evidence@master
        with:
          target: [target]
          format: [attest, statement]
          oci: true
          oci-repo: [oci_repo]

      - name:  Verify policy step
        uses: scribe-security/action-verify@master
        with:
          target: [target]
          input-format: [attest-generic, statement-generic]
          oci: true
          oci-repo: [oci_repo]
```
</details>

### Running action as non root user
By default, the action runs in its own pid namespace as the root user. You can change the user by setting specific `USERID` and `USERNAME` environment variables.

```YAML
- name: Include evidence step
  uses: scribe-security/action-evidence@master
  with:
    target: 'some_file.json'
  env:
    USERID: 1001
    USERNAME: runner
``` 

<details>
  <summary> Non root user with HIGH UID/GID </summary>
By default, the action runs in its own pid namespace as the root user. If the user uses a high UID or GID, you must specify all the following environment variables. You can change the user by setting specific `USERID` and `USERNAME` variables. Additionally, you may group the process by setting specific `GROUPID` and `GROUP` variables.

```YAML
- name: Include evidence step
  uses: scribe-security/action-evidence@master
  with:
    target: 'some_file.json'
  env:
    USERID: 888000888
    USERNAME: my_user
    GROUPID: 777000777
    GROUP: my_group
``` 
</details>

### Basic examples
<details>
  <summary>  Attach file as evidence to product </summary>

Create evidence for local 'some_file.json' file and attach it to a specific product version.

```YAML
- name: Include evidence attached to a product
  uses: scribe-security/action-evidence@master
  with:
    target: 'some_file.json'
    product-key: my_product
    product-version: 3
``` 

</details>

<details>
  <summary>  Include Trivy vulnerability report as evidence </summary>

Include evidence derived from a Trivy vulnerability report.

```YAML
name: build
on:
  push:
    branches:
      - main
  pull_request:
jobs:
  build:
    name: Build
    runs-on: ubuntu-20.04
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Run Trivy vulnerability scanner in IaC mode
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'config'
          hide-progress: false
          format: 'sarif'
          output: 'trivy-results.sarif'
          exit-code: '1'
          ignore-unfixed: true
          severity: 'CRITICAL,HIGH'

      - name: Attach sarif report as evidence
        uses: scribe-security/action-evidence@master
        with:
          target: 'trivy-results.sarif'
          product-key: my_product
          product-version: 3
``` 
</details>


<details>
  <summary>  Include report as deliverable evidence </summary>

Include deliverable evidence derived from a Trivy vulnerability report.

```YAML
name: build
on:
  push:
    branches:
      - main
  pull_request:
jobs:
  build:
    name: Build
    runs-on: ubuntu-20.04
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Run Trivy vulnerability scanner in IaC mode
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'config'
          hide-progress: false
          format: 'sarif'
          output: 'trivy-results.sarif'
          exit-code: '1'
          ignore-unfixed: true
          severity: 'CRITICAL,HIGH'

      - name: Attach sarif report as deliverable evidence
        uses: scribe-security/action-evidence@master
        with:
          target: 'trivy-results.sarif'
          product-key: my_product
          product-version: 3
          deliverable: true
``` 
</details>

<details>
  <summary>  Custom tool information </summary>

Include evidence for a file with custom tool-related metadata.

```YAML
- name: Attach file as evidence with custom tool information
  id: valint_labels
  uses: scribe-security/action-bom@master
  with:
    target: some_file.json
    tool: my_tool
    tool-version: v0.0.1
    tool-vendor: 'My Company Inc'
```
</details>

<details>
  <summary>  Custom format information </summary>

Include evidence for a file with custom format-related metadata.

```YAML
- name: Attach file as evidence with custom format information
  id: valint_labels
  uses: scribe-security/action-bom@master
  with:
    target: some_file.json
    format-type: my_format
    format-version: v1
    format-encoding: xml
```
</details>


<details>
  <summary> Save evidence as artifact </summary>

Using action `OUTPUT_PATH` output argument you can access the generated evidence and store it as an artifact.

> Use action `output-file: <my_custom_path>` input argument to set a custom output path.

```YAML
- name: Include file as evidence
  id: valint_json
  uses: scribe-security/action-evidence@master
  with:
    target: some_file.json
    output-file: some_file.evidence.json

- uses: actions/upload-artifact@v2
  with:
    name: scribe-evidence
    path: ${{ steps.valint_json.outputs.OUTPUT_PATH }}

- uses: actions/upload-artifact@v2
  with:
    name: scribe-evidence
    path: scribe/
``` 
</details>

<details>
  <summary> Attest File evidence (Signed) </summary>

Create and sign file as evidence. <br />
By default the `sigstore-github` flow is used, GitHub workload identity and Sigstore (Fulcio, Rekor).

>Default attestation config **Required** `id-token` permission access.

```YAML
job_example:
  runs-on: ubuntu-latest
  permissions:
    id-token: write
  steps:
    - name: valint attest
    uses: scribe-security/action-evidence@master
    with:
      target: some_file.json
``` 
</details>

<details>
  <summary> Verify file evidence </summary>

Verify targets against a signed attestation. <br />

Default attestation config: `sigstore-github` - Sigstore (Fulcio, Rekor). <br />

```YAML
- name: valint verify
  uses: scribe-security/action-verify@master
  with:
    target: some_file.json
    input-format: attest-generic
``` 

</details>

<details>
  <summary> Verify Policy flow (Signed) </summary>

Full job example of a signing and verifying evidence flow.

```YAML
 valint-evidence:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
      id-token: write
    steps:

      - uses: actions/checkout@v2
        with:
          fetch-depth: 0

      - name: some tool exposing report
        run: |
          echo "{}" > some_file.json

      - name: valint attest
        id: valint_attest
        uses: scribe-security/action-evidence@master
        with:
           target: some_file.json
           format: attest

      - name: valint verify
        id: valint_verify
        uses: scribe-security/action-verify@master
        with:
          target: some_file.json
          input-format: attest-generic

      - uses: actions/upload-artifact@v2
        with:
          name: valint-evidence-test
          path: scribe/valint
``` 

</details>

<details>
  <summary> Attest and verify evidence on OCI </summary>

Store any evidence on any OCI registry. <br />

> Use input variable `format` to select between supported formats. <br />
> Write permission to `oci-repo` is required. 

```YAML
valint-dir-test:
  runs-on: ubuntu-latest
  permissions:
    id-token: write
  env:
    DOCKER_CONFIG: $HOME/.docker
  steps:
    - uses: actions/checkout@v3
      with:
        fetch-depth: 0

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY_URL }}
          username: ${{ secrets.REGISTRY_USERNAME }}
          password: ${{ secrets.REGISTRY_TOKEN }}

      - uses: scribe-security/action-evidence@master
        id: valint_attest
        with:
          target: some_file.json
          format: attest-generic
          oci: true
          oci-repo: ${{ env.REGISTRY_URL }}/attestations    
``` 

Following actions can be used to verify a target over the OCI store.
```yaml
      - name: Login to GitHub Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY_URL }}
          username: ${{ secrets.REGISTRY_USERNAME }}
          password: ${{ secrets.REGISTRY_TOKEN }}

      - uses: scribe-security/action-verify@master
        id: valint_attest
        with:
          target: some_file.json
          input-format: attest-generic
          oci: true
          oci-repo: ${{ env.REGISTRY_URL }}/attestations   
```
> Read permission to `oci-repo` is required. 

</details>

<details>
  <summary> Install Valint (tool) </summary>

Install Valint as a tool
```YAML
- name: install valint
  uses: scribe-security/action-installer@master

- name: valint run
  run: |
    valint --version
    valint evidence some_file.json
``` 
</details>

## .gitignore
It's recommended to add output directory value to your .gitignore file.
By default add `**/scribe` to your `.gitignore`.

## Other Actions
* [bom](action-bom.md), [source](https://github.com/scribe-security/action-bom)
* [slsa](action-slsa.md), [source](https://github.com/scribe-security/action-slsa)
* [evidence](action-evidence.md), [source](https://github.com/scribe-security/action-evidence)
* [verify](action-verify.md), [source](https://github.com/scribe-security/action-verify)
* [installer](action-installer.md), [source](https://github.com/scribe-security/action-installer)
