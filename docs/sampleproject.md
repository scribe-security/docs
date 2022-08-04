---
sidebar_position: 5
---

# A Sample Project

You can try out Scribe with an open-source Node.js project at:  
https://github.com/moyataka/amberik-core

Copy and run the following commands in a bash shell on your workstation.
 
1. Get Scribe *gensbom* CLI tool

    ```curl https://www.scribesecurity.com/getscribe | sh```
 
2. Clone the project from GitHub

    ```git clone https://github.com/moyataka/amberik-core.git```

3. Run *gensbom* locally to collect metadata about the source code

    ```$HOME/.scribe/bin/gensbom dir:amberik-core --scribe.clientid=<client_id> --scribe.clientsecret=<client_secret> --product-key=<project_key> --scribe.url=https://api.beta.scribesecurity.com --scribe.auth0.audience=api.beta.scribesecurity.com --scribe.loginurl=https://scribesecurity-beta.us.auth0.com -E -f -v```

    Replace <client_id>, <client_secret> and <project_key> with the values you receive once you submit your projct name and press 'add project' in the <a href='https://beta.hub.scribesecurity.com/producer-products'>Scribe Hub installation instructions page</a>.  

4. Build a docker image for the project

    ```CD amberik-core```

    ```docker build -t amberik-core .```

5. Run *gensbom* locally to collect metadata about the docker image

    ```$HOME/.scribe/bin/gensbom amberik-core:latest --scribe.clientid=<client_id> --scribe.clientsecret=<client_secret> --scribe.clientsecret=<client_secret> --product-key=<project_key> --scribe.url=https://api.beta.scribesecurity.com --scribe.auth0.audience=api.beta.scribesecurity.com --scribe.loginurl=https://scribesecurity-beta.us.auth0.com -E -f -v```

    Replace <client_id>, <client_secret> and <project_key> with the values you receive once you submit your projct name and press 'add project' in the <a href='https://beta.hub.scribesecurity.com/producer-products'>Scribe Hub installation instructions page</a>.  

6. When *gensbom* is done press the 'done' button at the bottom of the <a href='https://beta.hub.scribesecurity.com/producer-products'>page</a> and you'll be taken to the product page to review the integrity information and *SBOM*.
