---
sidebar_label: "Uploading Discovery Evidence"
title: "Platforms Evidence command"
sidebar_position: 4
---


# The Evidence Command

> **Note:** The `evidence` command is deprecated. Please use the `discover` command instead.

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
usage: platforms [options] evidence [-h] [--evidence.local.path PATH] [--evidence.local.prefix PREFIX] [--evidence.local_only] [--max-threads MAX_THREADS] [--thread-timeout THREAD_TIMEOUT] [--rate-limit-retry RATE_LIMIT_RETRY] [--allow-failures] [--export-partial] [--skip-evidence] [--valint.scribe.client-secret CLIENT_SECRET]
                                    [--valint.cache.disable] [--valint.context-type CONTEXT_TYPE] [--valint.assume-context ASSUME_CONTEXT] [--valint.payload PAYLOAD] [--valint.log-level LOG_LEVEL] [--valint.arch ARCH] [--valint.input [INPUT ...]] [--valint.output-directory OUTPUT_DIRECTORY] [--valint.bin BIN]
                                    [--valint.product-key PRODUCT_KEY] [--valint.product-version PRODUCT_VERSION] [--valint.predicate-type PREDICATE_TYPE] [--valint.statement STATEMENT] [--valint.source SOURCE] [--valint.attest ATTEST] [--valint.sign] [--valint.components COMPONENTS] [--valint.label LABEL] [--unique]
                                    [--valint.git-commit GIT_COMMIT] [--valint.git-branch GIT_BRANCH] [--valint.git-tag GIT_TAG]
                                    {gitlab,k8s,dockerhub,github,jfrog,ecr,jenkins,bitbucket,azure} ...

Export evidence data (Deprecated)

options:
  -h, --help            Show this help message and exit.
  --evidence.local.path PATH
                        Local report export directory path (type: str, default: output)
  --evidence.local.prefix PREFIX
                        Local report export prefix (type: str, default: )
  --evidence.local_only
                        Only export local evidence (default: False)
  --max-threads MAX_THREADS
                        Main Pool max threads used to parallelize evidence collection (type: int, default: 10)
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
  --valint.assume-context ASSUME_CONTEXT
                        Valint assume context (type: str, default: )
  --valint.payload PAYLOAD
                        Valint payload (type: str, default: )
  --valint.log-level LOG_LEVEL
                        Valint log level (type: str, default: )
  --valint.arch ARCH    Set Image architecture (type: str, default: )
  --valint.input [INPUT ...]
                        Valint extra input targets (default: [])
  --valint.output-directory OUTPUT_DIRECTORY
                        Local evidence cache directory (type: str, default: )
  --valint.bin BIN      Valint CLI binary path (type: str, default: /home/mikey/.scribe/bin/valint)
  --valint.product-key PRODUCT_KEY
                        Evidence product key (type: str, default: factory)
  --valint.product-version PRODUCT_VERSION
                        Evidence product version (type: str, default: )
  --valint.predicate-type PREDICATE_TYPE
                        Evidence predicate type (type: str, default: )
  --valint.statement STATEMENT
                        SLSA Evidence statement type (type: str, default: )
  --valint.source SOURCE
                        SLSA Source target (type: str, default: )
  --valint.attest ATTEST
                        Evidence attest type (type: str, default: x509-env)
  --valint.sign         sign evidence (default: False)
  --valint.components COMPONENTS
                        components list (type: str, default: )
  --valint.label LABEL  Set additional labels (type: <function <lambda> at 0x791559f91bc0>, default: [])
  --unique              Allow unique assets (default: False)
  --valint.git-commit GIT_COMMIT
                        Set Input Target Git commit (type: str, default: )
  --valint.git-branch GIT_BRANCH
                        Set Input Target Git branch (type: str, default: )
  --valint.git-tag GIT_TAG
                        Set Input Target Git tag (type: str, default: )

