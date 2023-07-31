---
sidebar_label: "Getting started with Valint"
sidebar_position: 1
title: "Getting started with Valint"
toc_min_heading_level: 2
toc_max_heading_level: 5
---

### Introduction to Valint and the Valint CLI 
Valint is a tool used to manage `evidence` generation (for directories, file artifacts, images, and git repositories), storage and validation. Valint currently supports two types of evidence: **CycloneDX SBOMs** and **SLSA provenance**. It enables cryptographically signing the evidence generated allowing you to later verify artifacts against their origin and signer identity. 

Valint also enables you to **capture** any 3rd party report, scan or configuration (any file) into evidence. 

### Installing Valint

Choose any of the following command line interface (CLI) installation options:

<details>
  <summary> Pull binary </summary>

Get the `valint` tool
```bash
curl -sSfL https://get.scribesecurity.com/install.sh  | sh -s -- -t valint
```

</details>

<details>
  <summary> Docker image </summary>

Pull the `valint` release binary wrapped in its relevant docker image. <br />
Tag value should be the requested version.

```bash
docker pull scribesecuriy.jfrog.io/scribe-docker-public-local/valint:latest
```
</details>

### Using Valint to generate and sign an SBOM

Run the `valint bom [target] -o [format]` command using one of the available `format` options:

| Format | alias | Description | signed
| --- | --- | --- | --- |
| statement-cyclonedx-json | statement | In-toto Statement | no |
| attest-cyclonedx-json | attest | In-toto Attestation | yes |
| statement-slsa |  | In-toto SLSA Predicate Statement | no |
| attest-slsa |  | In-toto SLSA Predicate Attestation | yes |
| statement-generic |  | In-toto Generic Statement | no |
| attest-generic |  | In-toto Generic Attestations | yes |

 `target` options:

   ```sh
   valint bom docker:yourrepo/yourimage:tag          explicitly use the Docker daemon
   valint bom docker-archive:path/to/yourimage.tar   use a tarball from disk for archives created from "docker save"
   valint bom oci-archive:path/to/yourimage.tar      use a tarball from disk for OCI archives (from Skopeo or otherwise)
   valint bom dir:path/to/yourproject                read directly from a path on disk (any directory)
   valint bom registry:yourrepo/yourimage:tag        pull image directly from a registry (no container runtime required)
   valint bom file:path/to/yourproject/file          read directly from a path on disk (any single file)
   valint bom git:path/to/yourrepository             read directly from a local repository on disk
   valint bom git:path/to/yourrepository.git         read directly from a remote repository on git
   ```

   Note that when employing the `bom` command on an image you don't have to use a specified tag like `docker` or `oci-archive` since an image is the default that the tool is expecting to get. For any other option you should tag what your attempting to use the command on such as a `file` or a `git` repository.

