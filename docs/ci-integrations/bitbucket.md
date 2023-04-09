---
title: Bitbucket
sidebar_position: 7
---

# Bitbucket Pipelines Pipe: Scribe evidence generator

Scribe support evidence collecting and integrity verification for Bitbucket pipelines.

## YAML Definition

Add the following snippet to the script section of your `bitbucket-pipelines.yml` file:

```yaml
- pipe: scribe-security/valint-pipe:0.1.6
  variables:
    COMMAND_NAME: "<string>"
    TARGET: "<string>"
    # VERBOSE "<boolean>" # Optional
    # CONFIG: "<string>" # Optional
    # FORMAT: "<string>" # Optional
    # INPUT_FORMAT: '<string>' # Optional
    # OUTPUT_DIRECTORY: '<boolean>' # Optional
    # OUTPUT_FILE: '<string>' # Optional
    # LABEL: '<string>' # Optional
    # ENV: '<string>' # Optional
    # FILTER_REGEX: '<string>' # Optional
    # FILTER_SCOPE: '<string>' # Optional
    # PACKAGE_TYPE: '<string>' # Optional
    # PACKAGE_GROUP: '<string>' # Optional
    # FORCE: '<boolean>' # Optional
    # GIT_BRANCH: '<string>' # Optional
    # GIT_COMMIT: '<string>' # Optional
    # GIT_TAG: '<string>' # Optional
    # ATTEST_CONFIG: '<string>' # Optional
    # ATTEST_DEFAULT: '<string>' # Optional
    # SCRIBE_ENABLE: '<string>' # Optional
    # SCRIBE_CLIENT_ID: '<string>' # Optional
    # SCRIBE_CLIENT_SECRET: '<string>' # Optional
    # ATTESTATION: '<string>' # Optional
    # COMPONENTS: '<string>' # Optional
    # OCI: '<boolean>' # Optional
    # OCI_REPO: '<string>' # Optional
```

##  Variables

| Variable              | Usage                                                       | Default | COMMAND |
| --------------------- | ----------------------------------------------------------- | ------- | ------- |
| COMMAND_NAME (*) | Name of the command to execute (bom, verify) | | |
| TARGET (*) |  Target object name format=`[docker:{image:tag}, dir:{dir_path}, git:{git_path}, docker-archive:{archive_path}, oci-archive:archive_path, registry:image:tag`] | | any |
| VERBOSE | Log verbosity level [-v,--verbose=1] = info, [-vv,--verbose=2] = debug | | any |
| CONFIG | Config of the application | | any |
| FORMAT | Evidence format, options=[cyclonedx-json cyclonedx-xml attest-cyclonedx-json statement-cyclonedx-json predicate-cyclonedx-json attest-slsa statement-slsa predicate-slsa] | | bom |
| INPUT_FORMAT | Evidence format, options=[attest-cyclonedx-json attest-slsa statement-slsa statement-cyclonedx-json] | | verify |
| OUTPUT_DIRECTORY | Output directory path |  scribe/valint | any |
| OUTPUT_FILE | Output file name | | any |
| LABEL |  Custom labels | | bom | 
| ENV | Custom env | | bom |
| FILTER_REGEX | Filter out files by regex | | bom |
| FILTER_SCOPE | Filter packages by scope | | bom |
| PACKAGE_TYPE | Select package type | | bom |
| PACKAGE_GROUP | Select package group | | bom |
| ATTACH_REGEX | Attach files content by regex| | bom |
| FORCE | Force overwrite cache | | bom |
| GIT_BRANCH | Git branch in the repository | | any |
| GIT_TAG | Git tag in the repository | | any |
| GIT_COMMIT | Git commit hash in the repository | | any |
| ATTEST_CONFIG | Attestation config path | | any |
| ATTEST_DEFAULT | Attestation default config, options=[sigstore sigstore-github x509 kms] | | any |
| SCRIBE_ENABLE |  Enable scribe client | | any |
| SCRIBE_CLIENT_ID | Scribe client id | | any |
| SCRIBE_CLIENT_SECRET |  Scribe access token | | any |
| ATTESTATION | Attestation for target  | | verify |
| COMPONENTS | Select sbom components groups, options=[metadata layers packages files dep]  | | bom |
| OCI | Enable OCI store  | | any |
| OCI_REPO | Select OCI custom attestation repo  | | any |
(*) = required variable.

## Usage
```yaml
 - pipe: scribe-security/valint-pipe:0.1.6
   variables:
    COMMAND_NAME: bom
    TARGET: busybox:latest
    VERBOSE: 2
    FORCE: "true"
```

## Target types - `[target]`
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

## Scribe Evidence store
Scribe evidence store allows you store evidence using scribe Service.

Related Flags:
> Note the flag set:
>* `SCRIBE_CLIENT_ID`
>* `SCRIBE_CLIENT_ID`
>* `SCRIBE_ENABLE`

### Before you begin
Integrating Scribe Hub with your environment requires the following credentials that are found in the **Integrations** page. (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **integrations**)

* **Client ID**
* **Client Secret**

<img src='../../img/ci/integrations-secrets.jpg' alt='Scribe Integration Secrets' width='70%' min-width='400px'/>

