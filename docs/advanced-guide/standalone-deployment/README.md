---
sidebar_label: "Stand-alone deployment"
title: Stand-alone deployment
sidebar_position: 1
toc_min_heading_level: 2
toc_max_heading_level: 5
---

:::note
If you are planning to deploy in this mode, you should **[reach out to us](https://scribesecurity.com/contact-us/ "Contact Us")** to discuss a custom license.
:::

In a local deployment, Valint generates SBOMs, collects additional evidence, and uses a filesystem folder or an OCI registry that you provide as a storage place for this evidence. When evaluating a policy, Valint retrieves the necessary evidence from this designated evidence store.

### OCI Evidence store
Valint supports both storage and verification flows for `attestations` and `statement` objects utilizing OCI registry as an evidence store.

Using OCI registry as an evidence store allows you to upload, download and verify evidence across your supply chain in a seamless manner.

Related flags:
* `oci` Enable OCI store.
* `oci-repo` - Evidence store location.

### Before you begin
Evidence can be stored in any accessible registry.
* Write access is required for upload (generate).
* Read access is required for download (verify).

You must first log in with the required access privileges to your registry before calling Valint.
For example, using `docker login` command or `docker/login-action` action.

Here's an example YAML for a GitHub pipeline utilizing an OCI registry instead of uploading evidence to Scribe hub.

```yaml
name:  scribe_github_workflow

env:
  LOGICAL_APP_NAME: demo-project # The app name all these SBOMs will be assosiated with
  APP_VERSION: 1.0.1 # The app version all these SBOMs will be assosiated with
  # SBOM Author meta data - Optional
  AUTHOR_NAME: John-Smith 
  AUTHOR_EMAIL: jhon@thiscompany.com 
  AUTHOR_PHONE: 555-8426157 
  # SBOM Supplier meta data - Optional
  SUPPLIER_NAME: Scribe-Security 
  SUPPLIER_URL: www.scribesecurity.com 
  SUPPLIER_EMAIL: info@scribesecurity.com
  SUPPLIER_PHONE: 001-001-0011

on: 
  push:
    tags:
      - "*"

jobs:
  scribe-sign-verify:
    runs-on: ubuntu-latest
    steps:

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.my_registry }}
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name:  Generate evidence step
        uses: scribe-security/action-bom@master
        with:
          target: [target]
          format: [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic]
          oci: true
          oci-repo: [oci_repo]
          app-name: $LOGICAL_APP_NAME
          app-version: $APP_VERSION
          author-name: $AUTHOR_NAME
          author-email: $AUTHOR_EMAIL
          author-phone: $AUTHOR_PHONE
          supplier-name: $SUPPLIER_NAME
          supplier-url: $SUPPLIER_URL
          supplier-email: $SUPPLIER_EMAIL 
          supplier-phone: $SUPPLIER_PHONE

      - name:  Verify policy step
        uses: scribe-security/action-verify@master
        with:
          target: [target]
          format: [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic]
          oci: true
          oci-repo: [oci_repo]
          app-name: $LOGICAL_APP_NAME
          app-version: $APP_VERSION
          author-name: $AUTHOR_NAME
          author-email: $AUTHOR_EMAIL
          author-phone: $AUTHOR_PHONE
          supplier-name: $SUPPLIER_NAME
          supplier-url: $SUPPLIER_URL
          supplier-email: $SUPPLIER_EMAIL 
          supplier-phone: $SUPPLIER_PHONE
```

### Cache Evidence store
Valint supports both storage and verification flows for `attestations` and `statement` objects utilizing a local directory as an evidence store.
This is the simplest form and is mainly used to cache previous evidence creation. 

Related flags:
* `--cache-enable`
* `--output-directory`
* `--force`

> By default, this cache store enabled, disable by using `--cache-enable=false`

### Usage
```bash
# Generating evidence, storing on [my_dir] local directory.
valint bom [target] -o [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] --output-directory=[my_dir]
Supply chain environment
# Verifying evidence, pulling attestation from [my_dir] local directory.
valint verify [target] -i [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] --output-directory=[my_dir]
```

> By default, the evidence is written to `~/.cache/valint/`, use `--output-file` or `-d`,`--output-directory` to customize the evidence output location. 
