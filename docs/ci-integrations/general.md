---
sidebar_position: 3
---

# Other CI Systems

:::info Note:
The configuration requires <em><b>productkey</b></em>, <em><b>clientid</b></em>, and <em><b>clientsecret</b></em> credentials obtained from your Scribe hub account at: `Home>Products>[$your_product]>Setup`

Or when you add a new product.
:::

## Step 1: Download *gensbom*
​
Download the Scribe *gensbom* CLI tool.

```
curl -sSfL https://raw.githubusercontent.com/scribe-security/misc/master/install.sh | sh
```

## Step 2: Add the credentials to your CI system​

Here's an example for setting your `clientid` credential:
```
export CLIENT_ID=<client_id>
```
Replace `<client_id>` with `clientid` from Scribe Hub.

## Step 3: Call Scribe *gensbom* from your build script 

1. Optional: if your project is in Node.Js you can call *gensbom* after the checkout stage to collect evidence of hash values of the source code files to facilitate the Scribe integrity validation.

```bash
gensbom dir:<path> --scribe.clientid=$CLIENT_ID -P --scribe.clientsecret=$CLIENT_SECRET --scribe.productkey=$PRODUCT_KEY --scribe.loginurl=https://scribesecurity-beta.us.auth0.com --scribe.auth0.audience=api.beta.scribesecurity.com --scribe.url https://api.beta.scribesecurity.com -E -f -v
```

2. Call *gensbom* after the build to generate an *SBOM* from the docker image.

```bash
gensbom <your_docker_repository:tag> --scribe.clientid=$CLIENT_ID -P --scribe.clientsecret=$CLIENT_SECRET --scribe.productkey=$PRODUCT_KEY --scribe.loginurl=https://scribesecurity-beta.us.auth0.com --scribe.auth0.audience=api.beta.scribesecurity.com --scribe.url https://api.beta.scribesecurity.com -E -f -v
```