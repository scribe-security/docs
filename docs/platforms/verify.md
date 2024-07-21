---
sidebar_label: "Applying policies"
title: "Platforms Verify Command"
sidebar_position: 6
---

# The Verify Command
The verify command is used to evaluate policies on the evidence generated in the previous step. The policies are written in a policy-as-code framework, which provides user with out-of-the-box policies and the ability to write custom policies.

Currently, the verify command supports using the same policy bundle for all the evaluations; to run different policies for different products, one can run the command multiple times with different policy bundles specified.

The recommended use of the verify command with the product-mapping capabilities; this enables the user to track policy evaluations on the product level, and to get a product-level view of the security posture.

## Common Options
<!--
{
    "command": "platforms verify --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
Autofix arguments ['/home/mikey/scribe/platforms_lib/.tox/docs/bin/platforms', 'verify', '--help']
usage: platforms [options] verify [-h]
                                  [--valint.scribe.client-id CLIENT_ID]
                                  [--valint.scribe.client-secret CLIENT_SECRET]
                                  [--valint.scribe.enable]
                                  [--valint.cache.disable]
                                  [--valint.context-type CONTEXT_TYPE]
                                  [--valint.log-level LOG_LEVEL]
                                  [--valint.output-directory OUTPUT_DIRECTORY]
                                  [--valint.bin BIN]
                                  [--valint.product-key PRODUCT_KEY]
                                  [--valint.product-version PRODUCT_VERSION]
                                  [--valint.predicate-type PREDICATE_TYPE]
                                  [--valint.attest ATTEST]
                                  [--valint.disable-evidence-cache]
                                  [--valint.sign]
                                  [--valint.components COMPONENTS]
                                  [--valint.bundle BUNDLE]
                                  [--valint.git-branch GIT_BRANCH]
                                  [--valint.git-commit GIT_COMMIT]
                                  [--valint.git-tag GIT_TAG]
                                  [--allow-failures]
                                  {k8s,dockerhub,gitlab,github,jfrog}
                                  ...

Verify supply chain policies

options:
  -h, --help            Show this help message and exit.
  --valint.scribe.client-id CLIENT_ID
                        Scribe client ID (type: str, default: )
  --valint.scribe.client-secret CLIENT_SECRET
                        Scribe client Secret (type: str, default: )
  --valint.scribe.enable
                        Enable Scribe client (default: False)
  --valint.cache.disable
                        Disable Valint local cache (default: False)
  --valint.context-type CONTEXT_TYPE
                        Valint context type (type: str, default: )
  --valint.log-level LOG_LEVEL
                        Valint log level (type: str, default: )
  --valint.output-directory OUTPUT_DIRECTORY
                        Local evidence cache directory (type: str,
                        default: )
  --valint.bin BIN      Valint CLI binary path (type: str, default:
                        /home/mikey/.scribe/bin/valint)
  --valint.product-key PRODUCT_KEY
                        Evidence product key (type: str, default:
                        factory)
  --valint.product-version PRODUCT_VERSION
                        Evidence product version (type: str,
                        default: )
  --valint.predicate-type PREDICATE_TYPE
                        Evidence predicate type (type: str, default:
                        http://scribesecurity.com/evidence/discovery
                        /v0.1)
  --valint.attest ATTEST
                        Evidence attest type (type: str, default:
                        x509-env)
  --valint.disable-evidence-cache
                        Disable evidence cache (default: False)
  --valint.sign         sign evidence (default: False)
  --valint.components COMPONENTS
                        components list (type: str, default: )
  --valint.bundle BUNDLE
                        Set bundle git branch (type: str, default: )
  --valint.git-branch GIT_BRANCH
                        Set bundle git branch (type: str, default:
                        main)
  --valint.git-commit GIT_COMMIT
                        Set bundle git commit (type: str, default: )
  --valint.git-tag GIT_TAG
                        Set bundle git tag (type: str, default: )
  --allow-failures      Allow failures without returning an error
                        code (default: False)

subcommands:
  For more details of each subcommand, add it as an argument
  followed by --help.

  Available subcommands:
    k8s
    dockerhub
    gitlab
    github
    jfrog
```
<!-- { "object-type": "command-output-end" } -->

<!--
The option `--db.local.path` sets the local report path, with a default specified by `default_db_path`.

The option `--valint.scribe.client-id` specifies the Scribe client ID, with an empty string as the default. The `valint` tool will use the environment variable `SCRIBE_CLIENT_ID` if it exists.

The option `--valint.scribe.client-secret` sets the Scribe client secret, also defaulting to an empty string. The `valint` tool will use the environment variable `SCRIBE_CLIENT_SECRET` if it exists.

The option `--valint.scribe.enable` enables the Scribe client, with an empty string as default indicating it's disabled by default.

The option `--valint.cache.disable` allows to skip local valint cache and use scribe store only. The default value is `false`, can also be set via `VALINT_DISABLE_EVIDENCE_CACHE` environment variable. using this option without `--valint.scribe.enable` will result in an error.

The option `--valint.context-type` sets the Valint context type, with the default potentially sourced from the `VALINT_CONTEXT_TYPE` environment variable.

The option `--valint.log-level` specifies the log level for Valint, defaulting to an empty string.

The option `--valint.output-directory` sets the directory for local evidence caching, with a default defined by `default_valint_output_directory`.

The option `--valint.bin` specifies the path to the Valint CLI binary, defaulting to a path under the user's home directory.

The option `--valint.product-key` sets the evidence product key, with an empty string as the default.

The option `--valint.product-version` specifies the version of the evidence product, defaulting to an empty string.

The option `--valint.predicate-type` sets the evidence predicate type, with an empty string as the default.

The option `--valint.attest` specifies the type of evidence signing mechanism to use, defaulting to "x509-env".

The option `--valint.disable-evidence-cache` disables the caching of evidence, enhancing privacy or security concerns.

The option `--valint.sign` enables the signing of evidence to verify its integrity and source.

The following options are used to tweek the fetching of specific or customized policy bundles. Documentation of these features is part of the `valint` tools documentation and can be found [here](https://scribe-security.netlify.app/docs/introducing-scribe/what-is-scribe/)

The option `--valint.bundle` sets the bundle git branch, with an empty string as the default.

The option `--valint.git-branch` sets the bundle git branch to "discovery".

The option `--valint.git-commit` specifies the bundle git commit, with an empty string as the default.

The option `--valint.git-tag` sets the bundle git tag, with an empty string as the default.
-->

## Gitlab Verify
To evaluate policies on Gitlab evidence:
```bash
platforms verify gitlab --organization.mapping "my-org::my-product::1.0" --project.mapping "my-project::my-product::1.0"
```

<!--
{
    "command": "platforms verify gitlab --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
Autofix arguments ['/home/mikey/scribe/platforms_lib/.tox/docs/bin/platforms', 'verify', 'gitlab', '--help']
usage: platforms [options] verify [options] gitlab [-h]
                                                   [--instance INSTANCE]
                                                   [--token TOKEN]
                                                   [--url URL]
                                                   [--types {organization,project,all}]
                                                   [--scope.organization [ORGANIZATION ...]]
                                                   [--scope.project [PROJECT ...]]
                                                   [--scope.branch [BRANCH ...]]
                                                   [--scope.tag [TAG ...]]
                                                   [--commit.skip]
                                                   [--organization.single]
                                                   [--project.single]
                                                   [--organization.mapping [MAPPING ...]]
                                                   [--project.mapping [MAPPING ...]]
                                                   [--project.policy [POLICY ...]]
                                                   [--organization.policy [POLICY ...]]
                                                   [--org-policy-skip-aggregate]
                                                   [--project-policy-skip-aggregate]

options:
  -h, --help            Show this help message and exit.
  --instance INSTANCE   Gitlab instance string (default: )
  --token TOKEN         Gitlab token (required, default: )
  --url URL             Gitlab base URL (default:
                        https://gitlab.com/)
  --types {organization,project,all}
                        Defines which evidence to create, scoped by
                        scope parameters (default: all)
  --scope.organization [ORGANIZATION ...]
                        Gitlab organization list (default: null)
  --scope.project [PROJECT ...]
                        Gitlab projects epositories wildcards.
                        Default is all projects. Note that a project
                        name includes as a prefix its namesapce in
                        the format 'namespace / project_name'
                        (default: ['*'])
  --scope.branch [BRANCH ...]
                        Gitlab branches wildcards (default: null)
  --scope.tag [TAG ...]
                        Gitlab tags wildcards (default: null)
  --commit.skip         Skip commits in evidence (default: False)
  --organization.single
                        Export all organizations in a single
                        evidence (default: False)
  --project.single      Export all projects in a single evidence
                        (default: False)
  --organization.mapping [MAPPING ...]
                        Organization product key mapping in the
                        format of
                        asset::product_key::product_version (type:
                        AssetMappingString, default: [])
  --project.mapping [MAPPING ...]
                        Project product key mapping in the format of
                        asset::product_key::product_version (type:
                        AssetMappingString, default: [])
  --project.policy [POLICY ...]
                        Set project policy file (type: str, default:
                        ['ct-2@discovery', 'ct-9@discovery'])
  --organization.policy [POLICY ...]
                        Set organization policy file (type: str,
                        default: ['ct-1@discovery',
                        'ct-3@discovery', 'ct-4@discovery'])
  --org-policy-skip-aggregate
                        Skip Aggregate organization policy results
                        (default: False)
  --project-policy-skip-aggregate
                        Skip Aggregate project policy results
                        (default: False)
```
<!-- { "object-type": "command-output-end" } -->



## DockerHub Verify
To evaluate policies on DockerHub evidence.

<!--
{
    "command": "platforms verify dockerhub --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
Autofix arguments ['/home/mikey/scribe/platforms_lib/.tox/docs/bin/platforms', 'verify', 'dockerhub', '--help']
usage: platforms [options] verify [options] dockerhub
       [-h] [--instance INSTANCE] [--username USERNAME]
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
  --url URL             Dockerhub base URL (default:
                        https://hub.docker.com)
  --types {token,repository,namespace,all}
                        Defines which evidence to create, scoped by
                        scope parameters (default: all)
  --default_product_key_strategy {namespace,repository,tag,mapping}
                        Override product key with namespace,
                        repository or image names (default: mapping)
  --default_product_version_strategy {tag,short_image_id,image_id}
                        Override product version with tag or image
                        id (default: short_image_id)
  --scope.namespace [NAMESPACE ...]
                        Dockerhub namespaces (default: ['*'])
  --scope.repository [REPOSITORY ...]
                        Dockerhub repositories (default: ['*'])
  --scope.repository_tags [REPOSITORY_TAGS ...]
                        Dockerhub tags (default: ['*'])
  --exclude.repository [REPOSITORY ...]
                        Dockerhub repository wildcards to exclude
                        (default: [])
  --exclude.repository_tags [REPOSITORY_TAGS ...]
                        Dockerhub tags to exclude (default: [])
  --image.mapping [MAPPING ...]
                        Image product key mapping in the format of
                        asset::product_key::product_version (type:
                        AssetMappingString, default: [])
  --image.policy [POLICY ...]
                        Set image mapping policy file (type: str,
                        default: ['ct-8@discovery',
                        'ct-11@discovery', 'ct-12@discovery',
                        'ct-13@discovery'])
  --policy-skip-aggregate
                        Skip Aggregate policy results (default:
                        False)
```
<!-- { "object-type": "command-output-end" } -->

<!--
#### DockerHub Verify Options
The option `--instance` specifies a unique DockerHub instance string, with an empty string as the default.

The option `--types` defines which evidence to create, scoped by scope parameters, with "namespace-images" as the default. Other options are `token`, `repository`, `namespace`, and `all`. These options run verification on the respective evidence types.

The option `--default_product_key_strategy` sets the strategy for overriding product keys, with "mapping" as the default, to use the user-provided mappings.

The option `--default_product_version_strategy` sets the strategy for overriding product versions, with "short_image_id" as the default. This options is ignored when the `--default_product_key_strategy` is set to `mapping`.

The option `--scope.namespace` allows for specifying DockerHub namespaces to include, with a default wildcard ["*"].

The option `--scope.repository` sets the DockerHub repositories to include, with a default wildcard ["*"].

The option `--scope.repository_tags` specifies the DockerHub tags to include, with a default of ["*"].

The option `--exclude.repository` provides for specifying DockerHub repository wildcards to exclude.

The option `--exclude.repository_tags` allows for specifying DockerHub tags to exclude.

The option `--image.mapping` defines the mapping for DockerHub image names to product key and version.

The option `--image.policy` sets the image mapping policy file, defaulting to "ct-13@discovery".
-->
## K8s Verify

<!--
{
    "command": "platforms verify k8s --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
Autofix arguments ['/home/mikey/scribe/platforms_lib/.tox/docs/bin/platforms', 'verify', 'k8s', '--help']
usage: platforms [options] verify [options] k8s [-h]
                                                [--instance INSTANCE]
                                                [--url URL]
                                                [--token TOKEN]
                                                [--types {namespace,pod,cluster-images,all}]
                                                [--default_product_key_strategy {namespace,pod,image,mapping}]
                                                [--default_product_version_strategy {namespace_hash,pod_hash,image_id}]
                                                [--scope.namespace [NAMESPACE ...]]
                                                [--scope.pod [POD ...]]
                                                [--scope.image [IMAGE ...]]
                                                [--ignore-state]
                                                [--exclude.namespace [NAMESPACE ...]]
                                                [--exclude.pod [POD ...]]
                                                [--exclude.image [IMAGE ...]]
                                                [--namespace.single]
                                                [--pod.single]
                                                [--image.mapping [MAPPING ...]]
                                                [--cluster-images.policy [POLICY ...]]
                                                [--namespace.policy [POLICY ...]]
                                                [--policy-skip-aggregate]

options:
  -h, --help            Show this help message and exit.
  --instance INSTANCE   Kubernetes instance string (default: )
  --url URL             Kubernetes API URL (required, default: )
  --token TOKEN         Kubernetes token, with access to pods and
                        secrets (required, default: )
  --types {namespace,pod,cluster-images,all}
                        Defines which evidence to create, scoped by
                        scope parameters (default: cluster-images)
  --default_product_key_strategy {namespace,pod,image,mapping}
                        Override product key with namespace, pod or
                        image names (default: mapping)
  --default_product_version_strategy {namespace_hash,pod_hash,image_id}
                        Override product version with namespace, pod
                        or image names (default: namespace_hash)
  --scope.namespace [NAMESPACE ...]
                        Kubernetes namespaces wildcard list
                        (default: ['*'])
  --scope.pod [POD ...]
                        Kubernetes pods wildcard list (default:
                        ['*'])
  --scope.image [IMAGE ...]
                        Kubernetes images wildcard list (default:
                        ['*'])
  --ignore-state        Filter out containers that are not running
                        (default: False)
  --exclude.namespace [NAMESPACE ...]
                        Namespaces to exclude from discovery process
                        (default: [])
  --exclude.pod [POD ...]
                        Pods to exclude from discovery process
                        (default: [])
  --exclude.image [IMAGE ...]
                        Images to exclude from discovery process
                        (default: [])
  --namespace.single    Export all namespaces (default: False)
  --pod.single          Export all pods in a single evidence
                        (default: False)
  --image.mapping [MAPPING ...]
                        K8s namespace;pod;image to
                        product_key:product_version mappinge.g. my-
                        namespace;my-pod;my-
                        image:product_key:product_version (type:
                        K8sImageMappingString, default: [])
  --cluster-images.policy [POLICY ...]
                        Set image policy file (type: str, default:
                        ['ct-8@discovery', 'ct-11@discovery',
                        'ct-12@discovery', 'ct-13@discovery'])
  --namespace.policy [POLICY ...]
                        Set Kubernetes policy file (type: str,
                        default: [])
  --policy-skip-aggregate
                        Skip Aggregate policy results (default:
                        False)
```
<!-- { "object-type": "command-output-end" } -->

<!--
#### K8s Verify Options

The option `--instance` specifies a unique Kubernetes instance string, with an empty string as the default.

The option `--types` defines which evidence to create, scoped by scope parameters, with "cluster-images" as the default. Other options are `namespace`, `pod` and `all`. These options run verification on the respective evidence types.

The option `--default_product_key_strategy` sets the strategy for overriding product keys, with "mapping" as the default.

The option `--default_product_version_strategy` sets the strategy for overriding product versions, with "namespace_hash" as the default. This options is ignored when the `--default_product_key_strategy` is set to `mapping`.

The option `--scope.namespace` allows for specifying Kubernetes namespaces to include, with a default wildcard ["*"].

The option `--scope.pod` sets the Kubernetes pods to include, with a default wildcard ["*"].

The option `--scope.secrets.skip` enables skipping collection of secrets information in the evidence.

The option `--namespace.many` enables exporting all namespaces.

The option `--pod.many` enables exporting all pods.

The option `--image.mapping` defines the mapping for Kubernetes namespace, pod, and image to product key and version.

The option `--cluster-images.policy` sets the image policy file, defaulting to "image-policy-unsigned@discovery".
-->



## Jfrog Verify
To evaluate policies on Jfrog evidence.

<!--
{
    "command": "platforms verify jfrog --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
Autofix arguments ['/home/mikey/scribe/platforms_lib/.tox/docs/bin/platforms', 'verify', 'jfrog', '--help']
usage: platforms [options] verify [options] jfrog [-h]
                                                  [--instance INSTANCE]
                                                  [--token TOKEN]
                                                  [--url URL]
                                                  [--types {token,repository,jf-repository,all}]
                                                  [--default_product_key_strategy {jf-repository,repository,tag,mapping}]
                                                  [--default_product_version_strategy {tag,short_image_id,image_id}]
                                                  [--scope.jf-repository [JF_REPOSITORY ...]]
                                                  [--scope.repository [REPOSITORY ...]]
                                                  [--scope.repository_tags [REPOSITORY_TAGS ...]]
                                                  [--exclude.jf-repository [JF_REPOSITORY ...]]
                                                  [--exclude.repository [REPOSITORY ...]]
                                                  [--exclude.repository_tags [REPOSITORY_TAGS ...]]
                                                  [--image.mapping [MAPPING ...]]
                                                  [--image.policy [POLICY ...]]
                                                  [--policy-skip-aggregate]

options:
  -h, --help            Show this help message and exit.
  --instance INSTANCE   Jfrog instance string (default: )
  --token TOKEN         Jfrog token (default: null)
  --url URL             Jfrog base URL (default: null)
  --types {token,repository,jf-repository,all}
                        Defines which evidence to create, scoped by
                        scope parameters (default: all)
  --default_product_key_strategy {jf-repository,repository,tag,mapping}
                        Override product key with jf-repository,
                        repository or image names (default: mapping)
  --default_product_version_strategy {tag,short_image_id,image_id}
                        Override product version with tag or image
                        id (default: short_image_id)
  --scope.jf-repository [JF_REPOSITORY ...]
                        Jfrog repositories (default: ['*'])
  --scope.repository [REPOSITORY ...]
                        Jfrog Image repositories (default: ['*'])
  --scope.repository_tags [REPOSITORY_TAGS ...]
                        Jfrog Image tags (default: ['*'])
  --exclude.jf-repository [JF_REPOSITORY ...]
                        Jfrog repository wildcards to exclude
                        (default: [])
  --exclude.repository [REPOSITORY ...]
                        Jfrog Image repository wildcards to exclude
                        (default: [])
  --exclude.repository_tags [REPOSITORY_TAGS ...]
                        Jfrog tags to exclude (default: [])
  --image.mapping [MAPPING ...]
                        Image product key mapping in the format of
                        asset::product_key::product_version (type:
                        AssetMappingString, default: [])
  --image.policy [POLICY ...]
                        Set image mapping policy file (type: str,
                        default: ['ct-8@discovery',
                        'ct-11@discovery', 'ct-12@discovery',
                        'ct-13@discovery'])
  --policy-skip-aggregate
                        Skip Aggregate policy results (default:
                        False)
```
<!-- { "object-type": "command-output-end" } -->
