<p><a target="_blank" href="https://app.eraser.io/workspace/9Rn8xXnuMkCho4YLFWt2" id="edit-in-eraser-github-link"><img alt="Edit in Eraser" src="https://firebasestorage.googleapis.com/v0/b/second-petal-295822.appspot.com/o/images%2Fgithub%2FOpen%20in%20Eraser.svg?alt=media&amp;token=968381c8-a7e7-472a-8ed6-4a6626da5501"></a></p>

---

## sidebar_label: "Using Cosign and Valint"
title: "Using Cosign and Valint"
sidebar_position: 7
toc_min_heading_level: 2
toc_max_heading_level: 5
[﻿Cosign](https://github.com/sigstore/cosign) is an open source that strives to provide a seamless signing infrastructure. Valint integrates with the cosign CLI tool and the Sigstore verification process.

### Verifying using cosign (Keyless)
Use Valint to generate the SLSA provenance document attestation and attach it to an OCI registry, and use cosign keyless flow to verify the attestation.

Valint pushes the attestations to OCI for cosign to consume downstream (see also [﻿cosign verify-attestation](https://docs.sigstore.dev/cosign/verify/))

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
- `--insecure-ignore-tlog` , skipping Rekor Transparency log.
- `--insecure-ignore-sct` , skipping Rekor Transparency log Signed Certificate Timestamp.
- `--certificate-oidc-issuer-regexp='.*` , Ignore the [﻿Keyless specific](https://github.com/sigstore/fulcio/blob/main/docs/oid-info.md)  OIDC extension.
### Both Signing and Verifying using cosign
You can create predicates for any attestation format (`SBOM`, `SLSA`), and then use `Cosign` to verify the attestation.

The example below uses a keyless (Sigstore) flow. You can use any of the `Cosign` signing capabilities (see [﻿cosign verify-attestation](https://docs.sigstore.dev/cosign/verify/))

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
- Certificate must include a [﻿Subject Alternate Name](https://datatracker.ietf.org/doc/html/rfc5280#section-4.2.1.6)  extension.
    - URI or Email SAN identity.
- Certificate must include a [﻿Extended Key Usage](https://datatracker.ietf.org/doc/html/rfc9336)  extension
    - Code Signing OID [﻿1.3.6.1.5.5.7.3.3](https://oidref.com/1.3.6.1.5.5.7.3.3) 
- Certificate isn't expired.
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




<!--- Eraser file: https://app.eraser.io/workspace/9Rn8xXnuMkCho4YLFWt2 --->