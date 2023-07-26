---
sidebar_label: "K8s Admission Controller"
title: K8s Admission Controller - Coming Soon!
sidebar_position: 5
toc_min_heading_level: 2
toc_max_heading_level: 5
---

<!-- # K8s Admission Controller - Coming Soon! -->
<img src='../../../img/help/coming-soon.jpg' alt='Coming Soon'/>


![Version: 0.1.4-1](https://img.shields.io/badge/Version-0.1.4--1-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: 0.1.4-1](https://img.shields.io/badge/AppVersion-0.1.4--1-informational?style=flat-square)

### Introduction to K8s Admission Controller

The Scribe Admission Controller is a component in your Kubernetes cluster that enforces policy decisions to validate the integrity of your supply chain.  

It does this by checking resources that are being created in the cluster against admission compliance requirements, which determine if the resources are allowed.  

This document provides instructions for installing and integrating the admission controller in your cluster, including options for both Scribe service and OCI registry integration.  

The admission controller is built with Helm and is supported by the Scribe security team. To enable the admission logic, simply add the `admission.scribe.dev/include` label to a namespace. 

### Supported K8s platforms

### Prerequisites

### Installing the K8s Admission Controller

The admission-controller is installed using Helm.  

Here are the steps to add the chart repository and install the admission-controller/

1. Add the chart repository:
```bash
helm repo add scribe https://scribe-security.github.io/helm-charts
helm repo update
kubectl create namespace scribe
helm install admission-controller scribe/admission-controller -n scribe
```
> For detailed integration option, see **[evidence stores](#evidence-stores)** section.

### How the Admission Controller works

Valint `admission controller` manages verification of evidence using a policy engine. The policy engine uses different `evidence stores` to store and provide `evidence` for the policy engine to query on any required `evidence` required to comply with across your supply chain.

Each policy proposes to enforce a set of policies on the targets produced by your supply chain. Policies produce a result, including compliance results as well as `evidence` referenced in the verification.

# Policy engine
At the heart of Valint lies the `policy engine`, which enforces a set of policies on the `evidence` produced by your supply chain. The policy engine accesses different `evidence stores` to retrieve and store `evidence` for compliance verification throughout your supply chain.  

Each `policy` proposes to enforce a set of policy modules your supply chain must comply with. 

## Evidence:
Evidence can refer to metadata collected about artifacts, reports, events or settings produced or provided to your supply chain.
Evidence can be either signed (attestations) or unsigned (statements).

### Evidence formats
`admission controller` supports the following evidence formats.

| Evidence format | Alias | Description | Can be signed |
| --- | --- | --- | --- |
| statement-cyclonedx-json | statement | In-toto Statement | no |
| attest-cyclonedx-json | attest | In-toto Attestation | yes |
| statement-slsa |  | In-toto SLSA Predicate Statement | no |
| attest-slsa |  | In-toto SLSA Predicate Attestation | yes |
| statement-generic |  | In-toto Generic Statement | no |
| attest-generic |  | In-toto Generic Attestations | yes |

> Note using pure `cyclonedx-json` format is currently supported by the admission.

### Evidence Stores
Each storer can be used to store, find and download evidence, unifying all the supply chain evidence into a system is an important part to be able to query any subset for policy validation.

| Type  | Description | requirement |
| --- | --- | --- |
| scribe | Evidence is stored on scribe service | scribe credentials |
| OCI | Evidence is stored on a remote OCI registry | access to a OCI registry |

## Scribe Evidence store
Scribe evidence store allows you store evidence using scribe Service.

Related values:
> Note the values set:
>* `scribe.auth.client_id`
>* `scribe.auth.client_secret`
>* `scribe.service.enable`

* To install the admission-controller with Scribe service integration:
```bash
  helm install admission-controller -n scribe scribe/admission-controller \
    --set scribe.service.enable=true \
    --set scribe.auth.client_id=$(CLIENT_ID) \
    --set scribe.auth.client_secret=$(CLIENT_SECRET)
```
> Credentials will be stored as a secret named `admission-controller-scribe-cred`.

## OCI Evidence store
Admission supports both storage and verification flows for `attestations` and `statement` objects using an OCI registry as an evidence store. <br />
Using OCI registry as an evidence store allows you to upload and verify evidence across your supply chain in a seamless manner.

Related flags:
>* `config.attest.cocosign.storer.OCI.enable` - Enable OCI store.
>* `config.attest.cocosign.storer.OCI.repo` - Evidence store location.
>* `imagePullSecrets` - Secret name for private registry.


### Admission Controller Optional Flags

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| commonNodeSelector | object | `{}` |  |
| commonTolerations | list | `[]` |  |
| config.admission.glob | list | `[]` | Select admitted images by regex |
| config.attest.cocosign.storer.OCI.enable | bool | `true` | OCI evidence enable |
| config.attest.cocosign.storer.OCI.repo | string | `""` | OCI evidence repo location  |
| config.attest.default | string | `"sigstore"` | Signature verification type |
| config.context.name | string | `""` | Scribe Project Key |
| config.verify.input-format | string | `"attest"` | Evidence format |
| imagePullSecrets | list | `[]` | OCI evidence store secret name |
| scribe.auth.client_id | string | `""` | Scribe Client ID |
| scribe.auth.client_secret | string | `""` | Scribe Client Secret |
| scribe.service.enable | bool | `false` | Scribe Client Enable |
| serviceMonitor.enabled | bool | `false` |  |
| webhook.env | object | `{}` |  |
| webhook.extraArgs.structured | bool | `true` |  |
| webhook.extraArgs.verbose | int | `2` |  |
| webhook.image.pullPolicy | string | `"IfNotPresent"` |  |
| webhook.image.repository | string | `"scribesecuriy.jfrog.io/scribe-docker-public-local/valint"` |  |
| webhook.image.version | string | `"v0.1.4-1-admission"` |  |
| webhook.name | string | `"webhook"` |  |
| webhook.podSecurityContext.allowPrivilegeEscalation | bool | `false` |  |
| webhook.podSecurityContext.capabilities.drop[0] | string | `"all"` |  |
| webhook.podSecurityContext.enabled | bool | `true` |  |
| webhook.podSecurityContext.readOnlyRootFilesystem | bool | `true` |  |
| webhook.podSecurityContext.runAsUser | int | `1000` |  |
| webhook.replicaCount | int | `1` |  |
| webhook.secretName | string | `""` |  |
| webhook.securityContext.enabled | bool | `false` |  |
| webhook.securityContext.runAsUser | int | `65532` |  |
| webhook.service.annotations | object | `{}` |  |
| webhook.service.port | int | `443` |  |
| webhook.service.type | string | `"ClusterIP"` |  |
| webhook.serviceAccount.annotations | object | `{}` |  |
| webhook.webhookName | string | `"admission.scribe.dev"` |  |

### Troubleshooting 