subcommands:
  For more details of each subcommand, add it as an argument followed by --help.

  Available subcommands:
    gitlab
    k8s
    dockerhub
    github
    jfrog
    ecr
    jenkins
    bitbucket
    azure
```
<!-- { "object-type": "command-output-end" } -->


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
usage: platforms [options] evidence [options] gitlab [-h] [--instance.instance INSTANCE] [--token TOKEN] [--url URL] [--types {organization,project,all}] [--scope.organization [ORGANIZATION ...]] [--scope.project [PROJECT ...]] [--scope.branch [BRANCH ...]] [--scope.tag [TAG ...]] [--commit.skip] [--pipeline.skip]
                                                     [--default_product_key_strategy {mapping}] [--organization.mapping [MAPPING ...]] [--project.mapping [MAPPING ...]] [--organization.single] [--project.single]

options:
  -h, --help            Show this help message and exit.
  --instance.instance INSTANCE
                        Gitlab instance string (default: )
  --token TOKEN         Gitlab token (GITLAB_TOKEN, CI_JOB_TOKEN) (default: )
  --url URL             Gitlab base URL (default: https://gitlab.com/)
  --types {organization,project,all}
                        Defines which evidence to create, scoped by scope parameters (default: all)
  --scope.organization [ORGANIZATION ...]
                        Gitlab organization list (default: ['*'])
  --scope.project [PROJECT ...]
                        Gitlab projects epositories wildcards. Default is all projects. Note that a project name includes as a prefix its namesapce in the format 'namespace / project_name' (default: ['*'])
  --scope.branch [BRANCH ...]
                        Gitlab branches wildcards (default: null)
  --scope.tag [TAG ...]
                        Gitlab tags wildcards (default: null)
  --commit.skip         Skip commits in evidence (default: False)
  --pipeline.skip       Skip pipeline (default: False)
  --default_product_key_strategy {mapping}
                        Override product key with namespace, pod or image names (default: mapping)
  --organization.mapping [MAPPING ...]
                        Organization product key mapping in the format of to organization::product_key::product_version (type: AssetMappingString, default: [])
  --project.mapping [MAPPING ...]
                        Project product key mapping in the format of asset::product_key::product_version (type: AssetMappingString, default: [])
  --organization.single
                        Export all organizations in a single evidence (default: False)
  --project.single      Export all projects in a single evidence (default: False)
```
<!-- { "object-type": "command-output-end" } -->



## Github Evidence
Github evidence supports the generation of organization evidence and repository evidence. 

To generate evidence for a Github account:
```bash
platforms evidence github --organization.mapping "my-org::my-product::1.0" --repository.mapping "my-repository::my-product::1.0"
```

