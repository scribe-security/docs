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

## Sigstore
Sigstore signer and verifier allow you to use ephemeral short living keys based on OIDC identity (google, microsoft, github).
Sigstore will also provide a transperancy log for any one to verify your signatures against (`rekor`)

> Use flag `--attest.default=sigstore`.

<details>
  <summary> Default config </summary>

```yaml
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
* `--cert`:PEM encoded Signer certificate.
* `--ca`: PEM encoded CA Chain.
* `--crl`: PEM encoded CRL file.
* `--attest-deafult` Select `x509` or `x509-env` default configuration.

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
export ATTEST_CRL=$(cat  /etc/cocosign/keys/public/crl.pem)

valint bom busybox:latest -o attest
valint verify busybox:latest -i attest
```

<details>
  <summary> Default config </summary>

```yaml
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
    default: ""
    cocosign: #Custom cocosign configuration
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
* CN (Common Name) - string, unique signer name  
* Email - string, unique email of the signer 

Of course there are lots of other possible subfields but these are the ones we require at a minimum.
If you already have an existing certificate you'd like us to include in your account to enable you to verify files signed using that certificate, that certificate should also include these two fields at a minimum. 

Valint can verify these two subfields (CN and Email) in addition to the general cryptographic verification. That means that we check if the certificate is valid within your PKI and we can also check if [at least one of] those two fields matches the verification policy.

As to the certificate algorithms we support, you can examine a full list [here](#x509)

### **KMS**
Sigstore based KMS signer allows users to sign via kms. <br />
[doc](https://github.com/sigstore/cosign/blob/main/KMS) for Ref details.
- Support `KMSREF` environment variable (when configuration field is empty).
- Support static ref set by configuration or env.
- Support in-band ref verification flow by using the `REF` signature option.

### **Fulcio**
Sigstore based fulcio signer allows users to sign InToto statement using fulcio (Sigstore) project.

Simply put you can utilize a OIDC connection to gain a short living certificate signed to your identity.

[keyless](https://github.com/sigstore/cosign/blob/main/KEYLESS)
[fulcio_doc](https://github.com/sigstore/fulcio)

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

1. Using a file addressed by path (in `--crl` flag or configuration file) or by value (in the environment variable).
2. Using the `CRL Distribution Point` field of client certificate by setting the `--enable-crl` flag to `true`. In this case, `valint` will try to download the CRL from the URL specified in the certificate.

If the file is provided, `valint` ignores the `CRL Distribution Point` field in the certificate and uses the file. The CRL should be in PEM format, signed by the same CA as the client certificate.

If the file is not provided but the `--enable-crl` flag is used, `valint` will try to download the CRL from the `CRL Distribution Point` field in the client certificate.
If this field is not present, `valint` will pass CRL verification without any errors. And if it is present, `valint` will try to download the CRL from the URL specified. If the download fails, `valint` will issue a certificate verification error.

If `valint` was able to get the CRL, it will check if the client certificate is revoked. If it is, `valint` will issue a certificate verification error, and if it's not, it'll continue with the signature verification.

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
