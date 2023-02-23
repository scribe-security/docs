---
sidebar_position: 8
sidebar_label: Other CI systems
---

# Integrating Scribe with Other CI Systems

## Before you begin
Integrating Scribe Hub requires the following credentials that are found in the product setup dialog. (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **Home>Products>[$product]>Setup**)

* **Client ID**
* **Client Secret**
## Procedure
1. Download `valint`  
   * Open your *Unix* based command line interface (CLI), such as *bash*.  
   * Download the Scribe *valint* CLI tool   
      ```
      curl -sSfL https://get.scribesecurity.com/install.sh  | sh -s -- -t valint
      ```
2. Add the credentials to your CI system.
Here is an example for setting your *client id* and *client secret* credentials as environment variables:  
   ```js
   export CLIENT_ID=<client_id>
   export CLIENT_SECRET=<client_secret>
   ```
   Replace <client_id> with the client id value you received from **Scribe Hub** and the same goes for the <client_secret> to set them up as environment variables. 

3. Call Scribe `valint` from your build script.
<!--- Copy from illustration -->
These are the two points for adding Scribe Hub code:
* **Source Code Checkout**: Calling `valint` at this point will collect evidence from the source code files hash values to facilitate the Scribe integrity validation. This is an important yet an ___optional___ point. 

```
$HOME/.scribe/bin/valint bom dir:<path> --scribe.client-id=$CLIENT_ID \
--scribe.client-secret=$CLIENT_SECRET -E -f -v
```

* **Final built image**: Generating SBOM right after the final Docker image is created. This is the main and ___mandatory___ point.  
```
   $HOME/.scribe/bin/valint bom <your_docker_repository:tag> --scribe.client-id=$CLIENT_ID \
   --scribe.client-secret=$CLIENT_SECRET -E -f -v
```

