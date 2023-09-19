---
title: tekton CI/CD
sidebar_position: 3
---

# Tekton CI/CD
Scribe support evidence collecting and integrity verification for Tekton CI/CD.

Integrations provides several options enabling generation of SBOMs from various sources.
The usage examples on this page demonstrate several use cases of SBOM collection (SBOM from a publicly available Docker image, SBOM from a Git repository, SBOM from a local directory) as well as several use cases of uploading the evidence either to the Tekton CI/CD workflows or to the Scribe Service.

### Usage

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: scribe-secret
  annotations:
    tekton.dev/git-0: https://github.com
    tekton.dev/git-1: https://gitlab.com
    tekton.dev/docker-0: https://gcr.io
type: Opaque
stringData:
  client_id: "<your_client_id>"
  client_secret: "<your_client_secret>"
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: test-pvc-cache
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 500m
---
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: valint-test-pipeline
spec:
  workspaces:
  - name: shared-workspace
  tasks:
  - name: valint-bom
    taskRef:
      name: valint
    params:
    - name: args
      value: bom alpine:latest -vv
    - name: cache-dir
      value: valint-cache
    - name: scribe-secret
      value: scribe-secret
---
apiVersion: tekton.dev/v1beta1
kind: PipelineRun
metadata:
  name: valint-test-pipeline-run
spec:
  pipelineRef:
    name: scribe-security-test-pipeline
  workspaces:
  - name: shared-workspace
    persistentvolumeclaim:
      claimName: test-pvc-cache
  podTemplate:
    volumes:
    - name: valint-cache
      persistentVolumeClaim:
        claimName: test-pvc-cache
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
>* `-U`, `--scribe.client-id`
>* `-P`, `--scribe.client-secret`
>* `-E`, `--scribe.enable`

### Before you begin
Integrating Scribe Hub with your environment requires the following credentials that are found in the **Integrations** page. (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **integrations**)

* **Client ID**
* **Client Secret**

<img src='../../img/ci/integrations-secrets.jpg' alt='Scribe Integration Secrets' width='70%' min-width='400px'/>

