---
sidebar_label: "Securing your software builds using SLSA framework"
title: "Securing your software builds using SLSA framework"
sidebar_position: 2
toc_min_heading_level: 2
toc_max_heading_level: 5
---

### Introduction

**[SLSA](https://slsa.dev/)** (Supply Chain Levels for Software Artifacts) is a security framework to prevent tampering, improve integrity, and secure packages and infrastructure. It is organized into levels, each representing incremental progress over the previous one, and has stable specifications **[v1.0 release](https://slsa.dev/spec/v1.0/whats-new)**. Scribe is designed to help you efficiently attain SLSA levels as explained throughout this guide.

The SLSA goals by level are summarized as follows:  
**Level 1:**
* Fully script or automate your build process: Automate your build process using tools like makefile or GitHub Actions to ensure consistent and repeatable builds.
* Generate provenance evidence by collecting evidence about the "who," "where," and "when" of a piece of software.

**Level 2:**
* Generate a provenance verifiable attestation by obtaining the data automatically from the build service that can also be authenticated and verified for integrity by the consumer of the software.

**Level 3:**
* Use a tamper-resistant build service: Implement a trusted builder (for example, GitHub Actions), to perform builds and generate non-forgeable provenance metadata.
* Generate non-forgeable provenance metadata: The provenance metadata should detail how an artifact was built, enabling comprehensive verification of its integrity.

The SLSA process of assuring and attesting that your software was built securely comprises the following steps:
1. Gather evidence continuously from every software build.
2. Sign the evidence with a key you own and store this evidence in an evidence store. 
3. Apply policies to it to verify evidence integrity, assure consistent security controls, and a secure development process. 

You can read more on the SLSA website about **[SLSA requirements](https://slsa.dev/spec/v0.1/requirements)** and **[SLSA provenance specifications](https://slsa.dev/provenance/v1)**.

### Getting started with SLSA level 1

SLSA Level 1:  
Build - **[Scripted build](https://slsa.dev/spec/v1.0/requirements#scripted-build)**  
Provenance - **[Available](https://slsa.dev/spec/v1.0/requirements#available)**

To attain SLSA level 1, specification v1.0, with Scribe, implement the following steps:

* Step 1: Automatically gather provenance evidence
* Step 2: Automatically gather evidence of the security posture of the dev tools 
* Step 3: Integrate with an evidence store 
* Step 4: Review the SLSA compliance report in Scribe Hub
* Step 5: Apply policies to the evidence or attestations

#### Step 1: Automatically gather provenance evidence or attestation

Scribe’s Valint plugin for CI systems gathers evidence about the source code repo, the build agent, and the built artifact from every build run. 

The provenance evidence includes:
1. Git: git commit Id and git URL
2. CI build platform, build ID, build environment variables
3. Artifact name and hash ID

Once integrated, the evidence Valint collects will help you attain SLSA level 2. We later explain how to attain level 3 with Scribe.

To gather the provenance add a step to your build script as in the following examples. 
Note: Before you start, if you haven’t installed it yet, **[install the Scribe Valint plugin in your CI system](../../integrating-scribe/ci-integrations/)**.

<details>
  <summary>  <b> Example for Jenkins: </b> </summary>

```yaml
stage('slsa-full-env') {
    sh ''' valint slsa busybox:latest \
          -o statement \
          --context-type jenkins \
          --output-directory ./scribe/valint \
          --all-env '''
}          
```
</details>

<details>
  <summary>  <b> Example for GitLab CI/CD: </b> </summary>

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
  <summary>  <b> Example for Azure DevOps: </b> </summary>

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
  <summary>  <b> Example for Travis CI: </b> </summary>

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
  <summary>  <b> Example for Bitbucket: </b> </summary>

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

The default and basic provenance object that Valint generates is defined by the following template. It is best understood by reviewing empirical examples as the ones that come after this template from GitHub and Jenkins.

<details>
  <summary>  <b> Valint provenance template: </b> </summary>

```yaml
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

<details>
  <summary>  <b> Provenance example from GitHub: </b> </summary>

```yaml
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
  <summary>  <b> Provenance example from Jenkins: </b> </summary>

```yaml
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

<!-- You can read **[here]()** about the full specification of the fields. -->

#### Customizing Valint’s provenance

SLSA provenance requirements leave room for adding information according to users' requirements. You can customize the provenance object by using the following flags:
* `--by-product` - include the contents of an external file, such as a log file or an SBOM. 
for example:
```
valint slsa busybox:latest --by-product /path/to/my_file.txt
```
* `--components` - expands `byproducts` when it is an SBOM with detailed target components such as layers packages, and files. 
for example:
```
valint slsa busybox:latest --components layers,packages,files
```
* Set specific provenance fields
  * `--invocation`: invocation ID
  * `--build-type`: build type
  * `--builder-id`: builder ID
  * `--started-on`: build start time
  * `--finished-on`: build finish time
for example:
```
valint slsa busybox:latest --invocation my_invocation --build-type docker --builder-id 12345 --started-on 2023-07-25T15:30:00Z --finished-on 2023-07-25T16:00:00Z
``` 
* `-env` or `--all-env` - add environment variables to the `internaParameters`.
for example:
```
#Attach all environment variables
valint slsa busybox:latest --all-env
# Attach a specific environment variable
valint slsa busybox:latest --env MY_ENV
```
* `--external` - Add parameters to ‘externalParameters’ in form of key=value pairs. 
for example:
```
valint slsa busybox:latest --external my_custom_param=my_custom_value
```
* `--predicate` - add a full or partial SLSA provenance predicate. 
for example:
```
valint slsa busybox:latest --predicate custom.predicate.json
```
Where custom.predicate.json specifies custom `externalParameters`, `builderDependencies` and metadata.
```
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
* `--statement` - add a full or partial SLSA provenance statement. 
for example:
```
valint slsa busybox:latest --statement custom.statement.json
```
The following custom.statement.json includes custom subject and byproducts:
```
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

#### Step 2: Automatically gather evidence of the security posture of the dev tools

In order to meet full SLSA requirements, it's necessary to evaluate the security posture of your SCM and CI systems. This includes gathering evidence regarding the project settings, such as branch protection. 
Currently, Scribe supports gathering evidence from GitHub. To configure implement the following steps:

**1:** Access Integrations Log in to Scribe Hub. Navigate to the left pane and click on "Integrations".

<img src='../../../../img/start/integrations-start.jpg' alt='Scribe Integrations'/>

**2:** Scroll down to find GitHub among the listed services. Select GitHub and click "Connect".
        
**3:** You will be redirected to GitHub. Sign in to your GitHub account, select the relevant GitHub organization account, and choose the appropriate repositories.

**4:** Once done, you will be redirected back to Scribe Hub. From this point onwards, Scribe will automatically generate a SLSA and Software Supply Chain Assurance Framework (SSDF) compliance report for every build.

#### Step 3: Integrate with an evidence store

You can store, manage, and retrieve evidence from your supply chain in several evidence store types:
* Scribe Hub (recommended) - a service that facilitates evidence or attestation management, supply chain risk analysis and management, and evidence and attestation sharing hub for software producers and consumers.
* OCI Registry - leverage your image registry for storing and retrieving evidence or attestations. This integration is practical for standalone deployments.
* Cache Evidence store​ - leverage your build cache or a filesystem for storing and retrieving evidence or attestations. This integration is practical for standalone deployments.

##### Before you begin
Obtain Client ID and Client Secret from Scribe Hub > Integrations as shown below:

<img src='../../../../img/ci/integrations-secrets.jpg' alt='Scribe Integration Secrets' width='70%' min-width='400px'/>

##### Usage​
```
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

##### OCI Evidence store​

In standalone deployments or in other cases when you don’t want to connect your SDLC with Scribe Hub, you can use an OCI registry to store and retrieve evidence. This allows you to store evidence from your CI pipeline and retrieve it at the point of admission control into your Kubernetes cluster. 

**Flags:**
* `--oci` - Enable OCI store.
* `--oci-repo` - Evidence store location.

`oci-repo` setting indicates the location in a registry under which the evidence are stored. It must be a dedicated location in an OCI registry. for example, `scribesecuriy.jfrog.io/my_docker-registry/evidence`.

:::note
Docker Hub does not support the subpath format, oci-repo should be set to your Docker hub Username.
Some registries like Jfrog allow multi layer format for repo names such as, 
`my_org.jfrog.io/policies/attestations`
:::

###### Before you begin:
Evidence can be stored in any accessible registry.
* Write access is required for upload (generate).
* Read access is required for download (verify).
You must first log in with the required access privileges to your registry before calling Valint. For example, using the `docker login` command.

###### Usage​
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

<!-- For related Cosign support, see cosign section. -->

##### Cache Evidence store​

Valint supports both storage and verification flows for attestations and statement objects utilizing a local directory as an evidence store. This is the simplest form and is mainly used to cache previous evidence creation.

**Flags:**
* `--cache-enable`
* `--output-directory`
* `--force`

By default, this cache store is enabled. To disable use `--cache-enable=false`.

###### Usage
```
# Generating evidence, storing on [my_dir] local directory.
valint slsa [target] -o [attest, statement] --output-directory=[my_dir]

# Verifying evidence, pulling attestation from [my_dir] local directory.
valint verify [target] -i [attest-slsa, statement-slsa] --output-directory=[my_dir]
```
By default, the evidence is written to `~/.cache/valint/`, use `--output-file` or `-d`,`--output-directory` to customize the evidence output location.

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








