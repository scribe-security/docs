
---

## sidebar_label: "Applying policies"
title: "Platforms Verify Command"
sidebar_position: 6
# The Verify Command
The verify command is used to evaluate policies on the evidence generated in the previous step. The policies are written in a policy-as-code framework, which provides user with out-of-the-box policies and the ability to write custom policies.

Currently, the verify command supports using the same policy bundle for all the evaluations; to run different policies for different products, one can run the command multiple times with different policy bundles specified.

The recommended use of the verify command with the product-mapping capabilities; this enables the user to track policy evaluations on the product level, and to get a product-level view of the security posture.

## Common Options
```bash
usage: platforms [options] verify [-h] [--valint.scribe.client-id CLIENT_ID]
                                  [--valint.scribe.client-secret CLIENT_SECRET] [--valint.scribe.enable]
                                  [--valint.context-type CONTEXT_TYPE] [--valint.log-level LOG_LEVEL]
                                  [--valint.output-directory OUTPUT_DIRECTORY] [--valint.bin BIN]
                                  [--valint.product-key PRODUCT_KEY] [--valint.product-version PRODUCT_VERSION]
                                  [--valint.predicate-type PREDICATE_TYPE] [--valint.attest ATTEST]
                                  [--valint.disable-evidence-cache] [--valint.sign] [--valint.bundle BUNDLE]
                                  [--valint.git-branch GIT_BRANCH] [--valint.git-commit GIT_COMMIT]
                                  [--valint.git-tag GIT_TAG] [--allow-failures]
                                  {k8s,dockerhub,gitlab} ...
Verify supply chain policies
options:
  -h, --help            Show this help message and exit.
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
  --valint.bundle BUNDLE
                        Set bundle git branch (type: str, default: )
  --valint.git-branch GIT_BRANCH
                        Set bundle git branch (type: str, default: dev)
  --valint.git-commit GIT_COMMIT
                        Set bundle git commit (type: str, default: )
  --valint.git-tag GIT_TAG
                        Set bundle git tag (type: str, default: )
  --allow-failures      Allow failures without returning an error code (default: False)
subcommands:
  For more details of each subcommand, add it as an argument followed by --help.
  Available subcommands:
    k8s
    dockerhub
    gitlab
```
## Gitlab Verify
To evaluate policies on Gitlab evidence:

```bash
platforms verify gitlab --organization.mapping "my-org::my-product::1.0" --project.mapping "my-project::my-product::1.0"
```
```bash
usage: platforms [options] verify [options] gitlab [-h] [--instance INSTANCE] [--token TOKEN] [--url URL]
                                                   [--types {organization,project,all}]
                                                   [--scope.organization [ORGANIZATION ...]]
                                                   [--scope.project [PROJECT ...]] [--scope.branch [BRANCH ...]]
                                                   [--commit.skip] [--organization.many] [--project.many]
                                                   [--organization.mapping [MAPPING ...]]
                                                   [--project.mapping [MAPPING ...]] [--project.policy [POLICY ...]]
                                                   [--organization.policy [POLICY ...]] [--org-policy-skip-aggregate]
                                                   [--project-policy-skip-aggregate]
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
  --organization.many   Export all organizations (default: True)
  --project.many        Export all projects (default: True)
  --organization.mapping [MAPPING ...]
                        Organization product key mapping in the format of asset::product_key::product_version (type:
                        AssetMappingString, default: [])
  --project.mapping [MAPPING ...]
                        Project product key mapping in the format of asset::product_key::product_version (type:
                        AssetMappingString, default: [])
  --project.policy [POLICY ...]
                        Set project policy file (type: str, default: ['ct-2@discovery', 'ct-9@discovery'])
  --organization.policy [POLICY ...]
                        Set organization policy file (type: str, default: ['ct-1@discovery', 'ct-3@discovery',
                        'ct-4@discovery'])
  --org-policy-skip-aggregate
                        Skip Aggregate organization policy results (default: False)
  --project-policy-skip-aggregate
                        Skip Aggregate project policy results (default: False)
```
## DockerHub Verify
To evaluate policies on DockerHub evidence.

