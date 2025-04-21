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
- **Name**: Hook Name.
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
  - name: "Semgrep Static Analysis"
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
These variables represent the CI and Git environment in which platforms is executed:

- `GIT_COMMIT`: Git commit SHA.
- `GIT_BRANCH`: Git branch name.
- `GIT_TAG`: Git tag, if applicable.
- `GIT_REPO`: Git repository URL.
- `GIT_REF`: Git reference.
- `BUILD_NUM`: CI build number.
- `WORKFLOW`: CI workflow name.
- `RUN_ID`: CI run identifier.
- `JOB_NAME`: CI job name.


### Adding Hooks via CLI

You can specify hooks inline when running `platforms` commands using the format:
`command::tool::parser::name`

For example, to add a Semgrep static analysis hook for GitHub:
```bash
platforms discover github \
  --repository.hooks "semgrep scan --sarif --config auto --output \$HOOK_OUTPUT_FILE"::semgrep::sarif::"Semgrep Static Analysis"
```
> Escape special chars like `$` so that the parent shell does not expand them.

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
### `platform discover` Command Hooks
| Name | ID | Type | Platform | Tool | Parser |
| --- | --- | --- | --- | --- | --- |
| Trivy Vulnerability Scan | trivy_image | repository | dockerhub | trivy | sarif |
| GitGuardian Secret Scan | ggshield_secrets | repository | github | ggshield | ggshield |
| Trivy IaC and Secrets Scan | trivy_iac_and_secrets | repository | github | trivy | trivy |

> Use `platforms discover [platform] --hook [hook_id]` to enable the hook.


### `platform bom` Command Hooks
| Name | ID | Type | Platform | Tool | Parser |
| --- | --- | --- | --- | --- | --- |
| Trivy Vulnerability Scan | trivy_image | image | dockerhub | trivy | sarif |
| GitGuardian Secret Scan | ggshield_secrets | repository | github | ggshield | ggshield |
| Gitleaks Secret Scan | gitleaks_secrets | repository | github | gitleaks | gitleaks |
| Hadolint Dockerfile Lint Scan | hadolint | repository | github | hadolint | hadolint |
| Trivy IaC and Secrets Scan | trivy_iac_and_secrets | repository | github | trivy | trivy |

> Use `platforms bom [platform] --hook [hook_id]` to enable the hook.


## Default hook Examples
<details><summary>Trivy IaC and Secrets Scan</summary>

```yaml
allow_failure: false
command: discover
id: trivy_iac_and_secrets
name: Trivy IaC and Secrets Scan
parser: trivy
platform: github
run: "trivy repository \\\n  --scanners config,secret \\\n  --exit-code 0 \\\n  --format\
  \ json \\\n  --output $HOOK_OUTPUT_FILE \\\n  $REMOTE_SOURCE_URL_WITH_TOKEN\n"
tool: trivy
type: repository
use-stdout-evidence: false
```
</details>

<details><summary>GitGuardian Secret Scan</summary>

```yaml
allow_failure: false
command: discover
id: ggshield_secrets
name: GitGuardian Secret Scan
parser: ggshield
platform: github
run: "ggshield secret scan repo \\\n  $REMOTE_SOURCE_URL_WITH_TOKEN \\\n  -o $HOOK_OUTPUT_FILE\
  \ \\\n  --format json\n"
timeout: 600
tool: ggshield
type: repository
use-stdout-evidence: true
```
</details>

<details><summary>Trivy IaC and Secrets Scan</summary>

```yaml
allow_failure: true
command: bom
id: trivy_iac_and_secrets
name: Trivy IaC and Secrets Scan
parser: trivy
platform: github
run: "trivy config \\\n  --scanners config,secret \\\n  --exit-code 0 \\\n  --format\
  \ json \\\n  --output $HOOK_OUTPUT_FILE \\\n  $LOCAL_SOURCE_DIR\n"
tool: trivy
type: repository
use-stdout-evidence: false
```
</details>

<details><summary>GitGuardian Secret Scan</summary>

