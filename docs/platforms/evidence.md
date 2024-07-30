
---

## sidebar_label: "Uploading Discovery Evidence"
title: "Platforms Evidence command"
sidebar_position: 4
# The Evidence Command
This command is used for uploading evidence, based on the assets discovered in the previous step, to the attestation store.
This command is for creating platform evidence; creating SBOMs of assets such as DockerHub images is done through the `bom` command.

The evidence command uses Scribe's `valint` tool to upload the evidence and to sign it if necessary. Documentation of the `valint` tool can be found [﻿here](https://scribe-security.netlify.app/docs/introducing-scribe/what-is-scribe/).

## Common Options
```bash
usage: platforms [options] evidence [-h] [--evidence.local.path PATH] [--evidence.local.prefix PREFIX]
                                    [--evidence.local_only] [--valint.scribe.client-id CLIENT_ID]
                                    [--valint.scribe.client-secret CLIENT_SECRET] [--valint.scribe.enable]
                                    [--valint.context-type CONTEXT_TYPE] [--valint.log-level LOG_LEVEL]
                                    [--valint.output-directory OUTPUT_DIRECTORY] [--valint.bin BIN]
                                    [--valint.product-key PRODUCT_KEY] [--valint.product-version PRODUCT_VERSION]
                                    [--valint.predicate-type PREDICATE_TYPE] [--valint.attest ATTEST]
                                    [--valint.disable-evidence-cache] [--valint.sign]
                                    {gitlab,k8s,dockerhub} ...
Export evidence data
options:
  -h, --help            Show this help message and exit.
  --evidence.local.path PATH
                        Local report export directory path (type: str, default: output)
  --evidence.local.prefix PREFIX
                        Local report export prefix (type: str, default: )
  --evidence.local_only
                        Only export local evidence (default: False)
  --valint.scribe.client-id CLIENT_ID
                        Scribe client ID (type: str, default: )
  --valint.scribe.client-secret CLIENT_SECRET
                        Scribe client Secret (type: str, default: )
  --valint.scribe.enable
                        Enable Scribe client (default: False)
  --valint.context-type CONTEXT_TYPE
                        Valint context type (type: str, default: )
  --valint.log-level LOG_LEVEL
                        Valint log level (type: str, default: )
  --valint.output-directory OUTPUT_DIRECTORY
                        Local evidence cache directory (type: str, default: )
  --valint.bin BIN      Valint CLI binary path (type: str, default: /home/mikey/.scribe/bin/valint)
  --valint.product-key PRODUCT_KEY
                        Evidence product key (type: str, default: factory)
  --valint.product-version PRODUCT_VERSION
                        Evidence product version (type: str, default: )
  --valint.predicate-type PREDICATE_TYPE
                        Evidence predicate type (type: str, default: http://scribesecurity.com/evidence/discovery/v0.1)
  --valint.attest ATTEST
                        Evidence attest type (type: str, default: x509-env)
  --valint.disable-evidence-cache
                        Disable evidence cache (default: False)
  --valint.sign         sign evidence (default: False)
subcommands:
  For more details of each subcommand, add it as an argument followed by --help.
  Available subcommands:
    gitlab
    k8s
    dockerhub
```
## Gitlab Evidence
Gitlab evidence supports the generation of organization evidence and project evidence. 

To generate evidence for a Gitlab account:

```bash
platforms evidence gitlab --organization.mapping "my-org::my-product::1.0" --project.mapping "my-project::my-product::1.0"
```
```bash
usage: platforms [options] evidence [options] gitlab [-h] [--instance INSTANCE] [--token TOKEN] [--url URL]
                                                     [--types {organization,project,all}]
                                                     [--scope.organization [ORGANIZATION ...]]
                                                     [--scope.project [PROJECT ...]] [--scope.branch [BRANCH ...]]
                                                     [--commit.skip] [--pipeline.skip]
                                                     [--default_product_key_strategy {mapping}] [--organization.many]
                                                     [--project.many] [--organization.mapping [MAPPING ...]]
                                                     [--project.mapping [MAPPING ...]]
options:
  -h, --help            Show this help message and exit.
  --instance INSTANCE   Gitlab instance string (default: )
  --token TOKEN         Gitlab token (required, default: )
  --url URL             Gitlab base URL (default: https://gitlab.com/api/v4)
  --types {organization,project,all}
                        Defines which evidence to create, scoped by scope parameters (default: all)
  --scope.organization [ORGANIZATION ...]
                        Gitlab organization list (default: null)
  --scope.project [PROJECT ...]
                        Gitlab projects epositories wildcards (default: ['*'])
  --scope.branch [BRANCH ...]
                        Gitlab branches wildcards (default: ['*'])
  --commit.skip         Skip commits in evidence (default: False)
  --pipeline.skip       Skip pipeline in evidence (default: False)
  --default_product_key_strategy {mapping}
                        Override product key with namespace, pod or image names (default: mapping)
  --organization.many   Export all organizations (default: True)
  --project.many        Export all projects (default: True)
  --organization.mapping [MAPPING ...]
                        Organization product key mapping in the format of asset::product_key::product_version (type:
                        AssetMappingString, default: [])
  --project.mapping [MAPPING ...]
                        Project product key mapping in the format of asset::product_key::product_version (type:
                        AssetMappingString, default: [])
```
## DockerHub evidence
DockerHub evidence generation supports the generation of namespace and repository evidence. The evidence includes information about the repositories, tags, and access tokens.

