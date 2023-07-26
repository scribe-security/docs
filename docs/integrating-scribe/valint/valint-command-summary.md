---
sidebar_label: "Valint Command Summary"
title: Valint Command Summary
sidebar_position: 2
toc_min_heading_level: 2
toc_max_heading_level: 5
---

### Bom

Collect, Create and Store evidence for artifacts (SBOMs, SLSA provenance) or any third-party tools.

```
valint bom [TARGET] [flags]
```

### Examples for running `valint bom`

```
  valint bom <target>
  
  <target> Target object name format=[<image:tag>, <dir path>, <git url>]

  valint bom alpine:latest                         create default (cyclonedxjson) sbom
  valint bom alpine:latest -o cyclonedxxml         create cyclonedx xml sbom
  valint bom alpine:latest -o attest               create intoto attestation of cyclonedx sbom 
  valint bom alpine:latest -o attest-slsa          create intoto attestation of SLSA provenance
  valint bom alpine:latest                     show verbose debug information
  valint bom alpine:latest -A "*/**"           collect files content in to SBOM
  valint bom file.json -o attest-generic 	  attach file as evidence

  Supports the following image sources:
  valint bom yourrepo/yourimage:tag     defaults to using images from a Docker daemon. If Docker is not present, the image is pulled directly from the registry.

  You can also explicitly specify the scheme to use:
  valint bom docker:yourrepo/yourimage:tag          explicitly use the Docker daemon
  valint bom podman:yourrepo/yourimage:tag          explicitly use the Podman daemon
  valint bom docker-archive:path/to/yourimage.tar   use a tarball from disk for archives created from "docker save"
  valint bom oci-archive:path/to/yourimage.tar      use a tarball from disk for OCI archives (from Skopeo or otherwise)
  valint bom dir:path/to/yourproject                read directly from a path on disk (any directory)
  valint bom registry:yourrepo/yourimage:tag        pull image directly from a registry (no container runtime required)
  valint bom file:path/to/yourproject/file          read directly from a path on disk (any single file)
  valint bom git:path/to/yourrepository             read directly from a local repository on disk
  valint bom git:https://github.com/yourrepository.git         read directly from a remote repository on git

  SBOM-Example:
  valint bom alpine:latest -o attest
  valint bom alpine:latest -o statement

  SLSA-Example:
  valint bom alpine:latest -o attest-slsa
  valint bom alpine:latest -o statement-slsa

  Generic-Example:
  valint bom file.json -o attest-slsa
  valint bom file.json -o statement-slsa

  Format-aliases:
  * json=attest-cyclonedx-json
  * predicate=predicate-cyclonedx-json
  * statement=statement-cyclonedx-json
  * attest=attest-cyclonedx-json

```

### Verify

Verify compliance policies against evidence to ensure the integrity of supply chain.

```
valint verify [TARGET] [flags]
```

### Examples for running `valint verify`

```
  valint verify <target>
  
  <target> Target object name format=[<image:tag>, <dir path>, <git url>]

  valint verify alpine:latest                         verify target against signed attestation of sbom
  valint verify alpine:latest -i attest-slsa          verify target against signed attestation of SLSA provenance
  valint verify file.json -i attest-generic 	  	  verify file as evidence
  valint verify alpine:latest -vv                     show verbose debug information

  Supports the following image sources:
  valint verify yourrepo/yourimage:tag     defaults to using images from a Docker daemon. If Docker is not present, the image is pulled directly from the registry.

  You can also explicitly specify the scheme to use:
  valint verify docker:yourrepo/yourimage:tag          explicitly use the Docker daemon
  valint verify docker-archive:path/to/yourimage.tar   use a tarball from disk for archives created from "docker save"
  valint verify oci-archive:path/to/yourimage.tar      use a tarball from disk for OCI archives (from Skopeo or otherwise)
  valint verify dir:path/to/yourproject                read directly from a path on disk (any directory)
  valint verify registry:yourrepo/yourimage:tag        pull image directly from a registry (no container runtime required)
  valint verify file:path/to/yourproject/file          read directly from a path on disk (any single file)

  SBOM-Example:
  valint bom alpine:latest -o attest
  valint verify alpine:latest -i attest

  SLSA-Example:
  valint bom alpine:latest -o attest-slsa
  valint verify alpine:latest -i attest-slsa

  Generic-Example:
  valint bom file.json -o attest-generic
  valint verify file.sjon -i attest-generic

  Input-Format-aliases:
  * statement=statement-cyclonedx-json
  * attest=attest-cyclonedx-json

```
