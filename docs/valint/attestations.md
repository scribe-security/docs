---
sidebar_label: "Generating attestations"
title: Generating attestations
sidebar_position: 3
---

Valint collects and formats evidence according to the [in-toto](https://in-toto.io/specs/) specification which has become the standard building block for software supply chain management. Valint supports both in-toto attestations (signed evidence) and statements (unsigned evidence). Valint can signs the evidence with different schemes as specified below.


### Evidence 
`cocosign` supports both signed and unsigned evidence.
* InToto statement - unsigned evidence
* InToto attestation - signed evidence

See details [In-toto spec](https://github.com/in-toto/attestation)

### Default configuration
You can select from a set of prefilled default configuration.

> Use flag `--attest.default`, supported values are `sigstore,sigstore-github,x509,x509-env`.

## Automated Signing Conditions
`valint` automatically signs the output when the following conditions are met:

* If the `attest.default` or `format` flags are not explicitly set,
* If the `ATTEST_KEY` environment variable is provided, the `default.attest` is set to `x509-env`.
* If the `--key` flag is used, the `default.attest` is set to `x509`.

When these conditions are met, Valint will automatically set the output format to `attest`.

## Sigstore
Sigstore signer and verifier allow you to use ephemeral short living keys based on OIDC identity (google, microsoft, github).
Sigstore will also provide a transperancy log for any one to verify your signatures against (`rekor`)

> Use flag `--attest.default=sigstore`.

<details>
  <summary> Default config </summary>

```yaml
attest:
  default: "sigstore"
  cocosign:
    signer:
      fulcio:
        enable: true
        url: https://fulcio.sigstore.dev
        oidc:
        auth: interactive
        issuer: https://oauth2.sigstore.dev/auth
        clientid: sigstore
    verifier:
      fulcio:
        enable: true
    storer:
      rekor:
        enable: true
        url: https://rekor.sigstore.dev
        disablebundle: false
```

</details>

<details>
  <summary> Sigstore public instance - Github workfload identity  </summary>
Sigstore signer and verifier allow you to use ephemeral short living keys based on OIDC identity (google, microsoft, github).
Sigstore will also provide a transperancy log for any one to verify your signatures against (`rekor`)

> Select by using `--attest.default=sigstore-github`

## Default config

```yaml
attest:
  default: "sigstore-github"
  cocosign:
    signer:
      fulcio:
        enable: true
        url: https://fulcio.sigstore.dev
        oidc:
        auth: provider
        issuer: https://token.actions.githubusercontent.com
        clientid: sigstore
    verifier:
      fulcio:
        enable: true
```
</details>

## Custom CA: X509 Attestations
X509 signer allow you to use local keys, cert and CA file to sign and verify you attestations.
The signer certificate is attached to the attestation, if you provide it to the signer, you can omit it from the verifier.

### Usage
Signing an Attestation:
```bash
valint <bom, slsa> <target> -o attest --attest.default <x509,x509-env> \
    --key <key path/env/url> \
    --cert <cert path/env/url> \
    --ca <ca-chain path/env/url>
```
Verifying an Attestation:
```bash
valint verify <target> -i <attest, attest-slsa> --attest.default <x509,x509-env> \
    --ca <cert path/env/url> \
    --crl <crl path/env/url>
```

Flags and Parameters
* `--key`: PEM encoded Signer key.
* `--cert`: PEM encoded Signer certificate.
* `--ca`: PEM encoded CA Chain.
* `--crl`: PEM encoded CRL file.
* `--attest-default` Select `x509` or `x509-env` default configuration.

> The ca supports multiple CA chains within a single file.

### File Paths and Formats
- Filesystem files can be passed by path (e.g., `./my_cert.pem`)
- In Memory files can be passed through the environment (e.g., `env://MY_ENV`)
- Remote files can be passed via URL (e.g., `https://my_url.com/my_cert.pem`)

### Using x509 local keys

To use local keys, use the flag `--attest.default=x509`.

```bash
valint bom busybox:latest -o attest --attest.default x509 \
    --key my_key.pem \
    --cert my_cert.pem \
    --ca my_ca.pem
    
valint verify busybox:latest -i attest --attest.default x509 \
    --ca my_ca-chain.pem \
    --crl my_crl.pem
```

<details>
  <summary> Default config </summary>

```yaml
attest:
  default: "x509"
  cocosign:
    signer:
      x509:
        enable: true
        private: /etc/cocosign/keys/private/default.pem
        cert: /etc/cocosign/keys/public/cert.pem
        ca: /etc/cocosign/keys/public/ca.pem
    verifier:
      x509:
        enable: true
        ca: /etc/cocosign/keys/public/ca.pem
```
</details>

### Using environment keys
X509 Signer supports environment variables for key, certificate, CA and CRL files, often used with Secret Vaults where secrets are exposed through environments.

>  path names prefixed with `env://[NAME]` are extracted from the environment corresponding to the specified name.

```bash
export ATTEST_CERT=$(cat /etc/cocosign/keys/public/cert.pem)
export ATTEST_KEY=$(cat /etc/cocosign/keys/private/default.pem)
export ATTEST_CA=$(cat  /etc/cocosign/keys/public/ca.pem)

valint bom busybox:latest -o attest --attest.default x509-env
valint verify busybox:latest -i attest --attest.default x509-env
```

<details>
  <summary> Default config </summary>

```yaml
attest:
  default: "x509-env"
  cocosign:
    signer:
      x509:
        enable: true
        private: env://ATTEST_KEY
        cert: env://ATTEST_CERT
        ca: env://ATTEST_CA
    verifier:
      x509:
        enable: true
        ca: env://ATTEST_CA
```
</details>

## Custom configuration
To customize your configuration, add the following subsection to your main configuration file. For detailed configuration options, refer to [configuration-format](#configuration-format).

Usage:
```yaml
attest:
    default: ""  #Custom cocosign configuration
    cocosign:
        signer:
            x509:
                enable: true
                private: ./private/key.pem
        verifier:
            x509:
                enable: true
                cert: ./public/cert.pem
                ca: ./public/ca.pem
                crl: ./public/crl.pem
```

Another example using a specific certificate in a *.crt format, key in *.key format and crl in *.crl format:
```yaml
attest:
    default: ""  #Custom cocosign configuration
    cocosign:
      signer:
        x509:
          enable: true
          private: '~/scribe/pki/private/client.key'
          cert: '~/scribe/pki/issued/client.crt'
      verifier:
        x509:
          enable: true
          ca: ~/scribe/pki/ca.crt
          crl: ~/scribe/pki/ca.crl
```
> Use flag `--attest.config` to provide a external cocosign config.


## Signers and verifiers support

If you do not currently have a PKI or choose not to connect your PKI and certificates to Scribe, you can ask Scribe to issue you a CA, certificate and signing key. Of the various fields that are required for such a certificate we need to get the following:

* CN (Common Name) - string, unique signer name.
* Email - string, unique email of the signer.

Of course there are lots of other possible subfields but these are the ones we require at a minimum.
If you already have an existing certificate you'd like us to include in your account to enable you to verify files signed using that certificate, that certificate should also include these two fields at a minimum.

Valint can verify these two subfields (CN and Email) in addition to the general cryptographic verification. That means that we check if the certificate is valid within your PKI and we can also check if [at least one of] those two fields matches the verification policy.

As to the certificate algorithms we support, you can examine a full list [here](#x509)

### **Fulcio**

Sigstore based fulcio signer allows users to sign InToto statement using fulcio (Sigstore) project.

Simply put you can utilize a OIDC connection to gain a short living certificate signed to your identity.

* [keyless](https://github.com/sigstore/cosign/blob/main/KEYLESS)
* [fulcio_doc](https://github.com/sigstore/fulcio)

#### Support
- Interactive - User must authorize the signature via browser, device or security code url.
- Token - Static OIDC identity token provided provided by an external tool.
- Built-in identity providers flows
    - google-workload-identity
    - google-impersonate
    - github-workload-identity
    - spiffe
    - google-impersonate-cred (`GOOGLE_APPLICATION_CREDENTIALS`)

### **x509** 
File based key management library, go library abstracting the key type from applications (Supports TPM).

> See [KML](https://github.com/scribe-security/KML) for details.

| Media type | TPM | RSA (pss)| ECDSA (p256) | ED25519 |
| --- | --- | --- | --- | --- |
| file | | 2048, 4096 | yes | yes |
| TPM | yes | 2048 | | |

 > PEM formatted files

### **KMS (Key Management Service) Integration**

The Sigstore-based KMS signer allows users to sign artifacts using various KMS providers. Refer to the [Sigstore documentation](https://docs.sigstore.dev/key_management/overview/) for more details.

To use KMS with Valint, provide a `kms` reference in the following format:

`<provider>://<key>`

Key Points:

* Use the `--kms` flag explicitly.
* Environment variables `ATTEST_KMS` or `KMSREF` can be used to set the KMS reference.
* Static references can be set via configuration or environment variables.
* Signer commands (`bom`, `evidence`, `slsa`) require signing permissions.
* The `verify` command requires public read access to verify the evidence. Additionally, signing permissions are needed if you want to sign the evaluation report evidence.

Supported Services:

| Service         | Provider Prefix       |
|-----------------|-----------------------|
| AWS KMS         | `awskms`           |
| Azure Key Vault | `azurekms`         |
| Google Cloud KMS| `gcpkms`           |
| HashiCorp Vault | `hashivault`       |

For example, AWS keys can be accessed using the format `awskms://$ENDPOINT/$KEYID`. Ensure that AWS environment variables such as `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_SESSION_TOKEN` are properly mapped.

Supported AWS URI schemes:

| Scheme | Example |
|--------|---------|
| Key ID                   | `awskms:///1234abcd-12ab-34cd-56ef-1234567890ab`                                                      |
| Key ID with endpoint     | `awskms://localhost:4566/1234abcd-12ab-34cd-56ef-1234567890ab`                                        |
| Key ARN | `awskms:///arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab`                                |
| Key ARN with endpoint    | `awskms://localhost:4566/arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab` |
| Alias name               | `awskms:///alias/ExampleAlias`                                                                        |
| Alias name with endpoint | `awskms://localhost:4566/alias/ExampleAlias`                                                          |
| Alias ARN                | `awskms:///arn:aws:kms:us-east-2:111122223333:alias/ExampleAlias`                                     |
| Alias ARN with endpoint  | `awskms://localhost:4566/arn:aws:kms:us-east-2:111122223333:alias/ExampleAlias`                       |

Usage example:

```bash
# Signing requires signing access
valint bom busybox:latest --kms awskms:///arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab

# Verifying requires public key read access
valint verify busybox:latest --kms awskms:///arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab
```

### Local keys

Pubkey signer allows you to sign InToto statement using a locally stored asymmetric key pair. Currently, only PEM-encoded RSA, ECDSA and Ed25519 keys are supported for signing and verifying attestations.

Usage example:

```bash
# Signing
valint bom busybox:latest -o attest --attest.default pubkey --key my_key.pem --pubkey my_pubkey.pem

# Verifying
valint verify busybox:latest --attest.default pubkey --pubkey my_pubkey.pem
```

### OCI storer
Cocosign embeds the oci storer.  
OCI Storer uploads evidence to your OCI registry.
Evidence can be attached to a specific image or uploaded to a general repo location.

OCI store capability allows your evidence collection to span across your supply chain.

> Use flag `--oci` and `--oci-repo` to enable.

### OCI Repo flag
`oci-repo` setting indicates the location in a registry under which the evidence are stored.
It must be a dedicated location in a OCI registry.
for example, `scribesecurity.jfrog.io/my_docker-registry/evidence`.

In order to successfully upload evidence to an OCI registry you need to be logged in to the registry with write permission. In the example above, you need to use the command `docker login scribesecurity.jfrog.io`.

Default config, 
``` 
storer:
    oci:
        enable: false
        ref: ""
```

> Supports cosign verification

## CRL verification

Verifying client certificate against a CRL is supported only for x509 verifier. There are two ways of providing a CRL to the verifier:

1. Using a CRL file addressed by path (in `--crl` flag or configuration file) or by value (in the environment variable).
2. Using the `CRL Distribution Point` field of client certificate. In this case, Valint will try to download the CRL from the URL specified in the certificate.

> Skip CRL verification you by including the `--disable-crl` flag.

If CRL file is provided, Valint ignores the `CRL Distribution Point` field in the certificate and uses the file. The CRL should be in PEM format, signed by the same CA as the client certificate.

If CRL file is not provided but the `--disable-crl` flag is NOT used, Valint will try to download the CRL from the `CRL Distribution Point` field in the client certificate.
If this field is not present, Valint will pass CRL verification without any errors. And if it is present, Valint will try to download the CRL from the URL specified. If the download fails, Valint will issue a certificate verification error.

If Valint successfully retrieves the Certificate Revocation List (CRL), it evaluates whether the client certificate has been revoked. Otherwise, the cert is assumed revoked.
Additionally, Valint verifies the validity of the certificates in the signer chain.

## Configuration format
```yaml
signer:
	x509:
	    enable: <true|false>
	    private: <key_path>
	    cert: <cert_path>
	    ca: <ca_path>
	fulcio:
	    enable: <true|false>
	    url: <sigstore_url>
	    oidc:
	        issuer: <sigstore_issuer_url>
	        clientid: <sigstore_client_id>
	        client-secret: <sigstore_client_secret>
	        token:<external_token> - for auth=token, enter the OIDC identity token
	kms:
	    enable: <true|false>
	    ref: <kms_ref>
  pubkey:
    enable: <true|false>
    key: <key_path>
    pubkey: <pubkey_path>
verifier:
	x509:
	    enable: <true|false>
	    cert: <cert_path>
        ca: <ca_path>
        crl: <crl_path>
	fulcio:
	    enable: <true|false>
	kms:
	    enable: <true|false>
	    ref: <kms_ref>
  pubkey:
    enable: <true|false>
    pubkey: <pubkey_path>
	policies:
		<list of rego/cue policies>
	certemail: 
		<email to verify certificate>
	certuris: 
		<uris to verify certificate>
  untrustedpublic: <true|false> // Allow verifiers with only publics
storer:
	rekor:
	    enable: <true|false>
	    url: <rekor_url>
	    disablebundle: <true|false>
    oci:
        enable: <true|false>
        ref: <oci ref to upload evidence to>
```