To generate evidence for a DockerHub account:

```bash
platforms evidence dockerhub --namespace.mapping "my-namespace::my-product::1.0" --repository.mapping "my-repo::my-product::1.0"
```
```bash
usage: platforms [options] evidence [options] dockerhub [-h] [--instance INSTANCE]
                                                        [--types {token,repository,namespace,all}]
                                                        [--scope.namespace [NAMESPACE ...]]
                                                        [--scope.repository [REPOSITORY ...]]
                                                        [--scope.repository_tags [REPOSITORY_TAGS ...]]
                                                        [--exclude.repository [REPOSITORY ...]]
                                                        [--exclude.repository_tags [REPOSITORY_TAGS ...]]
                                                        [--namespace.mapping [MAPPING ...]]
                                                        [--repository.mapping [MAPPING ...]]
                                                        [--token.mapping [MAPPING ...]] [--namespace.many]
                                                        [--repository.many]
                                                        [--default_product_key_strategy {mapping,mapping}]
options:
  -h, --help            Show this help message and exit.
  --instance INSTANCE   Dockerhub instance string (default: )
  --types {token,repository,namespace,all}
                        Defines which evidence to create, scoped by scope parameters (default: all)
  --scope.namespace [NAMESPACE ...]
                        Dockerhub namespaces (default: ['*'])
  --scope.repository [REPOSITORY ...]
                        Dockerhub repositories (default: ['*'])
  --scope.repository_tags [REPOSITORY_TAGS ...]
                        Dockerhub tags (default: ['*'])
  --exclude.repository [REPOSITORY ...]
                        Dockerhub repository wildcards to exclude (default: [])
  --exclude.repository_tags [REPOSITORY_TAGS ...]
                        Dockerhub tags to exclude (default: [])
  --namespace.mapping [MAPPING ...]
                        Repository product key mapping in the format of asset::product_key::product_version (type:
                        AssetMappingString, default: [])
  --repository.mapping [MAPPING ...]
                        Repository product key mapping in the format of asset::product_key::product_version (type:
                        AssetMappingString, default: [])
  --token.mapping [MAPPING ...]
                        Repository tag product key mapping in the format of asset::product_key::product_version (type:
                        AssetMappingString, default: [])
  --namespace.many      Export all namespaces (default: True)
  --repository.many     Export all repositories (default: True)
  --default_product_key_strategy {mapping,mapping}
                        Override product key with namespace, repository or image names (default: mapping)
```
## K8s Evidence
K8s evidence generation supports the generation of namespace and pod evidence. Namespace evidence includes secrets metadata (if it was not scoped out)
To generate evidence for a K8s cluster:

```bash
platforms evidence k8s --namespace.mapping "my-namespace::my-product::1.0" --pod.mapping "my-pod::my-product::1.0"
```
```bash
usage: platforms [options] evidence [options] k8s [-h] [--instance INSTANCE] [--types {namespace,pod,all}]
                                                  [--scope.namespace [NAMESPACE ...]] [--scope.pod [POD ...]]
                                                  [--scope.image [IMAGE ...]] [--exclude.namespace [NAMESPACE ...]]
                                                  [--exclude.pod [POD ...]] [--exclude.image [IMAGE ...]]
                                                  [--default_product_key_strategy {mapping,mapping}]
                                                  [--scope.secret.skip] [--namespace.many] [--pod.many]
                                                  [--namespace.mapping [MAPPING ...]] [--pod.mapping [MAPPING ...]]
options:
  -h, --help            Show this help message and exit.
  --instance INSTANCE   Kubernetes instance string (default: )
  --types {namespace,pod,all}
                        Defines which evidence to create, scoped by scope parameters (default: all)
  --scope.namespace [NAMESPACE ...]
                        Kubernetes namespaces wildcard list (default: ['*'])
  --scope.pod [POD ...]
                        Kubernetes pods wildcard list (default: ['*'])
  --scope.image [IMAGE ...]
                        Kubernetes images wildcard list (default: ['*'])
  --exclude.namespace [NAMESPACE ...]
                        Namespaces to exclude from discovery process (default: [])
  --exclude.pod [POD ...]
                        Pods to exclude from discovery process (default: [])
  --exclude.image [IMAGE ...]
                        Images to exclude from discovery process (default: [])
  --default_product_key_strategy {mapping,mapping}
                        Override product key with namespace, pod or image names (default: mapping)
  --scope.secret.skip   Skip secrets information in the evidence (default: False)
  --namespace.many      Export all namespaces (default: True)
  --pod.many            Export all pods (default: True)
  --namespace.mapping [MAPPING ...]
                        Namespace product key mapping in the format of asset::product_key::product_version (type:
                        AssetMappingString, default: [])
  --pod.mapping [MAPPING ...]
                        Pod product key mapping in the format of asset::product_key::product_version (type:
                        AssetMappingString, default: [])
```




<!--- Eraser file: https://app.eraser.io/workspace/ucHe5tenvc2oX46YoCh3 --->