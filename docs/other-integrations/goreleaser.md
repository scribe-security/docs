
---

## title: goreleaser
geometry: margin=2cm
# Goreleaser integration 🛸
Scribe tools can be integrated in to Goreleaser to generate and/or sign source,
artifacts and images. 
Integrations requires the Valint CLI installed.

- Valint - gitHub Action for SBOM Generation (Scribe)
## Valint installation
See details [﻿CLI documentation - install ](../cli/valint/docs/installation) 

### Supported targets
- `checksum` : only checksum file(s)
- `package` : linux packages (deb, rpm, apk)
- `archive` : archives from archive pipe
- `binary` : binaries output from the build stage
- `image` : image output from build stage
# Goreleaser hooks
Sboms and attestations can be created on the your source and application artifacts.
Note Valint is used by the goreleaser sign flow hooks.

# SBOMs
Using Valint to create CycloneDX SBOMs for your project.

## Artifacts
Using Goreleaser provided signing hooks.
[﻿Goreleaser documentation](https://goreleaser.com/customization/sign/)
Note Valint Attestations include SBOM payload.

Add the following to your goreleaser config to create an SBOM for all artifacts.

```YAML
signs:
- id: sbom_all
  artifacts: all
  signature: "${artifact}.sbom"
  cmd: valint
  args: ["bom", "file:$artifact", "--output-file", "$signature", "-f"]
```
### Artifacts Options
- `all` : all artifacts
- `checksum` : only checksum file(s)
- `package` : linux packages (deb, rpm, apk)
- `archive` : archives from archive pipe
- `binary` : binaries output from the build stage
## Image
Using Goreleaser provided image signing hooks.
[﻿Goreleaser documentation](https://goreleaser.com/customization/docker_sign/)
Attestations include SBOM so there is not real need to generate both.

Add the following to your goreleaser config to create an SBOM for all image tags.

```YAML
docker_signs:
- id: sbom_image
  cmd: valint
  artifacts: images
  output: true
  args: ["bom", "${artifact}", "--output-file", "dist/{{.ProjectName}}_{{ .Tag }}.image.sbom", "-f"]
```
# Attestations
Using [﻿install the Scribe Valint plugin in your CI system](../integrating-scribe/ci-integrations/) to create in-toto attestations including a signed for your project artifacts.

## Artifacts
Using Goreleaser provided signing hooks.
[﻿Goreleaser documentation](https://goreleaser.com/customization/sign/)
Note Valint Attestations include SBOM payload.

Add the following to your goreleaser config to create an attestations for all artifacts.

```YAML
signs:
- id: attest_all
  artifacts: all
  signature: "${artifact}.sbom.sig"
  cmd: valint
  args: ["bom", "file:$artifact", "--output-file", "$signature", "-f", "--format", "attest"]
```
## Image
Using Goreleaser provided image signing hooks.
[﻿Goreleaser documentation](https://goreleaser.com/customization/docker_sign/)
Attestations include SBOM so there is not real need to generate both.

Add the following to your goreleaser config to create an attestations for all image tags.

```YAML
docker_signs:
- id: attest_image
  cmd: valint
  artifacts: images
  output: true
  args: ["bom", "${artifact}", "--output-file", "dist/{{.ProjectName}}_{{ .Tag }}.image.sbom.sig", "-f", "--format", "attest"]
```
## Verifying target
Using Valint you can verify any artifact attestations (source,binary,image etc..). 
For details signing and verification options see [﻿cocosign](https://github.com/scribe-security/cocosign) 

1. First download attestation for your target (GitHub releases). \
2. Install Valint (See CI or local installation options)
3. Run verification command (default uses Sigstore + Rekor keyless verification)
```shell
valint verify <target> --external external:<attestations path>
```
# Integrations
## Scribe service integration
Scribe provides a set of services to store,verify and manage the supply chain integrity. 
Following are some integration examples.

Scribe integrity flow - upload evidence using `valint` and download the integrity report using `valint`. \

 GitHub action workflow - SBOMS 

Full workflow example of a workflow, upload SBOM evidence on source,binaries and images using Valint and download report using Valint.

`release.yaml` 

```YAML
name: release
on:
  push:
    tags:
      - 'v*'
    
permissions:
   contents: write
   packages: write
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
            - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - uses: actions/setup-go@v3
        with:
          go-version: 1.18
      - uses: scribe-security/action-installer@master
        with:
          tools: valint
      - uses: docker/login-action@v2 
        with:
          username: ${{ secrets.registry_username }}
          password: ${{ secrets.registry_password }}

      - uses: goreleaser/goreleaser-action@v3
        id: release
        with:
          version: latest
          args: release  --debug --rm-dist
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          VALINT_SCRIBE_AUTH0_CLIENTID:  ${{ secrets.clientid }}
          VALINT_SCRIBE_AUTH0_CLIENTSECRET: ${{ secrets.clientsecret }}
          VALINT_SCRIBE_ENABLE: true
      - uses: actions/upload-artifact@v2
        with:
          name: scribe-evidence
          path: |
            scribe/valint
            ${{ steps.valint_report.outputs.OUTPUT_PATH }}
```
`goreleaser.yaml` 

```YAML
release:
  disable: true
  extra_files:
    - glob: /dist/*image*

builds:
- env:
  - CGO_ENABLED=0
  goos:
  - linux
  - darwin
  goarch:
  - amd64
  - arm64
  mod_timestamp: '{{ .CommitTimestamp }}'
  flags:
    - -trimpath
  ldflags:
    - -s -w -X main.version={{.Version}} -X main.commit={{.Commit}} -X main.date={{ .CommitDate }}

checksum:
  name_template: 'checksums.txt'

source:
  enabled: true

archives:
  - id: "{{ .ProjectName }}.tar.gz"
    name_template: '{{.ProjectName}}_{{.Version}}_{{.Os}}-{{.Arch}}'
    format_overrides:
      - goos: windows
        format: zip

signs:
  - id: sbom_all
    artifacts: all
    signature: "${artifact}.sbom"
    cmd: valint
    args: ["bom", "file:$artifact", "--output-file", "$signature", "-f"]

dockers:
- image_templates:
  - 'scribesecuriy.jfrog.io/scribe-docker-public-local/goreleaser-example:latest'
  - 'scribesecuriy.jfrog.io/scribe-docker-public-local/goreleaser-example:{{ .Tag }}'
  dockerfile: Dockerfile
  build_flag_templates:
  - "--pull"
  - "--label=org.opencontainers.image.created={{.Date}}"
  - "--label=org.opencontainers.image.name={{.ProjectName}}"
  - "--label=org.opencontainers.image.revision={{.FullCommit}}"
  - "--label=org.opencontainers.image.version={{.Version}}"
  - "--label=org.opencontainers.image.source={{.GitURL}}"

docker_signs:
  - id: sbom_image
    cmd: valint
    artifacts: images
    output: true
    args: ["bom", "${artifact}", "--output-file", "dist/{{.ProjectName}}_{{ .Tag }}.image.sbom", "-f"]
```
## Attestations
 Github action workflow - Attestations (Sigstore) 

Full workflow example of a workflow, upload attestations evidence on source,binaries and images using Valint and download report using Valint.
Note attestations use on GitHub the Sigstore-GitHub integration using the identity of the workflow and Sigstore as a CA.

`release.yaml` 

```YAML
name: release
on:
  push:
    tags:
      - 'v*'
    
permissions:
   contents: write
   packages: write
   id-token: write # Needed for sigstore-github - workload identity flow
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
            - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - uses: actions/setup-go@v3
        with:
          go-version: 1.18
      - uses: scribe-security/action-installer@master
        with:
          tools: valint
      - uses: docker/login-action@v2 
        with:
          username: ${{ secrets.registry_username }}
          password: ${{ secrets.registry_password }}

      - uses: goreleaser/goreleaser-action@v3
        id: release
        with:
          version: latest
          args: release  --debug --rm-dist
      - uses: actions/upload-artifact@v2
        with:
          name: scribe-evidence
          path: |
            scribe/valint
            ${{ steps.valint_report.outputs.OUTPUT_PATH }}
```
`goreleaser.yaml` 

```YAML
release:
  disable: true
  extra_files:
    - glob: /dist/*image*

builds:
- env:
  - CGO_ENABLED=0
  goos:
  - linux
  - darwin
  goarch:
  - amd64
  - arm64
  mod_timestamp: '{{ .CommitTimestamp }}'
  flags:
    - -trimpath
  ldflags:
    - -s -w -X main.version={{.Version}} -X main.commit={{.Commit}} -X main.date={{ .CommitDate }}

checksum:
  name_template: 'checksums.txt'

source:
  enabled: true

archives:
  - id: "{{ .ProjectName }}.tar.gz"
    name_template: '{{.ProjectName}}_{{.Version}}_{{.Os}}-{{.Arch}}'
    format_overrides:
      - goos: windows
        format: zip

signs:
  - id: attest_all
    artifacts: all
    signature: "${artifact}.sbom.sig"
    cmd: valint
    args: ["bom", "file:$artifact", "--output-file", "$signature", "-f", "--format", "attest"]

dockers:
- image_templates:
  - 'scribesecuriy.jfrog.io/scribe-docker-public-local/goreleaser-example:latest'
  - 'scribesecuriy.jfrog.io/scribe-docker-public-local/goreleaser-example:{{ .Tag }}'
  dockerfile: Dockerfile
  build_flag_templates:
  - "--pull"
  - "--label=org.opencontainers.image.created={{.Date}}"
  - "--label=org.opencontainers.image.name={{.ProjectName}}"
  - "--label=org.opencontainers.image.revision={{.FullCommit}}"
  - "--label=org.opencontainers.image.version={{.Version}}"
  - "--label=org.opencontainers.image.source={{.GitURL}}"

docker_signs:
  - id: attest_image
    cmd: valint
    artifacts: images
    output: true
    args: ["bom", "${artifact}", "--output-file", "dist/{{.ProjectName}}_{{ .Tag }}.image.sbom.sig", "-f", "--format", "attest"]
```
 Verify image - Sigstore 

Download your image attestations from your release page, verify the image against Sigstore.

```shell
valint verify scribesecurity/goreleaser-example:v1.2.23 --external external:goreleaser-example_v1.2.23.image.sbom.sig
```
Output:

```log
INFO[0007] [enabled] rekorStorer, using storer          
INFO[0007] [enabled] fulcioVerifier, using verifer      
INFO[0007] Download success - Rekor Found cert, CN: sigstore-intermediate, Emails: [] 
INFO[0007] Verify success - TRUSTED signiture, Verifier trust: fulcioVerifier, CN: sigstore-intermediate, Emails: [], URIs: [https://github.com/scribe-security/goreleaser-example/.github/workflows/release.yml@refs/tags/v1.2.23] 
INFO[0007] Verify success - Rekor offline               
INFO[0007] Verify attestation success
```
Note GitHub workload identity `https://github.com/scribe-security/goreleaser-example/.github/workflows/release.yml@refs/tags/v1.2.23`.



<!--- Eraser file: https://app.eraser.io/workspace/BlsdotlUGKoZc7igse2t --->