<p><a target="_blank" href="https://app.eraser.io/workspace/iB8mr8VYwAP07maJ15nN" id="edit-in-eraser-github-link"><img alt="Edit in Eraser" src="https://firebasestorage.googleapis.com/v0/b/second-petal-295822.appspot.com/o/images%2Fgithub%2FOpen%20in%20Eraser.svg?alt=media&amp;token=968381c8-a7e7-472a-8ed6-4a6626da5501"></a></p>

---

## sidebar_position: 8
sidebar_label: "Tekton CI/CD"
title: Integrating Scribe in your Tekton Pipelines
Use the following instructions to integrate your Tekton pipelines with Scribe.

### 1. Obtain a Scribe Hub API Token
1. Sign in to [﻿Scribe Hub](https://app.scribesecurity.com/) . If you don't have an account you can sign up for free [﻿here](https://scribesecurity.com/scribe-platform-lp/) .
2. Create a API token in [﻿Scribe Hub > Settings > Tokens](https://app.scribesecurity.com/settings/tokens) . Copy it to a safe temporary notepad until you complete the integration.
:::note Important
The token is a secret and will not be accessible from the UI after you finalize the token generation.
:::
### 2. Add the API token to Kubernetes secrets
Add the Scribe Hub API token as SCRIBE_TOKEN to your [﻿kubernetes secret](https://kubernetes.io/docs/concepts/configuration/secret/) 

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

1. Install Azure DevOps [﻿Valint-task](https://marketplace.visualstudio.com/items?itemName=ScribeSecurity.valint-cli)  from the Azure marketplace. 
2. Follow [﻿install-an-extension](https://learn.microsoft.com/en-us/azure/devops/marketplace/install-extension?view=azure-devops&tabs=browser#install-an-extension)  to add the extension to your organization and use the task in your pipelines.
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
| ----- | ----- | ----- |
|  | The name of the secret that has the scribe security secrets. | scribe-secret |
|  | <p>Arguments of the </p><p> CLI</p> |  |
|  | The ID of the valint image cli to be used. |  |
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
 Public registry image (SBOM) 

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
 Public registry image (SLSA) 

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
 Custom metadata (SBOM) 

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
 Custom metadata (SLSA) 

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
 Archive image (SBOM) 

Create SBOM for local `docker save` output.

>  Use `oci-archive` target type when creating a OCI archive (`podman save`). 

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
 Archive image (SLSA) 

Create SLSA for local `docker save` output.

>  Use `oci-archive` target type when creating a OCI archive (`podman save`). 

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
 Directory target (SBOM) 

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
 Directory target (SLSA) 

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
 Git target (SBOM) 

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

>  When using implicit checkout note the Gitlab-CI [﻿git-strategy](https://docs.gitlab.com/ee/ci/runners/configure_runners.html#git-strategy) will effect the commits collected by the SBOM. 

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
 Git target (SLSA) 

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

>  When using implicit checkout note the Gitlab-CI [﻿git-strategy](https://docs.gitlab.com/ee/ci/runners/configure_runners.html#git-strategy) will effect the commits collected by the SBOM. 

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
### Alternative evidence stores
>  You can learn more about alternative stores [﻿here](https://scribe-security.netlify.app/docs/integrating-scribe/other-evidence-stores). 

** OCI Evidence store **

 Valint supports both storage and verification flows for `attestations` and `statement` objects utilizing OCI registry as an evidence store. 

Using OCI registry as an evidence store allows you to upload, download and verify evidence across your supply chain in a seamless manner.

Related flags:

- `--oci`  Enable OCI store.
- `--oci-repo`  - Evidence store location.
### Before you begin
Evidence can be stored in any accusable registry.

- Write access is required for upload (generate).
- Read access is required for download (verify).
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




<!--- Eraser file: https://app.eraser.io/workspace/iB8mr8VYwAP07maJ15nN --->