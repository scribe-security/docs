---
sidebar_label: "Policy results"
title: Policy Result Evaluation
author: Viktor Kartashov - Scribe
sidebar_position: 6
date: November 30, 2023
geometry: margin=2cm
---

## Introduction to policy results

The policy evaluation outcome is a report in SARIF format, optionally encapsulated as an evidence: in-toto statement (_default_) or attestation. By default, this evidence is pushed to the attestation store and can be referenced by other policies.

In this context, the in-toto statement or attestation has a predicate type of `http://docs.oasis-open.org/sarif/sarif/2.1.0`, target type `policy-results` and contains SARIF under `.predicate.content` path.

The pure SARIF format consists solely of the SARIF output from the policy evaluation, designed for seamless integration with other tools.

In addition to the evidence output, the results are also presented in the log as a table, providing a quick overview of both failed and passed rules.

## Creating attestations out of policy results

The results of policy evaluation are stored by default as evidence. If you want not to do it, use the `--skip-report` option.

The `--format` option (or `-o` for short) is employed to specify the output format. Supported values include `attest-sarif` (or simply `attest`), `statement-sarif` (also referred to as `statement`) and `sarif` (in JSON format). The default value is `statement`.

Additionally, you have the option to save a local copy of the uploaded statement using the `--output-file /path/to/file` option.

## Tuning policy results output

It's also possible to determine how policy results are included in the output. The supported options are:

* result-per-violation – each violation is pushed to SARIF as a separate result. This is the default behavior.

* result-per-rule – all rule violations are aggregated into one result per rule. This option can be enabled separately for each rule by specifying `aggregate-results: true` in the rule configuration.

<!-- * `--result.by-rule` – aggregates all rule violations into one result per rule. By default, this option is disabled, meaning that each violation is pushed to SARIF as a separate result.
* `--result.aggregated` – includes, in addition to the existing results, one aggregated result for every rule being run. This can provide a comprehensive high-level view of all violations of underlying rules for each policy. This option is disabled by default. -->

## Policy results in valint logs

