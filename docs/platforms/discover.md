
---

## sidebar_label: "Platform Discovery"
title: "Platforms Discover command"
sidebar_position: 3
# The Discover Command
The discover command is used to sample asset data from various sources. The data is stored in an internal database, which is used by the evidence generation and policy evaluation commands. To run the discover command you need to provide the access data to the resources and scoping information. Access data typically includes providing a `url` and access data such as a `token` or `username` and `password`.

Notice that the database created should be accessible for running the other commands later on.

## Common Options
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
## Gitlab Discovery
Gitlab discovery samples the following assets: organization, projects, users, tokens, and pipelines.

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
## DockerHub Discovery
DockerHub discovery samples the following assets: namespaces, repositories, and repository_tags.

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
## K8s Discovery
Kubernetes discovery samples the following asset types: namespaces, pods, and secrets. Pod information includes image information.

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




<!--- Eraser file: https://app.eraser.io/workspace/QwL7wSBJYR94IKM9Q2mE --->