```bash
usage: platforms [options] verify [options] dockerhub [-h] [--instance INSTANCE] [--username USERNAME]
                                                      [--password PASSWORD] [--url URL]
                                                      [--types {token,repository,namespace,all}]
                                                      [--default_product_key_strategy {namespace,repository,tag,mapping}]
                                                      [--default_product_version_strategy {tag,short_image_id,image_id}]
                                                      [--scope.namespace [NAMESPACE ...]]
                                                      [--scope.repository [REPOSITORY ...]]
                                                      [--scope.repository_tags [REPOSITORY_TAGS ...]]
                                                      [--exclude.repository [REPOSITORY ...]]
                                                      [--exclude.repository_tags [REPOSITORY_TAGS ...]]
                                                      [--image.mapping [MAPPING ...]] [--image.policy [POLICY ...]]
                                                      [--policy-skip-aggregate]
options:
  -h, --help            Show this help message and exit.
  --instance INSTANCE   Dockerhub instance string (default: )
  --username USERNAME   Dockerhub username (default: null)
  --password PASSWORD   Dockerhub password (default: null)
  --url URL             Dockerhub base URL (default: https://hub.docker.com)
  --types {token,repository,namespace,all}
                        Defines which evidence to create, scoped by scope parameters (default: all)
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
  --image.policy [POLICY ...]
                        Set image mapping policy file (type: str, default: ['ct-6@discovery', 'ct-8@discovery',
                        'ct-12@discovery', 'ct-13@discovery'])
  --policy-skip-aggregate
                        Skip Aggregate policy results (default: False)
```
## K8s Verify
```bash
usage: platforms [options] verify [options] k8s [-h] [--instance INSTANCE] [--url URL] [--token TOKEN]
                                                [--types {namespace,pod,cluster-images,all}]
                                                [--default_product_key_strategy {namespace,pod,image,mapping}]
                                                [--default_product_version_strategy {namespace_hash,pod_hash,image_id}]
                                                [--scope.namespace [NAMESPACE ...]] [--scope.pod [POD ...]]
                                                [--scope.image [IMAGE ...]] [--exclude.namespace [NAMESPACE ...]]
                                                [--exclude.pod [POD ...]] [--exclude.image [IMAGE ...]]
                                                [--namespace.many] [--pod.many] [--image.mapping [MAPPING ...]]
                                                [--cluster-images.policy [POLICY ...]] [--namespace.policy [POLICY ...]]
                                                [--policy-skip-aggregate]
options:
  -h, --help            Show this help message and exit.
  --instance INSTANCE   Kubernetes instance string (default: )
  --url URL             Kubernetes API URL (required, default: )
  --token TOKEN         Kubernetes token, with access to pods and secrets (required, default: )
  --types {namespace,pod,cluster-images,all}
                        Defines which evidence to create, scoped by scope parameters (default: cluster-images)
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
  --namespace.many      Export all namespaces (default: True)
  --pod.many            Export all pods (default: True)
  --image.mapping [MAPPING ...]
                        K8s namespace;pod;image to product_key:product_version mappinge.g. my-namespace;my-pod;my-
                        image:product_key:product_version (type: K8sImageMappingString, default: [])
  --cluster-images.policy [POLICY ...]
                        Set image policy file (type: str, default: ['ct-6@discovery', 'ct-8@discovery',
                        'ct-12@discovery', 'ct-13@discovery'])
  --namespace.policy [POLICY ...]
                        Set Kubernetes policy file (type: str, default: [])
  --policy-skip-aggregate
                        Skip Aggregate policy results (default: False)
```




<!--- Eraser file: https://app.eraser.io/workspace/h5DwmFc1573b1DoDS5Y1 --->