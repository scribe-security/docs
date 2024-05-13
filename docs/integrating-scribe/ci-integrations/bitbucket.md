
---
sidebar_label: "Bitbucket"
title: "Bitbucket Pipelines Pipe: Scribe evidence generator"
sidebar_position: 7
---
Use the following instructions to integrate your Bitbucket with Scribe.

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
- pipe: scribe-security/valint-pipe:1.1.0
  variables:
    COMMAND: bom
    TARGET: busybox:latest
```
</details>

<details>
  <summary>Generate SLSA provenance for an image in a public registry</summary>

```yaml
- pipe: scribe-security/valint-pipe:1.1.0
  variables:
    COMMAND: slsa
    TARGET: busybox:latest
```
</details>

<details>
  <summary>Generate evidence from a third party tool output</summary>

```yaml
- pipe: scribe-security/valint-pipe:1.1.0
  variables:
    COMMAND: evidence
    TARGET: some_security_report.json
```
</details>

<details>
  <summary>Generate an SBOM for an image built with local docker</summary>

```yaml
- pipe: scribe-security/valint-pipe:1.1.0
  variables:
    COMMAND: bom
    TARGET: image_name:latest
    VERBOSE: 2
```
</details>

<details>
  <summary>Generate SLSA provenance for an image built with local docker</summary>

```yaml
- pipe: scribe-security/valint-pipe:1.1.0
  variables:
    COMMAND: slsa
    TARGET: image_name:latest
```
</details>

<details>
  <summary>Generate an SBOM for an image in a private registry</summary>

> Add a `docker login` task before adding the following task:

```yaml
- pipe: scribe-security/valint-pipe:1.1.0
  variables:
    COMMAND: bom
    TARGET: scribesecurity.jfrog.io/scribe-docker-local/example:latest
```
</details>

<details>
  <summary>Generate SLSA provenance for an image in a private registry</summary>

> Add a `docker login` task before adding the following task:

```yaml
- pipe: scribe-security/valint-pipe:1.1.0
  variables:
    COMMAND: slsa
    TARGET: scribesecurity.jfrog.io/scribe-docker-local/example:latest
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
      - pipe: docker://scribesecuriy.jfrog.io/scribe-docker-public-local/valint-pipe:dev-latest
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


      - pipe: docker://scribesecuriy.jfrog.io/scribe-docker-public-local/valint-pipe:dev-latest
        variables:
          COMMAND_NAME: slsa
          TARGET: busybox:latest
          ENV: test_env
          LABEL: test_label
```
</details>

<details>
  <summary>Export SBOM as an artifact</summary>

> Use `format` input argument to set the format.

```yaml
- step:
    name: save-artifact-step
    script:
      - pipe: docker://scribesecuriy.jfrog.io/scribe-docker-public-local/valint-pipe:dev-latest
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
      - pipe: docker://scribesecuriy.jfrog.io/scribe-docker-public-local/valint-pipe:dev-latest
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

```YAML
step:
  name: dir-sbom-step
  script:
  - mkdir testdir
  - echo "test" > testdir/test.txt
  - pipe: scribe-security/valint-pipe:1.1.0
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
  - pipe: scribe-security/valint-pipe:1.1.0
    variables:
      COMMAND: slsa
      TARGET: dir:./testdir
      SCRIBE_CLIENT_SECRET: $SCRIBE_TOKEN
```
</details>

<details>
  <summary> Generate an SBOM of a git repo </summary>
  <p>For a remote git repo:</p>

```YAML
- step:
    name: valint-git-step
    script:
      - pipe: docker://scribesecuriy.jfrog.io/scribe-docker-public-local/valint-pipe:dev-latest
        variables:
          COMMAND_NAME: bom
          TARGET: git:https://github.com/mongo-express/mongo-express.git
          VERBOSE: 2          
```

<p>For a local git repo:</p>

```YAML
    - step:
        name: valint-git-step
        script:
          - git clone https://github.com/mongo-express/mongo-express.git scm_mongo_express
          - pipe: docker://scribesecuriy.jfrog.io/scribe-docker-public-local/valint-pipe:dev-latest
            variables:
              COMMAND_NAME: bom
              TARGET: dir:scm_mongo_express
              VERBOSE: 2              
```

<details>
  <summary> Generate SLSA provenance for a git repo </summary>
  <p>For a remote git repo:</p>
  
```YAML
- step:
    name: valint-git-step
    script:
      - pipe: docker://scribesecuriy.jfrog.io/scribe-docker-public-local/valint-pipe:dev-latest
        variables:
          COMMAND_NAME: slsa
          TARGET: git:https://github.com/mongo-express/mongo-express.git
          VERBOSE: 2          
```

<p>For a local git repo:</p>

```YAML
    - step:
        name: valint-git-step
        script:
          - git clone https://github.com/mongo-express/mongo-express.git scm_mongo_express
          - pipe: docker://scribesecuriy.jfrog.io/scribe-docker-public-local/valint-pipe:dev-latest
            variables:
              COMMAND_NAME: slsa
              TARGET: dir:scm_mongo_express
              VERBOSE: 2              
```
