---
title: SLSA
author: mikey strauss - Scribe
date: April 5, 2021
geometry: margin=2cm
---

# SLSA
> **Supported version** v1.0

SLSA (Supply-chain Levels for Software Artifacts) is a security framework aiming to prevent tampering, improve integrity, and secure packages and infrastructure. The core concept of SLSA is that a software artifact can be trusted only if it complies to three requirements:
1. The artifact should have a Provenance document, describing it's origin and build process (L1).
2. The Provenance document should be trustworthy and verified downstream (L2).
3. The build platform should be trustworthy (L3).

Valint supports generation and validation of the SLSA Provenance document.

> See details [SLSA provenance spec](http://slsa.dev/provenance/v0.2)

> See details [SLSA requirements](http://slsa.dev/spec/v0.1/requirements)

### Provenance formats
Valint supports the following provenance formats.

| Format | alias | Description | signed |
| --- | --- | --- | --- |
| statement-slsa | statement | In-toto SLSA Provenance Statement | no |
| attest-slsa | attest | In-toto SLSA Provenance Attestation | yes |

### SLSA Provenance specification overview
SLSA Provenance includes verifiable information about software artifacts describing where, when and how something was produced.
It is required for SLSA compliance levels.


#### Predicate default format
Following describes provenance format created by default by valint.

> We are currently expanding our default and custom capabilities.

```json
{
    "_type": "https://in-toto.io/Statement/v0.1",
    "predicateType": "https://slsa.dev/provenance/v1",
    "subject": [
       // Target subject 
    ],
    "predicate": {
       "buildDefinition": {
          "buildType": { context type }, // jenkins github circleci azure gitlab travis bitbucket local
          "externalParameters": {
             "pipeline": {
               // Pipeline details
             },
             "source": {
                "digest": {
                   "sha1": { git commit },
                },
                "uri": { git url },
             }
          },
          "internalParameters": {
             // Full context fields
          },
          "resolvedDependencies": [
             {
                // Resolved source dependency
             },
             {
                // Resolved build artifact dependency
             },
            ]
       },
       "runDetails": {
          "builder": {
             "id": { context type },
             "builderDependencies": [
                {
                   // Valint tool dependency
                }
             ]
          },
          "metadata": {
            "invocationID": { run id }
          },
          "byproducts": [
             {
                // Target layer byproducts
             }
          ]
       }
    }
 }
```

<details>
  <summary>  Default Github Provenance </summary>

Following example shows a provenance created by a Github.

```json
{
  "_type": "https://in-toto.io/Statement/v0.1",
  "predicateType": "https://slsa.dev/provenance/v1",
  "subject": [
    {
      "name": "index.docker.io/library/alpine:latest",
      "digest": {
        "sha256": "c1aabb73d2339c5ebaa3681de2e9d9c18d57485045a4e311d9f8004bec208d67"
      }
    }
  ],
  "predicate": {
    "buildDefinition": {
      "buildType": "https://github.com/Attestations/GitHubActionsWorkflow@v1",
      "externalParameters": {
        "pipeline": {
          "actor": "houdini91",
          "build_num": "138",
          "job": "slsa-install",
          "run_id": "5667830803",
          "type": "github",
          "workflow": "pre-release/staging tests"
        },
        "source": {
          "digest": {
            "sha1": "2ca865f8a87b11926fff8183e64cba3420ae5d44"
          },
          "uri": "https://github.com/scribe-security/integrations.git@refs/heads/master"
        }
      },
      "internalParameters": {
        "actor": "houdini91",
        "build_num": "138",
        "content_type": "statement-slsa",
        "context_type": "github",
        "event_name": "workflow_dispatch",
        "git_branch": "master",
        "git_commit": "2ca865f8a87b11926fff8183e64cba3420ae5d44",
        "git_ref": "refs/heads/master",
        "git_url": "https://github.com/scribe-security/integrations.git",
        "hostname": "fv-az442-47",
        "imageID": "sha256:c1aabb73d2339c5ebaa3681de2e9d9c18d57485045a4e311d9f8004bec208d67",
        "input_name": "alpine",
        "input_scheme": "docker",
        "input_tag": "latest",
        "job_name": "slsa-install",
        "repository": "scribe-security/integrations",
        "run_attempt": "1",
        "run_id": "5667830803",
        "sbomgroup": "image",
        "sbomhashs": [
          "sha256-82d1e9d7ed48a7523bdebc18cf6290bdb97b82302a8a9c27d4fe885949ea94d1",
          "sha256-c1aabb73d2339c5ebaa3681de2e9d9c18d57485045a4e311d9f8004bec208d67"
        ],
        "sbomname": "index.docker.io/library/alpine:latest",
        "sbompurl": "pkg:docker/index.docker.io/library/alpine:latest@sha256:c1aabb73d2339c5ebaa3681de2e9d9c18d57485045a4e311d9f8004bec208d67?arch=amd64",
        "sbomversion": "sha256:c1aabb73d2339c5ebaa3681de2e9d9c18d57485045a4e311d9f8004bec208d67",
        "target_type": "image",
        "timestamp": "2023-07-26T10:49:26Z",
        "user": "runner",
        "workflow": "pre-release/staging tests"
      },
      "resolvedDependencies": [
        {
          "uri": "https://github.com/scribe-security/integrations.git@refs/heads/master",
          "digest": {
            "sha1": "2ca865f8a87b11926fff8183e64cba3420ae5d44"
          },
          "name": "refs/heads/master",
          "annotations": {
            "branch": "master",
            "tag": ""
          }
        },
        {
          "name": "index.docker.io/library/alpine:latest",
          "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
          "annotations": {
            "OS": "linux",
            "actor": "houdini91",
            "architecture": "amd64",
            "build_num": "138",
            "context_type": "github",
            "event_name": "workflow_dispatch",
            "git_branch": "master",
            "git_commit": "2ca865f8a87b11926fff8183e64cba3420ae5d44",
            "git_ref": "refs/heads/master",
            "git_url": "https://github.com/scribe-security/integrations.git",
            "hostname": "fv-az442-47",
            "imageID": "sha256:c1aabb73d2339c5ebaa3681de2e9d9c18d57485045a4e311d9f8004bec208d67",
            "input_name": "alpine",
            "input_scheme": "docker",
            "input_tag": "latest",
            "job_name": "slsa-install",
            "manifest-digest": "sha256:9135edbf29612ccdc83f27e06feee3abf48d47abfcd16e0b61c7dd431f88b7b2",
            "media-type": "application/vnd.docker.distribution.manifest.v2+json",
            "repoDigest_0": "alpine@sha256:82d1e9d7ed48a7523bdebc18cf6290bdb97b82302a8a9c27d4fe885949ea94d1",
            "repository": "scribe-security/integrations",
            "run_attempt": "1",
            "run_id": "5667830803",
            "tag_0": "latest",
            "tag_1": "3.18",
            "tag_2": "latest",
            "timestamp": "2023-07-26T10:49:26Z",
            "user": "runner",
            "workflow": "pre-release/staging tests"
          }
        }
      ]
    },
    "runDetails": {
      "builder": {
        "id": "https://github.com/Attestations/GitHubHostedActions@v1",
        "builderDependencies": [
          {
            "uri": "https://scribesecuriy.jfrog.io/scribe-docker-public-local/valint:0.3.0-3",
            "name": "valint",
            "annotations": {
              "vendor": "Scribe security, Inc",
              "version": "0.3.0-3"
            }
          }
        ]
      },
      "metadata": {
        "invocationID": "5667830803"
      },
      "byproducts": [
        {
          "uri": "pkg:layer/index.docker.io/library/alpine:latest@sha256:78a822fe2a2d2c84f3de4a403188c45f623017d6a4521d23047c9fbb0801794c?index=0",
          "digest": {
            "sha256": "78a822fe2a2d2c84f3de4a403188c45f623017d6a4521d23047c9fbb0801794c"
          },
          "mediaType": "application/vnd.docker.image.rootfs.diff.tar.gzip",
          "annotations": {
            "CreatedBy": "#(nop) ADD file:1da756d12551a0e3e793e02ef87432d69d4968937bd11bed0af215db19dd94cd in / ",
            "index": "0",
            "size": "7326745"
          }
        }
      ]
    }
  }
}
```
</details>

<details>
  <summary>  Default Jenkins Provenance </summary>

Following example shows a provenance created by a Jenkins pipeline.

Running the following step,

```javascript
stage('slsa-full-env') {
    sh ''' valint slsa busybox:latest \
          -o statement \
          --context-type jenkins \
          --output-directory ./scribe/valint \
          --all-env '''
}
```
> Note we use `all-env` to expand the `internalParameters`.

```json
{
  "_type": "https://in-toto.io/Statement/v0.1",
  "predicateType": "https://slsa.dev/provenance/v1",
  "subject": [
    {
      "name": "index.docker.io/library/busybox:latest",
      "digest": {
        "sha256": "5242710cbd55829f6c44b34ff249913bb7cee748889e7e6925285a29f126aa78"
      }
    }
  ],
  "predicate": {
    "buildDefinition": {
      "buildType": "Jenkins_workflow",
      "externalParameters": {
        "pipeline": {
          "actor": "",
          "build_num": "4",
          "job": "slsa-full-env",
          "run_id": "4",
          "type": "jenkins",
          "workflow": "integrations/vanilla/scribe-test-scripted"
        }
      },
      "internalParameters": {
        "build_num": "4",
        "content_type": "statement-slsa",
        "context_type": "jenkins",
        "env": {
          "BUILD_DISPLAY_NAME": "#4",
          "BUILD_ID": "4",
          "BUILD_NUMBER": "4",
          "BUILD_TAG": "jenkins-integrations-vanilla-scribe-test-scripted-4",
          "BUILD_URL": "https://jenkins.dev.scribesecurity.com/job/integrations/job/vanilla/job/scribe-test-scripted/4/",
          "CI": "true",
          "EXECUTOR_NUMBER": "0",
          "HOME": "/var/lib/jenkins",
          "HUDSON_COOKIE": "f1108901-9650-426e-89e8-b40aeba4c784",
          "HUDSON_HOME": "/var/lib/jenkins",
          "HUDSON_SERVER_COOKIE": "e28a37828ffba010",
          "HUDSON_URL": "https://jenkins.dev.scribesecurity.com/",
          "INVOCATION_ID": "117f6dba640f430aaa798f6418280840",
          "JENKINS_HOME": "/var/lib/jenkins",
          "JENKINS_NODE_COOKIE": "53d0ec43-b3e1-4f6a-9b23-3957eaf8a8b8",
          "JENKINS_SERVER_COOKIE": "durable-d259f7f23dec0511b1c137a667d297e312e0d6f8e742f4355c4b20f80f6492cf",
          "JENKINS_URL": "https://jenkins.dev.scribesecurity.com/",
          "JOB_BASE_NAME": "scribe-test-scripted",
          "JOB_DISPLAY_URL": "https://jenkins.dev.scribesecurity.com/job/integrations/job/vanilla/job/scribe-test-scripted/display/redirect",
          "JOB_NAME": "integrations/vanilla/scribe-test-scripted",
          "JOB_URL": "https://jenkins.dev.scribesecurity.com/job/integrations/job/vanilla/job/scribe-test-scripted/",
          "JOURNAL_STREAM": "8:35218",
          "LANG": "C.UTF-8",
          "LOGNAME": "jenkins",
          "NODE_LABELS": "built-in",
          "NODE_NAME": "built-in",
          "NOTIFY_SOCKET": "/run/systemd/notify",
          "PATH": "./temp/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin",
          "PWD": "/var/lib/jenkins/workspace/integrations/vanilla/scribe-test-scripted",
          "RUN_ARTIFACTS_DISPLAY_URL": "https://jenkins.dev.scribesecurity.com/job/integrations/job/vanilla/job/scribe-test-scripted/4/display/redirect?page=artifacts",
          "RUN_CHANGES_DISPLAY_URL": "https://jenkins.dev.scribesecurity.com/job/integrations/job/vanilla/job/scribe-test-scripted/4/display/redirect?page=changes",
          "RUN_DISPLAY_URL": "https://jenkins.dev.scribesecurity.com/job/integrations/job/vanilla/job/scribe-test-scripted/4/display/redirect",
          "RUN_TESTS_DISPLAY_URL": "https://jenkins.dev.scribesecurity.com/job/integrations/job/vanilla/job/scribe-test-scripted/4/display/redirect?page=tests",
          "SHELL": "/bin/bash",
          "STAGE_NAME": "slsa-full-env",
          "USER": "jenkins",
          "VERIFY_TARGET_SCRIPT_PATH": ".valint.rego",
          "WORKSPACE": "/var/lib/jenkins/workspace/integrations/vanilla/scribe-test-scripted",
          "WORKSPACE_TMP": "/var/lib/jenkins/workspace/integrations/vanilla/scribe-test-scripted@tmp"
        },
        "hostname": "ip-10-0-37-198",
        "imageID": "sha256:5242710cbd55829f6c44b34ff249913bb7cee748889e7e6925285a29f126aa78",
        "input_name": "busybox",
        "input_scheme": "docker",
        "input_tag": "latest",
        "job_name": "slsa-full-env",
        "name": "jenkins.scripted.slsa-full-env.basic",
        "node_name": "built-in",
        "run_id": "4",
        "sbomgroup": "image",
        "sbomhashs": [
          "sha256-2376a0c12759aa1214ba83e771ff252c7b1663216b192fbe5e0fb364e952f85c",
          "sha256-5242710cbd55829f6c44b34ff249913bb7cee748889e7e6925285a29f126aa78"
        ],
        "sbomname": "index.docker.io/library/busybox:latest",
        "sbompurl": "pkg:docker/index.docker.io/library/busybox:latest@sha256:5242710cbd55829f6c44b34ff249913bb7cee748889e7e6925285a29f126aa78?arch=amd64",
        "sbomversion": "sha256:5242710cbd55829f6c44b34ff249913bb7cee748889e7e6925285a29f126aa78",
        "target_type": "image",
        "timestamp": "2023-07-26T11:18:28Z",
        "user": "jenkins",
        "workflow": "integrations/vanilla/scribe-test-scripted",
        "workspace": "/var/lib/jenkins/workspace/integrations/vanilla/scribe-test-scripted"
      },
      "resolvedDependencies": [
        {
          "name": "index.docker.io/library/busybox:latest",
          "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
          "annotations": {
            "BUILD_DISPLAY_NAME": "#4",
            "BUILD_ID": "4",
            "BUILD_NUMBER": "4",
            "BUILD_TAG": "jenkins-integrations-vanilla-scribe-test-scripted-4",
            "BUILD_URL": "https://jenkins.dev.scribesecurity.com/job/integrations/job/vanilla/job/scribe-test-scripted/4/",
            "CI": "true",
            "EXECUTOR_NUMBER": "0",
            "HOME": "/var/lib/jenkins",
            "HUDSON_COOKIE": "f1108901-9650-426e-89e8-b40aeba4c784",
            "HUDSON_HOME": "/var/lib/jenkins",
            "HUDSON_SERVER_COOKIE": "e28a37828ffba010",
            "HUDSON_URL": "https://jenkins.dev.scribesecurity.com/",
            "INVOCATION_ID": "117f6dba640f430aaa798f6418280840",
            "JENKINS_HOME": "/var/lib/jenkins",
            "JENKINS_NODE_COOKIE": "53d0ec43-b3e1-4f6a-9b23-3957eaf8a8b8",
            "JENKINS_SERVER_COOKIE": "durable-d259f7f23dec0511b1c137a667d297e312e0d6f8e742f4355c4b20f80f6492cf",
            "JENKINS_URL": "https://jenkins.dev.scribesecurity.com/",
            "JOB_BASE_NAME": "scribe-test-scripted",
            "JOB_DISPLAY_URL": "https://jenkins.dev.scribesecurity.com/job/integrations/job/vanilla/job/scribe-test-scripted/display/redirect",
            "JOB_NAME": "integrations/vanilla/scribe-test-scripted",
            "JOB_URL": "https://jenkins.dev.scribesecurity.com/job/integrations/job/vanilla/job/scribe-test-scripted/",
            "JOURNAL_STREAM": "8:35218",
            "LANG": "C.UTF-8",
            "LOGNAME": "jenkins",
            "NODE_LABELS": "built-in",
            "NODE_NAME": "built-in",
            "NOTIFY_SOCKET": "/run/systemd/notify",
            "OS": "linux",
            "PATH": "./temp/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin",
            "PWD": "/var/lib/jenkins/workspace/integrations/vanilla/scribe-test-scripted",
            "RUN_ARTIFACTS_DISPLAY_URL": "https://jenkins.dev.scribesecurity.com/job/integrations/job/vanilla/job/scribe-test-scripted/4/display/redirect?page=artifacts",
            "RUN_CHANGES_DISPLAY_URL": "https://jenkins.dev.scribesecurity.com/job/integrations/job/vanilla/job/scribe-test-scripted/4/display/redirect?page=changes",
            "RUN_DISPLAY_URL": "https://jenkins.dev.scribesecurity.com/job/integrations/job/vanilla/job/scribe-test-scripted/4/display/redirect",
            "RUN_TESTS_DISPLAY_URL": "https://jenkins.dev.scribesecurity.com/job/integrations/job/vanilla/job/scribe-test-scripted/4/display/redirect?page=tests",
            "SHELL": "/bin/bash",
            "STAGE_NAME": "slsa-full-env",
            "USER": "jenkins",
            "VERIFY_TARGET_SCRIPT_PATH": ".valint.rego",
            "WORKSPACE": "/var/lib/jenkins/workspace/integrations/vanilla/scribe-test-scripted",
            "WORKSPACE_TMP": "/var/lib/jenkins/workspace/integrations/vanilla/scribe-test-scripted@tmp",
            "architecture": "amd64",
            "build_num": "4",
            "context_type": "jenkins",
            "hostname": "ip-10-0-37-198",
            "imageID": "sha256:5242710cbd55829f6c44b34ff249913bb7cee748889e7e6925285a29f126aa78",
            "input_name": "busybox",
            "input_scheme": "docker",
            "input_tag": "latest",
            "job_name": "slsa-full-env",
            "manifest-digest": "sha256:f06e6c2ae878663b396244411f9f485805308a0fdaaa4600c0f532576e21e842",
            "media-type": "application/vnd.docker.distribution.manifest.v2+json",
            "name": "jenkins.scripted.slsa-full-env.basic",
            "node_name": "built-in",
            "repoDigest_0": "busybox@sha256:2376a0c12759aa1214ba83e771ff252c7b1663216b192fbe5e0fb364e952f85c",
            "run_id": "4",
            "tag_0": "latest",
            "tag_1": "latest",
            "timestamp": "2023-07-26T11:18:28Z",
            "user": "jenkins",
            "workflow": "integrations/vanilla/scribe-test-scripted",
            "workspace": "/var/lib/jenkins/workspace/integrations/vanilla/scribe-test-scripted"
          }
        }
      ]
    },
    "runDetails": {
      "builder": {
        "id": "JenkinsCI",
        "builderDependencies": [
          {
            "uri": "https://scribesecuriy.jfrog.io/scribe-docker-public-local/valint:0.3.0-3",
            "name": "valint",
            "annotations": {
              "vendor": "Scribe security, Inc",
              "version": "0.3.0-3"
            }
          }
        ]
      },
      "metadata": {
        "invocationID": "4"
      },
      "byproducts": [
        {
          "uri": "pkg:layer/index.docker.io/library/busybox:latest@sha256:feb4513d4fb7052bcff38021fc9ef82fd409f4e016f3dff5c20ff5645cde4c02?index=0",
          "digest": {
            "sha256": "feb4513d4fb7052bcff38021fc9ef82fd409f4e016f3dff5c20ff5645cde4c02"
          },
          "mediaType": "application/vnd.docker.image.rootfs.diff.tar.gzip",
          "annotations": {
            "CreatedBy": "#(nop) ADD file:d33bc235bde0698458927440e9b8ac70686d1c73b31817351525ed122f1cffe9 in / ",
            "index": "0",
            "size": "4261550"
          }
        }
      ]
    }
  }
}
```
</details>

### Customizing
Following are some of the customizable features we support.
* Attach a external file **Content included** as a byProduct, use `--by-product` flag.
* Automatically expand `byProducts` with detailed target components, use `--components` to select between the group types.
* Set any one of specific provenance field, use `--invocation`, `--build-type`, `--builder-id`,`--started-on`, `--finished-on` flags.
* Attach environment variables to `internalParameters`, use `--env` or `--all-env` flags.
* Provide custom predicate, use `--predicate` with partial or full SLSA provenance predicate.
* Provide custom statement, use `--statement` with partial or full SLSA provenance statement.

<details>
  <summary>  Attach an External File as a ByProduct </summary>

You can attach an external file as a byProduct using the `--by-product`t flag. This file and its **content** will be included as part of the SLSA provenance evidence.

```bash
valint slsa busybox:latest --by-product /path/to/my_file.txt
```
</details>

<details>
  <summary>  Automatically Expand byProducts </summary>

You can automatically expand the byProducts with detailed target components using the `--components` flag to select between group types.

```bash
valint slsa busybox:latest --components layers,packages,files
```
</details>

<details>
  <summary>  Set Specific Provenance Fields </summary>

You can set specific provenance fields using the following flags:

* `--invocation`: Set metadata invocation ID.
* `--build-type`: Set build type.
* `--builder-id`: Set builder ID.
* `--started-on`: Set metadata started time.
* `--finished-on`: Set metadata finished time.

```bash
valint slsa busybox:latest --invocation my_invocation --build-type docker --builder-id 12345 --started-on 2023-07-25T15:30:00Z --finished-on 2023-07-25T16:00:00Z
```
</details>


<details>
  <summary>  Set Specific External parameter </summary>

You can attach environment variables to internalParameters using the `--external` flags.

> Flag only supports key value parameters

```bash
valint slsa busybox:latest --external my_custom_param=my_custom_value
```
</details>

<details>
  <summary>  Attach Environment Variables </summary>

You can attach environment variables to internalParameters using the `--env` or `--all-env` flags.

```bash
# Attach all environment variables
valint slsa busybox:latest --all-env

# Attach a specific environment variable
valint slsa busybox:latest --env MY_ENV
```
</details>

<details>
  <summary>  Provide Custom Provenance Predicate </summary>

You can provide a custom SLSA provenance predicate using the `--predicate` flag, specifying the path to the predicate file.

> Custom predicate will be merged in to the `valint slsa` output evidence.)

```bash
valint slsa busybox:latest --predicate custom.predicate.json
```

For example the following `custom.predicate.json` defines custom `externalParameters`, `builderDependencies` and `metadata`.
```json
{
  "buildDefinition": {
    "externalParameters": {
      "custom_external": {
        "digest": {
          "sha1": "910b17c3bc81ca8c791aaa394d508219e03879f8"
        },
        "name": "build-environment",
        "value": "production",
        "uri": "https://company.com/my_repo/event"
      }
    }
  },
  "runDetails": {
    "builder": {
      "builderDependencies": [
        {
          "uri": "https://github.com/.github/reusable_build.yaml",
          "name": "my_tool",
          "annotations": {
            "vendor": "My company Inc",
            "version": "1.0"
          }
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

</details>

<details>
  <summary>  Provide Custom Provenance Statement </summary>

You can provide a custom SLSA provenance statement using the `--statement` flag, specifying the path to the statement file.

> Note the custom statement will be merged in to the `valint slsa` output evidence.

```bash
valint slsa busybox:latest --statement custom.statement.json
```

For example the following `custom.statement.json` wil include custom `subject` and `byproducts`,
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
           "annotations": {
              "tag": "v0.0.1"
           }
        }
     ]
    }
  }
}
```
</details>


## Evidence Stores
Each Evidence store can be used to store, find and download evidence, which unifies all the evidence collected from the supply chain into a unified system.

### Scribe Evidence store
Scribe evidence store allows you to store evidence using scribe Service.

Related Flags:
> Note the flag set:
>* `-U`, `--scribe.client-id`
>* `-P`, `--scribe.client-secret`
>* `-E`, `--scribe.enable`

### Before you begin
Integrating Scribe Hub with your environment requires the following credentials that are found on the **Integrations** page. (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **integrations**)

* **Client ID**
* **Client Secret**

<img src='../../../../img/ci/integrations-secrets.jpg' alt='Scribe Integration Secrets' width='70%' min-width='400px'/>

### Usage
```bash
# Generating evidence, storing in scribe service.
valint slsa [target] -o [attest, statement] \
  -E \
  -U [SCRIBE_CLIENT_ID] \
  -P [SCRIBE_CLIENT_SECRET]

# Verifying evidence, pulling attestation from scribe service.
valint verify [target] -i [attest-slsa, statement-slsa] \
  -E \
  -U [SCRIBE_CLIENT_ID] \
  -P [SCRIBE_CLIENT_SECRET]
```

### OCI Evidence store
Admission supports both storage and verification flows for `attestations` and `statement` objects utilizing OCI registry as an evidence store.

Using OCI registry as an evidence store allows you to upload, download and verify evidence across your supply chain in a seamless manner.

Related flags:
* `--oci` Enable OCI store.
* `--oci-repo` - Evidence store location.


### Docker hub limitation
Docker hub does not support the subpath format, `oci-repo` should be set to your Docker hub Username.

> Some registries like Jfrog allow multi layer format for repo names such as , `my_org.jfrog.io/policies/attestations`.

### OCI Repo flag
`oci-repo` setting indicates the location in a registry under which the evidence are stored.
It must be a dedicated location in an OCI registry.
for example, `scribesecuriy.jfrog.io/my_docker-registry/evidence`.

### Before you begin
Evidence can be stored in any accusable registry.
* Write access is required for upload (generate).
* Read access is required for download (verify).

You must first log in with the required access privileges to your registry before calling Valint.
For example, using the `docker login` command.

### Usage
```bash
# Generating evidence, storing on [my_repo] OCI repo.
valint slsa [target] -o [attest, statement] --oci --oci-repo=[my_repo]

# Verifying evidence, pulling attestation from [my_repo] OCI repo.
valint verify [target] -i [attest-slsa, statement-slsa] --oci --oci-repo=[my_repo]
```

> For image targets **only** you may attach the evidence in the same repo as the image.

```bash
valint slsa [image] -o [attest, statement] --oci

valint verify [image] -i [attest-slsa, statement-slsa] --oci
```

> For related Cosign support, see [cosign-support](#cosign-support) section.

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
valint slsa [target] -o [attest, statement] --output-directory=[my_dir]

# Verifying evidence, pulling attestation from [my_dir] local directory.
valint verify [target] -i [attest-slsa, statement-slsa] --output-directory=[my_dir]
```

> By default, the evidence is written to `~/.cache/valint/`, use `--output-file` or `-d`,`--output-directory` to customize the evidence output location. 



## Basic examples
<details>
  <summary>  Docker built image </summary>

Create SLSA Provenance for image built by local docker `image_name:latest` image.

```bash
docker build . -t image_name:latest
valint slsa image_name:latest
``` 
</details>

<details>
  <summary>  Private registry image </summary>

Create SLSA Provenance for images hosted by a private registry.

> `docker login` command is required to enable access the private registry.

```bash
docker login
valint slsa scribesecuriy.jfrog.io/scribe-docker-local/stub_remote:latest
```
</details>

<details>
  <summary>  Include specific environment </summary>

Custom env added to SLSA Provenance internal parameters.

```bash
export test_env=test_env_value
valint slsa busybox:latest --env test_env 
```

</details>

<details>
  <summary>  Include ALL environment </summary>

ALL environment added to SLSA Provenance.

```bash
export test_env=test_env_value
valint slsa busybox:latest --all-env
```

</details>


<details>
  <summary> Custom evidence location </summary>

Use flags `--output-directory` or `--output-file` flags to set the default location.

```bash
# Save evidence to custom path
valint slsa busybox:latest --output-file my_slsa_provenance.json
ls -lh my_slsa_provenance.json

# Change evidence cache directory 
valint slsa busybox:latest --output-directory ./my_evidence_cache
ls -lhR my_evidence_cache
``` 
</details>

<details>
  <summary> Docker archive image  </summary>

Create SLSA Provenance for local `docker save ...` output.

```bash
docker save busybox:latest -o busybox_archive.tar
valint slsa docker-archive:busybox_archive.tar
``` 
</details>

<details>
  <summary> Directory target  </summary>

Create SLSA Provenance for a local directory.

```bash
mkdir testdir
echo "test" > testdir/test.txt

valint slsa dir:testdir
``` 
</details>


<details>
  <summary> Git target  </summary>

Create SLSA Provenance for `mongo-express` remote git repository.

```bash
valint slsa git:https://github.com/mongo-express/mongo-express.git
``` 

Create SLSA Provenance for `yourrepository` local git repository.

```bash
git clone https://github.com/yourrepository.git
valint slsa git:yourrepository
``` 

</details>

<details>
  <summary>  Public registry image  </summary>

Create SLSA Provenance for remote `busybox:latest` image.

```bash
valint slsa busybox:latest
``` 

</details>

<details>
  <summary> Attest target </summary>

Create and sign SLSA Provenance for target. <br />

> By default, *Valint* is using [Sigstore](https://www.sigstore.dev/ "Sigstore") interactive flow as the engine behind the signing mechanism.

```bash
valint slsa busybox:latest -o attest
``` 
</details>

<details>
  <summary> Attest and verify image target </summary>

Generating and verifying SLSA Provenance `attestation` for image target `busybox:latest`.

> By default, *Valint* is using [Sigstore](https://www.sigstore.dev/ "Sigstore") interactive flow as the engine behind the signing mechanism.

```bash
# Create SLSA Provenance attestations
valint slsa busybox:latest -vv -o attest

# Verify SLSA Provenance attestations
valint verify busybox:latest -i attest-slsa
```
</details>

<details>
  <summary> Attest and verify Git repository target  </summary>

Generating and verifying `statements` for remote git repo target `https://github.com/mongo-express/mongo-express.git`.

```bash
valint slsa git:https://github.com/mongo-express/mongo-express.git -o attest
valint verify git:https://github.com/mongo-express/mongo-express.git
``` 

Or for a local repository
```bash
# Cloned a local repository
git clone https://github.com/mongo-express/mongo-expressvalint ver.git

# Create CycloneDX SLSA Provenance attestations
valint slsa git:./mongo-express -o attest

# Verify CycloneDX SLSA Provenance attestations
valint verify git:./mongo-express -i attest-slsa
```
</details>

<details>
  <summary> Store evidence on OCI </summary>

Store any evidence on any OCI registry. <br />
Support storage for all targets and both SLSA Provenance and SLSA evidence formats.

> Use `-o`, `--format` to select between supported formats. <br />
> Write permission to `--oci-repo` value is required. 

```bash
# Login to registry
docker login $

# Generate and push evidence to registry
valint slsa [target] -o [attest, statement] --oci --oci-repo $REGISTRY_URL

# Pull and validate evidence from registry
valint verify [target] -i [attest-slsa, statement-slsa] --oci --oci-repo $REGISTRY_URL -f
```
> Note `-f` in the verification command, which skips the local cache evidence lookup.

</details>

<details>
  <summary> Store evidence on Scribe service </summary>

Store any evidence on any Scribe service. <br />
Support storage for all targets and both SLSA Provenance and SLSA evidence formats.

> Use `-o`, `--format` to select between supported formats. <br />
> Credentials for Scribe API is required. 

```bash

# Set Scribe credentials
export SCRIBE_CLIENT_ID=**
export SCRIBE_CLIENT_SECRET=**

# Generate and push evidence to registry
valint slsa [target] -o [attest, statement] --f -E \
  -U $SCRIBE_CLIENT_ID \
  -P $SCRIBE_CLIENT_SECRET

# Pull and validate evidence from registry
valint verify [target] -i [attest-slsa, statement-slsa] -f -E \
  -U $SCRIBE_CLIENT_ID \
  -P $SCRIBE_CLIENT_SECRET
```

> Note `-f` in the verification command, which skips the local cache evidence lookup.

</details>


## Cosign support
[Cosign](https://github.com/sigstore/cosign) is an innovative tool that aims to make signatures an invisible infrastructure.
Valint supports integration with the awesome `cosign` CLI tool and other parts of the `sigstore` verification process.

<details>
  <summary> verifying using cosign </summary>

One can use `valint` to generate the `slsa` attestation and attach it to OCI registry, you can then use `cosign` to verify the attestation.

> Attestations are pushed to OCI by Valint for cosign to consume.

> For further details see [cosign verify-attestation](https://docs.sigstore.dev/cosign/verify/)


```bash
# Generate sbom attestation
valint slsa [image] -vv -o attest -f --oci

# Verify attestation using cosign 
COSIGN_EXPERIMENTAL=1 cosign verify-attestation [image]--type https://slsa.dev/provenance/v1 \
  --certificate-identity=name@example.com  --certificate-oidc-issuer=https://accounts.example.com
``` 
</details>


<details>
  <summary> verifying using Kyverno </summary>

One can use `valint` to generate the `slsa` attestation and attach it to OCI registry, you can then use `cosign` to verify the attestation.

> Attestations are pushed to OCI by Valint for kyverno to consume.

> For further details see [kyverno verify-images](https://kyverno.io/docs/writing-policies/verify-images/sigstore/#verifying-image-signatures)

```bash
# Generate SBOM evidence statement
valint slsa my_account/my_image:latest -vv -o attest -f --oci
```

```yaml 
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: check-image-keyless
spec:
  validationFailureAction: Enforce
  webhookTimeoutSeconds: 30
  rules:
    - name: check-slsa-image-keyless
      match:
        any:
        - resources:
            kinds:
              - Pod
      verifyImages:
      - imageReferences:
        - "my_account/my_image*"
        attestations:
          - predicateType: https://slsa.dev/provenance/v1
            attestors:
            - entries:
              - keyless:
                  subject: name@example.com
                  issuer: https://accounts.example.com
                  rekor: 
                    url: https://rekor.sigstore.dev
```

</details>

<details>
  <summary> Signing and verifying using cosign </summary>

One can create predicates for any attestation format (`sbom`, `slsa`), you then can use `cosign` to verify the attestation.

> Example uses keyless (Sigstore) flow, you may use any `cosign` signing capability supported.

> For further details see (cosign verify-attestation)[https://docs.sigstore.dev/cosign/verify/]

```bash
# Generate SBOM evidence statement
valint slsa [image] -vv -o statement -f --output-file valint_statement.json

# Extract predicate
cat valint_predicate.json | jq '.predicate' > valint_predicate.json

# Sign and OCI store using cosign
COSIGN_EXPERIMENTAL=1 cosign attest --predicate  valint_predicate.json [image] --type hhttps://slsa.dev/provenance/v1

# Verify attestation using cosign 
COSIGN_EXPERIMENTAL=1 cosign verify-attestation [image] --type https://slsa.dev/provenance/v1 \
  --certificate-identity=name@example.com  --certificate-oidc-issuer=https://accounts.example.com
```
</details>


## Reaching SLSA Levels with `valint slsa`
---
​SLSA (Supply-chain Levels for Software Artifacts) is a security framework aiming to prevent tampering, improve integrity, and secure packages and infrastructure. The core concept of SLSA is that a software artifact can be trusted only if it complies to three requirements:
1. The artifact should have a Provenance document, describing it's origin and build process (L1).
2. The Provenance document should be trustworthy and verified downstream (L2).
3. The build platform should be trustworthy (L3).
​
The SLSA framework defines levels, which represent how secure the software supply chain is. These levels correspond to the level of implementation of these requirements.
​
Scribe's `valint slsa` command can be used to produce Provenance documents. Following we describe how to achieve SLSA levels alongside with using this tool.
​
Note: We refer here to the SLSA V1.0 framework.
​
## SLSA L1
The [requirements](https://slsa.dev/spec/v1.0/levels#build-l1) for SLSA L1 include:
- Software producer follows a consistent build process.
- Build platform automatically generates provenance describing how the artifact was built.
- Software producer distributes provenance to consumers.
​
Checklist for achieving SLSA L1:
- Build your software using a CI system. Preferably use a build script that is source-controlled.
- Activate the `valint slsa` command as part of your build script to create a Provenance document. Notice that the `valint slsa` command allows adding additional information to the Provenance document - on can tailor some of the content of the Provenance document to his needs.

### Create Provenance using `valint slsa`​
To achieve SLSA Level 1 using `valint slsa`:

```bash
# Create unsigned SLSA Provenance
valint slsa [target]
```

### Verify Provenance using `valint verify`
To verify SLSA Level 2 using `valint slsa` 
run the following.

```bash 
# Create signed SLSA Provenance
valint verify [target] -i statement-slsa
```
​
## SLSA L2
The [requirements](https://slsa.dev/spec/v1.0/levels#build-l2) for SLSA L2 include:
- The SLSA L1 requirements.
- The build runs on a hosted build platform that generates and signs the provenance itself. 
- Downstream verification of provenance includes validating the authenticity of the provenance.
​
Checklist for achieving SLSA L2:

- The SLSA L1 checklist.
- Use a hosted build service (as opposed to performing a build on the developer machine).
- Create a signed Provenance document (instead of the unsigned that is enough for SLSA L1) This can be achieved by running ```valint slsa ... -o attest```. 
- Verify the authenticity of the Provenance document downstream using the ```valint verify``` command.

### Key management
Keys or access tokens should be stored on the build platform or preferred secret management system.
Make sure to expose access only to the provenance creation step or workflow.

> For signing configuration details, see [attestations](docs/attestations)

### Create Provenance using `valint slsa`​
To achieve SLSA Level 2 using `valint slsa` 
run the following on the build platform.

```bash 
# Create signed SLSA Provenance
valint slsa [target] -o attest --context-type [jenkins github circleci azure gitlab travis bitbucket]
```

### Verify Provenance using `valint verify`
To verify SLSA Level 2 using `valint slsa` 
run the following.

```bash 
# Create signed SLSA Provenance
valint verify [target] -i attest-slsa --email [build-platform-identity]
```

## SLSA L3
The [requirements](https://slsa.dev/spec/v1.0/levels#build-l3) for SLSA L3 include:
- The SLSA L2 requirements.
- Build platform implements strong controls to:
    - prevent runs from influencing one another, even within the same project.
    - prevent secret material used to sign the provenance from being accessible to the user-defined build steps.
​
In addition, in order to trust the build platform, one needs to [verify the build platform](https://slsa.dev/spec/v1.0/verifying-systems). The build platform should be trusted in the sense that the Provenance document will be [unforgable](https://slsa.dev/spec/v1.0/requirements#provenance-unforgeable) and the build will be [isolated](https://slsa.dev/spec/v1.0/requirements#isolated). 


Such verification derives the following requirements:
- Verify the trustworthiness of the build platform itself. 
    - Such a verification should be done with the build platform vendor for SaaS CIs. In cases that the software producer is responsible for the deployment of the build platform, a combination of vendor-self-attestation, and performing an analysis of the deployment aspects is recommended.
    - For example; When deploying a self-hosted CI, the vendor attestation should declare how builds are [isolated](https://slsa.dev/spec/v1.0/requirements#isolated) from each other, and the deployment analysis should verify the access-permissions and log-auditing of the CI system. 
- Verify that the use of platform does not break the [unforgable](https://slsa.dev/spec/v1.0/requirements#provenance-unforgeable) or [isolated](https://slsa.dev/spec/v1.0/requirements#isolated) requirements.
​
### SLSA L3 - Checklist 
- The SLSA L2 checklist.
- Assess the CI system. The goal is to answer the following questions:
    - in what conditions can a unauthorized entity evade the build platform
    - in what conditions can build affect each other.
- Isolate the generation of the Provenance document:
    - If the build platform supports secure build runners - use a secure runner (example: [GitHub](TBD LINK ***)), 
​
    or
​
    - Separate the creation of the Provenance document to a different pipeline, preferably on a separate build service. 
        - Expose to this pipeline only the secret materials used for signing the Provenance document.
        - Either create or verify the Provenance document content on this pipeline. In the case of verifying, verify all possible fields of an in-pipeline-generated Provenance document with data collected directly from the build platform, or from other trusted sources. 
- Isolate, and verify the isolation of the build pipeline from other pipeline runs:
    - Verify not using caches, volumes shared with other pipeline runs.
    - Verify that secrets shared with other pipelines cannot allow for pipelines to affect each other.
    - Verify that pipeline runs cannot affect each other
        - example - prevent installations done through one pipeline to affect other pipeline runs. This can be done by using ephemeral build-runners (such as a container that is created for each build), or by verifying that build-runners start each time from a predefined state.
​
These requirements are challenging and the SLSA framework specifically suggests that organizations gradually evolve from SLSA L2 to SLSA L3 compliance. 

### Build service trusted builder
> When build service supports a trusted builder


use it, and use the the trusted bulider to run `valint slsa` command to create the Provenance document.

### Create Provenance using `valint slsa`​
To achieve SLSA Level 3 using `valint slsa` 
run the following in trusted builder.

```
# Create signed SLSA Provenance
valint slsa [target] -o attest --label builder_slsa_evidence
```

### Self attestation trusted builder
> When build service does supports a trusted builder
​

Instrument the build pipeline for generating all attestations that will be needed to populate the Provenance document. For example, you may decide you want a list of the dependencies installed during the build. This list can be generated by a ```valint bom dir:``` command. In addition, create a Provenance attestation in the pipeline using the `valint slsa` command.

- Create a separate trusted-provenance-generation pipeline that will perform the following
- Generate a trusted Provenance document, based on the one created in the build pipeline;
    - Collect data from the build service and use it to verify and update the Provenance document.
    - verify the content of attestations created in the build-pipeline. For example, verify the content of the build-runner by comparing an SBOM attestation from the build-pipeline with an SBOM attestation that was sampled separately.
    - Use attestations collected from the build pipeline to update the Provenance document.
    - Updating the Provenance document can be done using `valint slsa` command.
- Verify that the build was isolated, by evaluating data collected from the build service. For example - verfy the use of caches an secrets.
​
In order to perform such data collection and evaluation, Scribe provides tools that create attestations to the build run, and perform the verifications needed. 
​
Please contact us for designing and implementing such a deployment.


<!-- ### Create Provenance using `valint slsa` - Coming soon​
To achieve SLSA Level 3 using `valint slsa`:

* Run the following in trusted builder, to attach any number of external evidence on the trustiness of the build platform.

```bash
# Use third party tool to review the build service security requirements
some_scanner -o [report_path]

# Attach file as generic evidence
valint bom [report_path] -o generic-attest \
  --predicate-type [custom-predicate] \
  --context-type [jenkins github circleci azure gitlab travis bitbucket] \
  --label [builderDependencies,resolvedDependencies,byproducts]

# Attach SBOM evidence
valint bom [target] -o attest  \
  --context-type [jenkins github circleci azure gitlab travis bitbucket] \
  --label [builderDependencies,resolvedDependencies,byproducts]
```

* Generate SLSA Provenance by running the following in trusted builder.
```bash
valint slsa [target] -o attest \
  --context-type [jenkins github circleci azure gitlab travis bitbucket]
``` -->

<!-- ### Recommended SLSA L3 Evidence
<details>
  <summary> Trusted Builder dependency SBOM </summary>

In trusted builder run the following,
```bash
valint bom git:. -o attest  --label builderDependencies
``` 

</details>

<details>
  <summary> Build directory resolved dependency SBOM </summary>

Build resolved dependencies SBOM attached as a resolvedDependencies.
```bash
valint bom dir:<build_working_dir> -o attest --label resolvedDependencies
``` 

</details>

<details>
  <summary> Build Artifact SBOM </summary>
  
```bash
valint bom [target] -o attest  --label builderDependencies
``` 

</details> -->