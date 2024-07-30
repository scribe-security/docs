
---

## sidebar_label: "SBOM Generation"
title: "Platforms BOM command"
sidebar_position: 5
# The BOM Command
The BOM command is used to generate SBOMs of assets. Currently, we support generating SBOMs of DockerHub images and K8s clusters.
This command enables users to generate SBOMs on scale.

## Common Options
```bash
usage: platforms [options] bom [-h] [--allow-failures] [--save-scan-plan] [--dry-run] [--monitor.mount MOUNT]
                               [--monitor.threshold THRESHOLD] [--monitor.clean-docker]
                               [--valint.scribe.client-id CLIENT_ID] [--valint.scribe.client-secret CLIENT_SECRET]
                               [--valint.scribe.enable] [--valint.context-type CONTEXT_TYPE]
                               [--valint.log-level LOG_LEVEL] [--valint.output-directory OUTPUT_DIRECTORY]
                               [--valint.bin BIN] [--valint.product-key PRODUCT_KEY]
                               [--valint.product-version PRODUCT_VERSION] [--valint.predicate-type PREDICATE_TYPE]
                               [--valint.attest ATTEST] [--valint.disable-evidence-cache] [--valint.sign]
                               {k8s,dockerhub} ...
Export bom data
options:
  -h, --help            Show this help message and exit.
  --allow-failures      Allow failures without returning an error code (default: False)
  --save-scan-plan      Save scan plan (default: False)
  --dry-run             Dry run (default: False)
  --monitor.mount MOUNT
                        Monitor disk usage - mount path (type: str, default: )
  --monitor.threshold THRESHOLD
                        Monitor disk usage - threshold (type: int, default: 90)
  --monitor.clean-docker
                        Monitor disk usage - auto clean docker cache (default: False)
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
    k8s
    dockerhub
```
## DockerHub BOM
To generate SBOMs of DockerHub images:

```bash
platforms bom dockerhub --image.mapping "my-namespace/my-image:my-tag::my-product::1.0"
```
Note that the image characterization string is a wildcarded string, some useful valid examples are:

- `*:latest`  - all images with the latest tag.
- `my-namespace/*:latest`  - all images in the my-namespace with the latest tag.
- `*postgres*`  - all images with the word "postgres" in the name.
```bash
usage: platforms [options] bom [options] dockerhub [-h] [--instance INSTANCE]
                                                   [--default_product_key_strategy {namespace,repository,tag,mapping}]
                                                   [--default_product_version_strategy {tag,short_image_id,image_id}]
                                                   [--scope.namespace [NAMESPACE ...]]
                                                   [--scope.repository [REPOSITORY ...]]
                                                   [--scope.repository_tags [REPOSITORY_TAGS ...]]
                                                   [--exclude.repository [REPOSITORY ...]]
                                                   [--exclude.repository_tags [REPOSITORY_TAGS ...]]
                                                   [--image.mapping [MAPPING ...]]
options:
  -h, --help            Show this help message and exit.
  --instance INSTANCE   Dockerhub instance string (default: )
  --default_product_key_strategy {namespace,repository,tag,mapping}
                        Override product key with namespace, repository or image names (default: mapping)
  --default_product_version_strategy {tag,short_image_id,image_id}
                        Override product version with tag or image id (default: short_image_id)
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
  --image.mapping [MAPPING ...]
                        Image product key mapping in the format of asset::product_key::product_version (type:
                        AssetMappingString, default: [])
```
## K8s BOM
To generate SBOMs of K8s images:

```bash
platforms bom k8s --image.mapping "my-namespace::my-pod::my-image::my-product::1.0"
```
Note that the image characterization string is a wildcarded string, with separate sections for namespace, pod, and image. Some useful valid examples are:

- `*::*::*:latest`  - all cluster images with the latest tag.
- `prod*::*::my-image-prefix*`  - all images in the prod* namespace with the my-image-prefix as the prefix of their name.
- `prod*::*::*:latest`  - all images in the prod* namespace with the latest tag.
```bash
usage: platforms [options] bom [options] k8s [-h] [--instance INSTANCE] [--types {namespace,pod,all}]
                                             [--default_product_key_strategy {namespace,pod,image,mapping}]
                                             [--default_product_version_strategy {namespace_hash,pod_hash,image_id}]
                                             [--scope.namespace [NAMESPACE ...]] [--scope.pod [POD ...]]
                                             [--scope.image [IMAGE ...]] [--exclude.namespace [NAMESPACE ...]]
                                             [--exclude.pod [POD ...]] [--exclude.image [IMAGE ...]]
                                             [--image.mapping [MAPPING ...]]
options:
  -h, --help            Show this help message and exit.
  --instance INSTANCE   Kubernetes instance string (default: )
  --types {namespace,pod,all}
                        Defines which evidence to create, scoped by scope parameters (default: all)
  --default_product_key_strategy {namespace,pod,image,mapping}
                        Override product key with namespace, pod or image names (default: mapping)
  --default_product_version_strategy {namespace_hash,pod_hash,image_id}
                        Override product version with namespace, pod or image names (default: namespace_hash)
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
  --image.mapping [MAPPING ...]
                        K8s namespace;pod;image to product_key:product_version mappinge.g. my-namespace;my-pod;my-
                        image:product_key:product_version (type: K8sImageMappingString, default: [])
```




<!--- Eraser file: https://app.eraser.io/workspace/LbCJ8piaZdtIBQzsGhWa --->