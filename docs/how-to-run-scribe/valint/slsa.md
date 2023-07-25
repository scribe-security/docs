---
title: SLSA
author: mikey strauss - Scribe
date: April 5, 2021
geometry: margin=2cm
---

Valint is a powerful tool that validates the integrity of your **supply chain**, providing organizations with a way to enforce `policies` using the Scribe Service, CI, or admission controller. 
It also provides a mechanism for compliance and transparency, both within the organization and with external parties.
 
By managing `evidence` generation, storage and validation, Valint ensures that your organization's `policies` are enforced throughout the supply chain. <br />
You can store evidence locally or in any OCI registry, as well as using the Scribe Service for storage.

In addition to evidence management, Valint also **generates** evidence for a range of targets, including directories, file artifacts, images, and git repositories. It supports two types of evidence: **CycloneDX SLSA Provenances** and **SLSA provenance**. With Valint, you can sign and verify artifacts against their origin and signer identity in the supply chain.

Valint also enables you to **generate** any 3rd party report, scan or configuration (any file) into evidence using the **Generic evidence** subtype. Enabling compliance requirements to refer and attest to your custom needs.


### Evidence formats
Valint supports the following evidence formats.

| Format | alias | Description | signed |
| --- | --- | --- | --- |
| statement-slsa | statement | In-toto SLSA Provenance Statement | no |
| attest-slsa | attest | In-toto SLSA Provenance Attestation | yes |


### SLSA Provenance
SLSA Provenance includes verifiable information about software artifacts describing where, when and how something was produced.
It is required for SLSA compliance level 2 and above.

