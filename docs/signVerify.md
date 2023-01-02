---
sidebar_position: 10
sidebar_label: "Attest And Verify"
---

# Signing And Verifying SBOMs 
An attestation is cryptographically signed piece of evidence. It's a mechanism for software to prove its identity and authenticity. The goal of attestation is to prove to a third party that the signed evidence is intact and trustworthy. Scribe's tool *Valint* allows you to not only create various pieces of evidence based on different forms of an SBOM, but also to sign them into an attestation. Once signed, you can later verify that the file or folder or image you have signed is indeed intact and trustworthy. You can read more about an in-toto attestation [here](https://github.com/in-toto/attestation "in-toto attestation GitHub link") and about the SLSA Attestation Model [here](https://github.com/slsa-framework/slsa/blob/main/controls/attestations.md "SLSA Attestation Model GitHub link").

## Signing the result of the *Valint bom* command into an attestation

1. Using a Shell-based CLI, download the `valint` CLI tool, created by Scribe:
   ```sh
   curl -sSfL http://get.scribesecurity.com/install.sh  | sh -s -- -t valint
   ```
2. Run the `valint bom` command on one of the available options:
   ```sh
   valint bom docker:yourrepo/yourimage:tag          explicitly use the Docker daemon
   valint bom docker-archive:path/to/yourimage.tar   use a tarball from disk for archives created from "docker save"
   valint bom oci-archive:path/to/yourimage.tar      use a tarball from disk for OCI archives (from Skopeo or otherwise)
   valint bom dir:path/to/yourproject                read directly from a path on disk (any directory)
   valint bom registry:yourrepo/yourimage:tag        pull image directly from a registry (no container runtime required)
   valint bom file:path/to/yourproject/file          read directly from a path on disk (any single file)
   valint bom git:path/to/yourrepository             read directly from a local repository on disk
   valint bom git:path/to/yourrepository.git         read directly from a remote repository on git
   ```
   Note that when employing the `bom` command on an image you don't have to use a specified tag like `docker` or `oci-archive` since an image is the default that the tool is expecting to get. For any other option you should tag what your attempting to use the command on such as a `file` or a `git` repository.

   Other than using the command `bom` you should add the flag `-o` to the command with the distinction `attest` to state that you want to sign the resulting evidence into an attestation.

   So, for example, if you want to `bom` the image of `busybox:latest` the command will look like this:
   ```sh
   $HOME/.scribe/bin/valint bom busybox:latest -o attest -v -f
   ```
   Note that you can also create a SLSA provenance attestation from the same evidence:
   ```sh
   $HOME/.scribe/bin/valint bom busybox:latest -o attest-slsa -v -f
   ```

   By default, *Valint* is using [Sigstore](https://www.sigstore.dev/ "Sigstore") as the engine behind the signing mechanism so once you apply the command you'll need to first approve you wish to sign the evidence with a `Y/[N]` option:
   
   <img src='../../../img/ci/bomAttest.jpg' alt='Approve Signing'/>

   If you want to change this default, for example, in order to use your own key management system, you can use the configuration file. Currently, the options for signing attestations are Sigstore, Sigstore-github, or x509 (public key certificates). You can check out the configuration file [here](ci-integrations/github/docs/configuration.md "Configuration file") or at the source, [here](https://github.com/scribe-security/action-bom). 

   Assuming you approve, you'll be directed to *Sigstore* in your browser where you'll need to log in using either your GitHub account, your Google account, or your Microsoft account:

   <img src='../../../img/ci/sigstore.jpg' alt='Log in to Sigstore' width='50%' min-width='500px'/>

   Once you have signed in you'll see that the login was successful 

   <img src='../../../img/ci/sigstoreSuccess.jpg' alt='Sigstore Auth Successful' width='50%' min-width='400px'/>

   at which point you can close the browser page and go back to your Shell

   <img src='../../../img/ci/attestS.jpg' alt='Attest Successful'/>

   Note that the signed attestation is now saved on your machine in the default location. The path is specified in the result. In the example above it's saved in: `/home/barak/.cache/valint/docker/busybox/latest/sha256-05a79c7279f71f86a2a0d05eb72fcb56ea36139150f0a75cd87e80a4272e4e39.bom.sig.json`

## Verify the result of *Valint bom* 

Once you have signed something into an attestation you can later verify that the object you're checking is identical to the one you have signed. For example, if we signed the `busybox:latest` image I can later compare that image to the signed attestation we have saved.

Without access to the signed attestation there is nothing to verify against.

The command to verify something is logically named `verify`. The way to use it is almost identical to the `bom` command except we'll be using the flag `-i`.

So, if we want to verify the `busybox:latest` image we have signed in the previous example the command will look like this:

   ```sh
   $HOME/.scribe/bin/valint verify busybox:latest -i attest -v
   ```
The `verify` command's default value of the `-i` flag is `attest` so you can omit it if you want.

   The result should look like this:

   <img src='../../../img/ci/verifyS.jpg' alt='Verify Successful'/>

   Note the `Verify - Success` at the end - that's what we're looking to see.

## GitHub Actions
   Scribe has added all these options of our *Valint* tool to GitHub as actions. Too learn more about it and to see how you may use them you can go to [this link](ci-integrations/github "GitHub"). 