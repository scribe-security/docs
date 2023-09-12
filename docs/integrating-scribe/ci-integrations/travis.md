---
sidebar_label: "Travis CI"
title: Travis CI
sidebar_position: 6
---

If you are using Travis CI as your Continuous Integration tool (CI), use these instructions to integrate Scribe into your pipeline to protect your projects. 

### Installation
Install the Scribe `valint` CLI tool:
```yaml
install:
  - mkdir ./bin
  - curl -sSfL https://get.scribesecurity.com/install.sh| sh -s -- -b $PWD/bin
  - export PATH=$PATH:$PWD/bin/
```

### Usage
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

### Target types - `[target]`
---
Target types are types of artifacts produced and consumed by your supply chain.
Using supported targets, you can collect evidence and verify compliance on a range of artifacts.

> Fields specified as [target] support the following format.

### Format

`[scheme]:[name]:[tag]` 

| Sources | target-type | scheme | Description | example
| --- | --- | --- | --- | --- |
| Docker Daemon | image | docker | use the Docker daemon | docker:busybox:latest |
| OCI registry | image | registry | use the docker registry directly | registry:busybox:latest |
| Docker archive | image | docker-archive | use a tarball from disk for archives created from "docker save" | image | docker-archive:path/to/yourimage.tar |
| OCI archive | image | oci-archive | tarball from disk for OCI archives | oci-archive:path/to/yourimage.tar |
| Remote git | git| git | remote repository git | git:https://github.com/yourrepository.git |
| Local git | git | git | local repository git | git:path/to/yourrepository | 
| Directory | dir | dir | directory path on disk | dir:path/to/yourproject | 
| File | file | file | file path on disk | file:path/to/yourproject/file | 

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
>* `-U`, `--scribe.client-id`
>* `-P`, `--scribe.client-secret`
>* `-E`, `--scribe.enable`

### Before you begin
Integrating Scribe Hub with your environment requires the following credentials that are found in the **Integrations** page. (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **integrations**)

* **Client ID**
* **Client Secret**

<img src='../../../../img/ci/integrations-secrets.jpg' alt='Scribe Integration Secrets' width='70%' min-width='400px'/>

