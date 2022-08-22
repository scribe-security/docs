---
sidebar_position: 4
---

# A Sample Project

You can try out Scribe with an open-source Node.js project at:  
https://github.com/scribe-security/image-demo

:::info Note:
The configuration requires <em><b>product-key</b></em>, <em><b>client-id</b></em>, and <em><b>client-secret</b></em> credentials obtained from your Scribe hub account at: `Home>Products>[$your_product]>Setup`

Or when you add a new product.
:::

Here's an example for setting your `client-id` credential:
```
export CLIENT_ID=<client-id>
```
Replace `<client-id>` with `client-id` from Scribe Hub.

Now that you have set whatever environment variables you wanted, you can go ahead and download and use our *gensbom* CLI tool.

Copy and run the following commands in a bash shell on your workstation.
 
1. Get Scribe *gensbom* CLI tool

    ```curl -sSfL http://get.scribesecurity.com/install.sh | sh```
 
2. Clone the project from GitHub

    ```git clone https://github.com/scribe-security/image-demo.git```

3. Run *gensbom* locally to collect metadata about the source code

    ```$HOME/.scribe/bin/gensbom dir:image-demo --product-key=$PRODUCT_KEY --scribe.client-id=$CLIENT_ID --scribe.client-secret=$CLIENT_SECRET  --scribe.login-url=https://scribesecurity-beta.us.auth0.com --scribe.auth.audience=api.beta.scribesecurity.com --scribe.url https://api.beta.scribesecurity.com -E -f -v```

4. Build a docker image for the project

    ```cd image-demo```

    ```docker build -t image-demo .```

5. Run *gensbom* locally to collect metadata about the docker image

    ```$HOME/.scribe/bin/gensbom bom image-demo:latest --product-key=$PRODUCT_KEY --scribe.client-id=$CLIENT_ID --scribe.client-secret=$CLIENT_SECRET --scribe.login-url=https://scribesecurity-beta.us.auth0.com --scribe.auth.audience=api.beta.scribesecurity.com --scribe.url https://api.beta.scribesecurity.com -E -f -v```

6. When *gensbom* is done press the 'done' button at the bottom of the <a href='https://beta.hub.scribesecurity.com'>page</a> and you'll be taken to the product page to review the integrity information and *SBOM*.
