---
title: Goreleaser
author: mikey strauss - Scribe
date: June 30, 2022
geometry: margin=2cm
---
# Goreleaser integration 🛸
Scribe tools can be integrated in to Goreleaser to generate and/or sign source,
artifacts and images. \
Integrations use the Gensbom CLI.
* Gensbom - gitHub Action for SBOM Generation (Scribe) 

## SBOM
Goreleaser provided Sbom hooks.
[Goreleaser documentation](https://goreleaser.com/customization/sbom/)

```YAML
sboms:
  - id: gensbom_source # Two different sbom configurations need two different IDs
    artifacts: <target>
    cmd: gensbom
    args: ["bom", "file:$artifact", "--output-file", "$document", "-vv", "-f"]
```
### Target Options
* `source`:   source archive
* `package`:  linux packages (deb, rpm, apk)
* `archive`:  archives from archive pipe
* `binary`:   binaries output from the build stage

# Attestation

## Artifacts
Goreleaser provided signing hooks. ]
[Goreleaser documentation](https://goreleaser.com/customization/sign/)
Note gensbom Attestations include SBOM payload.

```YAML
signs:
  - id: gensbom_all # Two different sbom configurations need two different IDs
    artifacts: all
    cmd: gensbom
    args: ["bom", "file:$artifact", "--output-file", "$signature", "-vv", "-f", "--format", "attest"]
```
Note: For Github workflows keyless flow - set env GENSBOM_ATTEST_DEFAULT=sigstore-github,  GENSBOM_BOM_CONTEXT_CONTEXT_TYPE=github 

### Target Options
* `all`: all artifacts
* `checksum`: only checksum file(s)
* `package`:  linux packages (deb, rpm, apk)
* `archive`:  archives from archive pipe
* `binary`:   binaries output from the build stage

## Image
Goreleaser provided image signing hooks.
[Goreleaser documentation](https://goreleaser.com/customization/docker_sign/)
Attestations include SBOM so there is not real need to generate both.

```YAML
docker_signs:
  - cmd: gensbom
    artifacts: images
    output: true
    args: ["bom", "${artifact}", "--output-file", "dist/{{.ProjectName}}_{{ .Tag }}.image.sbom.sig", "-vv", "-f", "--format", "attest"]
```

## Verifying target
Using gensbom you can verify the source, artifacts and images. \
Download attestation for your target. \
```shell
gensbom verify <target> -vv --external external:supply-chain-example_v1.2.23.image.sbom.sig
```

# Integrations

## Scribe service integration
Scribe provides a set of services to store,verify and manage the supply chain integrity. \
Following are some integration examples.

Scribe integrity flow - upload evidence using `gensbom` and download the integrity report using `valint`. \
You may collect evidence anywhere in your workflows.

<details>
  <summary> Github action workflow </summary>

Full workflow example of a workflow, upload evidence using gensbom and download report using valint

`release.yaml`
```YAML
name: release

on:
  push:
    tags:
      - 'v*'
    
permissions:
   contents: write
   id-token: write # Sigstore keyless signing
   packages: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - uses: actions/setup-go@v3
        with:
          go-version: 1.18
      - uses: actions/cache@v3
        with:
          path: ~/go/pkg/mod
          key: ${{ runner.os }}-go-${{ hashFiles('**/go.sum') }}
          restore-keys: |
            ${{ runner.os }}-go-

      - uses: scribe-security/actions/installer@master # installs gensbom
        env:
          ARTIFACTORY_USERNAME: ${{ secrets.registry_user }}
          ARTIFACTORY_PASSWORD: ${{ secrets.registry_pass }}

      - uses: docker/login-action@v2                   # login to ghcr
        with:
          registry: <registry_url>
          username: ${{ secrets.registry_user }}
          password: ${{ secrets.registry_pass }}

      - uses: goreleaser/goreleaser-action@v3          # run goreleaser
        with:
          version: latest
          args: release  --debug --rm-dist
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GENSBOM_SCRIBE_AUTH0_CLIENTID: ${{ secrets.registry_user }}
          GENSBOM_SCRIBE_AUTH0_CLIENTSECRET: ${{ secrets.registry_pass }}
          GENSBOM_SCRIBE_ENABLE: true

      - name: Valint - download report
        id: valint_report
        uses: scribe-security/actions/valint/report@master
        with:
          verbose: 2
          scribe-enable: true
          scribe-clientid: ${{ secrets.registry_user }}
          scribe-clientsecret: ${{ secrets.registry_pass }}

      - uses: actions/upload-artifact@v2
        with:
          name: scribe_artifact
          path: scribe/gensbom
```

`goreleaser.yaml`
```YAML

# Tool to generate SBOM and sign as attestation (In-toto)
# Examples shows SBOM generation for sources, artifacts,images.
# Examples shows signing SBOMS for sources, artifacts, images.
# Finally examples shows Scribe service integration (upload evidence)

release:
  extra_files:
    - glob: ./dist/*image*

# Note Repo showGithub actions can use Github sigstore integration for keyless flow. 
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
        

sboms:
  - id: gensbom_source
    artifacts: source
    cmd: gensbom
    args: ["bom", "file:$artifact", "--output-file", "$document", "-vv", "-f"]
    env:
      - GENSBOM_SCRIBE_URL={{ if index .Env "GENSBOM_SCRIBE_URL"  }}{{ .Env.GENSBOM_SCRIBE_URL }}{{ end }}
      - GENSBOM_SCRIBE_AUTH0_CLIENTID={{ if index .Env "GENSBOM_SCRIBE_AUTH0_CLIENTID"  }}{{ .Env.GENSBOM_SCRIBE_AUTH0_CLIENTID }}{{ end }}
      - GENSBOM_SCRIBE_AUTH0_CLIENTSECRET={{ if index .Env "GENSBOM_SCRIBE_AUTH0_CLIENTSECRET"  }}{{ .Env.GENSBOM_SCRIBE_AUTH0_CLIENTSECRET }}{{ end }}
      - GENSBOM_SCRIBE_ENABLE={{ if index .Env "GENSBOM_SCRIBE_ENABLE"  }}{{ .Env.GENSBOM_SCRIBE_ENABLE }}{{ end }}

dockers:
- image_templates:
  - 'scribesecuriy.jfrog.io/scribe-docker-public-local/supply-chain-example:latest'
  - 'scribesecuriy.jfrog.io/scribe-docker-public-local/supply-chain-example:{{ .Tag }}'
  dockerfile: Dockerfile
  build_flag_templates:
  - "--pull"
  - "--label=org.opencontainers.image.created={{.Date}}"
  - "--label=org.opencontainers.image.name={{.ProjectName}}"
  - "--label=org.opencontainers.image.revision={{.FullCommit}}"
  - "--label=org.opencontainers.image.version={{.Version}}"
  - "--label=org.opencontainers.image.source={{.GitURL}}"

# Note sbom is generated for attestations add "--format", "attest" to args
docker_signs:
  - cmd: gensbom
    artifacts: images
    output: true
    args: ["bom", "${artifact}", "--output-file", "dist/{{.ProjectName}}_{{ .Tag }}.image.sbom", "-vv", "-f"]
```
</details>

<details>
  <summary> Verify image </summary>

Env section to allow one to control the scribe login argument via env. \
You can also use configuration or arguments.
```YAML
After download image attestation (supply-chain-example_v1.2.23.image.sbom.sig) from github releases.
```shell
gensbom verify scribesecuriy.jfrog.io/scribe-docker-public-local/supply-chain-example:v1.2.23 -vv --external external:supply-chain-example_v1.2.23.image.sbom.sig
```
Output:
```log
INFO[0007] [enabled] rekorStorer, using storer          
INFO[0007] [enabled] fulcioVerifier, using verifer      
INFO[0007] Download success - Rekor Found cert, CN: sigstore-intermediate, Emails: [] 
INFO[0007] Verify success - TRUSTED signiture, Verifier trust: fulcioVerifier, CN: sigstore-intermediate, Emails: [], URIs: [https://github.com/scribe-security/supply-chain-example/.github/workflows/release.yml@refs/tags/v1.2.23] 
INFO[0007] Verify success - Rekor offline               
INFO[0007] Verify attestation success         
```
Note Github workload identity `https://github.com/scribe-security/supply-chain-example/.github/workflows/release.yml@refs/tags/v1.2.23`.

</details>

## Gensbom integration
<details>
  <summary>  source SBOM, upload scribe service </summary>

Env section to allow one to control the scribe login argument via env. \
You can also use configuration or arguments.
```YAML
sboms:
  - id: gensbom_source
    artifacts: source
    cmd: gensbom
    args: ["bom", "file:$artifact", "--output-file", "$document", "-vv", "-f"]
    env:
      - GENSBOM_SCRIBE_URL={{ if index .Env "GENSBOM_SCRIBE_URL"  }}{{ .Env.GENSBOM_SCRIBE_URL }}{{ end }}
      - GENSBOM_SCRIBE_AUTH0_CLIENTID={{ if index .Env "GENSBOM_SCRIBE_AUTH0_CLIENTID"  }}{{ .Env.GENSBOM_SCRIBE_AUTH0_CLIENTID }}{{ end }}
      - GENSBOM_SCRIBE_AUTH0_CLIENTSECRET={{ if index .Env "GENSBOM_SCRIBE_AUTH0_CLIENTSECRET"  }}{{ .Env.GENSBOM_SCRIBE_AUTH0_CLIENTSECRET }}{{ end }}
      - GENSBOM_SCRIBE_ENABLE={{ if index .Env "GENSBOM_SCRIBE_ENABLE"  }}{{ .Env.GENSBOM_SCRIBE_ENABLE }}{{ end }}
```
</details>


