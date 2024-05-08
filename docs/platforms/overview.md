---
sidebar_label: "Platforms Overview"
title: "Platforms Overview"
sidebar_position: 1
---

# Platforms: Scribe's Scanning and Policy Evaluation Engine

## What is `platforms`?
Platforms is a dockerized cli tool, that can be used to scan and evaluate policies on your infrastructure. It is a part of the Scribe suite of tools, which are designed to help you secure your software supply chain.

This version of `platforms` supports Gitlab, DockerHub, and K8s. Under construction, we have support for GitHub, Bitbucket, Jenkins, and AWS-ECR.

Key Features:
* Discovery of assets
* Measuring security posture, activity, and volume data of assets
* Powerful scoping and filtering capabilities
* Powerful capabilities to map assets to Scribe Products
* Experimental: Extracting data from build logs.

## Concepts
* Assets: Assets are the resources that are being scanned. They can be anything from a docker image to a git repository.
* Products: Products are software products that are made up of multiple assets. Examples:
    * A simple application may be made up of a single code repository and a single CI pipeline that generates a single docker image.
    * A complex application may be made up of multiple code repositories, multiple CI pipelines, and multiple docker images. It may also include external assets such as docker images from DockerHub.
    * The Product point of view serves the product-security team, while assets are the day-to-day concern of the development and operations teams.
    * Scribe's platform tool enables and helps users to map assets to products.
* Mapping is the process of mapping evidence or SBOMs to products.
    * Mapping can done in various ways, the simplest - to specify which assets belong to which products.
    * For some of the use cases, the mapping can be done automatically, for example - to create a Scribe Product for each K8s namespace. The mapping strategy is defined using the `--default_product_key_strategy` option, available in many sub-commands.
    * Note that the mapping is many to many; a single asset can be part of multiple products (e.g. a microservice) and a single product can have multiple assets (e.g. a product that consists of multiple microservices).
* Evidence: Evidence is the data that is generated from the assets. It can be anything from metadata and settings of source-code-repo, an SBOM of a docker image, or a list of secrets metadata of a K8s cluster.
    * To secure the evidence from being falsified, tampered with, or denied, attestations can be signed. Scribe tools provide the capability to sign the evidence using various signing mechanisms (PKI, Sigstore)
* Discovery: Discovery is the process of sampling asset data from various sources.
    * The input to the discovery process is access data to the resources and scoping information.
    * The output of the discovery process is an internal database of assets.
* Evidence Generation: Evidence generation is the process of generating evidence from the assets sampled data. 
    * The input to the evidence-generation process is the internal database of assets, scoping, and product mapping information.
    * The output of the evidence generation process is a set of evidence uploaded to an attestation store, which by default is ScribeHub.
* SBOM Generation: Automation of SBOM Generation of assets.
    * Currently, we support generating SBOMs of DockerHub accounts and K8s clusters.
    * This capability enables users to generate SBOMs on scale, and to focus on the in-production assets, thus enabling the security teams to focus on the most critical assets.
* Policy Evaluation: Policy evaluation is the process of evaluating policies on the evidence generated.
    * Scribe provides a policy-as-code framework, which provides users with out-of-the-box policies and the ability to write custom policies.
    * Policies are applied to evidence; the policy evaluation process involves pulling the relevant attestations from the attestation store and evaluating the policies on the evidence. For example, to verify the security of a source-code repo, the policy evaluation process will consume evidence about the repo and the account, and evaluate policies such as "limited admins", "all secrets have an expiration date", "at least 2 reviewers are required for merging a PR", etc.
