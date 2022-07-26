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

3. Run *gensbom* to collect metadata about the source code

    ```$HOME/.scribe/bin/gensbom bom dir:amberik-core --scribe.clientid=<client_id> --scribe.clientsecret=<client_secret> --name=scribe -E -f -v```

    Replace <client_id> and <client_secret> with the values from step 3 in the <a href='https://mui.production.scribesecurity.com/install-scribe'>Scribe installation instructions page</a>.  

4. Build a docker image for the project

    ```CD amberik-core```

    ```docker build -t amberik-core .```

5. Run *gensbom* to collect metadata about the docker image

    ```$HOME/.scribe/bin/gensbom bom amberik-core:latest --scribe.clientid=<client_id> --scribe.clientsecret=<client_secret> --name=scribe -E -f -v```

    Replace <client_id> and <client_secret> with the same values as in step 3, above (values appear in the <a href='https://mui.production.scribesecurity.com/install-scribe'>Scribe installation instructions page</a>).


6. When *gensbom* is done go to the <a href='https://mui.production.scribesecurity.com/install-scribe'>Scribe installation instructions web page</a> and click the **Done, View Results** button.
