---
sidebar_label: "Alternative evidence stores"
title: "Integrating with Alternative types of evidence stores"
sidebar_position: 4
toc_min_heading_level: 2
toc_max_heading_level: 5
---

### OCI Evidence Store

In standalone deployments or scenarios where connecting your SDLC with Scribe Hub is not desired, you can leverage an OCI registry to store and retrieve evidence. This setup enables evidence storage from your CI pipeline and retrieval during admission control in a Kubernetes cluster.

#### Flags

* `--oci`: Enables the use of an OCI evidence store.
* `--oci-repo`: Specifies the registry location for evidence storage.  
  The `oci-repo` value defines the dedicated location within an OCI registry for storing evidence. For example: `scribesecurity.jfrog.io/my_docker-registry/evidence`.

:::note  
Docker Hub does not support subpath formats. When using Docker Hub, set `oci-repo` to your Docker Hub username.  
:::

Some registries, such as Artifactory, support multi-layer repository names. For example:  
`my_org.jfrog.io/policies/attestations`

#### Evidence Storage

Evidence is stored in the specified `oci-repo` location with suffixes based on the asset type:
- **Image assets**: `container`
- **Git assets**: `git`
- **Directory assets**: `directory`
- **Generic assets**: `generic`

If no `oci-repo` is provided, evidence will be stored alongside the image. For additional details, see [Cosign Signed Container Images](https://blog.sigstore.dev/cosign-signed-container-images-c1016862618/).

#### Before You Begin  

Ensure the registry you plan to use is accessible:
* **Write access** is required to upload (generate) evidence.
* **Read access** is required to download (verify) evidence.

You must log in to your registry with appropriate privileges before executing Valint commands. For example, you can use the `docker login` command.

#### Usage

```bash
# Generating evidence and storing it in the [my_repo] OCI repository
valint [bom, slsa] [target] -o [attest, statement] --oci --oci-repo=[my_repo]

# Verifying evidence by retrieving it from the [my_repo] OCI repository
valint verify [target] -i [attest, attest-slsa, attest-generic, statement-slsa] --oci --oci-repo=[my_repo]
```

For image targets, you can store evidence directly in the same repository as the image:

```bash
valint [bom, slsa] [image] -o [attest, statement] --oci

valint verify [image] -i [attest-slsa, statement-slsa] --oci
```

---

### Cache Evidence Store

Valint also supports using a local directory as an evidence store for both generating and verifying attestations and statements. This is a simple option, often used for caching previously created evidence.

#### Flags

* `--cache-enable`: Enables or disables the cache store (default is enabled).
* `--output-directory`: Specifies the local directory for storing evidence.
* `--force`: Forces overwriting existing evidence.

To disable the cache store, use `--cache-enable=false`.

#### Usage

```bash
# Generating evidence and storing it in the [my_dir] local directory
valint slsa [target] -o [attest, statement] --output-directory=[my_dir]

# Verifying evidence by retrieving it from the [my_dir] local directory
valint verify [target] -i [attest-slsa, statement-slsa] --output-directory=[my_dir]
```

By default, evidence is stored in `~/.cache/valint/`. You can customize the output location using options like `--output-file`, `-d`, or `--output-directory`. 