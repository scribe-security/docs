<p><a target="_blank" href="https://app.eraser.io/workspace/ifENA1nEQHHMPYTMXX6p" id="edit-in-eraser-github-link"><img alt="Edit in Eraser" src="https://firebasestorage.googleapis.com/v0/b/second-petal-295822.appspot.com/o/images%2Fgithub%2FOpen%20in%20Eraser.svg?alt=media&amp;token=968381c8-a7e7-472a-8ed6-4a6626da5501"></a></p>

---

## sidebar_label: "Basic examples"
title: "Basic examples"
sidebar_position: 7
toc_min_heading_level: 2
toc_max_heading_level: 5
 Docker built image 

Create SLSA Provenance for image built by local docker `image_name:latest` image.

```bash
docker build . -t image_name:latest
valint slsa image_name:latest
```
 Private registry image 

Create SLSA Provenance for images hosted by a private registry.

>  `docker login` command is required to enable access the private registry. 

```bash
docker login
valint slsa scribesecurity.jfrog.io/scribe-docker-local/example:latest
```
 Include specific environment 

Custom env added to SLSA Provenance internal parameters.

```bash
export test_env=test_env_value
valint slsa busybox:latest --env test_env
```
 Include ALL environment 

ALL environment added to SLSA Provenance.

```bash
export test_env=test_env_value
valint slsa busybox:latest --all-env
```
 Custom evidence location 

Use flags `--output-directory` or `--output-file` flags to set the default location.

```bash
# Save evidence to custom path
valint slsa busybox:latest --output-file my_slsa_provenance.json
ls -lh my_slsa_provenance.json

# Change evidence cache directory 
valint slsa busybox:latest --output-directory ./my_evidence_cache
ls -lhR my_evidence_cache
```
 Docker archive image 

Create SLSA Provenance for local `docker save ...` output.

```bash
docker save busybox:latest -o busybox_archive.tar
valint slsa docker-archive:busybox_archive.tar
```
 Directory target 

Create SLSA Provenance for a local directory.

```bash
mkdir testdir
echo "test" > testdir/test.txt

valint slsa dir:testdir
```
 Git target 

Create SLSA Provenance for `mongo-express` remote git repository.

```bash
valint slsa git:https://github.com/mongo-express/mongo-express.git
```
Create SLSA Provenance for `yourrepository` local git repository.

```bash
git clone https://github.com/yourrepository.git
valint slsa git:yourrepository
```
 Public registry image 

Create SLSA Provenance for remote `busybox:latest` image.

```bash
valint slsa busybox:latest
```
 Attest target 

Create and sign SLSA Provenance for target. 


>  By default, _Valint_ is using [﻿Sigstore](https://www.sigstore.dev/) interactive flow as the engine behind the signing mechanism. 

```bash
valint slsa busybox:latest -o attest
```
 Attest and verify image target 

Generating and verifying SLSA Provenance `attestation` for image target `busybox:latest`.

>  By default, _Valint_ is using [﻿Sigstore](https://www.sigstore.dev/) interactive flow as the engine behind the signing mechanism. 

```bash
# Create SLSA Provenance attestations
valint slsa busybox:latest -vv -o attest

# Verify SLSA Provenance attestations
valint verify busybox:latest -i attest-slsa
```
 Attest and verify Git repository target 

Generating and verifying `statements` for remote git repo target `https://github.com/mongo-express/mongo-express.git`.

```bash
valint slsa git:https://github.com/mongo-express/mongo-express.git -o attest
valint verify git:https://github.com/mongo-express/mongo-express.git
```
Or for a local repository

```bash
# Cloned a local repository
git clone https://github.com/mongo-express/mongo-expressvalint ver.git

# Create CycloneDX SLSA Provenance attestations
valint slsa git:./mongo-express -o attest

# Verify CycloneDX SLSA Provenance attestations
valint verify git:./mongo-express -i attest-slsa
```
 Store evidence on OCI 

Store any evidence on any OCI registry. 

Support storage for all targets and both SLSA Provenance and SLSA evidence formats.

>  Use `-o`, `--format` to select between supported formats. 

Write permission to `--oci-repo` value is required.  

```bash
# Login to registry
docker login $

# Generate and push evidence to registry
valint slsa [target] -o [attest, statement] --oci --oci-repo $REGISTRY_URL

# Pull and validate evidence from registry
valint verify [target] -i [attest-slsa, statement-slsa] --oci --oci-repo $REGISTRY_URL -f
```
>  Note `-f` in the verification command, which skips the local cache evidence lookup. 

 Store evidence on Scribe service 

Store any evidence on any Scribe service. 

Support storage for all targets and both SLSA Provenance and SLSA evidence formats.

>  Use `-o`, `--format` to select between supported formats. 

Credentials for Scribe API is required.  

```bash
# Set Scribe credentials
export SCRIBE_TOKEN=**

# Generate and push evidence to registry
valint slsa [target] -o [attest, statement] --f -E \
  -P $SCRIBE_TOKEN

# Pull and validate evidence from registry
valint verify [target] -i [attest-slsa, statement-slsa] -f -E \
  -P $SCRIBE_TOKEN
```
>  Note `-f` in the verification command, which skips the local cache evidence lookup. 





<!--- Eraser file: https://app.eraser.io/workspace/ifENA1nEQHHMPYTMXX6p --->