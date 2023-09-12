---
sidebar_label: "GitHub"
title: Integrating Scribe with your GitHub Actions
sidebar_position: 1
toc_min_heading_level: 2
toc_max_heading_level: 5
---

If you are using GitHub Actions as your Continuous Integration tool (CI), use these quick start instructions to integrate Scribe into your pipeline to protect your projects. 

This is the simplified quick-start guide. To learn more about Scribe's GitHub capabilities check out the following GitHub Actions documentation links:
* **[Installer](../../../../docs/integrating-scribe/ci-integrations/github/github-actions/action-installer)**
* **[Bom](../../../../docs/integrating-scribe/ci-integrations/github/github-actions/action-bom.md)**
* **[Verify](../../../../docs/integrating-scribe/ci-integrations/github/github-actions/action-verify)**

### Target types - `[target]`
---
Target types are types of artifacts produced and consumed by your supply chain.
Using supported targets, you can collect evidence and verify compliance on a range of artifacts.

> Fields specified as [target] support the following format.

### Format

`[scheme]:[name]:[tag]` 

> Backwards compatibility: It is still possible to use the `type: [scheme]`, `target: [name]:[tag]` format.

| Sources | target-type | scheme | Description | example
| --- | --- | --- | --- | --- |
| Docker Daemon | image | docker | use the Docker daemon | docker:busybox:latest |
| OCI registry | image | registry | use the docker registry directly | registry:busybox:latest |
| Docker archive | image | docker-archive | use a tarball from disk for archives created from "docker save" | image | docker-archive:path/to/yourimage.tar |
| OCI archive | image | oci-archive | tarball from disk for OCI archives | oci-archive:path/to/yourimage.tar |
| Remote git | git| git | remote repository git | git:https://github.com/yourrepository.git |
| Local git | git | git | local repository git | git:path/to/yourrepository | 
| Directory | dir | dir | directory path on disk | dir:path/to/yourproject | 
| File | file | file | file path on disk | file:path/to/yourproject/file | 

### Evidence Stores
Each storer can be used to store, find and download evidence, unifying all the supply chain evidence into a system is an important part to be able to query any subset for policy validation.

| Type  | Description | requirement |
| --- | --- | --- |
| scribe | Evidence is stored on scribe service | scribe credentials |
| OCI | Evidence is stored on a remote OCI registry | access to a OCI registry |

### Scribe Evidence store
Scribe evidence store allows you to store evidence using scribe Service.

Related Flags:
> Note the flag set:
>* `scribe-client-id`
>* `scribe-client-secret`
>* `scribe-enable`

### Before you begin
Integrating Scribe Hub with your environment requires the following credentials that are found on the **Integrations** page. (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **integrations**)

* **Client ID**
* **Client Secret**

<img src='../../../../img/ci/integrations-secrets.jpg' alt='Scribe Integration Secrets' width='70%' min-width='400px'/>

* Add the credentials according to the **[GitHub instructions](https://docs.github.com/en/actions/security-guides/encrypted-secrets/ "GitHub Instructions")**. Based on the code example below, be sure to call the secrets **clientid** for the **client_id**, and **clientsecret** for the **client_secret**.

* Use the Scribe custom pipe as shown in the example below

### Usage

```yaml
name:  scribe_github_workflow

on: 
  push:
    tags:
      - "*"

jobs:
  scribe-sign-verify:
    runs-on: ubuntu-latest
    steps:

        uses: scribe-security/action-bom@master
        with:
          target: [target]
          format: [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic]
          scribe-enable: true
          scribe-client-id: ${{ secrets.clientid }}
          scribe-client-secret: ${{ secrets.clientsecret }}

        uses: scribe-security/action-verify@master
        with:
          target: [target]
          input-format: [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic]
          scribe-enable: true
          scribe-client-id: ${{ secrets.clientid }}
          scribe-client-secret: ${{ secrets.clientsecret }}
```

You can store the Provenance Document in alternative evidence stores. You can learn more about them **[here](../../other-evidence-stores)**.

<!-- ### Checking policy compliance for your project

Assuming you have connected the ScribeApp with your organizational GitHub account and enacted the SLSA provenance generation code snippet as described above, you will be able to see the SLSA compliance breakdown in each of the future builds of the project where you added the code. 
The SSDF compliance will be checked automatically for each project build run after you have connected the ScribeApp with your organizational GitHub account.
The compliance icons can be seen in the product line:

<img src='../../../../img/ci/new-UI-project.jpg' alt='Project Description'/>

When you click on a project you'll get the list of builds. The compliance icons do not appear here:

<img src='../../../../img/ci/new-UI-version-history.jpg' alt='Project Version History'/>

To see the full compliance breakdown, click on a build-line. You'll get to this screen:

<img src='../../../../img/ci/new-UI-version-details.jpg' alt='Project Version Details'/>

To see the full breakdown of policies - exactly which policies have passed or failed, click on the **Compliance** tab and you'll get to this screen:

<img src='../../../../img/ci/new-UI-version-compliance.jpg' alt='Project Version Compliance'/>

There are 12 SLSA policies that Scribe checks and if all of them are checked out (pass) that means that the build is approved for SLSA level 3.

To learn more about each policy you can either click on them or see the explanation page **[here](../../../../docs/advanced-guide/ssc-regulations/slsapolicies)**.

There are 36 SSDF policies that Scribe checks and if all of them are checked out (pass) that means that the build is compliant with the SSDF requirements.

To learn more about each policy you can either click on them or see the explanation page **[here](../../../../docs/advanced-guide/ssc-regulations/ssdfpolicies)**.
 -->



