---
sidebar_label: "Using Kyverno"
title: "Kyverno Verify Images Rules"
sidebar_position: 8
toc_min_heading_level: 2
toc_max_heading_level: 5
---

### **Introduction**

[Kyverno](https://github.com/kyverno/kyverno) is an open-source policy engine designed for Kubernetes. It supports the **[verify-images](https://kyverno.io/docs/writing-policies/verify-images/)** rule, which enforces signed image usage policies. Valint integrates seamlessly with Kyverno, enabling users to generate required attestations, such as image signatures, to comply with these policies. 

### Step 1: Evidence Generation in an OCI Store

To generate signed attestations using Valint, the OCI store must be enabled with the `--oci` flag.

> Learn about alternative evidence storage options in our **[documentation](https://scribe-security.netlify.app/docs/integrating-scribe/other-evidence-stores)**.


```bash
# Generate Evidence attestation
valint [bom,slsa] image -o attest --oci [--oci-repo repo]
```

- **Optional Flag**: `--oci-repo` specifies a central location for storing evidence.  
- **Kyverno Integration**: When using `--oci-repo`, evidence is stored under `<evidence_repo>/container`. Configure the `repository` field in the Kyverno rule to reference this location.

#### **Example**

```bash
valint my_account/my_image:latest -o attest --oci --oci-repo my_account/evidence --provenance
```

This command generates both SBOM and SLSA provenance and attaches them to the OCI store.

---

### Step 2 **Sanity check with Valint and OCI Store** [Optional]

Use Valint to verify attestations or validate them against specific Kyverno policies.

```bash
# Verify Cyclonedx or Provenance attestation
valint verify [image] -i [attest, attest-slsa] --oci [--oci-repo evidence_repo]
```

## Step 3 **Setting Kyverno `verifyImages` Rules**

For detailed guidance on setting up Kyverno to verify image signatures, refer to the official **[Kyverno Verify Images documentation](https://kyverno.io/docs/writing-policies/verify-images/sigstore/#verifying-image-signatures)**.

### **Sigstore Keyless Admission Example**

If you’re using Sigstore for signing, here’s an example configuration:

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: check-image-keyless
spec:
  validationFailureAction: Enforce
  webhookTimeoutSeconds: 30
  rules:
    - name: check-slsa-image-keyless
      match:
        any:
          - resources:
              kinds:
                - Pod
      verifyImages:
        - imageReferences:
            - "my_account/my_image*"
          # `repository` optional field expected in `[evidence-repo]/container` format
          repository: "my_account/evidence/container"
          attestations:
            # - predicateType: https://cyclonedx.org/bom/v1.5
            - predicateType: https://slsa.dev/provenance/v1
              attestors:
                - entries:
                    - keyless:
                        subject: name@example.com
                        issuer: https://accounts.example.com
                        rekor:
                          url: https://rekor.sigstore.dev
```

### **X509 Key-Based Verification**

Generate SLSA and Cyclonedx attestations signed with X509 certificates using the following command:

```bash
valint [slsa,bom] my_account/my_image:latest -o attest -f --oci \
 --attest.default x509 \
 --cert cert.pem \
 --ca ca-chain.cert.pem \
 --key key.pem
```

### **Certificate-Based Kyverno Example**

Here’s an example policy for verifying X509-signed attestations:

```yaml
```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
 name: check-image-x509
spec:
 validationFailureAction: Enforce
 webhookTimeoutSeconds: 30
 rules:
   - name: check-slsa-image-x509
     match:
       any:
       - resources:
           kinds:
             - Pod
     verifyImages:
     - imageReferences:
       - "my_account/my_image*"
       # `repository` optional field expected in `[evidence-repo]/container` format
       repository: "my_account/evidence/container"
       attestations:
        # - predicateType: https://cyclonedx.org/bom/v1.5
         - predicateType: https://slsa.dev/provenance/v1
           attestors:
           - entries:
             - certificates:
                 certChain: |-
                   -----BEGIN CERTIFICATE-----
                   MIIF8jCCA9qgAwIBAgICEjQwDQYJKoZIhvcNAQELBQAwgY0xCzAJBgNVBAYTAklM
                   MQ8wDQYDVQQIDAZDZW50ZXIxETAPBgNVBAcMCExPQ0FUSU9OMRgwFgYDVQQKDA9T
                   Y3JpYmUgU2VjdXJpdHkxGzAZBgNVBAsMElNjcmliZSBTZWN1cml0eSBDQTEjMCEG
                   A1UEAwwacm9vdC5jYS5zY3JpYmVzZWN1cml0eS5jb20wHhcNMjMwODAyMTI1NDM1
                   WhcNMzMwNzMwMTI1NDM1WjCBgTELMAkGA1UEBhMCSUwxDzANBgNVBAgMBkNlbnRl
                   cjEYMBYGA1UECgwPU2NyaWJlIFNlY3VyaXR5MRswGQYDVQQLDBJTY3JpYmUgU2Vj
                   dXJpdHkgQ0ExKjAoBgNVBAMMIWludGVybWlkYXRlLmNhLnNjcmliZXNlY3VyaXR5
                   LmNvbTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBALcV47Jjsy5Cf9Nt
                   0SY3ZgN1bM/ulIfF9Ercl78JvDEz5kBgB4mVQcwnjCX5itk375EWYMFiTbyzFBSH
                   f9hC2IMdgbgcMHgZMPA4Hn6i7PezjJdFZNY6tGGiyzR4+HkXFp+sW+OqX6ks4l++
                   FomJpT1WcJ5A86oL0h46MzHpO7Xo3d/KIl2TS3VWhXcTjlb4oJu4RTrHj4Yl80i8
                   XVIOGFSx6j9kZ1+eDSdojg2jkt8RJOS2p8ZY3SrTZ0WAQ1PvYbfC1WrIhbPtbysD
                   +5tJSSlr0leCbLciwrQYvnhIeQBNu2iMoeeM/EMpJI5W02+v1izfC1zPt/V4vxxS
                   oregCiDBiIuOc+dMJN5/uIs/T+H+xX+k4rI3HmFGr4++QXSj5BudIIuEhqUF26D9
                   AKaaiwxkmrI25XN3oKlBSTLIjyD6kM9FGX6LT/mTpAokklAbrDL6F91HOGJ9rS/i
                   fdZ8n3Or83fEiCO7LUJYXoqnM+dR8aQgU7FrcTYmiCErfOpLkgmaBIR+Dc+awp7g
                   ZCUqhg424lgdAo/9tsLzhqgz1gGCzdiF2jNexm5T0XItXvQYeDu03Lbe0hRoF0v3
                   Bik4v2W30z4xutO8Qxcqs+zG/rWp1hk93rb/IBuRJt4JGeYqIqkVYjp84ut5cfd3
                   opatZvnYK0rEZRb20roRVwFHMYtxAgMBAAGjZjBkMB0GA1UdDgQWBBQeag8z+78+
                   DmLBH8TBN7GZkz0SITAfBgNVHSMEGDAWgBRiD2MrfZfEToAtcetr89Z9eEx2xzAS
                   BgNVHRMBAf8ECDAGAQH/AgEAMA4GA1UdDwEB/wQEAwIBhjANBgkqhkiG9w0BAQsF
                   AAOCAgEAZlplI7OrzRZnCd0oZoHLMveFpxM/4eYlAyn/7swKjqjW4W/aV7C221WO
                   dw8mCNp/atslAetKMz+zlMaMGDQeuhDe6E32XOZOfrjKWrXTzArTz/BTcYF6G3+0
                   /2Dszui05N4VWzFkmlD+5h2kp1D1icLiheTR6LgMtJUAcA3x42KvhBc2tFbDgY6W
                   /QIuQ2yZZEQAVf0ZAgZqFwE4kdSMVfF1cZuftr1LSC1xEmNo33f7MAPP6yNwkGfB
                   4knOgUesW9kkvT+FUHMb9UHVMIM9770zF0nMWo7S4K/IhlL3FXzfg3L1KCvDQOHp
                   RAhff1caX2DnOaJq6XHT3ZQx2MT94RSKLcldEcRB5SDHaxJBVy20/8XVJAWiaLn0
                   7XhOq72OIc3oPAd05A7BGOgiWwPjbf06qG0ySAcgrThr5xvPzen+6w9SamsjTf2N
                   riwvuZ/xHM9CzgeNUhvuyaDjQYFvbaNBUjmRYu333XxMH3qlMq/bIKVVxXHTi7sm
                   AJmGTjI2XuBMrbUAIYvYdFFV+VXqG+NCQdlNh2EXpdM5w57WCUD7XzaIJgXuXob8
                   Gcm0zWJoBMZdT5Kxd47TtFbpdz+Rzn4tXfYMRgZFzqMxLaY8AGNNrl/e+R9MeujT
                   gZNa7wxZAxJL8zRMZAh6wKYm3BRqKEls5rwlpt0tpfrkloq/Rso=
                   -----END CERTIFICATE-----
                   -----BEGIN CERTIFICATE-----
                   MIIGDTCCA/WgAwIBAgIUZBDxk3O+s3osHk9A+muJTOuEk/8wDQYJKoZIhvcNAQEL
                   BQAwgY0xCzAJBgNVBAYTAklMMQ8wDQYDVQQIDAZDZW50ZXIxETAPBgNVBAcMCExP
                   Q0FUSU9OMRgwFgYDVQQKDA9TY3JpYmUgU2VjdXJpdHkxGzAZBgNVBAsMElNjcmli
                   ZSBTZWN1cml0eSBDQTEjMCEGA1UEAwwacm9vdC5jYS5zY3JpYmVzZWN1cml0eS5j
                   b20wHhcNMjMwODAyMTI1NDMzWhcNNDMwNzI4MTI1NDMzWjCBjTELMAkGA1UEBhMC
                   SUwxDzANBgNVBAgMBkNlbnRlcjERMA8GA1UEBwwITE9DQVRJT04xGDAWBgNVBAoM
                   D1NjcmliZSBTZWN1cml0eTEbMBkGA1UECwwSU2NyaWJlIFNlY3VyaXR5IENBMSMw
                   IQYDVQQDDBpyb290LmNhLnNjcmliZXNlY3VyaXR5LmNvbTCCAiIwDQYJKoZIhvcN
                   AQEBBQADggIPADCCAgoCggIBAKDvab1yS4djojSCjlVkj57GX24p3Uf8uGAggByI
                   ueG2LwqMQGYtR4jXOodaR8OO0j/dxYR8c3mAvVg/6J7T9bnozzlNg6mLBWhHeLBP
                   e6krpB14yJnUXDJeFfQXNWM6rLeTWSbH/G8CqEHn+sRr72pPaVbGG0s4M2jpJGJd
                   UatD9csTE/l6xw8iRcpA5SfhCpb7U0to8aluwQpNYfLgPPvtDl+4YzgbHweWuNcr
                   TMtjNXhRJITKOJ2+xfzhUdQUWpqIYZHQbRx88KG1X+8EvWQ2HowpdCiqmda7kqFu
                   voX7cnZqfllemhG4/eay7Rn6UJnEuXfZd9OrfyX8ygBD63MPUT0EDS0qNDjL+ET7
                   vczoWmUDFQ7G02FDY5X8Yintc1O+bQhHdpAJzDi61tGWxXCmoWo/1zXfT8FfNQDR
                   ZyWgw2jPgfJ1kzGCwKXtgLIspibIZilIG76oNX2DePKHEYg+HK3rAFY4mdL/bSdy
                   rzFJtdn/r/YBA6G2DLIMg7PWWGDl/WrISDc/qZTzTiJixkwJgHI06nRyUacZmtn7
                   xYifbeLqyWhZcOP0x9XQ0N0OT2nWQuOFdU7AHxqBiNPdRCltQ5S/i6a3NiVdACmi
                   mmRFkJg8vBEdxJZpU+XtkBQmUNxYp/Nf2KftsxD/Nq4T8AIAdMsKb2uFiEFRPRUp
                   NLlpAgMBAAGjYzBhMB0GA1UdDgQWBBRiD2MrfZfEToAtcetr89Z9eEx2xzAfBgNV
                   HSMEGDAWgBRiD2MrfZfEToAtcetr89Z9eEx2xzAPBgNVHRMBAf8EBTADAQH/MA4G
                   A1UdDwEB/wQEAwIBhjANBgkqhkiG9w0BAQsFAAOCAgEAFL/QeqHhuu35NRz9GbVL
                   n44xAFYFRn1uu1N4paC4Erum2Oww0oFGajLHpYRoB/151XQVUtzBV3YsIs9PLWCC
                   RAXRnBUvkndjAZpD//YGcZmzvVbQvkvbsEkSg1TuMl8AheNja2JCEZ/hZHkY5h5z
                   sETzq8YloxRI2qScRE6GOQUGI7UJsYI6T3NMqg2pttIERVvdCXh1VscqOaFlENax
                   iCSQU1kxNlNDulF7+FKXS9pArKBn1lLS9DnmIUWNAc9nKMQZue++1jHcUA+w00wb
                   fvvza5TP8YC+Wz7fJ5KY8tEuGUQsr4f+3rqaLzgLXG+8XEPI+5XsddrsXssqdy5S
                   BSKfbRZpR//wygPwO3u1E2emBDr1Fawa8hUVEhiKkQPZMccvf3+3S9hStSyBXYso
                   9mmg4vRo3TJdxayhNSitBcg3ADhEVKzK3ggIcQC/vHIzsJEg+DsM3pMldbPkXoij
                   Dmm8fdm2QhwLp+kM8gd/2LEnqeKzH5FohKyJiNBlGczzgVgoDOLz3pc+rjf5TNlw
                   3a04dSglKYnbimhdFdhnSgRzbuyAKkKTMDPD8vlRzIPkG2jKkl1oohDqj9EXNnV5
                   4yRJlfaxsP1l8tEzF6/Jkts9XZoWkPsqimgqqWrADwR0Y0BSyoSx+bXCCnrhP4RB
                   jhOhPkzpQucSSb4lGZadmts=
                   -----END CERTIFICATE-----
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

