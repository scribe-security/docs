---
sidebar_position: 8
sidebar_label: "Tekton CI/CD"
title: Integrating Scribe in your Tekton Pipelines
---
Use the following instructions to integrate your Azure pipelines with Scribe.

### 1. Obtain a Scribe Hub API Token
1. Sign in to [Scribe Hub](https://app.scribesecurity.com). If you don't have an account you can sign up for free [here](https://scribesecurity.com/scribe-platform-lp/ "Start Using Scribe For Free").

2. Create a Scribe Hub API token [here](https://app.scribesecurity.com/settings/tokens). Copy it to a safe temporary notepad until you complete the integration. </br></br>
**Note** the token is a secret and will not be accessible from the UI after you finalize the token generation. 

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
1. Install Azure DevOps [Valint-task](https://marketplace.visualstudio.com/items?itemName=ScribeSecurity.valint-cli) from the Azure marketplace.  <br />
2. Follow **[install-an-extension](https://learn.microsoft.com/en-us/azure/devops/marketplace/install-extension?view=azure-devops&tabs=browser#install-an-extension)** to add the extension to your organization and use the task in your pipelines.  <br />

### 4. Instrument your build scripts

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

Create SBOM for local git repository. <br />

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

Create SLSA for local git repository. <br />

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
