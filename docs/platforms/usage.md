---
sidebar_label: "Platform CLI Usage"
title: "Using the `platforms` Tool"
sidebar_position: 2
---

## Installing Platforms CLI

Use the following command line interface (CLI) installation options:

<details>
  <summary> Docker image </summary>

Pull the `platforms` release binary wrapped in its relevant docker image. <br />
Tag value should be the requested version.

```bash
docker pull scribesecurity/platforms:latest
```

</details>

### CI integration

Platforms CLI has supported CI integrations to automate the discovery, evidence generation, SBOM generation and policy evaluation process.

* [Gitlab Integration](https://scribe-security.netlify.app/docs/platforms/gitlab-integration.md)

## CLI Commands Structure
All the commands in the `platforms` tool are structured as follows:
```bash
platforms [global-options] command [command options] platform [platform options]
```

* The global `options` are the global options that apply to all the commands.
* The `command` is the action that you want to perform. It can be one of the following:
    * `discover`: To discover assets.
    * `evidence`: To generate evidence.
    * `bom`: To generate SBOMs.
    * `verify`: To evaluate policies.
* command options are the options that apply to the command.
* platform is the platform on which you want to act. It can be one of the following:
    * `gitlab`: To act on Gitlab or Gitlab evidence.
    * `dockerhub`: To act on DockerHub, Dockerhub images, or Dockerhub evidence.
    * `k8s`: To perform the action on K8s or K8s evidence.
    * `jfrog`: To act on Jfrog, Jfrog images, or Jfrog evidence.
    * `ecr`: To act on ECR, ECR images, or ECR evidence.

* `platforms` options are the options that apply to the platform. Most of the platform-specific options are for scoping, filtering, and mapping assets to products.

In the following sections, we shall explain each command in detail, by going through all commands for each platform.

## Global options
<!--
{
    "command": "platforms --help"
}
-->
<!-- { "object-type": "command-output-start" } -->
```bash
usage: platforms [-h] [--config CONFIG] [--print_config [=flags]] [--log-level {DEBUG,INFO,WARNING,ERROR,CRITICAL}]
                 [--log-file LOG_FILE] [--db.local.path PATH]
                 {discover,evidence,bom,verify} ...

CLI tool for interacting with platforms APIs

options:
  -h, --help            Show this help message and exit.
  --config CONFIG       Path to a configuration file.
  --print_config [=flags]
                        Print the configuration after applying all other arguments and exit. The optional flags customizes the output and
                        are one or more keywords separated by comma. The supported flags are: comments, skip_default, skip_null.
  --log-level {DEBUG,INFO,WARNING,ERROR,CRITICAL}
                        Set the logging level (default: INFO)
  --log-file LOG_FILE   Set the logging file (default: )
  --db.local.path PATH  Local db path (default: platforms.db)

subcommands:
  For more details of each subcommand, add it as an argument followed by --help.

  Available subcommands:
    discover
    evidence
    bom
    verify
```
<!-- { "object-type": "command-output-end" } -->


## Common Options

All the commands use an internal assets database. The path to the database can be set using the `--db.local.path` option. This option defaults to `platforms.db` or the value of the environment variable `PLATFORMS_DB_PATH`.

The `--instance` option enables managing multiple instances of development platforms, such as different Gitlab or DockerHub accounts, or different K8s clusters. The `instance` is an identifier - it must be used consistently with all the commands.

Scoping and excluding assets for various commands is supported. The scope values or to exclude are provided as a list of strings, these strings can include wildcards. For example, 
* To scope the K8s scan only to namespaces that start with "prod", use the option `--scope.namespace prod*`.
* To scope to both "prod" and "dev" namespaces, the option `--scope.namespace prod*, dev*` can be used. 

Options for **mapping assets to Scribe Products and Product-versions** are supported for all relevant commands. The mapping is done using an `--<asset>.mapping` option, followed by a list of asset-mapping strings. The common format for the asset-mapping string is `asset_name::product_key::product_version`. The asset name part supports wildcards. 

For example,

* To map the Nautilus Gitlab project to the Accounting product, version 1.0 use the option `--project.mapping nautilus::Accounting::1.0`.

* To map all the Gitlab projects that start with "service" to ComplexProduct1 and ComplexProduct2 use the option `--project.mapping service*::ComplexProduct1::1.0, service*::ComplexProduct2::1.0`.

* The K8s asset-mapping strings for mapping images to be scanned to products are in the format `namespace::pod::image::product_key::product_version`. For example,

* To map all the images in the "prod" namespace to the Accounting product, version 1.0, use the option `--image.mapping prod::*::Accounting::1.0`.

* To map all the images from my-company DockerHub namespace to the Gizmo product, version 2.0 use the option `--image.mapping my-company/*::Gizmo::2.0`.

> Mapping is another scoping stage; if a mapping is done, only the assets that are mapped will be considered for the command.

> Some of the platforms support a `default_product_key_strategy` option, which will be used if a product-key was not explicitly provided in the `valint.product-key` option. For example, the `platforms bom k8s --default_product_key_strategy namespace` will use the namespace as the product-key.
