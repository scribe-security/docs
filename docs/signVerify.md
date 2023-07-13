---
sidebar_position: 11
sidebar_label: "Attest And Verify"
---

# Signing And Verifying Evidence 
An attestation is cryptographically signed piece of evidence. It's a mechanism for software to prove its identity and authenticity. The goal of attestation is to prove to a third party that the signed evidence is intact and trustworthy. Scribe's tool *Valint* allows you to not only create various pieces of evidence based on different forms of an SBOM, but also to sign them into an attestation. Once signed, you can later verify that the file or folder or image you have signed is indeed intact and trustworthy. You can read more about an in-toto attestation [here](https://github.com/in-toto/attestation "in-toto attestation GitHub link") and about the SLSA Attestation Model [here](https://github.com/slsa-framework/slsa/blob/main/controls/attestations "SLSA Attestation Model GitHub link").

## Supported format tables
Following table includes the supported format.

| Format | alias | Description | signed
| --- | --- | --- | --- |
| statement-cyclonedx-json | statement | In-toto Statement | no |
| attest-cyclonedx-json | attest | In-toto Attestation | yes |
| statement-slsa |  | In-toto SLSA Predicate Statement | no |
| attest-slsa |  | In-toto SLSA Predicate Attestation | yes |
| statement-generic |  | In-toto Generic Statement | no |
| attest-generic |  | In-toto Generic Attestations | yes |


> Both Bom command output format `-o`,`--format` as well as the Verify command `-i`, `--input-format` value must match one of the supported formats.

## Signing the result of the *Valint bom* command into an attestation

1. Using a Shell-based CLI, download the `valint` CLI tool, created by Scribe:
   ```sh
   curl -sSfL https://get.scribesecurity.com/install.sh  | sh -s -- -t valint
   ```
2. Run the `valint bom [target] -o [format]` command on one of the available.
 `format` options: See supported formats table.   
 `target` options:
   ```sh
   valint bom docker:yourrepo/yourimage:tag        explicitly use the Docker daemon
   valint bom docker-archive:path/to/yourimage.tar   use a tarball from disk for archives created from "docker save"
   valint bom oci-archive:path/to/yourimage.tar      use a tarball from disk for OCI archives (from Skopeo or otherwise)
   valint bom dir:path/to/yourproject                read directly from a path on disk (any directory)
   valint bom registry:yourrepo/yourimage:tag        pull image directly from a registry (no container runtime required)
   valint bom file:path/to/yourproject/file          read directly from a path on disk (any single file)
   valint bom git:path/to/yourrepository             read directly from a local repository on disk
   valint bom git:path/to/yourrepository.git         read directly from a remote repository on git
   ```
   Note that when employing the `bom` command on an image you don't have to use a specified tag like `docker` or `oci-archive` since an image is the default that the tool is expecting to get. For any other option you should tag what your attempting to use the command on such as a `file` or a `git` repository.

   Other than using the command `bom` you should add the flag `-o` to the command with the distinction `attest-cyclonedx-json` or `attest-slsa` to state that you want to sign the resulting evidence into an attestation.

   So, for example, if you want to `bom` the image of `busybox:latest` the command will look like this:
   ```sh
   $HOME/.scribe/bin/valint bom busybox:latest -o attest -f
   ```
   > Note `attest` is an alias for `attest-cyclonedx-json`

   You can also create a SLSA provenance attestation from the same evidence:
   ```sh
   $HOME/.scribe/bin/valint bom busybox:latest -o attest-slsa -f
   ```

   By default, *Valint* is using [Sigstore](https://www.sigstore.dev/ "Sigstore") interactive flow as the engine behind the signing mechanism as imbedded in Scribe's **cocosign** library. This library deals with digital signatures for signing and verification. Once you apply the command you'll need to first approve you wish to sign the evidence with a `Y/[N]` option:

   ```
   [2023-01-10 09:35:35]  INFO target: collecting context, Type: local
   [2023-01-10 09:35:36]  INFO target: analyzing docker:busybox:latest
   [2023-01-10 09:35:37]  INFO target: docker:busybox:latest analyzing success
   [2023-01-10 09:35:37]  INFO cocosign: config selection, default: sigstore, Scheme: docker
   [2023-01-10 09:35:37]  INFO disabled: ociStorer, Storer skipping,
   [2023-01-10 09:35:37]  INFO enabled: rekorStorer, using storer
   Retrieving signed certificate...

         Note that there may be personally identifiable information associated with this signed artifact.
         This may include the email address associated with the account with which you authenticate.
         This information will be used for signing this artifact and will be stored in public transparency logs and cannot be removed later.
         By typing 'y', you attest that you grant (or have permission to grant) and agree to have this information stored permanently in transparency logs.

   Are you sure you want to continue? (y/[N]):
   ```   

   If you want to change this default, for example, in order to use your own key management system, you can use the configuration file. Currently, the options for signing attestations are Sigstore, Sigstore-github, x509 (public key certificates) or KMS (key management system). You can check out the configuration file [here](ci-integrations/github/docs/configuration "Configuration file").

   Assuming you approve, you'll be directed to *Sigstore* in your browser where you'll need to log in using either your GitHub account, your Google account, or your Microsoft account:

   <img src='../../../img/ci/sigstore.jpg' alt='Log in to Sigstore' width='50%' min-width='500px'/>

   Once you have signed in you'll see that the login was successful 

   <img src='../../../img/ci/sigstoreSuccess.jpg' alt='Sigstore Auth Successful' width='50%' min-width='400px'/>

   at which point you can close the browser page and go back to your Shell

   ```bash
   Successfully verified SCT...
   INFO enabled: fulcioSigner, using signer
   INFO enabled: fulcioVerifier, using verifer
   tlog entry created with index: 10855458 c0d23d6ad406973f9559f3ba2d1ca01f84147d8ffc5b8445c224f98b9591801d
   INFO storer: upload success, Storer: rekorStorer
   sign success - TRUSTED CA signature, Signer trust: fulcioSigner, CN: sigstore-intermediate, Emails: [mikey@scribesecurity.com]
   INFO output: File write to FS, Path: /home/mikey/.cache/valint/docker/busybox/latest/sha256-9810966b5f712084ea05bf28fc8ba2c8fb110baa2531a10e2da52c1efc504698.bom.sig.json
   INFO scribe: client disabled
   INFO attest: evidence generated successfully
   ```

   Attestation is written by default to the local cache provided by the `--output-directory` flag (default `$HOME/.cache/valint`), you can also use `--output-file` flag to provide a custom path for the attestation.

   Note in the logs that the signed attestation is now saved on your machine in the default location. The path is specified in the result. In the example above it's saved in: `$HOME/.cache/valint/docker/busybox/latest/sha256-9810966b5f712084ea05bf28fc8ba2c8fb110baa2531a10e2da52c1efc504698.bom.sig.json`.

## Verify the result of *Valint bom* 

Once you have signed something into an attestation you can later verify that the object you're checking is identical to the one you have signed. For example, if we signed the `busybox:latest` image I can later compare that image to the signed attestation we have saved.

Without access to the signed attestation there is nothing to verify against.

The command to verify something is logically named `verify`. The way to use it is almost identical to the `bom` command except we'll be using the flag `-i` (default `attest-cyclonedx-json` alias `attest`).

So, if we want to verify the `busybox:latest` image we have signed in the previous example the command will look like this:

   ```sh
   $HOME/.scribe/bin/valint verify busybox:latest -i attest
   ```
> Note you must first create the evidence using `valint bom busybox:latest -o attest`

In case you want to verify `busybox:latest` using a SLSA provenance attestation from the same evidence:
   ```sh
   $HOME/.scribe/bin/valint verify busybox:latest -i attest-slsa -f
   ```
> Note you must first create the evidence using `valint bom busybox:latest -o attest-slsa` 

The `verify` command's default value of the `-i` flag is `attest` so you can omit it if you want.

   The result should look like this:

   ```bash
   INFO cocosign: config selection, default: sigstore, Scheme: docker
   INFO disabled: ociStorer, Storer skipping,
   INFO enabled: rekorStorer, using storer
   INFO enabled: fulcioVerifier, using verifer
   INFO rekor: verify offline success (bundle)
   INFO rekor: download cert, CN: sigstore-intermediate, Emails: [mikey@scribesecurity.com]
   INFO attest: verify success - TRUSTED CA signatures, Verifier trust: fulcioVerifier, CN: sigstore-intermediate, Emails: [mikey@scribesecurity.com], URIs: []
   INFO rekor: verify offline success (bundle)
   INFO attest: verify attestation success
   INFO attest: verify policy success, Policies: []
   INFO verify: success, Type: attest-cyclonedx-json Path: /home/mikey/.cache/valint/docker/busybox/latest/sha256-9810966b5f712084ea05bf28fc8ba2c8fb110baa2531a10e2da52c1efc504698.bom.sig.json
   ```
   Note the `TRUSTED CA signatures, Verifier trust: fulcioVerifier, CN: sigstore-intermediate, Emails: [mikey@scribesecurity.com], URIs: []` which includes signers identity,
   
   Note the `verify: success, Type: attest-cyclonedx-json` at the end - that's what we're looking to see.
   
   
## GitHub Actions
   Scribe has added all these options of our *Valint* tool to GitHub as actions. To learn more about it and to see how you may use them you can go to [this link](ci-integrations/github "GitHub"). 
