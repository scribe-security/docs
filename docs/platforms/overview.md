---
sidebar_label: "Platforms User Guide"
title: "Platforms User Guide"
sidebar_position: 1
---

# Platforms: Scribe's Scanning and Policy Evaluation Engine

## What is `platforms`?
Platforms is a dockerized cli tool, that can be used to scan and evaluate policies on your infrastructure. It is a part of the Scribe suite of tools, which are designed to help you secure your software supply chain.

This version of platforms supports Gitlab, DockerHub and K8s. Under construction we have support for GitHub, Bitbucket, Jenkins and AWS-ECR.

Key Features:
* Discovery of assets
* Measuring security posture, activity and volume data of assets
* Powerfull scoping and filtering capabilities
* Powerfull capabilities to map assets to Scribe Products

## Concepts
* Assets: Assets are the resources that are being scanned. They can be anything from a docker image to a git repository.
* Products: Products are the software products that are made up of multiple assets. Examples:
    * A simple application may be made up of a single code repository and a single CI pipeline that generates a single docker image.
    * A complex application may be made up of multiple code repositories, multiple CI pipelines and multiple docker images. It may also include external assets such as docker images from DockerHub.
    * The Product point of view serves the product-security team, while assets are the day to day concern of the development and operations teams.
    * Scribe's platform and tool enables and helps users to map assets to product.
    * Note that the mapping is many to many; a single asset can be part of multiple products (e.g. a microservice) and a single product can have multiple assets (e.g. a product that consists of multiple microservices).
* Evidence: Evidence is the data that is generated from the assets. It can be anything from metadata and settings of source-code-repo, an SBOM of a docker image, or a list of secrets metadata of a K8s cluster.
    * To secure the evidence from being falsified, tampered with or denied, attestations can be signed. Scribe tools provide the capability to sign the evidence using various signing mechanisms (PKI, Sigstore)
* Discovery: Discovery is the process of sampling assets data from various sources.
    * The input to the discovery process is accesss data to the resources and scoping information.
    * The output of the discovery process is an internal database of assets.
* Evidence Generation: Evidence generation is the process of generating evidence from the assets sampled data. 
    * The input to the evidence generation process is the internal database of assets, scoping and product mapping information.
    * The output of the evidence generation process is a set of evidence uploaded to an attestation store, which by default is ScribeHub.
* SBOM Generation: Automation of SBOM Generation of assets.
    * Currenly we support genrating SBOMs of DockerHub accounts and K8s clusters.
    * This capability enables users to generate SBOMs on scale, and to focus on the in-production assets, thus enabling the security teams to focus on the most critical assets.
* Policy Evaluation: Policy evaluation is the process of evaluating policies on the evidence generated.
    * Scribe provides a policy-as-code framework, which provides user with out-of-the-box policies and the ability to write custom policies.
    * Policies are applied on evidence; the policy evaluation process involves pulling the relevant attestations from the attestation store and evaluating the policies on the evidence. For example, to verify the security of a source-code repo, the policy evaluation process will consume evidence about the repo and the account, and evaluate policies such as "limited admins", "all secrets have an expiration date", "at least 2 reviewers are required for merging a PR", etc.


## Usage

### Inatallation and Running
There are two ways to run the platforms tool:
1. Using a CI script to automate the discovery, evidence generation, SBOM generation and policy evaluation process. Scribe provides such CI scripts to make the process easy.
2. Directly run the `platfroms` dockerized cli tool.

### CLI Commands Structure
All the commands in the platforms tool are structured as follows:
```bash
platforms [globalse-options] command [command options] platform [platform options]
```

* The `options` are the global options that are applicable to all the commands.
* The `command` is the action that you want to perform. It can be one of the following:
    * `discover`: To discover assets.
    * `evidence`: To generate evidence.
    * `bom`: To generate SBOMs.
    * `verify`: To evaluate policies.