```yaml
allow_failure: false
command: bom
id: ggshield_secrets
name: GitGuardian Secret Scan
parser: ggshield
platform: github
run: "ggshield secret scan repo \\\n  $LOCAL_SOURCE_DIR \\\n  -o $HOOK_OUTPUT_FILE\
  \ \\\n  --format json\n"
timeout: 600
tool: ggshield
type: repository
use-stdout-evidence: true
```
</details>

<details><summary>Hadolint Dockerfile Lint Scan</summary>

```yaml
allow_failure: false
command: bom
id: hadolint
name: Hadolint Dockerfile Lint Scan
parser: hadolint
platform: github
run: "cd \"$LOCAL_SOURCE_DIR\"\nif [ -f Dockerfile ]; then\n  echo \"Found Dockerfile,\
  \ running Hadolint\"\n  hadolint --format sarif Dockerfile > \"$HOOK_OUTPUT_FILE\"\
  \nelse\n  echo \"No Dockerfile found, skipping Hadolint\"\nfi\n"
tool: hadolint
type: repository
use-stdout-evidence: false
```
</details>

<details><summary>Gitleaks Secret Scan</summary>

```yaml
allow_failure: false
command: bom
id: gitleaks_secrets
name: Gitleaks Secret Scan
parser: gitleaks
platform: github
run: "gitleaks detect \\\n  --source \"$LOCAL_SOURCE_DIR\" \\\n  --report-path \"\
  $HOOK_OUTPUT_FILE\" \\\n  --report-format json \\\n  --redact \\\n  --verbose\n"
timeout: 600
tool: gitleaks
type: repository
use-stdout-evidence: false
```
</details>

<details><summary>Trivy Vulnerability Scan</summary>

```yaml
allow_failure: false
command: discover
id: trivy_image
name: Trivy Vulnerability Scan
parser: sarif
platform: dockerhub
predicate-type: auto
run: "trivy image \\\n  --scanners vuln \\\n  --exit-code 0 \\\n  --format sarif \\\
  \n  --output $HOOK_OUTPUT_FILE \\\n  $REMOTE_IMAGE_REF\n"
tool: ''
type: repository
use-stdout-evidence: false
```
</details>

<details><summary>Trivy Vulnerability Scan</summary>

```yaml
allow_failure: false
command: bom
id: trivy_image
name: Trivy Vulnerability Scan
parser: sarif
platform: dockerhub
predicate-type: auto
run: "trivy image \\\n  --scanners vuln \\\n  --exit-code 0 \\\n  --format sarif \\\
  \n  --output $HOOK_OUTPUT_FILE \\\n  $REMOTE_IMAGE_REF\n"
tool: ''
type: image
use-stdout-evidence: false
```
</details>

## General hook Examples
<details><summary>CodeQL Static Analysis Scan</summary>

```yaml
allow_failure: false
command: bom
disable: false
name: CodeQL Static Analysis Scan
parser: ''
platform: github
run: "/platforms/codeql/codeql database create /tmp/db \\\n  --language=javascript\
  \ \\\n  --source-root=$LOCAL_SOURCE_DIR \\\n  --threads=4 || true\n\n/platforms/codeql/codeql\
  \ database analyze /tmp/db \\\n  --format=sarifv2.1.0 \\\n  --output=$HOOK_OUTPUT_FILE\
  \ \\\n  --threads=4\n"
tool: codeql
type: repository
use-stdout-evidence: true
```
</details>

<details><summary>Grype Vulnrability Scan</summary>

```yaml
allow_failure: true
command: bom
disable: false
name: Grype Vulnrability Scan
parser: anchoregrype
platform: dockerhub
run: 'grype $REMOTE_IMAGE_REF --output json --file $HOOK_OUTPUT_FILE

  '
tool: grype
type: image
use-stdout-evidence: false
```
</details>


<!-- { "object-type": "command-output-end" } -->


Example:
```bash
docker run -it scribesecurity/platforms:latest discover github --hook trivy_iac_and_secrets_remote
```

## Evidence from Hooks
Hook-generated evidence is automatically attached to assets and included in Scribe's attestation store, enabling comprehensive security analysis and policy evaluation.

