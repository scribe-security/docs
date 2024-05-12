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
                                    {gitlab,dockerhub,k8s} ...

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
usage: platforms [options] discover [options] gitlab [-h] [--instance INSTANCE] [--token TOKEN] [--url URL]
                                                     [--scope.organization [ORGANIZATION ...]]
                                                     [--scope.project [PROJECT ...]] [--scope.branch [BRANCH ...]]
                                                     [--commit.skip] [--pipeline.skip]
                                                     [--default_product_key_strategy {mapping}]
                                                     [--scope.skip_org_members] [--scope.skip_project_members]
                                                     [--scope.commit.past_days PAST_DAYS]
                                                     [--scope.pipeline.past_days PAST_DAYS]
                                                     [--scope.pipeline.analyzed_logs]

options:
  -h, --help            Show this help message and exit.
  --instance INSTANCE   Gitlab instance string (default: )
  --token TOKEN         Gitlab token (required, default: )
  --url URL             Gitlab base URL (default: https://gitlab.com/api/v4)
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
  --scope.skip_org_members
                        Skip organization members discovery (default: False)
  --scope.skip_project_members
                        Skip project members discovery (default: False)
  --scope.commit.past_days PAST_DAYS
                        Number of past days to include in the report (type: int, default: 30)
  --scope.pipeline.past_days PAST_DAYS
                        Number of past days to include in the report (type: int, default: 30)
  --scope.pipeline.analyzed_logs
                        Include analyzed pipeline logs (default: False)
```
<!-- { "object-type": "command-output-end" } -->

<!--
To run the discovery process on a Gitlab account:
```bash
platforms discover gitlab --token $TOKEN
```
The token should have admin permissions (as it is needed for reading secrets information).

#### Gitlab Discovery Options
The option `--token `is mandatory and used for providing the GitLab token, with a default set from the environment variables CI_JOB_TOKEN or GITLAB_TOKEN.

The option `--url` sets the GitLab base URL, with a default value of "https://gitlab.com/api/v4".

The option `--instance` allows specifying a unique GitLab instance string, with an empty string as the default.

The option `--scope.organization` is used to specify GitLab organizations with a default wildcard ["*"] to include all.

The option `--scope.skip_org_members` enables skipping the discovery of organization members.

The option `--scope.project` specifies GitLab projects or repositories to include, using wildcards with a default of ["*"].

The option `--scope.skip_project_members` allows for skipping the discovery of project members.

The option `--scope.branch` is used for specifying GitLab branch wildcards to include, with ["*"] as the default to include all branches.

The option `--commit.skip` enables skipping the discovery of commits.

The option `--scope.commit.past_days` sets the number of past days to include in commit reports, with a default of 30 days.

The option `--scope.pipeline.skip` allows for opting out of pipeline discovery.

The option `--scope.pipeline.past_days` determines the number of past days to include in pipeline reports, also defaulting to 30 days.

The option `--scope.pipeline.analyzed_logs` includes analyzed pipeline logs in the discovery output.
-->
## DockerHub Discovery
DockerHub discovery samples the following assets: namespaces, repositories, and repository_tags.
<!--
{
    "command": "platforms discover dockerhub --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [options] discover [options] dockerhub [-h] [--instance INSTANCE] [--username USERNAME]
                                                        [--password PASSWORD] [--url URL]
                                                        [--scope.namespace [NAMESPACE ...]]
                                                        [--scope.repository [REPOSITORY ...]]
                                                        [--scope.repository_tags [REPOSITORY_TAGS ...]]
                                                        [--exclude.repository [REPOSITORY ...]]
                                                        [--exclude.repository_tags [REPOSITORY_TAGS ...]]
                                                        [--scope.past_days PAST_DAYS]

options:
  -h, --help            Show this help message and exit.
  --instance INSTANCE   Dockerhub instance string (default: )
  --username USERNAME   Dockerhub username (default: null)
  --password PASSWORD   Dockerhub password (default: null)
  --url URL             Dockerhub base URL (default: https://hub.docker.com)
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
  --scope.past_days PAST_DAYS
                        Ignore tags pushed earlier that previous to this number of days (type: int, default: 30)
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
usage: platforms [options] discover [options] k8s [-h] [--instance INSTANCE] [--url URL] [--token TOKEN]
                                                  [--scope.namespace [NAMESPACE ...]] [--scope.pod [POD ...]]
                                                  [--scope.image [IMAGE ...]] [--exclude.namespace [NAMESPACE ...]]
                                                  [--exclude.pod [POD ...]] [--exclude.image [IMAGE ...]]
                                                  [--scope.secret.skip]

options:
  -h, --help            Show this help message and exit.
  --instance INSTANCE   Kubernetes instance string (default: )
  --url URL             Kubernetes API URL (required, default: )
  --token TOKEN         Kubernetes token, with access to pods and secrets (required, default: )
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
  --scope.secret.skip   Skip secrets discovery (default: False)
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
