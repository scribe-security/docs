---
sidebar_position: 8
sidebar_label: "Tekton CI/CD"
title: Integrating Scribe in your Tekton Pipelines
---
Use the following instructions to integrate your Tekton pipelines with Scribe.

### 1. Obtain a Scribe Hub API Token

Create an API token in [Scribe Hub > Account > Tokens](https://app.scribesecurity.com/account/tokens). Copy it to a safe temporary notepad until you complete the integration.

:::note Important
The token is a secret and will not be accessible from the UI after you finalize the token generation. 
:::

### 2. Add the API token to Kubernetes secrets

Add the Scribe Hub API token as SCRIBE_TOKEN to your [kubernetes secret](https://kubernetes.io/docs/concepts/configuration/secret/)

The following example looks for a Kubernetes secret that holds your Scribe API token. This secret is called `scribe-secret` by default and is expected to have the key `scribe-token`.
You can use the following example configuration

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: orka-creds
type: Opaque
stringData:
  scribe_token: $(SCRIBE_TOKEN)
  scribe_enable: true
```

```sh
kubectl apply --namespace=<namespace> -f scribe-secret.yaml
```

Omit `--namespace` if installing in the `default` namespace.

### 3. Install Scribe CLI

**Valint** -Scribe CLI- is required to generate evidence in such as SBOMs and SLSA provenance. 
1. Install Azure DevOps [Valint-task](https://marketplace.visualstudio.com/items?itemName=ScribeSecurity.valint-cli) from the Azure marketplace.  
2. Follow **[install-an-extension](https://learn.microsoft.com/en-us/azure/devops/marketplace/install-extension?view=azure-devops&tabs=browser#install-an-extension)** to add the extension to your organization and use the task in your pipelines.

### 4. Instrument your build scripts

#### Usage
```yaml
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
      value: bom busybox:latest
```

#### Parameters

| Parameter | Description | Default |
| --- | --- | ---: |
| `scribe-secret` | The name of the secret that has the scribe security secrets. | scribe-secret |
| `args` | Arguments of the `valint` CLI | |
| `image-version-sha` | The ID of the valint image cli to be used. | |


#### Basic example

```yaml
# Create a CycloneDX SBOM and verify it.
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: basic-tests
spec:
  workspaces:
  - name: shared-workspace
  tasks:
  - name: valint-bom
    taskRef:
      name: valint
    workspaces:
    - name: output
      workspace: shared-workspace
    params:
    - name: args
      value: 
        - bom 
        - busybox:latest
        - -o=statement

  - name: valint-verify-bom
    taskRef:
      name: valint
    workspaces:
    - name: output
      workspace: shared-workspace
    runAfter:
    - valint-verify
    params:
    - name: args
      value: 
        - verify 
        - busybox:latest 
        - -i=statement
```

```yaml
# Create a SLSA Provanence and verify.
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: basic-tests
spec:
  workspaces:
  - name: shared-workspace
  tasks:
  - name: valint-slsa
    taskRef:
      name: valint
    workspaces:
    - name: output
      workspace: shared-workspace
    runAfter:
    - valint-verify-bom
    params:
    - name: args
      value: 
        - slsa 
        - alpine:latest
        - -o=statement

  - name: valint-verify-slsa
    taskRef:
      name: valint
    workspaces:
    - name: output
      workspace: shared-workspace
    runAfter:
    - valint-slsa
    params:
    - name: args
      value: 
        - verify 
        - alpine:latest 
        - -i=statement-slsa
```
## Additional examples
<details>
  <summary>  Public registry image (SBOM) </summary>

Create SBOM for remote `busybox:latest` image.

```YAML
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: basic-tests
spec:
  workspaces:
  - name: shared-workspace
  tasks:
  - name: valint-bom
    taskRef:
      name: valint
    workspaces:
    - name: output
      workspace: shared-workspace
    params:
    - name: args
      value: 
        - bom 
        - alpine:latest
``` 

</details>
<details>
  <summary>  Public registry image (SLSA) </summary>

Create SLSA for remote `busybox:latest` image.

```YAML
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: basic-tests
spec:
  workspaces:
  - name: shared-workspace
  tasks:
  - name: valint-slsa
    taskRef:
      name: valint
    workspaces:
    - name: output
      workspace: shared-workspace
    params:
    - name: args
      value: 
        - slsa
        - alpine:latest
``` 

</details>

<!-- <details>
  <summary>  Private registry image (SBOM) </summary>

Create SBOM for image hosted on private registry.

> Use `docker login` to add access.

```YAML
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: basic-tests
spec:
  workspaces:
  - name: shared-workspace
  tasks:
  - name: valint-bom
    taskRef:
      name: valint
    workspaces:
    - name: output
      workspace: shared-workspace
    params:
    - name: args
      value: 
        - bom 
        - scribesecuriy.jfrog.io/scribe-docker-local/stub_remote:latest
        - -o=statement
```
</details> -->
<!-- 
<details>
  <summary>  Private registry image (SLSA) </summary>

Create SLSA for image hosted on private registry.

> Use `docker login` to add access.

```YAML
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: basic-tests
spec:
  workspaces:
  - name: shared-workspace
  tasks:
  - name: valint-slsa
    taskRef:
      name: valint
    workspaces:
    - name: output
      workspace: shared-workspace
    params:
    - name: args
      value: 
        - slsa 
        - scribesecuriy.jfrog.io/scribe-docker-local/stub_remote:latest
```
</details> -->

<details>
  <summary> Custom metadata (SBOM) </summary>

Custom metadata added to SBOM.

```YAML
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: basic-tests
spec:
  workspaces:
  - name: shared-workspace
  tasks:
  - name: valint-bom
    taskRef:
      name: valint
    workspaces:
    - name: output
      workspace: shared-workspace
    params:
    - name: args
      value: 
        - bom 
        - busybox:latest
        - --env=test_env
        - --label=test_label
```
</details>


<details>
  <summary> Custom metadata (SLSA) </summary>

Custom metadata added to SLSA.

```YAML
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: basic-tests
spec:
  workspaces:
  - name: shared-workspace
  tasks:
  - name: valint-slsa
    taskRef:
      name: valint
    workspaces:
    - name: output
      workspace: shared-workspace
    params:
    - name: args
      value: 
        - slsa 
        - busybox:latest
        - --env=test_env
        - --label=test_label
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
  name: basic-tests
spec:
  workspaces:
  - name: shared-workspace
  tasks:
  - name: valint-bom
    taskRef:
      name: valint
    workspaces:
    - name: output
      workspace: shared-workspace
    params:
    - name: args
      value: 
        - bom 
        - docker-archive:busybox.tar
```
</details>

<details>
  <summary> Archive image (SLSA) </summary>

Create SLSA for local `docker save` output.

> Use `oci-archive` target type when creating a OCI archive (`podman save`).

```YAML
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: basic-tests
spec:
  workspaces:
  - name: shared-workspace
  tasks:
  - name: valint-slsa
    taskRef:
      name: valint
    workspaces:
    - name: output
      workspace: shared-workspace
    params:
    - name: args
      value: 
        - slsa
        - docker-archive:busybox.tar
```
</details>

<details>
  <summary> Directory target (SBOM) </summary>

Create SBOM for a local directory.

```YAML
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: basic-tests
spec:
  workspaces:
  - name: shared-workspace
  tasks:
  - name: valint-bom
    taskRef:
      name: valint
    workspaces:
    - name: output
      workspace: shared-workspace
    params:
    - name: args
      value: 
        - bom 
        - dir:testdir
```
</details>

<details>
  <summary> Directory target (SLSA) </summary>

Create SLSA for a local directory.

```YAML
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: basic-tests
spec:
  workspaces:
  - name: shared-workspace
  tasks:
  - name: valint-bom
    taskRef:
      name: valint
    workspaces:
    - name: output
      workspace: shared-workspace
    params:
    - name: args
      value: 
        - slsa 
        - dir:testdir
```
</details>


<details>
  <summary> Git target (SBOM) </summary>

Create SBOM for `mongo-express` remote git repository.

```YAML
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: basic-tests
spec:
  workspaces:
  - name: shared-workspace
  tasks:
  - name: valint-bom
    taskRef:
      name: valint
    workspaces:
    - name: output
      workspace: shared-workspace
    params:
    - name: args
      value: 
        - bom 
        - git:https://github.com/mongo-express/mongo-express.git
```

Create SBOM for local git repository. 

> When using implicit checkout note the Gitlab-CI [git-strategy](https://docs.gitlab.com/ee/ci/runners/configure_runners.html#git-strategy) will effect the commits collected by the SBOM.

```YAML
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: basic-tests
spec:
  workspaces:
  - name: shared-workspace
  tasks:
  - name: valint-bom
    taskRef:
      name: valint
    workspaces:
    - name: output
      workspace: shared-workspace
    params:
    - name: args
      value: 
        - bom 
        - git:.
``` 
</details>

<details>
  <summary> Git target (SLSA) </summary>

Create SLSA for `mongo-express` remote git repository.

```YAML
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: basic-tests
spec:
  workspaces:
  - name: shared-workspace
  tasks:
  - name: valint-slsa
    taskRef:
      name: valint
    workspaces:
    - name: output
      workspace: shared-workspace
    params:
    - name: args
      value: 
        - slsa 
        - git:https://github.com/mongo-express/mongo-express.git
```

Create SLSA for local git repository. 

> When using implicit checkout note the Gitlab-CI [git-strategy](https://docs.gitlab.com/ee/ci/runners/configure_runners.html#git-strategy) will effect the commits collected by the SBOM.

```YAML
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: basic-tests
spec:
  workspaces:
  - name: shared-workspace
  tasks:
  - name: valint-slsa
    taskRef:
      name: valint
    workspaces:
    - name: output
      workspace: shared-workspace
    params:
    - name: args
      value: 
        - slsa 
        - git:.
``` 
</details>

### Alternative evidence stores

> You can learn more about alternative stores **[here](https://scribe-security.netlify.app/docs/integrating-scribe/other-evidence-stores)**.

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

### Usage
```yaml
# Creates a CycloneDX SBOM and verifies its policy.
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: basic-tests
spec:
  workspaces:
  - name: shared-workspace
  tasks:
  - name: valint-bom
    taskRef:
      name: valint
    workspaces:
    - name: output
      workspace: shared-workspace
    params:
    - name: args
      value: 
        - bom 
        - busybox:latest
        - -o=statement
        - --oci
        - --oci-repo [my_repo]

  - name: valint-verify-bom
    taskRef:
      name: valint
    workspaces:
    - name: output
      workspace: shared-workspace
    runAfter:
    - valint-bom
    params:
    - name: args
      value: 
        - verify 
        - busybox:latest 
        - -i=statement
        - --oci
        - --oci-repo [my_repo]
```

```yaml
# Creates a SLSA Provanence and verifies its policy.
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: basic-tests
spec:
  workspaces:
  - name: shared-workspace
  tasks:
  - name: valint-slsa
    taskRef:
      name: valint
    workspaces:
    - name: output
      workspace: shared-workspace
    runAfter:
    - valint-verify-bom
    params:
    - name: args
      value: 
        - slsa 
        - busybox:latest
        - -o=statement
        - --oci
        - --oci-repo [my_repo]

  - name: valint-verify-slsa
    taskRef:
      name: valint
    workspaces:
    - name: output
      workspace: shared-workspace
    runAfter:
    - valint-slsa
    params:
    - name: args
      value: 
        - verify 
        - busybox:latest 
        - -i=statement-slsa
        - --oci
        - --oci-repo [my_repo]
```

</details>
