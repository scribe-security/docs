---
sidebar_position: 4
---

# A Sample Project

You can try out Scribe with an open-source Node.js project at:  
https://github.com/scribe-security/image-demo

:::info Note:
The configuration requires <em><b>product_key</b></em>, <em><b>clientid</b></em>, and <em><b>clientsecret</b></em> credentials obtained from your Scribe hub account at: `Home>Products>[$your_product]>Setup`

Or when you add a new product.
:::

Here's an example for setting your `clientid` credential as an environment variable:
```
export CLIENT_ID=<client_id>
```
Replace `<client_id>` with `clientid` from Scribe Hub.

Now that you have set whatever environment variables you wanted, you can go ahead and download and use our *gensbom* CLI tool.

Copy and run the following commands in a bash shell on your workstation.
 
1. Get Scribe *gensbom* CLI tool

    ```curl https://www.scribesecurity.com/getscribe | sh```
 
2. Clone the project from GitHub

    ```git clone https://github.com/scribe-security/image-demo.git```

3. Run *gensbom* locally to collect metadata about the source code

    ```$HOME/.scribe/bin/gensbom dir:image-demo --scribe.clientid=$CLIENT_ID --scribe.clientsecret=$CLIENT_SECRET --product-key=$PRODUCT_KEY --scribe.loginurl=https://scribesecurity-beta.us.auth0.com --scribe.auth0.audience=api.beta.scribesecurity.com --scribe.url https://api.beta.scribesecurity.com -E -f -v```

4. Build a docker image for the project

    ```CD image-demo```

    ```docker build -t image-demo .```

5. Run *gensbom* locally to collect metadata about the docker image

    ```$HOME/.scribe/bin/gensbom image-demo:latest --scribe.clientid=$CLIENT_ID --scribe.clientsecret=$CLIENT_SECRET --product-key=$PRODUCT_KEY --scribe.loginurl=https://scribesecurity-beta.us.auth0.com --scribe.auth0.audience=api.beta.scribesecurity.com --scribe.url https://api.beta.scribesecurity.com -E -f -v```

6. When *gensbom* is done press the 'done' button at the bottom of the <a href='https://beta.hub.scribesecurity.com'>page</a> and you'll be taken to the product page to review the integrity information and *SBOM*.