* command options are the options that are applicable to the command.
* platfrom is the platform on which you want to perform the action. It can be one of the following:
    * `gitlab`: To perform the action on Gitlab or Gitlab evidence.
    * `dockerhub`: To perform the action on DockerHub, Dockerhub images or Dockerhub evidence.
    * `k8s`: To perform the action on K8s or K8s evidence.
* platform options are the options that are applicable to the platform. Most of the platform specific options are for scoping, filtering and mapping assets to products.

In the following sections we shall explain each command in detail, by going through all commands for each platform.

## Global The options

`--config`: Path to the config file. The config file is a `yml` representation of the command line commands and options.

`--log-level`: The verbosity of the logs (`debug`, `info`, `warn`, `error`), default is `info`.

`--log-file`: The path to a file to store the logs.

`--help`: To get help on the command.

## Common Options

All the commands use an internal assets database. The path to the database can be set using the `--db.local.path` option. This option defaults to `platforms.db` or to a the value of the environment variable `PLATFORMS_DB_PATH`.

The `--instance` options enables managing multiple instances of development platforms, such as different Gitlab or DockerHub accoutns, or difference K8s clusters. The `instance` option must be used consecutively with all the commands.

Scoping and excluding assets for various commands is supported. The values to scope or to exclude are provided as a list of strings, these strings can include wildcards. For example, 
* To scope the K8s scan only to namespaces that start with "prod", use the option `--scope.namespace prod*`.
* To scope to both "prod" and "stage" namespaces, the option `--scope.namespace prod*, dev*` can be used. 

Options for **mapping assets to Scribe Products and Product-versions** are suppored all commands that require its. The mapping is done using an `--<asset>.mapping` option, followed with a list of asset-mapping strings. The common format for the asset-mapping string is `asset_name::product_key::product_version`. The asset name part supports wildcards. For example,
* To map the Nuatilus Gitlab project ot the Accounting product, version 1.0 use the option `--project.mapping nautilus::Accounting::1.0`.
* To map all the Gitlab projects that start with "service" to ComplexProdct1 and ComplexProduct2 use the option `--project.mapping service*::ComplexProduct1::1.0, service*::ComplexProduct2::1.0`.
* The K8s asset-mapping strings for mapping images to be scaned to products are in the format `namespace::pod::image::product_key::product_version`. For example,
* To map all the images in the "prod" namespace to the Accounting product, version 1.0 use the option `--image.mapping prod::*::Accounting::1.0`.
* To map all the images from my-company regeistry to the Gizmo product, version 2.0 use the option `--image.mapping *::*::my-company/*::Gizmo::2.0`.

Notes:
* Mapping is another scoping stage; if a mapping is done, only the assets that are mapped will be considered for the command.
* Some of the platforms support a `default_product_key_strategy` option, which will be used if a product-key was not explicitly provided in the `valint.product-key` option. For example, the `platforms bom k8s --default_product_key_strategy namespace` will use the namespace as the product-key.


## The Discover Command
The discover command is used to sample assets data from various sources. The data is stored in an internal database, which is used by the evidence generation and policy evaluation commands. To run the discover command you need to provide the access data to the resources and scoping information. Access data typically includes providing a `url` and access data such as a `token` or `username` and `password`.

Notice that the database created should be accessible for running the other commands later on.

### Common Options
The `--db.local.store_policy` option defines the policy for handling local data collection, allowing either "update" to modify existing data or "replace" to overwrite it entirely, with "update" as the default behavior. When using `replace` only data relevent to the specific plafrom will be replaced.

The `--db.update_period` option specifies whether to run the discovery, if it has been already done in the pervious period, specified in days.

### Gitlab Discovery
Gitlab discovery samples the following assets: organization, projects, users, tokens, and pipelines.
To run the discover process on a Gitlab account:
```bash
platforms discover gitlab --token $TOKEN
```
The token should have admin permissions (as it is needed for reading secrets information).

#### Gitlab Discovery Options
The option `--token `is mandatory and used for providing the GitLab token, with a default set from environment variables CI_JOB_TOKEN or GITLAB_TOKEN.

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

