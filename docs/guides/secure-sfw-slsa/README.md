
---

## sidebar_label: "Securing your software builds using SLSA framework"
title: "Securing your software builds using SLSA framework"
sidebar_position: 1
toc_min_heading_level: 2
toc_max_heading_level: 5
### Introduction
[﻿SLSA](https://slsa.dev/) (Supply Chain Levels for Software Artifacts) is a security framework for software producers to prevent tampering, improve integrity, and secure packages and infrastructure.
Scribe is designed to help you efficiently attain SLSA levels as explained throughout this guide.
SLSA is organized into levels, each representing incremental progress over the previous one. It has a stable specification, dubbed [﻿v1.0 release](https://slsa.dev/spec/v1.0/whats-new). As SLSA requirements might be challenging to implement we suggest organizations gradually progress through the SLSA levels.

The major SLSA requirements by level are summarized below:
**Level 1:**
(See on [﻿SLSA website](https://slsa.dev/spec/v1.0/levels#build-l1)) 

- The software producer follows a consistent build process.
- The build platform automatically generates provenance describing how the artifact was built.
- The software producer distributes provenance to consumers.
**Level 2:**
(See on [﻿SLSA website](https://slsa.dev/spec/v1.0/levels#build-l2)) 

- **Level 1 requirements**.
- The builds run on a hosted build platform that generates and signs the provenance document.
- The software consumer can verify the authenticity and integrity of the provenance document with a digital signature.
**Level 3:**
(See on [﻿SLSA website](https://slsa.dev/spec/v1.0/levels#build-l3))
At this level, the framework calls for the generation of a non-forgeable provenance document.

- **Level 2 requirements**.
- The build platform implements strong controls as follows:
    - Prevent runs from influencing one another, even within the same project.
    - Prevent secret material used to sign the provenance from being accessible by the user-defined build steps.
- ​The [﻿build platform is verified](https://slsa.dev/spec/v1.0/verifying-systems)  so that the provenance is [﻿unforgeable](https://slsa.dev/spec/v1.0/requirements#provenance-unforgeable)  and the build is isolated as follows:
    - If you are using a SaaS CI, verify the trustworthiness of the build with the build platform vendor.
    - If you self-host the build platform provide a vendor-self-attestation (in addition, we recommend an analysis of the build-platform security posture). For example, the vendor attestation declares the way builds are [﻿isolated](https://slsa.dev/spec/v1.0/requirements#isolated)  one from another, how diverting from build-isolation can be detected and how this isolation was assessed as part of the security posture analysis.
    - Verify that the use of the platform does not break the [﻿unforgeable](https://slsa.dev/spec/v1.0/requirements#provenance-unforgeable)  and [﻿isolated](https://slsa.dev/spec/v1.0/requirements#isolated)  requirements (for example: verify the use of caches).​
### How Scribe helps you attain a SLSA level
Scribe automatically gathers evidence and creates a SLSA attestation for every build of your product.

Scribe does this by providing the following capabilities:

1. Scanning your SCM and your build system security configuration by connecting to your systems’ APIs.
2. Generating a signed provenance document for every build by employing a plugin, Scribe Valint, for your CI systems. 
3. Ensuring that the provenance document cannot be forged in the build pipeline.
The provenance document includes the following data:

1. Git: git commit ID and git URL.
2. CI build platform, build ID, build environment variables. 
3. Artifact name and hash.
As SLSA requirements leave room for adding information, Scribe allows you to add custom data to the provenance document.

Scribe Valint generates by default the [﻿standard provenance document](https://slsa.dev/provenance/v1) as in the snippet below. It can be better understood by reviewing empirical examples from GitHub and Jenkins that appear below.

 Valint provenance template 

```
{
   "_type": "https://in-toto.io/Statement/v0.1",
   "predicateType": "https://slsa.dev/provenance/v1",
   "subject": [
      // Target subject
   ],
   "predicate": {
      "buildDefinition": {
         "buildType": { context type }, // jenkins, github,circleci,azure,gitlab,travis,bitbucket,local
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
#### Examples
 Provenance Document from GitHub 

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
           "uri": "https://scribesecurity/valint:0.3.0-3",
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
 Provenance Document from Jenkins 

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
            "uri": "https://scribesecurity/valint:0.3.0-3",
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
#### Storing the Provenance Document in an evidence store
You can store, manage, and retrieve Provenance Documents in your supply chain in Scribe Hub (recommended) which facilitates evidence or attestation management, supply chain risk analysis and management, and evidence and attestation sharing hub for software producers and consumers.

You can also use the following [﻿alternative evidence stores](../../integrating-scribe/other-evidence-stores):

- OCI Registry - leverage your image registry for storing and retrieving evidence or attestations. This integration is practical for standalone deployments.
- File System Evidence store​ - Leverages a shared volume for storing and retrieving evidence or attestations. This integration is practical for standalone deployments.
You can read more on the SLSA website about [﻿SLSA requirements](https://slsa.dev/spec/v0.1/requirements) and [﻿SLSA provenance specifications](https://slsa.dev/provenance/v1).



<!--- Eraser file: https://app.eraser.io/workspace/sb9rxNLaK94z1My2aGxj --->