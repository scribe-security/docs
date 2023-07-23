---
sidebar_label: "Generic CI integration"
title: Integrating Scribe with Other CI Systems
sidebar_position: 8
---

### Before you begin
Integrating Scribe Hub with a generic CI requires the following credentials that are found in the **Integrations** page. (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **integrations**)

* **Client ID**
* **Client Secret**

<img src='../../../../img/ci/integrations-secrets.jpg' alt='Scribe Integration Secrets' width='70%' min-width='400px'/>

### Procedure
1. Download `valint`  
   * Open your *Unix* based command line interface (CLI), such as *bash*.  
   * Download the Scribe *valint* CLI tool   
      ```
      curl -sSfL https://get.scribesecurity.com/install.sh  | sh -s -- -t valint
      ```
2. Add the credentials to your CI system.
Here is an example for setting your *client id* and *client secret* credentials as environment variables:  
   ```js
   export CLIENT-ID=<client_id>
   export CLIENT-SECRET=<client_secret>
   ```
   Replace <client_id> with the client id value you received from **Scribe Hub** and the same goes for the <client_secret> to set them up as environment variables. 

3. Add the other information needed like the app-logical-name, the app-version and other SBOM meta data:
   ```js
   export LOGICAL-APP-NAME=<demo-project>
   export APP-VERSION=<1.0.1>
   export AUTHOR-NAME=<John-Smith>
   export AUTHOR-EMAIL=<jhon@thiscompany.com>
   export AUTHOR-PHONE=<555-8426157>
   export SUPPLIER-NAME=<Scribe-Security>
   export SUPPLIER-URL=<www.scribesecurity.com>
   export SUPPLIER-EMAIL=<info@scribesecurity.com>
   export SUPPLIER-PHONE=<001-001-0011>
   ```

4. Call Scribe `valint` from your build script.
<!--- Copy from illustration -->
These are the two points for adding Scribe Hub code:
* **Source Code Checkout**: Calling `valint` at this point will collect evidence from the source code files hash values to facilitate the Scribe integrity validation. This is an important yet an ___optional___ point. 

```
$HOME/.scribe/bin/valint bom dir:<path> --scribe.client-id=$CLIENT-ID \
--scribe.client-secret=$CLIENT-SECRET -E -f -v \ 
--logical-app-name $LOGICAL-APP-NAME --app-version $APP-VERSION \
--author-name $AUTHOR-NAME --author-email AUTHOR-EMAIL --author-phone $AUTHOR-PHONE \
--supplier-name $SUPPLIER-NAME --supplier-url $SUPPLIER-URL --supplier-email $SUPPLIER-EMAIL \ 
--supplier-phone $SUPPLIER-PHONE
```

* **Final built image**: Generating SBOM right after the final Docker image is created. This is the main and ___mandatory___ point.  
```
   $HOME/.scribe/bin/valint bom <your_docker_repository:tag> --scribe.client-id=$CLIENT-ID \
   --scribe.client-secret=$CLIENT-SECRET -E -f -v \ 
   --logical-app-name $LOGICAL-APP-NAME --app-version $APP-VERSION \
   --author-name $AUTHOR-NAME --author-email AUTHOR-EMAIL --author-phone $AUTHOR-PHONE \
   --supplier-name $SUPPLIER-NAME --supplier-url $SUPPLIER-URL --supplier-email $SUPPLIER-EMAIL \ 
   --supplier-phone $SUPPLIER-PHONE
```

