---
sidebar_label: "SBOM Generation"
title: "Platforms BOM command"
sidebar_position: 5
---

# The BOM Command
The BOM command is used to generate SBOMs of assets. Currently, we support generating SBOMs of DockerHub images and K8s clusters.
This command enables users to generate SBOMs on scale.

## Common Options
<!--
{
    "command": "platforms bom --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] bom [-h] [--allow-failures] [--save-scan-plan] [--dry-run] [--monitor.mount MOUNT]
                               [--monitor.threshold THRESHOLD] [--monitor.clean-docker] [--max-threads MAX_THREADS]
                               [--valint.scribe.client-id CLIENT_ID] [--valint.scribe.client-secret CLIENT_SECRET]
                               [--valint.scribe.enable] [--valint.cache.disable] [--valint.context-type CONTEXT_TYPE]
                               [--valint.log-level LOG_LEVEL] [--valint.output-directory OUTPUT_DIRECTORY] [--valint.bin BIN]
                               [--valint.product-key PRODUCT_KEY] [--valint.product-version PRODUCT_VERSION]
                               [--valint.predicate-type PREDICATE_TYPE] [--valint.attest ATTEST] [--valint.sign]
                               [--valint.components COMPONENTS] [--valint.label LABEL] [--unique]
                               {gitlab,k8s,dockerhub,github,jfrog,ecr,bitbucket} ...

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
  --max-threads MAX_THREADS
                        Number of threads used to run valint (type: int, default: 2)
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
  --valint.sign         sign evidence (default: False)
  --valint.components COMPONENTS
                        components list (type: str, default: )
  --valint.label LABEL  Set additional labels (type: <function <lambda> at 0x7f2934ecf420>, default: [])
  --unique              Allow unique assets (default: False)

subcommands:
  For more details of each subcommand, add it as an argument followed by --help.

  Available subcommands:
    gitlab
    k8s
    dockerhub
    github
    jfrog
    ecr
    bitbucket
```
<!-- { "object-type": "command-output-end" } -->

<!--
The option `--allow-failures` enables allowing failures without returning an error code.

The option -`-db.local.path` sets the local database path, with a default specified by default_db_path.

The option `--save-scan-plan` enables saving the scan plan to a JSON file.

The option `--dry-run` enables a dry run without actual execution of `valint` (used for debugging purposes).

The option `--valint.scribe.client-id` specifies the Scribe client ID, with an empty string as the default. The `valint` tool will use the environment variable `SCRIBE_CLIENT_ID` if it exists.

The option `--valint.scribe.client-secret` sets the Scribe client secret, also defaulting to an empty string.  The `valint` tool will use the environment variable `SCRIBE_CLIENT_SECRET` if it exists.

The option `--valint.scribe.enable` enables the Scribe client, with an empty string as default indicating it's disabled by default.

The option `--valint.cache.disable` allows to skip local valint cache and use scribe store only. The default value is `false`, can also be set via `VALINT_DISABLE_EVIDENCE_CACHE` environment variable. using this option without `--valint.scribe.enable` will result in an error.

The option `--valint.context-type` sets the Valint context type, with the default potentially sourced from the VALINT_CONTEXT_TYPE environment variable.

The option `--valint.log-level` specifies the log level for Valint, defaulting to an empty string.

The option `--valint.output-directory` sets the directory for local evidence caching, with a default defined by default_valint_output_directory.

The option `--valint.bin` specifies the path to the Valint CLI binary, defaulting to a path under the user's home directory.

The option `--valint.product-key` sets the evidence product key, with an empty string as the default.

The option `--valint.product-version` specifies the version of the evidence product, defaulting to an empty string.

The option `--valint.predicate-type` sets the evidence predicate type, with an empty string as the default.

The option `--valint.attest` specifies the type of evidence signing method, defaulting to "x509-env".

The option `--valint.disable-evidence-cache` disables the caching of evidence, enhancing privacy or security concerns.

The option `--valint.sign enables the signing` of evidence to verify its integrity and source.

The option `--monitor.mount` sets the monitor disk usage mount path, with a default possibly sourced from the MONITOR_MOUNT environment variable.

The option `--monitor.threshold` sets the monitor disk usage threshold, with a default of 90.

The option `--monitor.clean-docker` enables automatic cleaning of the docker cache when disk usage exceeds the threshold.
-->
## DockerHub BOM
To generate SBOMs of DockerHub images:
```bash
platforms bom dockerhub --image.mapping "my-namespace/my-image:my-tag::my-product::1.0"
```

Note that the image characterization string is a wildcarded string, some useful valid examples are:
* `*:latest` - all images with the latest tag.
* `my-namespace/*:latest` - all images in the my-namespace with the latest tag.
* `*postgres*` - all images with the word "postgres" in the name.

<!--
{
    "command": "platforms bom dockerhub --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] bom [options] dockerhub [-h] [--instance INSTANCE]
                                                   [--default_product_key_strategy {namespace,repository,tag,mapping}]
                                                   [--default_product_version_strategy {tag,short_image_id,image_id}]
                                                   [--scope.repository [REPOSITORY ...]]
                                                   [--scope.repository_tags [REPOSITORY_TAGS ...]]
                                                   [--scope.image_platform [IMAGE_PLATFORM ...]]
                                                   [--exclude.repository [REPOSITORY ...]]
                                                   [--exclude.repository_tags [REPOSITORY_TAGS ...]]
                                                   [--scope.namespace [NAMESPACE ...]] [--image.mapping [MAPPING ...]]

options:
  -h, --help            Show this help message and exit.
  --instance INSTANCE   Dockerhub instance string (default: )
  --default_product_key_strategy {namespace,repository,tag,mapping}
                        Override product key with namespace, repository or image names (default: mapping)
  --default_product_version_strategy {tag,short_image_id,image_id}
                        Override product version with tag or image id (default: short_image_id)
  --scope.repository [REPOSITORY ...]
                        Dockerhub repositories (default: ['*'])
  --scope.repository_tags [REPOSITORY_TAGS ...]
                        Dockerhub tags (default: ['*'])
  --scope.image_platform [IMAGE_PLATFORM ...]
                        Dockerhub Image platform (default: ['*'])
  --exclude.repository [REPOSITORY ...]
                        Dockerhub repository wildcards to exclude (default: [])
  --exclude.repository_tags [REPOSITORY_TAGS ...]
                        Dockerhub tags to exclude (default: [])
  --scope.namespace [NAMESPACE ...]
                        Dockerhub namespaces (default: ['*'])
  --image.mapping [MAPPING ...]
                        Image product key mapping in the format of asset::product_key::product_version (type:
                        AssetMappingString, default: [])
```
<!-- { "object-type": "command-output-end" } -->

<!--
#### DockerHub BOM Options

The option `--instance` specifies a unique DockerHub instance string, with an empty string as the default.

The option `--default_product_key_strategy` sets the strategy for overriding product keys with "mapping" as the default for using the user-provided mappings. Other options are:
* `namespace` - to use the namespace as the product key.
* `pod` - to use the image name as the product key.
* `tag` - to use the tag as the product key.

The option `--default_product_version_strategy` sets the strategy for overriding product versions. This option is ignored when specifying the `--default_produc_key_strategy` as `mapping`.

The option `--scope.namespace` allows for specifying DockerHub namespaces to include, with a default wildcard ["*"] for all namespaces.

The option `--scope.repository` sets the DockerHub repositories to include, using wildcards with a default of ["*"] for all repositories.

The option `--exclude.repository` provides for specifying DockerHub repository wildcards to exclude from the discovery process.

The option `--scope.repository_tags` specifies the DockerHub tags to include, with a default of ["*"] for all tags.

The option `--exclude.repository_tags` allows for specifying DockerHub tags to exclude from the discovery process.

The option `--image.mapping` defines the mapping for DockerHub image names to product key and version, accommodating wildcards.
-->
## K8s BOM
To generate SBOMs of K8s images:
```bash
platforms bom k8s --image.mapping "my-namespace::my-pod::my-image::my-product::1.0"
```

Note that the image characterization string is a wildcarded string, with separate sections for namespace, pod, and image. Some useful valid examples are:
* `*::*::*:latest` - all cluster images with the latest tag.
* `prod*::*::my-image-prefix*` - all images in the prod* namespace with the my-image-prefix as the prefix of their name.
* `prod*::*::*:latest` - all images in the prod* namespace with the latest tag.

<!--
{
    "command": "platforms bom k8s --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] bom [options] k8s [-h] [--instance INSTANCE] [--types {namespace,pod,all}]
                                             [--default_product_key_strategy {namespace,pod,image,mapping}]
                                             [--default_product_version_strategy {namespace_hash,pod_hash,image_id}]
                                             [--scope.namespace [NAMESPACE ...]] [--scope.pod [POD ...]]
                                             [--scope.image [IMAGE ...]] [--ignore-state]
                                             [--exclude.namespace [NAMESPACE ...]] [--exclude.pod [POD ...]]
                                             [--exclude.image [IMAGE ...]] [--image.mapping [MAPPING ...]]

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
  --ignore-state        Filter out containers that are not running (default: False)
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
<!-- { "object-type": "command-output-end" } -->

<!--
#### K8s BOM Options
The option `--instance` specifies a unique Kubernetes instance string, with an empty string as the default.

The option `--default_product_key_strategy` sets the strategy for overriding product keys, with "mapping" as the default to use the user-provided mappings. Other options are:


The option `--default_product_version_strategy` sets the strategy for overriding product versions. This option is ignored when specifying the `-`-default_produc_key_strategy` as `mapping`. 

The option `--scope.namespace` allows for specifying Kubernetes namespaces to include, with a default wildcard ["*"] for all namespaces.

The option `--scope.pod` sets the Kubernetes pods to include, using wildcards with a default of ["*"] for all pods.

The option `--scope.image` specifies the Kubernetes images to include, with a default of ["*"] for all images.

The option `--exclude.namespace` provides for specifying namespaces to exclude from the discovery process.

The option `--exclude.pod` allows for specifying pods to be excluded from the discovery process.

The option `--exclude.image` specifies images to exclude from the discovery process.

The option `--image.mapping` defines the mapping for Kubernetes namespace, pod, and image to product key and version.
-->

## Jfrog BOM
To generate SBOMs of Jfrog images:
```bash
platforms bom jfrog --image.mapping "my_jfrog_registry/my-image:my-tag::my-product::1.0"
```

Note that the image characterization string is a wildcarded string, some useful valid examples are:
* `*:latest` - all images with the latest tag.
* `my_jfrog_registry/*:latest` - all images in the `my_jfrog_registry` with the latest tag.
* `*postgres*` - all images with the word "postgres" in the name.

<!--
{
    "command": "platforms bom jfrog --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] bom [options] jfrog [-h] [--instance INSTANCE]
                                               [--default_product_key_strategy {jf-repository,repository,tag,mapping}]
                                               [--default_product_version_strategy {tag,short_image_id,image_id}]
                                               [--scope.jf-repository [JF_REPOSITORY ...]]
                                               [--scope.repository [REPOSITORY ...]]
                                               [--scope.repository_tags [REPOSITORY_TAGS ...]]
                                               [--scope.image_platform [IMAGE_PLATFORM ...]]
                                               [--exclude.jf-repository [JF_REPOSITORY ...]]
                                               [--exclude.repository [REPOSITORY ...]]
                                               [--exclude.repository_tags [REPOSITORY_TAGS ...]]
                                               [--image.mapping [MAPPING ...]]

options:
  -h, --help            Show this help message and exit.
  --instance INSTANCE   Jfrog instance string (default: )
  --default_product_key_strategy {jf-repository,repository,tag,mapping}
                        Override product key with jf-repository, repository or image names (default: mapping)
  --default_product_version_strategy {tag,short_image_id,image_id}
                        Override product version with tag or image id (default: short_image_id)
  --scope.jf-repository [JF_REPOSITORY ...]
                        Jfrog repositories (default: ['*'])
  --scope.repository [REPOSITORY ...]
                        Jfrog Image repositories (default: ['*'])
  --scope.repository_tags [REPOSITORY_TAGS ...]
                        Jfrog Image tags (default: ['*'])
  --scope.image_platform [IMAGE_PLATFORM ...]
                        Jfrog Image platform (default: ['*'])
  --exclude.jf-repository [JF_REPOSITORY ...]
                        Jfrog repository wildcards to exclude (default: [])
  --exclude.repository [REPOSITORY ...]
                        Jfrog Image repository wildcards to exclude (default: [])
  --exclude.repository_tags [REPOSITORY_TAGS ...]
                        Jfrog tags to exclude (default: [])
  --image.mapping [MAPPING ...]
                        Image product key mapping in the format of asset::product_key::product_version (type:
                        AssetMappingString, default: [])
```
<!-- { "object-type": "command-output-end" } -->



## ECR BOM
To generate SBOMs of ECR images:
```bash
platforms bom ecr --image.mapping "*.dkr.ecr.*.amazonaws.com/my-image*::my-product::1.0"
```

<!--
{
    "command": "platforms bom ecr --help"

}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] bom [options] ecr [-h] [--instance INSTANCE]
                                             [--default_product_key_strategy {aws-account,repository,tag,mapping}]
                                             [--scope.aws-account [AWS_ACCOUNT ...]] [--scope.repository [REPOSITORY ...]]
                                             [--scope.repository_tags [REPOSITORY_TAGS ...]]
                                             [--scope.image_platform [IMAGE_PLATFORM ...]]
                                             [--exclude.aws-account [AWS_ACCOUNT ...]] [--exclude.repository [REPOSITORY ...]]
                                             [--exclude.repository_tags [REPOSITORY_TAGS ...]] [--url URL]
                                             [--image.mapping [MAPPING ...]]

options:
  -h, --help            Show this help message and exit.
  --instance INSTANCE   ECR instance string (default: )
  --default_product_key_strategy {aws-account,repository,tag,mapping}
                        Override product key with aws-account, repository or image names (default: mapping)
  --scope.aws-account [AWS_ACCOUNT ...]
                        ECR repositories (default: ['*'])
  --scope.repository [REPOSITORY ...]
                        ECR Image repositories (default: ['*'])
  --scope.repository_tags [REPOSITORY_TAGS ...]
                        ECR Image tags (default: ['*'])
  --scope.image_platform [IMAGE_PLATFORM ...]
                        ECR Image platform (default: ['*'])
  --exclude.aws-account [AWS_ACCOUNT ...]
                        ECR repository wildcards to exclude (default: [])
  --exclude.repository [REPOSITORY ...]
                        ECR Image repository wildcards to exclude (default: [])
  --exclude.repository_tags [REPOSITORY_TAGS ...]
                        ECR tags to exclude (default: [])
  --url URL             ECR base URL (default: null)
  --image.mapping [MAPPING ...]
                        Image product key mapping in the format of asset::product_key::product_version (type:
                        AssetMappingString, default: [])
```
<!-- { "object-type": "command-output-end" } -->


## BitBucket BOM
To generate SBOMs of Jfrog images:
```bash
platforms bom bitbucket --repository.mapping "my_repository::my-product::1.0"
```

Note that the image characterization string is a wildcarded string, some useful valid examples are:
* `my_repository` - specific repository 
* `*test*` - all repositories with the word "test" in the name.

<!--
{
    "command": "platforms bom bitbucket --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] bom [options] bitbucket [-h] [--instance INSTANCE] [--app_password APP_PASSWORD]
                                                   [--username USERNAME] [--workspace_token WORKSPACE_TOKEN]
                                                   [--workspace WORKSPACE] [--url URL] [--types {repository,all}]
                                                   [--scope.workspace [WORKSPACE ...]] [--scope.project [PROJECT ...]]
                                                   [--scope.repository [REPOSITORY ...]] [--scope.commit [COMMIT ...]]
                                                   [--scope.branch [BRANCH ...]] [--scope.webhook [WEBHOOK ...]]
                                                   [--commit.skip] [--default_product_key_strategy {mapping}]
                                                   [--workspace.mapping [MAPPING ...]] [--project.mapping [MAPPING ...]]
                                                   [--repository.mapping [MAPPING ...]]

options:
  -h, --help            Show this help message and exit.
  --instance INSTANCE   BitBucket instance string (default: )
  --app_password APP_PASSWORD
                        BitBucket app_password (BB_PASSWORD) (default: )
  --username USERNAME   BitBucket username (default: null)
  --workspace_token WORKSPACE_TOKEN
                        BitBucket workspace_token can be used with --workspace_name flag instead of --app_password and
                        --username (BB_WORKSPACE_TOKEN) (default: )
  --workspace WORKSPACE
                        BitBucket workspace_name can be used with --workspace_token flag instead of --app_password and
                        --username (default: )
  --url URL             BitBucket URL (required, default: https://api.bitbucket.org)
  --types {repository,all}
                        Specifies the type of evidence to generate, scoped by scope parameters (default: repository)
  --scope.workspace [WORKSPACE ...]
                        BitBucket workspace list (default: ['*'])
  --scope.project [PROJECT ...]
                        BitBucket projects wildcards. Default is all projects. Note that a project name includes as a prefix
                        its namesapce in the format 'namespace / project_name' (default: ['*'])
  --scope.repository [REPOSITORY ...]
                        BitBucket repositories wildcards. Default is all projects. Note that a project name includes as a
                        prefix its namesapce in the format 'namespace / project_name' (default: ['*'])
  --scope.commit [COMMIT ...]
                        BitBucket commit wildcards (default: [])
  --scope.branch [BRANCH ...]
                        BitBucket branches wildcards (default: [])
  --scope.webhook [WEBHOOK ...]
                        BitBucket webhook wildcards (default: [])
  --commit.skip         Skip commits in discovery/evidence (default: False)
  --default_product_key_strategy {mapping}
                        Determint product key by mapping. In the future - we shall support by reopsitory name too. (default:
                        mapping)
  --workspace.mapping [MAPPING ...]
                        Workspace product key mapping in the format of workspace::product_key::product_version where org is
                        the workspace name, wildcards are supported (type: AssetMappingString, default: [])
  --project.mapping [MAPPING ...]
                        Project product key mapping in the format of project::product_key::product_version where org is the
                        project name, wildcards are supported (type: AssetMappingString, default: [])
  --repository.mapping [MAPPING ...]
                        Repository product key mapping in the format of repo::product_key::product_version where repo is the
                        repository name, wildcards are supported (type: AssetMappingString, default: [])
```
<!-- { "object-type": "command-output-end" } -->


## Github BOM
To generate SBOMs of Github images:
```bash
platforms bom github --repository.mapping "my_repository::my-product::1.0"
```

Note that the image characterization string is a wildcarded string, some useful valid examples are:
* `my_repository` - specific repository 
* `*test*` - all repositories with the word "test" in the name.

<!--
{
    "command": "platforms bom github --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] bom [options] github [-h] [--instance INSTANCE] [--token TOKEN] [--url URL]
                                                [--types {repository,all}] [--scope.organization [ORGANIZATION ...]]
                                                [--scope.repository [REPOSITORY ...]] [--scope.branch [BRANCH ...]]
                                                [--scope.tag [TAG ...]] [--branch.shallow] [--commit.skip]
                                                [--default_product_key_strategy {mapping}] [--organization.single]
                                                [--repository.single] [--organization.mapping [MAPPING ...]]
                                                [--repository.mapping [MAPPING ...]]

options:
  -h, --help            Show this help message and exit.
  --instance INSTANCE   Github instance string (default: )
  --token TOKEN         Github token (GITHUB_TOKEN, GH_TOKEN) (default: )
  --url URL             Github base URL (default: https://github.com)
  --types {repository,all}
                        Specifies the type of evidence to generate, scoped by scope parameters (default: repository)
  --scope.organization [ORGANIZATION ...]
                        Github organization list (default: ['*'])
  --scope.repository [REPOSITORY ...]
                        Github repositories wildcards. Default is all projects. Note that a project name includes as a prefix
                        its namesapce in the format 'namespace / project_name' (default: ['*'])
  --scope.branch [BRANCH ...]
                        Github branches wildcards (default: [])
  --scope.tag [TAG ...]
                        Github tags wildcards (default: [])
  --branch.shallow      Shallow branch discovery (default: False)
  --commit.skip         Skip commits in discovery/evidence (default: False)
  --default_product_key_strategy {mapping}
                        Determint product key by mapping. In the future - we shall support by reopsitory name too. (default:
                        mapping)
  --organization.single
                        Export all organizations in a single evidence (default: False)
  --repository.single   Export all repos in a single evidence (default: False)
  --organization.mapping [MAPPING ...]
                        Organization product key mapping in the format of org::product_key::product_version where org is the
                        organization name, wildcards are supported (type: AssetMappingString, default: [])
  --repository.mapping [MAPPING ...]
                        Repository product key mapping in the format of repo::product_key::product_version where repo is the
                        repository name, wildcards are supported (type: AssetMappingString, default: [])
```
<!-- { "object-type": "command-output-end" } -->


## Gitlab BOM
To generate SBOMs of Jfrog images:
```bash
platforms bom gitlab --project.mapping"my_project::my-product::1.0"
```

Note that the image characterization string is a wildcarded string, some useful valid examples are:
* `my_project` - specific project.
* `*test*` - all repositories with the word "test" in the name.

<!--
{
    "command": "platforms bom gitlab --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] bom [options] gitlab [-h] [--instance INSTANCE] [--token TOKEN] [--url URL] [--types {project,all}]
                                                [--scope.organization [ORGANIZATION ...]] [--scope.project [PROJECT ...]]
                                                [--scope.branch [BRANCH ...]] [--scope.tag [TAG ...]] [--commit.skip]
                                                [--pipeline.skip] [--default_product_key_strategy {mapping}]
                                                [--organization.mapping [MAPPING ...]] [--project.mapping [MAPPING ...]]

options:
  -h, --help            Show this help message and exit.
  --instance INSTANCE   Gitlab instance string (default: )
  --token TOKEN         Gitlab token (GITLAB_TOKEN, CI_JOB_TOKEN) (default: )
  --url URL             Gitlab base URL (default: https://gitlab.com/)
  --types {project,all}
                        Specifies the type of evidence to generate, scoped by scope parameters (default: all)
  --scope.organization [ORGANIZATION ...]
                        Gitlab organization list (default: ['*'])
  --scope.project [PROJECT ...]
                        Gitlab projects epositories wildcards. Default is all projects. Note that a project name includes as a
                        prefix its namesapce in the format 'namespace / project_name' (default: ['*'])
  --scope.branch [BRANCH ...]
                        Gitlab branches wildcards (default: null)
  --scope.tag [TAG ...]
                        Gitlab tags wildcards (default: null)
  --commit.skip         Skip commits in evidence (default: False)
  --pipeline.skip       Skip pipeline in evidence (default: False)
  --default_product_key_strategy {mapping}
                        Override product key with namespace, pod or image names (default: mapping)
  --organization.mapping [MAPPING ...]
                        Organization product key mapping in the format of to organization::product_key::product_version (type:
                        AssetMappingString, default: [])
  --project.mapping [MAPPING ...]
                        Project product key mapping in the format of asset::product_key::product_version (type:
                        AssetMappingString, default: [])
```
<!-- { "object-type": "command-output-end" } -->
