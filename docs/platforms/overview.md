---
sidebar_label: "Platforms Overview"
title: "Platforms Overview"
sidebar_position: 1
---

# Platforms: Scribe's Scanning and Policy Evaluation Engine

## What is `platforms`?
`platforms` is a Dockerized CLI tool designed to scan and evaluate policies on your infrastructure. It is part of the Scribe suite of tools, which aim to secure your software supply chain.

## Important Note
> The `evidence` command is deprecated and will be removed in future releases. All functionality is now included in the merged `discover` command. Users are encouraged to transition to this unified approach for consistency and expanded capabilities. [Learn how to migrate](#migration-guide-for-v0.3.0-and-above).

## Supported Platforms
- GitLab SCM and CI
- GitHub SCM and CI
- DockerHub Image Registry
- Kubernetes CD
- Bitbucket Cloud SCM and CI
- Bitbucket Data Center SCM and CI
- Jenkins CI
- AWS ECR Image Registry
- JFrog Artifactory Image Registry

### Key Features
**Asset Discovery**: Identify resources in your infrastructure.

**Security Posture Measurement**: Evaluate activity and volume data of assets.

**Advanced Scoping and Filtering**: Customize views and focus on relevant data.

**Asset-to-Product Mapping**: Align resources with Scribe products.

**Experimental**: Extract data from build logs to gain deeper insights.

## Concepts

### Assets
Assets are the resources being scanned, such as Docker images or Git repositories.

### Products
Products are software solutions composed of multiple assets. For example, a simple application might include one code repository, one CI pipeline, and one Docker image. A complex application might span multiple repositories, pipelines, and Docker images, plus external assets like DockerHub images.

`platforms` helps users map assets to products, aligning day-to-day operations with product security goals.

### Mapping
Mapping links evidence or SBOMs to products. The simplest approach is specifying which assets belong to which products. Advanced use cases include automated strategies, such as creating a Scribe Product for each Kubernetes namespace using the `--default_product_key_strategy` option.

> Mapping is a many-to-many relationship: an asset can belong to multiple products (e.g., a microservice), and a product can include multiple assets.



### Product Key and Version Strategies

The new `--strategy` and `--version-strategy` flags provide powerful, rule-based alternatives to manual mapping.

* **`--strategy scm`**: This is a new, dynamic strategy that automatically generates the `product_key` based on the asset's full path within the SCM platform.
    * **GitHub**: `product_key` is derived from the full repository name, in the format `organization/repository`.
    * **GitLab**: `product_key` is derived from the full project path, in the format `organization/project`.
    * **BitBucket**: `product_key` is derived from the repository path, in the format `workspace/repository`.
    * **Azure**: `product_key` is derived from the repository path, in the format `organization/project/repository`.

* **`--version-strategy`**: Determines the `product_version` dynamically. This is especially useful in CI/CD pipelines.
    * `ref`: Uses the branch or tag name (e.g., `main`, `v1.2.3`).
    * `sha`: Uses the short commit SHA of the branch or tag (e.g., `a1b2c3d`).
    * `pipeline`: Uses the unique ID of the CI pipeline run.
    * `latest` (default): A fallback option that assigns the version "latest".

This new approach drastically reduces manual configuration, especially for large organizations, and ensures that your Scribe data remains consistently aligned with your development lifecycle.

### Evidence
Evidence is data generated from assets, such as metadata from source code repositories, SBOMs for Docker images, or secrets metadata for Kubernetes clusters. Evidence is stored in an attestation store (default: ScribeHub, but local and OCI storage options are also supported).

> Attestations can be signed for integrity and authenticity using PKI or Sigstore mechanisms.

### Discovery
Discovery involves sampling asset data from various sources. The input is resource access data and scoping details, and the output is evidence generated from sampled data.

### SBOM Generation
Automates the generation of SBOMs for assets at scale. A common use case involves automating SBOM creation and analysis for an entire Kubernetes cluster or for all images across a set of Artifactory registries.

* **Image SBOM**: Currently supported platforms include DockerHub, ECR, JFrog Artifactory, and Kubernetes clusters.  
* **Source SBOM**: Currently supported platforms include GitHub, GitLab, and Bitbucket.

### Policy Evaluation
Policy evaluation assesses evidence against defined policies using Scribe's policy-as-code framework. It includes out-of-the-box policies and custom policy creation. For example, evaluating source code repositories for limited admin access, secret expiration, and PR review requirements.

> Output: Policy results in SARIF format.

### Migration Guide for `v0.3.0` and Above
If you are using `platforms` versions below `v0.3.0`, the `evidence` command needs to be migrated to the `discover` command instead.

For Example, previously you may have used:

```bash
platforms discover github \
    --scope.organization=scribe-security
    --scope.repository *mongo* *example_repo
    --workflow.skip --commit.skip --scope.branch=main

platforms evidence github \
    --organization.mapping=scribe-security::example_repo::v1
    --repository.mapping=scribe-security*example_repo::example_repo::v1
```

With `v0.3.0` or above, you should update to:

```bash
platforms discover github \
    --scope.organization=scribe-security
    --scope.repository *mongo* *example_repo
    --workflow.skip --commit.skip --scope.branch=main
    --organization.mapping=scribe-security::example_repo::v1
    --repository.mapping=scribe-security*example_repo::example_repo::v1
```

> Note: Asset `single` flags are no longer supported.

> Note: To disable evidence export from discover command run `platforms discover --skip-evidence ...`.