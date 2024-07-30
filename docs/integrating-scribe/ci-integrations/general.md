---
sidebar_label: "Generic CI integration"
title: Integrating Scribe with Other CI Systems
sidebar_position: 8
toc_min_heading_level: 2
toc_max_heading_level: 5
---

Use the following instructions to integrate Scribe with your local host or with any CI platform that has no specific reference in Scribe's documentation.

### 1. Obtain a Scribe Hub API Token
1. Sign in to [Scribe Hub](https://app.scribesecurity.com). If you don't have an account you can sign up for free [here](https://scribesecurity.com/scribe-platform-lp/ "Start Using Scribe For Free").

2. Create a API token in [Scribe Hub > Settings > Tokens](https://app.scribesecurity.com/settings/tokens). Copy it to a safe temporary notepad until you complete the integration.
:::note Important
The token is a secret and will not be accessible from the UI after you finalize the token generation. 
:::

### 2. Add the API token to your environemnt
  
   ```js
   export SCRIBE_TOKEN=<scribe_api_token>
   ```
Replace '<scribe_api_token>' with the token you obtained in the previous step.

`valint` supports the use of the `SCRIBE_TOKEN` environment variables, or you can set them using the `-P` or `--scribe.client-secret` flags.

### 3. Download Scribe CLI

**Valint** -Scribe CLI- is required to generate evidence in such as SBOMs and SLSA provenance. 
```
curl -sSfL https://get.scribesecurity.com/install.sh  | sh -s -- -t valint
```

### 4. Instrument your build scripts
Call Valint from your build script.

At Checkout: Generate an SBOM of the source code. 
```
$HOME/.scribe/bin/valint bom dir:<path> -f
```
At the end of a build: Generate SBOM of the built image is created.
```
   $HOME/.scribe/bin/valint bom <your_docker_repository:tag> -f
```

> To explicitly set a secret, you may use the `-P` flag.