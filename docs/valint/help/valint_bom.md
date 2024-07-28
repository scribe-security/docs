<p><a target="_blank" href="https://app.eraser.io/workspace/5VTUEvz4Wkj4AxoANmmE" id="edit-in-eraser-github-link"><img alt="Edit in Eraser" src="https://firebasestorage.googleapis.com/v0/b/second-petal-295822.appspot.com/o/images%2Fgithub%2FOpen%20in%20Eraser.svg?alt=media&amp;token=968381c8-a7e7-472a-8ed6-4a6626da5501"></a></p>

## valint bom
Create evidence command

### Synopsis
Collect, Create and Store evidence for artifacts (SBOMs,SLSA provenance) or any third-party tools.

```
valint bom [TARGET] [flags]
```
### Optional flags
Flags for `bom` subcommand

| Short | Long | Description | Default |
| ----- | ----- | ----- | ----- |
| -A | --attach-regex | Attach files content by regex |  |
|  | --author-email | Set author email |  |
|  | --author-name | Set author name |  |
|  | --author-phone | Set author phone |  |
|  | --components | Select sbom components groups, options=[metadata layers packages syft files dep commits] | [metadata,layers,packages,syft,dep,commits] |
| -f | --force | Force overwrite cache |  |
| -o | --format | Evidence format, options=[cyclonedx-json cyclonedx-xml attest-cyclonedx-json statement-cyclonedx-json attest-slsa statement-slsa statement-generic attest-generic] | [cyclonedx-json] |
| -h | --help | help for bom |  |
|  | --package-exclude-type | Exclude package type, options=[ruby python javascript java dpkg apk rpm go dotnet r rust binary sbom nix conan alpm cocoapods swift dart elixir php erlang github portage haskell kernel] |  |
|  | --package-group | Select package group, options=[index install all] |  |
| -t | --package-type | Select package type, options=[ruby python javascript java dpkg apk rpm go dotnet r rust binary sbom nix conan alpm cocoapods swift dart elixir php erlang github portage haskell kernel] |  |
|  | --supplier-email | Set supplier email |  |
|  | --supplier-name | Set supplier name |  |
|  | --supplier-phone | Set supplier phone |  |
|  | --supplier-url | Set supplier url |  |
### Global options flags
Flags for all `valint` subcommands

| Short | Long | Description | Default |
| ----- | ----- | ----- | ----- |
|  | --allow-expired | Allow expired certs |  |
|  | --attest.config | Attestation config path |  |
|  | --attest.default | Attestation default config, options=[sigstore sigstore-github x509 x509-env] | "sigstore" |
|  | --backoff | Backoff duration | "15s" |
|  | --ca | x509 CA Chain path |  |
|  | --cache-enable | Enable local cache | true |
|  | --cert | x509 Cert path |  |
| -c | --config | Configuration file path |  |
|  | --context-dir | Context dir |  |
| -C | --context-type | CI context type, options=[jenkins github circleci azure gitlab travis tekton bitbucket local admission] | "local" |
|  | --crl | x509 CRL path |  |
|  | --crl-full-chain | Enable Full chain CRL verfication |  |
|  | --deliverable | Mark as deliverable, options=[true, false] |  |
|  | --depth | Git clone depth |  |
|  | --disable-crl | Disable certificate revocation verificatoin |  |
| -e | --env | Environment keys to include in evidence |  |
| -F | --filter-regex | Filter out files by regex | <p>[</p><p>**/*.pyc,**</p><p>/.git/**]</p> |
|  | --filter-scope | Filter packages by scope |  |
| -G | --gate | Policy Gate name |  |
|  | --git-auth | Git repository authentication info, [format: 'username:password'] |  |
|  | --git-branch | Git branch in the repository |  |
|  | --git-commit | Git commit hash in the repository |  |
|  | --git-tag | Git tag in the repository |  |
|  | --key | x509 Private key path |  |
| -L | --label | Add Custom labels |  |
| -D | --level | Log depth level, options=[panic fatal error warning info debug trace] |  |
|  | --log-context | Attach context to all logs |  |
|  | --log-file | Output log to file |  |
|  | --oci | Enable OCI store |  |
| -R | --oci-repo | Select OCI custom attestation repo |  |
| -d | --output-directory | Output directory path | "${XDG_CACHE_HOME}/valint" |
| -O | --output-file | Output file name |  |
| -p | --pipeline-name | Pipeline name |  |
|  | --platform | Select target platform, examples=windows/armv6, arm64 ..) |  |
|  | --predicate-type | Custom Predicate type (generic evidence format) | <p>"</p><p>"</p> |
| -n | --product-key | Product Key |  |
| -V | --product-version | Product Version |  |
| -q | --quiet | Suppress all logging output |  |
|  | --rule-args | Policy arguments | [] |
| -U | --scribe.client-id | Scribe Client ID (deprecated) |  |
| -P | --scribe.client-secret | Scribe Client Token |  |
| -E | --scribe.enable | Enable scribe client |  |
| -u | --scribe.url | Scribe API Url | <p>"</p><p>"</p> |
| -s | --show | Print evidence to stdout |  |
|  | --structured | Enable structured logger |  |
|  | --timeout | Timeout duration | "120s" |
| -v | --verbose | Log verbosity level [-v,--verbose=1] = info, [-vv,--verbose=2] = debug |  |
### Examples for running `valint bom` 
```
valint bom <target>

<target> Target object name format=[<image:tag>, <dir path>, <git url>]

valint bom alpine:latest                         create default (cyclonedxjson) sbom
valint bom alpine:latest -o cyclonedxxml         create cyclonedx xml sbom
valint bom alpine:latest -o attest               create intoto attestation of cyclonedx sbom 
valint bom alpine:latest -o attest-slsa          create intoto attestation of SLSA provenance
valint bom alpine:latest                     show verbose debug information
valint bom alpine:latest -A "*/**"           collect files content in to SBOM

Supports the following image sources:
valint bom yourrepo/yourimage:tag     defaults to using images from a Docker daemon. If Docker is not present, the image is pulled directly from the registry.

You can also explicitly specify the scheme to use:
valint bom docker:yourrepo/yourimage:tag          explicitly use the Docker daemon
valint bom podman:yourrepo/yourimage:tag          explicitly use the Podman daemon
valint bom docker-archive:path/to/yourimage.tar   use a tarball from disk for archives created from "docker save"
valint bom oci-archive:path/to/yourimage.tar      use a tarball from disk for OCI archives (from Skopeo or otherwise)
valint bom dir:path/to/yourproject                read directly from a path on disk (any directory)
valint bom registry:yourrepo/yourimage:tag        pull image directly from a registry (no container runtime required)
valint bom file:path/to/yourproject/file          read directly from a path on disk (any single file)
valint bom git:path/to/yourrepository             read directly from a local repository on disk
valint bom git:https://github.com/yourrepository.git         read directly from a remote repository on git

SBOM-Example:
valint bom alpine:latest -o attest
valint bom alpine:latest -o statement

SLSA-Example:
valint bom alpine:latest -o attest-slsa
valint bom alpine:latest -o statement-slsa

Generic-Example:
valint bom file.json -o attest-slsa
valint bom file.json -o statement-slsa

Format-aliases:
* json=attest-cyclonedx-json
* predicate=predicate-cyclonedx-json
* statement=statement-cyclonedx-json
* attest=attest-cyclonedx-json
```
### SEE ALSO
- [﻿valint](valint.md)  - Validate Supply Chain Integrity




<!--- Eraser file: https://app.eraser.io/workspace/5VTUEvz4Wkj4AxoANmmE --->