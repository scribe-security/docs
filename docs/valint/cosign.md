---
sidebar_label: "Using Cosign and Valint"
title: "Using Cosign and Valint"
sidebar_position: 7
toc_min_heading_level: 2
toc_max_heading_level: 5
---

**[Cosign](https://github.com/sigstore/cosign)** is an open source that strives to provide a seamless signing infrastructure. Valint integrates with the cosign CLI tool and the Sigstore verification process.

### Signing and Verifying using cosign keys

Use Valint to sign and verify with Cosign generated keys.

```bash
cosign generate-key-pair
valint [slsa,evidence,bom,verify] <target> --key cosign.key --pubkey cosign.pub --pass <key_pass>
```

For more details see [Signing with Self-Managed Keys](https://docs.sigstore.dev/key_management/signing_with_self-managed_keys/)

### Verifying using cosign (Keyless)

Use Valint to generate the SLSA provenance document attestation and attach it to an OCI registry, and use cosign keyless flow to verify the attestation.

Valint pushes the attestations to OCI for cosign to consume downstream (see also **[cosign verify-attestation](https://docs.sigstore.dev/cosign/verify/)**)

```bash
# Generate SLSA Provenance attestation
valint slsa [image] -o attest -f --oci

# Verify attestation using cosign
cosign verify-attestation --type https://slsa.dev/provenance/v1 \
 --certificate-identity=name@example.com  --certificate-oidc-issuer=https://accounts.example.com \
 [image]
```

### Verifying using cosign (X509)

Use `cosign` to verify the attestation with an X509 CA.

```bash
# Generate SLSA Provenance attestation
valint slsa [image] -o attest -f --oci \
 --attest.default x509 \
 --cert cert.pem \
 --ca ca-chain.cert.pem \
 --key key.pem

# Verify attestation using cosign
cosign verify-attestation --type https://slsa.dev/provenance/v1 \
  --certificate-identity=name@example.com \
  --certificate cert.pem \
  --certificate-chain ca-chain.cert.pem \
  --certificate-oidc-issuer-regexp='.*' \
  --insecure-ignore-tlog=true \
  --insecure-ignore-sct=true \
  [image]
```

* `--insecure-ignore-tlog`, skipping Rekor Transparency log.
* `--insecure-ignore-sct`, skipping Rekor Transparency log Signed Certificate Timestamp.
* `--certificate-oidc-issuer-regexp='.*`, Ignore the **[Keyless specific](https://github.com/sigstore/fulcio/blob/main/docs/oid-info.md)** OIDC extension.

### Both Signing and Verifying using cosign (X509)

You can create predicates for any attestation format (`SBOM`, `SLSA`), and then use `Cosign` to verify the attestation.

The example below uses a keyless (Sigstore) flow. You can use any of the `Cosign` signing capabilities (see **[cosign verify-attestation](https://docs.sigstore.dev/cosign/verify/)**)

```yaml
# Generate SLSA Provenance statement
valint slsa [image] -o statement -f --output-file valint_statement.json

# Extract predicate
cat valint_predicate.json | jq '.predicate' > valint_predicate.json

# Sign and OCI store using cosign
cosign attest --predicate  valint_predicate.json [image] --type https://slsa.dev/provenance/v1

# Verify attestation using cosign
cosign verify-attestation [image] --type https://slsa.dev/provenance/v1 \
 --certificate-identity=name@example.com  --certificate-oidc-issuer=https://accounts.example.com
```

#### X509 Certificate Constraints​

* Certificate must include a **[Subject Alternate Name](https://datatracker.ietf.org/doc/html/rfc5280#section-4.2.1.6)** extension.
    * URI or Email SAN identity.
* Certificate must include a **[Extended Key Usage](https://datatracker.ietf.org/doc/html/rfc9336)** extension
    * Code Signing OID **[1.3.6.1.5.5.7.3.3](https://oidref.com/1.3.6.1.5.5.7.3.3)**
* Certificate isn't expired.

You can make sure the certificate includes these values using the following command:
```yaml
openssl req -noout -text -in cert.pem
```

Note the X509v3 extensions, For example:
```yaml
X509v3 extensions:
   X509v3 Extended Key Usage:
       Code Signing
   X509v3 Subject Alternative Name: critical
       email:name@example.com
   ...
```

Below is an **example** of how you can fill in three new headings regarding verifying SBOMs, SLSA, and policy results with Cosign. Each section uses **keyless** signing as an example, though the same commands can be adapted for key-based or certificate-based flows.

---

### Verifying SBOMs with Cosign

If you’ve generated an SBOM (for example, CycloneDX) and pushed it to the registry as an attestation, you can verify its authenticity with Cosign. In this **keyless** example, Cosign retrieves the SBOM attestation from the registry and checks its signature:

```bash
# Generate and attach SBOM attestation with Valint
valint bom my_account/my_image:latest --oci -o attest

# Verify the SBOM attestation using cosign
cosign verify-attestation my_account/my_image:latest \
  --type https://cyclonedx.org/bom/v1.5 \
  --certificate-identity="name@example.com" \
  --certificate-oidc-issuer="https://github.com/login/oauth"
```

> **Note**: `--type https://cyclonedx.org/bom/v1.5` tells Cosign to fetch only SBOM attestations of that type.
> **Reminder**: These examples use Cosign **keyless** signing. 
---

### Verifying SLSA with Cosign

Valint can generate an **SLSA** (Supply chain Levels for Software Artifacts) provenance statement. After signing and pushing it to your OCI registry, you can confirm its validity with Cosign:

```bash
# Generate and attach SLSA provenance
valint slsa my_account/my_image:latest --oci -o attest

# Verify the SLSA attestation using cosign (keyless flow)
cosign verify-attestation my_account/my_image:latest \
  --type https://slsa.dev/provenance/v1 \
  --certificate-identity="name@example.com" \
  --certificate-oidc-issuer="https://github.com/login/oauth"
```

This ensures your SLSA provenance is signed by the correct subject and issuer.

> **Reminder**: These examples use Cosign **keyless** signing. 
---

### Verifying Policy Results with Cosign

You might also store policy or compliance results (e.g., from Valint scanning) as an attestation—often in SARIF format. Cosign can verify these policy-result attestations, ensuring they’re both **trusted** and **unaltered**:

```bash
# Generate and push SARIF-based policy results
valint verify my_account/my_image:latest --oci  \
  --predicate results.sarif \
  --type "http://docs.oasis-open.org/sarif/sarif/2.1.0" \
  -o attest

# Verify the SARIF attestation with Cosign (keyless)
cosign verify-attestation my_account/my_image:latest \
  --type http://docs.oasis-open.org/sarif/sarif/2.1.0 \
  --certificate-identity="name@example.com" \
  --certificate-oidc-issuer="https://github.com/login/oauth"
```

By confirming the attestation’s signature, you ensure the **policy results** remain **authentic** and tamper-free when consumed by other parts of your supply chain (e.g., an admission controller).

> **Reminder**: These examples use Cosign **keyless** signing. 
---

### Using `--oci-repo` and the `COSIGN_REPOSITORY` Environment Variable

When using **Valint** with the `--oci-repo` flag to push evidence (SBOMs, SLSA, policy results) to an OCI registry, you typically need to align your **Cosign** settings accordingly. Specifically, **Cosign** references an environment variable called `COSIGN_REPOSITORY` to know which path in the registry to store or fetch attestation artifacts.  

1. **Valint** pushes evidence to `--oci-repo`, suffixed with `"/container"` for container artifacts.  
2. **Cosign** must have `COSIGN_REPOSITORY` set to **`<oci-repo> + "/container"`** so it looks in the correct path.

For example, if you run:

```bash
valint [bom, verify, slsa, etc.] my_account/my_image:latest \
  --oci \
  --oci-repo my_account/evidence \
  -o attest
```
Valint will place container artifacts under `my_account/evidence/container` in the registry.  
To ensure Cosign sees them correctly, set:
```bash
export COSIGN_REPOSITORY="my_account/evidence/container"
```

> **Why the `/container` suffix?**  
> Valint (and many OCI-based workflows) distinguish different artifact types (like source code vs. container images) by placing them in subdirectories. This lets you store other assets (e.g., “source” or “sbom” paths) in the same repository without collisions.