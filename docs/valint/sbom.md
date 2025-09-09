---
sidebar_label: "SBOM Generation"
title: SBOM Generation
author: mikey strauss - Scribe
sidebar_position: 6
date: April 5, 2021
geometry: margin=2cm
---

### CycloneDX SBOM
The CycloneDX SBOM evidence format includes a large amount of analyzed data depending on the target and user configuration. 

The following table describes the group types we currently support.

| Component group | Description | targets | required |
| --- | --- | --- | --- |
| Metadata (Target) | target details | all | yes |
| Layer | found layers details including `CreatedBy` command | images | no |
| Package | found packages details including `PURL` and `CPE` fields | all | no |
| Commit | target commit history details | git | no |
| File | found file details including `sha256` hash | all | no |
| Dependency | relations between components | all | no |

The following list includes the packages types we currently support:
* Alpine (apk)
* C (conan)
* C++ (conan)
* Dart (pubs)
* Debian (dpkg)
* Dotnet (deps.json)
* Objective-C (cocoapods)
* Elixir (mix)
* Erlang (rebar3)
* Go (go.mod, Go binaries)
* Haskell (cabal, stack)
* Java (jar, ear, war, par, sar, nar, native-image)
* JavaScript (npm, yarn)
* Jenkins Plugins (jpi, hpi)
* Linux kernel archives (vmlinz)
* Linux kernel modules (ko)
* Nix (outputs in /nix/store)
* PHP (composer)
* Python (wheel, egg, poetry, requirements.txt)
* Red Hat (rpm)
* Ruby (gem)
* Rust (cargo.lock)
* Swift (cocoapods, swift-package-manager)
* R (cran)

### Dependencies graph
Currently, we support the following dependencies relations.

| Type | description | targets | Parent group | Child group  |
| --- | --- | --- | --- | --- |
| Package-File | File relation to the package it belongs to | all | Package | File |
| Package-Package | package depedency relations | all | Package | Package |
| Layers | layer relation to its target | images | Metadata | Layer |
| Package-Layer | package relation to the layer it was found on | images | Layer | Package |
| File-Layer | file relation to the layer it was found on | images | Layer | File |
| Commit | Commit history relation | git | Commit | Commit |
| Commit-File | File relation to the commit it was last edited by | git | Commit | File |

### Customizing
Following are some of the customizable features we support.
* Include only specific component groups, use `--components` to select between the group types.
* Include or exclude specific package types, use `--package-type` or `--package-exclude-type` to select a specific package type.
* Include the installed packages found (package group `install`) or the packages referenced by sources (package group `index`), use `--package-group` to select between options.
* Exclude components, use `--filter-regex`, `--filter-scope` and `--filter-purl` to exclude any component.
* Attach any file content, use `--attach-regex` to include the content of external files.
* Include custom environments and labels, use `--env` and `--label` to attach your custom fields.

## Package dependency relations
For package-to-package relations, default support is partial, and it is limited to specific types of packages. To enhance the accuracy and completeness of these relations, especially for broader package types, we recommend using the OWASP plugin during your actual build process. This approach typically yields a more precise representation of package relations. You can then seamlessly merge this information into your artifact SBOM by including it in the final artifact. This ensures that your Software Bill of Materials reflects the most up-to-date and accurate dependency relationships.


Here's a paragraph you can add to the documentation regarding the new multi-target input support:

## Multi-target input support

The SBOM generation process now supports enhanced flexibility with multi-target inputs. By using the `--input` flag, users can specify diverse evidence or assets as inputs, which are processed alongside the primary target. These inputs allow for the creation of third-party evidence and enable richer policy evaluations and enforcement. Relationships between the primary target and inputs are dynamically built, ensuring comprehensive and accurate SBOMs.

## Base Image Verification

The `--base-image` flag allows for precise base image identification and verification. When specified, Valint ensures that the target container is accurately linked to its base image. This feature updates the SBOM and in-memory context with information such as base image labels, layer references, and derived package sources. The SBOM graph is also updated to reflect the dependency relationships between the base image and the target container. This ensures a detailed representation of the base image’s influence within the SBOM, including all relevant layers and associated packages.