Other than using the command `bom` you should add the flag `-o` to the command with the distinction `attest-cyclonedx-json` or `attest-slsa` to state that you want to sign the resulting evidence into an attestation.

   So, for example, if you want to `bom` the image of `busybox:latest` the command will look like this:
   ```sh
   $HOME/.scribe/bin/valint bom busybox:latest -o attest -f
   ```
   > Note `attest` is an alias for `attest-cyclonedx-json`

   You can also create a SLSA provenance attestation from the same evidence:
   ```sh
   $HOME/.scribe/bin/valint bom busybox:latest -o attest-slsa -f
   ```

   By default, *Valint* is using **[Sigstore](https://www.sigstore.dev/ "Sigstore")** interactive flow as the engine behind the signing mechanism as imbedded in Scribe's **cocosign** library. This library deals with digital signatures for signing and verification. Once you apply the command you'll need to first approve you wish to sign the evidence with a `Y/[N]` option:

   ```
   [2023-01-10 09:35:35]  INFO target: collecting context, Type: local
   [2023-01-10 09:35:36]  INFO target: analyzing docker:busybox:latest
   [2023-01-10 09:35:37]  INFO target: docker:busybox:latest analyzing success
   [2023-01-10 09:35:37]  INFO cocosign: config selection, default: sigstore, Scheme: docker
   [2023-01-10 09:35:37]  INFO disabled: ociStorer, Storer skipping,
   [2023-01-10 09:35:37]  INFO enabled: rekorStorer, using storer
   Retrieving signed certificate...

         Note that there may be personally identifiable information associated with this signed artifact.
         This may include the email address associated with the account with which you authenticate.
         This information will be used for signing this artifact and will be stored in public transparency logs and cannot be removed later.
         By typing 'y', you attest that you grant (or have permission to grant) and agree to have this information stored permanently in transparency logs.

   Are you sure you want to continue? (y/[N]):
   ```   

   If you want to change this default, for example, in order to use your own key management system, you can use the configuration file. Currently, the options for signing attestations are Sigstore, Sigstore-GitHub, x509 (public key certificates) or KMS (key management system). You can check out the configuration file **[here](../../integrating-scribe/valint/docs/configuration "Configuration file")**.

   Assuming you approve, you'll be directed to *Sigstore* in your browser where you'll need to log in using either your GitHub account, your Google account, or your Microsoft account:

   <img src='../../../../img/ci/sigstore.jpg' alt='Log in to Sigstore' width='50%' min-width='500px'/>

   Once you have signed in you'll see that the login was successful 

   <img src='../../../../img/ci/sigstoreSuccess.jpg' alt='Sigstore Auth Successful' width='50%' min-width='400px'/>

   at which point you can close the browser page and go back to your Shell

   ```bash
   Successfully verified SCT...
   INFO enabled: fulcioSigner, using signer
   INFO enabled: fulcioVerifier, using verifer
   tlog entry created with index: 10855458 c0d23d6ad406973f9559f3ba2d1ca01f84147d8ffc5b8445c224f98b9591801d
   INFO storer: upload success, Storer: rekorStorer
   sign success - TRUSTED CA signature, Signer trust: fulcioSigner, CN: sigstore-intermediate, Emails: [mikey@scribesecurity.com]
   INFO output: File write to FS, Path: /home/mikey/.cache/valint/docker/busybox/latest/sha256-9810966b5f712084ea05bf28fc8ba2c8fb110baa2531a10e2da52c1efc504698.bom.sig.json
   INFO scribe: client disabled
   INFO attest: evidence generated successfully
   ```

   Attestation is written by default to the local cache provided by the `--output-directory` flag (default `$HOME/.cache/valint`), you can also use `--output-file` flag to provide a custom path for the attestation.

   Note in the logs that the signed attestation is now saved on your machine in the default location. The path is specified in the result. In the example above it's saved in: `$HOME/.cache/valint/docker/busybox/latest/sha256-9810966b5f712084ea05bf28fc8ba2c8fb110baa2531a10e2da52c1efc504698.bom.sig.json`.
### Using Valint to retrieve and verify a signed SBOM

Once you have signed something into an attestation you can later verify that the object you're checking is identical to the one you have signed. For example, if we signed the `busybox:latest` image I can later compare that image to the signed attestation we have saved.

Without access to the signed attestation there is nothing to verify against.

The command to verify something is logically named `verify`. The way to use it is almost identical to the `bom` command except we'll be using the flag `-i` (default `attest-cyclonedx-json` alias `attest`).

So, if we want to verify the `busybox:latest` image we have signed in the previous example the command will look like this:

   ```sh
   $HOME/.scribe/bin/valint verify busybox:latest -i attest
   ```
> Note you must first create the evidence using `valint bom busybox:latest -o attest`

In case you want to verify `busybox:latest` using a SLSA provenance attestation from the same evidence:
   ```sh
   $HOME/.scribe/bin/valint verify busybox:latest -i attest-slsa -f
   ```
> Note you must first create the evidence using `valint bom busybox:latest -o attest-slsa` 

The `verify` command's default value of the `-i` flag is `attest` so you can omit it if you want.

   The result should look like this:

   ```bash
   INFO cocosign: config selection, default: sigstore, Scheme: docker
   INFO disabled: ociStorer, Storer skipping,
   INFO enabled: rekorStorer, using storer
   INFO enabled: fulcioVerifier, using verifer
   INFO rekor: verify offline success (bundle)
   INFO rekor: download cert, CN: sigstore-intermediate, Emails: [mikey@scribesecurity.com]
   INFO attest: verify success - TRUSTED CA signatures, Verifier trust: fulcioVerifier, CN: sigstore-intermediate, Emails: [mikey@scribesecurity.com], URIs: []
   INFO rekor: verify offline success (bundle)
   INFO attest: verify attestation success
   INFO attest: verify policy success, Policies: []
   INFO verify: success, Type: attest-cyclonedx-json Path: /home/mikey/.cache/valint/docker/busybox/latest/sha256-9810966b5f712084ea05bf28fc8ba2c8fb110baa2531a10e2da52c1efc504698.bom.sig.json
   ```
   Note the `TRUSTED CA signatures, Verifier trust: fulcioVerifier, CN: sigstore-intermediate, Emails: [mikey@scribesecurity.com], URIs: []` which includes signers identity,
   
   Note the `verify: success, Type: attest-cyclonedx-json` at the end - that's what we're looking to see.

### Reading Valint output

The Valint CLI provides valuable log information to determine success or failure.

#### Log Format Template
```
[<Timestamp>] <Log_Level> <Log_Message> 
```
#### Evidence Storage, Valint [bom, slsa]
```
INFO storer: [cache, oci, scribe] upload success
```
Description: Success/failure of evidence storage

#### Evidence verification, Valint verify
```
[TRUSTED] verify success, CA: fulcio-verifier, CN: sigstore-intermediate, Emails: [someuser@gmail.com], URIs: [] 
```
Description: Success/failure of evidence verification  

Using `-vv` in the initial Valint command offers detailed analysis for debugging. In case of failure, the CLI returns a non-zero error status code. You can learn more by using the `valint --help` command.  

#### how to understand a Valint SBOM

The default evidence created by Valint is a **CycloneDX SBOM**. CycloneDX SBOM generally looks like this:
```json
{
  "$schema": "http://cyclonedx.org/schema/bom-1.5.schema.json",
  "bomFormat": "CycloneDX",
  "specVersion": "1.5",
  "serialNumber": "urn:uuid:3e671687-395b-41f5-a30f-a58921a69b79",
  "version": 1,
  "components": [
    {
      "type": "library",
      "name": "acme-library",
      "version": "1.0.0"
    }
  ]
}
```
As a more complete example, here's the SBOM for Alpine:
<details>
  <summary> Alpine SBOM </summary>

```json
{
  "bomFormat": "CycloneDX",
  "specVersion": "1.4",
  "version": 1,
  "metadata": {
    "timestamp": "2023-07-27T15:25:47+03:00",
    "tools": [
      {
        "vendor": "Scribe security, Inc",
        "name": "valint",
        "version": "0.3.1",
        "externalReferences": [
          {
            "url": "https://scribesecuriy.jfrog.io/scribe-docker-public-local/valint:0.3.1",
            "type": "other"
          }
        ]
      }
    ],
    "authors": [
      {}
    ],
    "component": {
      "bom-ref": "pkg:docker/index.docker.io/library/alpine:latest@sha256:9c6f0724472873bb50a2ae67a9e7adcb57673a183cea8b06eb778dca859181b5?arch=amd64\u0026ID=c57b7ae692c9670d",
      "mime-type": "application/vnd.docker.distribution.manifest.v2+json",
      "type": "container",
      "group": "image",
      "name": "index.docker.io/library/alpine:latest",
      "version": "sha256:9c6f0724472873bb50a2ae67a9e7adcb57673a183cea8b06eb778dca859181b5",
      "hashes": [
        {
          "alg": "SHA-256",
          "content": "bc41182d7ef5ffc53a40b044e725193bc10142a1243f395ee852a8d9730fc2ad"
        },
        {
          "alg": "SHA-256",
          "content": "9c6f0724472873bb50a2ae67a9e7adcb57673a183cea8b06eb778dca859181b5"
        }
      ],
      "purl": "pkg:docker/index.docker.io/library/alpine:latest@sha256:9c6f0724472873bb50a2ae67a9e7adcb57673a183cea8b06eb778dca859181b5?arch=amd64",
      "properties": [
        {
          "name": "repoDigest_0",
          "value": "alpine@sha256:bc41182d7ef5ffc53a40b044e725193bc10142a1243f395ee852a8d9730fc2ad"
        },
        {
          "name": "imageID",
          "value": "sha256:9c6f0724472873bb50a2ae67a9e7adcb57673a183cea8b06eb778dca859181b5"
        },
        {
          "name": "git_branch",
          "value": "main"
        },
        {
          "name": "timestamp",
          "value": "2023-07-27T15:25:44+03:00"
        },
        {
          "name": "input_scheme",
          "value": "docker"
        },
        {
          "name": "input_tag",
          "value": "latest"
        },
        {
          "name": "context_type",
          "value": "local"
        },
        {
          "name": "user",
          "value": "eitan"
        },
        {
          "name": "input_name",
          "value": "alpine"
        },
        {
          "name": "git_url",
          "value": "https://github.com/scribe-security/valint.git"
        },
        {
          "name": "git_commit",
          "value": "cdd3c0ee5354aa961e0d967c22e1d9189883dc97"
        },
        {
          "name": "git_tag",
          "value": "v0.3.0-4"
        },
        {
          "name": "git_ref",
          "value": "refs/heads/main"
        },
        {
          "name": "hostname",
          "value": "eitan"
        },
        {
          "name": "architecture",
          "value": "amd64"
        },
        {
          "name": "OS",
          "value": "linux"
        },
        {
          "name": "manifest-digest",
          "value": "sha256:cbaa390ec61abd889dfa5146a411c11717c19ef9e5e18458dbdc06439076ffe7"
        },
        {
          "name": "media-type",
          "value": "application/vnd.docker.distribution.manifest.v2+json"
        },
        {
          "name": "tag_0",
          "value": "latest"
        },
        {
          "name": "tag_1",
          "value": "latest"
        }
      ],
      "components": [
        {
          "type": "operating-system",
          "name": "alpine",
          "version": "3.16.2",
          "description": "Alpine Linux v3.16",
          "swid": {
            "tagId": "alpine",
            "name": "alpine",
            "version": "3.16.2"
          },
          "externalReferences": [
            {
              "url": "https://gitlab.alpinelinux.org/alpine/aports/-/issues",
              "type": "issue-tracker"
            },
            {
              "url": "https://alpinelinux.org/",
              "type": "website"
            }
          ],
          "properties": [
            {
              "name": "PrettyName",
              "value": "Alpine Linux v3.16"
            },
            {
              "name": "Name",
              "value": "Alpine Linux"
            },
            {
              "name": "VersionID",
              "value": "3.16.2"
            },
            {
              "name": "HomeURL",
              "value": "https://alpinelinux.org/"
            },
            {
              "name": "BugReportURL",
              "value": "https://gitlab.alpinelinux.org/alpine/aports/-/issues"
            },
            {
              "name": "ID",
              "value": "alpine"
            }
          ]
        }
      ]
    },
    "supplier": {
      "name": "",
      "url": [],
      "contact": [
        {}
      ]
    }
  },
  "components": [
    {
      "bom-ref": "pkg:layer/index.docker.io/library/alpine:latest@sha256:994393dc58e7931862558d06e46aa2bb17487044f670f310dffe1d24e4d1eec7?index=0\u0026ID=b4d979c6480aa7d3",
      "mime-type": "application/vnd.docker.image.rootfs.diff.tar.gzip",
      "type": "container",
      "group": "layer",
      "name": "sha256:994393dc58e7931862558d06e46aa2bb17487044f670f310dffe1d24e4d1eec7",
      "version": "sha256:994393dc58e7931862558d06e46aa2bb17487044f670f310dffe1d24e4d1eec7",
      "hashes": [
        {
          "alg": "SHA-256",
          "content": "994393dc58e7931862558d06e46aa2bb17487044f670f310dffe1d24e4d1eec7"
        }
      ],
      "purl": "pkg:layer/index.docker.io/library/alpine:latest@sha256:994393dc58e7931862558d06e46aa2bb17487044f670f310dffe1d24e4d1eec7?index=0",
      "properties": [
        {
          "name": "size",
          "value": "5539349"
        },
        {
          "name": "CreatedBy",
          "value": "#(nop) ADD file:2a949686d9886ac7c10582a6c29116fd29d3077d02755e87e111870d63607725 in / "
        },
        {
          "name": "index",
          "value": "0"
        }
      ]
    },
    {
      "bom-ref": "pkg:apk/alpine/busybox@1.35.0-r17?arch=x86_64\u0026distro=alpine-3.16.2\u0026ID=eca3681c141c29be",
      "type": "library",
      "supplier": {
        "name": "",
        "contact": [
          {
            "name": "Sören Tempel ",
            "email": "soeren+alpine@soeren-tempel.net"
          }
        ]
      },
      "group": "apk",
      "name": "busybox",
      "version": "1.35.0-r17",
      "licenses": [
        {
          "license": {
            "name": "GPL-2.0-only"
          }
        }
      ],
      "cpe": "cpe:2.3:a:busybox:busybox:1.35.0-r17:*:*:*:*:*:*:*",
      "purl": "pkg:apk/alpine/busybox@1.35.0-r17?arch=x86_64\u0026distro=alpine-3.16.2",
      "properties": [
        {
          "name": "importer-path",
          "value": "/lib/apk/db/installed"
        },
        {
          "name": "layer_ref",
          "value": "pkg:layer/index.docker.io/library/alpine:latest@sha256:994393dc58e7931862558d06e46aa2bb17487044f670f310dffe1d24e4d1eec7?index=0\u0026ID=b4d979c6480aa7d3"
        }
      ]
    },
    {
      "bom-ref": "pkg:apk/alpine/musl-utils@1.2.3-r0?arch=x86_64\u0026upstream=musl\u0026distro=alpine-3.16.2\u0026ID=b02623053dd80d55",
      "type": "library",
      "supplier": {
        "name": "",
        "contact": [
          {
            "name": "Timo Teräs ",
            "email": "timo.teras@iki.fi"
          }
        ]
      },
      "group": "apk",
      "name": "musl-utils",
      "version": "1.2.3-r0",
      "licenses": [
        {
          "license": {
            "name": "BSD"
          }
        },
        {
          "license": {
            "name": "GPL2+"
          }
        },
        {
          "license": {
            "name": "MIT"
          }
        }
      ],
      "cpe": "cpe:2.3:a:musl-utils:musl-utils:1.2.3-r0:*:*:*:*:*:*:*",
      "purl": "pkg:apk/alpine/musl-utils@1.2.3-r0?arch=x86_64\u0026upstream=musl\u0026distro=alpine-3.16.2",
      "properties": [
        {
          "name": "cpe",
          "value": "cpe:2.3:a:musl-utils:musl_utils:1.2.3-r0:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:musl_utils:musl-utils:1.2.3-r0:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:musl_utils:musl_utils:1.2.3-r0:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:musl-libc:musl-utils:1.2.3-r0:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:musl-libc:musl_utils:1.2.3-r0:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:musl:musl-utils:1.2.3-r0:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:musl:musl_utils:1.2.3-r0:*:*:*:*:*:*:*"
        },
        {
          "name": "importer-path",
          "value": "/lib/apk/db/installed"
        },
        {
          "name": "layer_ref",
          "value": "pkg:layer/index.docker.io/library/alpine:latest@sha256:994393dc58e7931862558d06e46aa2bb17487044f670f310dffe1d24e4d1eec7?index=0\u0026ID=b4d979c6480aa7d3"
        }
      ]
    },
    {
      "bom-ref": "pkg:apk/alpine/zlib@1.2.12-r3?arch=x86_64\u0026distro=alpine-3.16.2\u0026ID=75c2792d8b1e3fc4",
      "type": "library",
      "supplier": {
        "name": "",
        "contact": [
          {
            "name": "Natanael Copa ",
            "email": "ncopa@alpinelinux.org"
          }
        ]
      },
      "group": "apk",
      "name": "zlib",
      "version": "1.2.12-r3",
      "licenses": [
        {
          "license": {
            "name": "Zlib"
          }
        }
      ],
      "cpe": "cpe:2.3:a:zlib:zlib:1.2.12-r3:*:*:*:*:*:*:*",
      "purl": "pkg:apk/alpine/zlib@1.2.12-r3?arch=x86_64\u0026distro=alpine-3.16.2",
      "properties": [
        {
          "name": "importer-path",
          "value": "/lib/apk/db/installed"
        },
        {
          "name": "layer_ref",
          "value": "pkg:layer/index.docker.io/library/alpine:latest@sha256:994393dc58e7931862558d06e46aa2bb17487044f670f310dffe1d24e4d1eec7?index=0\u0026ID=b4d979c6480aa7d3"
        }
      ]
    },
    {
      "bom-ref": "pkg:apk/alpine/musl@1.2.3-r0?arch=x86_64\u0026distro=alpine-3.16.2\u0026ID=b4a85102bd31a48e",
      "type": "library",
      "supplier": {
        "name": "",
        "contact": [
          {
            "name": "Timo Teräs ",
            "email": "timo.teras@iki.fi"
          }
        ]
      },
      "group": "apk",
      "name": "musl",
      "version": "1.2.3-r0",
      "licenses": [
        {
          "license": {
            "name": "MIT"
          }
        }
      ],
      "cpe": "cpe:2.3:a:musl-libc:musl:1.2.3-r0:*:*:*:*:*:*:*",
      "purl": "pkg:apk/alpine/musl@1.2.3-r0?arch=x86_64\u0026distro=alpine-3.16.2",
      "properties": [
        {
          "name": "cpe",
          "value": "cpe:2.3:a:musl_libc:musl:1.2.3-r0:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:musl:musl:1.2.3-r0:*:*:*:*:*:*:*"
        },
        {
          "name": "importer-path",
          "value": "/lib/apk/db/installed"
        },
        {
          "name": "layer_ref",
          "value": "pkg:layer/index.docker.io/library/alpine:latest@sha256:994393dc58e7931862558d06e46aa2bb17487044f670f310dffe1d24e4d1eec7?index=0\u0026ID=b4d979c6480aa7d3"
        }
      ]
    },
    {
      "bom-ref": "pkg:apk/alpine/alpine-keys@2.4-r1?arch=x86_64\u0026distro=alpine-3.16.2\u0026ID=b20d9e4d5a96d34f",
      "type": "library",
      "supplier": {
        "name": "",
        "contact": [
          {
            "name": "Natanael Copa ",
            "email": "ncopa@alpinelinux.org"
          }
        ]
      },
      "group": "apk",
      "name": "alpine-keys",
      "version": "2.4-r1",
      "licenses": [
        {
          "license": {
            "name": "MIT"
          }
        }
      ],
      "cpe": "cpe:2.3:a:alpine-keys:alpine-keys:2.4-r1:*:*:*:*:*:*:*",
      "purl": "pkg:apk/alpine/alpine-keys@2.4-r1?arch=x86_64\u0026distro=alpine-3.16.2",
      "properties": [
        {
          "name": "cpe",
          "value": "cpe:2.3:a:alpine-keys:alpine_keys:2.4-r1:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:alpine_keys:alpine-keys:2.4-r1:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:alpine_keys:alpine_keys:2.4-r1:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:alpine:alpine-keys:2.4-r1:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:alpine:alpine_keys:2.4-r1:*:*:*:*:*:*:*"
        },
        {
          "name": "importer-path",
          "value": "/lib/apk/db/installed"
        },
        {
          "name": "layer_ref",
          "value": "pkg:layer/index.docker.io/library/alpine:latest@sha256:994393dc58e7931862558d06e46aa2bb17487044f670f310dffe1d24e4d1eec7?index=0\u0026ID=b4d979c6480aa7d3"
        }
      ]
    },
    {
      "bom-ref": "pkg:apk/alpine/apk-tools@2.12.9-r3?arch=x86_64\u0026distro=alpine-3.16.2\u0026ID=bdf4018994a3d683",
      "type": "library",
      "supplier": {
        "name": "",
        "contact": [
          {
            "name": "Natanael Copa ",
            "email": "ncopa@alpinelinux.org"
          }
        ]
      },
      "group": "apk",
      "name": "apk-tools",
      "version": "2.12.9-r3",
      "licenses": [
        {
          "license": {
            "name": "GPL-2.0-only"
          }
        }
      ],
      "cpe": "cpe:2.3:a:apk-tools:apk-tools:2.12.9-r3:*:*:*:*:*:*:*",
      "purl": "pkg:apk/alpine/apk-tools@2.12.9-r3?arch=x86_64\u0026distro=alpine-3.16.2",
      "properties": [
        {
          "name": "cpe",
          "value": "cpe:2.3:a:apk-tools:apk_tools:2.12.9-r3:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:apk_tools:apk-tools:2.12.9-r3:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:apk_tools:apk_tools:2.12.9-r3:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:apk:apk-tools:2.12.9-r3:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:apk:apk_tools:2.12.9-r3:*:*:*:*:*:*:*"
        },
        {
          "name": "importer-path",
          "value": "/lib/apk/db/installed"
        },
        {
          "name": "layer_ref",
          "value": "pkg:layer/index.docker.io/library/alpine:latest@sha256:994393dc58e7931862558d06e46aa2bb17487044f670f310dffe1d24e4d1eec7?index=0\u0026ID=b4d979c6480aa7d3"
        }
      ]
    },
    {
      "bom-ref": "pkg:binary//bin/busybox@1.35.0?ID=8d89af874b2f09f4",
      "type": "library",
      "group": "binary",
      "name": "busybox",
      "version": "1.35.0",
      "licenses": null,
      "cpe": "cpe:2.3:a:busybox:busybox:1.35.0:*:*:*:*:*:*:*",
      "purl": "pkg:binary//bin/busybox@1.35.0",
      "properties": [
        {
          "name": "cpe",
          "value": "cpe:2.3:a:busybox:busybox:1.35.0:*:*:*:*:*:*:*"
        },
        {
          "name": "importer-path",
          "value": "/bin/busybox"
        },
        {
          "name": "layer_ref",
          "value": "pkg:layer/index.docker.io/library/alpine:latest@sha256:994393dc58e7931862558d06e46aa2bb17487044f670f310dffe1d24e4d1eec7?index=0\u0026ID=b4d979c6480aa7d3"
        }
      ]
    },
    {
      "bom-ref": "pkg:apk/alpine/ca-certificates-bundle@20220614-r0?arch=x86_64\u0026upstream=ca-certificates\u0026distro=alpine-3.16.2\u0026ID=b64b590b42ed458d",
      "type": "library",
      "supplier": {
        "name": "",
        "contact": [
          {
            "name": "Natanael Copa ",
            "email": "ncopa@alpinelinux.org"
          }
        ]
      },
      "group": "apk",
      "name": "ca-certificates-bundle",
      "version": "20220614-r0",
      "licenses": [
        {
          "license": {
            "name": "MPL-2.0 AND MIT"
          }
        }
      ],
      "cpe": "cpe:2.3:a:ca-certificates-bundle:ca-certificates-bundle:20220614-r0:*:*:*:*:*:*:*",
      "purl": "pkg:apk/alpine/ca-certificates-bundle@20220614-r0?arch=x86_64\u0026upstream=ca-certificates\u0026distro=alpine-3.16.2",
      "properties": [
        {
          "name": "cpe",
          "value": "cpe:2.3:a:ca-certificates-bundle:ca_certificates_bundle:20220614-r0:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:ca_certificates_bundle:ca-certificates-bundle:20220614-r0:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:ca_certificates_bundle:ca_certificates_bundle:20220614-r0:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:ca-certificates:ca-certificates-bundle:20220614-r0:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:ca-certificates:ca_certificates_bundle:20220614-r0:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:ca_certificates:ca-certificates-bundle:20220614-r0:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:ca_certificates:ca_certificates_bundle:20220614-r0:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:mozilla:ca-certificates-bundle:20220614-r0:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:mozilla:ca_certificates_bundle:20220614-r0:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:ca:ca-certificates-bundle:20220614-r0:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:ca:ca_certificates_bundle:20220614-r0:*:*:*:*:*:*:*"
        },
        {
          "name": "importer-path",
          "value": "/lib/apk/db/installed"
        },
        {
          "name": "layer_ref",
          "value": "pkg:layer/index.docker.io/library/alpine:latest@sha256:994393dc58e7931862558d06e46aa2bb17487044f670f310dffe1d24e4d1eec7?index=0\u0026ID=b4d979c6480aa7d3"
        }
      ]
    },
    {
      "bom-ref": "pkg:apk/alpine/alpine-baselayout-data@3.2.0-r22?arch=x86_64\u0026upstream=alpine-baselayout\u0026distro=alpine-3.16.2\u0026ID=dc7d3308780225f6",
      "type": "library",
      "supplier": {
        "name": "",
        "contact": [
          {
            "name": "Natanael Copa ",
            "email": "ncopa@alpinelinux.org"
          }
        ]
      },
      "group": "apk",
      "name": "alpine-baselayout-data",
      "version": "3.2.0-r22",
      "licenses": [
        {
          "license": {
            "name": "GPL-2.0-only"
          }
        }
      ],
      "cpe": "cpe:2.3:a:alpine-baselayout-data:alpine-baselayout-data:3.2.0-r22:*:*:*:*:*:*:*",
      "purl": "pkg:apk/alpine/alpine-baselayout-data@3.2.0-r22?arch=x86_64\u0026upstream=alpine-baselayout\u0026distro=alpine-3.16.2",
      "properties": [
        {
          "name": "cpe",
          "value": "cpe:2.3:a:alpine-baselayout-data:alpine_baselayout_data:3.2.0-r22:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:alpine_baselayout_data:alpine-baselayout-data:3.2.0-r22:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:alpine_baselayout_data:alpine_baselayout_data:3.2.0-r22:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:alpine-baselayout:alpine-baselayout-data:3.2.0-r22:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:alpine-baselayout:alpine_baselayout_data:3.2.0-r22:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:alpine_baselayout:alpine-baselayout-data:3.2.0-r22:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:alpine_baselayout:alpine_baselayout_data:3.2.0-r22:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:alpine:alpine-baselayout-data:3.2.0-r22:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:alpine:alpine_baselayout_data:3.2.0-r22:*:*:*:*:*:*:*"
        },
        {
          "name": "importer-path",
          "value": "/lib/apk/db/installed"
        },
        {
          "name": "layer_ref",
          "value": "pkg:layer/index.docker.io/library/alpine:latest@sha256:994393dc58e7931862558d06e46aa2bb17487044f670f310dffe1d24e4d1eec7?index=0\u0026ID=b4d979c6480aa7d3"
        }
      ]
    },
    {
      "bom-ref": "pkg:apk/alpine/libssl1.1@1.1.1q-r0?arch=x86_64\u0026upstream=openssl\u0026distro=alpine-3.16.2\u0026ID=0f80243a85bcb9be",
      "type": "library",
      "supplier": {
        "name": "",
        "contact": [
          {
            "name": "Timo Teras ",
            "email": "timo.teras@iki.fi"
          }
        ]
      },
      "group": "apk",
      "name": "libssl1.1",
      "version": "1.1.1q-r0",
      "licenses": [
        {
          "license": {
            "name": "OpenSSL"
          }
        }
      ],
      "cpe": "cpe:2.3:a:libssl1.1:libssl1.1:1.1.1q-r0:*:*:*:*:*:*:*",
      "purl": "pkg:apk/alpine/libssl1.1@1.1.1q-r0?arch=x86_64\u0026upstream=openssl\u0026distro=alpine-3.16.2",
      "properties": [
        {
          "name": "cpe",
          "value": "cpe:2.3:a:libssl1.1:libssl:1.1.1q-r0:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:libssl:libssl1.1:1.1.1q-r0:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:libssl:libssl:1.1.1q-r0:*:*:*:*:*:*:*"
        },
        {
          "name": "importer-path",
          "value": "/lib/apk/db/installed"
        },
        {
          "name": "layer_ref",
          "value": "pkg:layer/index.docker.io/library/alpine:latest@sha256:994393dc58e7931862558d06e46aa2bb17487044f670f310dffe1d24e4d1eec7?index=0\u0026ID=b4d979c6480aa7d3"
        }
      ]
    },
    {
      "bom-ref": "pkg:apk/alpine/scanelf@1.3.4-r0?arch=x86_64\u0026upstream=pax-utils\u0026distro=alpine-3.16.2\u0026ID=aa4b25b439128c22",
      "type": "library",
      "supplier": {
        "name": "",
        "contact": [
          {
            "name": "Natanael Copa ",
            "email": "ncopa@alpinelinux.org"
          }
        ]
      },
      "group": "apk",
      "name": "scanelf",
      "version": "1.3.4-r0",
      "licenses": [
        {
          "license": {
            "name": "GPL-2.0-only"
          }
        }
      ],
      "cpe": "cpe:2.3:a:scanelf:scanelf:1.3.4-r0:*:*:*:*:*:*:*",
      "purl": "pkg:apk/alpine/scanelf@1.3.4-r0?arch=x86_64\u0026upstream=pax-utils\u0026distro=alpine-3.16.2",
      "properties": [
        {
          "name": "importer-path",
          "value": "/lib/apk/db/installed"
        },
        {
          "name": "layer_ref",
          "value": "pkg:layer/index.docker.io/library/alpine:latest@sha256:994393dc58e7931862558d06e46aa2bb17487044f670f310dffe1d24e4d1eec7?index=0\u0026ID=b4d979c6480aa7d3"
        }
      ]
    },
    {
      "bom-ref": "pkg:apk/alpine/alpine-baselayout@3.2.0-r22?arch=x86_64\u0026distro=alpine-3.16.2\u0026ID=be78e148be2ed73b",
      "type": "library",
      "supplier": {
        "name": "",
        "contact": [
          {
            "name": "Natanael Copa ",
            "email": "ncopa@alpinelinux.org"
          }
        ]
      },
      "group": "apk",
      "name": "alpine-baselayout",
      "version": "3.2.0-r22",
      "licenses": [
        {
          "license": {
            "name": "GPL-2.0-only"
          }
        }
      ],
      "cpe": "cpe:2.3:a:alpine-baselayout:alpine-baselayout:3.2.0-r22:*:*:*:*:*:*:*",
      "purl": "pkg:apk/alpine/alpine-baselayout@3.2.0-r22?arch=x86_64\u0026distro=alpine-3.16.2",
      "properties": [
        {
          "name": "cpe",
          "value": "cpe:2.3:a:alpine-baselayout:alpine_baselayout:3.2.0-r22:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:alpine_baselayout:alpine-baselayout:3.2.0-r22:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:alpine_baselayout:alpine_baselayout:3.2.0-r22:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:alpine:alpine-baselayout:3.2.0-r22:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:alpine:alpine_baselayout:3.2.0-r22:*:*:*:*:*:*:*"
        },
        {
          "name": "importer-path",
          "value": "/lib/apk/db/installed"
        },
        {
          "name": "layer_ref",
          "value": "pkg:layer/index.docker.io/library/alpine:latest@sha256:994393dc58e7931862558d06e46aa2bb17487044f670f310dffe1d24e4d1eec7?index=0\u0026ID=b4d979c6480aa7d3"
        }
      ]
    },
    {
      "bom-ref": "pkg:apk/alpine/libc-utils@0.7.2-r3?arch=x86_64\u0026upstream=libc-dev\u0026distro=alpine-3.16.2\u0026ID=24be4e1570d3395b",
      "type": "library",
      "supplier": {
        "name": "",
        "contact": [
          {
            "name": "Natanael Copa ",
            "email": "ncopa@alpinelinux.org"
          }
        ]
      },
      "group": "apk",
      "name": "libc-utils",
      "version": "0.7.2-r3",
      "licenses": [
        {
          "license": {
            "name": "BSD-2-Clause AND BSD-3-Clause"
          }
        }
      ],
      "cpe": "cpe:2.3:a:libc-utils:libc-utils:0.7.2-r3:*:*:*:*:*:*:*",
      "purl": "pkg:apk/alpine/libc-utils@0.7.2-r3?arch=x86_64\u0026upstream=libc-dev\u0026distro=alpine-3.16.2",
      "properties": [
        {
          "name": "cpe",
          "value": "cpe:2.3:a:libc-utils:libc_utils:0.7.2-r3:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:libc_utils:libc-utils:0.7.2-r3:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:libc_utils:libc_utils:0.7.2-r3:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:libc:libc-utils:0.7.2-r3:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:libc:libc_utils:0.7.2-r3:*:*:*:*:*:*:*"
        },
        {
          "name": "importer-path",
          "value": "/lib/apk/db/installed"
        },
        {
          "name": "layer_ref",
          "value": "pkg:layer/index.docker.io/library/alpine:latest@sha256:994393dc58e7931862558d06e46aa2bb17487044f670f310dffe1d24e4d1eec7?index=0\u0026ID=b4d979c6480aa7d3"
        }
      ]
    },
    {
      "bom-ref": "pkg:apk/alpine/libcrypto1.1@1.1.1q-r0?arch=x86_64\u0026upstream=openssl\u0026distro=alpine-3.16.2\u0026ID=3018931edd18d695",
      "type": "library",
      "supplier": {
        "name": "",
        "contact": [
          {
            "name": "Timo Teras ",
            "email": "timo.teras@iki.fi"
          }
        ]
      },
      "group": "apk",
      "name": "libcrypto1.1",
      "version": "1.1.1q-r0",
      "licenses": [
        {
          "license": {
            "name": "OpenSSL"
          }
        }
      ],
      "cpe": "cpe:2.3:a:libcrypto1.1:libcrypto1.1:1.1.1q-r0:*:*:*:*:*:*:*",
      "purl": "pkg:apk/alpine/libcrypto1.1@1.1.1q-r0?arch=x86_64\u0026upstream=openssl\u0026distro=alpine-3.16.2",
      "properties": [
        {
          "name": "cpe",
          "value": "cpe:2.3:a:libcrypto1.1:libcrypto:1.1.1q-r0:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:libcrypto:libcrypto1.1:1.1.1q-r0:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:libcrypto:libcrypto:1.1.1q-r0:*:*:*:*:*:*:*"
        },
        {
          "name": "importer-path",
          "value": "/lib/apk/db/installed"
        },
        {
          "name": "layer_ref",
          "value": "pkg:layer/index.docker.io/library/alpine:latest@sha256:994393dc58e7931862558d06e46aa2bb17487044f670f310dffe1d24e4d1eec7?index=0\u0026ID=b4d979c6480aa7d3"
        }
      ]
    },
    {
      "bom-ref": "pkg:apk/alpine/ssl_client@1.35.0-r17?arch=x86_64\u0026upstream=busybox\u0026distro=alpine-3.16.2\u0026ID=92a6bae1f2f5325f",
      "type": "library",
      "supplier": {
        "name": "",
        "contact": [
          {
            "name": "Sören Tempel ",
            "email": "soeren+alpine@soeren-tempel.net"
          }
        ]
      },
      "group": "apk",
      "name": "ssl_client",
      "version": "1.35.0-r17",
      "licenses": [
        {
          "license": {
            "name": "GPL-2.0-only"
          }
        }
      ],
      "cpe": "cpe:2.3:a:ssl-client:ssl-client:1.35.0-r17:*:*:*:*:*:*:*",
      "purl": "pkg:apk/alpine/ssl_client@1.35.0-r17?arch=x86_64\u0026upstream=busybox\u0026distro=alpine-3.16.2",
      "properties": [
        {
          "name": "cpe",
          "value": "cpe:2.3:a:ssl-client:ssl_client:1.35.0-r17:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:ssl_client:ssl-client:1.35.0-r17:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:ssl_client:ssl_client:1.35.0-r17:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:ssl:ssl-client:1.35.0-r17:*:*:*:*:*:*:*"
        },
        {
          "name": "cpe",
          "value": "cpe:2.3:a:ssl:ssl_client:1.35.0-r17:*:*:*:*:*:*:*"
        },
        {
          "name": "importer-path",
          "value": "/lib/apk/db/installed"
        },
        {
          "name": "layer_ref",
          "value": "pkg:layer/index.docker.io/library/alpine:latest@sha256:994393dc58e7931862558d06e46aa2bb17487044f670f310dffe1d24e4d1eec7?index=0\u0026ID=b4d979c6480aa7d3"
        }
      ]
    }
  ],
  "dependencies": [
    {
      "ref": "pkg:apk/alpine/ca-certificates-bundle@20220614-r0?arch=x86_64\u0026upstream=ca-certificates\u0026distro=alpine-3.16.2\u0026ID=b64b590b42ed458d",
      "dependsOn": [
        "pkg:apk/alpine/apk-tools@2.12.9-r3?arch=x86_64\u0026distro=alpine-3.16.2\u0026ID=bdf4018994a3d683"
      ]
    },
    {
      "ref": "pkg:apk/alpine/libcrypto1.1@1.1.1q-r0?arch=x86_64\u0026upstream=openssl\u0026distro=alpine-3.16.2\u0026ID=3018931edd18d695",
      "dependsOn": [
        "pkg:apk/alpine/apk-tools@2.12.9-r3?arch=x86_64\u0026distro=alpine-3.16.2\u0026ID=bdf4018994a3d683",
        "pkg:apk/alpine/libssl1.1@1.1.1q-r0?arch=x86_64\u0026upstream=openssl\u0026distro=alpine-3.16.2\u0026ID=0f80243a85bcb9be",
        "pkg:apk/alpine/ssl_client@1.35.0-r17?arch=x86_64\u0026upstream=busybox\u0026distro=alpine-3.16.2\u0026ID=92a6bae1f2f5325f"
      ]
    },
    {
      "ref": "pkg:apk/alpine/libssl1.1@1.1.1q-r0?arch=x86_64\u0026upstream=openssl\u0026distro=alpine-3.16.2\u0026ID=0f80243a85bcb9be",
      "dependsOn": [
        "pkg:apk/alpine/apk-tools@2.12.9-r3?arch=x86_64\u0026distro=alpine-3.16.2\u0026ID=bdf4018994a3d683",
        "pkg:apk/alpine/ssl_client@1.35.0-r17?arch=x86_64\u0026upstream=busybox\u0026distro=alpine-3.16.2\u0026ID=92a6bae1f2f5325f"
      ]
    },
    {
      "ref": "pkg:apk/alpine/musl-utils@1.2.3-r0?arch=x86_64\u0026upstream=musl\u0026distro=alpine-3.16.2\u0026ID=b02623053dd80d55",
      "dependsOn": [
        "pkg:apk/alpine/libc-utils@0.7.2-r3?arch=x86_64\u0026upstream=libc-dev\u0026distro=alpine-3.16.2\u0026ID=24be4e1570d3395b"
      ]
    },
    {
      "ref": "pkg:apk/alpine/busybox@1.35.0-r17?arch=x86_64\u0026distro=alpine-3.16.2\u0026ID=eca3681c141c29be",
      "dependsOn": [
        "pkg:apk/alpine/alpine-baselayout@3.2.0-r22?arch=x86_64\u0026distro=alpine-3.16.2\u0026ID=be78e148be2ed73b"
      ]
    },
    {
      "ref": "pkg:apk/alpine/musl@1.2.3-r0?arch=x86_64\u0026distro=alpine-3.16.2\u0026ID=b4a85102bd31a48e",
      "dependsOn": [
        "pkg:apk/alpine/apk-tools@2.12.9-r3?arch=x86_64\u0026distro=alpine-3.16.2\u0026ID=bdf4018994a3d683",
        "pkg:apk/alpine/libssl1.1@1.1.1q-r0?arch=x86_64\u0026upstream=openssl\u0026distro=alpine-3.16.2\u0026ID=0f80243a85bcb9be",
        "pkg:apk/alpine/scanelf@1.3.4-r0?arch=x86_64\u0026upstream=pax-utils\u0026distro=alpine-3.16.2\u0026ID=aa4b25b439128c22",
        "pkg:apk/alpine/libcrypto1.1@1.1.1q-r0?arch=x86_64\u0026upstream=openssl\u0026distro=alpine-3.16.2\u0026ID=3018931edd18d695",
        "pkg:apk/alpine/musl-utils@1.2.3-r0?arch=x86_64\u0026upstream=musl\u0026distro=alpine-3.16.2\u0026ID=b02623053dd80d55",
        "pkg:apk/alpine/alpine-baselayout@3.2.0-r22?arch=x86_64\u0026distro=alpine-3.16.2\u0026ID=be78e148be2ed73b",
        "pkg:apk/alpine/busybox@1.35.0-r17?arch=x86_64\u0026distro=alpine-3.16.2\u0026ID=eca3681c141c29be",
        "pkg:apk/alpine/ssl_client@1.35.0-r17?arch=x86_64\u0026upstream=busybox\u0026distro=alpine-3.16.2\u0026ID=92a6bae1f2f5325f",
        "pkg:apk/alpine/zlib@1.2.12-r3?arch=x86_64\u0026distro=alpine-3.16.2\u0026ID=75c2792d8b1e3fc4"
      ]
    },
    {
      "ref": "pkg:apk/alpine/zlib@1.2.12-r3?arch=x86_64\u0026distro=alpine-3.16.2\u0026ID=75c2792d8b1e3fc4",
      "dependsOn": [
        "pkg:apk/alpine/apk-tools@2.12.9-r3?arch=x86_64\u0026distro=alpine-3.16.2\u0026ID=bdf4018994a3d683"
      ]
    },
    {
      "ref": "pkg:apk/alpine/scanelf@1.3.4-r0?arch=x86_64\u0026upstream=pax-utils\u0026distro=alpine-3.16.2\u0026ID=aa4b25b439128c22",
      "dependsOn": [
        "pkg:apk/alpine/musl-utils@1.2.3-r0?arch=x86_64\u0026upstream=musl\u0026distro=alpine-3.16.2\u0026ID=b02623053dd80d55"
      ]
    },
    {
      "ref": "pkg:docker/index.docker.io/library/alpine:latest@sha256:9c6f0724472873bb50a2ae67a9e7adcb57673a183cea8b06eb778dca859181b5?arch=amd64\u0026ID=c57b7ae692c9670d",
      "dependsOn": [
        "pkg:layer/index.docker.io/library/alpine:latest@sha256:994393dc58e7931862558d06e46aa2bb17487044f670f310dffe1d24e4d1eec7?index=0\u0026ID=b4d979c6480aa7d3"
      ]
    },
    {
      "ref": "pkg:apk/alpine/alpine-baselayout-data@3.2.0-r22?arch=x86_64\u0026upstream=alpine-baselayout\u0026distro=alpine-3.16.2\u0026ID=dc7d3308780225f6",
      "dependsOn": [
        "pkg:apk/alpine/alpine-baselayout@3.2.0-r22?arch=x86_64\u0026distro=alpine-3.16.2\u0026ID=be78e148be2ed73b"
      ]
    },
    {
      "ref": "pkg:layer/index.docker.io/library/alpine:latest@sha256:994393dc58e7931862558d06e46aa2bb17487044f670f310dffe1d24e4d1eec7?index=0\u0026ID=b4d979c6480aa7d3",
      "dependsOn": [
        "pkg:apk/alpine/alpine-keys@2.4-r1?arch=x86_64\u0026distro=alpine-3.16.2\u0026ID=b20d9e4d5a96d34f",
        "pkg:binary//bin/busybox@1.35.0?ID=8d89af874b2f09f4",
        "pkg:apk/alpine/musl@1.2.3-r0?arch=x86_64\u0026distro=alpine-3.16.2\u0026ID=b4a85102bd31a48e",
        "pkg:apk/alpine/alpine-baselayout-data@3.2.0-r22?arch=x86_64\u0026upstream=alpine-baselayout\u0026distro=alpine-3.16.2\u0026ID=dc7d3308780225f6",
        "pkg:apk/alpine/ca-certificates-bundle@20220614-r0?arch=x86_64\u0026upstream=ca-certificates\u0026distro=alpine-3.16.2\u0026ID=b64b590b42ed458d"
      ]
    }
  ]
}
```
</details>

You can find multiple examples in **[this link](https://github.com/CycloneDX/bom-examples/tree/master/SBOM)** and you can learn more about the different parts of the SBOM **[here](https://cyclonedx.org/use-cases/)**.


