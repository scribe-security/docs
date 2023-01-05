---
sidebar_position: 4
sidebar_label: Sample Project
---

# Demo: Run valint on a Sample project
<!--- problem -  offer a demo to try out, assuming the person has a product?  --->
## Before you begin

Integrating Scribe Hub with Jenkins requires the following credentials that are found in the product setup dialog (In your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** go to Home>Products>[$product]>Setup). If you choose not to create a new product at this time you can use the credentials for the Demo Product present in you Products page.

* **product key**
* **client id**
* **client secret**

Note that the product key is unique per product, while the client id and secret are unique for your account.

## Run Valint on a Sample Project

Try out Scribe with our sample open-source Node.js project by following these steps: 

1. Go to `https://github.com/scribe-security/image-demo`.


1. Set the following keys with the corresponding credential values obtained from Scribe as environment variables:  
   ```js
   export CLIENT_ID=<client-id>
   export PRODUCT_KEY=<product-key>
   export CLIENT_SECRET=<client-secret>
   ```
   
1. Using a Shell-based CLI, download the `valint` CLI tool, created by Scribe:
   ```sh
   curl -sSfL https://get.scribesecurity.com/install.sh  | sh -s -- -t valint
   ```
1. Clone the sample project from GitHub  
      ```sh
      git clone https://github.com/scribe-security/image-demo.git
      ```

1. Run `valint` locally to collect hash value evidence of the source code files

      ```sh
      $HOME/.scribe/bin/valint bom dir:image-demo --product-key=$PRODUCT_KEY \
      --scribe.client-id=$CLIENT_ID \
      --scribe.client-secret=$CLIENT_SECRET -E -f -v
      ```

4. Build a Docker image for the project  
   ```sh
   cd image-demo
   docker build -t image-demo .
   ```

5. Run `valint` locally to collect hash value evidence about your docker image

    ```sh
    $HOME/.scribe/bin/valint bom image-demo:latest --product-key=$PRODUCT_KEY \
    --scribe.client-id=$CLIENT_ID \
    --scribe.client-secret=$CLIENT_SECRET -E -f -v  
    ```

6. When `valint` is done, check out your your **[Scribe Hub](https://prod.hub.scribesecurity.com/ "Scribe Hub Link")** Home>Products>[$product] page and you'll see a new build being updated. Clicking on that build will allow you to review the integrity information and SBOM for the new build you have just uploaded.