### DockerHub Discovery
DockerHub discovery samples the following assets: namespaces, repositories and repository_tags.
To run the discover process on a DockerHub account:
```bash
platforms discover dockerhub --username $USERNAME --password $PASSWORD
```

#### DockerHub Discovery Options
The option --username allows for the specification of a DockerHub username, with the default set from the environment variable DOCKERHUB_USERNAME.

The option --password provides for entering a DockerHub password, with the default coming from the environment variable DOCKERHUB_PASSWORD.

The option --url sets the DockerHub base URL, defaulting to "https://hub.docker.com".

The option --instance is used to specify a unique DockerHub instance string, with an empty string as the default.

The option --scope.namespace allows specifying DockerHub namespaces, defaulting to the username or ["*"] for all namespaces.

The option --scope.repository is used for specifying DockerHub repositories to include, with a default wildcard ["*"].

The option --scope.repository_tags specifies DockerHub tags to include, with a default of ["*"] to include all tags.

The option --exclude.repository is used for listing DockerHub repository wildcards to exclude from the discovery process.

The option --exclude.repository_tags provides for specifying DockerHub tags to exclude from the discovery process.

The option --scope.past_days sets the number of past days for considering tags, ignoring those pushed earlier than this number of days, with a default of 30 days.


### K8s Discovery
Kubernetes discovery samples the following asstes: namespaces, pods and secrets. Pod information includes images.

To run the discover process on a K8s cluster:
```bash
platforms discover k8s --url https://my-cluster --token $TOKEN
```

For all discovery capabilities, the token should have namespacs, pods and secrets permissions. Scripts for automating generation of these tokens is provided separately.

Note the only secrets metdata is stored in the database, not the actual secrets.

#### K8s Discovery Options

The option `--url` is used for specifying the Kubernetes API URL, which is mandatory and can be set by an environment variable K8S_URL if not provided directly.

The option `--token` is used for providing the authentication token required for access to Kubernetes pods and secrets, mandatory and can be sourced from an environment variable K8S_TOKEN if not explicitly given.

The option `--scope.namespace` is used for specifying Kubernetes namespaces to include in the discovery process, using a wildcard list with a default of ["*"] to include all.

The option `--scope.pod` is used for defining a list of Kubernetes pods to be included in the discovery process, with a default wildcard ["*"] to include all pods.

The option `--scope.image` is used for specifying Kubernetes images to include in the discovery process, using a wildcard list with a default of ["*"] to include all images.

The option `--exclude.namespace` is used for listing namespaces that should be excluded from the discovery process.

The option `--exclude.pod` is used for identifying specific pods to exclude from the discovery process.

The option `--exclude.image` is used for specifying images to exclude from the discovery process.

The option `--scope.secret.skip` is used for opting out of secrets discovery within the Kubernetes environment.

## The Evidence Command
This command is used for uploading evidence, bases on the assets discovered in the previous step, to the attestation store.
This command is for creating platform-evidence; creating SBOMs of assets such as DockerHub images is done through the `bom` command.

The evidence command uses Scribe's `valint`tool to upload the evidence and to sign it if necssary.

### Common Options

The option `--db.local.path` sets the path for local report storage, with a default specified by default_db_path.

The option `--evidence.local.path` specifies the directory path for exporting local copies of the evidence, defaulting to "output".

The option `--evidence.local.prefix` allows for a prefix to be added to the exported local report filenames, with an empty string as the default.

The option `--evidence.local_only` enables the exclusive export of local evidence, without uploading them to any attestation store.

Following are options that configure Scribe's `valint` tool:

The option `--valint.scribe.client-id` sets the Scribe client ID, with an empty string as the default. The `valint` tool will uset the environment varialble `SCRIBE_CLIENT_ID` if it exists.

The option `--valint.scribe.client-secret` specifies the Scribe client secret, also defaulting to an empty string. The `valint` tool will use the environment variable `SCRIBE_CLIENT_SECRET` if it exists.

