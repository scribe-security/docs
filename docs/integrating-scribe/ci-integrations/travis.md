---
sidebar_label: "Travis CI"
title: Travis CI
sidebar_position: 6
---
Use the following instructions to integrate your Travis CI pipelines with Scribe.

### 1. Obtain a Scribe Hub API Token
1. Sign in to [Scribe Hub](https://app.scribesecurity.com). If you don't have an account you can sign up for free [here](https://scribesecurity.com/scribe-platform-lp/ "Start Using Scribe For Free").

2. Create a API token in [Scribe Hub > Settings > Tokens](https://app.scribesecurity.com/settings/tokens). Copy it to a safe temporary notepad until you complete the integration.
:::note Important
The token is a secret and will not be accessible from the UI after you finalize the token generation. 
:::

### 2. Add the API token to the Travis CI secrets

Add the Scribe Hub API token as SCRIBE_TOKEN to your environment by following the [Travis CI setting up environment variables instructions](https://docs.travis-ci.com/user/environment-variables/ "Travis CI - setting up environment variables")
### 3. Install Scribe CLI

**Valint** (Scribe CLI) is required to generate evidence in such as SBOMs and SLSA provenance. 
Install Valint on your build runner with the following command
```
sh 'curl -sSfL https://get.scribesecurity.com/install.sh | sh -s -- -b ./temp/bin'
```

Alternatively, add an instalation stage at the beginning of your relevant builds as follows:
```yaml
install:
  - mkdir ./bin
  - curl -sSfL https://get.scribesecurity.com/install.sh| sh -s -- -b $PWD/bin
  - export PATH=$PATH:$PWD/bin/
```
### 4. Instrument your build scripts

#### Usage
```yaml
install:
  - mkdir ./bin
  - curl -sSfL https://get.scribesecurity.com/install.sh| sh -s -- -b $PWD/bin
  - export PATH=$PATH:$PWD/bin/


name: "scribe-travis-job"

script:
  - |
    valint [bom,slsa,evidence] [target] \
        --format [attest, statement] \
        --context-type travis \
        --output-directory ./scribe/valint \
        -P $SCRIBE_TOKEN 

        
  - |
    valint verify [target] \
        --format [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] \
        --context-type travis \
        --output-directory ./scribe/valint \
        -P $SCRIBE_TOKEN 
```

Make sure that your Travis project has a file named `.travis-ci.yml` to add the following examples to:
 
### Basic example

```yaml
jobs:
  include:
    - name: 'bom-targets'
      git:
        depth: false
      install:
        - mkdir ./bin
        - curl -sSfL https://get.scribesecurity.com/install.sh| sh -s -- -b $PWD/bin
        - export PATH=$PATH:$PWD/bin/
      env: test_env=test_env_value
      script:
        - |
          valint bom busybox:latest \
              --context-type travis \
              --output-directory ./scribe/valint \
              -f
```

### Additional examples
<details>
  <summary> Generate an SBOM for an image in a public registry </summary>

```YAML
- |
  valint bom busybox:latest \
      --context-type travis \
      --output-directory ./scribe/valint \
      -f
``` 

</details>

<details>
  <summary> Generate SLSA provenance for an image in a public registry </summary>

```YAML
- |
  valint slsa busybox:latest \
      --context-type travis \
      --output-directory ./scribe/valint \
      -f
``` 

</details>

<details>
  <summary> Generate an SBOM for for an image built with local docker </summary>
```YAML
- |
  valint bom image_name:latest \
      --context-type travis \
      --output-directory ./scribe/valint \
      -f
``` 
</details>
<details>
  <summary> Generate SLSA provenance for for an image built with local docker </summary>

```YAML
- |
  valint slsa image_name:latest \
      --context-type travis \
      --output-directory ./scribe/valint \
      -f
``` 
</details>

<details>
  <summary>  Generate an SBOM for an image in a private registry </summary>
> Add a `docker login` task before the adding the following step:

```YAML
- |
  valint bom scribesecurity/example:latest \
      --context-type travis \
      --output-directory ./scribe/valint \
      -f
```
</details>

<details>
  <summary> Generate SLSA provenance for an image in a private registry </summary>

> Add a `docker login` task before the adding the following step:

```YAML
- |
  valint slsa scribesecurity/example:latest \
      --context-type travis \
      --output-directory ./scribe/valint \
      -f
```
</details>

<details>
  <summary>  Add custom metadata to SBOM </summary>
```YAML
- name: 'bom-targets'
  env: test_env=test_env_value
  script:
    - |
      valint bom busybox:latest \
          --context-type travis \
          --output-directory ./scribe/valint \
          --env test_env --label test_label \
          -f
```
</details>

<details>
  <summary>  Add custom metadata to SLSA provenance </summary>
```YAML
- name: 'slsa-targets'
  env: test_env=test_env_value
  script:
    - |
      valint slsa busybox:latest \
          --context-type travis \
          --output-directory ./scribe/valint \
          --env test_env --label test_label \
          -f
```
</details>


<details>
  <summary> Export SBOM as an artifact </summary>
Using command `output-directory` or `output-file` to export evidence as an artifact.

> Use `format` input argumnet to set the format and add the following environment variables in the repository settings:
```
ARTIFACTS_KEY=(AWS access key id)
ARTIFACTS_SECRET=(AWS secret access key)
ARTIFACTS_BUCKET=(S3 bucket name)
```
For more details see **[Artifact documentation](https://docs.travis-ci.com/user/uploading-artifacts/)**.

```YAML
- name: 'save-artifact'
      git:
        depth: false

      install:
        - mkdir ./bin
        - curl -sSfL https://get.scribesecurity.com/install.sh| sh -s -- -b $PWD/bin
        - export PATH=$PATH:$PWD/bin/
      
      script:

      - |
        valint bom busybox:latest \
            --context-type travis \
            --output-directory ./scribe/valint \
            --output-file ./my_sbom.json \
            -f
      
      addons:
      
        artifacts:
          paths:
          - ./scribe/valint
          - ./my_sbom.json
```

</details>

<details>
  <summary> Export SLSA provenance as an artifact </summary>

Use `format` input argumnet to set the format and add the following environment variables in the repository settings:
```
ARTIFACTS_KEY=(AWS access key id)
ARTIFACTS_SECRET=(AWS secret access key)
ARTIFACTS_BUCKET=(S3 bucket name)
```
For more details see [Artifact documentation](https://docs.travis-ci.com/user/uploading-artifacts/)

```YAML
- name: 'save-artifact'
      git:
        depth: false

      install:
        - mkdir ./bin
        - curl -sSfL https://get.scribesecurity.com/install.sh| sh -s -- -b $PWD/bin
        - export PATH=$PATH:$PWD/bin/
      
      script:

      - |
        valint slsa busybox:latest \
            --context-type travis \
            --output-directory ./scribe/valint \
            --output-file ./my_slsa.json \
            -f
      
      addons:
      
        artifacts:
          paths:
          - ./scribe/valint
          - ./my_slsa.json
```

</details>

<details>
  <summary> Generate an SBOM of a local file directory </summary>

```YAML
- |
  mkdir testdir
  echo "test" > testdir/test.txt

- |
  valint bom dir:testdir \
      --context-type travis \
      --output-directory ./scribe/valint \
      -f
``` 
</details>

<details>
  <summary> Generate SLSA provenance of a local file directory </summary>


```YAML
- |
  mkdir testdir
  echo "test" > testdir/test.txt

- |
  valint slsa dir:testdir \
      --context-type travis \
      --output-directory ./scribe/valint \
      -f
``` 
</details>


<details>
  <summary> Generate an SBOM of a git repo </summary>

For a remote git repo:

```YAML
- |
  valint bom git:https://github.com/mongo-express/mongo-express.git \
      --context-type travis \
      --output-directory ./scribe/valint \
      -f
``` 
For a local git repo:

**Note** If you use implicit checkout, [git-strategy](https://docs.travis.com/ee/ci/runners/configure_runners.html#git-strategy) affects the commits collected into the SBOM.

```YAML
- |
  valint bom git:. \
      --context-type travis \
      --output-directory ./scribe/valint \
      -f
``` 
</details>

<details>
  <summary> Generate SLSA provenance of a git reop </summary>

  For a remote git repo:

```YAML
- |
  valint slsa git:https://github.com/mongo-express/mongo-express.git \
      --context-type travis \
      --output-directory ./scribe/valint \
      -f
``` 

For a local git repo:

**Note** If you use implicit checkout, [git-strategy](https://docs.travis.com/ee/ci/runners/configure_runners.html#git-strategy) affects the commits collected.


```YAML
- |
  valint slsa git:. \
      --context-type travis \
      --output-directory ./scribe/valint \
      -f
``` 
</details>

<details>
  <summary> Generate and verify an SBOM `statement` for an image </summary>

```YAML
# Generate CycloneDX SBOM statement
- |
  valint bom busybox:latest \
    -o statement \
    --context-type travis \
    --output-directory ./scribe/valint \
    -f


# Verify CycloneDX SBOM statement
- |
  valint verify busybox:latest \
    -i statement \
    --context-type travis \
    --output-directory ./scribe/valint
```
</details>

<details>
  <summary> Generate and verify SLSA provenance `statement` for an image </summary>

```YAML
# Generate SLSA provenance
- |
  valint slsa busybox:latest \
    -o statement \
    --context-type travis \
    --output-directory ./scribe/valint \
    -f

# Verify SLSA Provenance statement
- |
  valint verify busybox:latest \
    -i statement-slsa \
    --context-type travis \
    --output-directory ./scribe/valint
```
</details>

<details>
  <summary> Generate and verify an SBOM `statement` for a file directory </summary>

```YAML
- |
  mkdir testdir
  echo "test" > testdir/test.txt

# Generate CycloneDX SBOM statement
- |
  valint bom dir:testdir \
    -o statement \
    --context-type travis \
    --output-directory ./scribe/valint \
    -f

# Verify CycloneDX SBOM statement
- |
  valint verify dir:testdir \
    -i statement \
    --context-type travis \
    --output-directory ./scribe/valint
```

</details>

<details>
  <summary> Generate and verify SLSA provenance `statement` for a file directory </summary>

```YAML
- |
  mkdir testdir
  echo "test" > testdir/test.txt

# Generate SLSA provenance statement
- |
  valint slsa dir:testdir \
    -o statement-slsa \
    --context-type travis \
    --output-directory ./scribe/valint \
    -f

# Verify CycloneDX SBOM statement
- |
  valint verify dir:testdir \
    -i statement-slsa \
    --context-type travis \
    --output-directory ./scribe/valint
```

</details>

<details>
  <summary> Generate and verify an SBOM `statement` for a git repo </summary>

For remote git repo target `https://github.com/mongo-express/mongo-express.git`:

```yaml
- |
  valint bom git:https://github.com/mongo-express/mongo-express.git \
    -o statement \
    --context-type travis \
    --output-directory ./scribe/valint \
    -f


- |
  valint verify git:https://github.com/mongo-express/mongo-express.git \
    -i statement \
    --context-type travis \
    --output-directory ./scribe/valint
```

For a local repo:

```yaml
- |
  valint bom git:. \
    -o statement \
    --context-type travis \
    --output-directory ./scribe/valint \
    -f


- |
  valint verify git:. \
    -i statement \
    --context-type travis \
    --output-directory ./scribe/valint
```

</details>

<details>
  <summary> Generate and verify SLSA provenance `statement` for a git repo </summary>

For remote git repo target `https://github.com/mongo-express/mongo-express.git`:

```yaml
- |
  valint slsa git:https://github.com/mongo-express/mongo-express.git \
    -o statement \
    --context-type travis \
    --output-directory ./scribe/valint \
    -f


- |
  valint verify git:https://github.com/mongo-express/mongo-express.git \
    -i statement-slsa \
    --context-type travis \
    --output-directory ./scribe/valint
```

For a local repo:

```yaml
- |
  valint slsa git:. \
    -o statement \
    --context-type travis \
    --output-directory ./scribe/valint \
    -f


- |
  valint verify git:. \
    -i statement-slsa \
    --context-type travis \
    --output-directory ./scribe/valint
```

</details>
