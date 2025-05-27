---
sidebar_label: "Bitbucket"
title: "Bitbucket Pipelines Pipe: Scribe evidence generator"
sidebar_position: 7
---
Use the following instructions to integrate your Bitbucket with Scribe.

# YAML Definition

Add the following snippet to the script section of your `bitbucket-pipelines.yml` file:

```yaml
- pipe: scribe-security/valint-pipe:2.0.0
  variables:
    COMMAND_NAME: "<string>"
    TARGET: "<string>"
    # INITIATIVE: "<string>"
    # INITIATIVE_ID: "<string>"
    # INITIATIVE_NAME: "<string>"
    # VERBOSE: '<string>' # Optional
    # CONFIG:'<string>' # Optional
    # FORMAT: '<string>' # Optional
    # INPUT_FORMAT: '<string>' # Optional
    # OUTPUT_DIRECTORY: --output-directory # Optional
    # OUTPUT_FILE: '<string>' # Optional
    # LABEL: '<string>' # Optional
    # ENV: '<string>' # Optional
    # FILTER_REGEX: '<string>' # Optional
    # FILTER_SCOPE: '<string>' # Optional
    # PACKAGE_TYPE: '<string>' # Optional
    # PACKAGE_GROUP: '<string>' # Optional
    # FORCE: --force # Optional
    # GIT_BRANCH: '<string>' # Optional
    # GIT_COMMIT: '<string>' # Optional
    # GIT_TAG: '<string>' # Optional
    # ATTEST_CONFIG: '<string>' # Optional
    # ATTEST_DEFAULT: '<string>' # Optional
    # SCRIBE_ENABLE: '<boolean>' # Optional
    # SCRIBE_CLIENT_ID: '<string>' # Optional
    # SCRIBE_CLIENT_SECRET: '<string>' # Optional
    # ATTESTATION: '<string>' # Optional
    # COMPONENTS: '<string>' # Optional
    # OCI: '<boolean>' # Optional
    # OCI_REPO: '<string>' # Optional
    # BUNDLE: '<string>' # Optional
    # COMMON_NAME: '<string>' # Optional
    # EMAIL: '<string>' # Optional
    # RULE: '<string>' # Optional
    # SKIP_BUNDLE: '<boolean>' # Optional
    # SKIP_REPORT: '<boolean>' # Optional
    # URI: --uri
    # ALLOW_EXPIRED: '<string>' # Optional
    # BACKOFF: '<string>' # Optional
    # CA: '<string>' # Optional
    # CACHE_ENABLE: '<string>' # Optional
    # CERT: '<string>' # Optional
    # KEY: '<string>' # Optional
    # CONTEXT_DIR: '<string>' # Optional
    # CRL: '<string>' # Optional
    # CRL_FULL_CHAIN: '<string>' # Optional
    # DELIVERABLE: '<string>' # Optional
    # DEPTH: <integer>' # Optional
    # DISABLE_CRL: '<boolean>' # Optional
    # FILTER_SCOPE: '<string>' # Optional
    # GIT_TAG: '<string>' # Optional
    # LEVEL: '<string>' # Optional
    # LOG_CONTEXT: '<string>' # Optional
    # LOG_FILE: '<string>' # Optional
    # PREDICATE_TYPE: '<string>' # Optional
    # PRODUCT_KEY: '<string>' # Optional
    # PRODUCT_VERSION: '<string>' # Optional
    # RULE_ARGS: '<string>' # Optional
    # SCRIBE_AUTH_AUDIENCE: '<string>' # Optional
    # SCRIBE_URL: '<string>' # Optional
    # STRUCTURED: '<string>' # Optional
    # TIMEOUT: '<string>' # Optional
    # BOM: '<boolean>' # Optional
    # PROVENANCE: '<boolean>' # Optional
```

### Required Variables

| Variable     | Usage                                    |
| ------------ | ---------------------------------------- |
| COMMAND_NAME | Name of the command to execute (`bom`, `slsa`, `evidence`, `verify`) |

### Common Variables
Flags for all `valint` subcommands