After policy evaluation, the results are shown in the output log as a table. This table provides a quick overview of the evaluation results for each rule, as well as the overall control results. For an example of the output, see the [Example](#example) section.

The results of the control verification are presented in a table format. The table consists of the following columns:

* `RULE ID`: The unique identifier of the rule.
* `RULE NAME`: The name of the rule.
* `LEVEL`: The severity level of the rule. Only rules with the "error" level can fail the control.
* `VERIFIED`: A boolean value indicating whether the evidence signature was verified. Verification failure causes the rule to fail only if the rule requires a signed attestation.
* `RESULT`: The result of the rule verification. It can be "pass", "fail" or "open".
* `SUMMARY`: The reason for the rule result.
* `TARGET`: The target asset of the rule verification.

The results of the initiative verification are also presented in a table format. The table consists of the following columns:

* `CONTROL ID`: The unique identifier of the control.
* `CONTROL NAME`: The name of the control.
* `RULE LIST`: A list of rules that were verified for the control. Each rule is mentioned as many times as it was verified. In parentheses, the rule's result is shown with consideration of the rule level: for example, if the rule failed, but the level was set to `warning`, the result of the rule evaluation will also be `warning`.
* `RESULT`: The result of the control verification. It can be "pass", "fail" or "open".

## Example

To illustrate the process of creating attestations and evaluating policy results, consider the following example. In this case, we'll create a signed SBOM (Software Bill of Materials) evidence for the busybox image and then evaluate it against a policy named image-fresh.

Create SBOM Evidence:

```bash
valint bom busybox:latest -o attest
```

We first use `valint bom` command generates a signed SBOM evidence for the busybox image using the default output format, which is an in-toto statement (attest).

Evaluate Initiative:

```bash
valint verify busybox:latest --initiative ssdf@v2
```

Next we use `valint verify` command to evaluate the busybox image against the corresponding set of rules from the SSDF initiative.

After executing these commands, the results of the evaluation are displayed in the output log as a table, summarizing the evaluation for each rule:

After policy evaluation, the results are shown in the output log as a table:

```bash
INFO SSDF-IMAGE: Control "SSDF IMAGE" Evaluation Summary:
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [SSDF-IMAGE] Control "SSDF IMAGE" Evaluation Summary                                                         │
├────────────────┬──────────────────┬───────┬──────────┬────────┬─────────────────────────────┬────────────────┤
│ RULE ID        │ RULE NAME        │ LEVEL │ VERIFIED │ RESULT │ SUMMARY                     │ TARGET         │
├────────────────┼──────────────────┼───────┼──────────┼────────┼─────────────────────────────┼────────────────┤
│ PS.2           │ Image-verifiable │ error │ true     │ pass   │ Evidence signature verified │ busybox:1.36.1 │
├────────────────┼──────────────────┼───────┼──────────┼────────┼─────────────────────────────┼────────────────┤
│ PS.3.2         │ SBOM archived    │ error │ true     │ pass   │ Evidence signature verified │ busybox:1.36.1 │
├────────────────┼──────────────────┼───────┼──────────┼────────┼─────────────────────────────┼────────────────┤
│ CONTROL RESULT │                  │       │          │ PASS   │                             │                │
└────────────────┴──────────────────┴───────┴──────────┴────────┴─────────────────────────────┴────────────────┘

INFO SSDF: Initiative "SSDF Client Initiative" Evaluation Summary:
┌───────────────────────────────────────────────────────────────┐
│ [SSDF] Initiative "SSDF Client Initiative" Evaluation Summary │
│                                                               │
├───────────────────────┬───────────────┬──────────────┬────────┤
│ CONTROL ID            │ CONTROL NAME  │ RULE LIST    │ RESULT │
├───────────────────────┼───────────────┼──────────────┼────────┤
│ SSDF-IMAGE            │ SSDF IMAGE    │ PS.2(pass),  │ pass   │
│                       │               │ PS.3.2(pass) │        │
├───────────────────────┼───────────────┼──────────────┼────────┤
│ INITIATIVE RESULT     │               │              │ PASS   │
└───────────────────────┴───────────────┴──────────────┴────────┘
Evaluation Target Name 'index.docker.io/library/busybox:latest'
```

Moreover, the Sarif result is produced and dispatched as evidence, providing the option for it to be signed based on specific requirements. This signing capability enhances the integrity and authenticity of the generated evidence, ensuring a secure and verifiable representation of the policy evaluation results.

<details>
  <summary> Signed Policy Result Example </summary>

```bash
# Create a signed SBOM (Software Bill of Materials) evidence for the 'busybox' image
valint bom busybox:latest -o attest

# Verify signed evidence for 'busybox' and export a signed evidence for Policy results
valint verify busybox:latest -i attest -o attest
```

In this example, we generate a signed SBOM evidence for the 'busybox' image using the valint bom command. Subsequently, the valint verify command evaluates the signed evidence for 'busybox' (`-i attest`) and the -o flag to export a signed evidence for Policy results (`-o attest`).

</details>

<details>
  <summary> Example Sarif output </summary>

Results are also presented as a SARIF report inside an in-toto statement.

```json
{
    "_type": "https://in-toto.io/Statement/v0.1",
    "predicateType": "http://docs.oasis-open.org/sarif/sarif/2.1.0",
    "subject": [
        {
            "name": "",
            "digest": {
                "sha256": "3a79c55aa71a43aad2ea882f60876582b1fc52182a8c59ec11bb729012b90104"
            }
        }
    ],
    "predicate": {
        "environment": {
            "hostname": "thinkpad",
            "user": "viktor",
            "labels": [
                "component-group=base_image",
                "component-group=metadata"
            ],
            "extra_labels": [
                "component-group=base_image",
                "component-group=metadata"
            ],
            "timestamp": "2025-03-06T15:36:53+02:00",
            "input_name": "busybox",
            "input_tag": "latest",
            "content_type": "statement-sarif",
            "content_body_type": "sarif",
            "context_type": "local",
            "predicate_type": "http://docs.oasis-open.org/sarif/sarif/2.1.0",
            "tool": "valint",
            "tool_version": "1.5.18",
            "format_type": "sarif",
            "format_version": "2.1.0",
            "format_encoding": "json",
            "git_url": "https://github.com/scribe-security/valint.git",
            "git_branch": "feat/sh-5802_initiatives_config",
            "git_commit": "c929f96c7fcde3284c3f6988546f12fe1e63c77d",
            "git_ref": "refs/heads/feat/sh-5802_initiatives_config",
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
            "created": "2023-07-18T23:19:33.655005962Z",
            "file_id": "sha256:3a79c55aa71a43aad2ea882f60876582b1fc52182a8c59ec11bb729012b90104",
            "file_path": "index.docker.io/library/busybox:latest",
            "target_type": "policy-results",
            "sbomtype": "container",
            "sbomgroup": "data",
            "sbomname": "index.docker.io/library/busybox:latest",
            "sbomversion": "sha256:3a79c55aa71a43aad2ea882f60876582b1fc52182a8c59ec11bb729012b90104",
            "sbomhashs": [
                "sha256-3a79c55aa71a43aad2ea882f60876582b1fc52182a8c59ec11bb729012b90104"
            ],
            "sbompurl": "pkg:data/index.docker.io/library/busybox:latest@sha256:3a79c55aa71a43aad2ea882f60876582b1fc52182a8c59ec11bb729012b90104",
            "sbomcomponents": [
                "base_image",
                "metadata"
            ],
            "initiative": {
                "name": "SSDF Client Initiative",
                "id": "SSDF",
                "version": "1.0.0",
                "description": "Evaluate PS rules from the SSDF initiative",
                "url": "https://csrc.nist.gov/pubs/sp/800/218/final",
                "fingerprint": "788a0897074facf3eb9572dc04172e4db8ca30582fe02b2d31c93d3428d38043"
            },
            "controls": [
                "SSDF-IMAGE::SSDF"
            ],
            "rules": [
                "PS.2::SSDF-IMAGE::SSDF",
                "PS.3.2::SSDF-IMAGE::SSDF"
            ],
            "allow": true,
            "rule-scripts": {
                "artifact-signed.rego": "7382b99c181b9a97db6da57b03f702fe9efae5b0d91592ddd5dc2fc23cd6c729",
                "data.rego": "b845d9e0800f74f2a3f37c3a1ec75cb1ec2c0cd81e8645fa901be673163ea474"
            },
            "bundle_info": {
                "git_branch": "v2",
                "git_target": "/home/viktor/.cache/valint/.tmp/git_tmp_3916451226",
                "git_repo": "https://github.com/scribe-public/sample-policies.git",
                "git_ref": "refs/heads/v2",
                "git_commit": "fcf251b0d3910a9679be812cf4a87a4e86e0aafc"
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
                                    "id": "PS.2::SSDF-IMAGE::SSDF",
                                    "name": "Image-verifiable",
                                    "shortDescription": {
                                        "text": "PS.2 Provide a mechanism to verify the integrity of the image"
                                    },
                                    "fullDescription": {
                                        "text": "PS.2 Provide a mechanism to verify the integrity of the image"
                                    },
                                    "defaultConfiguration": {
                                        "enabled": true,
                                        "level": "error",
                                        "parameters": {
                                            "properties": {
                                                "evidence": {
                                                    "filter-by": [
                                                        "product",
                                                        "target"
                                                    ],
                                                    "Match": {
                                                        "content_body_type": "cyclonedx-json",
                                                        "labels": null,
                                                        "signed": true,
                                                        "target_type": "container"
                                                    }
                                                },
                                                "input-args": {
                                                    "identity": {
                                                        "common-names": [],
                                                        "emails": []
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    "helpUri": "https://scribe-security.netlify.app/docs/valint/policies",
                                    "help": {
                                        "text": "PS.2 Provide a mechanism to verify the integrity of the image",
                                        "markdown": "PS.2 Provide a mechanism to verify the integrity of the image"
                                    },
                                    "properties": {
                                        "conditions": {},
                                        "control-name": "SSDF IMAGE",
                                        "file-hash": "a8db33184159e89d7a8bd843d64e215c3af73958e281893f0a3ef1715287c131",
                                        "labels": [
                                            "SSDF",
                                            "SBOM",
                                            "Blueprint"
                                        ],
                                        "rego-hash": "7382b99c181b9a97db6da57b03f702fe9efae5b0d91592ddd5dc2fc23cd6c729",
                                        "rule-hash": "04ff5b7a55fcf138f420837d38c5029cb9a82202dc77063fe06b24851744e673"
                                    }
                                },
                                {
                                    "id": "PS.3.2::SSDF-IMAGE::SSDF",
                                    "name": "SBOM archived",
                                    "shortDescription": {
                                        "text": "PS.3.2 Archive SBOM"
                                    },
                                    "fullDescription": {
                                        "text": "PS.3.2 Archive SBOM"
                                    },
                                    "defaultConfiguration": {
                                        "enabled": true,
                                        "level": "error",
                                        "parameters": {
                                            "properties": {
                                                "evidence": {
                                                    "filter-by": [
                                                        "product",
                                                        "target"
                                                    ],
                                                    "Match": {
                                                        "content_body_type": "cyclonedx-json",
                                                        "labels": null,
                                                        "signed": true
                                                    }
                                                },
                                                "input-args": {
                                                    "identity": {
                                                        "common-names": [],
                                                        "emails": []
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    "helpUri": "https://scribe-security.netlify.app/docs/valint/policies",
                                    "help": {
                                        "text": "PS.3.2 Archive SBOM",
                                        "markdown": "PS.3.2 Archive SBOM"
                                    },
                                    "properties": {
                                        "conditions": {},
                                        "control-name": "SSDF IMAGE",
                                        "file-hash": "926477da64e501041207be467f9ee194b19b81305116c15cb3043a6214290a20",
                                        "labels": [
                                            "SSDF",
                                            "SBOM",
                                            "Blueprint"
                                        ],
                                        "rego-hash": "7382b99c181b9a97db6da57b03f702fe9efae5b0d91592ddd5dc2fc23cd6c729",
                                        "rule-hash": "892641a5829f5104dbd4a8a8d7e39f67a96b32eaf0363685997a27bd85e87459"
                                    }
                                },
                                {
                                    "id": "PS.1.1::SSDF-ORG::SSDF",
                                    "name": "Enforce 2FA",
                                    "shortDescription": {
                                        "text": "PS.1 Require 2FA for accessing code"
                                    },
                                    "fullDescription": {
                                        "text": "PS.1 Require 2FA for accessing code"
                                    },
                                    "defaultConfiguration": {
                                        "enabled": false,
                                        "level": "error",
                                        "parameters": {
                                            "properties": {
                                                "evidence": {
                                                    "Match": {
                                                        "content_body_type": "generic",
                                                        "labels": [
                                                            "platform=github",
                                                            "asset_type=organization",
                                                            "{{- if eq (index .Context \"asset-type\") \"organization\" -}} {{- asset_on_target (index .Context \"asset-name\") -}} {{- else -}} {{- asset_on_target nil -}} {{- end -}}"
                                                        ],
                                                        "predicate_type": "http://scribesecurity.com/evidence/discovery/v0.1",
                                                        "signed": false,
                                                        "target_type": "data"
                                                    }
                                                },
                                                "input-args": {
                                                    "desired_value": false
                                                }
                                            }
                                        }
                                    },
                                    "helpUri": "https://scribe-security.netlify.app/docs/valint/policies",
                                    "help": {
                                        "text": "PS.1 Require 2FA for accessing code",
                                        "markdown": "PS.1 Require 2FA for accessing code"
                                    },
                                    "properties": {
                                        "conditions": {},
                                        "control-name": "SSDF ORG",
                                        "file-hash": "973ab95c2e10dbc7f30239ba863856db4b63e80006e9bcaac00663ba109cd955",
                                        "labels": [
                                            "SSDF",
                                            "GitHub",
                                            "Organization"
                                        ],
                                        "rego-hash": "7886079cbb1645876dc699c59ed1a313d50fed2d303003def656093685504f8e",
                                        "rule-hash": "3a562d2a6d9c2b4f2543e53c7877d770ae4cc526afb466090eef58dd86beacb9"
                                    }
                                },
                                {
                                    "id": "PS.1.3::SSDF-ORG::SSDF",
                                    "name": "Limit admins",
                                    "shortDescription": {
                                        "text": "PS.1 Restrict the maximum number of organization admins"
                                    },
                                    "fullDescription": {
                                        "text": "PS.1 Restrict the maximum number of organization admins"
                                    },
                                    "defaultConfiguration": {
                                        "enabled": false,
                                        "level": "error",
                                        "parameters": {
                                            "properties": {
                                                "evidence": {
                                                    "Match": {
                                                        "content_body_type": "generic",
                                                        "labels": [
                                                            "platform=github",
                                                            "asset_type=organization",
                                                            "{{- if eq (index .Context \"asset-type\") \"organization\" -}} {{- asset_on_target (index .Context \"asset-name\") -}} {{- else -}} {{- asset_on_target nil -}} {{- end -}}"
                                                        ],
                                                        "predicate_type": "http://scribesecurity.com/evidence/discovery/v0.1",
                                                        "signed": false,
                                                        "target_type": "data"
                                                    }
                                                },
                                                "input-args": {
                                                    "max_admins": 3
                                                }
                                            }
                                        }
                                    },
                                    "helpUri": "https://scribe-security.netlify.app/docs/valint/policies",
                                    "help": {
                                        "text": "PS.1 Restrict the maximum number of organization admins",
                                        "markdown": "PS.1 Restrict the maximum number of organization admins"
                                    },
                                    "properties": {
                                        "conditions": {},
                                        "control-name": "SSDF ORG",
                                        "file-hash": "d06ae8fa2d1c9b5368742ce74cc08ce8c2a51c00b15cb56e30ac66897cce4d99",
                                        "labels": [
                                            "SSDF",
                                            "Blueprint",
                                            "GitHub",
                                            "Organization"
                                        ],
                                        "rego-hash": "6db3e98fb06073d449477ab08f08bd7c507578d5be89c1ec74edc56c2f7e52b8",
                                        "rule-hash": "b5ef81aca0c597cf2019b2652feb17ba0257b90551a2000962dd4e84149fe724"
                                    }
                                },
                                {
                                    "id": "PS.1.5::SSDF-ORG::SSDF",
                                    "name": "Require signoff on web commits",
                                    "shortDescription": {
                                        "text": "PS.1 Require contributors to sign when committing to Github through the web interface"
                                    },
                                    "fullDescription": {
                                        "text": "PS.1 Require contributors to sign when committing to Github through the web interface"
                                    },
                                    "defaultConfiguration": {
                                        "enabled": false,
                                        "level": "error",
                                        "parameters": {
                                            "properties": {
                                                "evidence": {
                                                    "Match": {
                                                        "content_body_type": "generic",
                                                        "labels": [
                                                            "platform=github",
                                                            "asset_type=organization",
                                                            "{{- if eq (index .Context \"asset-type\") \"organization\" -}} {{- asset_on_target (index .Context \"asset-name\") -}} {{- else -}} {{- asset_on_target nil -}} {{- end -}}"
                                                        ],
                                                        "predicate_type": "http://scribesecurity.com/evidence/discovery/v0.1",
                                                        "signed": false,
                                                        "target_type": "data"
                                                    }
                                                },
                                                "input-args": {
                                                    "desired_value": true
                                                }
                                            }
                                        }
                                    },
                                    "helpUri": "https://scribe-security.netlify.app/docs/valint/policies",
                                    "help": {
                                        "text": "PS.1 Require contributors to sign when committing to Github through the web interface",
                                        "markdown": "PS.1 Require contributors to sign when committing to Github through the web interface"
                                    },
                                    "properties": {
                                        "conditions": {},
                                        "control-name": "SSDF ORG",
                                        "file-hash": "87e452e4adfd2f96320a19529be38c3636c9018b2c93b162fd7f47b72152f0ec",
                                        "labels": [
                                            "SSDF",
                                            "GitHub",
                                            "Organization"
                                        ],
                                        "rego-hash": "56fea30cb520fff9d9d32ba0926857b521d8e1b5b971d081b0283ea2ae206fd8",
                                        "rule-hash": "f9bad566b0b69003b19fcdb0e28448d1491c5da3700ea9b47ac7c6d10082bccb"
                                    }
                                },
                                {
                                    "id": "PS.3.1::SSDF-REPO::SSDF",
                                    "name": "Code archived",
                                    "shortDescription": {
                                        "text": "PS.3.1 Verify that the software release data is archived.\nWe assume running in Github thus the code is allways stored in a repository\n"
                                    },
                                    "fullDescription": {
                                        "text": "PS.3.1 Verify that the software release data is archived.\nWe assume running in Github thus the code is allways stored in a repository\n"
                                    },
                                    "defaultConfiguration": {
                                        "enabled": true,
                                        "level": "error",
                                        "parameters": {
                                            "properties": {
                                                "evidence": {
                                                    "Match": {
                                                        "labels": null,
                                                        "signed": false
                                                    }
                                                },
                                                "input-args": {
                                                    "allow": true,
                                                    "description": "Since the code is within a repository, it is archived.",
                                                    "reason": "The code is archived in a repository. This is a demo rule, planned to run from a workflow in a repository.",
                                                    "short_description": "Code is archived.",
                                                    "violations": [
                                                        {
                                                            "violation1": "thing 1"
                                                        },
                                                        {
                                                            "something2": [
                                                                "some",
                                                                "thing"
                                                            ],
                                                            "violation2": "thing 2"
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    },
                                    "helpUri": "https://scribe-security.netlify.app/docs/valint/policies",
                                    "help": {
                                        "text": "PS.3.1 Verify that the software release data is archived.\nWe assume running in Github thus the code is allways stored in a repository\n",
                                        "markdown": "PS.3.1 Verify that the software release data is archived.\nWe assume running in Github thus the code is allways stored in a repository\n"
                                    },
                                    "properties": {
                                        "conditions": {},
                                        "control-name": "SSDF REPO",
                                        "file-hash": "6f5ec45673d0172e0b9213fb695e5315b5072c0355e5648a5babf5661fce902f",
                                        "labels": [
                                            "SSDF"
                                        ],
                                        "rego-hash": "b845d9e0800f74f2a3f37c3a1ec75cb1ec2c0cd81e8645fa901be673163ea474",
                                        "rule-hash": "49b62752968edd1f0e536dc584cc69a6bf00e5b8ee2f1768307716c097c08b1a"
                                    }
                                },
                                {
                                    "id": "PS.1.2::SSDF-REPO::SSDF",
                                    "name": "Branch protected",
                                    "shortDescription": {
                                        "text": "PS.1 Require branch protection for the repository"
                                    },
                                    "fullDescription": {
                                        "text": "PS.1 Require branch protection for the repository"
                                    },
                                    "defaultConfiguration": {
                                        "enabled": false,
                                        "level": "error",
                                        "parameters": {
                                            "properties": {
                                                "evidence": {
                                                    "Match": {
                                                        "content_body_type": "generic",
                                                        "labels": [
                                                            "platform=github",
                                                            "asset_type=repository",
                                                            "{{- if eq (index .Context \"asset-type\") \"repository\" -}} {{- asset_on_target (index .Context \"asset-name\") -}} {{- else -}} {{- asset_on_target nil -}} {{- end -}}"
                                                        ],
                                                        "predicate_type": "http://scribesecurity.com/evidence/discovery/v0.1",
                                                        "signed": false,
                                                        "target_type": "data"
                                                    }
                                                },
                                                "input-args": {
                                                    "branches": [
                                                        "main",
                                                        "master"
                                                    ],
                                                    "desired_protected": true
                                                }
                                            }
                                        }
                                    },
                                    "helpUri": "https://scribe-security.netlify.app/docs/valint/policies",
                                    "help": {
                                        "text": "PS.1 Require branch protection for the repository",
                                        "markdown": "PS.1 Require branch protection for the repository"
                                    },
                                    "properties": {
                                        "conditions": {},
                                        "control-name": "SSDF REPO",
                                        "file-hash": "8778a4509cf0f8c93c57f3dc106ebe00a865ee3c2deb0f5aa57e2d1b67c91164",
                                        "labels": [
                                            "SSDF",
                                            "GitHub",
                                            "Repository"
                                        ],
                                        "rego-hash": "76018c06ddb321ab19e9fae6d3fdf4ebd1b04f4425239c724081f6fb8d914647",
                                        "rule-hash": "49f62941f62a7607efd7c086f7d3734985405e3f514e9dd0daf4a4bd3c1fff8e"
                                    }
                                },
                                {
                                    "id": "PS.1.4::SSDF-REPO::SSDF",
                                    "name": "Repo private",
                                    "shortDescription": {
                                        "text": "PS.1 Assure the repository is private"
                                    },
                                    "fullDescription": {
                                        "text": "PS.1 Assure the repository is private"
                                    },
                                    "defaultConfiguration": {
                                        "enabled": false,
                                        "level": "error",
                                        "parameters": {
                                            "properties": {
                                                "evidence": {
                                                    "Match": {
                                                        "content_body_type": "generic",
                                                        "labels": [
                                                            "platform=github",
                                                            "asset_type=repository",
                                                            "{{- if eq (index .Context \"asset-type\") \"repository\" -}} {{- asset_on_target (index .Context \"asset-name\") -}} {{- else -}} {{- asset_on_target nil -}} {{- end -}}"
                                                        ],
                                                        "predicate_type": "http://scribesecurity.com/evidence/discovery/v0.1",
                                                        "signed": false,
                                                        "target_type": "data"
                                                    }
                                                },
                                                "input-args": {
                                                    "desired_value": true
                                                }
                                            }
                                        }
                                    },
                                    "helpUri": "https://scribe-security.netlify.app/docs/valint/policies",
                                    "help": {
                                        "text": "PS.1 Assure the repository is private",
                                        "markdown": "PS.1 Assure the repository is private"
                                    },
                                    "properties": {
                                        "conditions": {},
                                        "control-name": "SSDF REPO",
                                        "file-hash": "9330a8fe3aa89fa06d5f5ec52d844e345e0420a99ac3ea2ddbdc4266bdacee18",
                                        "labels": [
                                            "SSDF",
                                            "GitHub",
                                            "Repository"
                                        ],
                                        "rego-hash": "d39b92225c2fbf94d2874c2e47cc1384175730db23ae9006404ee385f97385ff",
                                        "rule-hash": "d6c637d07a348636d5e68d440f4f26908bc71ac4b42cf0b5029d1dd043f679db"
                                    }
                                }
                            ],
                            "semanticVersion": "1.5.18",
                            "version": "1.5.18"
                        }
                    },
                    "invocations": [
                        {
                            "commandLine": "valint verify busybox:latest --bundle-branch=v2 --initiative=ssdf@v2",
                            "executionSuccessful": true,
                            "exitCode": 0,
                            "exitCodeDescription": "valint exited with 0, control evaluation result is: pass"
                        }
                    ],
                    "results": [
                        {
                            "properties": {
                                "asset": {
                                    "asset-id": "sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824",
                                    "asset-name": "busybox:1.36.1",
                                    "asset-type": "image"
                                },
                                "evidence": {
                                    "content_body_type": "cyclonedx-json",
                                    "content_type": "attest-cyclonedx-json",
                                    "context_type": "local",
                                    "created": "2023-07-18T23:19:33.655005962Z",
                                    "email_addresses": [
                                        "victor.kartashov@gmail.com"
                                    ],
                                    "extra_labels": [
                                        "component-group=dep",
                                        "component-group=base_image",
                                        "component-group=metadata",
                                        "component-group=packages",
                                        "signer=victor.kartashov@gmail.com",
                                        "signer-issuer=sigstore-intermediate"
                                    ],
                                    "format_encoding": "json",
                                    "format_type": "cyclonedx",
                                    "format_version": "1.5",
                                    "git_branch": "feat/sh-5802_initiatives_config",
                                    "git_commit": "c929f96c7fcde3284c3f6988546f12fe1e63c77d",
                                    "git_ref": "refs/heads/feat/sh-5802_initiatives_config",
                                    "git_url": "https://github.com/scribe-security/valint.git",
                                    "hostname": "thinkpad",
                                    "imageID": "sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824",
                                    "input_name": "busybox",
                                    "input_scheme": "docker",
                                    "input_tag": "latest",
                                    "issuer": "sigstore-intermediate",
                                    "labels": [
                                        "component-group=base_image",
                                        "component-group=dep",
                                        "component-group=metadata",
                                        "component-group=packages",
                                        "signer-issuer=sigstore-intermediate",
                                        "signer=victor.kartashov@gmail.com"
                                    ],
                                    "platform": "linux/amd64",
                                    "predicate_type": "https://cyclonedx.org/bom/v1.5",
                                    "ref": "/home/viktor/.cache/valint/sha256-a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824.bom.sig.json",
                                    "repoDigest": [
                                        "busybox@sha256:3fbc632167424a6d997e74f52b878d7cc478225cffac6bc977eedfe51c7f4e79"
                                    ],
                                    "sbomcomponents": [
                                        "base_image",
                                        "dep",
                                        "metadata",
                                        "packages"
                                    ],
                                    "sbomgroup": "container",
                                    "sbomhashs": [
                                        "sha256-3fbc632167424a6d997e74f52b878d7cc478225cffac6bc977eedfe51c7f4e79",
                                        "sha256-a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824"
                                    ],
                                    "sbomname": "index.docker.io/library/busybox:latest",
                                    "sbompurl": "pkg:docker/index.docker.io/library/busybox:latest@sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824?arch=amd64",
                                    "sbomtype": "container",
                                    "sbomversion": "sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824",
                                    "signed": true,
                                    "size": 4261550,
                                    "store": "cache",
                                    "tag": [
                                        "latest",
                                        "1.36.1",
                                        "latest"
                                    ],
                                    "target_type": "container",
                                    "timestamp": "2025-03-06T15:35:50+02:00",
                                    "tool": "valint",
                                    "tool_vendor": "Scribe Security",
                                    "tool_version": "1.5.18",
                                    "user": "viktor"
                                }
                            },
                            "ruleId": "PS.3.2::SSDF-IMAGE::SSDF",
                            "ruleIndex": 1,
                            "kind": "pass",
                            "level": "note",
                            "message": {
                                "text": "1/1 evidence origin and signature verified. Evidence signature verified",
                                "markdown": "1/1 evidence origin and signature verified. Evidence signature verified"
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
                                            "uri": "%2Fhome%2Fviktor%2F.cache%2Fvalint%2Fsha256-a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824.bom.sig.json"
                                        },
                                        "region": {
                                            "startLine": 1
                                        }
                                    },
                                    "message": {
                                        "text": "REF"
                                    }
                                }
                            ],
                            "fingerprints": {
                                "sha256/v1": "3b1ea9e86542f89ba143f8bc12567da7a520e0f0b478a3284b6da62a29271591"
                            }
                        },
                        {
                            "properties": {
                                "asset": {
                                    "asset-id": "sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824",
                                    "asset-name": "busybox:1.36.1",
                                    "asset-type": "image"
                                },
                                "evidence": {
                                    "content_body_type": "cyclonedx-json",
                                    "content_type": "attest-cyclonedx-json",
                                    "context_type": "local",
                                    "created": "2023-07-18T23:19:33.655005962Z",
                                    "email_addresses": [
                                        "victor.kartashov@gmail.com"
                                    ],
                                    "extra_labels": [
                                        "component-group=dep",
                                        "component-group=base_image",
                                        "component-group=metadata",
                                        "component-group=packages",
                                        "signer=victor.kartashov@gmail.com",
                                        "signer-issuer=sigstore-intermediate"
                                    ],
                                    "format_encoding": "json",
                                    "format_type": "cyclonedx",
                                    "format_version": "1.5",
                                    "git_branch": "feat/sh-5802_initiatives_config",
                                    "git_commit": "c929f96c7fcde3284c3f6988546f12fe1e63c77d",
                                    "git_ref": "refs/heads/feat/sh-5802_initiatives_config",
                                    "git_url": "https://github.com/scribe-security/valint.git",
                                    "hostname": "thinkpad",
                                    "imageID": "sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824",
                                    "input_name": "busybox",
                                    "input_scheme": "docker",
                                    "input_tag": "latest",
                                    "issuer": "sigstore-intermediate",
                                    "labels": [
                                        "component-group=base_image",
                                        "component-group=dep",
                                        "component-group=metadata",
                                        "component-group=packages",
                                        "signer-issuer=sigstore-intermediate",
                                        "signer=victor.kartashov@gmail.com"
                                    ],
                                    "platform": "linux/amd64",
                                    "predicate_type": "https://cyclonedx.org/bom/v1.5",
                                    "ref": "/home/viktor/.cache/valint/sha256-a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824.bom.sig.json",
                                    "repoDigest": [
                                        "busybox@sha256:3fbc632167424a6d997e74f52b878d7cc478225cffac6bc977eedfe51c7f4e79"
                                    ],
                                    "sbomcomponents": [
                                        "base_image",
                                        "dep",
                                        "metadata",
                                        "packages"
                                    ],
                                    "sbomgroup": "container",
                                    "sbomhashs": [
                                        "sha256-3fbc632167424a6d997e74f52b878d7cc478225cffac6bc977eedfe51c7f4e79",
                                        "sha256-a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824"
                                    ],
                                    "sbomname": "index.docker.io/library/busybox:latest",
                                    "sbompurl": "pkg:docker/index.docker.io/library/busybox:latest@sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824?arch=amd64",
                                    "sbomtype": "container",
                                    "sbomversion": "sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824",
                                    "signed": true,
                                    "size": 4261550,
                                    "store": "cache",
                                    "tag": [
                                        "latest",
                                        "1.36.1",
                                        "latest"
                                    ],
                                    "target_type": "container",
                                    "timestamp": "2025-03-06T15:35:50+02:00",
                                    "tool": "valint",
                                    "tool_vendor": "Scribe Security",
                                    "tool_version": "1.5.18",
                                    "user": "viktor"
                                }
                            },
                            "ruleId": "PS.2::SSDF-IMAGE::SSDF",
                            "ruleIndex": 0,
                            "kind": "pass",
                            "level": "note",
                            "message": {
                                "text": "1/1 evidence origin and signature verified. Evidence signature verified",
                                "markdown": "1/1 evidence origin and signature verified. Evidence signature verified"
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
                                            "uri": "%2Fhome%2Fviktor%2F.cache%2Fvalint%2Fsha256-a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824.bom.sig.json"
                                        },
                                        "region": {
                                            "startLine": 1
                                        }
                                    },
                                    "message": {
                                        "text": "REF"
                                    }
                                }
                            ],
                            "fingerprints": {
                                "sha256/v1": "f537ff644900611fcbcf28880e796911e3c93c4759edce3cfbf9bb383edd1c00"
                            }
                        }
                    ],
                    "automationDetails": {
                        "id": "valint/1741268214"
                    },
                    "policies": [
                        {
                            "fullDescription": {
                                "text": "SSDF IMAGE control evaluation"
                            },
                            "name": "SSDF IMAGE",
                            "rules": [
                                {
                                    "id": "PS.2::SSDF-IMAGE::SSDF",
                                    "shortDescription": {
                                        "text": "PS.2 Provide a mechanism to verify the integrity of the image"
                                    },
                                    "defaultConfiguration": {
                                        "enabled": true,
                                        "level": "error",
                                        "parameters": {
                                            "properties": {
                                                "evidence": {
                                                    "filter-by": [
                                                        "product",
                                                        "target"
                                                    ],
                                                    "Match": {
                                                        "content_body_type": "cyclonedx-json",
                                                        "labels": null,
                                                        "signed": true,
                                                        "target_type": "container"
                                                    }
                                                },
                                                "input-args": {
                                                    "identity": {
                                                        "common-names": [],
                                                        "emails": []
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    "id": "PS.3.2::SSDF-IMAGE::SSDF",
                                    "shortDescription": {
                                        "text": "PS.3.2 Archive SBOM"
                                    },
                                    "defaultConfiguration": {
                                        "enabled": true,
                                        "level": "error",
                                        "parameters": {
                                            "properties": {
                                                "evidence": {
                                                    "filter-by": [
                                                        "product",
                                                        "target"
                                                    ],
                                                    "Match": {
                                                        "content_body_type": "cyclonedx-json",
                                                        "labels": null,
                                                        "signed": true
                                                    }
                                                },
                                                "input-args": {
                                                    "identity": {
                                                        "common-names": [],
                                                        "emails": []
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            ],
                            "shortDescription": {
                                "text": "SSDF IMAGE control evaluation"
                            },
                            "properties": {
                                "conditions": {},
                                "id": "SSDF-IMAGE::SSDF"
                            }
                        },
                        {
                            "fullDescription": {
                                "text": "SSDF ORG control evaluation"
                            },
                            "name": "SSDF ORG",
                            "rules": [
                                {
                                    "id": "PS.1.1::SSDF-ORG::SSDF",
                                    "shortDescription": {
                                        "text": "PS.1 Require 2FA for accessing code"
                                    },
                                    "defaultConfiguration": {
                                        "enabled": false,
                                        "level": "error",
                                        "parameters": {
                                            "properties": {
                                                "evidence": {
                                                    "Match": {
                                                        "content_body_type": "generic",
                                                        "labels": [
                                                            "platform=github",
                                                            "asset_type=organization",
                                                            "{{- if eq (index .Context \"asset-type\") \"organization\" -}} {{- asset_on_target (index .Context \"asset-name\") -}} {{- else -}} {{- asset_on_target nil -}} {{- end -}}"
                                                        ],
                                                        "predicate_type": "http://scribesecurity.com/evidence/discovery/v0.1",
                                                        "signed": false,
                                                        "target_type": "data"
                                                    }
                                                },
                                                "input-args": {
                                                    "desired_value": false
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    "id": "PS.1.3::SSDF-ORG::SSDF",
                                    "shortDescription": {
                                        "text": "PS.1 Restrict the maximum number of organization admins"
                                    },
                                    "defaultConfiguration": {
                                        "enabled": false,
                                        "level": "error",
                                        "parameters": {
                                            "properties": {
                                                "evidence": {
                                                    "Match": {
                                                        "content_body_type": "generic",
                                                        "labels": [
                                                            "platform=github",
                                                            "asset_type=organization",
                                                            "{{- if eq (index .Context \"asset-type\") \"organization\" -}} {{- asset_on_target (index .Context \"asset-name\") -}} {{- else -}} {{- asset_on_target nil -}} {{- end -}}"
                                                        ],
                                                        "predicate_type": "http://scribesecurity.com/evidence/discovery/v0.1",
                                                        "signed": false,
                                                        "target_type": "data"
                                                    }
                                                },
                                                "input-args": {
                                                    "max_admins": 3
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    "id": "PS.1.5::SSDF-ORG::SSDF",
                                    "shortDescription": {
                                        "text": "PS.1 Require contributors to sign when committing to Github through the web interface"
                                    },
                                    "defaultConfiguration": {
                                        "enabled": false,
                                        "level": "error",
                                        "parameters": {
                                            "properties": {
                                                "evidence": {
                                                    "Match": {
                                                        "content_body_type": "generic",
                                                        "labels": [
                                                            "platform=github",
                                                            "asset_type=organization",
                                                            "{{- if eq (index .Context \"asset-type\") \"organization\" -}} {{- asset_on_target (index .Context \"asset-name\") -}} {{- else -}} {{- asset_on_target nil -}} {{- end -}}"
                                                        ],
                                                        "predicate_type": "http://scribesecurity.com/evidence/discovery/v0.1",
                                                        "signed": false,
                                                        "target_type": "data"
                                                    }
                                                },
                                                "input-args": {
                                                    "desired_value": true
                                                }
                                            }
                                        }
                                    }
                                }
                            ],
                            "shortDescription": {
                                "text": "SSDF ORG control evaluation"
                            },
                            "properties": {
                                "conditions": {},
                                "id": "SSDF-ORG::SSDF"
                            }
                        },
                        {
                            "fullDescription": {
                                "text": "SSDF REPO control evaluation"
                            },
                            "name": "SSDF REPO",
                            "rules": [
                                {
                                    "id": "PS.3.1::SSDF-REPO::SSDF",
                                    "shortDescription": {
                                        "text": "PS.3.1 Verify that the software release data is archived.\nWe assume running in Github thus the code is allways stored in a repository\n"
                                    },
                                    "defaultConfiguration": {
                                        "enabled": true,
                                        "level": "error",
                                        "parameters": {
                                            "properties": {
                                                "evidence": {
                                                    "Match": {
                                                        "labels": null,
                                                        "signed": false
                                                    }
                                                },
                                                "input-args": {
                                                    "allow": true,
                                                    "description": "Since the code is within a repository, it is archived.",
                                                    "reason": "The code is archived in a repository. This is a demo rule, planned to run from a workflow in a repository.",
                                                    "short_description": "Code is archived.",
                                                    "violations": [
                                                        {
                                                            "violation1": "thing 1"
                                                        },
                                                        {
                                                            "something2": [
                                                                "some",
                                                                "thing"
                                                            ],
                                                            "violation2": "thing 2"
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    "id": "PS.1.2::SSDF-REPO::SSDF",
                                    "shortDescription": {
                                        "text": "PS.1 Require branch protection for the repository"
                                    },
                                    "defaultConfiguration": {
                                        "enabled": false,
                                        "level": "error",
                                        "parameters": {
                                            "properties": {
                                                "evidence": {
                                                    "Match": {
                                                        "content_body_type": "generic",
                                                        "labels": [
                                                            "platform=github",
                                                            "asset_type=repository",
                                                            "{{- if eq (index .Context \"asset-type\") \"repository\" -}} {{- asset_on_target (index .Context \"asset-name\") -}} {{- else -}} {{- asset_on_target nil -}} {{- end -}}"
                                                        ],
                                                        "predicate_type": "http://scribesecurity.com/evidence/discovery/v0.1",
                                                        "signed": false,
                                                        "target_type": "data"
                                                    }
                                                },
                                                "input-args": {
                                                    "branches": [
                                                        "main",
                                                        "master"
                                                    ],
                                                    "desired_protected": true
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    "id": "PS.1.4::SSDF-REPO::SSDF",
                                    "shortDescription": {
                                        "text": "PS.1 Assure the repository is private"
                                    },
                                    "defaultConfiguration": {
                                        "enabled": false,
                                        "level": "error",
                                        "parameters": {
                                            "properties": {
                                                "evidence": {
                                                    "Match": {
                                                        "content_body_type": "generic",
                                                        "labels": [
                                                            "platform=github",
                                                            "asset_type=repository",
                                                            "{{- if eq (index .Context \"asset-type\") \"repository\" -}} {{- asset_on_target (index .Context \"asset-name\") -}} {{- else -}} {{- asset_on_target nil -}} {{- end -}}"
                                                        ],
                                                        "predicate_type": "http://scribesecurity.com/evidence/discovery/v0.1",
                                                        "signed": false,
                                                        "target_type": "data"
                                                    }
                                                },
                                                "input-args": {
                                                    "desired_value": true
                                                }
                                            }
                                        }
                                    }
                                }
                            ],
                            "shortDescription": {
                                "text": "SSDF REPO control evaluation"
                            },
                            "properties": {
                                "conditions": {},
                                "id": "SSDF-REPO::SSDF"
                            }
                        }
                    ],
                    "properties": {
                        "verifier-context": {
                            "hostname": "thinkpad",
                            "user": "viktor",
                            "labels": [
                                "component-group=base_image",
                                "component-group=metadata"
                            ],
                            "extra_labels": [
                                "component-group=base_image",
                                "component-group=metadata"
                            ],
                            "timestamp": "2025-03-06T15:36:53+02:00",
                            "input_name": "busybox",
                            "input_tag": "latest",
                            "content_type": "statement-sarif",
                            "content_body_type": "sarif",
                            "context_type": "local",
                            "predicate_type": "http://scribesecurity.com/evidence/generic/v0.1",
                            "git_url": "https://github.com/scribe-security/valint.git",
                            "git_branch": "feat/sh-5802_initiatives_config",
                            "git_commit": "c929f96c7fcde3284c3f6988546f12fe1e63c77d",
                            "git_ref": "refs/heads/feat/sh-5802_initiatives_config",
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
                            "created": "2023-07-18T23:19:33.655005962Z",
                            "target_type": "policy-results",
                            "sbomtype": "container",
                            "sbomgroup": "container",
                            "sbomname": "index.docker.io/library/busybox:latest",
                            "sbomversion": "sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824",
                            "sbomhashs": [
                                "sha256-3fbc632167424a6d997e74f52b878d7cc478225cffac6bc977eedfe51c7f4e79",
                                "sha256-a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824"
                            ],
                            "sbompurl": "pkg:docker/index.docker.io/library/busybox:latest@sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824?arch=amd64",
                            "sbomcomponents": [
                                "base_image",
                                "metadata"
                            ],
                            "initiative": {
                                "name": "SSDF Client Initiative",
                                "id": "SSDF",
                                "version": "1.0.0",
                                "description": "Evaluate PS rules from the SSDF initiative",
                                "url": "https://csrc.nist.gov/pubs/sp/800/218/final",
                                "fingerprint": "788a0897074facf3eb9572dc04172e4db8ca30582fe02b2d31c93d3428d38043"
                            },
                            "controls": [
                                "SSDF-IMAGE::SSDF"
                            ],
                            "rules": [
                                "PS.2::SSDF-IMAGE::SSDF",
                                "PS.3.2::SSDF-IMAGE::SSDF"
                            ],
                            "allow": true,
                            "rule-scripts": {
                                "artifact-signed.rego": "7382b99c181b9a97db6da57b03f702fe9efae5b0d91592ddd5dc2fc23cd6c729",
                                "data.rego": "b845d9e0800f74f2a3f37c3a1ec75cb1ec2c0cd81e8645fa901be673163ea474"
                            },
                            "bundle_info": {
                                "git_branch": "v2",
                                "git_target": "/home/viktor/.cache/valint/.tmp/git_tmp_3916451226",
                                "git_repo": "https://github.com/scribe-public/sample-policies.git",
                                "git_ref": "refs/heads/v2",
                                "git_commit": "fcf251b0d3910a9679be812cf4a87a4e86e0aafc"
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
