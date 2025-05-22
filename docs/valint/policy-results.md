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
INFO PS/PS.2/PS.2.1: Control "Make software integrity verification information available to software acquirers" Evaluation Summary: 
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [PS/PS.2/PS.2.1] Control "Make software integrity verification information available to software acquirers" Evaluati │
│ on Summary                                                                                                           │
├────────────────┬──────────────────┬───────┬──────────┬────────┬─────────────────────────────┬────────────────────────┤
│ RULE ID        │ RULE NAME        │ LEVEL │ VERIFIED │ RESULT │ SUMMARY                     │ TARGET                 │
├────────────────┼──────────────────┼───────┼──────────┼────────┼─────────────────────────────┼────────────────────────┤
│ sbom-is-signed │ Image-verifiable │ none  │ true     │ pass   │ Evidence signature verified │ busybox:1.36.1 (image) │
├────────────────┼──────────────────┼───────┼──────────┼────────┼─────────────────────────────┼────────────────────────┤
│ CONTROL RESULT │                  │       │          │ PASS   │                             │                        │
└────────────────┴──────────────────┴───────┴──────────┴────────┴─────────────────────────────┴────────────────────────┘
INFO PS/PS.3/PS.3.1: Control "Securely archive the necessary files and supporting data to be retained for each software release" Evaluation Summary: 
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [PS/PS.3/PS.3.1] Control "Securely archive the necessary files and supporting data to be retained for each software  │
│ release" Evaluation Summary                                                                                          │
├───────────────────┬───────────────────┬───────┬──────────┬────────┬─────────────────────────┬────────────────────────┤
│ RULE ID           │ RULE NAME         │ LEVEL │ VERIFIED │ RESULT │ SUMMARY                 │ TARGET                 │
├───────────────────┼───────────────────┼───────┼──────────┼────────┼─────────────────────────┼────────────────────────┤
│ provenance-exists │ Provenance exists │ error │ false    │ fail   │ SLSA Provenance missing │ busybox:1.36.1 (image) │
├───────────────────┼───────────────────┼───────┼──────────┼────────┼─────────────────────────┼────────────────────────┤
│ CONTROL RESULT    │                   │       │          │ FAIL   │                         │                        │
└───────────────────┴───────────────────┴───────┴──────────┴────────┴─────────────────────────┴────────────────────────┘
INFO PS/PS.3/PS.3.2: Control "Collect, safeguard, maintain, and share provenance data for all components of each software release" Evaluation Summary: 
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [PS/PS.3/PS.3.2] Control "Collect, safeguard, maintain, and share provenance data for all components of each soft │
│ ware release" Evaluation Summary                                                                                  │
├────────────────┬───────────────┬───────┬──────────┬────────┬─────────────────────────────┬────────────────────────┤
│ RULE ID        │ RULE NAME     │ LEVEL │ VERIFIED │ RESULT │ SUMMARY                     │ TARGET                 │
├────────────────┼───────────────┼───────┼──────────┼────────┼─────────────────────────────┼────────────────────────┤
│ sbom-is-signed │ SBOM archived │ none  │ true     │ pass   │ Evidence signature verified │ busybox:1.36.1 (image) │
├────────────────┼───────────────┼───────┼──────────┼────────┼─────────────────────────────┼────────────────────────┤
│ CONTROL RESULT │               │       │          │ PASS   │                             │                        │
└────────────────┴───────────────┴───────┴──────────┴────────┴─────────────────────────────┴────────────────────────┘
INFO SSDF: Initiative "SSDF Client Initiative" Evaluation Summary: 
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [SSDF] Initiative "SSDF Client Initiative" Evaluation Summary                                                              │
├───────────────────┬──────────────────────────────────────────────────────────────────┬────────────────────────────┬────────┤
│ CONTROL ID        │ CONTROL NAME                                                     │ RULE LIST                  │ RESULT │
├───────────────────┼──────────────────────────────────────────────────────────────────┼────────────────────────────┼────────┤
│ PS/PS.2/PS.2.1    │ Make software integrity verification information available to so │ - Image-verifiable (pass)  │ pass   │
│                   │ ftware acquirers                                                 │                            │        │
├───────────────────┼──────────────────────────────────────────────────────────────────┼────────────────────────────┼────────┤
│ PS/PS.3/PS.3.1    │ Securely archive the necessary files and supporting data to be r │ - Provenance exists (fail) │ fail   │
│                   │ etained for each software release                                │                            │        │
├───────────────────┼──────────────────────────────────────────────────────────────────┼────────────────────────────┼────────┤
│ PS/PS.3/PS.3.2    │ Collect, safeguard, maintain, and share provenance data for all  │ - SBOM archived (pass)     │ pass   │
│                   │ components of each software release                              │                            │        │
├───────────────────┼──────────────────────────────────────────────────────────────────┼────────────────────────────┼────────┤
│ INITIATIVE RESULT │                                                                  │                            │ FAIL   │
└───────────────────┴──────────────────────────────────────────────────────────────────┴────────────────────────────┴────────┘
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
            "name": "index.docker.io/library/busybox:latest",
            "digest": {
                "sha256": "3fbc632167424a6d997e74f52b878d7cc478225cffac6bc977eedfe51c7f4e79"
            }
        },
        {
            "name": "index.docker.io/library/busybox:latest",
            "digest": {
                "sha256": "a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824"
            }
        },
        {
            "name": "",
            "digest": {
                "sha256": "ea2388e936e9fc9ea554691cd1a425309f08bee95e57ed1b66a09b9ea286c252"
            }
        }
    ],
    "predicate": {
        "environment": {
            "hostname": "thinkpad",
            "user": "user",
            "name": "my-product",
            "labels": [
                "component-group=base_image",
                "component-group=metadata"
            ],
            "extra_labels": [
                "component-group=base_image",
                "component-group=metadata"
            ],
            "timestamp": "2025-04-15T13:05:55+03:00",
            "input_name": "busybox",
            "input_tag": "latest",
            "content_type": "statement-sarif",
            "content_body_type": "sarif",
            "context_type": "local",
            "predicate_type": "http://docs.oasis-open.org/sarif/sarif/2.1.0",
            "tool": "valint",
            "tool_version": "2.0.0",
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
            "image_name": "index.docker.io/library/busybox:latest",
            "size": 4261550,
            "platform": "linux/amd64",
            "created": "2023-07-18T23:19:33.655005962Z",
            "file_id": "sha256:ea2388e936e9fc9ea554691cd1a425309f08bee95e57ed1b66a09b9ea286c252",
            "file_path": "index.docker.io/library/busybox:latest",
            "target_type": "policy-results",
            "sbomtype": "container",
            "sbomgroup": "data",
            "sbomname": "index.docker.io/library/busybox:latest",
            "sbomversion": "sha256:ea2388e936e9fc9ea554691cd1a425309f08bee95e57ed1b66a09b9ea286c252",
            "sbomhashs": [
                "sha256-ea2388e936e9fc9ea554691cd1a425309f08bee95e57ed1b66a09b9ea286c252"
            ],
            "sbompurl": "pkg:data/index.docker.io/library/busybox%3Alatest@sha256%3Aea2388e936e9fc9ea554691cd1a425309f08bee95e57ed1b66a09b9ea286c252",
            "sbomcomponents": [
                "base_image",
                "metadata"
            ],
            "controls": [
                "SSDF/PS/PS.2/PS.2.1",
                "SSDF/PS/PS.3/PS.3.1",
                "SSDF/PS/PS.3/PS.3.2"
            ],
            "rules": [
                "SSDF/PS/PS.2/PS.2.1/sbom-is-signed",
                "SSDF/PS/PS.3/PS.3.1/provenance-exists",
                "SSDF/PS/PS.3/PS.3.2/sbom-is-signed"
            ],
            "rule-scripts": {
                "artifact-signed.rego": "bb8e7472921cf089cb03c1806690e8401d2393e0b224d62ffbab0d521c71f3ad"
            },
            "bundle_info": {
                "git_branch": "v2",
                "git_target": "/home/user/.cache/valint/.tmp/git_tmp_2907983709",
                "git_repo": "https://github.com/scribe-public/sample-policies.git",
                "git_ref": "refs/heads/v2",
                "git_commit": "45919a8c4f3ae20fceb9afa01219741f651bc2ef"
            },
            "initiative-name": "SSDF Client Initiative",
            "initiative-id": "SSDF",
            "initiative-version": "1.0.0",
            "initiative-description": "Evaluate PS rules from the SSDF initiative",
            "initiative-url": "https://csrc.nist.gov/pubs/sp/800/218/final",
            "initiative-fingerprint": "d9e4049ae300a219f21eb55047c4461f3bec75bf914e84742cb18a28e29c2ca2",
            "ref": "17700",
            "store": "scribe"
        },
        "mimeType": "application/json",
        "content": {
            "$schema": "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/main/sarif-2.1/schema/sarif-schema-2.1.0.json",
            "version": "2.1.0",
            "runs": [
                {
                    "automationDetails": {
                        "id": "valint/1744711556"
                    },
                    "invocations": [
                        {
                            "commandLine": "valint verify busybox:latest --format=statement --initiative=ssdf@v2",
                            "executionSuccessful": true,
                            "exitCode": 0,
                            "exitCodeDescription": "valint exited with 0, control evaluation result is: fail",
                            "properties": {
                                "control-result": {
                                    "control-id:SSDF/PS/PS.2/PS.2.1": "pass",
                                    "control-id:SSDF/PS/PS.3/PS.3.1": "fail",
                                    "control-id:SSDF/PS/PS.3/PS.3.2": "pass"
                                },
                                "initiative-hash": "d9e4049ae300a219f21eb55047c4461f3bec75bf914e84742cb18a28e29c2ca2",
                                "initiative-id": "SSDF",
                                "initiative-name": "SSDF Client Initiative",
                                "initiative-result": "fail"
                            }
                        }
                    ],
                    "language": "en-US",
                    "newlineSequences": [
                        "\r\n",
                        "\n"
                    ],
                    "policies": [
                        {
                            "associatedComponent": {
                                "guid": "9d2a317f-93c1-5a37-b08d-21362788ca2c",
                                "index": 0,
                                "name": "SSDF Client Initiative"
                            },
                            "fullDescription": {
                                "markdown": "Store all forms of code – including source code, executable code, and configuration-as-code – based on the principle of least privilege so that only authorized personnel, tools, services, etc. have access.\nMitigation: Implement strict access controls, enforce multi-factor authentication (MFA), and regularly audit access logs to ensure only authorized personnel can access and modify the code. Use branch protection rules, require signed commits, and make repositories private to prevent unauthorized access and tampering.\n\n### Mitigation\nImplement strict access controls, enforce multi-factor authentication (MFA), and regularly audit access logs to ensure only authorized personnel can access and modify the code. Use branch protection rules, require signed commits, and make repositories private to prevent unauthorized access and tampering.",
                                "text": "Store all forms of code – including source code, executable code, and configuration-as-code – based on the principle of least privilege so that only authorized personnel, tools, services, etc. have access.\nMitigation: Implement strict access controls, enforce multi-factor authentication (MFA), and regularly audit access logs to ensure only authorized personnel can access and modify the code. Use branch protection rules, require signed commits, and make repositories private to prevent unauthorized access and tampering.\nMitigation: Implement strict access controls, enforce multi-factor authentication (MFA), and regularly audit access logs to ensure only authorized personnel can access and modify the code. Use branch protection rules, require signed commits, and make repositories private to prevent unauthorized access and tampering."
                            },
                            "guid": "e80acb74-de42-5ef3-b959-783ff48b69b2",
                            "name": "Store all forms of code based on the principle of least privilege",
                            "properties": {
                                "id": "control-id:SSDF/PS/PS.1/PS.1.1"
                            },
                            "rules": [
                                {
                                    "defaultConfiguration": {
                                        "level": "error",
                                        "parameters": {
                                            "evidence": {
                                                "Match": {
                                                    "content_body_type": "generic",
                                                    "labels": [
                                                        "platform=github",
                                                        "asset_type=organization",
                                                        "{{- if eq (index .Context \"asset_type\") \"organization\" -}} {{- asset_on_target (index .Context \"asset_name\") -}} {{- else -}} {{- asset_on_target nil -}} {{- end -}}"
                                                    ],
                                                    "predicate_type": "http://scribesecurity.com/evidence/discovery/v0.1",
                                                    "signed": false,
                                                    "target_type": "data"
                                                }
                                            },
                                            "input-args": {
                                                "desired_value": true
                                            }
                                        },
                                        "rank": -1
                                    },
                                    "helpUri": "https://scribe-security.netlify.app/docs/configuration/initiatives/rules/github/org/2fa",
                                    "id": "rule-id:SSDF/PS/PS.1/PS.1.1/2fa",
                                    "name": "Enforce 2FA",
                                    "shortDescription": {
                                        "markdown": "PS.1 Require 2FA for accessing code",
                                        "text": "PS.1 Require 2FA for accessing code"
                                    }
                                },
                                {
                                    "defaultConfiguration": {
                                        "level": "error",
                                        "parameters": {
                                            "evidence": {
                                                "Match": {
                                                    "content_body_type": "generic",
                                                    "labels": [
                                                        "platform=github",
                                                        "asset_type=organization",
                                                        "{{- if eq (index .Context \"asset_type\") \"organization\" -}} {{- asset_on_target (index .Context \"asset_name\") -}} {{- else -}} {{- asset_on_target nil -}} {{- end -}}"
                                                    ],
                                                    "predicate_type": "http://scribesecurity.com/evidence/discovery/v0.1",
                                                    "signed": false,
                                                    "target_type": "data"
                                                }
                                            },
                                            "input-args": {
                                                "max_admins": 3
                                            }
                                        },
                                        "rank": -1
                                    },
                                    "helpUri": "https://scribe-security.netlify.app/docs/configuration/initiatives/rules/github/org/max-admins",
                                    "id": "rule-id:SSDF/PS/PS.1/PS.1.1/max-admins",
                                    "name": "Limit admins",
                                    "shortDescription": {
                                        "markdown": "PS.1 Restrict the maximum number of organization admins",
                                        "text": "PS.1 Restrict the maximum number of organization admins"
                                    }
                                },
                                {
                                    "defaultConfiguration": {
                                        "level": "error",
                                        "parameters": {
                                            "evidence": {
                                                "Match": {
                                                    "content_body_type": "generic",
                                                    "labels": [
                                                        "platform=github",
                                                        "asset_type=organization",
                                                        "{{- if eq (index .Context \"asset_type\") \"organization\" -}} {{- asset_on_target (index .Context \"asset_name\") -}} {{- else -}} {{- asset_on_target nil -}} {{- end -}}"
                                                    ],
                                                    "predicate_type": "http://scribesecurity.com/evidence/discovery/v0.1",
                                                    "signed": false,
                                                    "target_type": "data"
                                                }
                                            },
                                            "input-args": {
                                                "desired_value": true
                                            }
                                        },
                                        "rank": -1
                                    },
                                    "helpUri": "https://scribe-security.netlify.app/docs/configuration/initiatives/rules/github/org/web-commit-signoff",
                                    "id": "rule-id:SSDF/PS/PS.1/PS.1.1/web-commit-signoff",
                                    "name": "Require signoff on web commits",
                                    "shortDescription": {
                                        "markdown": "PS.1 Require contributors to sign when committing to Github through the web interface",
                                        "text": "PS.1 Require contributors to sign when committing to Github through the web interface"
                                    }
                                },
                                {
                                    "defaultConfiguration": {
                                        "level": "error",
                                        "parameters": {
                                            "evidence": {
                                                "Match": {
                                                    "content_body_type": "generic",
                                                    "labels": [
                                                        "platform=github",
                                                        "asset_type=repository",
                                                        "{{- if eq (index .Context \"asset_type\") \"repository\" -}} {{- asset_on_target (index .Context \"asset_name\") -}} {{- else -}} {{- asset_on_target nil -}} {{- end -}}"
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
                                        },
                                        "rank": -1
                                    },
                                    "helpUri": "https://scribe-security.netlify.app/docs/configuration/initiatives/rules/github/repository/branch-protection",
                                    "id": "rule-id:SSDF/PS/PS.1/PS.1.1/branch-protection",
                                    "name": "Branch protected",
                                    "shortDescription": {
                                        "markdown": "PS.1 Require branch protection for the repository",
                                        "text": "PS.1 Require branch protection for the repository"
                                    }
                                },
                                {
                                    "defaultConfiguration": {
                                        "level": "error",
                                        "parameters": {
                                            "evidence": {
                                                "Match": {
                                                    "content_body_type": "generic",
                                                    "labels": [
                                                        "platform=github",
                                                        "asset_type=repository",
                                                        "{{- if eq (index .Context \"asset_type\") \"repository\" -}} {{- asset_on_target (index .Context \"asset_name\") -}} {{- else -}} {{- asset_on_target nil -}} {{- end -}}"
                                                    ],
                                                    "predicate_type": "http://scribesecurity.com/evidence/discovery/v0.1",
                                                    "signed": false,
                                                    "target_type": "data"
                                                }
                                            },
                                            "input-args": {
                                                "desired_private": true
                                            }
                                        },
                                        "rank": -1
                                    },
                                    "helpUri": "https://scribe-security.netlify.app/docs/configuration/initiatives/rules/github/repository/repo-private",
                                    "id": "rule-id:SSDF/PS/PS.1/PS.1.1/repo-is-private",
                                    "name": "Repo private",
                                    "shortDescription": {
                                        "markdown": "PS.1 Assure the repository is private",
                                        "text": "PS.1 Assure the repository is private"
                                    }
                                }
                            ],
                            "shortDescription": {
                                "markdown": "Store all forms of code – including source code, executable code, and configuration-as-code – based on the principle of least privilege so that only authorized personnel, tools, services, etc. have access.",
                                "text": "Store all forms of code – including source code, executable code, and configuration-as-code – based on the principle of least privilege so that only authorized personnel, tools, services, etc. have access."
                            }
                        },
                        {
                            "associatedComponent": {
                                "guid": "9d2a317f-93c1-5a37-b08d-21362788ca2c",
                                "index": 0,
                                "name": "SSDF Client Initiative"
                            },
                            "fullDescription": {
                                "markdown": "Help software acquirers ensure that the software they acquire is legitimate and has not been tampered with.\nMitigation: Use cryptographic signatures to sign software releases and provide a way for users to verify these signatures. Ensure that the signing keys are stored securely and that access to them is restricted. Implement automated processes to sign releases and verify their integrity before distribution. Regularly audit the signing process and keys to ensure their security and integrity.\n\n### Mitigation\nUse cryptographic signatures to sign software releases and provide a way for users to verify these signatures. Ensure that the signing keys are stored securely and that access to them is restricted. Implement automated processes to sign releases and verify their integrity before distribution. Regularly audit the signing process and keys to ensure their security and integrity.",
                                "text": "Help software acquirers ensure that the software they acquire is legitimate and has not been tampered with.\nMitigation: Use cryptographic signatures to sign software releases and provide a way for users to verify these signatures. Ensure that the signing keys are stored securely and that access to them is restricted. Implement automated processes to sign releases and verify their integrity before distribution. Regularly audit the signing process and keys to ensure their security and integrity.\nMitigation: Use cryptographic signatures to sign software releases and provide a way for users to verify these signatures. Ensure that the signing keys are stored securely and that access to them is restricted. Implement automated processes to sign releases and verify their integrity before distribution. Regularly audit the signing process and keys to ensure their security and integrity."
                            },
                            "guid": "e4664761-7b9b-5b70-85f3-839aaa4b36f1",
                            "name": "Make software integrity verification information available to software acquirers",
                            "properties": {
                                "id": "control-id:SSDF/PS/PS.2/PS.2.1"
                            },
                            "rules": [
                                {
                                    "defaultConfiguration": {
                                        "enabled": true,
                                        "level": "error",
                                        "parameters": {
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
                                        },
                                        "rank": -1
                                    },
                                    "helpUri": "https://scribe-security.netlify.app/docs/configuration/initiatives/rules/sbom/artifact-signed",
                                    "id": "rule-id:SSDF/PS/PS.2/PS.2.1/sbom-is-signed",
                                    "name": "Image-verifiable",
                                    "shortDescription": {
                                        "markdown": "PS.2 Provide a mechanism to verify the integrity of the image",
                                        "text": "PS.2 Provide a mechanism to verify the integrity of the image"
                                    }
                                }
                            ],
                            "shortDescription": {
                                "markdown": "Help software acquirers ensure that the software they acquire is legitimate and has not been tampered with.",
                                "text": "Help software acquirers ensure that the software they acquire is legitimate and has not been tampered with."
                            }
                        },
                        {
                            "associatedComponent": {
                                "guid": "9d2a317f-93c1-5a37-b08d-21362788ca2c",
                                "index": 0,
                                "name": "SSDF Client Initiative"
                            },
                            "fullDescription": {
                                "markdown": "Securely archive the necessary files and supporting data (e.g., integrity verification information, provenance data) to be retained for each software release\nMitigation: Use secure, version-controlled repositories to store software releases and their supporting data. Implement access controls to restrict who can modify or delete these repositories. Use cryptographic signatures to sign software releases and provide a way for users to verify these signatures. Regularly back up the repositories to prevent data loss and ensure that software releases are preserved even in the event of a system failure.\n\n### Mitigation\nUse secure, version-controlled repositories to store software releases and their supporting data. Implement access controls to restrict who can modify or delete these repositories. Use cryptographic signatures to sign software releases and provide a way for users to verify these signatures. Regularly back up the repositories to prevent data loss and ensure that software releases are preserved even in the event of a system failure.",
                                "text": "Securely archive the necessary files and supporting data (e.g., integrity verification information, provenance data) to be retained for each software release\nMitigation: Use secure, version-controlled repositories to store software releases and their supporting data. Implement access controls to restrict who can modify or delete these repositories. Use cryptographic signatures to sign software releases and provide a way for users to verify these signatures. Regularly back up the repositories to prevent data loss and ensure that software releases are preserved even in the event of a system failure.\nMitigation: Use secure, version-controlled repositories to store software releases and their supporting data. Implement access controls to restrict who can modify or delete these repositories. Use cryptographic signatures to sign software releases and provide a way for users to verify these signatures. Regularly back up the repositories to prevent data loss and ensure that software releases are preserved even in the event of a system failure."
                            },
                            "guid": "c9de79fa-af19-5574-a99b-4f1523d7375b",
                            "name": "Securely archive the necessary files and supporting data to be retained for each software release",
                            "properties": {
                                "id": "control-id:SSDF/PS/PS.3/PS.3.1"
                            },
                            "rules": [
                                {
                                    "defaultConfiguration": {
                                        "enabled": true,
                                        "level": "error",
                                        "parameters": {
                                            "evidence": {
                                                "filter-by": [
                                                    "product",
                                                    "target"
                                                ],
                                                "Match": {
                                                    "content_body_type": "slsa",
                                                    "labels": null,
                                                    "signed": false
                                                }
                                            },
                                            "input-args": {}
                                        },
                                        "rank": -1
                                    },
                                    "helpUri": "https://slsa.dev/spec/v1.0/requirements",
                                    "id": "rule-id:SSDF/PS/PS.3/PS.3.1/provenance-exists",
                                    "name": "Provenance exists",
                                    "shortDescription": {
                                        "markdown": "PS.3 Provenance exists\nEnsure that provenance information is available for each software release\n",
                                        "text": "PS.3 Provenance exists\nEnsure that provenance information is available for each software release\n"
                                    }
                                }
                            ],
                            "shortDescription": {
                                "markdown": "Securely archive the necessary files and supporting data (e.g., integrity verification information, provenance data) to be retained for each software release",
                                "text": "Securely archive the necessary files and supporting data (e.g., integrity verification information, provenance data) to be retained for each software release"
                            }
                        },
                        {
                            "associatedComponent": {
                                "guid": "9d2a317f-93c1-5a37-b08d-21362788ca2c",
                                "index": 0,
                                "name": "SSDF Client Initiative"
                            },
                            "fullDescription": {
                                "markdown": "Collect, safeguard, maintain, and share provenance data for all components of each software release (e.g., in a software bill of materials [SBOM])\nMitigation: Use software bill of materials (SBOM) to document the provenance of each software release and its components. Store SBOMs in a secure, version-controlled repository to ensure they can be retrieved and analyzed in the future. Implement access controls to restrict who can modify or delete SBOMs. Use cryptographic signatures to sign SBOMs and provide a way for users to verify these signatures. Regularly back up the repository to prevent data loss and ensure that SBOMs are preserved even in the event of a system failure. Document the SBOM creation process and train personnel on its importance and proper handling procedures.\n\n### Mitigation\nUse software bill of materials (SBOM) to document the provenance of each software release and its components. Store SBOMs in a secure, version-controlled repository to ensure they can be retrieved and analyzed in the future. Implement access controls to restrict who can modify or delete SBOMs. Use cryptographic signatures to sign SBOMs and provide a way for users to verify these signatures. Regularly back up the repository to prevent data loss and ensure that SBOMs are preserved even in the event of a system failure. Document the SBOM creation process and train personnel on its importance and proper handling procedures.",
                                "text": "Collect, safeguard, maintain, and share provenance data for all components of each software release (e.g., in a software bill of materials [SBOM])\nMitigation: Use software bill of materials (SBOM) to document the provenance of each software release and its components. Store SBOMs in a secure, version-controlled repository to ensure they can be retrieved and analyzed in the future. Implement access controls to restrict who can modify or delete SBOMs. Use cryptographic signatures to sign SBOMs and provide a way for users to verify these signatures. Regularly back up the repository to prevent data loss and ensure that SBOMs are preserved even in the event of a system failure. Document the SBOM creation process and train personnel on its importance and proper handling procedures.\nMitigation: Use software bill of materials (SBOM) to document the provenance of each software release and its components. Store SBOMs in a secure, version-controlled repository to ensure they can be retrieved and analyzed in the future. Implement access controls to restrict who can modify or delete SBOMs. Use cryptographic signatures to sign SBOMs and provide a way for users to verify these signatures. Regularly back up the repository to prevent data loss and ensure that SBOMs are preserved even in the event of a system failure. Document the SBOM creation process and train personnel on its importance and proper handling procedures."
                            },
                            "guid": "aaed3f57-b11e-5c28-a500-a280f861e622",
                            "name": "Collect, safeguard, maintain, and share provenance data for all components of each software release",
                            "properties": {
                                "id": "control-id:SSDF/PS/PS.3/PS.3.2"
                            },
                            "rules": [
                                {
                                    "defaultConfiguration": {
                                        "enabled": true,
                                        "level": "error",
                                        "parameters": {
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
                                        },
                                        "rank": -1
                                    },
                                    "helpUri": "https://scribe-security.netlify.app/docs/configuration/initiatives/rules/sbom/artifact-signed",
                                    "id": "rule-id:SSDF/PS/PS.3/PS.3.2/sbom-is-signed",
                                    "name": "SBOM archived",
                                    "shortDescription": {
                                        "markdown": "PS.3 Archive SBOM",
                                        "text": "PS.3 Archive SBOM"
                                    }
                                }
                            ],
                            "shortDescription": {
                                "markdown": "Collect, safeguard, maintain, and share provenance data for all components of each software release (e.g., in a software bill of materials [SBOM])",
                                "text": "Collect, safeguard, maintain, and share provenance data for all components of each software release (e.g., in a software bill of materials [SBOM])"
                            }
                        }
                    ],
                    "properties": {
                        "verifier-context": {
                            "hostname": "thinkpad",
                            "user": "user",
                            "name": "my-product",
                            "labels": [
                                "component-group=base_image",
                                "component-group=metadata"
                            ],
                            "extra_labels": [
                                "component-group=base_image",
                                "component-group=metadata"
                            ],
                            "timestamp": "2025-04-15T13:05:55+03:00",
                            "input_name": "busybox",
                            "input_tag": "latest",
                            "content_type": "statement-sarif",
                            "content_body_type": "sarif",
                            "context_type": "local",
                            "predicate_type": "http://scribesecurity.com/evidence/generic/v0.1",
                            "imageID": "sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824",
                            "repoDigest": [
                                "busybox@sha256:3fbc632167424a6d997e74f52b878d7cc478225cffac6bc977eedfe51c7f4e79"
                            ],
                            "tag": [
                                "latest",
                                "1.36.1",
                                "latest"
                            ],
                            "image_name": "index.docker.io/library/busybox:latest",
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
                            "sbompurl": "pkg:docker/index.docker.io/library/busybox%3Alatest@sha256%3Aa416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824?arch=amd64",
                            "sbomcomponents": [
                                "base_image",
                                "metadata"
                            ],
                            "controls": [
                                "SSDF/PS/PS.2/PS.2.1",
                                "SSDF/PS/PS.3/PS.3.1",
                                "SSDF/PS/PS.3/PS.3.2"
                            ],
                            "rules": [
                                "SSDF/PS/PS.2/PS.2.1/sbom-is-signed",
                                "SSDF/PS/PS.3/PS.3.1/provenance-exists",
                                "SSDF/PS/PS.3/PS.3.2/sbom-is-signed"
                            ],
                            "rule-scripts": {
                                "artifact-signed.rego": "bb8e7472921cf089cb03c1806690e8401d2393e0b224d62ffbab0d521c71f3ad"
                            },
                            "bundle_info": {
                                "git_branch": "v2",
                                "git_target": "/home/user/.cache/valint/.tmp/git_tmp_2907983709",
                                "git_repo": "https://github.com/scribe-public/sample-policies.git",
                                "git_ref": "refs/heads/v2",
                                "git_commit": "45919a8c4f3ae20fceb9afa01219741f651bc2ef"
                            },
                            "initiative-name": "SSDF Client Initiative",
                            "initiative-id": "SSDF",
                            "initiative-version": "1.0.0",
                            "initiative-description": "Evaluate PS rules from the SSDF initiative",
                            "initiative-url": "https://csrc.nist.gov/pubs/sp/800/218/final",
                            "initiative-fingerprint": "d9e4049ae300a219f21eb55047c4461f3bec75bf914e84742cb18a28e29c2ca2",
                            "ref": "17700",
                            "store": "scribe"
                        }
                    },
                    "results": [
                        {
                            "fingerprints": {
                                "sha256/v1": "7897409b0d5c3397e11d786d137ef1eb4ea8223e6545f9d5b2d3e0cf026d1390"
                            },
                            "kind": "pass",
                            "level": "none",
                            "locations": [
                                {
                                    "id": -1,
                                    "message": {
                                        "text": "URL"
                                    },
                                    "physicalLocation": {
                                        "artifactLocation": {
                                            "index": -1,
                                            "uri": "index.docker.io/library/busybox?version=sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824\u0026tag=latest"
                                        },
                                        "region": {
                                            "byteOffset": -1,
                                            "charOffset": -1,
                                            "startLine": 1
                                        }
                                    }
                                },
                                {
                                    "id": -1,
                                    "message": {
                                        "text": "PRODUCT"
                                    },
                                    "physicalLocation": {
                                        "artifactLocation": {
                                            "index": -1,
                                            "uri": "my-product"
                                        },
                                        "region": {
                                            "byteOffset": -1,
                                            "charOffset": -1,
                                            "startLine": 1
                                        }
                                    }
                                },
                                {
                                    "id": -1,
                                    "message": {
                                        "text": "NAME"
                                    },
                                    "physicalLocation": {
                                        "artifactLocation": {
                                            "index": -1,
                                            "uri": "busybox"
                                        },
                                        "region": {
                                            "byteOffset": -1,
                                            "charOffset": -1,
                                            "startLine": 1
                                        }
                                    }
                                },
                                {
                                    "id": -1,
                                    "message": {
                                        "text": "PURL"
                                    },
                                    "physicalLocation": {
                                        "artifactLocation": {
                                            "index": -1,
                                            "uri": "pkg:docker/index.docker.io/library/busybox%3Alatest@sha256%3Aa416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824?arch=amd64"
                                        },
                                        "region": {
                                            "byteOffset": -1,
                                            "charOffset": -1,
                                            "startLine": 1
                                        }
                                    }
                                },
                                {
                                    "id": -1,
                                    "message": {
                                        "text": "REF"
                                    },
                                    "physicalLocation": {
                                        "artifactLocation": {
                                            "index": -1,
                                            "uri": "17700"
                                        },
                                        "region": {
                                            "byteOffset": -1,
                                            "charOffset": -1,
                                            "startLine": 1
                                        }
                                    }
                                }
                            ],
                            "message": {
                                "markdown": "Evidence signature verified. Signed Image-SBOM origin and signature verified",
                                "text": "Evidence signature verified. Signed Image-SBOM origin and signature verified"
                            },
                            "properties": {
                                "asset": {
                                    "asset-display-name": "busybox:1.36.1 (image)",
                                    "asset-id": "sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824",
                                    "asset-name": "busybox:1.36.1",
                                    "asset-type": "image"
                                },
                                "evidence": {
                                    "common_name": "Keys",
                                    "content_body_type": "cyclonedx-json",
                                    "content_type": "attest-cyclonedx-json",
                                    "context_type": "local",
                                    "created": "2023-07-18T23:19:33.655005962Z",
                                    "extra_labels": [
                                        "component-group=packages",
                                        "component-group=dep",
                                        "component-group=base_image",
                                        "component-group=metadata",
                                        "signer=Keys",
                                        "signer-issuer=Scribe-Test-CA"
                                    ],
                                    "format_encoding": "json",
                                    "format_type": "cyclonedx",
                                    "format_version": "1.5",
                                    "hostname": "thinkpad",
                                    "imageID": "sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824",
                                    "image_name": "index.docker.io/library/busybox:latest",
                                    "input_name": "busybox",
                                    "input_scheme": "docker",
                                    "input_tag": "latest",
                                    "issuer": "Scribe-Test-CA",
                                    "labels": [
                                        "component-group=base_image",
                                        "component-group=dep",
                                        "component-group=metadata",
                                        "component-group=packages",
                                        "signer-issuer=Scribe-Test-CA",
                                        "signer=Keys"
                                    ],
                                    "name": "my-product",
                                    "platform": "linux/amd64",
                                    "predicate_type": "https://cyclonedx.org/bom/v1.5",
                                    "product_version": "v3.0.49",
                                    "ref": "17700",
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
                                    "sbompurl": "pkg:docker/index.docker.io/library/busybox%3Alatest@sha256%3Aa416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824?arch=amd64",
                                    "sbomtype": "container",
                                    "sbomversion": "sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824",
                                    "signed": true,
                                    "size": 4261550,
                                    "store": "scribe",
                                    "tag": [
                                        "latest",
                                        "1.36.1",
                                        "latest"
                                    ],
                                    "target_type": "container",
                                    "timestamp": "2025-04-15T12:59:46+03:00",
                                    "tool": "valint",
                                    "tool_vendor": "Scribe Security",
                                    "tool_version": "2.0.0",
                                    "user": "user"
                                },
                                "identity": {
                                    "common-names": [
                                        "Keys"
                                    ],
                                    "issuer": "Scribe-Test-CA",
                                    "require-signed": true,
                                    "signed-verified": true
                                }
                            },
                            "rank": -1,
                            "ruleId": "rule-id:SSDF/PS/PS.2/PS.2.1/sbom-is-signed",
                            "ruleIndex": 5
                        },
                        {
                            "fingerprints": {
                                "sha256/v1": "fa657e62d3664be07e4ad4e3f88a61149b7baef922f60d1f2f0b4b45ce1d8957"
                            },
                            "kind": "fail",
                            "level": "error",
                            "locations": [
                                {
                                    "id": -1,
                                    "message": {
                                        "text": "URL"
                                    },
                                    "physicalLocation": {
                                        "artifactLocation": {
                                            "index": -1,
                                            "uri": "scribesecurity.com"
                                        },
                                        "region": {
                                            "byteOffset": -1,
                                            "charOffset": -1,
                                            "startLine": 1
                                        }
                                    }
                                }
                            ],
                            "message": {
                                "markdown": "SLSA Provenance missing",
                                "text": "SLSA Provenance missing"
                            },
                            "properties": {
                                "asset": {
                                    "asset-display-name": "busybox:1.36.1 (image)",
                                    "asset-id": "sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824",
                                    "asset-name": "busybox:1.36.1",
                                    "asset-type": "image"
                                },
                                "identity": {
                                    "require-signed": false,
                                    "signed-verified": false
                                }
                            },
                            "rank": -1,
                            "ruleId": "rule-id:SSDF/PS/PS.3/PS.3.1/provenance-exists",
                            "ruleIndex": 6
                        },
                        {
                            "fingerprints": {
                                "sha256/v1": "53d93583ac130044624c610f997509a0222360b508727094a1b05e237d95c62f"
                            },
                            "kind": "pass",
                            "level": "none",
                            "locations": [
                                {
                                    "id": -1,
                                    "message": {
                                        "text": "URL"
                                    },
                                    "physicalLocation": {
                                        "artifactLocation": {
                                            "index": -1,
                                            "uri": "index.docker.io/library/busybox?version=sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824\u0026tag=latest"
                                        },
                                        "region": {
                                            "byteOffset": -1,
                                            "charOffset": -1,
                                            "startLine": 1
                                        }
                                    }
                                },
                                {
                                    "id": -1,
                                    "message": {
                                        "text": "PRODUCT"
                                    },
                                    "physicalLocation": {
                                        "artifactLocation": {
                                            "index": -1,
                                            "uri": "my-product"
                                        },
                                        "region": {
                                            "byteOffset": -1,
                                            "charOffset": -1,
                                            "startLine": 1
                                        }
                                    }
                                },
                                {
                                    "id": -1,
                                    "message": {
                                        "text": "NAME"
                                    },
                                    "physicalLocation": {
                                        "artifactLocation": {
                                            "index": -1,
                                            "uri": "busybox"
                                        },
                                        "region": {
                                            "byteOffset": -1,
                                            "charOffset": -1,
                                            "startLine": 1
                                        }
                                    }
                                },
                                {
                                    "id": -1,
                                    "message": {
                                        "text": "PURL"
                                    },
                                    "physicalLocation": {
                                        "artifactLocation": {
                                            "index": -1,
                                            "uri": "pkg:docker/index.docker.io/library/busybox%3Alatest@sha256%3Aa416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824?arch=amd64"
                                        },
                                        "region": {
                                            "byteOffset": -1,
                                            "charOffset": -1,
                                            "startLine": 1
                                        }
                                    }
                                },
                                {
                                    "id": -1,
                                    "message": {
                                        "text": "REF"
                                    },
                                    "physicalLocation": {
                                        "artifactLocation": {
                                            "index": -1,
                                            "uri": "17700"
                                        },
                                        "region": {
                                            "byteOffset": -1,
                                            "charOffset": -1,
                                            "startLine": 1
                                        }
                                    }
                                }
                            ],
                            "message": {
                                "markdown": "Evidence signature verified. Signed Image-SBOM origin and signature verified",
                                "text": "Evidence signature verified. Signed Image-SBOM origin and signature verified"
                            },
                            "properties": {
                                "asset": {
                                    "asset-display-name": "busybox:1.36.1 (image)",
                                    "asset-id": "sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824",
                                    "asset-name": "busybox:1.36.1",
                                    "asset-type": "image"
                                },
                                "evidence": {
                                    "common_name": "Keys",
                                    "content_body_type": "cyclonedx-json",
                                    "content_type": "attest-cyclonedx-json",
                                    "context_type": "local",
                                    "created": "2023-07-18T23:19:33.655005962Z",
                                    "extra_labels": [
                                        "component-group=packages",
                                        "component-group=dep",
                                        "component-group=base_image",
                                        "component-group=metadata",
                                        "signer=Keys",
                                        "signer-issuer=Scribe-Test-CA"
                                    ],
                                    "format_encoding": "json",
                                    "format_type": "cyclonedx",
                                    "format_version": "1.5",
                                    "hostname": "thinkpad",
                                    "imageID": "sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824",
                                    "image_name": "index.docker.io/library/busybox:latest",
                                    "input_name": "busybox",
                                    "input_scheme": "docker",
                                    "input_tag": "latest",
                                    "issuer": "Scribe-Test-CA",
                                    "labels": [
                                        "component-group=base_image",
                                        "component-group=dep",
                                        "component-group=metadata",
                                        "component-group=packages",
                                        "signer-issuer=Scribe-Test-CA",
                                        "signer=Keys"
                                    ],
                                    "name": "my-product",
                                    "platform": "linux/amd64",
                                    "predicate_type": "https://cyclonedx.org/bom/v1.5",
                                    "product_version": "v3.0.49",
                                    "ref": "17700",
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
                                    "sbompurl": "pkg:docker/index.docker.io/library/busybox%3Alatest@sha256%3Aa416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824?arch=amd64",
                                    "sbomtype": "container",
                                    "sbomversion": "sha256:a416a98b71e224a31ee99cff8e16063554498227d2b696152a9c3e0aa65e5824",
                                    "signed": true,
                                    "size": 4261550,
                                    "store": "scribe",
                                    "tag": [
                                        "latest",
                                        "1.36.1",
                                        "latest"
                                    ],
                                    "target_type": "container",
                                    "timestamp": "2025-04-15T12:59:46+03:00",
                                    "tool": "valint",
                                    "tool_vendor": "Scribe Security",
                                    "tool_version": "2.0.0",
                                    "user": "user"
                                },
                                "identity": {
                                    "common-names": [
                                        "Keys"
                                    ],
                                    "issuer": "Scribe-Test-CA",
                                    "require-signed": true,
                                    "signed-verified": true
                                }
                            },
                            "rank": -1,
                            "ruleId": "rule-id:SSDF/PS/PS.3/PS.3.2/sbom-is-signed",
                            "ruleIndex": 7
                        }
                    ],
                    "tool": {
                        "driver": {
                            "contents": [
                                "localizedData",
                                "nonLocalizedData"
                            ],
                            "informationUri": "https://scribesecurity.com",
                            "language": "en-US",
                            "name": "valint",
                            "rules": [
                                {
                                    "defaultConfiguration": {
                                        "level": "error",
                                        "parameters": {
                                            "evidence": {
                                                "Match": {
                                                    "content_body_type": "generic",
                                                    "labels": [
                                                        "platform=github",
                                                        "asset_type=organization",
                                                        "{{- if eq (index .Context \"asset_type\") \"organization\" -}} {{- asset_on_target (index .Context \"asset_name\") -}} {{- else -}} {{- asset_on_target nil -}} {{- end -}}"
                                                    ],
                                                    "predicate_type": "http://scribesecurity.com/evidence/discovery/v0.1",
                                                    "signed": false,
                                                    "target_type": "data"
                                                }
                                            },
                                            "input-args": {
                                                "desired_value": true
                                            }
                                        },
                                        "rank": -1
                                    },
                                    "fullDescription": {
                                        "markdown": "This rule verifies that two-factor authentication (2FA) is enabled for the organization by examining the provided evidence.\nIt checks the organization's details (retrieved from the SARIF or equivalent evidence) and compares the value of the \n`organization_details.two_factor_requirement_enabled` field against the expected value.\n\nThe rule iterates over the organization data in the evidence, and if the `two_factor_requirement_enabled` field does not match \nthe desired value, a violation is recorded. This ensures that all organizational accounts enforce 2FA, providing an additional \nlayer of security against unauthorized access.\n\n### **Evidence Requirements**\n- Evidence must include organization data with a field named `organization_details.two_factor_requirement_enabled`.\n- The data should come from a trusted source (e.g., a GitHub organization scan).\n- The evidence must clearly indicate whether 2FA is enabled.\n\n### Mitigation\nEnforces two-factor authentication (2FA) for organizational accounts, significantly reducing the risk of unauthorized access  through compromised credentials.",
                                        "text": "This rule verifies that two-factor authentication (2FA) is enabled for the organization by examining the provided evidence.\nIt checks the organization's details (retrieved from the SARIF or equivalent evidence) and compares the value of the \n`organization_details.two_factor_requirement_enabled` field against the expected value.\n\nThe rule iterates over the organization data in the evidence, and if the `two_factor_requirement_enabled` field does not match \nthe desired value, a violation is recorded. This ensures that all organizational accounts enforce 2FA, providing an additional \nlayer of security against unauthorized access.\n\n### **Evidence Requirements**\n- Evidence must include organization data with a field named `organization_details.two_factor_requirement_enabled`.\n- The data should come from a trusted source (e.g., a GitHub organization scan).\n- The evidence must clearly indicate whether 2FA is enabled.\nMitigation: Enforces two-factor authentication (2FA) for organizational accounts, significantly reducing the risk of unauthorized access  through compromised credentials."
                                    },
                                    "guid": "7a4aecb8-d512-55e3-989a-b6fe14fa2c31",
                                    "help": {
                                        "markdown": "This rule verifies that two-factor authentication (2FA) is enabled for the organization by examining the provided evidence.\nIt checks the organization's details (retrieved from the SARIF or equivalent evidence) and compares the value of the \n`organization_details.two_factor_requirement_enabled` field against the expected value.\n\nThe rule iterates over the organization data in the evidence, and if the `two_factor_requirement_enabled` field does not match \nthe desired value, a violation is recorded. This ensures that all organizational accounts enforce 2FA, providing an additional \nlayer of security against unauthorized access.\n\n### **Evidence Requirements**\n- Evidence must include organization data with a field named `organization_details.two_factor_requirement_enabled`.\n- The data should come from a trusted source (e.g., a GitHub organization scan).\n- The evidence must clearly indicate whether 2FA is enabled.",
                                        "text": "This rule verifies that two-factor authentication (2FA) is enabled for the organization by examining the provided evidence.\nIt checks the organization's details (retrieved from the SARIF or equivalent evidence) and compares the value of the \n`organization_details.two_factor_requirement_enabled` field against the expected value.\n\nThe rule iterates over the organization data in the evidence, and if the `two_factor_requirement_enabled` field does not match \nthe desired value, a violation is recorded. This ensures that all organizational accounts enforce 2FA, providing an additional \nlayer of security against unauthorized access.\n\n### **Evidence Requirements**\n- Evidence must include organization data with a field named `organization_details.two_factor_requirement_enabled`.\n- The data should come from a trusted source (e.g., a GitHub organization scan).\n- The evidence must clearly indicate whether 2FA is enabled."
                                    },
                                    "helpUri": "https://scribe-security.netlify.app/docs/configuration/initiatives/rules/github/org/2fa",
                                    "id": "rule-id:SSDF/PS/PS.1/PS.1.1/2fa",
                                    "name": "Enforce 2FA",
                                    "properties": {
                                        "control-id": "control-id:SSDF/PS/PS.1/PS.1.1",
                                        "control-name": "Store all forms of code based on the principle of least privilege",
                                        "doc-url": "https://scribe-security.netlify.app/docs/configuration/initiatives/rules/github/org/2fa",
                                        "file-hash": "dbe86363a09014d6de4950d2e375cfa46ced22f7ca1908ffd2a14be8dfc95e39",
                                        "labels": [
                                            "GitHub",
                                            "Organization"
                                        ],
                                        "rego-hash": "7886079cbb1645876dc699c59ed1a313d50fed2d303003def656093685504f8e",
                                        "rule-hash": "1d57f5273f15bda915b3d7b2e4ede2a12b98c9942464f571c65be225235783f3",
                                        "source-url": "https://github.com/scribe-public/sample-policies/blob/v2/v2/rules/github/org/2fa.yaml",
                                        "tags": [
                                            "GitHub",
                                            "Organization"
                                        ]
                                    },
                                    "shortDescription": {
                                        "markdown": "PS.1 Require 2FA for accessing code",
                                        "text": "PS.1 Require 2FA for accessing code"
                                    }
                                },
                                {
                                    "defaultConfiguration": {
                                        "level": "error",
                                        "parameters": {
                                            "evidence": {
                                                "Match": {
                                                    "content_body_type": "generic",
                                                    "labels": [
                                                        "platform=github",
                                                        "asset_type=organization",
                                                        "{{- if eq (index .Context \"asset_type\") \"organization\" -}} {{- asset_on_target (index .Context \"asset_name\") -}} {{- else -}} {{- asset_on_target nil -}} {{- end -}}"
                                                    ],
                                                    "predicate_type": "http://scribesecurity.com/evidence/discovery/v0.1",
                                                    "signed": false,
                                                    "target_type": "data"
                                                }
                                            },
                                            "input-args": {
                                                "max_admins": 3
                                            }
                                        },
                                        "rank": -1
                                    },
                                    "fullDescription": {
                                        "markdown": "This rule ensures that the number of admins in the GitHub organization does not exceed the specified maximum.\nIt performs the following steps:\n\n1. Checks the list of admins in the GitHub organization.\n2. Verifies that the number of admins does not exceed the value specified in the `with.max_admins` configuration.\n\n**Evidence Requirements:**\n- Evidence must be provided by the Scribe Platform's CLI tool through scanning GitHub organization resources.\n\n### Mitigation\nEnsures that the number of admins in the GitHub organization is kept within a manageable limit, reducing the risk of unauthorized administrative actions.",
                                        "text": "This rule ensures that the number of admins in the GitHub organization does not exceed the specified maximum.\nIt performs the following steps:\n\n1. Checks the list of admins in the GitHub organization.\n2. Verifies that the number of admins does not exceed the value specified in the `with.max_admins` configuration.\n\n**Evidence Requirements:**\n- Evidence must be provided by the Scribe Platform's CLI tool through scanning GitHub organization resources.\nMitigation: Ensures that the number of admins in the GitHub organization is kept within a manageable limit, reducing the risk of unauthorized administrative actions."
                                    },
                                    "guid": "8e55e676-bd13-586d-9a56-11aab1fb5b8b",
                                    "help": {
                                        "markdown": "This rule ensures that the number of admins in the GitHub organization does not exceed the specified maximum.\nIt performs the following steps:\n\n1. Checks the list of admins in the GitHub organization.\n2. Verifies that the number of admins does not exceed the value specified in the `with.max_admins` configuration.\n\n**Evidence Requirements:**\n- Evidence must be provided by the Scribe Platform's CLI tool through scanning GitHub organization resources.",
                                        "text": "This rule ensures that the number of admins in the GitHub organization does not exceed the specified maximum.\nIt performs the following steps:\n\n1. Checks the list of admins in the GitHub organization.\n2. Verifies that the number of admins does not exceed the value specified in the `with.max_admins` configuration.\n\n**Evidence Requirements:**\n- Evidence must be provided by the Scribe Platform's CLI tool through scanning GitHub organization resources."
                                    },
                                    "helpUri": "https://scribe-security.netlify.app/docs/configuration/initiatives/rules/github/org/max-admins",
                                    "id": "rule-id:SSDF/PS/PS.1/PS.1.1/max-admins",
                                    "name": "Limit admins",
                                    "properties": {
                                        "control-id": "control-id:SSDF/PS/PS.1/PS.1.1",
                                        "control-name": "Store all forms of code based on the principle of least privilege",
                                        "doc-url": "https://scribe-security.netlify.app/docs/configuration/initiatives/rules/github/org/max-admins",
                                        "file-hash": "5093c9dcb056f04f20fcd1d5ca485ce2a23b404afdf9b57eb602fb330fec4a68",
                                        "labels": [
                                            "GitHub",
                                            "Organization"
                                        ],
                                        "rego-hash": "6db3e98fb06073d449477ab08f08bd7c507578d5be89c1ec74edc56c2f7e52b8",
                                        "rule-hash": "a70d1eed7c7f5da1f77a364b5b7897910ece24da6dc6301484f33b25d534a3d9",
                                        "source-url": "https://github.com/scribe-public/sample-policies/blob/v2/v2/rules/github/org/max-admins.yaml",
                                        "tags": [
                                            "GitHub",
                                            "Organization"
                                        ]
                                    },
                                    "shortDescription": {
                                        "markdown": "PS.1 Restrict the maximum number of organization admins",
                                        "text": "PS.1 Restrict the maximum number of organization admins"
                                    }
                                },
                                {
                                    "defaultConfiguration": {
                                        "level": "error",
                                        "parameters": {
                                            "evidence": {
                                                "Match": {
                                                    "content_body_type": "generic",
                                                    "labels": [
                                                        "platform=github",
                                                        "asset_type=organization",
                                                        "{{- if eq (index .Context \"asset_type\") \"organization\" -}} {{- asset_on_target (index .Context \"asset_name\") -}} {{- else -}} {{- asset_on_target nil -}} {{- end -}}"
                                                    ],
                                                    "predicate_type": "http://scribesecurity.com/evidence/discovery/v0.1",
                                                    "signed": false,
                                                    "target_type": "data"
                                                }
                                            },
                                            "input-args": {
                                                "desired_value": true
                                            }
                                        },
                                        "rank": -1
                                    },
                                    "fullDescription": {
                                        "markdown": "This rule checks if the `web_commit_signoff` setting is enabled to ensure all web-based commits are signed off.\nIt performs the following steps:\n\n1. Checks the web commit signoff settings of the GitHub organization.\n2. Verifies that the web commit signoff setting is enabled.\n\n**Evidence Requirements:**\n- Evidence must be provided by the Scribe Platform's CLI tool through scanning GitHub organization resources.\n\n### Mitigation\nEnsure that the Web Commit Signoff setting under the GitHub organization is enabled to require signoff on all web-based commits, enhancing security and accountability.",
                                        "text": "This rule checks if the `web_commit_signoff` setting is enabled to ensure all web-based commits are signed off.\nIt performs the following steps:\n\n1. Checks the web commit signoff settings of the GitHub organization.\n2. Verifies that the web commit signoff setting is enabled.\n\n**Evidence Requirements:**\n- Evidence must be provided by the Scribe Platform's CLI tool through scanning GitHub organization resources.\nMitigation: Ensure that the Web Commit Signoff setting under the GitHub organization is enabled to require signoff on all web-based commits, enhancing security and accountability."
                                    },
                                    "guid": "34acfba7-fcb7-5bc6-acef-10ed2992e32e",
                                    "help": {
                                        "markdown": "This rule checks if the `web_commit_signoff` setting is enabled to ensure all web-based commits are signed off.\nIt performs the following steps:\n\n1. Checks the web commit signoff settings of the GitHub organization.\n2. Verifies that the web commit signoff setting is enabled.\n\n**Evidence Requirements:**\n- Evidence must be provided by the Scribe Platform's CLI tool through scanning GitHub organization resources.",
                                        "text": "This rule checks if the `web_commit_signoff` setting is enabled to ensure all web-based commits are signed off.\nIt performs the following steps:\n\n1. Checks the web commit signoff settings of the GitHub organization.\n2. Verifies that the web commit signoff setting is enabled.\n\n**Evidence Requirements:**\n- Evidence must be provided by the Scribe Platform's CLI tool through scanning GitHub organization resources."
                                    },
                                    "helpUri": "https://scribe-security.netlify.app/docs/configuration/initiatives/rules/github/org/web-commit-signoff",
                                    "id": "rule-id:SSDF/PS/PS.1/PS.1.1/web-commit-signoff",
                                    "name": "Require signoff on web commits",
                                    "properties": {
                                        "control-id": "control-id:SSDF/PS/PS.1/PS.1.1",
                                        "control-name": "Store all forms of code based on the principle of least privilege",
                                        "doc-url": "https://scribe-security.netlify.app/docs/configuration/initiatives/rules/github/org/web-commit-signoff",
                                        "file-hash": "4c895ffaa308b4090cd047a494ddaa61d4f1ad9053fd51dacc0e9987655341b8",
                                        "labels": [
                                            "GitHub",
                                            "Organization"
                                        ],
                                        "rego-hash": "56fea30cb520fff9d9d32ba0926857b521d8e1b5b971d081b0283ea2ae206fd8",
                                        "rule-hash": "513a2bafa4019e6f0392af565698c87fa79af5f59fa540b99510f101001179f5",
                                        "source-url": "https://github.com/scribe-public/sample-policies/blob/v2/v2/rules/github/org/web-commit-signoff.yaml",
                                        "tags": [
                                            "GitHub",
                                            "Organization"
                                        ]
                                    },
                                    "shortDescription": {
                                        "markdown": "PS.1 Require contributors to sign when committing to Github through the web interface",
                                        "text": "PS.1 Require contributors to sign when committing to Github through the web interface"
                                    }
                                },
                                {
                                    "defaultConfiguration": {
                                        "level": "error",
                                        "parameters": {
                                            "evidence": {
                                                "Match": {
                                                    "content_body_type": "generic",
                                                    "labels": [
                                                        "platform=github",
                                                        "asset_type=repository",
                                                        "{{- if eq (index .Context \"asset_type\") \"repository\" -}} {{- asset_on_target (index .Context \"asset_name\") -}} {{- else -}} {{- asset_on_target nil -}} {{- end -}}"
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
                                        },
                                        "rank": -1
                                    },
                                    "fullDescription": {
                                        "markdown": "This rule ensures that branch protection is configured in the GitHub repository.\nIt performs the following steps:\n\n1. Checks the repository settings for branch protection.\n2. Verifies that the protection settings match the expected values.\n\n**Evidence Requirements:**\n- Evidence must be provided by the Scribe Platform's CLI tool through scanning GitHub repository settings.\n\n### Mitigation\nEnsure branch protection settings are correctly configured to reduce the risk of unauthorized changes.",
                                        "text": "This rule ensures that branch protection is configured in the GitHub repository.\nIt performs the following steps:\n\n1. Checks the repository settings for branch protection.\n2. Verifies that the protection settings match the expected values.\n\n**Evidence Requirements:**\n- Evidence must be provided by the Scribe Platform's CLI tool through scanning GitHub repository settings.\nMitigation: Ensure branch protection settings are correctly configured to reduce the risk of unauthorized changes."
                                    },
                                    "guid": "c925c9ec-a181-5a93-b631-72452c83fa69",
                                    "help": {
                                        "markdown": "This rule ensures that branch protection is configured in the GitHub repository.\nIt performs the following steps:\n\n1. Checks the repository settings for branch protection.\n2. Verifies that the protection settings match the expected values.\n\n**Evidence Requirements:**\n- Evidence must be provided by the Scribe Platform's CLI tool through scanning GitHub repository settings.",
                                        "text": "This rule ensures that branch protection is configured in the GitHub repository.\nIt performs the following steps:\n\n1. Checks the repository settings for branch protection.\n2. Verifies that the protection settings match the expected values.\n\n**Evidence Requirements:**\n- Evidence must be provided by the Scribe Platform's CLI tool through scanning GitHub repository settings."
                                    },
                                    "helpUri": "https://scribe-security.netlify.app/docs/configuration/initiatives/rules/github/repository/branch-protection",
                                    "id": "rule-id:SSDF/PS/PS.1/PS.1.1/branch-protection",
                                    "name": "Branch protected",
                                    "properties": {
                                        "control-id": "control-id:SSDF/PS/PS.1/PS.1.1",
                                        "control-name": "Store all forms of code based on the principle of least privilege",
                                        "doc-url": "https://scribe-security.netlify.app/docs/configuration/initiatives/rules/github/repository/branch-protection",
                                        "file-hash": "f64f1ea140ea2b0de656283bce732c7c3ce516d7d86458cdd47f7a24d0682c1b",
                                        "labels": [
                                            "GitHub",
                                            "Repository"
                                        ],
                                        "rego-hash": "76018c06ddb321ab19e9fae6d3fdf4ebd1b04f4425239c724081f6fb8d914647",
                                        "rule-hash": "f6cc83c266be32b6c998324ebb418fcf2132905593350b7aaea56f9aca8ff658",
                                        "source-url": "https://github.com/scribe-public/sample-policies/blob/v2/v2/rules/github/repository/branch-protection.yaml",
                                        "tags": [
                                            "GitHub",
                                            "Repository"
                                        ]
                                    },
                                    "shortDescription": {
                                        "markdown": "PS.1 Require branch protection for the repository",
                                        "text": "PS.1 Require branch protection for the repository"
                                    }
                                },
                                {
                                    "defaultConfiguration": {
                                        "level": "error",
                                        "parameters": {
                                            "evidence": {
                                                "Match": {
                                                    "content_body_type": "generic",
                                                    "labels": [
                                                        "platform=github",
                                                        "asset_type=repository",
                                                        "{{- if eq (index .Context \"asset_type\") \"repository\" -}} {{- asset_on_target (index .Context \"asset_name\") -}} {{- else -}} {{- asset_on_target nil -}} {{- end -}}"
                                                    ],
                                                    "predicate_type": "http://scribesecurity.com/evidence/discovery/v0.1",
                                                    "signed": false,
                                                    "target_type": "data"
                                                }
                                            },
                                            "input-args": {
                                                "desired_private": true
                                            }
                                        },
                                        "rank": -1
                                    },
                                    "fullDescription": {
                                        "markdown": "This rule ensures that the GitHub repository is private.\nIt performs the following steps:\n\n1. Checks the repository settings for privacy.\n2. Verifies that the repository is private.\n\n**Evidence Requirements:**\n- Evidence must be provided by the Scribe Platform's CLI tool through scanning GitHub repository settings.\n\n### Mitigation\nEnsures that the repository is private, reducing the risk of unauthorized access.",
                                        "text": "This rule ensures that the GitHub repository is private.\nIt performs the following steps:\n\n1. Checks the repository settings for privacy.\n2. Verifies that the repository is private.\n\n**Evidence Requirements:**\n- Evidence must be provided by the Scribe Platform's CLI tool through scanning GitHub repository settings.\nMitigation: Ensures that the repository is private, reducing the risk of unauthorized access."
                                    },
                                    "guid": "4bb28598-0f5a-50d9-836d-45a1e39020ec",
                                    "help": {
                                        "markdown": "This rule ensures that the GitHub repository is private.\nIt performs the following steps:\n\n1. Checks the repository settings for privacy.\n2. Verifies that the repository is private.\n\n**Evidence Requirements:**\n- Evidence must be provided by the Scribe Platform's CLI tool through scanning GitHub repository settings.",
                                        "text": "This rule ensures that the GitHub repository is private.\nIt performs the following steps:\n\n1. Checks the repository settings for privacy.\n2. Verifies that the repository is private.\n\n**Evidence Requirements:**\n- Evidence must be provided by the Scribe Platform's CLI tool through scanning GitHub repository settings."
                                    },
                                    "helpUri": "https://scribe-security.netlify.app/docs/configuration/initiatives/rules/github/repository/repo-private",
                                    "id": "rule-id:SSDF/PS/PS.1/PS.1.1/repo-is-private",
                                    "name": "Repo private",
                                    "properties": {
                                        "control-id": "control-id:SSDF/PS/PS.1/PS.1.1",
                                        "control-name": "Store all forms of code based on the principle of least privilege",
                                        "doc-url": "https://scribe-security.netlify.app/docs/configuration/initiatives/rules/github/repository/repo-private",
                                        "file-hash": "685f36b245c750260d57d82538cb28174473655d859c676a915c89592dace8e4",
                                        "labels": [
                                            "GitHub",
                                            "Repository"
                                        ],
                                        "rego-hash": "d39b92225c2fbf94d2874c2e47cc1384175730db23ae9006404ee385f97385ff",
                                        "rule-hash": "b12031e2be3cc944fe056782649c09a3bea25d85ae220409f4310d76062d9c60",
                                        "source-url": "https://github.com/scribe-public/sample-policies/blob/v2/v2/rules/github/repository/repo-private.yaml",
                                        "tags": [
                                            "GitHub",
                                            "Repository"
                                        ]
                                    },
                                    "shortDescription": {
                                        "markdown": "PS.1 Assure the repository is private",
                                        "text": "PS.1 Assure the repository is private"
                                    }
                                },
                                {
                                    "defaultConfiguration": {
                                        "enabled": true,
                                        "level": "error",
                                        "parameters": {
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
                                        },
                                        "rank": -1
                                    },
                                    "fullDescription": {
                                        "markdown": "PS.2 Provide a mechanism to verify the integrity of the image",
                                        "text": "PS.2 Provide a mechanism to verify the integrity of the image"
                                    },
                                    "guid": "bfc20ac6-43bd-5736-ae94-424ca894da2e",
                                    "help": {
                                        "markdown": "PS.2 Provide a mechanism to verify the integrity of the image",
                                        "text": "PS.2 Provide a mechanism to verify the integrity of the image"
                                    },
                                    "helpUri": "https://scribe-security.netlify.app/docs/configuration/initiatives/rules/sbom/artifact-signed",
                                    "id": "rule-id:SSDF/PS/PS.2/PS.2.1/sbom-is-signed",
                                    "name": "Image-verifiable",
                                    "properties": {
                                        "control-id": "control-id:SSDF/PS/PS.2/PS.2.1",
                                        "control-name": "Make software integrity verification information available to software acquirers",
                                        "doc-url": "https://scribe-security.netlify.app/docs/configuration/initiatives/rules/sbom/artifact-signed",
                                        "file-hash": "97a32ff04b930f3b093d2e201585cbb7ac6ffdfd05ac8160092219d3e7cba055",
                                        "labels": [
                                            "SBOM",
                                            "Blueprint"
                                        ],
                                        "rego-hash": "bb8e7472921cf089cb03c1806690e8401d2393e0b224d62ffbab0d521c71f3ad",
                                        "rule-hash": "1b1c35c08c91266ca90211a4661146641258c4c5bae35c79d1dba4e42ce1c66d",
                                        "source-url": "https://github.com/scribe-public/sample-policies/blob/v2/v2/rules/sbom/artifact-signed.yaml",
                                        "tags": [
                                            "SBOM",
                                            "Blueprint"
                                        ]
                                    },
                                    "shortDescription": {
                                        "markdown": "PS.2 Provide a mechanism to verify the integrity of the image",
                                        "text": "PS.2 Provide a mechanism to verify the integrity of the image"
                                    }
                                },
                                {
                                    "defaultConfiguration": {
                                        "enabled": true,
                                        "level": "error",
                                        "parameters": {
                                            "evidence": {
                                                "filter-by": [
                                                    "product",
                                                    "target"
                                                ],
                                                "Match": {
                                                    "content_body_type": "slsa",
                                                    "labels": null,
                                                    "signed": false
                                                }
                                            },
                                            "input-args": {}
                                        },
                                        "rank": -1
                                    },
                                    "fullDescription": {
                                        "markdown": "PS.3 Provenance exists\nEnsure that provenance information is available for each software release\n\n\n### Mitigation\nRecording comprehensive provenance metadata allows organizations to verify the integrity of the build process and ensures that only authorized and untampered artifacts are deployed.",
                                        "text": "PS.3 Provenance exists\nEnsure that provenance information is available for each software release\n\nMitigation: Recording comprehensive provenance metadata allows organizations to verify the integrity of the build process and ensures that only authorized and untampered artifacts are deployed."
                                    },
                                    "guid": "ee86e0b5-fce6-57d7-8340-b4e0400a4257",
                                    "help": {
                                        "markdown": "PS.3 Provenance exists\nEnsure that provenance information is available for each software release\n",
                                        "text": "PS.3 Provenance exists\nEnsure that provenance information is available for each software release\n"
                                    },
                                    "helpUri": "https://slsa.dev/spec/v1.0/requirements",
                                    "id": "rule-id:SSDF/PS/PS.3/PS.3.1/provenance-exists",
                                    "name": "Provenance exists",
                                    "properties": {
                                        "control-id": "control-id:SSDF/PS/PS.3/PS.3.1",
                                        "control-name": "Securely archive the necessary files and supporting data to be retained for each software release",
                                        "doc-url": "https://scribe-security.netlify.app/docs/configuration/initiatives/rules/slsa/l1-provenance-exists",
                                        "file-hash": "f33680678db455905d921dbb799e84077db4136f20bd39696f5ba38dff8ac62b",
                                        "help-uri": "https://slsa.dev/spec/v1.0/requirements",
                                        "labels": [
                                            "SLSA"
                                        ],
                                        "rego-hash": "2d2a69a6f9325a7eb60862a84a791ce1d2209b213840d4431d810da290227121",
                                        "rule-hash": "49632226ef0db07882bc5ec0e29749bfd57d967fda1400ea5ade54646fd22482",
                                        "source-url": "https://github.com/scribe-public/sample-policies/blob/v2/v2/rules/slsa/l1-provenance-exists.yaml",
                                        "tags": [
                                            "SLSA"
                                        ]
                                    },
                                    "shortDescription": {
                                        "markdown": "PS.3 Provenance exists\nEnsure that provenance information is available for each software release\n",
                                        "text": "PS.3 Provenance exists\nEnsure that provenance information is available for each software release\n"
                                    }
                                },
                                {
                                    "defaultConfiguration": {
                                        "enabled": true,
                                        "level": "error",
                                        "parameters": {
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
                                        },
                                        "rank": -1
                                    },
                                    "fullDescription": {
                                        "markdown": "PS.3 Archive SBOM",
                                        "text": "PS.3 Archive SBOM"
                                    },
                                    "guid": "3e48369b-35d6-5726-aa74-3f03bfaa526f",
                                    "help": {
                                        "markdown": "PS.3 Archive SBOM",
                                        "text": "PS.3 Archive SBOM"
                                    },
                                    "helpUri": "https://scribe-security.netlify.app/docs/configuration/initiatives/rules/sbom/artifact-signed",
                                    "id": "rule-id:SSDF/PS/PS.3/PS.3.2/sbom-is-signed",
                                    "name": "SBOM archived",
                                    "properties": {
                                        "control-id": "control-id:SSDF/PS/PS.3/PS.3.2",
                                        "control-name": "Collect, safeguard, maintain, and share provenance data for all components of each software release",
                                        "doc-url": "https://scribe-security.netlify.app/docs/configuration/initiatives/rules/sbom/artifact-signed",
                                        "file-hash": "97a32ff04b930f3b093d2e201585cbb7ac6ffdfd05ac8160092219d3e7cba055",
                                        "labels": [
                                            "SBOM",
                                            "Blueprint"
                                        ],
                                        "rego-hash": "bb8e7472921cf089cb03c1806690e8401d2393e0b224d62ffbab0d521c71f3ad",
                                        "rule-hash": "0f5245e0d08f8d1a31af2b943d67fb31a0daa336111cd65e3fae52d3f4317c68",
                                        "source-url": "https://github.com/scribe-public/sample-policies/blob/v2/v2/rules/sbom/artifact-signed.yaml",
                                        "tags": [
                                            "SBOM",
                                            "Blueprint"
                                        ]
                                    },
                                    "shortDescription": {
                                        "markdown": "PS.3 Archive SBOM",
                                        "text": "PS.3 Archive SBOM"
                                    }
                                }
                            ],
                            "semanticVersion": "1.5.18-3",
                            "version": "1.5.18-3"
                        },
                        "extensions": [
                            {
                                "contents": [
                                    "localizedData",
                                    "nonLocalizedData"
                                ],
                                "guid": "9d2a317f-93c1-5a37-b08d-21362788ca2c",
                                "informationUri": "https://csrc.nist.gov/pubs/sp/800/218/final",
                                "language": "en-US",
                                "locations": [
                                    {
                                        "index": -1,
                                        "uri": "https://github.com/scribe-public/sample-policies/blob/v2/v2/initiatives/ssdf.yaml"
                                    }
                                ],
                                "name": "SSDF Client Initiative",
                                "properties": {
                                    "doc-url": "https://scribe-security.netlify.app/docs/configuration/initiatives/ssdf",
                                    "help-uri": "https://csrc.nist.gov/pubs/sp/800/218/final",
                                    "initiative-hash": "d9e4049ae300a219f21eb55047c4461f3bec75bf914e84742cb18a28e29c2ca2",
                                    "initiative-id": "SSDF",
                                    "initiative-name": "SSDF Client Initiative",
                                    "report-version": "2.0.0",
                                    "source-url": "https://github.com/scribe-public/sample-policies/blob/v2/v2/initiatives/ssdf.yaml"
                                },
                                "shortDescription": {
                                    "markdown": "Evaluate PS rules from the SSDF initiative",
                                    "text": "Evaluate PS rules from the SSDF initiative"
                                },
                                "version": "1.0.0"
                            }
                        ]
                    }
                }
            ],
            "properties": {}
        }
    }
}
```

</details>
