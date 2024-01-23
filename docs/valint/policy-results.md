---
sidebar_label: "Policy results"
title: Creating attestations out of policy results
author: Viktor Kartashov - Scribe
sidebar_position: 6
date: November 30, 2023
geometry: margin=2cm
---

# Introduction to policy results

After running the `valint verify` command, the results of policy evaluation can be stored as an in-toto statement (`statement-sarif` or simply `statement`), in-toto attestation (`attest-sarif` / `attest`), or a JSON file in SARIF format. The output is then pushed to an OCI registry and can be verified at a later time.

In this context, the in-toto statement or attestation has a predicate type of <http://docs.oasis-open.org/sarif/sarif/2.1.0>, target type `policy-results` and contains SARIF under `.predicate.content` path.

The pure SARIF format consists solely of the SARIF output from the policy evaluation, designed for seamless integration with other tools.

In addition to the evidence output, the results are also presented in the log as a table, providing a quick overview of both failed and passed rules.

# Creating attestations out of policy results

The results of policy evaluation are stored by default. If you want not to do it, use the `--skip-report` option.

The `--format` option (or `-o` for short) is employed to specify the output format. Supported values include `attest-sarif` (or simply `attest`), `statement-sarif` (also referred to as `statement`) and `sarif` (in JSON format). The default value is `statement`.

Additionally, you have the option to save a local copy of the uploaded statement using the `--output-file /path/to/file` option.

# Tuning policy results output

It's also possible to determine how policy results are included in the output. The supported options are:

* `--result.by-rule` – aggregates all rule violations into one result per rule. By default, this option is disabled, meaning that each violation is pushed to SARIF as a separate result.
* `--result.aggregated` – includes, in addition to the existing results, one aggregated result for every rule being run. This can provide a comprehensive high-level view of all violations of underlying rules for each policy. This option is disabled by default.

# Example

After policy evaluation, the results are shown in the output log as a table:

