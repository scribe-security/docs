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
git clone https://github.com/mongo-express/mongo-expressvalint ver.git

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
valint verify [target] -i [attest-slsa, statement-slsa] --oci --oci-repo $REGISTRY_URL -f
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

# Reaching SLSA Levels with ```valint slsa```
​
## Background
SLSA (Supply-chain Levels for Software Artifacts) is a security framework aiming to prevent tampering, improve integrity, and secure packages and infrastructure. The core concept of SLSA is that a software artifact can be trusted only if it complies to three requirements:
1. The artifact should have a Provenance document, describing it's origin and build process (L1).
2. The Provenance documend should be trustworthy and verified downstream (L2).
3. The build system should be trustworth (L3).
​
The SLSA framework defines levels, which represent how secure the software supply chain is. These levels correspond to the level of implementation of these requirements.
​
Scribe's ```valint slsa``` command can be used to produce Provenance documents. Following we describe how to achieve SLSA levels alongside with using this tool.
​
Note: We refer here to the SLSA V1.0 framework.
​
## SLSA L1
The [requirements](https://slsa.dev/spec/v1.0/levels#build-l1) for SLSA L1 include:
- Software producer follows a consistent build process.
- Build platform automatically generates provenance describing how the artifact was built.
- Software producer distributes provenance to consumers.
​
Checklist for achieving SLSA L1:
- Build your software using a CI system. Preferably use a build script that is source-controlled.
- Activate the ```valint slsa``` command as part of your build script to create a Provenance docuement. Notice that the ```valint slsa``` command allows adding additional information to the Provenance document - on can tailor some of the content of the Provenance document to his needs.
​
## SLSA L2
The [requirements](https://slsa.dev/spec/v1.0/levels#build-l2) for SLSA L2 include:
- The SLSA L1 requirements.
- The build runs on a hosted build platform that generates and signs the provenance itself. 
- Downstream verification of provenance includes validating the authenticity of the provenance.
​
Checklist for achieving SLSA L2:
- The SLSA L1 checklist.
- Use a hosted build service (as opposed to performing a build on the developer machine).
- Create a signed Provenance document (instead of the unsigned that is enough for SLSA L1) This can be achieved by running ```valint slsa ... -o attest```. Regarding signing key management see [here](**** MIkey Please fill in TBDTBDTBD *****)
- Verify the authenticity of the Provenance document downstream using the ```valint verify``` command.
​
## SLSA L3
### SLSA L3 Requirements
The [requirements](https://slsa.dev/spec/v1.0/levels#build-l3) for SLSA L3 include:
- The SLSA L2 requirements.
- Build platform implements strong controls to:
    - prevent runs from influencing one another, even within the same project.
    - prevent secret material used to sign the provenance from being accessible to the user-defined build steps.
​
In addition, in order to trust the build platform, one needs to [verify the build platform](https://slsa.dev/spec/v1.0/verifying-systems). The build platform should be trusted in the sense that the Provenance document will be [unforgable](https://slsa.dev/spec/v1.0/requirements#provenance-unforgeable) and the build will be [isolated](https://slsa.dev/spec/v1.0/requirements#isolated). Such verification derives the following requirements:
- Verify the trustworthyness of the build platform itself. 
    - Such a verification should be done with the build platform vendor for SaaS CIs. In cases that the software producer is responsible for the deployment of the build system, a combination of vendor-self-attestation, and performing an analysis of the deployment aspects is recommended.
    - For example; When deploying a self-hosted CI, the vendor attestation should declare how builds are isolated from each other, and the deployment analysis should verify the access-permissions and log-auditing of the CI system. 
- Verify that the use of platform does not break the unforgability and isolation requirements.
​
​
Checklist for achieving SLSA L3:
- The SLSA L2 checklist.
- Assess the CI system. The goal is to answer the following questions:
    - in what conditions can a unauthorized entity evade the build system
    - in what conditions can build affect each other.
- Isolate the generation of the Provenance document:
    - If the build systems supports secure build runners - use a secure runner (example: [GitHub](TBD LINK ***)), 
​
    or
​
    - Separate the creation of the Provenance document to a different pipeline, preferably on a separate build service. 
        - Expose to this pipeline only the secret materials used for siging the Provenance document.
        - Either create or verify the Provenance document content on this pipeline. In the case of verifying, verify all possible fields of an in-pipeline-generated Provenance document with data collected directly from the build platform, or from other trusted sources. 
- Isolate, and verify the isolation of the build pipeline from other pipeline runs:
    - Verify not using caches, volumes shared with other pipeline runs.
    - Verify that secrets shared with other pipelines cannot allow for pipelines to affect each other.
    - Verify that pipeline runs cannot affect each other
        - example - prevent installations done through one pipeline to affect other pipeline runs. This can be done by using ephemeral build-runners (such as a containter that is created for each build), or by verifying that build-runners start each time from a predefined state.
​
These requirements are challenging and the SLSA framework specifically suggests that organizations gradually evolve from SLSA L2 to SLSA L3 compliance. 
​
To achieve SLSA L3 with Scribe tools we recommend the following:
- If the build service supports a trusted builder - use it, and use the ```valint slsa``` command to create the Provenance document.
​
Otherwise,
​
- Instrument the build pipeline for generating all attestations that will be needed to populate the Provenance document. For example, you may decide you want a list of the dependencies installed during the build. This list can be generated by a ```valint bom dir:``` command. In addition, create a Provenance attestation in the pipeline using the ```valint slsa``` command.
- Create a separete trusted-provenance-generation pipeline that will perform the following
    - Generate a trusted Proveance document, based on the one created in the build pipeline;
        - Collect data from the build service and use it to verify and update the Provenance document.
        - verify the content of attestations created in the build-pipeline. For example, verify the content of the build-runner by comparing an SBOM attastation from the build-pipeline with an SBOM attastation that was sampled separately.
        - Use attestations collected from the build pipeline to update the Provenance document.
        - Updating the Provenance document can be done using ```valint slsa``` command.
    - Verify that the build was isolated, by evaluating data collected from the build service. For example - verfy the use of caches an secrets.
​
In order to perform such data collection and evaluation, Scribe provides tools that create attestations to the build run, and perform the verifications needed. 
​
Please contact us for designing and implementing such a deployment.


# Reaching SLSA Levels with Valint SLSA

## Introduction

This section provides examples of how to use the `valint slsa` command with the Scribe tool to achieve different SLSA levels (Supply-chain Levels for Software Artifacts). The SLSA framework aims to ensure the integrity and security of software artifacts throughout the supply chain. There are three SLSA levels: L1, L2, and L3, each having specific requirements for compliance.

In the examples below, we will demonstrate how to achieve each SLSA level using the `valint slsa` command and Scribe tools. Please note that reaching SLSA L3 requires additional verification and trustworthiness of the build platform, which may involve assessing the CI system and isolation mechanisms.

### SLSA Level 1

SLSA Level 1 requires the following:

- Consistent build process.
- Provenance document describing how the artifact was built.
- Distributing provenance to consumers.

To achieve SLSA Level 1 using `valint slsa`:

```
# Run the valint slsa command on your target
valint slsa <target>
```

Where `<target>` is the name of the target object in one of the supported formats (e.g., `<image:tag>`, `<dir path>`, or `<git url>`).

### SLSA Level 2

SLSA Level 2 includes all Level 1 requirements and adds:

- The build platform generates and signs the provenance.
- Downstream verification of provenance includes validating its authenticity.

To achieve SLSA Level 2 using `valint slsa`:

```
# Create an attestation of SLSA provenance
valint slsa <target> -o attest
```


## Setting up keys for SLSA levels

### Level 2
Using x509 you can setup keys to meet the SLSA levels as following.

* Keys should be generated for each pipeline or application using `openssl` or other CA management systems.

* Place keys in a secure vault on used by your **build** pipeline, expose the proper access for each build pipeline.
* Run the following
```bash
valint slsa <target> -o attest --attest-default <x509, x509-env>`.
```

> If your using the `cache` store, store the evidence generated in your preferred storage service.

### Level 3 - coming soon


## Setting up Sigstore keys for SLSA levels

### Level 2
Using x509 you can setup keys to meet the SLSA levels as following.

* Platform or enverionment supporting the Sigstore IDPs can authticate using the 
```bash
valint slsa <target> -o attest --attest-default sigstore
```

### Level 3 - coming soon


### Attestations
In-toto Attestations are a standard that defines a way to authenticate metadata describing a set of software artifacts.
Attestations standard formalizes signing but also are intended for consumption by automated policy engines.

Default signer settings are available using `--attest.default` flag. <br />
Custom configuration by providing `cocosign` field in the [configuration](docs/configuration) or custom path using `--attest.config`.

The following table includes the supported signer types.

| Signer | default | Description | Default Description |
| --- | --- | --- | --- |
| x509 | x509 | x509 PEM file based signer | Default configuration reads keys from /etc/ |
| x509 | x509-env | x509 PEM env based signer | Default configuration reads keys from environment |
| sigstore | sigstore, sigstore-github | Sigstore signer | Default configuration refers the Sigstore public instance |
| kms | | Key management services | |

>  Using KMS is NOT recommended for SLSA, this is because KMS based signing do not includes a CA issuing certificates but rather a simpler public/private PKI, This will in turn will disable the policy to prove the identities across the supply chain.

> For spec details, see [In-toto spec](https://github.com/in-toto/attestation) <br />
> See signing details, see [attestations](docs/attestations)

### SLSA Level 3

SLSA Level 3 includes all Level 2 requirements and adds:

- The build platform implements strong controls to prevent unauthorized influence between builds.

To achieve SLSA Level 3 using `valint slsa`, it is recommended to:

- Use a trusted builder in the build pipeline (if available) or
- Instrument the build pipeline to generate attestations needed for the Provenance document.
- Create a separate trusted-provenance-generation pipeline to verify and update the Provenance document.


### Signers and Verifiers Support

#### Sigstore
Sigstore based Sigstore signer allows users to sign InToto statements using Sigstore project. It leverages OIDC connections to gain a short-lived certificate signed to your identity.

Usage example::
```
valint bom busybox:latest -o attest --attest-default=sigstore
valint verify busybox:latest --attest-default=sigstore
```

#### x509
File-based key management library, supports TPM and various key types like RSA (pss), ECDSA (p256), and ED25519.

Usage example:
```
valint bom busybox:latest -o attest --attest-default=x509
valint verify busybox:latest --attest-default=x509
```

Remember to replace <key_path>, <cert_path>, and <ca_path> with appropriate file paths for your keys and certificates.