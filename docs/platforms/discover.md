---
sidebar_label: "Platform Discovery"
title: "Platforms Discover command"
sidebar_position: 3
---

# The Discover Command
The discover command is used to sample asset data from various sources. The data is stored in an internal database, which is used by the evidence generation and policy evaluation commands. To run the discover command you need to provide the access data to the resources and scoping information. Access data typically includes providing a `url` and access data such as a `token` or `username` and `password`.

Notice that the database created should be accessible for running the other commands later on.

## Common Options
<!--
{
    "command": "platforms discover --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] discover [-h] [--db.local.store_policy {update,replace}] [--db.update_period UPDATE_PERIOD]
                                    {gitlab,dockerhub,k8s,github,jfrog,ecr,jenkins,bitbucket} ...

Discover assets and save data to a local store

options:
  -h, --help            Show this help message and exit.
  --db.local.store_policy {update,replace}
                        Policy for local data collection: update or replace (default: update)
  --db.update_period UPDATE_PERIOD
                        Update period in days. 0 for force update (type: int, default: 0)

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
```
<!-- { "object-type": "command-output-end" } -->


<!--
The `--db.local.store_policy` option defines the policy for handling local data collection, allowing either "update" to modify existing data or "replace" to overwrite it entirely, with "update" as the default behavior. When using `replace` only data relevant to the specific platform will be replaced.

The `--db.update_period` option specifies whether to run the discovery if it has been already done in the previous period, specified in days.
-->

## Gitlab Discovery
Gitlab discovery samples the following assets: organization, projects, users, tokens, and pipelines.
<!--
{
    "command": "platforms discover gitlab --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] discover [options] gitlab [-h] [--instance INSTANCE]
                                                     [--types {organization,project,authenticated_user,member,token,variable,branch,user,commit,pipeline,job,all} [{organization,project,authenticated_user,member,token,variable,branch,user,commit,pipeline,job,all} ...]]
                                                     [--token TOKEN] [--url URL] [--scope.organization [ORGANIZATION ...]]
                                                     [--scope.project [PROJECT ...]] [--scope.branch [BRANCH ...]]
                                                     [--scope.tag [TAG ...]] [--commit.skip] [--pipeline.skip]
                                                     [--default_product_key_strategy {mapping}] [--scope.skip_org_members]
                                                     [--scope.skip_project_members] [--scope.commit.past_days PAST_DAYS]
                                                     [--scope.pipeline.skip] [--scope.pipeline.past_days PAST_DAYS]
                                                     [--scope.pipeline.analyzed_logs] [--scope.pipeline.reports] [--broad]

options:
  -h, --help            Show this help message and exit.
  --instance INSTANCE   Gitlab instance string (default: )
  --types {organization,project,authenticated_user,member,token,variable,branch,user,commit,pipeline,job,all} [{organization,project,authenticated_user,member,token,variable,branch,user,commit,pipeline,job,all} ...]
                        Defines which asset to discover, scoped by scope parameters (default: [])
  --token TOKEN         Gitlab token (GITLAB_TOKEN, CI_JOB_TOKEN) (default: )
  --url URL             Gitlab base URL (default: https://gitlab.com/)
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
  --scope.skip_org_members
                        Skip organization members discovery (default: False)
  --scope.skip_project_members
                        Skip project members discovery (default: False)
  --scope.commit.past_days PAST_DAYS
                        Number of past days to include in the report (type: int, default: 28)
  --scope.pipeline.skip
                        Skip pipeline information (default: False)
  --scope.pipeline.past_days PAST_DAYS
                        Number of past days to include in the report (type: int, default: 30)
  --scope.pipeline.analyzed_logs
                        Include analyzed pipeline logs (default: False)
  --scope.pipeline.reports
                        Include gitlab standard reports (default: False)
  --broad               Retrieves limited information (only organizations and projects) (default: False)
```
<!-- { "object-type": "command-output-end" } -->


Note:
The discovery includes two experimental features, to add data to the project evidence:
* `--scope.workflow.analyzed_logs` which attepmts to analyze logs to detect image building information


## Github Discovery
Github discovery samples the following assets: organization, repositories, users, tokens, and workflows.
<!--
{
    "command": "platforms discover github --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] discover [options] github [-h] [--instance INSTANCE]
                                                     [--types {organization,repository,branch,commit,workflow,run,member,authenticated_user,collaborator,secret,variable,all} [{organization,repository,branch,commit,workflow,run,member,authenticated_user,collaborator,secret,variable,all} ...]]
                                                     [--token TOKEN] [--url URL] [--scope.organization [ORGANIZATION ...]]
                                                     [--scope.repository [REPOSITORY ...]] [--scope.branch [BRANCH ...]]
                                                     [--scope.tag [TAG ...]] [--branch.shallow] [--commit.skip]
                                                     [--default_product_key_strategy {mapping}]
                                                     [--scope.commit.past_days PAST_DAYS] [--workflow.skip]
                                                     [--scope.workflow.past_days PAST_DAYS] [--scope.workflow.analyzed_logs]
                                                     [--scope.runners] [--scope.sbom] [--broad]

options:
  -h, --help            Show this help message and exit.
  --instance INSTANCE   Github instance string (default: )
  --types {organization,repository,branch,commit,workflow,run,member,authenticated_user,collaborator,secret,variable,all} [{organization,repository,branch,commit,workflow,run,member,authenticated_user,collaborator,secret,variable,all} ...]
                        Defines which asset to discover, scoped by scope parameters (default: [])
  --token TOKEN         Github token (GITHUB_TOKEN, GH_TOKEN) (default: )
  --url URL             Github base URL (default: https://github.com)
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
```
<!-- { "object-type": "command-output-end" } -->


Note:
The discovery includes two experimental features, to add data to the project evidence:
* `--scope.pipeline.analyzed_logs` which attepmts to analyze logs to detect image building information
* `--scope.pipeline.reports` which collects GitLab standard secret scanning and sast reports.


## DockerHub Discovery
DockerHub discovery samples the following assets: namespaces, repositories, and repository_tags.
<!--
{
    "command": "platforms discover dockerhub --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] discover [options] dockerhub [-h] [--instance INSTANCE]
                                                        [--types {instance,namespace,repository,repository_tag,webhook,token,all} [{instance,namespace,repository,repository_tag,webhook,token,all} ...]]
                                                        [--username USERNAME] [--password PASSWORD] [--token TOKEN]
                                                        [--url URL] [--scope.repository [REPOSITORY ...]]
                                                        [--scope.repository_tags [REPOSITORY_TAGS ...]]
                                                        [--scope.image_platform [IMAGE_PLATFORM ...]]
                                                        [--exclude.repository [REPOSITORY ...]]
                                                        [--exclude.repository_tags [REPOSITORY_TAGS ...]]
                                                        [--namespace-list [NAMESPACE_LIST ...]] [--scope.past_days PAST_DAYS]
                                                        [--broad]

options:
  -h, --help            Show this help message and exit.
  --instance INSTANCE   Dockerhub instance string (default: )
  --types {instance,namespace,repository,repository_tag,webhook,token,all} [{instance,namespace,repository,repository_tag,webhook,token,all} ...]
                        Defines which asset to discover, scoped by scope parameters (default: [])
  --username USERNAME   Dockerhub username (default: null)
  --password PASSWORD   Dockerhub password (DOCKERHUB_PASSWORD) (default: )
  --token TOKEN         Dockerhub token (default: )
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
```
<!-- { "object-type": "command-output-end" } -->

<!--
To run the discovery process on a DockerHub account:
```bash
platforms discover dockerhub --username $USERNAME --password $PASSWORD
```

#### DockerHub Discovery Options
The option `--username` allows for the specification of a DockerHub username, with the default set from the environment variable DOCKERHUB_USERNAME.

The option `--password provides` for entering a DockerHub password, with the default coming from the environment variable DOCKERHUB_PASSWORD.

The option `--url` sets the DockerHub base URL, defaulting to "https://hub.docker.com".

The option `--instance` is used to specify a unique DockerHub instance string, with an empty string as the default.

The option `--scope.namespace` allows specifying DockerHub namespaces, defaulting to the username or ["*"] for all namespaces.

The option `--scope.repository` is used for specifying DockerHub repositories to include, with a default wildcard ["*"].

The option `--scope.repository_tags` specifies DockerHub tags to include, with a default of ["*"] to include all tags.

The option `--exclude.repository` is used for listing DockerHub repository wildcards to exclude from the discovery process.

The option `--exclude.repository_tags` provides for specifying DockerHub tags to exclude from the discovery process.

The option `--scope.past_days` sets the number of past days for considering tags, ignoring those pushed earlier than this number of days, with a default of 30 days.
-->

## K8s Discovery
Kubernetes discovery samples the following asset types: namespaces, pods, and secrets. Pod information includes image information.
<!--
{
    "command": "platforms discover k8s --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] discover [options] k8s [-h] [--instance INSTANCE]
                                                  [--types {namespace,pod,secret,deployment,all} [{namespace,pod,secret,deployment,all} ...]]
                                                  [--url URL] [--token TOKEN] [--scope.namespace [NAMESPACE ...]]
                                                  [--scope.pod [POD ...]] [--scope.image [IMAGE ...]] [--ignore-state]
                                                  [--exclude.namespace [NAMESPACE ...]] [--exclude.pod [POD ...]]
                                                  [--exclude.image [IMAGE ...]] [--secret.skip] [--deployment.skip] [--broad]

options:
  -h, --help            Show this help message and exit.
  --instance INSTANCE   Kubernetes instance string (default: )
  --types {namespace,pod,secret,deployment,all} [{namespace,pod,secret,deployment,all} ...]
                        Defines which asset to discover, scoped by scope parameters (default: [])
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
```
<!-- { "object-type": "command-output-end" } -->

<!--
To run the discover process on a K8s cluster:
```bash
platforms discover k8s --url https://my-cluster --token $TOKEN
```

For all discovery capabilities, the token should have permissions for the namespaces, pods, and secrets resources. Scripts for automating the generation of these tokens are provided separately.

Note: only secrets-metadata is stored in the database, not the actual secrets.

#### K8s Discovery Options

The option `--url` is used for specifying the Kubernetes API URL, which is mandatory and can be set by an environment variable K8S_URL if not provided directly.

The option `--token` is used for providing the authentication token required for access to Kubernetes pods and secrets, mandatory and can be sourced from an environment variable K8S_TOKEN if not explicitly provided.

The option `--scope.namespace` is used for specifying Kubernetes namespaces to be included in the discovery process, using a wildcard list with a default of ["*"] to include all.

The option `--scope.pod` is used for defining a list of Kubernetes pods to be included in the discovery process, with a default wildcard ["*"] to include all pods.

The option `--scope.image` is used for specifying Kubernetes images be to included in the discovery process, using a wildcard list with a default of ["*"] to include all images.

The option `--exclude.namespace` is used for listing namespaces that should be excluded from the discovery process.

The option `--exclude.pod` is used for identifying specific pods to exclude from the discovery process.

The option `--exclude.image` is used for specifying images to exclude from the discovery process.

The option `--scope.secret.skip` is used for opting out of secrets discovery within the Kubernetes environment.
-->

## Jfrog Discovery
Jfrog discovery samples the following assets: Jfrog repositories, Image repositories, and Image Tags.
For example `my_company.jfrog.io/my_registry/my_image:latest`

* `my_company.jfrog.io`: Instance URL
* `my_registry` A Jfrog Repository Includes a set of Image Repositories.
* `my_image` A image Repository, Includes a set of Image Tags.
* `my_image:latest` A image Repository.

<!--
{
    "command": "platforms discover jfrog --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] discover [options] jfrog [-h] [--instance INSTANCE]
                                                    [--types {jf-repository,repository,repository_tag,user,token,webhook,all} [{jf-repository,repository,repository_tag,user,token,webhook,all} ...]]
                                                    [--token TOKEN] [--url URL] [--scope.jf-repository [JF_REPOSITORY ...]]
                                                    [--scope.repository [REPOSITORY ...]]
                                                    [--scope.repository_tags [REPOSITORY_TAGS ...]]
                                                    [--scope.image_platform [IMAGE_PLATFORM ...]]
                                                    [--exclude.jf-repository [JF_REPOSITORY ...]]
                                                    [--exclude.repository [REPOSITORY ...]]
                                                    [--exclude.repository_tags [REPOSITORY_TAGS ...]]
                                                    [--scope.past_days PAST_DAYS] [--scope.tag_limit TAG_LIMIT] [--broad]

options:
  -h, --help            Show this help message and exit.
  --instance INSTANCE   Jfrog instance string (default: )
  --types {jf-repository,repository,repository_tag,user,token,webhook,all} [{jf-repository,repository,repository_tag,user,token,webhook,all} ...]
                        Defines which asset to discover, scoped by scope parameters (default: [])
  --token TOKEN         Jfrog token (JFROG_TOKEN) (default: )
  --url URL             Jfrog base URL (default: null)
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
                        Limit the number of recent tags to be discovered. Scoping to tag names is done on the limited tag
                        list. Limit applies also to the past_days filter. 0 for no limit, default is 10. (type: int, default:
                        10)
  --broad               Retrieves limited information (only jf-repositories and repositories) (default: False)
```
<!-- { "object-type": "command-output-end" } -->


## ECR Discovery
ECR discovery samples the following assets: ECR repositories, Image repositories, and Image Tags.
For example `\<account\>.dkr.ecr.us-west-2.amazonaws.com/my_image:latest`

* ``\<account\>.dkr.ecr.us-west-2.amazonaws.com`: Instance URL
* `my_image` A image Repository, Includes a set of Image Tags.
* `my_image:latest` A image Repository.

<!--
{
    "command": "platforms discover ecr --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] discover [options] ecr [-h] [--instance INSTANCE]
                                                  [--types {aws-account,repository,repository_tags,all} [{aws-account,repository,repository_tags,all} ...]]
                                                  [--token TOKEN] [--url URL] [--scope.aws-account [AWS_ACCOUNT ...]]
                                                  [--scope.repository [REPOSITORY ...]]
                                                  [--scope.repository_tags [REPOSITORY_TAGS ...]]
                                                  [--scope.image_platform [IMAGE_PLATFORM ...]]
                                                  [--exclude.aws-account [AWS_ACCOUNT ...]]
                                                  [--exclude.repository [REPOSITORY ...]]
                                                  [--exclude.repository_tags [REPOSITORY_TAGS ...]]
                                                  [--scope.past_days PAST_DAYS] [--scope.tag_limit TAG_LIMIT] [--broad]

options:
  -h, --help            Show this help message and exit.
  --instance INSTANCE   ECR instance string (default: )
  --types {aws-account,repository,repository_tags,all} [{aws-account,repository,repository_tags,all} ...]
                        Defines which asset to discover, scoped by scope parameters (default: [])
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
                        Limit the number of recent tags to be discovered. Scoping to tag names is done on the limited tag
                        list. Limit applies also to the past_days filter. 0 for no limit, default is 10. (type: int, default:
                        10)
  --broad               Retrieves limited information (only aws-account and repository) (default: False)
```
<!-- { "object-type": "command-output-end" } -->


## BitBucket Discovery
BitBucket discovery samples the following assets: workspaces, projects, repositories, user, branches, commits, protected_branches and webhooks.
<!--
{
    "command": "platforms discover bitbucket --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] discover [options] bitbucket [-h] [--instance INSTANCE]
                                                        [--types {workspace,project,repository,branch,commit,authenticated_user,webhooks,repo_permission,user_permission,branch_protection,token,all} [{workspace,project,repository,branch,commit,authenticated_user,webhooks,repo_permission,user_permission,branch_protection,token,all} ...]]
                                                        [--app_password APP_PASSWORD] [--username USERNAME]
                                                        [--workspace_token WORKSPACE_TOKEN] [--workspace WORKSPACE]
                                                        [--url URL] [--scope.workspace [WORKSPACE ...]]
                                                        [--scope.project [PROJECT ...]] [--scope.repository [REPOSITORY ...]]
                                                        [--scope.commit [COMMIT ...]] [--scope.branch [BRANCH ...]]
                                                        [--scope.webhook [WEBHOOK ...]] [--commit.skip] [--broad]

options:
  -h, --help            Show this help message and exit.
  --instance INSTANCE   BitBucket instance string (default: )
  --types {workspace,project,repository,branch,commit,authenticated_user,webhooks,repo_permission,user_permission,branch_protection,token,all} [{workspace,project,repository,branch,commit,authenticated_user,webhooks,repo_permission,user_permission,branch_protection,token,all} ...]
                        Defines which asset to discover, scoped by scope parameters (default: [])
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
  --broad               Retrieves limited information (only workspaces, repositories) (default: False)
```
<!-- { "object-type": "command-output-end" } -->


## Jenkins Discovery
Jenkins discovery samples the following assets: instance, folders, jobs, job_runs, credential_stores, users, computer_set, security_settings.
<!--
{
    "command": "platforms discover jenkins --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] discover [options] jenkins [-h] [--instance INSTANCE] [--username USERNAME] [--password PASSWORD]
                                                      [--url URL] [--broad]
                                                      [--types {all,computer_set,users,jobs,job_runs,credential_stores,plugins,security_settings,all} [{all,computer_set,users,jobs,job_runs,credential_stores,plugins,security_settings,all} ...]]
                                                      [--credential_stores.skip] [--users.skip] [--plugins.skip]
                                                      [--security_settings.skip] [--computer_set.skip] [--jobs.skip]
                                                      [--scope.folder [FOLDER ...]] [--exclude.folder [FOLDER ...]]
                                                      [--scope.job_runs.past_days PAST_DAYS] [--scope.job_runs.max MAX]
                                                      [--scope.job_runs.analyzed_logs] [--job_runs.skip]

options:
  -h, --help            Show this help message and exit.
  --instance INSTANCE   Jenkins instance string (default: )
  --username USERNAME   Jenkins username (default: )
  --password PASSWORD   Jenkins token (JENKINS_PASSWORD) (default: )
  --url URL             Jenkins base URL (default: null)
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
                        Jenkins folder/job list. Default is all folders. The folder scoping is defined as a path of folders
                        and can include the job name in order to scope specific jobs. Wildcard is supported only as a suffix.
                        examples: folder-a* will discover all folders that are included in a root folder that starts with
                        folder-a. folder-a/* will discover all folders and jobs under the root folder folder-a (type:
                        JenkinsFolderScope, default: ['*'])
  --exclude.folder [FOLDER ...]
                        Jenkins folder/job list to exclude from discovery. Format is like the --scope.folder argument (type:
                        JenkinsFolderScope, default: [])
  --scope.job_runs.past_days PAST_DAYS
                        Number of past days to include in the job run discovery, 0 for no time limit (type: int, default: 30)
  --scope.job_runs.max MAX
                        Mam number of job runs to include in the job run discovery. This argument will limit the number of job
                        runs in the past_days range. 0 for no limit (type: int, default: 10)
  --scope.job_runs.analyzed_logs
                        Include analyzed job run logs (default: False)
  --job_runs.skip       Skip commits in discovery/evidence (default: False)
```
<!-- { "object-type": "command-output-end" } -->
