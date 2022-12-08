---
sidebar_position: 3
sidebar_label: Other CI systems
---

# Integrating Scribe with Other CI Systems

## Before you begin
Integrating Scribe Hub with Jenkins requires the following credentials that are found in the product setup dialog (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to **Home>Products>[$product]>Setup**)

* **product key**
* **client id**
* **client secret**

>Note that the product key is unique per product, while the client id and secret are unique for your account.

## Procedure
1. Download `gensbom`  
   * Open your *Unix* based command line interface (CLI), such as *bash*.  
   * Download the Scribe *gensbon* CLI tool   
      ```
      curl -sSfL http://get.scribesecurity.com/install.sh | sh -s -- -t gensbom
      ```
   * Download the Scribe *valint* CLI tool   
      ```
      curl http://get.scribesecurity.com/install.sh  | sh -s -- -t valint
      ```
2. Add the credentials to your CI system.
Here is an example for setting your *client id* credential as an environment variable:  
   ```js
   export CLIENT_ID=<client-id>
   export PRODUCT_KEY=<product-key>
   export CLIENT_SECRET=<client-secret>
   ```
   Replace <client_id> with the client id value you received from **Scribe Hub**. In the same way you can add the client secret and the product key as environment variables.

3. Call Scribe `gensbom` from your build script.
<!--- Copy from illustration -->
These are the two points for adding Scribe Hub code:
* **Source Code Checkout**: Calling `gensbom` at this point will collect evidence from the source code files hash values to facilitate the Scribe integrity validation. This is an important yet an ___optional___ point. 

```
$HOME/.scribe/bin/gensbom dir:<path> --product-key=$PRODUCT_KEY --scribe.client-id=$CLIENT_ID \
--scribe.client-secret=$CLIENT_SECRET -E -f -v
```

* **Final built image**: Generating SBOM right after the final Docker image is created. This is the main and ___mandatory___ point.  
```
   $HOME/.scribe/bin/gensbom <your_docker_repository:tag> --product-key=$PRODUCT_KEY \
--scribe.client-id=$CLIENT_ID --scribe.client-secret=$CLIENT_SECRET -E -f -v
```

4. Call Scribe `valint` from your build script. You would probably want to call it at the end of your pipeline, after all the other tests have passed/failed. You can choose to use the `Valint` report as an additional data point for a Build pass/fail decision. 

* ___Note___ that if you do not collect evidence about your source code using `Gensbom`, you cannot get integrity information about your code. You can get integrity information about your NPM dependencies regardless of localized evidence collection.   

```
$HOME/.scribe/bin/valint valint report --product-key=$PRODUCT_KEY --scribe.client-id=$CLIENT_ID \
--scribe.client-secret=$CLIENT_SECRET --output-directory scribe/valint -vv
```

