---
sidebar_position: 4
---

# A Sample Project

You can try out Scribe with an open-source Node.js project at:  
https://github.com/scribe-security/image-demo

First you need to go to the Scribe Hub <a href='https://beta.hub.scribesecurity.com'>projects page</a> and add a `image-demo` project. Once you do, you'll get 3 forms of credentials: `clientid`, `clientsecret` and `productkey`.
Of the provided secrets, `clientid` and `clientsecret` are identical for all your future projects and `productkey` is unique for this particular project only. If you want to keep using these credentials for multiple projects we recommend you set them up as environment variables.

Here's an example for setting your `clientid` credential as an environment variable:
```
CLIENT_ID=<client_id>
```
Instead of `<client_id>` enter the `clientid` credential downloaded from the <a href='https://beta.hub.scribesecurity.com'>'add project'</a> page.

Now that you have set whatever environment variables you wanted, you can go ahead and download and use our *gensbom* CLI tool.

Copy and run the following commands in a bash shell on your workstation.
 
1. Get Scribe *gensbom* CLI tool

    ```curl https://www.scribesecurity.com/getscribe | sh```
 
2. Clone the project from GitHub

    ```git clone https://github.com/scribe-security/image-demo.git```

3. Run *gensbom* locally to collect metadata about the source code

    ```$HOME/.scribe/bin/gensbom dir:image-demo --scribe.clientid=<client_id> --scribe.clientsecret=<client_secret> --product-key=<product_key> -E -f -v```

    Replace <client_id>, <client_secret> and <product_key> with the values you receive once you submit your projct name and press 'add project' in the <a href='https://beta.hub.scribesecurity.com'>Scribe Hub installation instructions page</a> or use the environmental variables you set up earlier.  

4. Build a docker image for the project

    ```CD image-demo```

    ```docker build -t image-demo .```

5. Run *gensbom* locally to collect metadata about the docker image

    ```$HOME/.scribe/bin/gensbom image-demo:latest --scribe.clientid=<client_id> --scribe.clientsecret=<client_secret> --product-key=<product_key> -E -f -v```

    Replace <client_id>, <client_secret> and <product_key> with the values you receive once you submit your projct name and press 'add project' in the <a href='https://beta.hub.scribesecurity.com'>Scribe Hub installation instructions page</a> or use the environmental variables you set up earlier.  

6. When *gensbom* is done press the 'done' button at the bottom of the <a href='https://beta.hub.scribesecurity.com'>page</a> and you'll be taken to the product page to review the integrity information and *SBOM*.
