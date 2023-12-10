---
sidebar_label: "Policy results"
title: Creating attestations out of policy results
author: Viktor Kartashov - Scribe
sidebar_position: 6
date: November 30, 2023
geometry: margin=2cm
---

# Introduction to policy results

After running the `valint verify` command, the results of policy evaluation can be stored as an in-toto statement, in-toto attestation, or a standard JSON file in SARIF format. The output is then pushed to an OCI registry and can be verified at a later time.

In this context, the in-toto statement or attestation has a predicate type of <https://scribesecurity.com/v1/policy/result/sarif/2.1.0>, target type `policy-results` and contains SARIF under `.predicate.content` path.

The pure SARIF format consists solely of the SARIF output from the policy evaluation, designed for seamless integration with other tools.

In addition to the evidence output, the results are also presented in the log as a table, providing a quick overview of both failed and passed rules.

# Creating attestations out of policy results

To save the results of policy evaluation, utilize the --push option with the valint command.

The `--format` option (or `-o` for short) is employed to specify the output format. Supported values include `attest-sarif` (or simply `attest`), `statement-sarif` (also referred to as `statement`) and `sarif` (in JSON format). The default value is set to statement.

Additionally, you have the option to save a local copy of the uploaded statement using the `--output-file /path/to/file` option.

# Tuning policy results output

It's also possible to determine how policy results are included in the output. The supported options are:

* `--push.by-rule` – aggregates all rule violations into one result per rule. By default, this option is disabled, meaning that each violation is pushed to SARIF as a separate result.
* `--push.aggregated` – includes, in addition to the existing results, one aggregated result for every rule being run. This can provide a comprehensive high-level view of all violations of underlying rules for each policy. This option is disabled by default.