```bash
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Policy "default" Evaluation Summary                                                                                          │
├─────────────────────────┬────────┬────────────────────────┬───────────────────┬──────────────────────────────────────────────┤
│ RULE NAME               │ SIGNED │ SIGNATURE VERIFICATION │ POLICY EVALUATION │ COMMENT                                      │
├─────────────────────────┼────────┼────────────────────────┼───────────────────┼──────────────────────────────────────────────┤
│ fresh-image             │ true   │ passed                 │ passed            │ 1/1 evidence origin and signature verified,  │
│                         │        │                        │                   │ image is new enough                          │
├─────────────────────────┼────────┼────────────────────────┼───────────────────┼──────────────────────────────────────────────┤
│ AGGREGATE POLICY RESULT │        │                        │ PASSED            │                                              │
└─────────────────────────┴────────┴────────────────────────┴───────────────────┴──────────────────────────────────────────────┘
``````

and are also stored as a SARIF report inside an in-toto statement in the OCI registry:

<details>
  <summary> Example </summary>

```json
{
  "_type": "https://in-toto.io/Statement/v0.1",
  "predicateType": "http://docs.oasis-open.org/sarif/sarif/2.1.0",
  "subject": [
    {
      "name": "",
      "digest": {
        "sha256": "0aad8ad1c18814a2389319186fdd0473e78ca8cd69a36a8d322bfda3fdbb5216"
      }
    }
  ],
  "predicate": {
    "environment": {
      "hostname": "runner_1",
      "user": "username",
      "name": "busybox",
      "product_version": "v0.1",
      "timestamp": "2024-01-23T15:47:22+02:00",
      "input_scheme": "docker",
      "input_name": "busybox",
      "input_tag": "latest",
      "content_type": "statement-sarif",
      "context_type": "local",
      "predicate_type": "http://docs.oasis-open.org/sarif/sarif/2.1.0",
      "tool": "valint",
      "tool_version": "1.0.0-18",
      "format_type": "sarif",
      "format_version": "2.1.0",
      "format_encoding": "json",
      "imageID": "sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824",
      "repoDigest": [
        "busybox@sha256:3fbc632167424a6d997e74f52b878d7cc478225cffac6bc977eedfe51c7f4e79"
      ],
      "tag": [
        "latest",
        "1.36.1",
        "latest"
      ],
      "size": 4261550,
      "platform": "linux/amd64",
      "target_type": "policy-results",
      "sbomgroup": "generic",
      "sbomname": "index.docker.io/library/busybox:latest",
      "sbomversion": "sha256:0aad8ad1c18814a2389319186fdd0473e78ca8cd69a36a8d322bfda3fdbb5216",
      "sbomhashs": [
        "sha256-0aad8ad1c18814a2389319186fdd0473e78ca8cd69a36a8d322bfda3fdbb5216"
      ],
      "sbompurl": "pkg:docker/index.docker.io/library/busybox:latest@sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824?arch=amd64",
      "policies": [
        "my_policy",
        "default"
      ],
      "rules": [
        "signed_image",
        "fresh-image"
      ],
      "rule_types": [
        "verify-artifact",
        "verify-artifact"
      ],
      "allow": true,
      "policy-scripts": {
        "": "",
        "fresh-image.rego": "e90241897259b16872cbcb61acad6b8cc61898b11f73d8b7f4a3f58c7d5f1319"
      }
    },
    "mimeType": "application/json",
    "content": {
      "version": "2.1.0",
      "$schema": "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
      "runs": [
        {
          "tool": {
            "driver": {
              "informationUri": "https://scribesecurity.com",
              "name": "valint",
              "rules": [
                {
                  "id": "signed_image",
                  "name": "my_policy",
                  "shortDescription": {
                    "text": "my_policy.signed_image"
                  },
                  "fullDescription": {
                    "text": ""
                  },
                  "defaultConfiguration": {
                    "level": "error"
                  },
                  "help": {
                    "text": "my_policy.signed_image",
                    "markdown": "## rule details\n\u003e **Signed evidence:** yes\n\u003e **Format:** attest-cyclonedx-json\n\n\n### **Match criteria**\n```yaml\nname: busybox\nproduct_version: v0.1\ncontent_type: attest-cyclonedx-json\npredicate_type: https://cyclonedx.org/bom/v1.4\ntarget_type: image\nsbomversion: sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824\n```\n\n\n### **Verified Evidence**\n```yaml\nhostname: runner_1\nuser: username\nname: busybox\nproduct_version: v0.1\ntimestamp: \"2024-01-23T15:43:58+02:00\"\ninput_scheme: docker\ninput_name: busybox\ninput_tag: latest\ncontent_type: attest-cyclonedx-json\ncontext_type: local\npredicate_type: https://cyclonedx.org/bom/v1.4\ntool: valint\ntool_version: 1.0.0-18\ntool_vendor: Scribe Security\nformat_type: cyclonedx\nformat_version: \"1.4\"\nformat_encoding: json\ngit_url: https://github.com/scribe-security/valint.git\ngit_branch: main\ngit_tag: v1.0.0-17\ngit_commit: 0a80c9d5372ecfbf4ff20a728f9ce5e68b371f45\ngit_ref: refs/heads/main\nimageID: sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824\nrepoDigest:\n    - busybox@sha256:3fbc632167424a6d997e74f52b878d7cc478225cffac6bc977eedfe51c7f4e79\ntag:\n    - latest\n    - 1.36.1\n    - latest\nsize: 4261550\nplatform: linux/amd64\ntarget_type: image\nsbomgroup: image\nsbomname: index.docker.io/library/busybox:latest\nsbomversion: sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824\nsbomhashs:\n    - sha256-3fbc632167424a6d997e74f52b878d7cc478225cffac6bc977eedfe51c7f4e79\n    - sha256-a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824\nsbompurl: pkg:docker/index.docker.io/library/busybox:latest@sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824?arch=amd64\nref: /home/username/.cache/valint/sha256-a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824.bom.sig.json\nstore: cache\n```\n"
                  },
                  "properties": {
                    "initiatives": null,
                    "labels": null,
                    "policy-name": "my_policy",
                    "rule-type": "verify-artifact",
                    "tags": [
                      "attest-cyclonedx-json",
                      "image",
                      "sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824",
                      "https://cyclonedx.org/bom/v1.4",
                      "scribe",
                      "policy",
                      "busybox",
                      "v0.1",
                      "local",
                      "latest"
                    ]
                  }
                },
                {
                  "id": "fresh-image",
                  "name": "default",
                  "shortDescription": {
                    "text": "A rule to verify that the image is not older than a threshold"
                  },
                  "fullDescription": {
                    "text": "The Verify Artifact rule enforces a custom policy script"
                  },
                  "defaultConfiguration": {
                    "level": "error"
                  },
                  "help": {
                    "text": "A rule to verify that the image is not older than a threshold",
                    "markdown": "## rule details\n\u003e **Description:** A rule to verify that the image is not older than a threshold\n\u003e **Signed evidence:** yes\n\u003e **Format:** attest-cyclonedx-json\n\u003e **Script:** /home/username/scribe/sample-policies/policies/images/fresh-image.rego\n\n\n### **Match criteria**\n```yaml\nname: busybox\nproduct_version: v0.1\ncontent_type: attest-cyclonedx-json\npredicate_type: https://cyclonedx.org/bom/v1.4\ntarget_type: image\n```\n\n\n### **Policy arguments**\n```yaml\nmax_days: 1830\n```\n\n\n### **Verified Evidence**\n```yaml\nhostname: runner_1\nuser: username\nname: busybox\nproduct_version: v0.1\ntimestamp: \"2024-01-23T15:43:58+02:00\"\ninput_scheme: docker\ninput_name: busybox\ninput_tag: latest\ncontent_type: attest-cyclonedx-json\ncontext_type: local\npredicate_type: https://cyclonedx.org/bom/v1.4\ntool: valint\ntool_version: 1.0.0-18\ntool_vendor: Scribe Security\nformat_type: cyclonedx\nformat_version: \"1.4\"\nformat_encoding: json\ngit_url: https://github.com/scribe-security/valint.git\ngit_branch: main\ngit_tag: v1.0.0-17\ngit_commit: 0a80c9d5372ecfbf4ff20a728f9ce5e68b371f45\ngit_ref: refs/heads/main\nimageID: sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824\nrepoDigest:\n    - busybox@sha256:3fbc632167424a6d997e74f52b878d7cc478225cffac6bc977eedfe51c7f4e79\ntag:\n    - latest\n    - 1.36.1\n    - latest\nsize: 4261550\nplatform: linux/amd64\ntarget_type: image\nsbomgroup: image\nsbomname: index.docker.io/library/busybox:latest\nsbomversion: sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824\nsbomhashs:\n    - sha256-3fbc632167424a6d997e74f52b878d7cc478225cffac6bc977eedfe51c7f4e79\n    - sha256-a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824\nsbompurl: pkg:docker/index.docker.io/library/busybox:latest@sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824?arch=amd64\nref: /home/username/.cache/valint/sha256-a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824.bom.sig.json\nstore: cache\n```\n"
                  },
                  "properties": {
                    "initiatives": [
                      "client-policy"
                    ],
                    "labels": [
                      "images",
                      "sample-policy-bundle"
                    ],
                    "policy-name": "default",
                    "rule-type": "verify-artifact",
                    "tags": [
                      "policy",
                      "busybox",
                      "sample-policy-bundle",
                      "v0.1",
                      "attest-cyclonedx-json",
                      "local",
                      "image",
                      "scribe",
                      "client-policy",
                      "images"
                    ]
                  }
                }
              ],
              "semanticVersion": "1.0.0-18",
              "version": "1.0.0-18"
            }
          },
          "invocations": [
            {
              "commandLine": "valint verify busybox:latest --bundle=/home/username/scribe/sample-policies/ --config=/home/username/scribe/valint/valint2.yaml --policy=[policies/images/fresh-image.yaml] --product-key=busybox --product-version=v0.1 --verbose=2",
              "executionSuccessful": true,
              "exitSignalName": "passed"
            }
          ],
          "results": [
            {
              "properties": {
                "verify-artifact.signed_image": [
                  {
                    "content_type": "attest-cyclonedx-json",
                    "context_type": "local",
                    "format_encoding": "json",
                    "format_type": "cyclonedx",
                    "format_version": "1.4",
                    "git_branch": "main",
                    "git_commit": "0a80c9d5372ecfbf4ff20a728f9ce5e68b371f45",
                    "git_ref": "refs/heads/main",
                    "git_tag": "v1.0.0-17",
                    "git_url": "https://github.com/scribe-security/valint.git",
                    "hostname": "runner_1",
                    "imageID": "sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824",
                    "input_name": "busybox",
                    "input_scheme": "docker",
                    "input_tag": "latest",
                    "name": "busybox",
                    "platform": "linux/amd64",
                    "predicate_type": "https://cyclonedx.org/bom/v1.4",
                    "product_version": "v0.1",
                    "ref": "/home/username/.cache/valint/sha256-a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824.bom.sig.json",
                    "repoDigest": [
                      "busybox@sha256:3fbc632167424a6d997e74f52b878d7cc478225cffac6bc977eedfe51c7f4e79"
                    ],
                    "sbomgroup": "image",
                    "sbomhashs": [
                      "sha256-3fbc632167424a6d997e74f52b878d7cc478225cffac6bc977eedfe51c7f4e79",
                      "sha256-a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824"
                    ],
                    "sbomname": "index.docker.io/library/busybox:latest",
                    "sbompurl": "pkg:docker/index.docker.io/library/busybox:latest@sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824?arch=amd64",
                    "sbomversion": "sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824",
                    "size": 4261550,
                    "store": "cache",
                    "tag": [
                      "latest",
                      "1.36.1",
                      "latest"
                    ],
                    "target_type": "image",
                    "timestamp": "2024-01-23T15:43:58+02:00",
                    "tool": "valint",
                    "tool_vendor": "Scribe Security",
                    "tool_version": "1.0.0-18",
                    "user": "username"
                  }
                ]
              },
              "ruleId": "signed_image",
              "ruleIndex": 0,
              "kind": "pass",
              "level": "note",
              "message": {
                "text": "Rule  passed verify-artifact because 1/1 evidence origin and signature verified",
                "markdown": "Rule  passed verify-artifact because 1/1 evidence origin and signature verified"
              },
              "locations": [
                {
                  "physicalLocation": {
                    "artifactLocation": {
                      "uri": "index.docker.io/library/busybox?version=sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824\u0026tag=latest"
                    },
                    "region": {
                      "startLine": 1
                    }
                  },
                  "message": {
                    "text": "URL"
                  }
                },
                {
                  "physicalLocation": {
                    "artifactLocation": {
                      "uri": "busybox"
                    },
                    "region": {
                      "startLine": 1
                    }
                  },
                  "message": {
                    "text": "PRODUCT"
                  }
                },
                {
                  "physicalLocation": {
                    "artifactLocation": {
                      "uri": "busybox"
                    },
                    "region": {
                      "startLine": 1
                    }
                  },
                  "message": {
                    "text": "NAME"
                  }
                },
                {
                  "physicalLocation": {
                    "artifactLocation": {
                      "uri": "pkg:docker/index.docker.io/library/busybox:latest@sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824?arch=amd64"
                    },
                    "region": {
                      "startLine": 1
                    }
                  },
                  "message": {
                    "text": "PURL"
                  }
                },
                {
                  "physicalLocation": {
                    "artifactLocation": {
                      "uri": "%2Fhome%2Fusername%2F.cache%2Fvalint%2Fsha256-a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824.bom.sig.json"
                    },
                    "region": {
                      "startLine": 1
                    }
                  },
                  "message": {
                    "text": "REF"
                  }
                }
              ]
            },
            {
              "properties": {
                "verify-artifact.fresh-image": [
                  {
                    "content_type": "attest-cyclonedx-json",
                    "context_type": "local",
                    "format_encoding": "json",
                    "format_type": "cyclonedx",
                    "format_version": "1.4",
                    "git_branch": "main",
                    "git_commit": "0a80c9d5372ecfbf4ff20a728f9ce5e68b371f45",
                    "git_ref": "refs/heads/main",
                    "git_tag": "v1.0.0-17",
                    "git_url": "https://github.com/scribe-security/valint.git",
                    "hostname": "runner_1",
                    "imageID": "sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824",
                    "input_name": "busybox",
                    "input_scheme": "docker",
                    "input_tag": "latest",
                    "name": "busybox",
                    "platform": "linux/amd64",
                    "predicate_type": "https://cyclonedx.org/bom/v1.4",
                    "product_version": "v0.1",
                    "ref": "/home/username/.cache/valint/sha256-a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824.bom.sig.json",
                    "repoDigest": [
                      "busybox@sha256:3fbc632167424a6d997e74f52b878d7cc478225cffac6bc977eedfe51c7f4e79"
                    ],
                    "sbomgroup": "image",
                    "sbomhashs": [
                      "sha256-3fbc632167424a6d997e74f52b878d7cc478225cffac6bc977eedfe51c7f4e79",
                      "sha256-a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824"
                    ],
                    "sbomname": "index.docker.io/library/busybox:latest",
                    "sbompurl": "pkg:docker/index.docker.io/library/busybox:latest@sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824?arch=amd64",
                    "sbomversion": "sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824",
                    "size": 4261550,
                    "store": "cache",
                    "tag": [
                      "latest",
                      "1.36.1",
                      "latest"
                    ],
                    "target_type": "image",
                    "timestamp": "2024-01-23T15:43:58+02:00",
                    "tool": "valint",
                    "tool_vendor": "Scribe Security",
                    "tool_version": "1.0.0-18",
                    "user": "username"
                  }
                ]
              },
              "ruleId": "fresh-image",
              "ruleIndex": 1,
              "kind": "pass",
              "level": "note",
              "message": {
                "text": "Rule  passed verify-artifact because 1/1 evidence origin and signature verified",
                "markdown": "Rule  passed verify-artifact because 1/1 evidence origin and signature verified"
              },
              "locations": [
                {
                  "physicalLocation": {
                    "artifactLocation": {
                      "uri": "index.docker.io/library/busybox?version=sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824\u0026tag=latest"
                    },
                    "region": {
                      "startLine": 1
                    }
                  },
                  "message": {
                    "text": "URL"
                  }
                },
                {
                  "physicalLocation": {
                    "artifactLocation": {
                      "uri": "busybox"
                    },
                    "region": {
                      "startLine": 1
                    }
                  },
                  "message": {
                    "text": "PRODUCT"
                  }
                },
                {
                  "physicalLocation": {
                    "artifactLocation": {
                      "uri": "busybox"
                    },
                    "region": {
                      "startLine": 1
                    }
                  },
                  "message": {
                    "text": "NAME"
                  }
                },
                {
                  "physicalLocation": {
                    "artifactLocation": {
                      "uri": "pkg:docker/index.docker.io/library/busybox:latest@sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824?arch=amd64"
                    },
                    "region": {
                      "startLine": 1
                    }
                  },
                  "message": {
                    "text": "PURL"
                  }
                },
                {
                  "physicalLocation": {
                    "artifactLocation": {
                      "uri": "%2Fhome%2Fusername%2F.cache%2Fvalint%2Fsha256-a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824.bom.sig.json"
                    },
                    "region": {
                      "startLine": 1
                    }
                  },
                  "message": {
                    "text": "REF"
                  }
                }
              ]
            },
            {
              "properties": {
                "verify-artifact.fresh-image": [
                  {
                    "content_type": "attest-cyclonedx-json",
                    "context_type": "local",
                    "format_encoding": "json",
                    "format_type": "cyclonedx",
                    "format_version": "1.4",
                    "git_branch": "main",
                    "git_commit": "0a80c9d5372ecfbf4ff20a728f9ce5e68b371f45",
                    "git_ref": "refs/heads/main",
                    "git_tag": "v1.0.0-17",
                    "git_url": "https://github.com/scribe-security/valint.git",
                    "hostname": "runner_1",
                    "imageID": "sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824",
                    "input_name": "busybox",
                    "input_scheme": "docker",
                    "input_tag": "latest",
                    "name": "busybox",
                    "platform": "linux/amd64",
                    "predicate_type": "https://cyclonedx.org/bom/v1.4",
                    "product_version": "v0.1",
                    "ref": "/home/username/.cache/valint/sha256-a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824.bom.sig.json",
                    "repoDigest": [
                      "busybox@sha256:3fbc632167424a6d997e74f52b878d7cc478225cffac6bc977eedfe51c7f4e79"
                    ],
                    "sbomgroup": "image",
                    "sbomhashs": [
                      "sha256-3fbc632167424a6d997e74f52b878d7cc478225cffac6bc977eedfe51c7f4e79",
                      "sha256-a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824"
                    ],
                    "sbomname": "index.docker.io/library/busybox:latest",
                    "sbompurl": "pkg:docker/index.docker.io/library/busybox:latest@sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824?arch=amd64",
                    "sbomversion": "sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824",
                    "size": 4261550,
                    "store": "cache",
                    "tag": [
                      "latest",
                      "1.36.1",
                      "latest"
                    ],
                    "target_type": "image",
                    "timestamp": "2024-01-23T15:43:58+02:00",
                    "tool": "valint",
                    "tool_vendor": "Scribe Security",
                    "tool_version": "1.0.0-18",
                    "user": "username"
                  }
                ]
              },
              "ruleId": "fresh-image",
              "ruleIndex": 1,
              "kind": "pass",
              "level": "note",
              "message": {
                "text": "Rule  passed because image is new enough.",
                "markdown": "Rule  passed because image is new enough."
              },
              "locations": [
                {
                  "physicalLocation": {
                    "artifactLocation": {
                      "uri": "index.docker.io/library/busybox?version=sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824\u0026tag=latest"
                    },
                    "region": {
                      "startLine": 1
                    }
                  },
                  "message": {
                    "text": "URL"
                  }
                },
                {
                  "physicalLocation": {
                    "artifactLocation": {
                      "uri": "busybox"
                    },
                    "region": {
                      "startLine": 1
                    }
                  },
                  "message": {
                    "text": "PRODUCT"
                  }
                },
                {
                  "physicalLocation": {
                    "artifactLocation": {
                      "uri": "busybox"
                    },
                    "region": {
                      "startLine": 1
                    }
                  },
                  "message": {
                    "text": "NAME"
                  }
                },
                {
                  "physicalLocation": {
                    "artifactLocation": {
                      "uri": "pkg:docker/index.docker.io/library/busybox:latest@sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824?arch=amd64"
                    },
                    "region": {
                      "startLine": 1
                    }
                  },
                  "message": {
                    "text": "PURL"
                  }
                },
                {
                  "physicalLocation": {
                    "artifactLocation": {
                      "uri": "%2Fhome%2Fusername%2F.cache%2Fvalint%2Fsha256-a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824.bom.sig.json"
                    },
                    "region": {
                      "startLine": 1
                    }
                  },
                  "message": {
                    "text": "REF"
                  }
                }
              ]
            }
          ],
          "automationDetails": {
            "id": "valint/1706017642"
          },
          "properties": {
            "verifier-context": {
              "hostname": "runner_1",
              "user": "username",
              "name": "busybox",
              "product_version": "v0.1",
              "timestamp": "2024-01-23T15:47:22+02:00",
              "input_scheme": "docker",
              "input_name": "busybox",
              "input_tag": "latest",
              "content_type": "statement-sarif",
              "context_type": "local",
              "predicate_type": "https://cyclonedx.org/bom/v1.4",
              "imageID": "sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824",
              "repoDigest": [
                "busybox@sha256:3fbc632167424a6d997e74f52b878d7cc478225cffac6bc977eedfe51c7f4e79"
              ],
              "tag": [
                "latest",
                "1.36.1",
                "latest"
              ],
              "size": 4261550,
              "platform": "linux/amd64",
              "target_type": "policy-results",
              "sbomgroup": "image",
              "sbomname": "index.docker.io/library/busybox:latest",
              "sbomversion": "sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824",
              "sbomhashs": [
                "sha256-3fbc632167424a6d997e74f52b878d7cc478225cffac6bc977eedfe51c7f4e79",
                "sha256-a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824"
              ],
              "sbompurl": "pkg:docker/index.docker.io/library/busybox:latest@sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824?arch=amd64",
              "policies": [
                "my_policy",
                "default"
              ],
              "rules": [
                "signed_image",
                "fresh-image"
              ],
              "rule_types": [
                "verify-artifact",
                "verify-artifact"
              ],
              "allow": true,
              "policy-scripts": {
                "": "",
                "fresh-image.rego": "e90241897259b16872cbcb61acad6b8cc61898b11f73d8b7f4a3f58c7d5f1319"
              }
            }
          }
        }
      ]
    }
  }
}
```

</details>
