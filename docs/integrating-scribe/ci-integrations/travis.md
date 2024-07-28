<p><a target="_blank" href="https://app.eraser.io/workspace/FN001VpNRtZ1MC4IK6dm" id="edit-in-eraser-github-link"><img alt="Edit in Eraser" src="https://firebasestorage.googleapis.com/v0/b/second-petal-295822.appspot.com/o/images%2Fgithub%2FOpen%20in%20Eraser.svg?alt=media&amp;token=968381c8-a7e7-472a-8ed6-4a6626da5501"></a></p>

---

## sidebar_label: "Travis CI"
title: Travis CI
sidebar_position: 6
Use the following instructions to integrate your Travis CI pipelines with Scribe.

### 1. Obtain a Scribe Hub API Token
1. Sign in to [﻿Scribe Hub](https://app.scribesecurity.com/) . If you don't have an account you can sign up for free [﻿here](https://scribesecurity.com/scribe-platform-lp/) .
2. Create a API token in [﻿Scribe Hub > Settings > Tokens](https://app.scribesecurity.com/settings/tokens) . Copy it to a safe temporary notepad until you complete the integration.
:::note Important
The token is a secret and will not be accessible from the UI after you finalize the token generation.
:::
### 2. Add the API token to the Travis CI secrets
Add the Scribe Hub API token as SCRIBE_TOKEN to your environment by following the [﻿Travis CI setting up environment variables instructions](https://docs.travis-ci.com/user/environment-variables/) 

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
        -E -P $SCRIBE_TOKEN 
        
  - |
    valint verify [target] \
        --format [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] \
        --context-type travis \
        --output-directory ./scribe/valint \
        -E -P $SCRIBE_TOKEN
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
 Generate an SBOM for an image in a public registry 

```YAML
- |
valint bom busybox:latest \
    --context-type travis \
    --output-directory ./scribe/valint \
    -f
```
 Generate SLSA provenance for an image in a public registry 

```YAML
- |
valint slsa busybox:latest \
    --context-type travis \
    --output-directory ./scribe/valint \
    -f
```
 Generate an SBOM for for an image built with local docker 

 ```YAML - | valint bom image_name:latest \ --context-type travis \ --output-directory ./scribe/valint \ -f ``` 

 Generate SLSA provenance for for an image built with local docker 

```YAML
- |
valint slsa image_name:latest \
    --context-type travis \
    --output-directory ./scribe/valint \
    -f
```
 Generate an SBOM for an image in a private registry 

 > Add a `docker login` task before the adding the following step: 

```YAML
- |
valint bom scribesecurity.jfrog.io/scribe-docker-local/example:latest \
    --context-type travis \
    --output-directory ./scribe/valint \
    -f
```
 Generate SLSA provenance for an image in a private registry 

>  Add a `docker login` task before the adding the following step: 

```YAML
- |
valint slsa scribesecurity.jfrog.io/scribe-docker-local/example:latest \
    --context-type travis \
    --output-directory ./scribe/valint \
    -f
```
 Add custom metadata to SBOM 

 ```YAML - name: 'bom-targets' env: test_env=test_env_value script: - | valint bom busybox:latest \ --context-type travis \ --output-directory ./scribe/valint \ --env test_env --label test_label \ -f ``` 

 Add custom metadata to SLSA provenance 

 ```YAML - name: 'slsa-targets' env: test_env=test_env_value script: - | valint slsa busybox:latest \ --context-type travis \ --output-directory ./scribe/valint \ --env test_env --label test_label \ -f ``` 

 Export SBOM as an artifact 

 Using command `output-directory` or `output-file` to export evidence as an artifact. 

>  Use `format` input argumnet to set the format and add the following environment variables in the repository settings: 

```
ARTIFACTS_KEY=(AWS access key id)
ARTIFACTS_SECRET=(AWS secret access key)
ARTIFACTS_BUCKET=(S3 bucket name)
```
For more details see [﻿Artifact documentation](https://docs.travis-ci.com/user/uploading-artifacts/).

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
 Export SLSA provenance as an artifact 

Use `format` input argumnet to set the format and add the following environment variables in the repository settings:

```
ARTIFACTS_KEY=(AWS access key id)
ARTIFACTS_SECRET=(AWS secret access key)
ARTIFACTS_BUCKET=(S3 bucket name)
```
For more details see [﻿Artifact documentation](https://docs.travis-ci.com/user/uploading-artifacts/) 

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
 Generate an SBOM of a local file directory 

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
 Generate SLSA provenance of a local file directory 

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
 Generate an SBOM of a git repo 

For a remote git repo:

```YAML
- |
valint bom git:https://github.com/mongo-express/mongo-express.git \
    --context-type travis \
    --output-directory ./scribe/valint \
    -f
```
For a local git repo:

**Note** If you use implicit checkout, [﻿git-strategy](https://docs.travis.com/ee/ci/runners/configure_runners.html#git-strategy) affects the commits collected into the SBOM.

```YAML
- |
valint bom git:. \
    --context-type travis \
    --output-directory ./scribe/valint \
    -f
```
 Generate SLSA provenance of a git reop 

 For a remote git repo:

```YAML
- |
valint slsa git:https://github.com/mongo-express/mongo-express.git \
    --context-type travis \
    --output-directory ./scribe/valint \
    -f
```
For a local git repo:

**Note** If you use implicit checkout, [﻿git-strategy](https://docs.travis.com/ee/ci/runners/configure_runners.html#git-strategy) affects the commits collected.

```YAML
- |
valint slsa git:. \
    --context-type travis \
    --output-directory ./scribe/valint \
    -f
```
 Generate and verify an SBOM `statement` for an image 

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
 Generate and verify SLSA provenance `statement` for an image 

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
 Generate and verify an SBOM `statement` for a file directory 

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
 Generate and verify SLSA provenance `statement` for a file directory 

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
 Generate and verify an SBOM `statement` for a git repo 

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
 Generate and verify SLSA provenance `statement` for a git repo 

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




<!--- Eraser file: https://app.eraser.io/workspace/FN001VpNRtZ1MC4IK6dm --->