
---

## sidebar_label: "Setup Kubernetes Token"
title: "Setup Kubernetes Token"
sidebar_position: 7
# Generating a Kubernetes Token for Using with `platforms` 
## Background
K8s tokens are generated as part of deploying roles and service accounts in a Kubernetes cluster.
The `platforms` tool uses these tokens to access the cluster and retrieve information about namespaces, pods, and secrets.

Note that the `platforms` tool does not store the actual secrets, only metadata.

## Prerequisites
Access to your Kubernetes cluster and the ability to create roles and service accounts using `kubectl`.

## Steps
1. Create a service account
Create a `yml`  file with the following content:
```yml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: secret-reader
  namespace: default # Change this to your desired namespace```
<!-- { "object-type": "command-output-end" } -->


Deploy it using:
```bash
kubectl apply -f scripts/k8s-scripts/service-account.yaml
```
1. Create a role
Create a `yml`  file with the following content:
```yml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: secret-reader-role
rules:
- apiGroups: [""]
  resources: ["secrets", "pods", "namespaces"]
  verbs: ["get", "watch", "list"]
```
Deploy it using:

```bash
kubectl apply -f scripts/k8s-scripts/role.yaml
```
1. Create a role binding
Create a `yml`  file with the following content:
```yml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: secret-reader-binding
  namespace: default
subjects:
- kind: ServiceAccount
  name: secret-reader
  namespace: default
roleRef:
  kind: Role
  name: secret-reader-role
  apiGroup: rbac.authorization.k8s.io
```
Deploy it using:

```bash
kubectl apply -f scripts/k8s-scripts/role-binding.yaml
```
1. Create a cluster role-binding
Create a `yml`  file with the following content:
```yml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: secret-reader-binding
subjects:
- kind: ServiceAccount
  name: secret-reader
  namespace: default
roleRef:
  kind: ClusterRole
  name: secret-reader-role
  apiGroup: rbac.authorization.k8s.io
```
Deploy it using:

```bash
kubectl apply -f scripts/k8s-scripts/cluster-role-binding.yaml
```
1. Create the secret
Create a `yml`  file with the following content:
```yml
apiVersion: v1
kind: Secret
metadata:
  name: api-service-account-token # generating secret containing access token for service account 
  annotations:
    kubernetes.io/service-account.name: api-service-account
type: kubernetes.io/service-account-token```
<!-- { "object-type": "command-output-end" } -->


Deploy it using:
```bash
kubectl apply -f scripts/k8s-scripts/secret.yaml
```
1. Get the token
Get the token using:
```bash
kubectl get secrets  api-service-account-token  -o=jsonpath='{.data.token}' |  base64 -D
```
Notes:

- This secret has high privileges and should be handled with care.
- Make sure to replace `api-service-account-token`  with the name of the secret you created in step 5.




<!--- Eraser file: https://app.eraser.io/workspace/CgAg8DT6sTK0UTzHK11F --->