---
sidebar_label: "Securing your software builds using SLSA framework"
title: "Securing your software builds using SLSA framework"
sidebar_position: 2
toc_min_heading_level: 2
toc_max_heading_level: 5
---

### Introduction

**[SLSA](https://slsa.dev/)** (Supply Chain Levels for Software Artifacts) is a security framework for software producers to prevent tampering, improve integrity, and secure packages and infrastructure. 
Scribe is designed to help you efficiently attain SLSA levels as explained throughout this guide.
SLSA is organized into levels, each representing incremental progress over the previous one.It has a stable specification, dubbed **[v1.0 release](https://slsa.dev/spec/v1.0/whats-new)**. As SLSA requirements might be challenging to implement we suggest organizations gradually progress through the SLSA levels.

The major SLSA requirements by level are are summarized below:  
**Level 1:**  
(See on **[SLSA website](https://slsa.dev/spec/v1.0/levels#build-l1)**)  
* The software producer follows a consistent build process.
* The build platform automatically generates provenance describing how the artifact was built.
* The software producer distributes provenance to consumers.

**Level 2:**  
(See on **[SLSA website](https://slsa.dev/spec/v1.0/levels#build-l2)**)  
* Level 1 requirements.
* The builds run on a hosted build platform that generates and signs the provenance document.
* The software consumer can verify the authenticity and integrity of the provenance document with a digital signature.

**Level 3:**  
(See on **[SLSA website](https://slsa.dev/spec/v1.0/levels#build-l3)**)  
At this level, the framework calls for the generation of a non-forgeable provenance document.
* Level 2 requirements.
* The build platform implements strong controls as follows:
  * Prevent runs from influencing one another, even within the same project.
  * Prevent secret material used to sign the provenance from being accessible by the user-defined build steps.
* ​The **[build platform is verified](https://slsa.dev/spec/v1.0/verifying-systems)** so that the provenance is **[unforgeable](https://slsa.dev/spec/v1.0/requirements#provenance-unforgeable)** and the build is isolated as follows:
  * If you are using a SaaS CI, verify the trustworthiness of the build with the build platform vendor.
  * If you self-host the build platform provide a vendor-self-attestation (in addition, we recommend an analysis of the build-platform security posture). For example, the vendor attestation declares the way builds are **[isolated](https://slsa.dev/spec/v1.0/requirements#isolated)** one from another, how diverting from build-isolation can be detected and how this isolation was assessed as part of the security posture analysis.
  * Verify that the use of the platform does not break the **[unforgeable](https://slsa.dev/spec/v1.0/requirements#provenance-unforgeable)** and **[isolated](https://slsa.dev/spec/v1.0/requirements#isolated)** requirements (for example: verify the use of caches).​

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

Scribe Valint generates by default the **[standard provenance document](https://slsa.dev/provenance/v1)** as in the snippet below. It can be better understood by reviewing empirical examples from GitHub and Jenkins that appear below.

<details>
  <summary> Valint provenance template </summary>

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
</details>

#### Examples

<details>
  <summary> Provenance Document from GitHub </summary>

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
  <summary> Provenance Document from Jenkins </summary>

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

#### Storing the Provenance Document in an evidence store

You can store, manage, and retrieve Provenance Documents in your supply chain in Scribe Hub (recommended) which facilitates evidence or attestation management, supply chain risk analysis and management, and evidence and attestation sharing hub for software producers and consumers.

You can also use the following **[alternative evidence stores](#integrating-with-alternative-types-of-evidence-stores)**:
* OCI Registry - leverage your image registry for storing and retrieving evidence or attestations. This integration is practical for standalone deployments.
* File System Evidence store​ - Leverages a shared volume for storing and retrieving evidence or attestations. This integration is practical for standalone deployments.


You can read more on the SLSA website about **[SLSA requirements](https://slsa.dev/spec/v0.1/requirements)** and **[SLSA provenance specifications](https://slsa.dev/provenance/v1)**.

### Getting started with SLSA Level 1

Checklist for attaining SLSA v1.0 Level 1:
* Build your software using a CI system. Preferably, with a build script that is source-controlled.
* Call the Scribe Valint slsa command from your build script to generate a provenance document.
* Distribute the Provenance Document using Scribe Hub.

Before you begin​ **[install the Scribe Plugin for your CI build system](../../integrating-scribe/ci-integrations/)**.

The general Valint call structure is:
```
  # Create an unsigned SLSA Provenance Document
  valint slsa [target] -o statement \
  -E \
  -U [SCRIBE_CLIENT_ID] \
  -P [SCRIBE_CLIENT_SECRET]
```
Where `[Target]` is the build artifact and `-E` specifies storing the document in Scribe Hub where you can manage all your documents and distribute them to consumers.

You can store the Provenance Document in **[alternative evidence stores](#integrating-with-alternative-types-of-evidence-stores)**.
Use command flags to **[customize the content of the provenance document](#customizing-the-provenance-document)**.

Verify downstream that the attestation exists in the **[evidence store](#integrating-with-alternative-types-of-evidence-stores)** by calling:
```
  valint verify [target] -i statement-slsa \
  -E \
  -U [SCRIBE_CLIENT_ID] \
  -P [SCRIBE_CLIENT_SECRET]
```
#### Examples

<details>
  <summary> GitHub </summary>

```yaml
- name: Generate SLSA provenance statement
 id: valint_slsa_statement
 uses: scribe-security/action-bom@master
 with:
   target: 'busybox:latest'
   format: statement-slsa

- uses: actions/upload-artifact@v2
 with:
   name: provenance
   path: ${{ steps.valint_slsa_statement.outputs.OUTPUT_PATH }}
```
</details>

<details>
  <summary> GitLab CI/CD </summary>

```yaml
scribe-gitlab-job:
    stage: scribe-gitlab-stage
    script:
      - valint bom [target]
          -o attest-slsa
          --context-type gitlab
          --output-directory ./scribe/valint
          -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET
          --logical-app-name $LOGICAL_APP_NAME --app-version $APP_VERSION
```
</details>

<details>
  <summary> Azure DevOps </summary>

```yaml
- task: ValintCli@0
    inputs:
      commandName: bom
      target: [target]
      format: attest-slsa
      outputDirectory: $(Build.ArtifactStagingDirectory)/scribe/valint
      scribeEnable: true
      scribeClientId: $(SCRIBE-CLIENT-ID)
      scribeClientSecret: $(SCRIBE-CLIENT-SECRET)
      app-name: $(LOGICAL_APP_NAME)
      app-version: $(APP_VERSION)
```
</details>

<details>
  <summary> Travis CI </summary>

```yaml
script:
  - |
    valint bom [target] \
        --format [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] \
        --context-type travis \
        --output-directory ./scribe/valint \
        -E -U $SCRIBE_CLIENT_ID -P $SCRIBE_CLIENT_SECRET \
        --logical-app-name $LOGICAL_APP_NAME --app-version $APP_VERSION
```
</details>

<details>
  <summary> Bitbucket </summary>

```yaml
name: scribe-bitbucket-pipeline
        script:      
          - pipe: scribe-security/valint-pipe:0.1.6
            variables:
              COMMAND_NAME: bom
              TARGET:  [target]
              FORMAT: attest-slsa
              SCRIBE_ENABLE: true
              SCRIBE_CLIENT_ID: $SCRIBE_CLIENT_ID
              SCRIBE_CLIENT_SECRET: $SCRIBE_CLIENT_SECRET
              LOGICAL_APP_NAME: $LOGICAL_APP_NAME
              APP_VERSION: $APP_VERSION 
```
</details>

### Attaining SLSA Level 2

Checklist for attaining SLSA v1.0 Level 2:
* **[SLSA Level 1 checklist](#getting-started-with-slsa-level-1)**
* Build with a hosted build service (as opposed to building on the developer’s machine).
* Generate and sign a Provenance Document (a signed SLSA Level 1 document).
* Verify downstream the authenticity of the Provenance Document.

#### Generating a signed Provenance Document

Call the following from your build script after the build artifact is complete:
```
# Create signed SLSA Provenance
valint slsa [target] -o attest --context-type [jenkins github circleci azure gitlab travis bitbucket] 
 -E \
 -U [SCRIBE_CLIENT_ID] \
 -P [SCRIBE_CLIENT_SECRET]
```
Where `[Target]` is the build artifact name. You can find signing configuration instructions **[here](https://tbd)**.

#### Secure key management​

Store keys and access tokens in the build platform or preferably in a secret management system. Make sure to expose the keys only at the provenance generation step.

#### Verifying the Provenance Document
To verify make the following call:
```
# Create signed SLSA Provenance
valint verify [target] -i attest-slsa --email [build-platform-identity]
```

### Attaining SLSA Level 3

Checklist for attaining SLSA v1.0 Level 3:
* **[SLSA Level 2 checklist](#attaining-slsa-level-2)**
* Isolate the generation of the Provenance Document with one of the following alternatives:
  * Generate the Provenance Document in the build pipeline and then verify and sign it in a separate pipeline. Verify all possible fields with data collected directly from the build platform, or another trusted source.
  * Generate the Provenance Document in a separate pipeline, preferably on a separate build service.
  * Use a secure build runner such as GitHub Actions.
* Assure the secret materials used for signing the Provenance Document are not exposed beyond the signing step. Particularly, not to the build pipeline.
* Isolate, and verify the isolation of the build pipeline from other build runs as follows:
  * Verify build cache isn’t used, and that volumes aren’t shared with other pipeline runs.
  * Verify secrets aren’t shared with other pipelines.
  * Verify that build runs cannot affect each other. For example, prevent one build from installing an artifact that affects another build run. This can be realized with ephemeral build-runners in containers created for each build, or by verifying that build-runners start each time from a predefined state.

#### Generating a signed Provenance Document

Call the following from your build script after the build artifact is complete:
```
# Create signed SLSA Provenance
valint slsa [target] -o attest --context-type [jenkins github circleci azure gitlab travis bitbucket] 
 -E \
 -U [SCRIBE_CLIENT_ID] \
 -P [SCRIBE_CLIENT_SECRET]
```
Where `[Target]` is the build artifact name. You can find signing configuration instructions **[here](https://tbd)**.

#### Using a trusted builder

If you are using a trusted build service such as GitHub actions add the flag `--label builder_slsa_evidence`.

#### Attesting that the builder can be trusted
In case your build service **doesn’t** provide a trusted builder you should generally follow the steps below. ​Please contact us for customizing the tools for your specific environment.
* Generate the Provenance Document in the build pipeline. 
* Create a separate verification pipeline that performs the following:
  * Collect data from the build service and use it to verify the Provenance document.
  * Verify the content of attestations created in the build pipeline. For example, verify the content of the build-runner by comparing an SBOM attestation from the build pipeline with an SBOM attestation that was sampled separately.
* Use attestations collected from the build pipeline to update the Provenance document.
* Verify that the build run was isolated, by querying the build service for information about the use of elements such as cache and secrets.

#### Secure key management​
Store keys and access tokens in the build platform or preferably in a secret management system. Make sure to expose the keys only at the provenance generation step.

#### Verifying the Provenance Document
To verify make the following call:
```
# Create signed SLSA Provenance
valint verify [target] -i attest-slsa --email [build-platform-identity]
```

### Customizing the Provenance Document

You can customize the provenance object by using the following flags:
* `--by-product` includes the contents of an external file, such as a log file or an SBOM.
For example,   
```valint slsa busybox:latest --by-product /path/to/my_file.txt```
* `--components` extend `byproduct` when it is an SBOM with detailed target components such as layers packages, and files.
For example,   
```valint slsa busybox:latest --components layers,packages,files```
* Set specific provenance fields such as:
  * `--invocation`: invocation ID
  * `--build-type`: build type
  * `--builder-id`: builder ID
  * `--started-on`: build start time
  * `--finished-on`: build finish time
For Example,
```
valint slsa busybox:latest --invocation my_invocation --build-type docker --builder-id 12345 --started-on 2023-07-25T15:30:00Z --finished-on 2023-07-25T16:00:00Z
```
* `-env` or `--all-env` adds environment variables to the `internaParameters`.
For example,   
```yaml
#Attach all environment variables
valint slsa busybox:latest --all-env
# Attach a specific environment variable
valint slsa busybox:latest --env MY_ENV
```
* `--external` adds parameters to the `externalParameters` in the form of key=value pairs.
For example,   
```valint slsa busybox:latest --external my_custom_param=my_custom_value```
* `--predicate` adds a full or partial SLSA provenance predicate.
For example,   
```valint slsa busybox:latest --predicate custom.predicate.json```
Where `custom.predicate.json` specifies custom `externalParameters`, `builderDependencies`, and metadata.
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
* `--statement` adds a full or partial SLSA provenance statement.
For example,   
```valint slsa busybox:latest --statement custom.statement.json```
The following `custom.predicate.json` includes custom subject and byproducts.
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

### Integrating with Alternative types of evidence stores

#### OCI Evidence store
In standalone deployments or other cases when you don’t want to connect your SDLC with Scribe Hub, you can use an OCI registry to store and retrieve evidence. This allows you to store evidence from your CI pipeline and retrieve it at the point of admission control into your Kubernetes cluster. 
##### Flags
* `--oci` Enable OCI store
* `--oci-repo` Evidence store location
`oci-repo` setting indicates the location in a registry under which the evidence is stored. It must be a dedicated location in an OCI registry. for example, ```scribesecuriy.jfrog.io/my_docker-registry/evidence```.

:::note
Docker Hub does not support the subpath format, `oci-repo` should be set to your Docker hub Username.
:::

Some registries such as Artifactory allow multi-layer format for repo names such as,
```my_org.jfrog.io/policies/attestations```

##### Before you begin​
Evidence can be stored in any accessible registry.
* Write access is required for upload (generate).
* Read access is required for download (verify).
You must first log in with the required access privileges to your registry before calling Valint. For example, using the `docker login` command.

##### Usage
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
#### Cache Evidence store
Valint supports both storage and verification flows for attestations and statement objects utilizing a local directory as an evidence store. This is the simplest form and is mainly used to cache previous evidence creation

##### Flags
* `--cache-enable` 
* `--output-directory` 
* `--force`
By default, this cache store is enabled. To disable use `--cache-enable=false`.

##### Usage
```
# Generating evidence, storing on [my_dir] local directory.
valint slsa [target] -o [attest, statement] --output-directory=[my_dir]

# Verifying evidence, pulling attestation from [my_dir] local directory.
valint verify [target] -i [attest-slsa, statement-slsa] --output-directory=[my_dir]
```
By default, the evidence is written to `~/.cache/valint/`, use `--output-file`, `-d`, or `--output-directory` to customize the evidence output location. 

### Basic examples
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

> By default, *Valint* is using **[Sigstore](https://www.sigstore.dev/ "Sigstore")** interactive flow as the engine behind the signing mechanism.

```bash
valint slsa busybox:latest -o attest
``` 
</details>

<details>
  <summary> Attest and verify image target </summary>

Generating and verifying SLSA Provenance `attestation` for image target `busybox:latest`.

> By default, *Valint* is using **[Sigstore](https://www.sigstore.dev/ "Sigstore")** interactive flow as the engine behind the signing mechanism.

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

### Reports from application security scanners

You can gather the output of your application security scanners (such as SAST, SCA, and DAST) as evidence to attest to your software’s security level and evaluate it with your policies.
In your build script use:
```
valint bom <file_path> -o [statement-generic, attest-generic] -p [predicate-type] [FLAGS]
```
For example, gathering evidence of a Trivy output:
```
valint bom report.sarif -o attest-generic -p https://aquasecurity.github.io/trivy/v0.42/docs/configuration/reporting/#sarif
```
Following are the currently supported predicate types:

| predicate-type | file-format | tool |
| --- | --- | --- |
|  https://aquasecurity.github.io/trivy/v0.42/docs/configuration/reporting/#sarif <br /> https://aquasecurity.github.io/trivy/v0.42/docs/configuration/reporting/#json | sarif <br /> json | trivy |
|  https://cyclonedx.org/bom | CycloneDX | Syft | 

### Signing & verifying attestations
You can sign or verify evidence using local keys, a certificate, or a CA file.
```
valint bom busybox:latest -o attest --attest.default x509
valint verify busybox:latest --attest.default x509
```
Where `--attest.default` defines the singing method.
For more options, you can read **[here](https://tbd)**.

### Storing Evidence

You can use different types of evidence stores for the gathered evidence. 
After evidence is gathered Valint evaluates policies at different enforcement points by pulling this evidence from any of these stores.

#### Scribe Hub store
To connect Valint to the evidence store set in its configuration the Scribe Hub API **Client ID** and **Client Secret**. 
Go to **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** left navigation page > **Integrations** and copy the **Client ID** and **Client Secret**:

<img src='../../../../img/ci/integrations-secrets.jpg' alt='Scribe Integration Secrets' width='70%' min-width='400px'/>

You can configure the secrets as flags as in the following example, or in Valint’s **[configuration](../../integrating-scribe/valint/configuration)**.

```
# Generate and push evidence to registry
valint bom [target] -o [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] --f -E \
-U $SCRIBE_CLIENT_ID \
-P $SCRIBE_CLIENT_SECRET
```

#### File system folder

By default, Valint stores evidence locally in a cache folder. You can specify another output folder by using the flags: `--output-directory` or `--output-file`. For example:
```
# Save evidence to custom path
valint bom busybox:latest --output-file my_sbom.json

ls -lh my_sbom.json

# Change evidence cache directory
valint bom busybox:latest --output-directory ./my_evidence_cache

ls -lhR my_evidence_cache
```

#### OCI Registry

To store evidence in your OCI registry such as Artifactory specify the registry URL in your Valint call and add the `--oci` flag.

Example:
```
# Login to registry
docker login $

# Generate and push evidence to registry
valint bom [target] -o [attest, statement, attest-slsa, statement-slsa, attest-generic, statement-generic] --oci --oci-repo $REGISTRY_URL
```

### Applying your own policy to evidence

You can apply canned policies or custom policies as code:
1. Scribe offers several sample Rego policies in this **[repo](https://github.com/scribe-public/sample-policies)** that you can fork and use in your deployment.
2. Verifying Image has a verified signature.

When signing an image SBOM the effect is singing the image hash as well as including it in the image’s SBOM. 
Example:
#### Sign
```
$HOME/.scribe/bin/valint bom busybox:latest -o attest -f
```
#### Verify
```
$HOME/.scribe/bin/valint verify busybox:latest -i attest
```
You can learn more about signing and verification **[here](https://tbd)**.

You can verify an image in a policy by configuring the `image-policy.yaml` file as in the following example:
```yaml
attest:
  cocosign:
    policies:
      - name: my-image-policy
      enable: true
      input:
        signed: true
        format: attest-cyclonedx-json # verifies that the evidense is of this format
        identity:
          emails:
            - jhon@scribesecurity.com #the email that must have signed the evidence
      match:
        Target_type: image
        Context_type: github #the image must have arrived from github
```

Check out this **[video](https://www.youtube.com/watch?v=BXD21zhgkMM)** on Valint to learn more about policies.

### Enforcing SDLC policies

You can gather evidence from your SDLC (Software Development Lifecycle) and enforce supply chain policies accordingly in different enforcement points: at the end of the build, admission to production, or

#### Gathering evidence

You can collect the following types of evidence from your software-building process. The evidence is formatted as an **[in-toto](https://in-toto.io/)** attestation and can be cryptographically signed.

##### SBOM 

**Step 1**: Install the Valint Plugin. 
If you haven’t installed the CI plugin yet, **[Install the Scribe Valint plugin in your CI system](../../integrating-scribe/ci-integrations/)**.

**Step 2**: Basic Integration for SBOM Generation.
As a basic integration step, generate an SBOM from the final built artifact such as a docker image. Use the following command either from the command line or in your build script immediately after the artifact is built: 
```valint bom <target> <flags>```
Where `<target>` refers to a build artifact of either a container image, file or file directory, or a git repo, formatted as either `<image:tag>`, `<dir path>`, or `<git url>`.
For example: 
```valint bom my_image:my_tag```
**Step 3**: Advanced SBOM Generation.
For a more detailed SBOM, you can generate additional SBOMs from the source code or the package manager installation process during the build process. These additional SBOMs can be combined to create a more comprehensive and accurate SBOM.

For more detailed information about SBOM generation, read **[here](../manag-sbom-and-vul)**. 