See details [SLSA provenance spec](http://slsa.dev/provenance/v0.2)
See details [SLSA requirements](http://slsa.dev/spec/v0.1/requirements)



### Evidence Stores
Each Evidence store can be used to store, find and download evidence, which unifies all the evidence collected from the supply chain into a unified system.

### Scribe Evidence store
Scribe evidence store allows you to store evidence using scribe Service.

Related Flags:
> Note the flag set:
>* `-U`, `--scribe.client-id`
>* `-P`, `--scribe.client-secret`
>* `-E`, `--scribe.enable`

### Before you begin
Integrating Scribe Hub with your environment requires the following credentials that are found on the **Integrations** page. (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **integrations**)

* **Client ID**
* **Client Secret**

<img src='../../../img/ci/integrations-secrets.jpg' alt='Scribe Integration Secrets' width='70%' min-width='400px'/>

### Usage
```bash
# Generating evidence, storing in scribe service.
valint slsa [target] -o [attest, statement] \
  -E \
  -U [SCRIBE_CLIENT_ID] \
  -P [SCRIBE_CLIENT_SECRET]

# Verifying evidence, pulling attestation from scribe service.
valint verify [target] -i [attest-slsa, statement-slsa] \
  -E \
  -U [SCRIBE_CLIENT_ID] \
  -P [SCRIBE_CLIENT_SECRET]
```


### OCI Evidence store
Admission supports both storage and verification flows for `attestations` and `statement` objects utilizing OCI registry as an evidence store.

Using OCI registry as an evidence store allows you to upload, download and verify evidence across your supply chain in a seamless manner.

Related flags:
* `--oci` Enable OCI store.
* `--oci-repo` - Evidence store location.


### Docker hub limitation
Docker hub does not support the subpath format, `oci-repo` should be set to your Docker hub Username.

> Some registries like Jfrog allow multi layer format for repo names such as , `my_org.jfrog.io/policies/attestations`.

### OCI Repo flag
`oci-repo` setting indicates the location in a registry under which the evidence are stored.
It must be a dedicated location in an OCI registry.
for example, `scribesecuriy.jfrog.io/my_docker-registry/evidence`.

### Before you begin
Evidence can be stored in any accusable registry.
* Write access is required for upload (generate).
* Read access is required for download (verify).

You must first log in with the required access privileges to your registry before calling Valint.
For example, using the `docker login` command.

### Usage
```bash
# Generating evidence, storing on [my_repo] OCI repo.
valint slsa [target] -o [attest, statement] --oci --oci-repo=[my_repo]

# Verifying evidence, pulling attestation from [my_repo] OCI repo.
valint verify [target] -i [attest-slsa, statement-slsa] --oci --oci-repo=[my_repo]
```

> For image targets **only** you may attach the evidence in the same repo as the image.

```bash
valint slsa [image] -o [attest, statement] --oci

valint verify [image] -i [attest-slsa, statement-slsa] --oci
```

> For related Cosign support, see [cosign](#-cosign-support) section.

### Cache Evidence store
Valint supports both storage and verification flows for `attestations` and `statement` objects utilizing a local directory as an evidence store.
This is the simplest form and is mainly used to cache previous evidence creation. 

Related flags:
* `--cache-enable`
* `--output-directory`
* `--force`

> By default, this cache store enabled, disable by using `--cache-enable=false`

### Usage
```bash
# Generating evidence, storing on [my_dir] local directory.
valint slsa [target] -o [attest, statement] --output-directory=[my_dir]

# Verifying evidence, pulling attestation from [my_dir] local directory.
valint verify [target] -i [attest-slsa, statement-slsa] --output-directory=[my_dir]
```

> By default, the evidence is written to `~/.cache/valint/`, use `--output-file` or `-d`,`--output-directory` to customize the evidence output location. 



## Basic examples
<details>
  <summary>  Docker built image </summary>

Create SLSA Provenance for image built by local docker `image_name:latest` image.

```bash
docker build . -t image_name:latest
valint slsa image_name:latest
``` 
</details>

<details>
  <summary>  Private registry image </summary>

Create SLSA Provenance for images hosted by a private registry.

> `docker login` command is required to enable access the private registry.

```bash
docker login
valint slsa scribesecuriy.jfrog.io/scribe-docker-local/stub_remote:latest
```
</details>

<details>
  <summary>  Include specific environment </summary>

Custom env added to SLSA Provenance internal parameters.

```bash
export test_env=test_env_value
valint slsa busybox:latest --env test_env 
```

</details>

<details>
  <summary>  Include ALL environment </summary>

ALL environment added to SLSA Provenance.

```bash
export test_env=test_env_value
valint slsa busybox:latest --all-env
```

</details>


<details>
  <summary> Custom evidence location </summary>

Use flags `--output-directory` or `--output-file` flags to set the default location.

```bash
# Save evidence to custom path
valint slsa busybox:latest --output-file my_slsa_provenance.json
ls -lh my_slsa_provenance.json

# Change evidence cache directory 
valint slsa busybox:latest --output-directory ./my_evidence_cache
ls -lhR my_evidence_cache
``` 
</details>

<details>
  <summary> Docker archive image  </summary>

Create SLSA Provenance for local `docker save ...` output.

```bash
docker save busybox:latest -o busybox_archive.tar
valint slsa docker-archive:busybox_archive.tar
``` 
</details>

<details>
  <summary> Directory target  </summary>

Create SLSA Provenance for a local directory.

```bash
mkdir testdir
echo "test" > testdir/test.txt

valint slsa dir:testdir
``` 
</details>


<details>
  <summary> Git target  </summary>

Create SLSA Provenance for `mongo-express` remote git repository.

```bash
valint slsa git:https://github.com/mongo-express/mongo-express.git
``` 

Create SLSA Provenance for `yourrepository` local git repository.

```bash
git clone https://github.com/yourrepository.git
valint slsa git:yourrepository
``` 

</details>

<details>
  <summary>  Public registry image  </summary>

Create SLSA Provenance for remote `busybox:latest` image.

```bash
valint slsa busybox:latest
``` 

</details>

<details>
  <summary> Attest target </summary>

Create and sign SLSA Provenance for target. <br />

> By default, *Valint* is using [Sigstore](https://www.sigstore.dev/ "Sigstore") interactive flow as the engine behind the signing mechanism.

```bash
valint slsa busybox:latest -o attest
``` 
</details>

<details>
  <summary> Attest and verify image target </summary>

Generating and verifying SLSA Provenance `attestation` for image target `busybox:latest`.

> By default, *Valint* is using [Sigstore](https://www.sigstore.dev/ "Sigstore") interactive flow as the engine behind the signing mechanism.

```bash
# Create SLSA Provenance attestations
valint slsa busybox:latest -vv -o attest

# Verify SLSA Provenance attestations
valint verify busybox:latest -i attest-slsa
```
</details>

<details>
  <summary> Attest and verify Git repository target  </summary>

Generating and verifying `statements` for remote git repo target `https://github.com/mongo-express/mongo-express.git`.

```bash
valint slsa git:https://github.com/mongo-express/mongo-express.git -o attest
valint verify git:https://github.com/mongo-express/mongo-express.git
``` 

Or for a local repository
```bash
# Cloned a local repository
git clone https://github.com/mongo-express/mongo-express.git

# Create CycloneDX SLSA Provenance attestations
valint slsa git:./mongo-express -o attest

# Verify CycloneDX SLSA Provenance attestations
valint verify git:./mongo-express -i attest-slsa
```
</details>

<details>
  <summary> Store evidence on OCI </summary>

Store any evidence on any OCI registry. <br />
Support storage for all targets and both SLSA Provenance and SLSA evidence formats.

> Use `-o`, `--format` to select between supported formats. <br />
> Write permission to `--oci-repo` value is required. 

```bash
# Login to registry
docker login $

# Generate and push evidence to registry
valint slsa [target] -o [attest, statement] --oci --oci-repo $REGISTRY_URL

# Pull and validate evidence from registry
valint verify [target] -o [attest-slsa, statement-slsa] --oci --oci-repo $REGISTRY_URL -f
```
> Note `-f` in the verification command, which skips the local cache evidence lookup.

</details>

<details>
  <summary> Store evidence on Scribe service </summary>

Store any evidence on any Scribe service. <br />
Support storage for all targets and both SLSA Provenance and SLSA evidence formats.

> Use `-o`, `--format` to select between supported formats. <br />
> Credentials for Scribe API is required. 

```bash

# Set Scribe credentials
export SCRIBE_CLIENT_ID=**
export SCRIBE_CLIENT_SECRET=**

# Generate and push evidence to registry
valint slsa [target] -o [attest, statement] --f -E \
  -U $SCRIBE_CLIENT_ID \
  -P $SCRIBE_CLIENT_SECRET

# Pull and validate evidence from registry
valint verify [target] -i [attest-slsa, statement-slsa] -f -E \
  -U $SCRIBE_CLIENT_ID \
  -P $SCRIBE_CLIENT_SECRET
```

> Note `-f` in the verification command, which skips the local cache evidence lookup.

</details>