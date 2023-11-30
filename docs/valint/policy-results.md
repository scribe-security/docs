---
sidebar_label: "Policy results"
title: Creating attestations out of policy results
author: Viktor Kartashov - Scribe
sidebar_position: 6
date: November 30, 2023
geometry: margin=2cm
---

# Introduction to policy results

Policy evaluation results can be stored to an in-toto statement, in-toto attestation or a regular JSON file in SARIF format. The output is pushed to an OCI registry and can be verified later.
In-toto statement or attestation in this case has predicate type of `https:/scribesecurity.com/v1/policy/result/sarif/2.1.0` and has SARIF under `.predicate.content` path.  
Pure SARIF format contains just the SARIF output of the policy evaluation ready for consumption by other tools.

In addition to the evidence output, the result is also printed to the log as a table, which gives a quick overview of failed and passed rules.

# Creating attestations out of policy results

To save the policy evaluation results, use the `--push` option for `valint`.

The `--format` (or simply `-o`) option is used to specify the output format. Supported values are `attest-sarif` (or simply `attest`), `statement-sarif` (also known as `statement`) and `sarif` (`json`). Default value is `statement`.

One can also save a copy of uploaded statement locally using `--output-file /path/to/file` option.

# Tuning policy results output

It's also possible to decide how the policy results are included to the output. Supported options are:

* `--push.by-rule` -- aggregate all rule violations in one result per rule. By default, this options is disabled, which means that each violation is pushed to SARIF as a separate result.
* `--push.aggregated` -- in addition to the existing results, include one aggregated result for every rule being run. It can give a complex high-level view on all violations of all underlying rules for each policy. This option is disabled by default.
