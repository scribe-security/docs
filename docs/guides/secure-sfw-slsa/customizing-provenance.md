---

sidebar\_label: "Customizing Provenance"
title: "Customizing the Provenance Document"
sidebar\_position: 5
toc\_min\_heading\_level: 2
toc\_max\_heading\_level: 5
---------------------------

Use the following flags to tailor the provenance document to your needs.

## Include external by-products

| Flag                  | Purpose                                                                                                                          | Example                                                         |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `--by-product <path>` | Attach the contents of a file (e.g., log, SBOM) as a by-product                                                                  | `valint slsa busybox:latest --by-product /path/to/file.txt`     |
| `--components <list>` | When the by-product is an SBOM, include finer-grained components such as `layers`, `packages`, or `files` (comma‑separated list) | `valint slsa busybox:latest --components layers,packages,files` |

## Override key provenance fields

| Flag            | Field                        | Example                              |
| --------------- | ---------------------------- | ------------------------------------ |
| `--invocation`  | Invocation ID                | `--invocation my_invocation`         |
| `--build-type`  | Build type                   | `--build-type docker`                |
| `--builder-id`  | Builder ID                   | `--builder-id 12345`                 |
| `--started-on`  | Build start time (RFC 3339)  | `--started-on 2023-07-25T15:30:00Z`  |
| `--finished-on` | Build finish time (RFC 3339) | `--finished-on 2023-07-25T16:00:00Z` |

**Full example**

```bash
valint slsa busybox:latest \
  --source git:https://github.com/my_org/my_repo.git \
  --git-tag v1.0.0 \
  --invocation my_invocation \
  --build-type docker \
  --builder-id 12345 \
  --started-on 2023-07-25T15:30:00Z \
  --finished-on 2023-07-25T16:00:00Z
```

## Add extra evidence (by-product references)

| Flag                 | Purpose                                                                                         |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| `--source <git_url>` | Generate an SBOM for the specified Git repository                                               |
| `--bom`              | Generate an SBOM for the primary container‑image target                                         |
| `--input <target>`   | Generate evidence for any additional target (extra Git repo, image, or third‑party tool output) |

```bash
valint bom \
  --source https://github.com/your-org/your-repo.git \
  --bom \
  --input ghcr.io/your-org/extra-image:latest
```

## Add environment variables

* `--all-env` – Attach **all** environment variables to `internalParameters`.
* `--env <NAME>` – Attach a **specific** variable.

```bash
# Attach all environment variables
valint slsa busybox:latest --all-env

# Attach a single variable
valint slsa busybox:latest --env MY_ENV
```

## Extend external parameters

* `--external <key=value>` – Add key–value pairs to `externalParameters`.

```bash
valint slsa busybox:latest --external my_custom_param=my_custom_value
```

## Supply a custom predicate or statement

| Flag                 | Purpose                                    | Example                                                        |
| -------------------- | ------------------------------------------ | -------------------------------------------------------------- |
| `--predicate <file>` | Merge a full or partial SLSA **predicate** | `valint slsa busybox:latest --predicate custom.predicate.json` |
| `--statement <file>` | Merge a full or partial SLSA **statement** | `valint slsa busybox:latest --statement custom.statement.json` |

### Predicate template (`custom.predicate.json`)

```json
{
  "buildDefinition": {
    "externalParameters": {
      "custom_external": {
        "name": "build-environment",
        "value": "production",
        "uri": "https://company.com/my_repo/event",
        "digest": { "sha1": "910b17c3bc81ca8c791aaa394d508219e03879f8" }
      }
    }
  },
  "runDetails": {
    "builder": {
      "builderDependencies": [
        {
          "uri": "https://github.com/.github/reusable_build.yaml",
          "name": "my_tool",
          "annotations": { "vendor": "My company Inc", "version": "1.0" }
        }
      ]
    },
    "metadata": {
      "invocationID": "https://company.com/my_repo/build.sh",
      "startedOn": "2023-07-25T15:30:00Z",
      "finishedOn": "2023-07-25T16:00:00Z"
    }
  }
}
```

### Statement template (`custom.statement.json`)

```json
{
  "_type": "https://in-toto.io/Statement/v0.1",
  "predicateType": "https://slsa.dev/provenance/v1",
  "subject": [
    {
      "name": "index.docker.io/my_image",
      "digest": {
        "sha256": "62aedd01bd8520c43d06b09f7a0f67ba9720bdc04631a8242c65ea995f3ecac8"
      }
    }
  ],
  "predicate": {
    "runDetails": {
      "byproducts": [
        {
          "uri": "pkg:docker/index.docker.io/my_image:latest@sha256:7ad00cd55506625f2afad262de6002c8cef20d214b353e51d1025e40e8646e18?index=0",
          "digest": {
            "sha256": "7ad00cd55506625f2afad262de6002c8cef20d214b353e51d1025e40e8646e18"
          },
          "mediaType": "application/vnd.docker.image.rootfs.diff.tar.gzip",
          "annotations": { "tag": "v0.0.1" }
        }
      ]
    }
  }
}
```