<!--
{
    "command": "platforms evidence github --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] evidence [options] github [-h] [--instance.instance INSTANCE] [--token TOKEN] [--url URL] [--types {organization,repository,all,all}] [--scope.organization [ORGANIZATION ...]] [--scope.repository [REPOSITORY ...]] [--scope.branch [BRANCH ...]] [--scope.tag.name [NAME ...]] [--branch.shallow]
                                                     [--commit.skip] [--tag.only] [--default_product_key_strategy {mapping}] [--organization.mapping [MAPPING ...]] [--repository.mapping [MAPPING ...]] [--organization.single] [--repository.single]

options:
  -h, --help            Show this help message and exit.
  --instance.instance INSTANCE
                        Github instance string (default: )
  --token TOKEN         Github token (GITHUB_TOKEN, GH_TOKEN) (default: )
  --url URL             Github base URL (default: https://github.com)
  --types {organization,repository,all,all}
                        Defines which evidence to create, scoped by scope parameters (default: all)
  --scope.organization [ORGANIZATION ...]
                        Github organization list (default: ['*'])
  --scope.repository [REPOSITORY ...]
                        Github repositories wildcards. Default is all projects. Note that a project name includes as a prefix its namesapce in the format 'namespace / project_name' (default: ['*'])
  --scope.branch [BRANCH ...]
                        Github branches wildcards (default: ['*'])
  --scope.tag.name [NAME ...]
                        Github tags wildcards (default: ['*'])
  --branch.shallow      Shallow branch discovery (default: False)
  --commit.skip         Skip commits in discovery/evidence (default: False)
  --tag.only            Only include tags in the evidence, skip branches (default: False)
  --default_product_key_strategy {mapping}
                        Deferment product key by mapping. In the future - we shall support by reopsitory name too. (default: mapping)
  --organization.mapping [MAPPING ...]
                        Organization product key mapping in the format of org::product_key::product_version where org is the organization name, wildcards are supported (type: AssetMappingString, default: [])
  --repository.mapping [MAPPING ...]
                        Repository product key mapping in the format of repo::product_key::product_version where repo is the repository name, wildcards are supported (type: AssetMappingString, default: [])
  --organization.single
                        Export all organizations in a single evidence (default: False)
  --repository.single   Export all repos in a single evidence (default: False)
```
<!-- { "object-type": "command-output-end" } -->


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
usage: platforms [options] evidence [options] dockerhub [-h] [--instance.instance INSTANCE] [--types {instance,token,repository,namespace,repository_tag,webhook,all}] [--username USERNAME] [--password PASSWORD] [--token TOKEN] [--url URL] [--scope.repository [REPOSITORY ...]] [--scope.repository_tags [REPOSITORY_TAGS ...]]
                                                        [--scope.image_platform [IMAGE_PLATFORM ...]] [--exclude.repository [REPOSITORY ...]] [--exclude.repository_tags [REPOSITORY_TAGS ...]] [--scope.namespace [NAMESPACE ...]] [--namespace.mapping [MAPPING ...]] [--repository.mapping [MAPPING ...]]
                                                        [--instance.mapping [MAPPING ...]] [--namespace.single] [--repository.single] [--default_product_key_strategy {mapping,mapping,mapping,mapping}]

options:
  -h, --help            Show this help message and exit.
  --instance.instance INSTANCE
                        Dockerhub instance string (default: )
  --types {instance,token,repository,namespace,repository_tag,webhook,all}
                        Defines which evidence to create, scoped by scope parameters (default: all)
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
  --scope.namespace [NAMESPACE ...]
                        Dockerhub namespaces (default: ['*'])
  --namespace.mapping [MAPPING ...]
                        Repository product key mapping in the format of asset::product_key::product_version (type: AssetMappingString, default: [])
  --repository.mapping [MAPPING ...]
                        Repository product key mapping in the format of asset::product_key::product_version (type: AssetMappingString, default: [])
  --instance.mapping [MAPPING ...]
                        Repository tag product key mapping in the format of asset::product_key::product_version (type: AssetMappingString, default: [])
  --namespace.single    Export all namespaces in a single evidence (default: False)
  --repository.single   Export all repositories in a single evidence (default: False)
  --default_product_key_strategy {mapping,mapping,mapping,mapping}
                        Override product key with namespace, repository or image names (default: mapping)
```
<!-- { "object-type": "command-output-end" } -->


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
usage: platforms [options] evidence [options] k8s [-h] [--instance.instance INSTANCE] [--types {namespace,pod,all}] [--scope.namespace [NAMESPACE ...]] [--scope.pod [POD ...]] [--scope.image [IMAGE ...]] [--ignore-state] [--exclude.namespace [NAMESPACE ...]] [--exclude.pod [POD ...]] [--exclude.image [IMAGE ...]]
                                                  [--default_product_key_strategy {namespace,pod,image,mapping}] [--secret.skip] [--url URL] [--token TOKEN] [--namespace.single] [--pod.single] [--namespace.mapping [MAPPING ...]] [--pod.mapping [MAPPING ...]]

options:
  -h, --help            Show this help message and exit.
  --instance.instance INSTANCE
                        Kubernetes instance string (default: )
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
  --url URL             Kubernetes API URL (required, default: )
  --token TOKEN         Kubernetes token, with access to pods and secrets (K8S_TOKEN) (default: )
  --namespace.single    Export all namespaces (default: False)
  --pod.single          Export all pods in a single evidence (default: False)
  --namespace.mapping [MAPPING ...]
                        Namespace product key mapping in the format of asset::product_key::product_version (type: AssetMappingString, default: [])
  --pod.mapping [MAPPING ...]
                        Pod product key mapping in the format of asset::product_key::product_version (type: AssetMappingString, default: [])
```
<!-- { "object-type": "command-output-end" } -->



## Jfrog evidence
Jfrog evidence generation supports the generation of namespace and repository evidence. The evidence includes information about the repositories, tags, and access tokens.

To generate evidence for a Jfrog account:

```bash
platforms evidence jfrog --jf-repository.mapping "*::my-product::1.0" --namespace.mapping "my-namespace::my-product::1.0" --repository.mapping "*my-repo::my-product::1.0"
```
<!--
{
    "command": "platforms evidence ecr --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] evidence [options] ecr [-h] [--instance.instance INSTANCE] [--url URL] [--types {instance,aws-account,repository,all}] [--scope.aws-account [AWS_ACCOUNT ...]] [--scope.repository [REPOSITORY ...]] [--scope.repository_tags [REPOSITORY_TAGS ...]] [--scope.image_platform [IMAGE_PLATFORM ...]]
                                                  [--exclude.aws-account [AWS_ACCOUNT ...]] [--exclude.repository [REPOSITORY ...]] [--exclude.repository_tags [REPOSITORY_TAGS ...]] [--aws-account.mapping [MAPPING ...]] [--repository.mapping [MAPPING ...]] [--aws-account.single] [--repository.single]
                                                  [--default_product_key_strategy {instance,aws-account,repository,tag,mapping}]

options:
  -h, --help            Show this help message and exit.
  --instance.instance INSTANCE
                        ECR instance string (default: )
  --url URL             ECR base URL (default: null)
  --types {instance,aws-account,repository,all}
                        Defines which evidence to create, scoped by scope parameters (default: all)
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
  --aws-account.mapping [MAPPING ...]
                        Repository product key mapping in the format of asset::product_key::product_version (type: AssetMappingString, default: [])
  --repository.mapping [MAPPING ...]
                        Repository image_tags product key mapping in the format of asset::product_key::product_version (type: AssetMappingString, default: [])
  --aws-account.single  Export all aws-account in a single evidence (default: False)
  --repository.single   Export all repositories in a single evidence (default: False)
  --default_product_key_strategy {instance,aws-account,repository,tag,mapping}
                        Override product key with aws-account, repository or image names (default: mapping)
```
<!-- { "object-type": "command-output-end" } -->


## ECR evidence
Jfrog evidence generation supports the generation of namespace and repository evidence. The evidence includes information about the repositories, tags, and access tokens.

To generate evidence for a ECR account:

```bash
platforms evidence ecr --repository.mapping "*my-service*::my-product::1.0" 
```
<!--
{
    "command": "platforms evidence ecr --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] evidence [options] ecr [-h] [--instance.instance INSTANCE] [--url URL] [--types {instance,aws-account,repository,all}] [--scope.aws-account [AWS_ACCOUNT ...]] [--scope.repository [REPOSITORY ...]] [--scope.repository_tags [REPOSITORY_TAGS ...]] [--scope.image_platform [IMAGE_PLATFORM ...]]
                                                  [--exclude.aws-account [AWS_ACCOUNT ...]] [--exclude.repository [REPOSITORY ...]] [--exclude.repository_tags [REPOSITORY_TAGS ...]] [--aws-account.mapping [MAPPING ...]] [--repository.mapping [MAPPING ...]] [--aws-account.single] [--repository.single]
                                                  [--default_product_key_strategy {instance,aws-account,repository,tag,mapping}]

options:
  -h, --help            Show this help message and exit.
  --instance.instance INSTANCE
                        ECR instance string (default: )
  --url URL             ECR base URL (default: null)
  --types {instance,aws-account,repository,all}
                        Defines which evidence to create, scoped by scope parameters (default: all)
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
  --aws-account.mapping [MAPPING ...]
                        Repository product key mapping in the format of asset::product_key::product_version (type: AssetMappingString, default: [])
  --repository.mapping [MAPPING ...]
                        Repository image_tags product key mapping in the format of asset::product_key::product_version (type: AssetMappingString, default: [])
  --aws-account.single  Export all aws-account in a single evidence (default: False)
  --repository.single   Export all repositories in a single evidence (default: False)
  --default_product_key_strategy {instance,aws-account,repository,tag,mapping}
                        Override product key with aws-account, repository or image names (default: mapping)
```
<!-- { "object-type": "command-output-end" } -->


## BitBucket Evidence
BitBucket evidence supports the generation of workspace evidence and repository evidence. 

To generate evidence for a BitBucket account:
```bash
platforms evidence bitbucker --workspace.mapping "my-workspace::my-product::1.0" --repository.mapping "my-repository::my-product::1.0"
```

<!--
{
    "command": "platforms evidence bitbucket --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] evidence [options] bitbucket [-h] [--instance.instance INSTANCE] [--types {workspace,project,repository,all,all}] [--app_password APP_PASSWORD] [--username USERNAME] [--workspace_token WORKSPACE_TOKEN] [--workspace WORKSPACE] [--url URL] [--scope.workspace [WORKSPACE ...]] [--scope.project [PROJECT ...]]
                                                        [--scope.repository [REPOSITORY ...]] [--scope.commit [COMMIT ...]] [--scope.branch [BRANCH ...]] [--scope.webhook [WEBHOOK ...]] [--commit.skip] [--branch-protection.skip] [--default_product_key_strategy {mapping}] [--workspace.mapping [MAPPING ...]]
                                                        [--project.mapping [MAPPING ...]] [--repository.mapping [MAPPING ...]] [--workspace.single] [--project.single] [--repository.single]

options:
  -h, --help            Show this help message and exit.
  --instance.instance INSTANCE
                        BitBucket instance string (default: )
  --types {workspace,project,repository,all,all}
                        Defines which evidence to create, scoped by scope parameters (default: all)
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
                        BitBucket projects wildcards. Default is all projects. Note that a project name includes as a prefix its namesapce in the format 'namespace / project_name' (default: ['*'])
  --scope.repository [REPOSITORY ...]
                        BitBucket repositories wildcards. Default is all projects. Note that a project name includes as a prefix its namesapce in the format 'namespace / project_name' (default: ['*'])
  --scope.commit [COMMIT ...]
                        BitBucket commit wildcards (default: [])
  --scope.branch [BRANCH ...]
                        BitBucket branches wildcards (default: [])
  --scope.webhook [WEBHOOK ...]
                        BitBucket webhook wildcards (default: [])
  --commit.skip         Skip commits in discovery/evidence (default: False)
  --branch-protection.skip
                        Skip Branch protection in discovery/evidence (default: False)
  --default_product_key_strategy {mapping}
                        Deferment product key by mapping. In the future - we shall support by reopsitory name too. (default: mapping)
  --workspace.mapping [MAPPING ...]
                        Workspace product key mapping in the format of workspace::product_key::product_version where org is the workspace name, wildcards are supported (type: AssetMappingString, default: [])
  --project.mapping [MAPPING ...]
                        Project product key mapping in the format of project::product_key::product_version where org is the project name, wildcards are supported (type: AssetMappingString, default: [])
  --repository.mapping [MAPPING ...]
                        Repository product key mapping in the format of repo::product_key::product_version where repo is the repository name, wildcards are supported (type: AssetMappingString, default: [])
  --workspace.single    Export all workspaces in a single evidence (default: False)
  --project.single      Export all projects in a single evidence (default: False)
  --repository.single   Export all repos in a single evidence (default: False)
```
<!-- { "object-type": "command-output-end" } -->


## Jenkins Evidence
Jenkins evidence supports the generation of instance evidence and folder evidence. 

To generate evidence for a Jenkins account:
```bash
platforms evidence jenkins --instance-mapping "my-instance::my-product::1.0" --folder.mapping "my-folder::my-product::1.0"
```

<!--
{
    "command": "platforms evidence jenkins --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] evidence [options] jenkins [-h] [--instance.instance INSTANCE] [--types {instance,folder,all,all}] [--username USERNAME] [--password PASSWORD] [--url URL] [--credential_stores.skip] [--users.skip] [--plugins.skip] [--security_settings.skip] [--computer_set.skip] [--jobs.skip] [--scope.folder [FOLDER ...]]
                                                      [--exclude.folder [FOLDER ...]] [--scope.job_runs.past_days PAST_DAYS] [--scope.job_runs.max MAX] [--scope.job_runs.analyzed_logs] [--job_runs.skip] [--default_product_key_strategy {mapping}] [--instance-mapping [INSTANCE_MAPPING ...]] [--folder.mapping [MAPPING ...]]
                                                      [--folder.single]

options:
  -h, --help            Show this help message and exit.
  --instance.instance INSTANCE
                        Jenkins instance string (default: )
  --types {instance,folder,all,all}
                        Defines which evidence to create, scoped by scope parameters (default: all)
  --username USERNAME   Jenkins username (default: )
  --password PASSWORD   Jenkins token (JENKINS_PASSWORD) (default: )
  --url URL             Jenkins base URL (default: )
  --credential_stores.skip
                        Skip credential stores (default: False)
  --users.skip          Skip users (default: False)
  --plugins.skip        Skip plugins (default: False)
  --security_settings.skip
                        Skip security_settings (default: False)
  --computer_set.skip   Skip computer sets in discovery/evidence (default: False)
  --jobs.skip           Skip jobs (default: False)
  --scope.folder [FOLDER ...]
                        Jenkins folder/job list. Default is all folders. The folder scoping is defined as a path of folders and can include the job name in order to scope specific jobs. Wildcard is supported only as a suffix. examples: folder-a* will discover all folders that are included in a root folder that starts with folder-a.
                        folder-a/* will discover all folders and jobs under the root folder folder-a (type: JenkinsFolderScope, default: ['*'])
  --exclude.folder [FOLDER ...]
                        Jenkins folder/job list to exclude from discovery. Format is like the --scope.folder argument (type: JenkinsFolderScope, default: [])
  --scope.job_runs.past_days PAST_DAYS
                        Number of past days to include in the job run discovery, 0 for no time limit (type: int, default: 30)
  --scope.job_runs.max MAX
                        Mam number of job runs to include in the job run discovery. This argument will limit the number of job runs in the past_days range. 0 for no limit (type: int, default: 10)
  --scope.job_runs.analyzed_logs
                        Include analyzed job run logs (default: False)
  --job_runs.skip       Skip commits in discovery/evidence (default: False)
  --default_product_key_strategy {mapping}
                        Deferment product key by mapping. In the future - we shall support by folder name too. (default: mapping)
  --instance-mapping [INSTANCE_MAPPING ...]
                        Instance product key mapping in the format of *::product_key::product_version, wildcards are supported (type: AssetMappingString, default: [])
  --folder.mapping [MAPPING ...]
                        Folder product key mapping in the format of folder_path::product_key::product_version, wildcards are supported (type: AssetMappingString, default: [])
  --folder.single       Export all repos in a single evidence (default: False)
```
<!-- { "object-type": "command-output-end" } -->

