---
sidebar_label: "Uploading Discovery Evidence"
title: "Platforms Evidence command"
sidebar_position: 4
---


# The Evidence Command
This command is used for uploading evidence, based on the assets discovered in the previous step, to the attestation store.
This command is for creating platform evidence; creating SBOMs of assets such as DockerHub images is done through the `bom` command.

The evidence command uses Scribe's `valint` tool to upload the evidence and to sign it if necessary. Documentation of the `valint` tool can be found [here](https://scribe-security.netlify.app/docs/introducing-scribe/what-is-scribe/).


## Common Options
<!--
{
    "command": "platforms evidence --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
Autofix arguments ['/home/mikey/scribe/platforms_lib/.tox/docs/bin/platforms', 'evidence', '--help']
usage: platforms [options] evidence [-h] [--evidence.local.path PATH] [--evidence.local.prefix PREFIX] [--evidence.local_only]
                                    [--valint.scribe.client-id CLIENT_ID] [--valint.scribe.client-secret CLIENT_SECRET]
                                    [--valint.scribe.enable] [--valint.cache.disable] [--valint.context-type CONTEXT_TYPE]
                                    [--valint.log-level LOG_LEVEL] [--valint.output-directory OUTPUT_DIRECTORY]
                                    [--valint.bin BIN] [--valint.product-key PRODUCT_KEY]
                                    [--valint.product-version PRODUCT_VERSION] [--valint.predicate-type PREDICATE_TYPE]
                                    [--valint.attest ATTEST] [--valint.disable-evidence-cache] [--valint.sign]
                                    [--valint.components COMPONENTS]
                                    {gitlab,k8s,dockerhub,github,jfrog} ...

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
  --valint.disable-evidence-cache
                        Disable evidence cache (default: False)
  --valint.sign         sign evidence (default: False)
  --valint.components COMPONENTS
                        components list (type: str, default: )

subcommands:
  For more details of each subcommand, add it as an argument followed by --help.

  Available subcommands:
    gitlab
    k8s
    dockerhub
    github
    jfrog
```
<!-- { "object-type": "command-output-end" } -->

<!--
The option `--db.local.path` sets the path for local report storage, with a default specified by default_db_path.

The option `--evidence.local.path` specifies the directory path for exporting local copies of the evidence, defaulting to "output".

The option `--evidence.local.prefix` allows for a prefix to be added to the exported local report filenames, with an empty string as the default.

The option `--evidence.local_only` enables the exclusive export of local evidence, without uploading them to any attestation store.

Following are options that configure Scribe's `valint` tool:

The option `--valint.scribe.client-id` sets the Scribe client ID, with an empty string as the default. The `valint` tool will use the environment variable `SCRIBE_CLIENT_ID` if it exists.

The option `--valint.scribe.client-secret` specifies the Scribe client secret, also defaulting to an empty string. The `valint` tool will use the environment variable `SCRIBE_CLIENT_SECRET` if it exists.

The option `--valint.scribe.enable` allows for enabling the `valint` to upload the evidence to ScribeHub, with an empty string as default indicating it's disabled by default.

The option `--valint.cache.disable` allows to skip local valint cache and use scribe store only. The default value is `false`, can also be set via `VALINT_DISABLE_EVIDENCE_CACHE` environment variable. using this option without `--valint.scribe.enable` will result in an error.

The option `--valint.context-type` sets the Valint context type, with the default potentially sourced from the VALINT_CONTEXT_TYPE environment variable.

The option `--valint.log-level` specifies the log level for Valint, defaulting to an empty string.

The option `--valint.output-directory` sets the directory for local evidence caching, with a default defined by default_valint_output_directory. These evidence files include the wrappers and signatures as applied by the `valint` tool, while the ones stored in `--evidence.local.path` are raw evidence files.

The option `--valint.bin specifies` the path to the Valint CLI binary, defaulting to a path under the user's home directory.

The option `--valint.product-key` sets the evidence product key, with "factory" as the default.

The option `--valint.product-version` specifies the version of the evidence product, defaulting to an empty string.

The option `--valint.predicate-type` sets the evidence predicate type, with a default URL specifying the evidence version.

The option `--valint.attest` specifies the type of evidence signing mechanism to use, defaulting to "x509-env".

The option `--valint.disable-evidence-cache` disables the caching of evidence, enhancing privacy or security concerns.

The option `--valint.sign` enables the signing of evidence to verify its integrity and source.
-->
## Gitlab Evidence
Gitlab evidence supports the generation of organization evidence and project evidence. 

To generate evidence for a Gitlab account:
```bash
platforms evidence gitlab --organization.mapping "my-org::my-product::1.0" --project.mapping "my-project::my-product::1.0"
```

<!--
{
    "command": "platforms evidence gitlab --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
Autofix arguments ['/home/mikey/scribe/platforms_lib/.tox/docs/bin/platforms', 'evidence', 'gitlab', '--help']
usage: platforms [options] evidence [options] gitlab [-h] [--instance INSTANCE] [--token TOKEN] [--url URL]
                                                     [--types {organization,project,all}]
                                                     [--scope.organization [ORGANIZATION ...]] [--scope.project [PROJECT ...]]
                                                     [--scope.branch [BRANCH ...]] [--scope.tag [TAG ...]] [--commit.skip]
                                                     [--pipeline.skip] [--default_product_key_strategy {mapping}]
                                                     [--organization.single] [--project.single]
                                                     [--organization.mapping [MAPPING ...]] [--project.mapping [MAPPING ...]]

options:
  -h, --help            Show this help message and exit.
  --instance INSTANCE   Gitlab instance string (default: )
  --token TOKEN         Gitlab token (required, default: )
  --url URL             Gitlab base URL (default: https://gitlab.com/)
  --types {organization,project,all}
                        Defines which evidence to create, scoped by scope parameters (default: all)
  --scope.organization [ORGANIZATION ...]
                        Gitlab organization list (default: null)
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
  --organization.single
                        Export all organizations in a single evidence (default: False)
  --project.single      Export all projects in a single evidence (default: False)
  --organization.mapping [MAPPING ...]
                        Organization product key mapping in the format of asset::product_key::product_version (type:
                        AssetMappingString, default: [])
  --project.mapping [MAPPING ...]
                        Project product key mapping in the format of asset::product_key::product_version (type:
                        AssetMappingString, default: [])
```
<!-- { "object-type": "command-output-end" } -->

<!--
>
#### Gitlab Evidence Options
The option `--types` defines which types of evidence to create, allowing choices among "all", "organization", or "project", with "all" as the default.

The option `--instance` specifies a unique GitLab instance string, with an empty string as the default.

The option `--scope.organization` allows for specifying a list of GitLab organizations to include in evidence collection, with a default of None implying all organizations.

The option `--scope.project` sets the GitLab projects or repositories to include, using wildcards with a default of ["*"] for all projects.

The option `--scope.branch` specifies the GitLab branch wildcards to include in evidence collection, with ["*"] as the default for all branches.

The option `--organization.many` enables exporting separate organization evidence for each organization, set to false by default to true.

The option `--project.many` enables exporting separate evidence for each project, set by default to true.

The option `--commit.skip` enables skipping the inclusion of commits in the project evidence.

The option `--pipeline.skip` allows for omitting pipeline information from the evidence.

The option `--default_product_key_strategy` sets the strategy for overriding product keys with "mapping" as the default and currently, the only option.

The option `--organization.mapping` specifies the mappings of organization assets to product keys and versions, expecting a format of "wildcarded-organization::product_key::product_version".

The option `--project.mapping defines the mappings for project assets to product keys and versions, also in the format of "wildcareded-project::product_key::product_version".
-->
## DockerHub evidence
DockerHub evidence generation supports the generation of namespace and repository evidence. The evidence includes information about the repositories, tags, and access tokens.

To generate evidence for a DockerHub account:
```bash
platforms evidence dockerhub --namespace.mapping "my-namespace::my-product::1.0" --repository.mapping "my-repo::my-product::1.0"
```
<!--
{
    "command": "platforms evidence dockerhub --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
Autofix arguments ['/home/mikey/scribe/platforms_lib/.tox/docs/bin/platforms', 'evidence', 'dockerhub', '--help']
usage: platforms [options] evidence [options] dockerhub [-h] [--instance INSTANCE] [--types {token,repository,namespace,all}]
                                                        [--scope.namespace [NAMESPACE ...]]
                                                        [--scope.repository [REPOSITORY ...]]
                                                        [--scope.repository_tags [REPOSITORY_TAGS ...]]
                                                        [--exclude.repository [REPOSITORY ...]]
                                                        [--exclude.repository_tags [REPOSITORY_TAGS ...]]
                                                        [--namespace.mapping [MAPPING ...]]
                                                        [--repository.mapping [MAPPING ...]] [--token.mapping [MAPPING ...]]
                                                        [--namespace.single] [--repository.single]
                                                        [--default_product_key_strategy {mapping}]

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
  --namespace.single    Export all namespaces in a single evidence (default: False)
  --repository.single   Export all repositories in a single evidence (default: False)
  --default_product_key_strategy {mapping}
                        Override product key with namespace, repository or image names (default: mapping)
```
<!-- { "object-type": "command-output-end" } -->

<!--
#### DockerHub Evidence Options
The option `--instance` specifies a unique DockerHub instance string, with an empty string as the default.

The option `--types` defines the scope of evidence creation with options "all", "token", "repository", or "namespace", defaulting to "all".

The option `--scope.namespace` allows for specifying DockerHub namespaces to include, with a default wildcard ["*"] for all namespaces.

The option `--scope.repository` sets the DockerHub repositories to include, using wildcards with a default of ["*"] for all repositories.

The option `--scope.repository_tags` specifies the DockerHub tags to include, with a default of ["*"] for all tags.

The option `--exclude.repository provides` for specifying DockerHub repository wildcards to exclude from evidence.

The option `--exclude.repository_tags` allows for specifying DockerHub tags to exclude from the evidence collection.

The option `--namespace.many` enables the export of separate evidence for each namespace, defaulting to true.

The option `--repository.many` controls the export of separate evidence for each repository, defaulting to true.

The option `--default_product_key_strategy` sets the strategy for overriding product keys with "mapping" as the default and only option.

The option `--repository.mapping` specifies the mapping of repository assets to product keys and versions, expecting a format of "asset::product_key::product_version".

The option `--token.mapping` defines the mapping for repository tags to product keys and versions, also in the format of "asset::product_key::product_version".
-->
## K8s Evidence
K8s evidence generation supports the generation of namespace and pod evidence. Namespace evidence includes secrets metadata (if it was not scoped out)
To generate evidence for a K8s cluster:
```bash
platforms evidence k8s --namespace.mapping "my-namespace::my-product::1.0" --pod.mapping "my-pod::my-product::1.0"
```

<!--
{
    "command": "platforms evidence k8s --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
Autofix arguments ['/home/mikey/scribe/platforms_lib/.tox/docs/bin/platforms', 'evidence', 'k8s', '--help']
usage: platforms [options] evidence [options] k8s [-h] [--instance INSTANCE] [--types {namespace,pod,all}]
                                                  [--scope.namespace [NAMESPACE ...]] [--scope.pod [POD ...]]
                                                  [--scope.image [IMAGE ...]] [--ignore-state]
                                                  [--exclude.namespace [NAMESPACE ...]] [--exclude.pod [POD ...]]
                                                  [--exclude.image [IMAGE ...]]
                                                  [--default_product_key_strategy {namespace,pod,image,mapping}]
                                                  [--secret.skip] [--namespace.single] [--pod.single]
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
  --ignore-state        Filter out containers that are not running (default: False)
  --exclude.namespace [NAMESPACE ...]
                        Namespaces to exclude from discovery process (default: [])
  --exclude.pod [POD ...]
                        Pods to exclude from discovery process (default: [])
  --exclude.image [IMAGE ...]
                        Images to exclude from discovery process (default: [])
  --default_product_key_strategy {namespace,pod,image,mapping}
                        Override product key with namespace, pod or image names (default: mapping)
  --secret.skip         Skip secrets information in the evidence (default: False)
  --namespace.single    Export all namespaces (default: False)
  --pod.single          Export all pods in a single evidence (default: False)
  --namespace.mapping [MAPPING ...]
                        Namespace product key mapping in the format of asset::product_key::product_version (type:
                        AssetMappingString, default: [])
  --pod.mapping [MAPPING ...]
                        Pod product key mapping in the format of asset::product_key::product_version (type:
                        AssetMappingString, default: [])
```
<!-- { "object-type": "command-output-end" } -->

<!--
#### K8s Evidence Options
```markdown
- The option `--instance` specifies a unique Kubernetes instance string, with an empty string as the default.

The option `--types` defines the scope of evidence creation with options "all", "namespace", or "pod", defaulting to "all".

The option `--scope.namespace` allows for specifying Kubernetes namespaces to include, with a default wildcard ["*"] for all namespaces.

The option `--scope.pod` sets the Kubernetes pods to include, using wildcards with a default of ["*"] for all pods.

The option `--scope.image` specifies the Kubernetes images to include, with a default of ["*"] for all images.

The option `--scope.secrets.skip` enables skipping the inclusion of secrets information in the evidence.

The option `--namespace.many` enables the export of a separate evidence for each namespace.

The option `--pod.many` allows for the export of a separate evidence for each pod.

The option `--exclude.namespace` provides for specifying namespaces to exclude from the discovery process.

The option `--exclude.pod` allows for specifying pods to exclude from the discovery process.

The option `--exclude.image` specifies images to exclude from the discovery process.

The option `--default_product_key_strategy` sets the strategy for overriding product keys with "mapping" as the default and currently the only option. This is noted to require improvement for more choices.

The option `--namespace.mapping` specifies the mapping of namespace assets to product keys and versions, expecting a format of "asset::product_key::product_version".

The option `--pod.mapping` defines the mapping for pod assets to product keys and versions, also in the format of "asset::product_key::product_version".
```
-->