* Set your Scribe credentials as environment variables according to [Bitbucket instructions](https://support.atlassian.com/bitbucket-cloud/docs/variables-and-secrets/ "Bitbucket instructions").

* Use the Scribe custom pipe as shown in the example bellow

### Usage

```yaml
pipelines:
  default:
    - step:
        name: scribe-bitbucket-pipeline
        script:      
          - pipe: scribe-security/valint-pipe:0.1.6
            variables:
              COMMAND_NAME: bom
              TARGET:  [target]
              FORMAT: [attest, statement, attest-slsa, statement-slsa]
              SCRIBE_ENABLE: true
              SCRIBE_CLIENT_ID: $SCRIBE_CLIENT_ID
              SCRIBE_CLIENT_SECRET: $SCRIBE_CLIENT_SECRET

          - pipe: scribe-security/valint-pipe:0.1.6
            variables:
              COMMAND_NAME: verify
              TARGET:  [target]
              INPUT_FORMAT: [attest, statement, attest-slsa, statement-slsa]
              SCRIBE_ENABLE: true
              SCRIBE_CLIENT_ID: $SCRIBE_CLIENT_ID
              SCRIBE_CLIENT_SECRET: $SCRIBE_CLIENT_SECRET
```

## OCI Evidence store
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
          - pipe: scribe-security/valint-pipe:0.1.6
            variables:
              COMMAND_NAME: bom
              TARGET:  [target]
              FORMAT: [attest, statement, attest-slsa, statement-slsa]
              OCI: true
              OCI_REPO: [oci_repo]

          - pipe: scribe-security/valint-pipe:0.1.6
            variables:
              COMMAND_NAME: verify
              TARGET:  [target]
              INPUT_FORMAT: [attest, statement, attest-slsa, statement-slsa]
              OCI: true
              OCI_REPO: [oci_repo]
```

## Basic examples

### Public registry image (SBOM)

Create SBOM from remote `busybox:latest` image.

```YAML
  - pipe: scribe-security/valint-pipe:0.1.6
      variables:
        COMMAND: bom
        TARGET: busybox:latest
        VERBOSE: 2
        FORCE: "true"
``` 

###  Docker built image (SBOM)

Create SBOM for image built by local docker `image_name:latest` image.

```YAML
- pipe: scribe-security/valint-pipe:0.1.6
  variables:
    COMMAND: bom
    TARGET: image_name:latest
    VERBOSE: 2
    FORCE: "true"
``` 

###  Private registry image (SBOM)

Create SBOM for image hosted on private registry.

> Use `docker login` to add access.

```YAML
- pipe: scribe-security/valint-pipe:0.1.6
  variables:
    COMMAND: bom
    TARGET: scribesecuriy.jfrog.io/scribe-docker-local/stub_remote:latest
    FORCE: true
    VERBOSE: 2
```

###  Custom metadata (SBOM)

Custom metadata added to SBOM.
```YAML
- step:
    name: valint-image-step
    script:
      - export test_env=test_env_value
      - pipe: docker://scribesecuriy.jfrog.io/scribe-docker-public-local/valint-pipe:dev-latest
        variables:
          COMMAND_NAME: bom
          TARGET: busybox:latest
          VERBOSE: 2
          FORCE: "true"
          ENV: test_env
          LABEL: test_label
```

### Save as artifact (SBOM, SLSA)

Using input variable `OUTPUT_DIRECTORY` or `OUTPUT_FILE` to export evidence as an artifact.

> Use input variable `FORMAT` to select between supported formats.


```YAML
- step:
    name: save-artifact-step
    script:
      - pipe: docker://scribesecuriy.jfrog.io/scribe-docker-public-local/valint-pipe:dev-latest
        variables:
          COMMAND_NAME: bom
          OUTPUT_FILE: my_sbom.json
          TARGET: busybox:latest
          VERBOSE: 2
          FORCE: "true"
    artifacts:
      - scribe/**
      - my_sbom.json
```

### Directory target (SBOM)

Create SBOM from a local directory. 

```YAML
step:
  name: dir-sbom-step
  script:
  - mkdir testdir
  - echo "test" > testdir/test.txt
  - pipe: scribe-security/valint-pipe:0.1.6
    variables:
      COMMAND: bom
      TARGET: dir:./testdir
      SCRIBE_CLIENT_ID: $SCRIBE_CLIENT_ID
      SCRIBE_CLIENT_SECRET: $SCRIBE_CLIENT_SECRET
      VERBOSE: 2
``` 

### Git target (SBOM)

Create SBOM for `mongo-express` remote git repository.

```YAML
- step:
    name: valint-git-step
    script:
      - pipe: docker://scribesecuriy.jfrog.io/scribe-docker-public-local/valint-pipe:dev-latest
        variables:
          COMMAND_NAME: bom
          TARGET: git:https://github.com/mongo-express/mongo-express.git
          VERBOSE: 2
          FORCE: "true"
``` 

Create SBOM for local git repository.

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
              FORCE: "true"
``` 

## Resources
If you're new to Bitbucket pipelines this link should help you get started:

[Bitbucket Pipelines](https://support.atlassian.com/bitbucket-cloud/docs/get-started-with-bitbucket-pipelines/ "Get started with Bitbucket Pipelines") - Get started with Bitbucket Pipelines.

## Support

If you'd like help with this pipe, or you have an issue or a feature request, [let us know](https://github.com/scribe-security/valint-pipe/issues).

If you are reporting an issue, please include:

- the version of the pipe
- relevant logs and error messages
- steps to reproduce

By email or slack, 
[Contact-us](https://scribesecurity.com/contact-us/).

## License

Copyright (c) 2019 Atlassian and others.
Apache 2.0 licensed, see [LICENSE](LICENSE.txt) file.