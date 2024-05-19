---
sidebar_label: "Alternative evidence stores"
title: "Integrating with Alternative types of evidence stores"
sidebar_position: 4
toc_min_heading_level: 2
toc_max_heading_level: 5
---

### OCI Evidence store

In standalone deployments or other cases when you don’t want to connect your SDLC with Scribe Hub, you can use an OCI registry to store and retrieve evidence. This allows you to store evidence from your CI pipeline and retrieve it at the point of admission control into your Kubernetes cluster.

#### Flags

* `--oci` Enable OCI store
* `--oci-repo` Evidence store location
`oci-repo` setting indicates the location in a registry under which the evidence is stored. It must be a dedicated location in an OCI registry. for example, ```scribesecuriy.jfrog.io/my_docker-registry/evidence```.

:::note
Docker Hub does not support the subpath format, `oci-repo` should be set to your Docker hub Username.
:::

Some registries such as Artifactory allow multi-layer format for repo names such as,
```my_org.jfrog.io/policies/attestations```

#### Before you begin​
Evidence can be stored in any accessible registry.
* Write access is required for upload (generate).
* Read access is required for download (verify).
You must first log in with the required access privileges to your registry before calling Valint. For example, using the `docker login` command.

#### Usage
```
# Generating evidence, storing on [my_repo] OCI repo.
valint slsa [target] -o [attest, statement] --oci --oci-repo=[my_repo]

# Verifying evidence, pulling attestation from [my_repo] OCI repo.
valint verify [target] -i [attest-slsa, statement-slsa] --oci --oci-repo=[my_repo]
```
For image targets only you may attach the evidence in the same repo as the image.
```
valint slsa [image] -o [attest, statement] --oci

valint verify [image] -i [attest-slsa, statement-slsa] --oci
```
### Cache Evidence store
Valint supports both storage and verification flows for attestations and statement objects utilizing a local directory as an evidence store. This is the simplest form and is mainly used to cache previous evidence creation

#### Flags
* `--cache-enable` 
* `--output-directory` 
* `--force`
By default, this cache store is enabled. To disable use `--cache-enable=false`.

#### Usage
```
# Generating evidence, storing on [my_dir] local directory.
valint slsa [target] -o [attest, statement] --output-directory=[my_dir]

# Verifying evidence, pulling attestation from [my_dir] local directory.
valint verify [target] -i [attest-slsa, statement-slsa] --output-directory=[my_dir]
```
By default, the evidence is written to `~/.cache/valint/`, use `--output-file`, `-d`, or `--output-directory` to customize the evidence output location. 