The option `--valint.scribe.enable` allows for enabling the Scribe client, with an empty string as default indicating it's disabled by default.

The option `--valint.context-type` sets the Valint context type, with the default potentially sourced from the VALINT_CONTEXT_TYPE environment variable.

The option `--valint.log-level` specifies the log level for Valint, defaulting to an empty string.

The option `--valint.output-directory` sets the directory for local evidence caching, with a default defined by default_valint_output_directory.

The option `--valint.bin specifies` the path to the Valint CLI binary, defaulting to a path under the user's home directory.

The option `--valint.product-key` sets the evidence product key, with "factory" as the default.

The option `--valint.product-version` specifies the version of the evidence product, defaulting to an empty string.

The option `--valint.predicate-type` sets the evidence predicate type, with a default URL specifying the evidence version.

The option `--valint.attest specifies` the type of evidence attest, defaulting to "x509-env".

The option `--valint.disable-evidence-cache` disables the caching of evidence, enhancing privacy or security concerns.

The option `--valint.sign` enables the signing of evidence to verify its integrity and source.

### Gitlab Evidence
Gitlabe evidence generation supports generation of organization evidence and project evidence. 

To generate evidence for a Gitlab account:
```bash
platforms evidence gitlab --organization.mapping "my-org::my-product::1.0" --project.mapping "my-project::my-product::1.0"
```

#### Gitlab Evidence Options
The option `--types` defines the which types of evidence to create, allowing choices among "all", "organization", or "project", with "all" as the default.

The option `--instance` specifies a unique GitLab instance string, with an empty string as the default.

The option `--scope.organization` allows for specifying a list of GitLab organizations to include in evidence collection, with a default of None implying all organizations.

The option `--scope.project` sets the GitLab projects or repositories to include, using wildcards with a default of ["*"] for all projects.

The option `--scope.branch` specifies the GitLab branch wildcards to include in evidence collection, with ["*"] as the default for all branches.

The option `--organization.many` enables the export a separate evidence for each organization level evidence, set to false by default to include all.

The option `--project.many` allows for the export a separate evidence for each project, with false as the default to include every project.

The option `--commit.skip` enables skipping the inclusion of commits in the project evidence.

The option `--pipeline.skip` allows for omitting pipeline information from the evidence.

The option `--default_product_key_strategy` sets the strategy for overriding product keys with "mapping" as the default and only option.

The option `--organization.mapping` specifies the mappings of organization assets to product keys and versions, expecting a format of "wildcarded-organization::product_key::product_version".

