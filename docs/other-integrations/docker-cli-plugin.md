<p><a target="_blank" href="https://app.eraser.io/workspace/WkIxq1m9TeVu9dbw03sY" id="edit-in-eraser-github-link"><img alt="Edit in Eraser" src="https://firebasestorage.googleapis.com/v0/b/second-petal-295822.appspot.com/o/images%2Fgithub%2FOpen%20in%20Eraser.svg?alt=media&amp;token=968381c8-a7e7-472a-8ed6-4a6626da5501"></a></p>

# Scribe Docker CLI plugins
Scribe offers Docker CLI plugins for embedding evidence collecting and integrity verification to your workflows. 
Actions are are wrappers to provided CLI tools.
Plugins allow you to generate SBOMS as w

## Install
Scribe install script will install scribe docker CLI scripts 

```
curl -sSfL https://raw.githubusercontent.com/scribe-security/misc/master/docker-cli-plugin/install.sh | sh
```
## Gensbom
Gensbom is a CLI tool by Scribe which analyzes components and creates SBOMs. 
Gensbom SBOMs are populated CycloneDX SBOM with target packages, files, layers, and dependencies. 
Gensbom also supports signed SBOM as populated in-toto attestations using the cocosign framework. Scribe uses the **cocosign** library we developed to deal with digital signatures for signing and verification.

## Supported plugins
### Bom
Command analyzes image components and file systems. 
It can be used for multiple targets and output formats. 
Further more command can be used to sign the resulting sbom.

```
docker bom busybox:latest -v
```
### basic usage
Gensbom allows you to create SBOMs in multiple flavors.

 CycloneDX 

CycloneDX SBOM with all the available components.

```bash
docker bom busybox:latest -o json
docker bom busybox:latest -o xml
```
 Statement 

In-toto statement is basically an unsigned attestation.
Output can be useful if you like to connect to other attestation frameworks such as `cosign`.

```bash
docker bom busybox:latest -o statement
```
 Attestations 

In-toto Attestation output, default via keyless Sigstore flow 

```bash
docker bom busybox:latest -o attest
```
 Metadata only 

You may select which components groups are added to your SBOM.
For example you may use Gensbom to simply sign and verify your images, you only really need the `metadata` group.
Note metadata is implicate (BOM must include something).

```bash
docker bom busybox:latest --components metadata #Only include the target metadata
docker bom busybox:latest --components packages #Only include packages
docker bom busybox:latest --components packages,files,dep #Include packages files and there related relationship.
```
 Attach external data 

Gensbom allows you to include external files content as part of the reported evidence.
For example you may use Gensbom to include a external security report in your SBOM.

```bash
docker bom busybox:latest -vv -A **/some_report.json
```
### Verify
Command finds and verifies signed SBOM for image components and file systems. 
It can be used for multiple targets and output formats.

```
docker verify busybox:latest -v
```
# Scribe service
Scribe provides a set of services allowing you to secure your supply chain. 
Use configuration/args to set `scribe.client-id` (`-U`), `scribe.client-secret` (`-P`) provided by scribe.
Lastly enable scribe client using `-E` flag.
Gensbom will upload/download SBOM to your scribe account.

 Signing 

You can use scribe signing service to sign.
Scribe will sign SBOM for you and provide access to the signed attestation.
Scribe service will allow you to verify against Scribe Root CA against your account identity.
You may can use the default Scribe `cocosign` configuration flag.

**Scribe root cert <TBD public link> to verify against.**

```bash
docker bom busybox:latest -E -P ${CLIENT_TOKEN} -o attest -v
docker verify busybox:latest -E -P ${CLIENT_TOKEN} -v
```
 Integrity 

You can use scribe service run integrity policies against your evidence.

```bash
docker bom busybox:latest -E -P ${CLIENT_TOKEN} -v
```
# Dev
See details [﻿CLI documentation - dev](docs/dev) 



<!--- Eraser file: https://app.eraser.io/workspace/WkIxq1m9TeVu9dbw03sY --->