* Store credentials in [kubernetes secret](https://kubernetes.io/docs/concepts/configuration/secret/) 

* Install `valint` task from tekton catalog using the following command
```bash
kubectl apply -f https://raw.githubusercontent.com/tektoncd/catalog/main/task/valint/0.1/valint.yaml
```

### Usage
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: scribe-secret
  annotations:
    tekton.dev/git-0: https://github.com
    tekton.dev/git-1: https://gitlab.com
    tekton.dev/docker-0: https://gcr.io
type: Opaque
stringData:
  client_id: ""
  client_secret: ""
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: test-pvc-cache
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 500m
---
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: valint-test-pipeline
spec:
  workspaces:
  - name: shared-workspace
  tasks:
  - name: valint-bom
    taskRef:
      name: valint
    params:
    - name: args
      value: bom alpine:latest -vv
    - name: cache-dir
      value: valint-cache
    - name: scribe-secret
      value: scribe-secret
  - name: scribe-security-verify
    taskRef:
      name: scribe-security
    runAfter:
    - valint-bom
    params:
    - name: args
      value: verify alpine:latest -vv
    - name: cache-90dir
      value: valint-cache
    - name: scribe-secret
      value: scribe-secret
---
apiVersion: tekton.dev/v1beta1
kind: PipelineRun
metadata:
  name: valint-test-pipeline-run
spec:
  pipelineRef:
    name: scribe-security-test-pipeline
  workspaces:
  - name: shared-workspace
    persistentvolumeclaim:
      claimName: test-pvc-cache
  podTemplate:
    volumes:
    - name: valint-cache
      persistentVolumeClaim:
        claimName: test-pvc-cache
```

## OCI Evidence store
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
For example, using `docker login` command or [DOCKER_AUTH_CONFIG field](https://docs.gitlab.com/ee/ci/docker/using_docker_images.html#define-an-image-from-a-private-container-registry).

Then you can add a secret json file that is created after logging in to the deployment. You should use the following command to convert it to base64 before adding it to the secrets

```
cat ~/.docker/config.json | base64 -w0
```

### Usage
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: docker-credentials
data:
  config.json: ""
---
apiVersion: v1
kind: Secret
metadata:
  name: scribe-secret
  annotations:
    tekton.dev/git-0: https://github.com
    tekton.dev/git-1: https://gitlab.com
    tekton.dev/docker-0: https://gcr.io
type: Opaque
stringData:
  client_id: ""
  client_secret: ""
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: test-pvc-cache
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 500m
---
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: valint-test-pipeline
spec:
  workspaces:
  - name: shared-workspace
  tasks:
  - name: valint-bom
    taskRef:
      name: valint
    params:
    - name: args
      value: bom alpine:latest -vv
    - name: cache-dir
      value: valint-cache
    - name: scribe-secret
      value: scribe-secret
    workspaces:
    - name: dockerconfig
      workspace: docker-credentials
  - name: scribe-security-verify
    taskRef:
      name: scribe-security
    runAfter:
    - valint-bom
    params:
    - name: args
      value: verify alpine:latest -vv
    - name: cache-90dir
      value: valint-cache
    - name: scribe-secret
      value: scribe-secret
    workspaces:
    - name: dockerconfig
      workspace: docker-credentials
---
apiVersion: tekton.dev/v1beta1
kind: PipelineRun
metadata:
  name: valint-test-pipeline-run
spec:
  pipelineRef:
    name: scribe-security-test-pipeline
  workspaces:
  - name: shared-workspace
    persistentvolumeclaim:
      claimName: test-pvc-cache
  podTemplate:
    volumes:
    - name: valint-cache
      persistentVolumeClaim:
        claimName: test-pvc-cache
```

> Use `gitlab` as context-type.

## Basic examples
<details>
  <summary>  Public registry image (SBOM) </summary>

Create SBOM for remote `busybox:latest` image.

```YAML
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: valint-test-pipeline
spec:
  workspaces:
  - name: shared-workspace
  tasks:
  - name: valint-bom
    taskRef:
      name: valint
    params:
    - name: args
      value: bom alpine:latest -vv
    - name: cache-dir
      value: valint-cache
    - name: scribe-secret
      value: scribe-secret
    workspaces:
    - name: dockerconfig
      workspace: docker-credentials
``` 

</details>

<details>
  <summary>  Docker built image (SBOM) </summary>

Create SBOM for image built by local docker `image_name:latest` image.

```YAML
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: valint-test-pipeline
spec:
  workspaces:
  - name: shared-workspace
  tasks:
  - name: valint-bom
    taskRef:
      name: valint
    params:
    - name: args
      value: bom alpine:latest -vv -f
    - name: cache-dir
      value: valint-cache
    - name: scribe-secret
      value: scribe-secret
    workspaces:
    - name: dockerconfig
      workspace: docker-credentials
``` 
</details>

<details>
  <summary>  Private registry image (SBOM) </summary>

Create SBOM for image hosted on private registry.

> Use `docker login` to add access.

```YAML
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: valint-test-pipeline
spec:
  workspaces:
  - name: shared-workspace
  tasks:
  - name: valint-bom
    taskRef:
      name: valint
    params:
    - name: args
      value: bom scribesecuriy.jfrog.io/scribe-docker-local/stub_remote:latest -f
    - name: cache-dir
      value: valint-cache
    - name: scribe-secret
      value: scribe-secret
    workspaces:
    - name: dockerconfig
      workspace: docker-credentials
```
</details>

<details>
  <summary> Custom metadata (SBOM) </summary>

Custom metadata added to SBOM.

```YAML
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: valint-test-pipeline
spec:
  workspaces:
  - name: shared-workspace
  tasks:
  - name: valint-bom
    taskRef:
      name: valint
    params:
    - name: args
      value: bom busybox:latest --env test_env --label test_label -f
    - name: cache-dir
      value: valint-cache
    - name: scribe-secret
      value: scribe-secret
    workspaces:
    - name: dockerconfig
      workspace: docker-credentials
```
</details>


<details>
  <summary> Archive image (SBOM) </summary>

Create SBOM for local `docker save` output.

> Use `oci-archive` target type when creating a OCI archive (`podman save`).

```YAML
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: valint-test-pipeline
spec:
  workspaces:
  - name: shared-workspace
  tasks:
  - name: valint-bom
    taskRef:
      name: valint
    params:
    - name: args
      value: bom docker-archive:busybox.tar -f
    - name: cache-dir
      value: valint-cache
    - name: scribe-secret
      value: scribe-secret
    workspaces:
    - name: dockerconfig
      workspace: docker-credentials
```
</details>

<details>
  <summary> Directory target (SBOM) </summary>

Create SBOM for a local directory.

```YAML
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: valint-test-pipeline
spec:
  workspaces:
  - name: shared-workspace
  tasks:
  - name: valint-bom
    taskRef:
      name: valint
    params:
    - name: args
      value: bom dir:testdir -f
    - name: cache-dir
      value: valint-cache
    - name: scribe-secret
      value: scribe-secret
    workspaces:
    - name: dockerconfig
      workspace: docker-credentials
```
</details>


<details>
  <summary> Git target (SBOM) </summary>

Create SBOM for `mongo-express` remote git repository.

```YAML
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: valint-test-pipeline
spec:
  workspaces:
  - name: shared-workspace
  tasks:
  - name: valint-bom
    taskRef:
      name: valint
    params:
    - name: args
      value: bom git:https://github.com/mongo-express/mongo-express.git -f
    - name: cache-dir
      value: valint-cache
    - name: scribe-secret
      value: scribe-secret
    workspaces:
    - name: dockerconfig
      workspace: docker-credentials
```

Create SBOM for local git repository. <br />

> When using implicit checkout note the Gitlab-CI [git-strategy](https://docs.gitlab.com/ee/ci/runners/configure_runners.html#git-strategy) will effect the commits collected by the SBOM.

```YAML
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: valint-test-pipeline
spec:
  workspaces:
  - name: shared-workspace
  tasks:
  - name: valint-bom
    taskRef:
      name: valint
    params:
    - name: args
      value: bom . -f
    - name: cache-dir
      value: valint-cache
    - name: scribe-secret
      value: scribe-secret
    workspaces:
    - name: dockerconfig
      workspace: docker-credentials
``` 
</details>

## Resources

[Gitlab CI Jobs Page](https://docs.gitlab.com/ee/ci/) - Github CI docs.
