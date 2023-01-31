---
description: Setting up your Continuous Integration (CI)
---

# Admission Controller for Kubernetes
Scribe offers users of Admission Controller for kubernetes to use Devops Tasks for embedding evidence collecting and integrity verification in their workflows.

Admission Controller provides several actions enabling to validate the image being deployed to the kuberenetes cluster.

The usage examples on this page demonstrate several use cases of Admission Controller to verify using statement or attest using publically available oci registry or private registry

## Before you begin
Integrating Scribe Hub with Admission in kubernetes requires the following credentials that are found in the product setup dialog (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **Home>Products>[$product]>Setup**)

* **Product Key**
* **Client ID**
* **Client Secret**

>Note that the product key is unique per product, while the client ID and secret are unique for your account.


## Procedure

Install the Scribe using:
```bash
helm repo add scribe https://scribe-security.github.io/helm-charts
helm repo update
```
Create Namespace: `scribe`
```bash
kubectl create namespace scribe
```

<details>
  <summary>  <b> Sample integration code </b> </summary>

```bash
helm install scribeAdmission scribe/admission-controller -n scribe \
--set scribe.auth.client_id=$SCRIBE_CLIENT_ID \
--set scribe.auth.client_secret=$SCRIBE_CLIENT_SECRET \
--set config.attest.cocosign.storer.OCI.enable=true \
--set config.verify.input-format=statement
```

</details>

## Basic examples

<details>
  <summary> Using public registry for statement verification </summary>

```bash
helm install scribeAdmission scribe/admission-controller -n scribe \
--set scribe.auth.client_id=$SCRIBE_CLIENT_ID \
--set scribe.auth.client_secret=$SCRIBE_CLIENT_SECRET \
--set config.attest.cocosign.storer.OCI.enable=true \
--set config.verify.input-format=statement
``` 

</details>

<details>
  <summary> Using private registry for statement verification </summary>

Create a secret using

```bash
kubectl create secret docker-registry yourSecretKey --docker-server=yourDockerSErver --docker-username=yourUsername --docker-password=yourPassword -n scribe
```

```bash
helm install scribeAdmission scribe/admission-controller -n scribe \
--set scribe.auth.client_id=$SCRIBE_CLIENT_ID \
--set scribe.auth.client_secret=$SCRIBE_CLIENT_SECRET \
--set config.attest.default=sigstore \
--set config.verify.input-format=statement \
--set config.attest.cocosign.storer.OCI.enable=true \
--set config.attest.cocosign.storer.OCI.repo=your/repo/for/attestation \
--set "imagePullSecrets={yourSecretLKey}"
``` 
</details>

<details>
  <summary> Using public registry for attest verification </summary>

```bash
helm install scribeAdmission scribe/admission-controller -n scribe \
--set scribe.auth.client_id=$SCRIBE_CLIENT_ID \
--set scribe.auth.client_secret=$SCRIBE_CLIENT_SECRET \
--set config.attest.cocosign.storer.OCI.enable=true \
--set config.verify.input-format=attest
``` 

</details>

<details>
  <summary> Using private registry for attest verification </summary>

Create a secret using

```bash
kubectl create secret docker-registry yourSecretKey --docker-server=yourDockerSErver --docker-username=yourUsername --docker-password=yourPassword -n scribe
```

```bash
helm install scribeAdmission scribe/admission-controller -n scribe \
--set scribe.auth.client_id=$SCRIBE_CLIENT_ID \
--set scribe.auth.client_secret=$SCRIBE_CLIENT_SECRET \
--set config.attest.default=sigstore \
--set config.verify.input-format=attest \
--set config.attest.cocosign.storer.OCI.enable=true \
--set config.attest.cocosign.storer.OCI.repo=your/repo/for/attestation \
--set "imagePullSecrets={yourSecretLKey}"
``` 
</details>

Once done the Admission Controller will only allow the images that are verified.