| Variable       | Usage                                                                                                                         | Default             |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| ALLOW_EXPIRED   | Allow expired certs                                                                                                           |                    |
| ATTEST_CONFIG   | Attestation config path                                                                                                       |                    |
| ATTEST_DEFAULT  | Attestation default config, options=[sigstore sigstore-github x509 x509-env]                                                  | "sigstore"         |
| BACKOFF         | Backoff duration                                                                                                              | "15s"              |
| CA              | x509 CA Chain path                                                                                                            |                    |
| CACHE_ENABLE    | Enable local cache                                                                                                            | true               |
| CERT            | x509 Cert path                                                                                                                |                    |
| CONFIG          | Configuration file path                                                                                                       |                    |
| CONTEXT_DIR     | Context dir                                                                                                                   |                    |
| CONTEXT_TYPE    | CI context type, options=[jenkins github circleci azure gitlab travis tekton bitbucket local]                                 | "local"            |
| CRL             | x509 CRL path                                                                                                                 |                    |
| CRL_FULL_CHAIN  | Enable Full chain CRL verification                                                                                            |                    |
| DELIVERABLE     | Mark as deliverable, options=[true, false]                                                                                    |                    |
| DEPTH           | Git clone depth                                                                                                               |                    |
| DISABLE_CRL     | Disable certificate revocation verification                                                                                   |                    |
| ENV             | Environment keys to include in sbom                                                                                           |                    |
| FILTER_REGEX    | Filter out files by regex                                                                                                     | [**/*.pyc,**/.git/**] |
| FILTER_SCOPE    | Filter packages by scope                                                                                                      |                    |
| GIT_BRANCH      | Git branch in the repository                                                                                                  |                    |
| GIT_COMMIT      | Git commit hash in the repository                                                                                             |                    |
| GIT_TAG         | Git tag in the repository                                                                                                     |                    |
| KEY             | x509 Private key path                                                                                                         |                    |
| LABEL           | Add Custom labels                                                                                                             |                    |
| LEVEL           | Log depth level, options=[panic fatal error warning info debug trace]                                                         |                    |
| LOG_CONTEXT     | Attach context to all logs                                                                                                    |                    |
| LOG_FILE        | Output log to file                                                                                                            |                    |
| OCI             | Enable OCI store                                                                                                              |                    |
| OCI_REPO        | Select OCI custom attestation repo                                                                                            |                    |
| OUTPUT_DIRECTORY| Output directory path                                                                                                         | "$\{XDG_CACHE_HOME\}/valint" | any |
| OUTPUT_FILE     | Output file name                                                                                                              |                    |
| PIPELINE_NAME   | Pipeline name                                                                                                                 |                    |
| PLATFORM        | Select target platform, examples=windows/armv6, arm64 ..)                                                                     |                    |
| PREDICATE_TYPE  | Custom Predicate type (generic evidence format)                                                                               | "http://scribesecurity.com/evidence/generic/v0.1" | any |
| PRODUCT_KEY     | Product Key                                                                                                                   |                    |
| PRODUCT_VERSION | Product Version                                                                                                               |                    |
| QUIET           | Suppress all logging output                                                                                                   |                    |
| SCRIBE_CLIENT_SECRET| Scribe Client Secret                                                                                                      |                    |
| SCRIBE_ENABLE   | Enable scribe client                                                                                                          |                    |
| SCRIBE_URL      | Scribe API Url                                                                                                                | "https://api.scribesecurity.com" | any |
| SHOW            | Print evidence to stdout                                                                                                      |                    |
| STRUCTURED      | Enable structured logger                                                                                                      |                    |
| TIMEOUT         | Timeout duration                                                                                                              | "120s"             |
| VERBOSE         | Log verbosity level [-v,--verbose=1] = info, [-vv,--verbose=2] = debug                                                        |                    |

### Bom Command Variables

if `COMMAND` is set to `bom`:

| Variable              | Usage                                                                                                              | Default                                      
| --------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| TARGET (*)      | Target object name format=`[docker:{image:tag}, dir:{dir_path}, git:{git_path}, docker-archive:{archive_path}, oci-archive:archive_path, registry:image:tag`] |
| ATTACH_REGEX          | Attach files content by regex                                                                                      | |
| AUTHOR_EMAIL          | Set author email                                                                                                   | |
| AUTHOR_NAME           | Set author name                                                                                                    | |
| AUTHOR_PHONE          | Set author phone                                                                                                   | |
| COMPONENTS            | Select sbom components groups, options=[metadata layers packages syft files dep commits]                           | [metadata,layers,packages,syft,dep,commits] |
| FORCE                 | Force overwrite cache                                                                                              | |
| FORMAT                | Evidence format, options=[cyclonedx-json cyclonedx-xml attest-cyclonedx-json statement-cyclonedx-json attest-slsa statement-slsa statement-generic attest-generic] | [cyclonedx-json]                            |
| PACKAGE_EXCLUDE_TYPE  | Exclude package type, options=[ruby python javascript java dpkg apk rpm go-module dotnet r-package rust binary sbom nix conan alpm graalvm cocoapods swift dart elixir php erlang github portage haskell kernel] | |
| PACKAGE_GROUP         | Select package group, options=all                                                                                 | |
| PACKAGE_TYPE          | Select package type, options=[ruby python javascript java dpkg apk rpm go-module dotnet r-package rust binary sbom nix conan alpm graalvm cocoapods swift dart elixir php erlang github portage haskell kernel] | [ruby,python,javascript,java,dpkg,apk,rpm,go-module,dotnet,r-package,rust,binary,sbom,nix,conan,alpm,graalvm,cocoapods,swift,dart,elixir,php,erlang,github,portage,haskell,kernel] |
| SUPPLIER_EMAIL        | Set supplier email                                                                                                 | |
| SUPPLIER_NAME         | Set supplier name                                                                                                  | |
| SUPPLIER_PHONE        | Set supplier phone                                                                                                 | |
| SUPPLIER_URL          | Set supplier URL                                                                                                   | |
| (*) = required variable. |                                                                                                                 | |
### SLSA Command Variables

if `COMMAND` is set to `slsa`:

| Variable       | Usage                                                          | Default |
| -------------- | -------------------------------------------------------------- | --- |
| TARGET (*)      | Target object name format=`[docker:{image:tag}, dir:{dir_path}, git:{git_path}, docker-archive:{archive_path}, oci-archive:archive_path, registry:image:tag`]     | |
| ALL_ENV        | Attach all environment variables                               | |
| BUILD_TYPE     | Set build type                                                 | |
| BUILDER_ID     | Set builder id                                                 | |
| BY_PRODUCT     | Attach by product path                                         | |
| COMPONENTS     | Select by products components groups, options=[metadata layers packages syft files dep commits] | |
| EXTERNAL       | Add build external parameters                                  | |
| FINISHED_ON    | Set metadata finished time (YYYY-MM-DDThh:mm:ssZ)              | |
| FORCE          | Force overwrite cache                                          | |
| FORMAT         | Evidence format, options=[statement attest predicate]          | | 
| INVOCATION     | Set metadata invocation ID                                     | |
| PREDICATE      | Import predicate path                                          | |
| STARTED_ON     | Set metadata started time (YYYY-MM-DDThh:mm:ssZ)               | |
| STATEMENT      | Import statement path                                          | |
| (*) = required variable. |                                                      | |

### Evidence Command Variables

if `COMMAND` is set to `evidence`:

| Variable         | Usage                                       | Default |
| ---------------- | ------------------------------------------- | ------- |
| TARGET (*)      | Target object name format=`[file-path] |
| COMPRESS         | Compress content                            |         |
| FORMAT           | Evidence format, options=[statement attest] | [statement] |
| FORMAT_ENCODING  | Format encoding                             |         |
| FORMAT_TYPE      | Format type                                 |         |
| FORMAT_VERSION   | Format version                              |         |
| HELP             | Show help message                           |         |
| TOOL             | Tool name                                   |         |
| TOOL_VENDOR      | Tool vendor                                 |         |
| TOOL_VERSION     | Tool version                                |         |
| (*) = required variable. |                                     |         |
Ah, I see! You want to include the **initiative flags** (e.g., `INITIATIVE`, `INITIATIVE_ID`, `INITIATIVE_NAME`) in the **Verify Command Variables** section. Here's the updated table with the initiative flags included:

---

### Verify Command Variables

If `COMMAND` is set to `verify`:

| Variable          | Usage                                                                                                                                         | Default                                            |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `ATTESTATION`     | Attestation for target                                                                                                                        | Required                                           |
| `BUNDLE`          | Policy bundle URI/path (early-availability)                                                                                                   | `https://github.com/scribe-public/sample-policies` |
| `COMMON_NAME`     | Default policy allowed common names                                                                                                           | Optional                                           |
| `EMAIL`           | Default policy allowed emails                                                                                                                 | Optional                                           |
| `FORCE`           | Force skip cache                                                                                                                              | Optional                                           |
| `HELP`            | Show help message                                                                                                                             | Optional                                           |
| `INPUT_FORMAT`    | Evidence format, options: `[attest-cyclonedx-json, attest-slsa, statement-slsa, statement-cyclonedx-json, statement-generic, attest-generic]` | `attest-cyclonedx-json`                            |
| `RULE`            | Rule configuration file path (early-availability)                                                                                             | Optional                                           |
| `SKIP_BUNDLE`     | Skip bundle download                                                                                                                          | Optional                                           |
| `SKIP_REPORT`     | Skip policy report stage                                                                                                                      | Optional                                           |
| `URI`             | Default policy allowed URIs                                                                                                                   | Optional                                           |
| `INITIATIVE`      | Initiative name (optional)                                                                                                                    | Optional                                           |
| `INITIATIVE_ID`   | Initiative ID (optional)                                                                                                                      | Optional                                           |
| `INITIATIVE_NAME` | Full name of the initiative (optional)                                                                                                        | Optional                                           |

---

# Example: Enforcing SP 800-190 Controls with Valint Initiatives

This workflow demonstrates how to leverage Valint’s initiative engine to automatically generate evidence (SBOM and vulnerability reports), submit it to Valint, and enforce SP 800-190 controls on your container image.

```yaml
pipelines:
  pull-requests:
    '**':
      - step:
          name: Build Docker image
          image: docker:stable-git
          services:
            - docker
          caches:
            - docker
          script:
            # Build the image tagged with the commit SHA
            - docker build -t my_image:latest -f Dockerfile .

      - step:
          name: Scan image with Trivy
          image: docker:stable-git
          services:
            - docker
          caches:
            - docker
          script:
            # Install Trivy CLI
            - curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh \  
                | sh -s -- -b /usr/local/bin
            # Scan and emit SARIF
            - trivy image \
                --format sarif \
                --output trivy-report.sarif \
                --exit-code 0 \
                --ignore-unfixed \
                --severity CRITICAL,HIGH \
                my_image:latest

      - step:
          name: Collect Evidence & Evaluate SP 800-190 Initiative
          image: docker:stable-git
          services:
            - docker
          script:
            - pipe: scribe-security/valint-pipe:2.0.0
              variables:
                COMMAND_NAME:  "verify"
                INITIATIVE:    "sp-800-190@v2"
                TARGET:        "my_image:latest"
                BOM:           "true"                      # auto-generate SBOM
                BASE_IMAGE:    "Dockerfile"                # include base-image evidence
                INPUT:         "sarif:trivy-report.sarif" # vulnerability evidence
                INPUT_FORMAT:  "attest"                    # treat SARIF as attest
                BEAUTIFY:      "true"

```


> **Note:** Enabling `BOM`, `provenance` `PROVENANCE`, or `INPUT` flags ensures Valint generates and ingests the necessary evidence before policy evaluation.


# Scribe integration

### 1. Obtain a Scribe Hub API Token
1. Sign in to [Scribe Hub](https://app.scribesecurity.com). If you don't have an account you can sign up for free [here](https://scribesecurity.com/scribe-platform-lp/ "Start Using Scribe For Free").

2. Create an API token in [Scribe Hub > Settings > Tokens](https://app.scribesecurity.com/settings/tokens). Copy it to a safe temporary notepad until you complete the integration.

:::note Important
The token is a secret and will not be accessible from the UI after you finalize the token generation.
:::

### 2. Add the API token to the Bitbucket secrets

Add the Scribe Hub API token as `SCRIBE_TOKEN` by following the [Bitbucket instructions](https://support.atlassian.com/bitbucket-cloud/docs/variables-and-secrets/ "Bitbucket instructions").

### 3. Install Scribe CLI

**Valint** - Scribe CLI is required to generate evidence such as SBOMs and SLSA provenance. Install the [Valint-pipe](https://bitbucket.org/scribe-security/valint-pipe/src/master/).

### 4. Instrument your build scripts

#### Examples

<details>
  <summary>Generate an SBOM for an image in a public registry</summary>

```yaml
- pipe: scribe-security/valint-pipe:2.0.0
  variables:
    COMMAND: bom
    TARGET: busybox:latest
```
</details>

<details>
  <summary>Generate SLSA provenance for an image in a public registry</summary>

```yaml
- pipe: scribe-security/valint-pipe:2.0.0
  variables:
    COMMAND: slsa
    TARGET: busybox:latest
```
</details>

<details>
  <summary>Generate evidence from a third party tool output</summary>

```yaml
- pipe: scribe-security/valint-pipe:2.0.0
  variables:
    COMMAND: evidence
    TARGET: some_security_report.json
```
</details>

<details>
  <summary>Generate an SBOM for an image built with local docker</summary>

```yaml
- pipe: scribe-security/valint-pipe:2.0.0
  variables:
    COMMAND: bom
    TARGET: image_name:latest
    VERBOSE: 2
```
</details>

<details>
  <summary>Generate SLSA provenance for an image built with local docker</summary>

```yaml
- pipe: scribe-security/valint-pipe:2.0.0
  variables:
    COMMAND: slsa
    TARGET: image_name:latest
```
</details>

<details>
  <summary>Generate an SBOM for an image in a private registry</summary>

> Add a `docker login` task before adding the following task:

```yaml
- pipe: scribe-security/valint-pipe:2.0.0
  variables:
    COMMAND: bom
    TARGET: scribesecurity/example:latest
```
</details>

<details>
  <summary>Generate SLSA provenance for an image in a private registry</summary>

> Add a `docker login` task before adding the following task:

```yaml
- pipe: scribe-security/valint-pipe:2.0.0
  variables:
    COMMAND: slsa
    TARGET: scribesecurity/example:latest
    VERBOSE: 2
```
</details>

<details>
  <summary>Add custom metadata to SBOM</summary>

```yaml
- step:
    name: valint-image-step
    script:
      - export test_env=test_env_value
      - pipe: docker://scribesecurity/valint-pipe:latest
        variables:
          COMMAND_NAME: bom
          TARGET: busybox:latest
          ENV: test_env
          LABEL: test_label
```
</details>

<details>
  <summary>Add custom metadata to SLSA provenance</summary>

```yaml
- step:
    name: valint-image-step
    script:
      - export test_env=test_env_value


      - pipe: docker://scribesecurity/valint-pipe:latest
        variables:
          COMMAND_NAME: slsa
          TARGET: busybox:latest
          ENV: test_env
          LABEL: test_label
```
</details>

<details>
  <summary>Export SBOM as an artifact</summary>

> Use `FORMAT` input argument to set the format.

```yaml
- step:
    name: save-artifact-step
    script:
      - pipe: docker://scribesecurity/valint-pipe:latest
        variables:
          COMMAND_NAME: bom
          OUTPUT_FILE: my_sbom.json
          TARGET: busybox:latest

    artifacts:
      - scribe/**
      - my_sbom.json
```
</details>

<details>
  <summary>Export SLSA provenance as an artifact</summary>

> Use `format` input argument to set the format.

```yaml
- step:
    name: save-artifact-step
    script:
      - pipe: docker://scribesecurity/valint-pipe:latest
        variables:
          COMMAND_NAME: slsa
          OUTPUT_FILE: my_slsa.json
          TARGET: busybox:latest

    artifacts:
      - scribe/**
      - my_slsa.json
```
</details>

<details>
  <summary> Generate an SBOM of a local file directory </summary>

```yaml
step:
  name: dir-sbom-step
  script:
  - mkdir testdir
  - echo "test" > testdir/test.txt
  - pipe: scribe-security/valint-pipe:2.0.0
    variables:
      COMMAND: bom
      TARGET: dir:./testdir
      SCRIBE_CLIENT_SECRET: $SCRIBE_TOKEN
```
</details>
<details>
  <summary> Generate SLSA provenance of a local file directory </summary>
  
```YAML
step:
  name: dir-sbom-step
  script:
  - mkdir testdir
  - echo "test" > testdir/test.txt
  - pipe: scribe-security/valint-pipe:2.0.0
    variables:
      COMMAND: slsa
      TARGET: dir:./testdir
      SCRIBE_CLIENT_SECRET: $SCRIBE_TOKEN
```
</details>

<details>
  <summary> Generate an SBOM of a git repo </summary>
  For a remote git repo:

```yaml
- step:
    name: valint-git-step
    script:
      - pipe: docker://scribesecurity/valint-pipe:latest
        variables:
          COMMAND_NAME: bom
          TARGET: git:https://github.com/mongo-express/mongo-express.git        
```

For a local git repo:

```yaml
    - step:
        name: valint-git-step
        script:
          - git clone https://github.com/mongo-express/mongo-express.git scm_mongo_express
          - pipe: docker://scribesecurity/valint-pipe:latest
            variables:
              COMMAND_NAME: bom
              TARGET: dir:scm_mongo_express   
```
</details>

<details>
  <summary> Generate SLSA provenance for a git repo </summary>
  
  For a remote git repo:
  
```yaml
- step:
    name: valint-git-step
    script:
      - pipe: docker://scribesecurity/valint-pipe:latest
        variables:
          COMMAND_NAME: slsa
          TARGET: git:https://github.com/mongo-express/mongo-express.git
```

For a local git repo:

```yaml
    - step:
        name: valint-git-step
        script:
          - git clone https://github.com/mongo-express/mongo-express.git scm_mongo_express
          - pipe: docker://scribesecurity/valint-pipe:latest
            variables:
              COMMAND_NAME: slsa
              TARGET: dir:scm_mongo_express
```
</details>


### Alternative evidence stores

> You can learn more about alternative stores **[here](https://scribe-security.netlify.app/docs/integrating-scribe/other-evidence-stores)**.

<details>
  <summary> <b> OCI Evidence store </b></summary>
Valint supports both storage and verification flows for `attestations`  and `statement` objects utilizing OCI registry as an evidence store.

Using OCI registry as an evidence store allows you to upload, download and verify evidence across your supply chain in a seamless manner.

Related flags:

* `OCI` Enable OCI store.
* `OCI_REPO` - Evidence store location.

### Before you begin

Evidence can be stored in any accusable registry.

* Write access is required for upload (generate).
* Read access is required for download (verify).

You must first login with the required access privileges to your registry before calling Valint.
For example, using `docker login` command.

### Usage

```yaml
pipelines:
  default:
    - step:
        name: scribe-bitbucket-oci-pipeline
        script:    
          - docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD [my_registry]
          - pipe: scribe-security/valint-pipe:2.0.0
            variables:
              COMMAND_NAME: [bom,slsa,evidence]
              TARGET:  [target]
              FORMAT: [attest, statement]
              OCI: true
              OCI_REPO: [oci_repo]

          - pipe: scribe-security/valint-pipe:2.0.0
            variables:
              COMMAND_NAME: verify
              TARGET:  [target]
              INPUT_FORMAT: [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic]
              OCI: true
              OCI_REPO: [oci_repo]
```

</details>