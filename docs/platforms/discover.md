---
sidebar_label: "Platform Discovery"
title: "Platforms Discover command"
sidebar_position: 3
---

# The Discover Command

The `discover` command is used to sample asset data from various sources. The data is stored in an internal database, which can then be used by the evidence generation and policy evaluation commands. To run the `discover` command, you need to provide access data to the resources and scoping information. Access data typically includes providing a `url` and credentials such as a `token` or `username` and `password`.

Once executed, the command generates evidence related to the discovered assets. This evidence can either be uploaded to an attestation store or exported locally. The discover command supports various platforms, including DockerHub, GitHub, GitLab, and others.

The evidence generation process uses Scribe's `valint` tool to upload and optionally sign the evidence. Documentation for the `valint` tool can be found [here](https://scribe-security.netlify.app/docs/introducing-scribe/what-is-scribe/).

> **Notice:** The `discover` command creates a local database that supports other platform commands such as `evidence`, `verify`, and `bom`. This database must be accessible when running these commands. Multiple databases can be created for different purposes—for instance, using one database for generating fresh evidence during a build process and another for conducting a comprehensive asset discovery across the organization. By default, the database is named `platforms.db` and is stored in the working directory, but the filename can be customized using CLI flags.

## Common Options
<!--
{
    "command": "platforms discover --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] discover [-h] [--check-token-permissions] [--db.local.store_policy {update,replace}] [--db.update_period UPDATE_PERIOD] [--evidence.local.path PATH]
                                    [--evidence.local.prefix PREFIX] [--evidence.local_only] [--max-threads MAX_THREADS] [--thread-timeout THREAD_TIMEOUT]
                                    [--rate-limit-retry RATE_LIMIT_RETRY] [--allow-failures] [--export-partial] [--skip-evidence] [--valint.scribe.client-secret CLIENT_SECRET]
                                    [--valint.cache.disable] [--valint.context-type CONTEXT_TYPE] [--valint.log-level LOG_LEVEL] [--valint.output-directory OUTPUT_DIRECTORY]
                                    [--valint.bin BIN] [--valint.product-key PRODUCT_KEY] [--valint.product-version PRODUCT_VERSION] [--valint.predicate-type PREDICATE_TYPE]
                                    [--valint.attest ATTEST] [--valint.sign] [--valint.components COMPONENTS] [--valint.label LABEL] [--unique]
                                    {gitlab,dockerhub,k8s,github,jfrog,ecr,jenkins,bitbucket,azure} ...

Discover assets and save data to a local store

options:
  -h, --help            Show this help message and exit.
  --check-token-permissions
                        Check token permissions (default: False)
  --db.local.store_policy {update,replace}
                        Policy for local data collection: update or replace (default: update)
  --db.update_period UPDATE_PERIOD
                        Update period in days. 0 for force update (type: int, default: 0)
  --evidence.local.path PATH
                        Local report export directory path (type: str, default: output)
  --evidence.local.prefix PREFIX
                        Local report export prefix (type: str, default: )
  --evidence.local_only
                        Only export local evidence (default: False)
  --max-threads MAX_THREADS
                        Main Pool max threads used to parallelize evidence collection (type: int, default: 2000)
  --thread-timeout THREAD_TIMEOUT
                        Thread timeout in seconds (type: float, default: 20.0)
  --rate-limit-retry RATE_LIMIT_RETRY
                        Retry on rate limit (default disabled) (type: int, default: 0)
  --allow-failures      Allow failures without returning an error code (default: False)
  --export-partial      Upload Partial Discover evidence (default: False)
  --skip-evidence       Skip evidence upload (default: False)
  --valint.scribe.client-secret CLIENT_SECRET, --scribe-token CLIENT_SECRET, --scribe-client-secret CLIENT_SECRET
                        Scribe client Secret (type: str, default: )
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
                        Evidence predicate type (type: str, default: )
  --valint.attest ATTEST
                        Evidence attest type (type: str, default: x509-env)
  --valint.sign         sign evidence (default: False)
  --valint.components COMPONENTS
                        components list (type: str, default: )
  --valint.label LABEL  Set additional labels (type: <function <lambda> at 0x77386aaf9bc0>, default: [])
  --unique              Allow unique assets (default: False)

subcommands:
  For more details of each subcommand, add it as an argument followed by --help.

  Available subcommands:
    gitlab
    dockerhub
    k8s
    github
    jfrog
    ecr
    jenkins
    bitbucket
    azure
```
<!-- { "object-type": "command-output-end" } -->


---

## Gitlab Discovery

GitLab discovery samples the following assets: organizations, projects, users, tokens, and pipelines. Evidence is generated for organizations and projects, including details about these assets.

### Access

Access to GitLab is provided using the `--url` and `--token` flags.  
You can use the environment variables `GITLAB_URL` and `GITLAB_TOKEN` respectively.

Required permissions for asset collection:

* **Project Maintainer role**
* **Selected scopes**: `read_api`, `read_repository`

### Example

To generate evidence for a GitLab account:

```bash
platforms discover gitlab \
  --url https://gitlab.com/api/v \
  --token YOUR_GITLAB_TOKEN \
  --organization.mapping "my-org::my-product::1.0" \
  --project.mapping "my-project::my-product::1.0"
```

### Usage
<!--
{
    "command": "platforms discover gitlab --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] discover [options] gitlab [-h] [--instance.instance INSTANCE]
                                                     [--types {organization,project,authenticated_user,member,token,variable,branch,user,commit,pipeline,job,rule,all} [{organization,project,authenticated_user,member,token,variable,branch,user,commit,pipeline,job,rule,all} ...]]
                                                     [--exclude.types {organization,project,authenticated_user,member,token,variable,branch,user,commit,pipeline,job,rule} [{organization,project,authenticated_user,member,token,variable,branch,user,commit,pipeline,job,rule} ...]]
                                                     [--token TOKEN] [--url URL] [--scope.organization [ORGANIZATION ...]] [--scope.project [PROJECT ...]]
                                                     [--scope.branch [BRANCH ...]] [--scope.tag [TAG ...]] [--commit.skip] [--pipeline.skip]
                                                     [--default_product_key_strategy {mapping}] [--scope.skip_org_members] [--scope.skip_project_members]
                                                     [--scope.commit.past_days PAST_DAYS] [--scope.pipeline.past_days PAST_DAYS] [--scope.pipeline.analyzed_logs]
                                                     [--scope.pipeline.reports] [--broad] [--organization.mapping [MAPPING ...]] [--project.mapping [MAPPING ...]]
                                                     [--organization.single] [--project.single] [--skip-cache] [--cache-ttl CACHE_TTL] [--cache-group CACHE_GROUP]

options:
  -h, --help            Show this help message and exit.
  --instance.instance INSTANCE
                        Gitlab instance string (default: )
  --types {organization,project,authenticated_user,member,token,variable,branch,user,commit,pipeline,job,rule,all} [{organization,project,authenticated_user,member,token,variable,branch,user,commit,pipeline,job,rule,all} ...]
                        Defines which asset to discover, scoped by scope parameters (default: [])
  --exclude.types {organization,project,authenticated_user,member,token,variable,branch,user,commit,pipeline,job,rule} [{organization,project,authenticated_user,member,token,variable,branch,user,commit,pipeline,job,rule} ...]
                        Defines which asset types to exclude for discovery. (default: [])
  --token TOKEN         Gitlab token (GITLAB_TOKEN, CI_JOB_TOKEN) (default: )
  --url URL             Gitlab base URL (default: https://gitlab.com/)
  --scope.organization [ORGANIZATION ...]
                        Gitlab organization list (default: ['*'])
  --scope.project [PROJECT ...]
                        Gitlab projects epositories wildcards. Default is all projects. Note that a project name includes as a prefix its namesapce in the format 'namespace /
                        project_name' (default: ['*'])
  --scope.branch [BRANCH ...]
                        Gitlab branches wildcards (default: null)
  --scope.tag [TAG ...]
                        Gitlab tags wildcards (default: null)
  --commit.skip         Skip commits in evidence (default: False)
  --pipeline.skip       Skip pipeline (default: False)
  --default_product_key_strategy {mapping}
                        Override product key with namespace, pod or image names (default: mapping)
  --scope.skip_org_members
                        Skip organization members discovery (default: False)
  --scope.skip_project_members
                        Skip project members discovery (default: False)
  --scope.commit.past_days PAST_DAYS
                        Number of past days to include in the report (type: int, default: 28)
  --scope.pipeline.past_days PAST_DAYS
                        Number of past days to include in the report (type: int, default: 30)
  --scope.pipeline.analyzed_logs
                        Include analyzed pipeline logs (default: False)
  --scope.pipeline.reports
                        Include gitlab standard reports (default: False)
  --broad               Retrieves limited information (only organizations and projects) (default: False)
  --organization.mapping [MAPPING ...]
                        Organization product key mapping in the format of to organization::product_key::product_version (type: AssetMappingString, default: [])
  --project.mapping [MAPPING ...]
                        Project product key mapping in the format of asset::product_key::product_version (type: AssetMappingString, default: [])
  --organization.single
                        Export all organizations in a single evidence (default: False)
  --project.single      Export all projects in a single evidence (default: False)
  --skip-cache, -f      Skip Scribe Evidence cache lookup (default: False)
  --cache-ttl CACHE_TTL
                        time to live for cache (default: 2d)
  --cache-group CACHE_GROUP
                        Scribe cache group, default to runners pipeline ID, empty to use global context (default: by_pipeline)
```
<!-- { "object-type": "command-output-end" } -->


---

## Github Discovery

GitHub discovery samples the following assets: organizations, repositories, users, tokens, and workflows. Evidence generation supports the creation of organization and repository evidence.

### Access

Access to GitHub is provided using the `--url` and `--token` flags.  
You can use the environment variables `GITHUB_URL` and `GITHUB_TOKEN` respectively.

Required permissions for asset collection:

* Fine-grained personal access tokens with the following permissions:
  * **List Org, users**: No permission required
  * **"Members" organization permissions**: Read
  * **"Secrets" organization permissions**: Read
  * **"Variables" organization permissions**: Read
  * **"Metadata" repository permissions**: Read
  * **"Contents" repository permissions**: Read
  * **"Secrets" repository permissions**: Read
  * **"Actions" repository permissions**: Read
  * **"Pull requests" repository permissions**: Read
  * **"Administration" repository permissions**: Read (for Runner and Read branch protection rules)

### Example

To generate evidence for a GitHub account:

```bash
platforms discover github \
  --url https://api.github.com \
  --token YOUR_GITHUB_TOKEN \
  --organization.mapping "my-org::my-product::1.0" \
  --repository.mapping "my-repository::my-product::1.0"
```

### Usage
<!--
{
    "command": "platforms discover github --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] discover [options] github [-h] [--instance.instance INSTANCE]
                                                     [--types {organization,repository,branch,commit,workflow,run,member,authenticated_user,collaborator,secret,variable,all} [{organization,repository,branch,commit,workflow,run,member,authenticated_user,collaborator,secret,variable,all} ...]]
                                                     [--exclude.types {organization,repository,branch,commit,workflow,run,member,authenticated_user,collaborator,secret,variable} [{organization,repository,branch,commit,workflow,run,member,authenticated_user,collaborator,secret,variable} ...]]
                                                     [--token TOKEN] [--url URL] [--scope.organization [ORGANIZATION ...]] [--scope.repository [REPOSITORY ...]]
                                                     [--scope.branch [BRANCH ...]] [--scope.tag [TAG ...]] [--branch.shallow] [--commit.skip]
                                                     [--default_product_key_strategy {mapping}] [--scope.commit.past_days PAST_DAYS] [--workflow.skip]
                                                     [--scope.workflow.past_days PAST_DAYS] [--scope.workflow.analyzed_logs] [--scope.runners] [--scope.sbom] [--broad]
                                                     [--hook-config [HOOK_CONFIG ...]] [--hook [HOOK ...]] [--hook.skip] [--repository.hooks [HOOKS ...]]
                                                     [--organization.mapping [MAPPING ...]] [--repository.mapping [MAPPING ...]] [--skip-cache] [--cache-ttl CACHE_TTL]
                                                     [--cache-group CACHE_GROUP]

options:
  -h, --help            Show this help message and exit.
  --instance.instance INSTANCE
                        Github instance string (default: )
  --types {organization,repository,branch,commit,workflow,run,member,authenticated_user,collaborator,secret,variable,all} [{organization,repository,branch,commit,workflow,run,member,authenticated_user,collaborator,secret,variable,all} ...]
                        Defines which asset to discover, scoped by scope parameters (default: [])
  --exclude.types {organization,repository,branch,commit,workflow,run,member,authenticated_user,collaborator,secret,variable} [{organization,repository,branch,commit,workflow,run,member,authenticated_user,collaborator,secret,variable} ...]
                        Defines which asset types to exclude for discovery. (default: [])
  --token TOKEN         Github token (GITHUB_TOKEN, GH_TOKEN) (default: )
  --url URL             Github base URL (default: https://github.com)
  --scope.organization [ORGANIZATION ...]
                        Github organization list (default: ['*'])
  --scope.repository [REPOSITORY ...]
                        Github repositories wildcards. Default is all projects. Note that a project name includes as a prefix its namesapce in the format 'namespace / project_name'
                        (default: ['*'])
  --scope.branch [BRANCH ...]
                        Github branches wildcards (default: [])
  --scope.tag [TAG ...]
                        Github tags wildcards (default: [])
  --branch.shallow      Shallow branch discovery (default: False)
  --commit.skip         Skip commits in discovery/evidence (default: False)
  --default_product_key_strategy {mapping}
                        Deferment product key by mapping. In the future - we shall support by reopsitory name too. (default: mapping)
  --scope.commit.past_days PAST_DAYS
                        Number of past days to include in the report (type: int, default: 30)
  --workflow.skip       Skip workflows in evidence (default: False)
  --scope.workflow.past_days PAST_DAYS
                        Number of past days to include in the report (type: int, default: 30)
  --scope.workflow.analyzed_logs
                        Include analyzed workflow logs (default: False)
  --scope.runners       Include repository allocated runners in evidence (default: False)
  --scope.sbom          Include repositories SBOM in evidence (default: False)
  --broad               Retrieves limited information (only organizations, repositories and workflows) (default: False)
  --hook-config [HOOK_CONFIG ...]
                        Paths to YAML files containing custom hook definitions. (type: str, default: [])
  --hook [HOOK ...]     Specify hook IDs to execute. Available preconfigured hooks are: ggshield, ggshield. (default: [])
  --hook.skip           Skip hooks (default: False)
  --repository.hooks [HOOKS ...]
                        Inline hook format <run>::<tool/id>::<parser>::<name> (type: ToolHookString, default: [])
  --organization.mapping [MAPPING ...]
                        Organization product key mapping in the format of org::product_key::product_version where org is the organization name, wildcards are supported (type:
                        AssetMappingString, default: [])
  --repository.mapping [MAPPING ...]
                        Repository product key mapping in the format of repo::product_key::product_version where repo is the repository name, wildcards are supported (type:
                        AssetMappingString, default: [])
  --skip-cache, -f      Skip Scribe Evidence cache lookup (default: False)
  --cache-ttl CACHE_TTL
                        time to live for cache (default: 2d)
  --cache-group CACHE_GROUP
                        Scribe cache group, default to runners pipeline ID, empty to use global context (default: by_pipeline)
```
<!-- { "object-type": "command-output-end" } -->


---

## DockerHub Discovery

DockerHub discovery samples the following assets: namespaces, repositories, and repository tags. Evidence generation includes namespace and repository evidence, which includes information about repositories, tags, and access tokens.

### Access

Access to DockerHub is provided using the `--url`, `--username`, and either `--password` or `--token` flags.  
You can use the environment variables `DOCKERHUB_URL`, `DOCKERHUB_USERNAME`, and `DOCKERHUB_PASSWORD` respectively.

Required permission for asset collection:

* **User and password organization owner**

### Example

To generate evidence for a DockerHub account:

```bash
platforms discover dockerhub \
  --url https://hub.docker.com/v2/ \
  --username YOUR_DOCKERHUB_USERNAME \
  --password YOUR_DOCKERHUB_PASSWORD \
  --namespace.mapping "my-namespace::my-product::1.0" \
  --repository.mapping "my-repo::my-product::1.0"
```

### Usage
<!--
{
    "command": "platforms discover dockerhub --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] discover [options] dockerhub [-h] [--instance.instance INSTANCE]
                                                        [--types {instance,namespace,repository,repository_tag,webhook,token,all} [{instance,namespace,repository,repository_tag,webhook,token,all} ...]]
                                                        [--exclude.types {instance,namespace,repository,repository_tag,webhook,token} [{instance,namespace,repository,repository_tag,webhook,token} ...]]
                                                        [--username USERNAME] [--password PASSWORD] [--token TOKEN] [--url URL] [--scope.repository [REPOSITORY ...]]
                                                        [--scope.repository_tags [REPOSITORY_TAGS ...]] [--scope.image_platform [IMAGE_PLATFORM ...]]
                                                        [--exclude.repository [REPOSITORY ...]] [--exclude.repository_tags [REPOSITORY_TAGS ...]]
                                                        [--namespace-list [NAMESPACE_LIST ...]] [--scope.past_days PAST_DAYS] [--broad] [--namespace.single] [--repository.single]
                                                        [--namespace.mapping [MAPPING ...]] [--repository.mapping [MAPPING ...]] [--instance.mapping [MAPPING ...]]
                                                        [--default_product_key_strategy {mapping,mapping,mapping,mapping}] [--hook-config [HOOK_CONFIG ...]] [--hook [HOOK ...]]
                                                        [--hook.skip] [--namespace.hook [HOOK ...]]

options:
  -h, --help            Show this help message and exit.
  --instance.instance INSTANCE
                        Dockerhub instance string (default: )
  --types {instance,namespace,repository,repository_tag,webhook,token,all} [{instance,namespace,repository,repository_tag,webhook,token,all} ...]
                        Defines which asset to discover, scoped by scope parameters (default: [])
  --exclude.types {instance,namespace,repository,repository_tag,webhook,token} [{instance,namespace,repository,repository_tag,webhook,token} ...]
                        Defines which asset types to exclude for discovery. (default: [])
  --username USERNAME   Dockerhub username (default: null)
  --password PASSWORD   Dockerhub password (DOCKERHUB_PASSWORD) (default: null)
  --token TOKEN         Dockerhub token (default: null)
  --url URL             Dockerhub base URL (default: https://hub.docker.com)
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
  --namespace-list [NAMESPACE_LIST ...]
                        List of namespaces (default: [])
  --scope.past_days PAST_DAYS
                        Ignore tags pushed earlier that previous to this number of days (type: int, default: 30)
  --broad               Retrieves limited information (only namespaces and repositories) (default: False)
  --namespace.single    Export all namespaces in a single evidence (default: False)
  --repository.single   Export all repositories in a single evidence (default: False)
  --namespace.mapping [MAPPING ...]
                        Repository product key mapping in the format of asset::product_key::product_version (type: AssetMappingString, default: [])
  --repository.mapping [MAPPING ...]
                        Repository product key mapping in the format of asset::product_key::product_version (type: AssetMappingString, default: [])
  --instance.mapping [MAPPING ...]
                        Repository tag product key mapping in the format of asset::product_key::product_version (type: AssetMappingString, default: [])
  --default_product_key_strategy {mapping,mapping,mapping,mapping}
                        Override product key with namespace, repository or image names (default: mapping)
  --hook-config [HOOK_CONFIG ...]
                        Paths to YAML files containing custom hook definitions. (type: str, default: [])
  --hook [HOOK ...]     Specify hook IDs to execute. Available preconfigured hooks are: trivy, scout, grype. (default: [])
  --hook.skip           Skip hooks (default: False)
  --namespace.hook [HOOK ...]
                        Inline hook format <run>::<tool/id>::<parser>::<name> (type: ToolHookString, default: [])
```
<!-- { "object-type": "command-output-end" } -->


---

## K8s Discovery

Kubernetes discovery samples the following asset types: namespaces, pods, and secrets. Pod information includes image details.

K8s evidence generation supports the creation of namespace and pod evidence. Namespace evidence includes secrets metadata (if it was not scoped out).

### Access

Access to Kubernetes is managed via a token. For more details, see [Generate K8s Token](https://scribe-security.netlify.app/docs/platforms/generate_k8s_token.md).

### Example

To generate evidence for a Kubernetes cluster:

```bash
platforms discover k8s \
  --url https://kubernetes.example.com \
  --token YOUR_K8S_TOKEN \
  --namespace.mapping "my-namespace::my-product::1.0" \
  --pod.mapping "my-pod::my-product::1.0"
```

### Usage
<!--
{
    "command": "platforms discover k8s --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] discover [options] k8s [-h] [--instance.instance INSTANCE] [--types {namespace,pod,secret,deployment,all} [{namespace,pod,secret,deployment,all} ...]]
                                                  [--exclude.types {namespace,pod,secret,deployment} [{namespace,pod,secret,deployment} ...]] [--url URL] [--token TOKEN]
                                                  [--scope.namespace [NAMESPACE ...]] [--scope.pod [POD ...]] [--scope.image [IMAGE ...]] [--ignore-state]
                                                  [--exclude.namespace [NAMESPACE ...]] [--exclude.pod [POD ...]] [--exclude.image [IMAGE ...]] [--secret.skip] [--deployment.skip]
                                                  [--broad] [--namespace.single] [--pod.single] [--namespace.mapping [MAPPING ...]] [--pod.mapping [MAPPING ...]]
                                                  [--default_product_key_strategy {namespace,pod,image,mapping}]

options:
  -h, --help            Show this help message and exit.
  --instance.instance INSTANCE
                        Kubernetes instance string (default: )
  --types {namespace,pod,secret,deployment,all} [{namespace,pod,secret,deployment,all} ...]
                        Defines which asset to discover, scoped by scope parameters (default: [])
  --exclude.types {namespace,pod,secret,deployment} [{namespace,pod,secret,deployment} ...]
                        Defines which asset types to exclude for discovery. (default: [])
  --url URL             Kubernetes API URL (required, default: )
  --token TOKEN         Kubernetes token, with access to pods and secrets (K8S_TOKEN) (default: )
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
  --secret.skip         Skip secrets discovery (default: False)
  --deployment.skip     Skip deployments discovery (default: False)
  --broad               Retrieves limited information (only namespaces and deployments) (default: False)
  --namespace.single    Export all namespaces (default: False)
  --pod.single          Export all pods in a single evidence (default: False)
  --namespace.mapping [MAPPING ...]
                        Namespace product key mapping in the format of asset::product_key::product_version (type: AssetMappingString, default: [])
  --pod.mapping [MAPPING ...]
                        Pod product key mapping in the format of asset::product_key::product_version (type: AssetMappingString, default: [])
  --default_product_key_strategy {namespace,pod,image,mapping}
                        Override product key with namespace, pod or image names (default: mapping)
```
<!-- { "object-type": "command-output-end" } -->


---

## Jfrog Discovery

Jfrog discovery samples the following assets: Jfrog repositories, image repositories, and image tags.  
For example, `my_company.jfrog.io/my_registry/my_image:latest`

* `my_company.jfrog.io`: Instance URL
* `my_registry`: A Jfrog Repository that includes a set of Image Repositories.
* `my_image`: An image repository that includes a set of Image Tags.
* `my_image:latest`: An image repository.

Jfrog evidence generation includes namespace and repository evidence, which contains information about repositories, tags, and access tokens.

### Access

Access to JFrog is provided using the `--url` and `--token` flags.  
You can use the environment variables `JFROG_URL` and `JFROG_TOKEN` respectively.

Required permissions for asset collection:

* **Read permission** to the Artifactory registry API
* **Read Admin permission** for scanned repository user list and security permissions

### Example

To generate evidence for a JFrog account:

```bash
platforms discover jfrog \
  --url https://my_company.jfrog.io/artifactory/ \
  --token YOUR_JFROG_TOKEN \
  --jf-repository.mapping "*::my-product::1.0" \
  --namespace.mapping "my-namespace::my-product::1.0" \
  --repository.mapping "*my-repo::my-product::1.0"
```

### Usage
<!--
{
    "command": "platforms discover jfrog --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] discover [options] jfrog [-h] [--instance.instance INSTANCE]
                                                    [--types {jf-repository,repository,repository_tag,user,token,webhook,all} [{jf-repository,repository,repository_tag,user,token,webhook,all} ...]]
                                                    [--exclude.types {jf-repository,repository,repository_tag,user,token,webhook} [{jf-repository,repository,repository_tag,user,token,webhook} ...]]
                                                    [--token TOKEN] [--url URL] [--scope.jf-repository [JF_REPOSITORY ...]] [--scope.repository [REPOSITORY ...]]
                                                    [--scope.repository_tags [REPOSITORY_TAGS ...]] [--scope.image_platform [IMAGE_PLATFORM ...]]
                                                    [--exclude.jf-repository [JF_REPOSITORY ...]] [--exclude.repository [REPOSITORY ...]]
                                                    [--exclude.repository_tags [REPOSITORY_TAGS ...]] [--scope.past_days PAST_DAYS] [--scope.tag_limit TAG_LIMIT] [--broad]
                                                    [--jf-repository.mapping [MAPPING ...]] [--repository.mapping [MAPPING ...]] [--instance.mapping [MAPPING ...]]
                                                    [--jf-repository.single] [--repository.single] [--default_product_key_strategy {mapping,mapping,mapping,mapping}]

options:
  -h, --help            Show this help message and exit.
  --instance.instance INSTANCE
                        Jfrog instance string (default: )
  --types {jf-repository,repository,repository_tag,user,token,webhook,all} [{jf-repository,repository,repository_tag,user,token,webhook,all} ...]
                        Defines which asset to discover, scoped by scope parameters (default: [])
  --exclude.types {jf-repository,repository,repository_tag,user,token,webhook} [{jf-repository,repository,repository_tag,user,token,webhook} ...]
                        Defines which asset types to exclude for discovery. (default: [])
  --token TOKEN         Jfrog token (JFROG_TOKEN) (default: null)
  --url URL             Jfrog base URL (default: )
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
  --scope.past_days PAST_DAYS
                        Ignore tags pushed earlier that previous to this number of days (type: int, default: 30)
  --scope.tag_limit TAG_LIMIT
                        Limit the number of recent tags to be discovered. Scoping to tag names is done on the limited tag list. Limit applies also to the past_days filter. 0 for no
                        limit, default is 10. (type: int, default: 20)
  --broad               Retrieves limited information (only jf-repositories and repositories) (default: False)
  --jf-repository.mapping [MAPPING ...]
                        Repository product key mapping in the format of asset::product_key::product_version (type: AssetMappingString, default: [])
  --repository.mapping [MAPPING ...]
                        Repository image_tags product key mapping in the format of asset::product_key::product_version (type: AssetMappingString, default: [])
  --instance.mapping [MAPPING ...]
                        Repository tag product key mapping in the format of asset::product_key::product_version (type: AssetMappingString, default: [])
  --jf-repository.single
                        Export all jf-repositorys in a single evidence (default: False)
  --repository.single   Export all repositories in a single evidence (default: False)
  --default_product_key_strategy {mapping,mapping,mapping,mapping}
                        Override product key with jf-repository, repository or image names (default: mapping)
```
<!-- { "object-type": "command-output-end" } -->


---

## ECR Discovery

ECR discovery samples the following assets: ECR repositories, image repositories, and image tags.  
For example, `<account>.dkr.ecr.us-west-2.amazonaws.com/my_image:latest`

* `<account>.dkr.ecr.us-west-2.amazonaws.com`: Instance URL
* `my_image`: An image repository that includes a set of image tags.
* `my_image:latest`: An image repository.

ECR evidence generation includes namespace and repository evidence, which contains information about repositories and tags.

### Access

Access to ECR is provided using the `--url` and `--token` flags.  
You can use the environment variables `ECR_URL` and `ECR_LOGIN_TOKEN` respectively.

Required permission for asset collection:

* **Read permission** to the ECR registry API

### Example

To generate evidence for an ECR account:

```bash
platforms discover ecr \
  --url https://aws.amazon.com/ecr/ \
  --token YOUR_ECR_TOKEN \
  --repository.mapping "*my-service*::my-product::1.0"
```

### Usage
<!--
{
    "command": "platforms discover ecr --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] discover [options] ecr [-h] [--instance.instance INSTANCE]
                                                  [--types {aws-account,repository,repository_tags,all} [{aws-account,repository,repository_tags,all} ...]]
                                                  [--exclude.types {aws-account,repository,repository_tags} [{aws-account,repository,repository_tags} ...]] [--token TOKEN]
                                                  [--url URL] [--scope.aws-account [AWS_ACCOUNT ...]] [--scope.repository [REPOSITORY ...]]
                                                  [--scope.repository_tags [REPOSITORY_TAGS ...]] [--scope.image_platform [IMAGE_PLATFORM ...]]
                                                  [--exclude.aws-account [AWS_ACCOUNT ...]] [--exclude.repository [REPOSITORY ...]] [--exclude.repository_tags [REPOSITORY_TAGS ...]]
                                                  [--scope.past_days PAST_DAYS] [--scope.tag_limit TAG_LIMIT] [--broad] [--aws-account.mapping [MAPPING ...]]
                                                  [--repository.mapping [MAPPING ...]] [--aws-account.single] [--repository.single]
                                                  [--default_product_key_strategy {mapping,mapping,mapping,mapping}]

options:
  -h, --help            Show this help message and exit.
  --instance.instance INSTANCE
                        ECR instance string (default: )
  --types {aws-account,repository,repository_tags,all} [{aws-account,repository,repository_tags,all} ...]
                        Defines which asset to discover, scoped by scope parameters (default: [])
  --exclude.types {aws-account,repository,repository_tags} [{aws-account,repository,repository_tags} ...]
                        Defines which asset types to exclude for discovery. (default: [])
  --token TOKEN         ECR token (ECR_LOGIN_TOKEN) (default: )
  --url URL             ECR base URL (default: null)
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
  --scope.past_days PAST_DAYS
                        Ignore tags pushed earlier that previous to this number of days (type: int, default: 30)
  --scope.tag_limit TAG_LIMIT
                        Limit the number of recent tags to be discovered. Scoping to tag names is done on the limited tag list. Limit applies also to the past_days filter. 0 for no
                        limit, default is 10. (type: int, default: 10)
  --broad               Retrieves limited information (only aws-account and repository) (default: False)
  --aws-account.mapping [MAPPING ...]
                        Repository product key mapping in the format of asset::product_key::product_version (type: AssetMappingString, default: [])
  --repository.mapping [MAPPING ...]
                        Repository image_tags product key mapping in the format of asset::product_key::product_version (type: AssetMappingString, default: [])
  --aws-account.single  Export all aws-account in a single evidence (default: False)
  --repository.single   Export all repositories in a single evidence (default: False)
  --default_product_key_strategy {mapping,mapping,mapping,mapping}
                        Override product key with aws-account, repository or image names (default: mapping)
```
<!-- { "object-type": "command-output-end" } -->


---

## BitBucket Discovery

BitBucket discovery samples the following assets: workspaces, projects, repositories, users, branches, commits, protected branches, and webhooks.

BitBucket evidence generation includes workspace and repository evidence.

**Note:** BitBucket supports both Cloud and Data Center deployments.

### Access

Access to Bitbucket is provided using the `--url` and `--app_password` or `workspace_token` flags.  
You can use the environment variables `BB_URL`, `BB_PASSWORD`, or `BB_WORKSPACE_TOKEN` respectively.

Required OAuth 2.0 scopes for asset collection:

* **account**: Read workspace, permissions, and user info
* **project**: Read project info
* **repository**: Read repository, tag, branch, and commit info
* **webhook**: Read webhook info
* **admin**: Read branch protection rules

### Example

To generate evidence for a Bitbucket account:

```bash
platforms discover bitbucket \
  --url https://api.bitbucket.org/2.0/ \
  --app_password YOUR_BITBUCKET_PASSWORD \
  --workspace.mapping "my-workspace::my-product::1.0" \
  --repository.mapping "my-repository::my-product::1.0"
```

### Usage
<!--
{
    "command": "platforms discover bitbucket --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] discover [options] bitbucket [-h] [--instance.instance INSTANCE]
                                                        [--types {workspace,project,repository,branch,commit,authenticated_user,webhooks,repo_permission,user_permission,branch_protection,token,all} [{workspace,project,repository,branch,commit,authenticated_user,webhooks,repo_permission,user_permission,branch_protection,token,all} ...]]
                                                        [--app_password APP_PASSWORD] [--username USERNAME] [--workspace_token WORKSPACE_TOKEN] [--workspace WORKSPACE] [--url URL]
                                                        [--scope.workspace [WORKSPACE ...]] [--scope.project [PROJECT ...]] [--scope.repository [REPOSITORY ...]]
                                                        [--scope.commit [COMMIT ...]] [--scope.branch [BRANCH ...]] [--scope.webhook [WEBHOOK ...]] [--commit.skip] [--broad]
                                                        [--workspace.mapping [MAPPING ...]] [--project.mapping [MAPPING ...]] [--repository.mapping [MAPPING ...]]
                                                        [--default_product_key_strategy {mapping}] [--workspace.single] [--project.single] [--repository.single] [--skip-cache]
                                                        [--cache-ttl CACHE_TTL] [--cache-group CACHE_GROUP]

options:
  -h, --help            Show this help message and exit.
  --instance.instance INSTANCE
                        BitBucket instance string (default: )
  --types {workspace,project,repository,branch,commit,authenticated_user,webhooks,repo_permission,user_permission,branch_protection,token,all} [{workspace,project,repository,branch,commit,authenticated_user,webhooks,repo_permission,user_permission,branch_protection,token,all} ...]
                        Defines which asset to discover, scoped by scope parameters (default: [])
  --app_password APP_PASSWORD
                        BitBucket app_password (BB_PASSWORD) (default: )
  --username USERNAME   BitBucket username (default: null)
  --workspace_token WORKSPACE_TOKEN
                        BitBucket workspace_token can be used with --workspace_name flag instead of --app_password and --username (BB_WORKSPACE_TOKEN) (default: )
  --workspace WORKSPACE
                        BitBucket workspace_name can be used with --workspace_token flag instead of --app_password and --username (default: )
  --url URL             BitBucket URL (required, default: https://api.bitbucket.org)
  --scope.workspace [WORKSPACE ...]
                        BitBucket workspace list (default: ['*'])
  --scope.project [PROJECT ...]
                        BitBucket projects wildcards. Default is all projects. Note that a project name includes as a prefix its namesapce in the format 'namespace / project_name'
                        (default: ['*'])
  --scope.repository [REPOSITORY ...]
                        BitBucket repositories wildcards. Default is all projects. Note that a project name includes as a prefix its namesapce in the format 'namespace /
                        project_name' (default: ['*'])
  --scope.commit [COMMIT ...]
                        BitBucket commit wildcards (default: [])
  --scope.branch [BRANCH ...]
                        BitBucket branches wildcards (default: [])
  --scope.webhook [WEBHOOK ...]
                        BitBucket webhook wildcards (default: [])
  --commit.skip         Skip commits in discovery/evidence (default: False)
  --broad               Retrieves limited information (only workspaces, repositories) (default: False)
  --workspace.mapping [MAPPING ...]
                        Workspace product key mapping in the format of workspace::product_key::product_version where org is the workspace name, wildcards are supported (type:
                        AssetMappingString, default: [])
  --project.mapping [MAPPING ...]
                        Project product key mapping in the format of project::product_key::product_version where org is the project name, wildcards are supported (type:
                        AssetMappingString, default: [])
  --repository.mapping [MAPPING ...]
                        Repository product key mapping in the format of repo::product_key::product_version where repo is the repository name, wildcards are supported (type:
                        AssetMappingString, default: [])
  --default_product_key_strategy {mapping}
                        Deferment product key by mapping. In the future - we shall support by reopsitory name too. (default: mapping)
  --workspace.single    Export all workspaces in a single evidence (default: False)
  --project.single      Export all projects in a single evidence (default: False)
  --repository.single   Export all repos in a single evidence (default: False)
  --skip-cache, -f      Skip Scribe Evidence cache lookup (default: False)
  --cache-ttl CACHE_TTL
                        time to live for cache (default: 2d)
  --cache-group CACHE_GROUP
                        Scribe cache group, default to runners pipeline ID, empty to use global context (default: by_pipeline)
```
<!-- { "object-type": "command-output-end" } -->


---

## Jenkins Discovery

Jenkins discovery samples the following assets: instances, folders, jobs, job runs, credential stores, users, computer sets, and security settings.

Jenkins evidence generation supports the creation of instance and folder evidence.

### Access

Access to Jenkins is provided using the `--url` and `--password` flags.  
You can use the environment variables `JENKINS_URL` and `JENKINS_PASSWORD` respectively.

Required permissions for asset collection:

* **Read job and folder permissions**
* **List credentials**
* **Read security realm**

### Example

To generate evidence for a Jenkins account:

```bash
platforms discover jenkins \
  --url https://jenkins.example.com \
  --password YOUR_JENKINS_PASSWORD \
  --instance-mapping "my-instance::my-product::1.0" \
  --folder.mapping "my-folder::my-product::1.0"
```

### Usage
<!--
{
    "command": "platforms discover jenkins --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] discover [options] jenkins [-h] [--instance.instance INSTANCE] [--username USERNAME] [--password PASSWORD] [--url URL] [--broad]
                                                      [--types {all,computer_set,users,jobs,job_runs,credential_stores,plugins,security_settings,all} [{all,computer_set,users,jobs,job_runs,credential_stores,plugins,security_settings,all} ...]]
                                                      [--credential_stores.skip] [--users.skip] [--plugins.skip] [--security_settings.skip] [--computer_set.skip] [--jobs.skip]
                                                      [--scope.folder [FOLDER ...]] [--exclude.folder [FOLDER ...]] [--scope.job_runs.past_days PAST_DAYS] [--scope.job_runs.max MAX]
                                                      [--scope.job_runs.analyzed_logs] [--job_runs.skip] [--default_product_key_strategy {mapping}]
                                                      [--instance-mapping [INSTANCE_MAPPING ...]] [--folder.mapping [MAPPING ...]]

options:
  -h, --help            Show this help message and exit.
  --instance.instance INSTANCE
                        Jenkins instance string (default: )
  --username USERNAME   Jenkins username (default: )
  --password PASSWORD   Jenkins token (JENKINS_PASSWORD) (default: )
  --url URL             Jenkins base URL (default: )
  --broad               Perform a fast broad discovery instead of a detailed one (default: False)
  --types {all,computer_set,users,jobs,job_runs,credential_stores,plugins,security_settings,all} [{all,computer_set,users,jobs,job_runs,credential_stores,plugins,security_settings,all} ...]
                        Defines which asset to discover, scoped by scope parameters (default: ['all'])
  --credential_stores.skip
                        Skip credential stores (default: False)
  --users.skip          Skip users (default: False)
  --plugins.skip        Skip plugins (default: False)
  --security_settings.skip
                        Skip security_settings (default: False)
  --computer_set.skip   Skip computer sets in discovery/evidence (default: False)
  --jobs.skip           Skip jobs (default: False)
  --scope.folder [FOLDER ...]
                        Jenkins folder/job list. Default is all folders. The folder scoping is defined as a path of folders and can include the job name in order to scope specific
                        jobs. Wildcard is supported only as a suffix. examples: folder-a* will discover all folders that are included in a root folder that starts with folder-a.
                        folder-a/* will discover all folders and jobs under the root folder folder-a (type: JenkinsFolderScope, default: ['*'])
  --exclude.folder [FOLDER ...]
                        Jenkins folder/job list to exclude from discovery. Format is like the --scope.folder argument (type: JenkinsFolderScope, default: [])
  --scope.job_runs.past_days PAST_DAYS
                        Number of past days to include in the job run discovery, 0 for no time limit (type: int, default: 30)
  --scope.job_runs.max MAX
                        Mam number of job runs to include in the job run discovery. This argument will limit the number of job runs in the past_days range. 0 for no limit (type: int,
                        default: 10)
  --scope.job_runs.analyzed_logs
                        Include analyzed job run logs (default: False)
  --job_runs.skip       Skip commits in discovery/evidence (default: False)
  --default_product_key_strategy {mapping}
                        Deferment product key by mapping. In the future - we shall support by folder name too. (default: mapping)
  --instance-mapping [INSTANCE_MAPPING ...]
                        Instance product key mapping in the format of *::product_key::product_version, wildcards are supported (type: AssetMappingString, default: [])
  --folder.mapping [MAPPING ...]
                        Folder product key mapping in the format of folder_path::product_key::product_version, wildcards are supported (type: AssetMappingString, default: [])
```
<!-- { "object-type": "command-output-end" } -->