* Add the credentials (client id, client secret, and product key) to your Travis environment according to the **[Travis CI setting up environment variables instructions](https://docs.travis-ci.com/user/environment-variables/ "Travis CI - setting up environment variables")** to avoid revealing secrets.

* Open your Travis project and make sure you have a YAML file named `.travis-ci.yml`.
The code in the following examples of a workflow running on the mongo-express image 

* Install `valint` tool using the following command
```bash
curl -sSfL https://get.scribesecurity.com/install.sh| sh -s -- -b $PWD/bin
```


### Usage
```yaml
install:
  - mkdir ./bin
  - curl -sSfL https://get.scribesecurity.com/install.sh| sh -s -- -b $PWD/bin
  - export PATH=$PATH:$PWD/bin/


name: "scribe-travis-job"

script:
  - |
    valint bom [target] \
        --format [attest, statement, attest-slsa (depricated), statement-slsa (depricated), attest-generic, statement-generic] \
        --context-type travis \
        --output-directory ./scribe/valint \
        -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET 

        
  - |
    valint verify [target] \
        --format [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] \
        --context-type travis \
        --output-directory ./scribe/valint \
        -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET 
```

### Alternative evidence stores
> You can learn more about alternative stores **[here](../other-evidence-stores)**.

<details>
  <summary> <b> OCI Evidence store </b></summary>
Valint supports both storage and verification flows for `attestations`  and `statement` objects utilizing OCI registry as an evidence store.

Using OCI registry as an evidence store allows you to upload, download and verify evidence across your supply chain in a seamless manner.

Related flags:
* `--oci` Enable OCI store.
* `--oci-repo` - Evidence store location.


### Before you begin
Evidence can be stored in any accusable registry.
* Write access is required for upload (generate).
* Read access is required for download (verify).

You must first login with the required access privileges to your registry before calling Valint.
For example, using `docker login` command.

### Usage
```yaml
services:
  - docker

install:
  - mkdir ./bin
  - curl -sSfL https://get.scribesecurity.com/install.sh| sh -s -- -b $PWD/bin
  - export PATH=$PATH:$PWD/bin/

name: "scribe-travis-oci-job"

script:
  - |
    echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin [my_registry]
    
  # Generating evidence, storing on [my_repo] OCI repo.
  - |
    valint bom [target] \
        --format [attest, statement, attest-slsa (depricated), statement-slsa (depricated), attest-generic, statement-generic] \
        --context-type travis \
        --output-directory ./scribe/valint \
        --oci --oci-repo=[my_repo]

  # Verifying evidence, pulling attestation from [my_repo] OCI repo.
  - |
    valint verify [target] \
        --format [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] \
        --context-type travis \
        --output-directory ./scribe/valint \
        --oci --oci-repo=[my_repo]
```
</details>

### Basic examples
<details>
  <summary>  Public registry image (SBOM) </summary>

Create SBOM for remote `busybox:latest` image.

```YAML
- |
  valint bom busybox:latest \
      --context-type travis \
      --output-directory ./scribe/valint \
      -f
``` 

</details>

<details>
  <summary>  Public registry image (SLSA) </summary>

Create SLSA for remote `busybox:latest` image.

```YAML
- |
  valint slsa busybox:latest \
      --context-type travis \
      --output-directory ./scribe/valint \
      -f
``` 

</details>

<details>
  <summary>  Docker built image (SBOM) </summary>

Create SBOM for image built by local docker `image_name:latest` image.

```YAML
- |
  valint bom image_name:latest \
      --context-type travis \
      --output-directory ./scribe/valint \
      -f
``` 
</details>
<details>
  <summary>  Docker built image (SLSA) </summary>

Create SBOM for image built by local docker `image_name:latest` image.

```YAML
- |
  valint slsa image_name:latest \
      --context-type travis \
      --output-directory ./scribe/valint \
      -f
``` 
</details>

<details>
  <summary>  Private registry image (SBOM) </summary>

Create SBOM for image hosted on private registry.

> Use `docker login` to add access.

```YAML
- |
  valint bom scribesecurity.jfrog.io/scribe-docker-local/example:latest \
      --context-type travis \
      --output-directory ./scribe/valint \
      -f
```
</details>

<details>
  <summary>  Private registry image (SLSA) </summary>

Create SLSA for image hosted on private registry.

> Use `docker login` to add access.

```YAML
- |
  valint slsa scribesecurity.jfrog.io/scribe-docker-local/example:latest \
      --context-type travis \
      --output-directory ./scribe/valint \
      -f
```
</details>

<details>
  <summary>  Custom metadata (SBOM) </summary>

Custom metadata added to SBOM.
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
  <summary>  Custom metadata (SLSA) </summary>

Custom metadata added to SLSA.
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
  <summary> Save as artifact (SBOM) </summary>

Using command `output-directory` or `output-file` to export evidence as an artifact.

> Use `--format`, `-o` to select between the format.

> and add the following environment variables in the repository settings:
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
  <summary> Save as artifact (SLSA) </summary>

Using command `output-directory` or `output-file` to export evidence as an artifact.

> Use `--format`, `-o` to select between the format.

> and add the following environment variables in the repository settings:
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
  <summary> Directory target (SBOM) </summary>

Create SBOM for a local directory.

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
  <summary> Directory target (SLSA) </summary>

Create SLSA for a local directory.

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
  <summary> Git target (SBOM) </summary>

Create SBOM for `mongo-express` remote git repository.

```YAML
- |
  valint bom git:https://github.com/mongo-express/mongo-express.git \
      --context-type travis \
      --output-directory ./scribe/valint \
      -f
``` 

Create SBOM for local git repository. <br />

> When using implicit checkout note the Travis-CI **[git-strategy](https://docs.travis.com/ee/ci/runners/configure_runners.html#git-strategy)** will effect the commits collected by the SBOM.

```YAML
- |
  valint bom git:. \
      --context-type travis \
      --output-directory ./scribe/valint \
      -f
``` 
</details>

<details>
  <summary> Git target (SLSA) </summary>

Create SBOM for `mongo-express` remote git repository.

```YAML
- |
  valint slsa git:https://github.com/mongo-express/mongo-express.git \
      --context-type travis \
      --output-directory ./scribe/valint \
      -f
``` 

Create SLSA for local git repository. <br />

> When using implicit checkout note the travis-CI [git-strategy](https://docs.travis.com/ee/ci/runners/configure_runners.html#git-strategy) will effect the commits collected by the SBOM.

```YAML
- |
  valint slsa git:. \
      --context-type travis \
      --output-directory ./scribe/valint \
      -f
``` 
</details>

<details>
  <summary> Verify Policy flow - verify image target (SBOM) </summary>

Generating and verifying CycloneDX SBOM `statement` for image target `busybox:latest`.

```YAML
# Create CycloneDX SBOM statement
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
  <summary> Verify Policy flow - verify image target (SLSA) </summary>

Generating and verifying SLSA Provenance `statement` for image target `busybox:latest`.

```YAML
# Create CycloneDX SLSA statement
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
  <summary> Verify Policy flow - directory target (SBOM) </summary>

Generating and verifying SLSA Provenance `statement` for directory target.

```YAML
- |
  mkdir testdir
  echo "test" > testdir/test.txt

# Create CycloneDX SBOM statement
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
  <summary> Verify Policy flow - directory target (SLSA) </summary>

Generating and verifying SLSA Provenance `statement` for directory target.

```YAML
- |
  mkdir testdir
  echo "test" > testdir/test.txt

# Create CycloneDX SBOM statement
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
  <summary> Verify Policy flow - Git repository target (SBOM) </summary>

Generating and verifying `statements` for remote git repo target `https://github.com/mongo-express/mongo-express.git`.

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

Or for a local repository
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
  <summary> Verify Policy flow - Git repository target (SLSA) </summary>

Generating and verifying `statements` for remote git repo target `https://github.com/mongo-express/mongo-express.git`.

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

Or for a local repository
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

## Resources
If you're new to Travis this link should help you get started:
* **[Travis CI](https://docs.travis-ci.com/user/tutorial/ "Travis tutorial")** - Travis CI Tutorial.