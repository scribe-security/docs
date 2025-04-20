---
sidebar_label: "Using Hooks"
title: "Extending Platforms with Hooks"
sidebar_position: 2
---

# Extending Platforms with Third-Party Hooks

Hooks allow you to extend the capabilities of the `platforms` CLI by integrating third-party tools and collecting additional evidence from scanned assets.

## What are Hooks?
Hooks are user-defined scripts or commands executed during asset discovery or SBOM generation. They enable running external tools such as security scanners, vulnerability analyzers, or policy checkers, enriching the evidence gathered by `platforms`.

### Hook Configuration
Hooks are configured using a YAML file or via CLI flags. Each hook specifies:
- **Name**: Identifier for the hook.
- **Type**: Asset type (e.g., repository, namespace, image).
- **Platform**: Platform to execute the hook on (e.g., GitHub, Kubernetes).
- **Command**: Platform command target (e.g., `discover`, `bom`); defaults to `discover`.
- **Tool**: Name of the external tool used.
- **ID**: Hook identifier (defaults to the value of **Tool** if not specified).
- **Parser**: Output format parser (e.g., JSON, SARIF).
- **Run**: Command executed, using environment variables for dynamic input.

Hook configurations can be provided using the `--hook-config` flag and activated via the `--hook` flag referencing the Hook ID.

### Example Hook Configuration
```yaml
hooks:
  - name: "github_repository_static_analysis"
    type: "repository"
    platform: "github"
    command: discover
    tool: "semgrep"
    parser: "json"
    run: |
      semgrep scan --debug  --json --output $HOOK_OUTPUT_FILE $LOCAL_SOURCE_DIR 
```

To run this hook:
```bash
platforms discover github --hook-config my_hook_config.yaml --hook semgrep
```

### Supported Environment Variables
When running hooks, `platforms` provides useful environment variables:

#### Asset Information
- `ASSET_NAME`: Name of the asset being scanned.
- `ASSET_TYPE`: Type of the asset (e.g., repository, namespace).
- `HOOK_OUTPUT_FILE`: Path to save hook evidence output.
- `REMOTE_IMAGE_REF`: Reference URL for container images (available for registry platforms).
- `REMOTE_SOURCE_URL`: URL of the source repository or asset (available for SCM platforms).
- `LOCAL_SOURCE_DIR`: Local source directory (Avaliable for BOM comamnd on SCM platforms)

#### CI and Git Context
- `GIT_COMMIT`: Git commit SHA.
- `GIT_BRANCH`: Git branch name.
- `GIT_TAG`: Git tag, if applicable.
- `GIT_REPO`: Git repository URL.
- `GIT_REF`: Git reference.
- `BUILD_NUM`: CI build number.
- `WORKFLOW`: CI workflow name.
- `RUN_ID`: CI run identifier.
- `JOB_NAME`: CI job name.

## Adding Hooks via CLI
Hooks can also be specified inline when running `platforms` commands:

```bash
platforms discover github \
  --repository.hooks "semgrep scan --sarif --config auto::{tool_name}::sarif::{hook_name}" \
  --select-tool {tool_name}
```

## Controlling Hook Execution
Control hook execution with these flags:
- `--hook-config`: Specify a YAML file containing hook configurations.
- `--select-tool`: Runs only specified hooks by tool name.
- `--hook.skip`: Skips execution of hooks entirely.

## Embedded Supported Hooks
These hooks are provided by the `platforms` container along with required configurations:

<!--
{
    "command": "python scripts/hook_table.py",
    "output-format": "markdown"
}
-->
<!-- { "object-type": "command-output-start" } -->
| Name | ID | Type | Platform | Tool | Parser |
| --- | --- | --- | --- | --- | --- |
| Trivy Image Vulnrability Scan | trivy | image | dockerhub | trivy | trivy |
| Dockerhub-Scout-Policy-Scan | scout | image | dockerhub | scout |  |
| Grype Image Vulnrability Scan | grype | image | dockerhub | grype | anchoregrype |
| Bom Stage GitGuardian Secret Scan | ggshield | repository | github | ggshield | ggshield |
| Discovery Stage GitGuardian Secret Scan | ggshield | repository | github | ggshield | ggshield |


<!-- { "object-type": "command-output-end" } -->


Example:
```bash
docker run -it scribesecurity/platforms:latest discover github --hook ggshield
```

## Evidence from Hooks
Hook-generated evidence is automatically attached to assets and included in Scribe's attestation store, enabling comprehensive security analysis and policy evaluation.