The option `--project.mapping defines the mappings for project assets to product keys and versions, also in the format of "wildcareded-project::product_key::product_version".

### DockerHub evidence
DockerHub evidence generation supports the generation of namespace and repository evidence.
To generate evidence for a DockerHub account:
```bash
platforms evidence dockerhub --namespace.mapping "my-namespace::my-product::1.0" --repository.mapping "my-repo::my-product::1.0"
```

#### DockerHub Evidence Options
The option `--instance` specifies a unique DockerHub instance string, with an empty string as the default.

The option `--types` defines the scope of evidence creation with options "all", "token", "repository", or "namespace", defaulting to "all".

The option `--scope.namespace` allows for specifying DockerHub namespaces to include, with a default wildcard ["*"] for all namespaces.

The option `--scope.repository` sets the DockerHub repositories to include, using wildcards with a default of ["*"] for all repositories.

The option `--scope.repository_tags` specifies the DockerHub tags to include, with a default of ["*"] for all tags.

The option `--exclude.repository provides` for specifying DockerHub repository wildcards to exclude from evidence.

The option `--exclude.repository_tags` allows for specifying DockerHub tags to exclude from the evidence collection.

The option `--namespace.many` enables the export of a separate evidence for each namespaces.

The option `--repository.many` controls the export of a separate evidence for each repository.

The option `--default_product_key_strategy` sets the strategy for overriding product keys with "mapping" as the default and only option.

The option `--repository.mapping` specifies the mapping of repository assets to product keys and versions, expecting a format of "asset::product_key::product_version".

The option `--token.mapping` defines the mapping for repository tags to product keys and versions, also in the format of "asset::product_key::product_version".

### K8s Evidence
K8s evidence generation supports the generation of namespace and pod evidence. Namespace evidence includes secrets metadata (if it was not scoped out)
To generate evidence for a K8s cluster:
```bash
platforms evidence k8s --namespace.mapping "my-namespace::my-product::1.0" --pod.mapping "my-pod::my-product::1.0"
```

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

## The BOM Command
The BOM command is used to generate SBOMs of assets. Currently, we support generating SBOMs of DockerHub images and K8s clusters.
This command enables users to generate SBOMs on scale.

### Common Options
The option `--allow-failures` enables allowing failures without returning an error code.

The option -`-db.local.path` sets the local database path, with a default specified by default_db_path.

The option `--save-scan-plan` enables saving the scan plan to a JSON file.

The option `--dry-run` enables a dry run without actual execution of `valint` (used for debug purposes).

The option `--valint.scribe.client-id` specifies the Scribe client ID, with an empty string as the default. The `valint` tool will use the environment variable `SCRIBE_CLIENT_ID` if it exists.

The option `--valint.scribe.client-secret` sets the Scribe client secret, also defaulting to an empty string.  The `valint` tool will use the environment variable `SCRIBE_CLIENT_SECRET` if it exists.

The option `--valint.scribe.enable` enables the Scribe client, with an empty string as default indicating it's disabled by default.

The option `--valint.context-type` sets the Valint context type, with the default potentially sourced from the VALINT_CONTEXT_TYPE environment variable.

The option `--valint.log-level` specifies the log level for Valint, defaulting to an empty string.

The option `--valint.output-directory` sets the directory for local evidence caching, with a default defined by default_valint_output_directory.

The option `--valint.bin` specifies the path to the Valint CLI binary, defaulting to a path under the user's home directory.

The option `--valint.product-key` sets the evidence product key, with an empty string as the default.

The option `--valint.product-version` specifies the version of the evidence product, defaulting to an empty string.

The option `--valint.predicate-type` sets the evidence predicate type, with an empty string as the default.

The option `--valint.attest` specifies the type of evidence signing methon, defaulting to "x509-env".

The option `--valint.disable-evidence-cache` disables the caching of evidence, enhancing privacy or security concerns.

The option `--valint.sign enables the signing` of evidence to verify its integrity and source.

The option `--monitor.mount` sets the monitor disk usage mount path, with a default possibly sourced from the MONITOR_MOUNT environment variable.

The option `--monitor.threshold` sets the monitor disk usage threshold, with a default of 90.

The option `--monitor.clean-docker` enables automatic cleaning of the docker cache when disk usage exceeds the threshold.

### DockerHub BOM
To generate SBOMs of DockerHub images:
```bash
platforms bom dockerhub --image.mapping "my-namespace/my-image:my-tag::my-product::1.0"
```

Note that the image charactarizaition string is a wildcarded string, some usefule valid examples are:
* `*:latest` - all images with the latest tag.
* `my-namespace/*:latest` - all images in the my-namespace with the latest tag.
* `*postgres*` - all images with the word "postgres" in the name.

#### DockerHub BOM Options

The option `--instance` specifies a unique DockerHub instance string, with an empty string as the default.

The option `--default_product_key_strategy` sets the strategy for overriding product keys with "mapping" as the default for using the user-proivded mappings. Other optoins are:
* `namespace` - to use the namespace as the product key.
* `pod` - to use the image name as the product key.
* `tag` - to use the tag as the product key.

The option `--default_product_version_strategy` sets the strategy for overriding product versions. This option is ignored when specicyping the `--default_produc_key_strategy` as `mapping`.

The option `--scope.namespace` allows for specifying DockerHub namespaces to include, with a default wildcard ["*"] for all namespaces.

The option `--scope.repository` sets the DockerHub repositories to include, using wildcards with a default of ["*"] for all repositories.

The option `--exclude.repository` provides for specifying DockerHub repository wildcards to exclude from the discovery process.

The option `--scope.repository_tags` specifies the DockerHub tags to include, with a default of ["*"] for all tags.

The option `--exclude.repository_tags` allows for specifying DockerHub tags to exclude from the discovery process.

The option `--image.mapping` defines the mapping for DockerHub image names to product key and version, accommodating wildcards.

### K8s BOM
To generate SBOMs of K8s images:
```bash
platforms bom k8s --image.mapping "my-namespace::my-pod::my-image::my-product::1.0"
```

Note that the image charactarizaition string is a wildcarded string, with a separate sections for namespace, pod and image. Some usefule valid examples are:
* `*::*::*:latest` - all cluster images with the latest tag.
* `prod*::*::my-image-prefix*` - all images in the prod* namespace with the my-image-prefix as the prefix of their name.
* `prod*::*::*:latest` - all images in the prod* namespace with the latest tag.

#### K8s BOM Options
The option `--instance` specifies a unique Kubernetes instance string, with an empty string as the default.

The option `--default_product_key_strategy` sets the strategy for overriding product keys, with "mapping" as the default in order to use the user provided mappings. Other options are:


The option `--default_product_version_strategy` sets the strategy for overriding product versions. This option is ignored when specicyping the `--default_produc_key_strategy` as `mapping`. 

The option `--scope.namespace` allows for specifying Kubernetes namespaces to include, with a default wildcard ["*"] for all namespaces.

The option `--scope.pod` sets the Kubernetes pods to include, using wildcards with a default of ["*"] for all pods.

The option `--scope.image` specifies the Kubernetes images to include, with a default of ["*"] for all images.

The option `--exclude.namespace` provides for specifying namespaces to exclude from the discovery process.

The option `--exclude.pod` allows for specifying pods to exclude from the discovery process.

The option `--exclude.image` specifies images to exclude from the discovery process.

The option `--image.mapping` defines the mapping for Kubernetes namespace, pod, and image to product key and version.

## The Verify Command
The verify command is used to evaluate policies on the evidence generated in the previous step. The policies are written in a policy-as-code framework, which provides user with out-of-the-box policies and the ability to write custom policies.

Currently, the verify command supports using the same policy bundle for all the evaluations; in order to run different policies for different products, one can run the command multiple times with different policy bundles specified.

The recommended use of the verify command with the product-mapping capabilities; this enables the user to track policy evaluations on the product level, and to get a product-level view of the security posture.

### Common Options
The option `--db.local.path` sets the local report path, with a default specified by `default_db_path`.

The option `--valint.scribe.client-id` specifies the Scribe client ID, with an empty string as the default. The `valint` tool will use the environment variable `SCRIBE_CLIENT_ID` if it exists.

The option `--valint.scribe.client-secret` sets the Scribe client secret, also defaulting to an empty string. The `valint` tool will use the environment variable `SCRIBE_CLIENT_SECRET` if it exists.

The option `--valint.scribe.enable` enables the Scribe client, with an empty string as default indicating it's disabled by default.

The option `--valint.context-type` sets the Valint context type, with the default potentially sourced from the `VALINT_CONTEXT_TYPE` environment variable.

The option `--valint.log-level` specifies the log level for Valint, defaulting to an empty string.

The option `--valint.output-directory` sets the directory for local evidence caching, with a default defined by `default_valint_output_directory`.

The option `--valint.bin` specifies the path to the Valint CLI binary, defaulting to a path under the user's home directory.

The option `--valint.product-key` sets the evidence product key, with an empty string as the default.

The option `--valint.product-version` specifies the version of the evidence product, defaulting to an empty string.

The option `--valint.predicate-type` sets the evidence predicate type, with an empty string as the default.

The option `--valint.attest` specifies the type of evidence attest, defaulting to "x509-env".

The option `--valint.disable-evidence-cache` disables the caching of evidence, enhancing privacy or security concerns.

The option `--valint.sign` enables the signing of evidence to verify its integrity and source.

The following options are used to tweek the fetching of specific or customized policy bundles. Documentation of these features is part of the `valint` tools documentation and can be found [here](https://scribe-security.netlify.app/docs/introducing-scribe/what-is-scribe/)

The option `--valint.bundle` sets the bundle git branch, with an empty string as the default.

The option `--valint.git-branch` sets the bundle git branch to "discovery".

The option `--valint.git-commit` specifies the bundle git commit, with an empty string as the default.

The option `--valint.git-tag` sets the bundle git tag, with an empty string as the default.


### Gitlab Verify
To evaluate policies on Gitlab evidence:
```bash
platforms verify gitlab --organization.mapping "my-org::my-product::1.0" --project.mapping "my-project::my-product::1.0"
```

#### Gitlab Verify Options


### DockerHub Verify

#### DockerHub Verify Options
The option `--instance` specifies a unique DockerHub instance string, with an empty string as the default.

The option `--types` defines which evidence to create, scoped by scope parameters, with "namespace-images" as the default. Other options are `token`, `repository`, `namespace`, and `all`. These options run verification on the repsective evience types.

The option `--default_product_key_strategy` sets the strategy for overriding product keys, with "mapping" as the default, to use the user-provided mappings.

The option `--default_product_version_strategy` sets the strategy for overriding product versions, with "short_image_id" as the default. This options is ignored when the `--default_product_key_strategy` is set to `mapping`.

The option `--scope.namespace` allows for specifying DockerHub namespaces to include, with a default wildcard ["*"].

The option `--scope.repository` sets the DockerHub repositories to include, with a default wildcard ["*"].

The option `--scope.repository_tags` specifies the DockerHub tags to include, with a default of ["*"].

The option `--exclude.repository` provides for specifying DockerHub repository wildcards to exclude.

The option `--exclude.repository_tags` allows for specifying DockerHub tags to exclude.

The option `--image.mapping` defines the mapping for DockerHub image names to product key and version.

The option `--image.policy` sets the image mapping policy file, defaulting to "ct-13@discovery".

### K8s Verify

#### K8s Verify Options

The option `--instance` specifies a unique Kubernetes instance string, with an empty string as the default.

The option `--types` defines which evidence to create, scoped by scope parameters, with "cluster-images" as the default. Other options are `namespace`, `pod` and all. These options run verification on the repsective evience types.

The option `--default_product_key_strategy` sets the strategy for overriding product keys, with "mapping" as the default.

The option `--default_product_version_strategy` sets the strategy for overriding product versions, with "namespace_hash" as the default. This options is ignored when the `--default_product_key_strategy` is set to `mapping`.

The option `--scope.namespace` allows for specifying Kubernetes namespaces to include, with a default wildcard ["*"].

The option `--scope.pod` sets the Kubernetes pods to include, with a default wildcard ["*"].

The option `--scope.secrets.skip` enables skipping secrets information in the evidence.

The option `--namespace.many` enables exporting all namespaces.

The option `--pod.many` enables exporting all pods.

The option `--image.mapping` defines the mapping for Kubernetes namespace, pod, and image to product key and version.

The option `--cluster-images.policy` sets the image policy file, defaulting to "image-policy-unsigned@discovery".

# Notes - To be removed from the distribution version
1. Consider moving the database path to the global options - it is needed for all the commands.
2. Repo with K8s token generation scripts.
3. Revisit the `.many` options - 1. what will be the final default?
4. Support specifying a policy for dockerhub and k8s verifications of evidence other than images.

Comments from presenting to Doron and Guy:
1. Scanning instead of discovery.
2. Instance - try other wording?
3. Broad and shallow discovery should be the first step (names only)
4. show mappings as .yaml and not commandline
5. missing : under maooing assets
6. change commit default to skip
7. docker hub section needs to be formatted
8. generate organization attestation automatically
9. add visualization of orgamization-products tree
10. add a note that user must be logged in to the container registry, i.e. valint should have access to registry.