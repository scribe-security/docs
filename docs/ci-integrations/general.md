---
sidebar_position: 3
---

# Other CI Systems

:::info Note:
The configuration requires <em><b>product-key</b></em>, <em><b>client-id</b></em>, and <em><b>client-secret</b></em> credentials obtained from your Scribe hub account at: `Home>Products>[$your_product]>Setup`

Or when you add a new product.
:::

## Step 1: Download *gensbom*
​
Download the Scribe *gensbom* CLI tool.

```
curl -sSfL http://get.scribesecurity.com/install.sh | sh
```

## Step 2: Add the credentials to your CI system​

Here's an example for setting your `client-id` credential:
```
export CLIENT_ID=<client-id>
```
Replace `<client-id>` with `client-id` from Scribe Hub.

## Step 3: Call Scribe *gensbom* from your build script 

1. Optional: if your project is in Node.Js you can call *gensbom* after the checkout stage to collect evidence of hash values of the source code files to facilitate the Scribe integrity validation.

```bash
gensbom bom dir:<path> --scribe.client-id=$CLIENT_ID -P --scribe.client-secret=$CLIENT_SECRET --product-key=$PRODUCT_KEY --scribe.login-url=https://scribesecurity-beta.us.auth0.com --scribe.auth.audience=api.beta.scribesecurity.com --scribe.url https://api.beta.scribesecurity.com -E -f -v
```

2. Call *gensbom* after the build to generate an *SBOM* from the docker image.

```bash
gensbom bom <your_docker_repository:tag> --scribe.client-id=$CLIENT_ID -P --scribe.client-secret=$CLIENT_SECRET --product-key=$PRODUCT_KEY --scribe.login-url=https://scribesecurity-beta.us.auth0.com --scribe.auth.audience=api.beta.scribesecurity.com --scribe.url https://api.beta.scribesecurity.com -E -f -v
```