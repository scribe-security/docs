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
- **ID**: Hook identifier (defaults to the value of **Tool** if not specified).
- **Name**: Hook Name.
- **Tool**: Name of the external tool used.
- **Type**: Asset type (e.g., repository, namespace, image).
- **Platform**: Platform to execute the hook on (e.g., GitHub, Kubernetes).
- **Command**: Platform command target (e.g., `discover`, `bom`); defaults to `discover`.
- **Parser**: Output format parser (e.g., JSON, SARIF).
- **use-stdout-evidence**: Use the Command Stdout as evidence.
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
- `--hook`: Runs only specified hooks by tool name.
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
| KICS IaC Security Scan | kics_scan | repository | github | kics | kics |
| Trivy IaC and Secrets Scan | trivy_iac_and_secrets | repository | github | trivy | trivy |

> Use `platforms bom [platform] --hook [hook_id]` to enable the hook.


## Default hook Examples
<details>

<summary>Trivy IaC and Secrets Scan</summary>

```yaml
name: Trivy IaC and Secrets Scan
id: trivy_iac_and_secrets
type: repository
platform: github
command: discover
tool: trivy
parser: trivy
allow_failure: false
use-stdout-evidence: false
run: |
  trivy repository \
    --scanners config,secret \
    --exit-code 0 \
    --format json \
    --output $HOOK_OUTPUT_FILE \
    $REMOTE_SOURCE_URL_WITH_TOKEN
```
</details>

<details>

<summary>GitGuardian Secret Scan</summary>

```yaml
name: GitGuardian Secret Scan
id: ggshield_secrets
type: repository
platform: github
command: discover
tool: ggshield
parser: ggshield
allow_failure: false
use-stdout-evidence: true
timeout: 600
run: |
  ggshield secret scan repo \
    $REMOTE_SOURCE_URL_WITH_TOKEN \
    -o $HOOK_OUTPUT_FILE \
    --format json
```
</details>

<details>

<summary>Trivy IaC and Secrets Scan</summary>

```yaml
name: Trivy IaC and Secrets Scan
id: trivy_iac_and_secrets
type: repository
platform: github
command: bom
tool: trivy
parser: trivy
allow_failure: true
use-stdout-evidence: false
run: |
  trivy config \
    --scanners config,secret \
    --exit-code 0 \
    --format json \
    --output $HOOK_OUTPUT_FILE \
    $LOCAL_SOURCE_DIR
```
</details>

<details>

<summary>GitGuardian Secret Scan</summary>

```yaml
name: GitGuardian Secret Scan
id: ggshield_secrets
type: repository
platform: github
command: bom
tool: ggshield
parser: ggshield
allow_failure: false
use-stdout-evidence: true
timeout: 600
run: |
  ggshield secret scan repo \
    $LOCAL_SOURCE_DIR \
    -o $HOOK_OUTPUT_FILE \
    --format json
```
</details>

<details>

<summary>Hadolint Dockerfile Lint Scan</summary>

```yaml
name: Hadolint Dockerfile Lint Scan
id: hadolint
type: repository
platform: github
command: bom
tool: hadolint
parser: hadolint
allow_failure: false
use-stdout-evidence: false
run: |
  cd "$LOCAL_SOURCE_DIR"
  if [ -f Dockerfile ]; then
    echo "Found Dockerfile, running Hadolint"
    hadolint --format sarif Dockerfile > "$HOOK_OUTPUT_FILE"
  else
    echo "No Dockerfile found, skipping Hadolint"
  fi
```
</details>

<details>

<summary>Gitleaks Secret Scan</summary>

```yaml
name: Gitleaks Secret Scan
id: gitleaks_secrets
type: repository
platform: github
command: bom
tool: gitleaks
parser: gitleaks
allow_failure: false
use-stdout-evidence: false
timeout: 600
run: |
  gitleaks detect \
    --source "$LOCAL_SOURCE_DIR" \
    --report-path "$HOOK_OUTPUT_FILE" \
    --report-format json \
    --redact \
    --verbose
```
</details>

<details>

<summary>KICS IaC Security Scan</summary>

```yaml
name: KICS IaC Security Scan
id: kics_scan
type: repository
platform: github
command: bom
tool: kics
parser: kics
allow_failure: false
use-stdout-evidence: false
run: "kics scan \\\n  -p \"$LOCAL_SOURCE_DIR\" \\\n  -o \"$HOOK_OUTPUT_DIR\" \\\n\
  \  --output-name \"$HOOK_OUTPUT_FILE_NAME\" \\\n  --report-formats json \\\n  --no-progress\
  \ \\\n  --log-level INFO \n"
```
</details>

<details>

<summary>Trivy Vulnerability Scan</summary>

```yaml
name: Trivy Vulnerability Scan
id: trivy_image
type: repository
platform: dockerhub
command: discover
tool: ''
parser: sarif
allow_failure: false
use-stdout-evidence: false
predicate-type: auto
run: |
  trivy image \
    --scanners vuln \
    --exit-code 0 \
    --format sarif \
    --output $HOOK_OUTPUT_FILE \
    $REMOTE_IMAGE_REF
```
</details>

<details>

<summary>Trivy Vulnerability Scan</summary>

```yaml
name: Trivy Vulnerability Scan
id: trivy_image
type: image
platform: dockerhub
command: bom
tool: ''
parser: sarif
allow_failure: false
use-stdout-evidence: false
predicate-type: auto
run: |
  trivy image \
    --scanners vuln \
    --exit-code 0 \
    --format sarif \
    --output $HOOK_OUTPUT_FILE \
    $REMOTE_IMAGE_REF
```
</details>

## General hook Examples
<details>

<summary>CodeQL Static Analysis Scan</summary>

```yaml
name: CodeQL Static Analysis Scan
type: repository
platform: github
command: bom
tool: codeql
disable: false
parser: ''
allow_failure: false
use-stdout-evidence: true
run: |
  /platforms/codeql/codeql database create /tmp/db \
    --language=javascript \
    --source-root=$LOCAL_SOURCE_DIR \
    --threads=4 || true

  /platforms/codeql/codeql database analyze /tmp/db \
    --format=sarifv2.1.0 \
    --output=$HOOK_OUTPUT_FILE \
    --threads=4
```
</details>

<details>

<summary>Grype Vulnrability Scan</summary>

```yaml
name: Grype Vulnrability Scan
type: image
platform: dockerhub
command: bom
tool: grype
disable: false
parser: anchoregrype
allow_failure: true
use-stdout-evidence: false
run: |
  grype $REMOTE_IMAGE_REF --output json --file $HOOK_OUTPUT_FILE
```
</details>


<!-- { "object-type": "command-output-end" } -->


Example:
```bash
docker run -it scribesecurity/platforms:latest discover github --hook trivy_iac_and_secrets_remote
```

## Evidence from Hooks
Hook-generated evidence is automatically attached to assets and included in Scribe's attestation store, enabling comprehensive security analysis and policy evaluation.

