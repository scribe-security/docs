---
sidebar_label: "Basic examples"
title: "Basic examples"
sidebar_position: 7
toc_min_heading_level: 2
toc_max_heading_level: 5
---

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
valint slsa scribesecurity/example:latest
```
</details>

<details>
  <summary>  Create SBOM and SLSA evidence </summary>

Generate a Software Bill of Materials (SBOM) and corresponding SLSA evidence for a container image.

```bash
valint bom scribesecurity/example:latest --provenance
```

</details>

<details>
  <summary>  Create SBOM with Base Image And SLSA evidence </summary>

Generate an SBOM and corresponding SLSA evidence for a container image, including analysis of the specified base image.      

```bash
valint bom scribesecurity/example:latest --provenance --base-image ./Dockerfile
```

</details>

<details>
  <summary> Create SLSA provenance with by-product asset evidence </summary>

Generate SLSA Provenance for a container image, incorporating by-product asset evidence using the `--input` flag.

```bash
valint bom scribesecurity/example:latest --provenance --input sarif:my_report.json --input git:https://github.com/example/repo.git --input sqllite:latest
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
  <summary>Generate and attach source SBOM evidence reference</summary>

Generate an SBOM for the Git repository and attach it to the SLSA provenance as a by-product evidence reference.

```bash
valint slsa --source git:https://github.com/your-org/your-repo.git --git-tag v1.0.0
```

</details>

<details>
  <summary>Generate and attach target image SBOM evidence reference</summary>

Generate an SBOM for the primary image target and attach it to the provenance.

```bash
valint slsa alpine:latest --bom
```

</details>

<details>
  <summary>Combine source and image SBOM evidence references</summary>

Attach SBOMs for both the source repository and the image in a single provenance document.

```bash
valint slsa alpine:latest \
  --bom \
  --source git:https://github.com/your-org/your-repo.git --git-tag v1.0.0
```

</details>

<details>
  <summary>Attach third-party scan evidence with <code>--input</code></summary>

Include external scan results (e.g., a Trivy JSON report) as an additional by-product evidence reference.

```bash
valint slsa alpine:latest --input trivy:scan_result.json
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

> By default, *Valint* is using **[Sigstore](https://www.sigstore.dev/ "Sigstore")** interactive flow as the engine behind the signing mechanism.

```bash
valint slsa busybox:latest -o attest
``` 
</details>

<details>
  <summary> Attest and verify image target </summary>

Generating and verifying SLSA Provenance `attestation` for image target `busybox:latest`.

> By default, *Valint* is using **[Sigstore](https://www.sigstore.dev/ "Sigstore")** interactive flow as the engine behind the signing mechanism.

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
export SCRIBE_TOKEN=**

# Generate and push evidence to registry
valint slsa [target] -o [attest, statement] --f \
  -P $SCRIBE_TOKEN

# Pull and validate evidence from registry
valint verify [target] -i [attest-slsa, statement-slsa] -f \
  -P $SCRIBE_TOKEN
```

> Note `-f` in the verification command, which skips the local cache evidence lookup.

</details>














